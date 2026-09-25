// Sucht für jedes Cheat-Sheet die größte Druckschrift, bei der es auf genau eine A4-Seite passt,
// und schreibt das Ergebnis in PRINT_K in src/regeln/g5_app.js. Geprüft wird Deutsch und Englisch;
// es gilt der kleinere Wert. Danach: node build.js && node tools/make-pdf.js sheets
//   node tools/fit-sheets.js
const { spawnSync } = require('child_process');
const fs = require('fs');
const os = require('os');
const path = require('path');

const candidates = [
  'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
  'C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe',
  'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
  'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
  '/usr/bin/google-chrome', '/usr/bin/chromium', '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
];
const exe = candidates.find((p) => fs.existsSync(p));
if (!exe) { console.error('Kein Edge oder Chrome gefunden.'); process.exit(1); }

const root = path.join(__dirname, '..');
const page = path.join(root, 'docs', 'feuerprobe-regeln.html');
if (!fs.existsSync(page)) { console.error('docs/feuerprobe-regeln.html fehlt. Erst: node build.js'); process.exit(1); }
const url = 'file:///' + page.replace(/\\/g, '/');
const ids = [...fs.readFileSync(path.join(root, 'src', 'regeln', 'g3_de.js'), 'utf8').matchAll(/\{id:'([^']+)',aud:/g)].map((m) => m[1]);
const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'feuerprobe-fit-'));
const sleep = (ms) => { const end = Date.now() + ms; while (Date.now() < end) { /* warten */ } };

function pages(id, lang, k) {
  const file = path.join(tmp, `${id}-${lang}-${k}.pdf`);
  spawnSync(exe, [
    '--headless=new', '--disable-gpu', '--no-first-run', '--no-default-browser-check', '--disable-extensions',
    '--user-data-dir=' + path.join(tmp, 'profile-' + id + '-' + lang + '-' + k),
    '--run-all-compositor-stages-before-draw', '--virtual-time-budget=8000', '--no-pdf-header-footer',
    '--print-to-pdf=' + file, `${url}?lang=${lang}&sheet=${id}&k=${k}`,
  ], { stdio: 'pipe', timeout: 120000 });
  let waited = 0;
  while (!fs.existsSync(file) && waited < 20000) { sleep(300); waited += 300; }
  const pdf = fs.readFileSync(file, 'latin1');
  return Math.max(0, ...[...pdf.matchAll(/\/Count (\d+)/g)].map((m) => +m[1]));
}

// Binärsuche in Schritten von 0.02 zwischen 1.00 und 1.60
const result = {};
for (const id of ids) {
  let best = 2;
  for (const lang of ['de', 'en']) {
    let lo = 50, hi = 80; // k × 50
    if (pages(id, lang, (lo / 50).toFixed(2)) > 1) { best = Math.min(best, 1); console.log(id, lang, 'passt selbst bei 1.00 nicht!'); continue; }
    while (lo < hi) {
      const mid = Math.ceil((lo + hi) / 2);
      if (pages(id, lang, (mid / 50).toFixed(2)) === 1) lo = mid; else hi = mid - 1;
    }
    best = Math.min(best, (lo - 1) / 50); // eine Stufe Sicherheitsabstand
    console.log(id, lang, (lo / 50).toFixed(2));
  }
  result[id] = +best.toFixed(2);
}
const appPath = path.join(root, 'src', 'regeln', 'g5_app.js');
const line = 'const PRINT_K={' + ids.map((id) => (/^[a-z]+$/.test(id) ? id : `'${id}'`) + ':' + result[id]).join(',') + '};';
fs.writeFileSync(appPath, fs.readFileSync(appPath, 'utf8').replace(/^const PRINT_K=.*$/m, line));
console.log('geschrieben:', line);
fs.rmSync(tmp, { recursive: true, force: true });
