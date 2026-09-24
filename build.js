// Baut die beiden HTML-Seiten aus den Quellteilen in src/ zusammen.
//   node build.js
// Ergebnis:
//   docs/meridian-spire-plaene.html   eigenständige Seite (im Browser öffnen)
//   docs/feuerprobe-runner.html       eigenständige Seite
//   docs/feuerprobe-runner-bogen.html Spielerbögen, ein Runner pro A4 (PDFs: node tools/make-pdf.js)
//   docs/artifact/*.html              Fragment ohne <html>/<head>/<body> für claude.ai-Artifacts
const fs = require('fs');
const path = require('path');

const pages = [
  {
    name: 'meridian-spire-plaene',
    dir: 'src/plaene',
    html: ['p1_head.html', 'p2_body.html'],
    js: ['p3_render.js', 'p4_111.js', 'p5_112.js', 'p6_dach.js', 'p7_110.js', 'p8_garage.js', 'p9_schnitt.js', 'p10_app.js'],
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
