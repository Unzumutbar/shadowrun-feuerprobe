// Baut die beiden HTML-Seiten aus den Quellteilen in src/ zusammen.
//   node build.js
// Ergebnis:
//   docs/meridian-spire-plaene.html   eigenständige Seite (im Browser öffnen)
//   docs/feuerprobe-runner.html       eigenständige Seite
//   docs/feuerprobe-runner-bogen.html Spielerbögen, ein Runner pro A4 (PDFs: node tools/make-pdf.js)
//   docs/feuerprobe-leitfaden.html    SL-Leitfaden durch den Run mit NPC-Dossiers
//   docs/feuerprobe-regeln.html       Cheat-Sheets für Spieler und SL (Kampf, Magie, Matrix, Grundregeln)
//   docs/feuerprobe-oneshot.html      das Abenteuer aus oneshot/*.md als lesbare Seite
//   docs/artifact/*.html              Fragment ohne <html>/<head>/<body> für claude.ai-Artifacts
const fs = require('fs');
const path = require('path');

const pages = [
  {
    name: 'meridian-spire-plaene',
    dir: 'src/plaene',
    html: ['p1_head.html', 'p2_body.html'],
    js: ['p3_render.js', 'p4_111.js', 'p5_112.js', 'p6_dach.js', 'p7_110.js', 'p8_garage.js', 'p9_schnitt.js', 'p11_en_dict.js', 'p12_en_111_112.js', 'p13_en_dach_110.js', 'p14_en_garage_schnitt.js', 'p10_app.js'],
  },
  {
    name: 'feuerprobe-runner',
    dir: 'src/runner',
    html: ['r1_head.html', 'r2_body.html'],
    js: ['r3_data_a.js', 'r4_data_b.js', 'r3b_en_a.js', 'r4b_en_b.js', 'r5_app.js'],
  },
  {
    // Spielerbögen: gleiche Runner-Daten, eigenes Layout (ein Runner pro A4)
    name: 'feuerprobe-runner-bogen',
    dir: 'src/bogen',
    html: ['b1_head.html', 'b2_body.html'],
    js: ['../runner/r3_data_a.js', '../runner/r4_data_b.js', '../runner/r3b_en_a.js', '../runner/r4b_en_b.js', 'b3_app.js'],
  },
  {
    // SL-Leitfaden: Ablauf des Runs, NPCs mit Porträt-Platzhaltern, Alert Clock, Payoff-Rechner
    name: 'feuerprobe-leitfaden',
    dir: 'src/leitfaden',
    html: ['l1_head.html', 'l2_body.html'],
    js: ['l3_de.js', 'l4_en.js', 'l5_app.js'],
  },
  {
    // Cheat-Sheets: Grundregeln, Kampf, Magie, Matrix/Alert für Spieler und SL, je Sheet eine A4-Seite
    name: 'feuerprobe-regeln',
    dir: 'src/regeln',
    html: ['g1_head.html', 'g2_body.html'],
    js: ['g3_de.js', 'g4_en.js', 'g5_app.js'],
  },
];

const read = (dir, file) => fs.readFileSync(path.join(__dirname, dir, file), 'utf8');
fs.mkdirSync(path.join(__dirname, 'docs', 'artifact'), { recursive: true });

for (const p of pages) {
  const fragment =
    p.html.map((f) => read(p.dir, f)).join('\n') +
    '\n<script>\n' +
    p.js.map((f) => read(p.dir, f)).join('\n') +
    '\n</script>\n';
  fs.writeFileSync(path.join(__dirname, 'docs', 'artifact', p.name + '.html'), fragment);

  const cut = fragment.indexOf('</style>') + '</style>'.length;
  const head = fragment.slice(0, cut);
  const body = fragment.slice(cut);
  const doc =
    '<!doctype html>\n<html lang="de">\n<head>\n<meta charset="utf-8">\n' +
    '<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">\n' +
    head + '\n</head>\n<body>\n' + body + '\n</body>\n</html>\n';
  fs.writeFileSync(path.join(__dirname, 'docs', p.name + '.html'), doc);
  console.log('gebaut:', 'docs/' + p.name + '.html');
}

// Das Abenteuer: Markdown → HTML, damit es auch online (GitHub Pages) lesbar ist.
const md2html = require('./tools/md2html');
const mdPath = path.join(__dirname, 'oneshot', 'Shadowrun_Feuerprobe_OneShot_v5.md');
fs.writeFileSync(path.join(__dirname, 'docs', 'feuerprobe-oneshot.html'), md2html.page(fs.readFileSync(mdPath, 'utf8'), {
  eyebrow: 'Shadowrun · Feuerprobe · Runners in the Shadows · Oneshot-Text',
  links: [{ href: 'index.html', text: 'Startseite' }, { href: 'feuerprobe-leitfaden.html?lang=de', text: 'SL-Leitfaden' }, { href: 'meridian-spire-plaene.html?lang=de', text: 'Pläne' }],
  fine: 'Fan-Material für den privaten Spieltisch. <i>Runners in the Shadows</i> ist ein Spiel von Mark Cleveland Massengale; <i>Shadowrun</i> ist eine Marke von The Topps Company / Catalyst Game Labs. Quelle: <code>oneshot/Shadowrun_Feuerprobe_OneShot_v5.md</code>.',
}));
console.log('gebaut: docs/feuerprobe-oneshot.html');
