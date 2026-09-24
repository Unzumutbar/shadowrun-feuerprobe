// Erzeugt PDFs der Spielerbögen mit Edge oder Chrome im Headless-Modus, auf Deutsch und Englisch.
//   node tools/make-pdf.js                 → docs/pdf/de/*.pdf und docs/pdf/en/*.pdf
//   node tools/make-pdf.js en              → nur Englisch
//   node tools/make-pdf.js de mercer ravn  → nur diese Bögen auf Deutsch
// Vorher: node build.js
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
if (!exe) { console.error('Kein Edge oder Chrome gefunden. Bitte die Seite im Browser öffnen und mit Strg+P drucken.'); process.exit(1); }

const page = path.join(__dirname, '..', 'docs', 'feuerprobe-runner-bogen.html');
if (!fs.existsSync(page)) { console.error('docs/feuerprobe-runner-bogen.html fehlt. Erst: node build.js'); process.exit(1); }
const url = 'file:///' + page.replace(/\\/g, '/');
const profile = path.join(os.tmpdir(), 'feuerprobe-pdf-profile');

const all = ['mercer', 'chamaeleon', 'kessel', 'zephyr', 'bastion', 'fizz', 'stille', 'ravn'];
const args = process.argv.slice(2);
const langs = args.filter((a) => a === 'de' || a === 'en');
const ids = args.filter((a) => a !== 'de' && a !== 'en');
const jobsLang = langs.length ? langs : ['de', 'en'];
const jobsId = ids.length ? ids : ['alle', ...all];
const names = {
  de: { all: 'feuerprobe-runner-alle.pdf', one: (id) => 'bogen-' + id + '.pdf' },
  en: { all: 'feuerprobe-runners-all.pdf', one: (id) => 'sheet-' + id + '.pdf' },
};

// Jeder Aufruf bekommt ein eigenes Profilverzeichnis: Sonst reicht Edge den Auftrag an eine noch
// laufende Instanz weiter und kehrt sofort zurück, bevor die Datei geschrieben ist.
const sleep = (ms) => { const end = Date.now() + ms; while (Date.now() < end) { /* warten */ } };
for (const lang of jobsLang) {
  const outDir = path.join(__dirname, '..', 'docs', 'pdf', lang);
  fs.mkdirSync(outDir, { recursive: true });
  for (const id of jobsId) {
    const file = path.join(outDir, id === 'alle' ? names[lang].all : names[lang].one(id));
    const target = url + '?lang=' + lang + (id === 'alle' ? '' : '#' + id);
    if (fs.existsSync(file)) fs.unlinkSync(file);
    const r = spawnSync(exe, [
      '--headless=new', '--disable-gpu', '--no-first-run', '--no-default-browser-check',
      '--disable-extensions', '--disable-background-networking', '--disable-crash-reporter',
      '--user-data-dir=' + profile + '-' + lang + '-' + id,
      '--run-all-compositor-stages-before-draw', '--virtual-time-budget=12000',
      '--no-pdf-header-footer', '--print-to-pdf=' + file, target,
    ], { stdio: 'pipe', timeout: 120000 });
    let waited = 0;
    while (!fs.existsSync(file) && waited < 30000) { sleep(500); waited += 500; }
    const ok = fs.existsSync(file) && fs.statSync(file).size > 1000;
    console.log((ok ? 'PDF: ' : 'FEHLER: ') + path.relative(process.cwd(), file) + (ok ? ' (' + Math.round(fs.statSync(file).size / 1024) + ' KB)' : ' exit ' + r.status + ' ' + String(r.stderr || '').slice(0, 200)));
  }
}
for (const d of fs.readdirSync(os.tmpdir())) { if (d.startsWith('feuerprobe-pdf-profile')) { try { fs.rmSync(path.join(os.tmpdir(), d), { recursive: true, force: true }); } catch (e) { /* egal */ } } }
