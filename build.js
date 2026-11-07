// Baut die HTML-Seiten aus den Quellteilen in src/ zusammen.
//   node build.js
// Ergebnis:
//   docs/index.html                   Startseite, gegliedert nach Zweck, mit „Wo finde ich was?“
//   docs/meridian-spire-plaene.html   eigenständige Seite (im Browser öffnen)
//   docs/meridian-spire-3d.html       3-D-Ansicht der Ebenen (Three.js kommt vom CDN)
//   docs/feuerprobe-runner.html       eigenständige Seite
//   docs/feuerprobe-runner-bogen.html Spielerbögen, ein Runner pro A4 (PDFs: node tools/make-pdf.js)
//   docs/feuerprobe-leitfaden.html    SL-Leitfaden durch den Run mit NPC-Dossiers
//   docs/feuerprobe-regeln.html       Cheat-Sheets für Spieler und SL (Kampf, Magie, Matrix, Grundregeln)
//   docs/feuerprobe-oneshot.html      das Abenteuer aus oneshot/*.md als lesbare Seite
//   docs/drucken.html                 Druckmappen (SL-Mappe, Spielerpaket) und alle PDFs
//   docs/search-index.js              Suchindex für die Suche in der Navigationsleiste
//   docs/artifact/*.html              Fragment ohne <html>/<head>/<body> für claude.ai-Artifacts (ohne Navigationsleiste)
// Jede volle Seite in docs/ bekommt die gemeinsame Navigationsleiste aus src/shared/.
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const pages = [
  {
    // Startseite: Inhalte nach Zweck (Vorbereiten, Am Tisch, Austeilen & Drucken)
    name: 'index', nav: 'start', artifact: false,
    dir: 'src/start',
    html: ['s1_head.html', 's2_body.html'],
    js: ['s3_app.js'],
  },
  {
    name: 'meridian-spire-plaene', nav: 'plans',
    dir: 'src/plaene',
    html: ['p1_head.html', 'p2_body.html'],
    js: ['p3_render.js', 'p4_111.js', 'p5_112.js', 'p6_dach.js', 'p7_110.js', 'p8_garage.js', 'p9_schnitt.js', 'p11_en_dict.js', 'p12_en_111_112.js', 'p13_en_dach_110.js', 'p14_en_garage_schnitt.js', 'p10_app.js'],
  },
  {
    // 3-D-Ansicht der Ebenen aus denselben Plandaten (Three.js vom CDN)
    name: 'meridian-spire-3d', nav: 'plans3d',
    dir: 'src/plan3d',
    html: ['d1_head.html', 'd2_body.html'],
    js: ['../plaene/p4_111.js', '../plaene/p5_112.js', '../plaene/p6_dach.js', '../plaene/p7_110.js', '../plaene/p8_garage.js', '../plaene/p11_en_dict.js', '../plaene/p12_en_111_112.js', '../plaene/p13_en_dach_110.js', '../plaene/p14_en_garage_schnitt.js', 'd3_app.js'],
  },
  {
    name: 'feuerprobe-runner', nav: 'runner',
    dir: 'src/runner',
    html: ['r1_head.html', 'r2_body.html'],
    js: ['r3_data_a.js', 'r4_data_b.js', 'r3b_en_a.js', 'r4b_en_b.js', 'r5_app.js'],
  },
  {
    // Spielerbögen: gleiche Runner-Daten, eigenes Layout (ein Runner pro A4)
    name: 'feuerprobe-runner-bogen', nav: 'sheets',
    dir: 'src/bogen',
    html: ['b1_head.html', 'b2_body.html'],
    js: ['../runner/r3_data_a.js', '../runner/r4_data_b.js', '../runner/r3b_en_a.js', '../runner/r4b_en_b.js', 'b3_app.js'],
  },
  {
    // SL-Leitfaden: Ablauf des Runs, NPCs mit Porträts, Alert Clock, Payoff-Rechner
    name: 'feuerprobe-leitfaden', nav: 'guide',
    dir: 'src/leitfaden',
    html: ['l1_head.html', 'l2_body.html'],
    js: ['l3_de.js', 'l4_en.js', 'l5_app.js'],
    // Feste NPC-Porträts: jede Datei in img/ wird als data:-URI eingebettet (Schlüssel = Dateiname = NPC-id)
    portraits: 'img',
  },
  {
    // Cheat-Sheets: Grundregeln, Kampf, Magie, Matrix/Alert für Spieler und SL, je Sheet eine A4-Seite
    name: 'feuerprobe-regeln', nav: 'rules',
    dir: 'src/regeln',
    html: ['g1_head.html', 'g2_body.html'],
    js: ['g3_de.js', 'g4_en.js', 'g5_app.js'],
  },
  {
    // Druckseite: SL-Mappe und Spielerpaket, Teile-Checkliste; Seitenzahlen aus docs/pdf/manifest.js
    name: 'drucken', nav: 'print', artifact: false,
    dir: 'src/drucken',
    html: ['k1_head.html', 'k2_body.html'],
    js: ['k0_mappen.js', 'k3_app.js'],
  },
];

const read = (dir, file) => fs.readFileSync(path.join(__dirname, dir, file), 'utf8');
const portraitsJs = (dir) => {
  const mime = { '.webp': 'image/webp', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.png': 'image/png' };
  const entries = fs.readdirSync(path.join(__dirname, dir))
    .filter((f) => mime[path.extname(f).toLowerCase()])
    .map((f) => {
      const ext = path.extname(f).toLowerCase();
      const b64 = fs.readFileSync(path.join(__dirname, dir, f)).toString('base64');
      return `  ${JSON.stringify(path.basename(f, ext))}: 'data:${mime[ext]};base64,${b64}'`;
    });
  return 'const PORTRAITS = {\n' + entries.join(',\n') + '\n};\n';
};

// Gemeinsame Navigationsleiste: Stil in den <head>, Leiste + Skript direkt nach <body>
const navCss = read('src/shared', 'nav.css');
const navJs = read('src/shared', 'nav.js');
const withNav = (html, id) => html
  .replace('</head>', '<style>\n' + navCss + '</style>\n</head>')
  .replace(/<body([^>]*)>/, (m) => m + `\n<nav class="fpnav" id="fpnav" data-page="${id}" aria-label="Feuerprobe"></nav>\n<script>\n${navJs}</script>`);

fs.mkdirSync(path.join(__dirname, 'docs', 'artifact'), { recursive: true });

for (const p of pages) {
  const fragment =
    p.html.map((f) => read(p.dir, f)).join('\n') +
    '\n<script>\n' +
    (p.portraits ? portraitsJs(path.join(p.dir, p.portraits)) : '') +
    p.js.map((f) => read(p.dir, f)).join('\n') +
    '\n</script>\n';
  if (p.artifact !== false) fs.writeFileSync(path.join(__dirname, 'docs', 'artifact', p.name + '.html'), fragment);

  const cut = fragment.indexOf('</style>') + '</style>'.length;
  const head = fragment.slice(0, cut);
  const body = fragment.slice(cut);
  const doc =
    '<!doctype html>\n<html lang="de">\n<head>\n<meta charset="utf-8">\n' +
    '<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">\n' +
    head + '\n</head>\n<body>\n' + body + '\n</body>\n</html>\n';
  fs.writeFileSync(path.join(__dirname, 'docs', p.name + '.html'), withNav(doc, p.nav));
  console.log('gebaut:', 'docs/' + p.name + '.html');
}

// Das Abenteuer: Markdown → HTML, damit es auch online (GitHub Pages) lesbar ist.
const md2html = require('./tools/md2html');
const mdPath = path.join(__dirname, 'oneshot', 'Shadowrun_Feuerprobe_OneShot_v5.md');
const mdText = fs.readFileSync(mdPath, 'utf8');
fs.writeFileSync(path.join(__dirname, 'docs', 'feuerprobe-oneshot.html'), withNav(md2html.page(mdText, {
  eyebrow: 'Shadowrun · Feuerprobe · Runners in the Shadows · Oneshot-Text',
  links: [],
  fine: 'Fan-Material für den privaten Spieltisch. <i>Runners in the Shadows</i> ist ein Spiel von Mark Cleveland Massengale; <i>Shadowrun</i> ist eine Marke von The Topps Company / Catalyst Game Labs. Quelle: <code>oneshot/Shadowrun_Feuerprobe_OneShot_v5.md</code>.',
}), 'run'));
console.log('gebaut: docs/feuerprobe-oneshot.html');

// ---------- Suchindex ----------
// Die Datendateien sind reine const-Deklarationen; sie werden in einer Sandbox ausgewertet und flach indexiert.
// Eintrag: {l:'de'|'en'|'*', k:Kategorie, t:Titel, s:Kurztext, x:weiterer Suchtext, u:URL, gm:nur SL, w:Zusatzgewicht}
const load = (dir, files, names) => vm.runInNewContext(files.map((f) => read(dir, f)).join('\n') + `\n;({${names}})`, {});
const strip = (s) => String(s ?? '').replace(/<[^>]+>/g, ' ').replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&').replace(/\s+/g, ' ').trim();
const cutTo = (s, n) => { s = strip(s); return s.length > n ? s.slice(0, n).replace(/\s+\S*$/, '') + ' …' : s; };
const flat = (v) => (Array.isArray(v) ? v.map(flat).join(' ') : v && typeof v === 'object' ? Object.values(v).map(flat).join(' ') : typeof v === 'string' ? v : '');
const idx = [];
const add = (e) => { e.s = cutTo(e.s, 150); e.x = cutTo(e.x, 600); if (!e.x) delete e.x; if (!e.s) delete e.s; if (!e.gm) delete e.gm; idx.push(e); };

// Seiten selbst
[
  ['de', 'Pläne 2D', 'Grundrisse aller Ebenen: Schnitt, Tiefgarage, 111, 112, Dach, 110 · Wege · Spielsituationen', 'meridian-spire-plaene.html', 'karte grundriss map'],
  ['de', 'Pläne 3D', 'Die Ebenen in 3-D: drehen, zoomen, begehen, Patrouillen, Nachtmodus', 'meridian-spire-3d.html', 'karte dreidimensional begehen walk'],
  ['de', 'SL-Leitfaden', 'Der Run Schritt für Schritt mit NPCs, Alert Clock und Payoff-Rechner', 'feuerprobe-leitfaden.html', 'spielleitung ablauf'],
  ['de', 'Runner-Dossiers', 'Acht vorgefertigte Runner mit Werten und SL-Notizen', 'feuerprobe-runner.html', 'charaktere figuren'],
  ['de', 'Runnerbögen', 'Spielerbögen zum Austeilen, ein Runner pro A4', 'feuerprobe-runner-bogen.html', 'charakterbogen ausdrucken'],
  ['de', 'Cheat-Sheets', 'Regeln zum Nachschlagen: Grundregeln, Kampf, Magie, Matrix, Alert', 'feuerprobe-regeln.html', 'regeln spickzettel'],
  ['de', 'Der Run (Text)', 'Der vollständige Oneshot-Text', 'feuerprobe-oneshot.html', 'abenteuer oneshot'],
  ['de', 'Drucken', 'SL-Mappe und Spielerpaket als PDF, Einzel-PDFs, Drucktipps', 'drucken.html', 'pdf druck mappe ausdruck'],
  ['en', 'Plans 2D', 'Floor plans of every level: section, parking garage, 111, 112, roof, 110 · routes · play situations', 'meridian-spire-plaene.html', 'map'],
  ['en', 'Plans 3D', 'The levels in 3D: rotate, zoom, walk, patrols, night mode', 'meridian-spire-3d.html', 'map walk'],
  ['en', 'GM guide', 'The run step by step with NPCs, alert clock and payoff calculator', 'feuerprobe-leitfaden.html', 'game master'],
  ['en', 'Runner dossiers', 'Eight pregenerated runners with stats and GM notes', 'feuerprobe-runner.html', 'characters'],
  ['en', 'Runner sheets', 'Player handout sheets, one runner per A4 page', 'feuerprobe-runner-bogen.html', 'character sheet'],
  ['en', 'Cheat sheets', 'Rules at a glance: core rules, combat, magic, Matrix, alert', 'feuerprobe-regeln.html', 'rules'],
  ['en', 'The run (text)', 'The complete one-shot text (German only)', 'feuerprobe-oneshot.html', 'adventure'],
  ['en', 'Print', 'GM binder and player pack as PDF, single PDFs, print tips', 'drucken.html', 'pdf binder'],
].forEach(([l, t, s, u, x]) => add({ l, k: 'page', t, s, x, u, w: 6 }));

// Pläne: Orte, Wege, vertikale Verbindungen
const P = load('src/plaene', ['p4_111.js', 'p5_112.js', 'p6_dach.js', 'p7_110.js', 'p8_garage.js', 'p9_schnitt.js', 'p11_en_dict.js', 'p12_en_111_112.js', 'p13_en_dach_110.js', 'p14_en_garage_schnitt.js'], 'LSCHNITT,LGARAGE,L111,L112,LDACH,L110,PLAN_EN');
const EN = P.PLAN_EN;
for (const L of [P.LGARAGE, P.L111, P.L112, P.LDACH, P.L110]) {
  const lvl = { de: L.name, en: (EN.dict && EN.dict[L.name]) || EN.ui.tabs[L.id] || L.name };
  for (const s of L.spots || []) {
    const u = `meridian-spire-plaene.html?level=${L.id}&spot=${s.n}`;
    add({ l: 'de', k: 'plan', t: `${s.t}`, s: `${lvl.de} · ${s.n} · ${s.p || ''}`, x: [s.p, s.g].join(' '), u, gm: !!s.gm });
    const e = Object.assign({}, s, (EN.spots[L.id] || {})[s.n] || {});
    add({ l: 'en', k: 'plan', t: `${e.t}`, s: `${lvl.en} · ${s.n} · ${e.p || ''}`, x: [e.p, e.g].join(' '), u, gm: !!s.gm });
  }
  for (const r of L.routeText || []) {
    const u = `meridian-spire-plaene.html?level=${L.id}`;
    add({ l: 'de', k: 'route', t: `${r.id}: ${r.t}`, s: `${lvl.de} · ${r.d}`, u, gm: !!r.gm });
    const e = Object.assign({}, r, (EN.routes[L.id] || {})[r.id] || {});
    add({ l: 'en', k: 'route', t: `${r.id}: ${e.t}`, s: `${lvl.en} · ${e.d}`, u, gm: !!r.gm });
  }
}
const trd = (s) => (EN.dict && EN.dict[s]) || s;
for (const k of P.LSCHNITT.cons || []) {
  const u = 'meridian-spire-plaene.html?level=schnitt';
  add({ l: 'de', k: 'route', t: `V${k.n}: ${k.name}`, s: `${k.from} → ${k.to} · ${k.who} · ${k.cost}`, u, gm: !!k.gm });
  add({ l: 'en', k: 'route', t: `V${k.n}: ${trd(k.name)}`, s: `${trd(k.from)} → ${trd(k.to)} · ${trd(k.who)} · ${trd(k.cost)}`, u, gm: !!k.gm });
}

// Leitfaden: Kapitel, Zwischenüberschriften, Kacheln, NPCs
const G = load('src/leitfaden', ['l3_de.js', 'l4_en.js'], 'GUIDE_DE,GUIDE_EN');
for (const [l, D] of [['de', G.GUIDE_DE], ['en', G.GUIDE_EN]]) {
  const u0 = 'feuerprobe-leitfaden.html';
  for (const n of D.npcs || []) add({ l, k: 'npc', t: n.name, s: n.role, x: [flat(n.tags), n.bio, flat(n.look)].join(' '), u: `${u0}#npc-${n.id}`, gm: true, w: 3 });
  for (const ch of D.chapters || []) {
    const u = `${u0}#${ch.id}`;
    add({ l, k: 'chapter', t: [ch.num, ch.title].filter(Boolean).join(' · '), s: ch.lead, x: flat(ch.blocks), u, gm: true, w: 2 });
    for (const b of ch.blocks || []) {
      if (b[0] === 'h3') add({ l, k: 'chapter', t: strip(b[1]), s: ch.title, u, gm: true });
      if (b[0] === 'tiles') for (const tl of b[2] || []) if (tl.h) add({ l, k: 'chapter', t: strip(tl.h), s: `${ch.title} · ${strip(tl.p)}`, x: flat(tl.ul), u, gm: true });
      if (b[0] === 'note' && b[2]) add({ l, k: 'chapter', t: strip(b[2]), s: `${ch.title} · ${strip(b[3])}`, u, gm: true });
    }
  }
}

// Runner: Straßenname, Playbook, Rolle, Fähigkeiten
const R = load('src/runner', ['r3_data_a.js', 'r4_data_b.js', 'r3b_en_a.js', 'r4b_en_b.js'], 'RUNNERS,EN');
for (const r of R.RUNNERS) {
  const u = `feuerprobe-runner.html#${r.id}`;
  const abil = (r.abilities || []).map((a) => a.n).join(' · ');
  add({ l: 'de', k: 'runner', t: `${r.street} · ${r.pb}`, s: r.role, x: [r.meta, r.pbDesc, abil, r.look, r.feel].join(' '), u, w: 4 });
  const e = Object.assign({}, r, R.EN[r.id] || {});
  add({ l: 'en', k: 'runner', t: `${e.street} · ${r.pb}`, s: e.role, x: [e.meta, e.pbDesc, abil, e.look, e.feel].join(' '), u, w: 4 });
}

// Cheat-Sheets: Sheets und Kästen
const S = load('src/regeln', ['g3_de.js', 'g4_en.js'], 'SHEETS_DE,SHEETS_EN');
for (const [l, D] of [['de', S.SHEETS_DE], ['en', S.SHEETS_EN]]) {
  for (const sh of D.sheets || []) {
    const u = `feuerprobe-regeln.html?aud=all#${sh.id}`;
    const gm = sh.aud === 'gm';
    add({ l, k: 'rule', t: sh.title, s: sh.lead, x: (sh.boxes || []).map((b) => b.h).join(' · '), u, gm, w: 3 });
    for (const b of sh.boxes || []) add({ l, k: 'rule', t: strip(b.h), s: `${sh.title}${b.sm ? ' · ' + strip(b.sm) : ''}`, x: flat(b.b), u, gm });
  }
}

// Der Run: Überschriften des Oneshot-Texts (nur Deutsch, in beiden Sprachen auffindbar)
{
  const { html } = md2html.render(mdText);
  const re = /<h([234]) id="([^"]+)">([\s\S]*?)<\/h\1>([\s\S]*?)(?=<h[234] id=|$)/g;
  let m;
  while ((m = re.exec(html))) add({ l: '*', k: 'run', t: strip(m[3]), s: strip(m[4]), x: strip(m[4]), u: `feuerprobe-oneshot.html#${m[2]}`, gm: true });
}

const idxJs = '/* Von build.js erzeugt: Suchindex für die Navigationsleiste. Nicht von Hand bearbeiten. */\nwindow.FP_INDEX=' + JSON.stringify(idx) + ';\n';
fs.writeFileSync(path.join(__dirname, 'docs', 'search-index.js'), idxJs);
console.log('gebaut: docs/search-index.js (' + idx.length + ' Einträge, ' + Math.round(idxJs.length / 1024) + ' KB)');
