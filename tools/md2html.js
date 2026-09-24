// Wandelt das Abenteuer-Markdown in eine lesbare HTML-Seite um (für docs/ und GitHub Pages).
// Unterstützt: Überschriften, Absätze, Listen, Tabellen, Zitate, Trennlinien, Fett/Kursiv/Code, Zeilenumbrüche.
const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
function inline(s) {
  return esc(s)
    .replace(/`([^`]+)`/g, '<code>$1</code>')
    .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
    .replace(/(^|[\s(„>])\*([^*\n]+)\*(?=[\s.,;:!?)“]|$)/g, '$1<em>$2</em>')
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>')
    .replace(/ {2,}$/gm, '<br>');
}
const slug = (s) => s.toLowerCase().replace(/<[^>]+>/g, '').replace(/[^a-z0-9äöüß]+/g, '-').replace(/^-|-$/g, '');

function render(md) {
  const lines = md.replace(/\r\n/g, '\n').split('\n');
  const out = [];
  const toc = [];
  let title = '';
  let i = 0;
  const isTableSep = (l) => /^\|?\s*:?-{2,}:?\s*(\|\s*:?-{2,}:?\s*)*\|?\s*$/.test(l);
  while (i < lines.length) {
    let l = lines[i];
    if (!l.trim()) { i++; continue; }
    let m;
    if ((m = l.match(/^(#{1,6})\s+(.*)$/))) {
      let lvl = m[1].length;
      const text = m[2].trim();
      if (!title) { title = text; i++; continue; }              // erste H1 = Seitentitel
      if (lvl === 2 && /^\d+\.\s/.test(text)) lvl = 1;           // „## 1. Kurzfassung“ wie die anderen Kapitel behandeln
      const id = slug(text);
      if (lvl === 1) toc.push({ id, text });
      out.push(`<h${lvl + 1} id="${id}">${inline(text)}</h${lvl + 1}>`);
      i++; continue;
    }
    if (/^-{3,}\s*$/.test(l)) { out.push('<hr>'); i++; continue; }
    if (/^>/.test(l)) {
      const q = [];
      while (i < lines.length && /^>/.test(lines[i])) { q.push(lines[i].replace(/^>\s?/, '')); i++; }
      out.push('<blockquote>' + render(q.join('\n')).html + '</blockquote>');
      continue;
    }
    if (/^\|/.test(l) && i + 1 < lines.length && isTableSep(lines[i + 1])) {
      const cells = (row) => row.trim().replace(/^\||\|$/g, '').split('|').map((c) => c.trim());
      const head = cells(l);
      const align = cells(lines[i + 1]).map((c) => (/^:?-+:$/.test(c) ? ' class="r"' : ''));
      i += 2;
      const rows = [];
      while (i < lines.length && /^\|/.test(lines[i])) { rows.push(cells(lines[i])); i++; }
      out.push('<table><thead><tr>' + head.map((h, k) => `<th${align[k] || ''}>${inline(h)}</th>`).join('') + '</tr></thead><tbody>' +
        rows.map((r) => '<tr>' + r.map((c, k) => `<td${align[k] || ''}>${inline(c)}</td>`).join('') + '</tr>').join('') + '</tbody></table>');
      continue;
    }
    if (/^[-*]\s+/.test(l) || /^\d+\.\s+/.test(l)) {
      const ordered = /^\d+\.\s+/.test(l);
      const re = ordered ? /^\d+\.\s+/ : /^[-*]\s+/;
      const items = [];
      while (i < lines.length && re.test(lines[i])) {
        let item = lines[i].replace(re, ''); i++;
        while (i < lines.length && /^\s{2,}\S/.test(lines[i]) && !re.test(lines[i])) { item += ' ' + lines[i].trim(); i++; }
        items.push(`<li>${inline(item)}</li>`);
      }
      out.push(`<${ordered ? 'ol' : 'ul'}>${items.join('')}</${ordered ? 'ol' : 'ul'}>`);
      continue;
    }
    const p = [];
    while (i < lines.length && lines[i].trim() && !/^(#{1,6}\s|>|\||[-*]\s|\d+\.\s|-{3,}\s*$)/.test(lines[i])) { p.push(lines[i]); i++; }
    out.push(`<p>${inline(p.join('\n'))}</p>`);
  }
  return { title, toc, html: out.join('\n') };
}

function page(md, opts = {}) {
  const { title, toc, html } = render(md);
  const t = opts.title || title;
  return `<!doctype html>
<html lang="de">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>${esc(t)}</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@600;700&family=IBM+Plex+Sans:ital,wght@0,400;0,500;0,600;1,400&family=IBM+Plex+Mono:wght@400;500&display=swap">
<style>
:root{--bg:#E4E8EC;--surface:#FBFBFC;--surface-2:#F0F2F5;--ink:#161C26;--ink-2:#3C4756;--muted:#66717F;--line:#CBD1D8;--line-2:#AEB7C1;--accent:#0F7B86;--accent-soft:rgba(15,123,134,.12);--gm:#8A3FB3;--gm-soft:rgba(138,63,179,.08)}
@media (prefers-color-scheme:dark){:root{color-scheme:dark;--bg:#0D1218;--surface:#151B23;--surface-2:#1B222C;--ink:#E7EBF0;--ink-2:#C4CCD6;--muted:#8E9AA9;--line:#293441;--line-2:#3B4756;--accent:#3FC1CC;--accent-soft:rgba(63,193,204,.16);--gm:#CD85FF;--gm-soft:rgba(205,133,255,.1)}}
*{box-sizing:border-box}
html{scroll-behavior:smooth;scroll-padding-top:16px}
body{margin:0;background:var(--bg);color:var(--ink);font:15.5px/1.6 "IBM Plex Sans",system-ui,sans-serif;-webkit-font-smoothing:antialiased}
.wrap{max-width:1180px;margin:0 auto;padding:20px 16px 56px}
header.top{display:flex;flex-wrap:wrap;gap:12px 28px;align-items:flex-end;justify-content:space-between;padding-bottom:18px;border-bottom:1px solid var(--line)}
.eyebrow{font:11.5px "IBM Plex Mono",monospace;letter-spacing:.12em;text-transform:uppercase;color:var(--muted)}
h1{font:700 clamp(34px,5vw,50px)/.95 "Barlow Condensed",sans-serif;margin:4px 0 0}
.tog a{border:1px solid var(--line-2);background:var(--surface);color:var(--ink);font:500 13px/1 "IBM Plex Sans",sans-serif;padding:8px 12px;border-radius:999px;text-decoration:none;display:inline-block}
.layout{display:grid;gap:24px;margin-top:22px;align-items:start}
@media (min-width:1000px){.layout{grid-template-columns:280px minmax(0,1fr)}.toc{position:sticky;top:14px;max-height:calc(100vh - 28px);overflow:auto}}
.toc{background:var(--surface);border:1px solid var(--line);border-radius:14px;padding:14px 16px;font-size:13.5px}
.toc h2{font:600 11.5px "IBM Plex Mono",monospace;letter-spacing:.12em;text-transform:uppercase;color:var(--muted);margin:0 0 8px}
.toc ol{margin:0;padding-left:0;list-style:none;display:grid;gap:2px}
.toc a{display:block;padding:4px 8px;border-radius:7px;color:var(--ink-2);text-decoration:none}
.toc a:hover{background:var(--surface-2)}
article{background:var(--surface);border:1px solid var(--line);border-radius:14px;padding:24px 28px 32px;min-width:0}
article h2{font:700 30px/1.05 "Barlow Condensed",sans-serif;margin:34px 0 10px;padding-top:22px;border-top:1px solid var(--line);scroll-margin-top:16px}
article h2:first-child{margin-top:0;padding-top:0;border-top:0}
article h3{font:700 21px/1.1 "Barlow Condensed",sans-serif;margin:22px 0 6px}
article h4{font:600 12px "IBM Plex Mono",monospace;letter-spacing:.12em;text-transform:uppercase;color:var(--muted);margin:16px 0 6px}
article p,article li{color:var(--ink-2);max-width:76ch}
article p{margin:0 0 12px}
article strong{color:var(--ink);font-weight:600}
article code{font:500 .9em "IBM Plex Mono",monospace;background:var(--surface-2);padding:1px 5px;border-radius:4px;color:var(--ink)}
article ul,article ol{margin:0 0 12px;padding-left:22px;display:grid;gap:4px}
article li::marker{color:var(--accent)}
article blockquote{margin:12px 0 14px;padding:12px 16px;border-left:3px solid var(--gm);background:var(--gm-soft);border-radius:0 10px 10px 0;max-width:76ch}
article blockquote p{margin:0;color:var(--ink)}
article blockquote p+p{margin-top:8px}
article hr{display:none}
article table{border-collapse:collapse;width:100%;max-width:76ch;font-size:14px;margin:8px 0 14px}
article th{text-align:left;font:600 11px "IBM Plex Mono",monospace;letter-spacing:.1em;text-transform:uppercase;color:var(--muted);padding:6px 8px;border-bottom:1px solid var(--line-2)}
article td{padding:7px 8px;border-bottom:1px solid var(--line);vertical-align:top;color:var(--ink-2)}
article td:first-child{color:var(--ink);font-weight:600}
article .r{text-align:right;font-family:"IBM Plex Mono",monospace;font-size:13px;white-space:nowrap}
.fine{font-size:12.5px;color:var(--muted);margin-top:22px;max-width:90ch}
@media print{@page{size:A4;margin:14mm}body{background:#fff;font-size:11pt}.toc,.tog{display:none}.layout{display:block}article{border:0;padding:0}article h2{break-after:avoid}article blockquote,article table{break-inside:avoid}}
</style>
</head>
<body>
<div class="wrap">
<header class="top">
  <div><div class="eyebrow">${esc(opts.eyebrow || '')}</div><h1>${inline(t)}</h1></div>
  <div class="tog">${(opts.links || []).map((l) => `<a href="${l.href}">${esc(l.text)}</a>`).join(' ')}</div>
</header>
<div class="layout">
<nav class="toc"><h2>Inhalt</h2><ol>${toc.map((x) => `<li><a href="#${x.id}">${inline(x.text)}</a></li>`).join('')}</ol></nav>
<article>
${html}
</article>
</div>
<p class="fine">${opts.fine || ''}</p>
</div>
</body>
</html>
`;
}

module.exports = { render, page };
