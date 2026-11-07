// Erzeugt die PDFs mit Edge oder Chrome im Headless-Modus, auf Deutsch und Englisch, und fügt daraus
// die beiden Druckmappen zusammen (SL-Mappe, Spielerpaket; braucht pdf-lib: einmal `npm install`).
//   node tools/make-pdf.js                 → alles: docs/pdf/de/*.pdf und docs/pdf/en/*.pdf, dann Mappen
//   node tools/make-pdf.js en              → nur Englisch
//   node tools/make-pdf.js de mercer ravn  → nur diese Spielerbögen auf Deutsch
//   node tools/make-pdf.js plans           → nur die Plan-PDFs        (weitere Gruppen: sheets = Cheat-Sheets,
//   node tools/make-pdf.js mappen          → nur die Gesamt-PDFs aus     boegen, guide, dossiers, oneshot;
//                                             den vorhandenen Teilen     mehrere Gruppen lassen sich kombinieren)
// Am Ende entsteht docs/pdf/manifest.js (Seitenzahl, Größe, Format je PDF) für docs/drucken.html.
// Vorher: node build.js
const { spawnSync } = require('child_process');
const fs = require('fs');
const os = require('os');
const path = require('path');
const vm = require('vm');

const root = path.join(__dirname, '..');
const docs = path.join(root, 'docs');
const candidates = [
  'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
  'C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe',
  'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
  'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
  '/usr/bin/google-chrome', '/usr/bin/chromium', '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
];
const exe = candidates.find((p) => fs.existsSync(p));
const fileUrl = (name) => 'file:///' + path.join(docs, name).replace(/\\/g, '/');
const profile = path.join(os.tmpdir(), 'feuerprobe-pdf-profile');

const all = ['mercer', 'chamaeleon', 'kessel', 'zephyr', 'bastion', 'fizz', 'stille', 'ravn'];
const GROUPS = ['boegen', 'plans', 'sheets', 'guide', 'dossiers', 'oneshot', 'mappen'];
const args = process.argv.slice(2);
const langs = args.filter((a) => a === 'de' || a === 'en');
const groupsAsked = args.filter((a) => GROUPS.includes(a));
const ids = args.filter((a) => a !== 'de' && a !== 'en' && !GROUPS.includes(a));
const unknown = ids.filter((id) => !all.includes(id));
if (unknown.length) { console.error('Unbekannt: ' + unknown.join(', ') + '. Gruppen: ' + GROUPS.join(', ') + '; Runner: ' + all.join(', ')); process.exit(1); }
const jobsLang = langs.length ? langs : ['de', 'en'];
// Runner-ids allein → nur diese Bögen; sonst die genannten Gruppen; ohne Angaben alles
const groups = new Set(ids.length ? ['boegen', ...groupsAsked] : groupsAsked.length ? groupsAsked : GROUPS);
const jobsId = ids.length ? ids : ['alle', ...all];

const sleep = (ms) => { const end = Date.now() + ms; while (Date.now() < end) { /* warten */ } };
// Ein Druckauftrag. Jeder Aufruf bekommt ein eigenes Profilverzeichnis: Sonst reicht Edge den Auftrag an eine
// noch laufende Instanz weiter und kehrt sofort zurück, bevor die Datei geschrieben ist.
let failures = 0;
function printToPdf(url, file, tag, budget = 12000) {
  if (!exe) { console.error('Kein Edge oder Chrome gefunden. Bitte die Seite im Browser öffnen und mit Strg+P drucken.'); process.exit(1); }
  fs.mkdirSync(path.dirname(file), { recursive: true });
  if (fs.existsSync(file)) fs.unlinkSync(file);
  const r = spawnSync(exe, [
    '--headless=new', '--disable-gpu', '--no-first-run', '--no-default-browser-check',
    '--disable-extensions', '--disable-background-networking', '--disable-crash-reporter',
    '--user-data-dir=' + profile + '-' + tag,
    '--run-all-compositor-stages-before-draw', '--virtual-time-budget=' + budget,
    '--no-pdf-header-footer', '--print-to-pdf=' + file, url,
  ], { stdio: 'pipe', timeout: 180000 });
  let waited = 0;
  while (!fs.existsSync(file) && waited < 40000) { sleep(500); waited += 500; }
  const ok = fs.existsSync(file) && fs.statSync(file).size > 1000;
  if (!ok) failures++;
  console.log((ok ? 'PDF: ' : 'FEHLER: ') + path.relative(process.cwd(), file) + (ok ? ' (' + Math.round(fs.statSync(file).size / 1024) + ' KB)' : ' exit ' + r.status + ' ' + String(r.stderr || '').slice(0, 200)));
}
const need = (name) => { if (!fs.existsSync(path.join(docs, name))) { console.error('docs/' + name + ' fehlt. Erst: node build.js'); process.exit(1); } };
const out = (lang, name) => path.join(docs, 'pdf', lang, name);

// Mappen-Definition aus src/drucken/k0_mappen.js (gleiche Quelle wie die Druckseite)
const { MAPPEN } = vm.runInNewContext(fs.readFileSync(path.join(root, 'src', 'drucken', 'k0_mappen.js'), 'utf8') + '\n;({MAPPEN})', {});
const partFile = (id, lang) => { for (const M of Object.values(MAPPEN)) for (const p of M.parts) if (p.id === id) return p.file[lang]; return null; };

for (const lang of jobsLang) {
  // Spielerbögen: alle in einer PDF und einzeln
  if (groups.has('boegen')) {
    need('feuerprobe-runner-bogen.html');
    const names = { de: { all: 'feuerprobe-runner-alle.pdf', one: (id) => 'bogen-' + id + '.pdf' }, en: { all: 'feuerprobe-runners-all.pdf', one: (id) => 'sheet-' + id + '.pdf' } };
    for (const id of jobsId) {
      printToPdf(fileUrl('feuerprobe-runner-bogen.html') + '?lang=' + lang + (id === 'alle' ? '' : '#' + id),
        out(lang, id === 'alle' ? names[lang].all : names[lang].one(id)), lang + '-' + id);
    }
  }
  // Pläne: SL- und Spielerversion (Druckansicht der Plan-Seite)
  if (groups.has('plans')) {
    need('meridian-spire-plaene.html');
    for (const v of ['gm', 'player']) printToPdf(fileUrl('meridian-spire-plaene.html') + '?print=' + v + '&lang=' + lang, out(lang, partFile('plans-' + v, lang)), 'plan-' + lang + '-' + v, 15000);
  }
  // Cheat-Sheets: Spieler- und SL-Version, jedes Sheet eine A4-Seite
  if (groups.has('sheets')) {
    need('feuerprobe-regeln.html');
    for (const v of ['player', 'gm']) printToPdf(fileUrl('feuerprobe-regeln.html') + '?aud=' + v + '&lang=' + lang, out(lang, partFile('rules-' + v, lang)), 'rules-' + lang + '-' + v);
  }
  // SL-Leitfaden (Druckfassung: alle Antworten aufgeklappt)
  if (groups.has('guide')) {
    need('feuerprobe-leitfaden.html');
    printToPdf(fileUrl('feuerprobe-leitfaden.html') + '?print=1&lang=' + lang, out(lang, partFile('guide', lang)), 'guide-' + lang, 20000);
  }
  // Runner-Dossiers mit SL-Notizen und Spieltipps
  if (groups.has('dossiers')) {
    need('feuerprobe-runner.html');
    printToPdf(fileUrl('feuerprobe-runner.html') + '?print=1&lang=' + lang, out(lang, partFile('dossiers', lang)), 'dossiers-' + lang, 15000);
  }
  // Der Run: Oneshot-Text (nur Deutsch)
  if (groups.has('oneshot') && partFile('run', lang)) {
    need('feuerprobe-oneshot.html');
    printToPdf(fileUrl('feuerprobe-oneshot.html'), out(lang, partFile('run', lang)), 'run-' + lang);
  }
}

// ---------- Gesamt-PDFs und Manifest (pdf-lib) ----------
let pdfLib = null;
try { pdfLib = require('pdf-lib'); } catch (e) { /* nicht installiert */ }

async function cover(doc, font, bold, M, lang, parts) {
  const page = doc.insertPage(0, [595.28, 841.89]);
  const cs = new Set(font.getCharacterSet());
  const safe = (s) => [...String(s)].map((c) => (cs.has(c.codePointAt(0)) ? c : c === '→' ? '>' : '-')).join('');
  const { rgb } = pdfLib;
  const ink = rgb(0.09, 0.11, 0.15), muted = rgb(0.4, 0.44, 0.5), acc = M === MAPPEN.gm ? rgb(0.54, 0.25, 0.7) : rgb(0.06, 0.48, 0.53);
  const L = 56, W = 595.28 - 2 * L;
  const text = (s, x, y, size, f = font, color = ink) => page.drawText(safe(s), { x, y, size, font: f, color });
  const wrap = (s, size, f, width) => { const words = safe(s).split(' '); const lines = []; let cur = '';
    for (const w of words) { const t = cur ? cur + ' ' + w : w; if (f.widthOfTextAtSize(t, size) > width && cur) { lines.push(cur); cur = w; } else cur = t; }
    if (cur) lines.push(cur); return lines; };
  page.drawRectangle({ x: 0, y: 841.89 - 14, width: 595.28, height: 14, color: acc });
  let y = 760;
  text('SHADOWRUN  ·  FEUERPROBE  ·  RUNNERS IN THE SHADOWS', L, y, 9, font, muted); y -= 46;
  text(M.t[lang], L, y, 40, bold); y -= 26;
  for (const ln of wrap(M.d[lang], 12, font, W)) { text(ln, L, y, 12, font, muted); y -= 17; }
  y -= 26;
  text(lang === 'de' ? 'INHALT' : 'CONTENTS', L, y, 9, bold, muted); y -= 8;
  page.drawLine({ start: { x: L, y }, end: { x: L + W, y }, thickness: 0.6, color: muted }); y -= 24;
  for (const p of parts) {
    const pg = (lang === 'de' ? 'S. ' : 'p. ') + p.start + (p.pages > 1 ? '–' + (p.start + p.pages - 1) : '');
    text(p.t[lang], L, y, 14, bold);
    text(pg, L + W - font.widthOfTextAtSize(safe(pg), 11), y + 1, 11, font, muted); y -= 16;
    const meta = `${p.n[lang]}  ·  ${p.land ? (lang === 'de' ? 'A4 quer' : 'A4 landscape') : (lang === 'de' ? 'A4 hoch' : 'A4 portrait')}  ·  ${p.copies[lang]}`;
    for (const ln of wrap(meta, 10, font, W)) { text(ln, L, y, 10, font, muted); y -= 13; }
    y -= 14;
  }
  const fine = lang === 'de'
    ? 'Fan-Material für den privaten Spieltisch. Runners in the Shadows ist ein Spiel von Mark Cleveland Massengale; Shadowrun ist eine Marke von The Topps Company / Catalyst Game Labs.'
    : 'Fan material for the private gaming table. Runners in the Shadows is a game by Mark Cleveland Massengale; Shadowrun is a trademark of The Topps Company / Catalyst Game Labs.';
  let fy = 64;
  for (const ln of wrap(fine, 8, font, W)) { text(ln, L, fy, 8, font, muted); fy -= 11; }
}

function outline(doc, items) {
  const { PDFName, PDFHexString, PDFNumber } = pdfLib;
  const ctx = doc.context, pages = doc.getPages();
  const top = ctx.nextRef(), refs = items.map(() => ctx.nextRef());
  items.forEach((it, i) => {
    const d = ctx.obj({});
    d.set(PDFName.of('Title'), PDFHexString.fromText(it.title));
    d.set(PDFName.of('Parent'), top);
    d.set(PDFName.of('Dest'), ctx.obj([pages[it.page].ref, PDFName.of('Fit')]));
    if (i > 0) d.set(PDFName.of('Prev'), refs[i - 1]);
    if (i < items.length - 1) d.set(PDFName.of('Next'), refs[i + 1]);
    ctx.assign(refs[i], d);
  });
  const o = ctx.obj({});
  o.set(PDFName.of('Type'), PDFName.of('Outlines'));
  o.set(PDFName.of('First'), refs[0]); o.set(PDFName.of('Last'), refs[refs.length - 1]); o.set(PDFName.of('Count'), PDFNumber.of(items.length));
  ctx.assign(top, o);
  doc.catalog.set(PDFName.of('Outlines'), top);
  doc.catalog.set(PDFName.of('PageMode'), PDFName.of('UseOutlines'));
}

async function binder(M, lang) {
  const { PDFDocument, StandardFonts, rgb } = pdfLib;
  const doc = await PDFDocument.create();
  const font = await doc.embedFont(StandardFonts.Helvetica), bold = await doc.embedFont(StandardFonts.HelveticaBold);
  const parts = [];
  for (const p of M.parts) {
    const f = p.file[lang]; if (!f) continue;
    const src = out(lang, f);
    if (!fs.existsSync(src)) { console.log('FEHLT für ' + M.file[lang] + ': ' + path.relative(process.cwd(), src)); failures++; continue; }
    const part = await PDFDocument.load(fs.readFileSync(src));
    const copied = await doc.copyPages(part, part.getPageIndices());
    parts.push(Object.assign({}, p, { start: doc.getPageCount() + 2, pages: copied.length }));
    copied.forEach((pg) => doc.addPage(pg));
  }
  if (!parts.length) return;
  await cover(doc, font, bold, M, lang, parts);
  // Fußzeile mit Mappe und Seitenzahl, klein in den unteren Rand
  const total = doc.getPageCount();
  doc.getPages().forEach((pg, i) => {
    if (i === 0) return;
    const s = `Feuerprobe · ${M.t[lang]} · ${i + 1}/${total}`;
    const w = font.widthOfTextAtSize(s, 6.5);
    pg.drawText(s, { x: pg.getWidth() - w - 16, y: 11, size: 6.5, font, color: rgb(0.45, 0.48, 0.53) });
  });
  outline(doc, [{ title: lang === 'de' ? 'Deckblatt' : 'Cover', page: 0 }, ...parts.map((p) => ({ title: p.t[lang], page: p.start - 1 }))]);
  doc.setTitle(`Feuerprobe · ${M.t[lang]}`); doc.setAuthor('Feuerprobe'); doc.setSubject(M.d[lang]);
  const file = out(lang, M.file[lang]);
  fs.writeFileSync(file, await doc.save());
  console.log('Mappe: ' + path.relative(process.cwd(), file) + ' (' + total + ' Seiten, ' + Math.round(fs.statSync(file).size / 1024) + ' KB)');
}

async function manifest() {
  const { PDFDocument } = pdfLib;
  const m = {};
  for (const lang of ['de', 'en']) {
    const dir = path.join(docs, 'pdf', lang);
    if (!fs.existsSync(dir)) continue;
    for (const f of fs.readdirSync(dir).filter((x) => x.endsWith('.pdf')).sort()) {
      const buf = fs.readFileSync(path.join(dir, f));
      const d = await PDFDocument.load(buf, { updateMetadata: false });
      const p0 = d.getPage(0);
      m[lang + '/' + f] = { pages: d.getPageCount(), kb: Math.round(buf.length / 1024), land: p0.getWidth() > p0.getHeight() };
    }
  }
  const js = '/* Von tools/make-pdf.js erzeugt: Seitenzahl, Größe und Format jeder PDF für docs/drucken.html. */\nwindow.FP_PDFS=' + JSON.stringify(m, null, 0) + ';\n';
  fs.writeFileSync(path.join(docs, 'pdf', 'manifest.js'), js);
  console.log('Manifest: docs/pdf/manifest.js (' + Object.keys(m).length + ' PDFs)');
}

(async () => {
  if (!pdfLib) {
    console.log('Hinweis: pdf-lib fehlt (npm install). Gesamt-PDFs und docs/pdf/manifest.js werden nicht erzeugt.');
  } else {
    if (groups.has('mappen')) for (const lang of jobsLang) for (const M of Object.values(MAPPEN)) await binder(M, lang);
    await manifest();
  }
  for (const d of fs.readdirSync(os.tmpdir())) { if (d.startsWith('feuerprobe-pdf-profile')) { try { fs.rmSync(path.join(os.tmpdir(), d), { recursive: true, force: true }); } catch (e) { /* egal */ } } }
  if (failures) { console.log(failures + ' Fehler.'); process.exitCode = 1; }
})();
