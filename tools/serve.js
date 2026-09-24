// Kleiner statischer Server für docs/ (nur zum lokalen Ansehen; die Seiten laufen auch ohne Server).
//   node tools/serve.js [port]   →  http://localhost:8765/
const http = require('http');
const port = Number(process.argv[2]) || 8765;
const fs = require('fs');
const path = require('path');
const root = path.join(__dirname, '..', 'docs');
const types = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript', '.css': 'text/css', '.md': 'text/markdown; charset=utf-8', '.pdf': 'application/pdf' };
http.createServer((req, res) => {
  let u = decodeURIComponent(req.url.split('?')[0]);
  if (u === '/') u = '/index.html';
  const fp = path.normalize(path.join(root, u));
  if (!fp.startsWith(root)) { res.writeHead(403); res.end(); return; }
  fs.readFile(fp, (err, data) => {
    if (err) { res.writeHead(404); res.end('not found'); return; }
    res.writeHead(200, { 'Content-Type': types[path.extname(fp)] || 'application/octet-stream', 'Cache-Control': 'no-store' });
    res.end(data);
  });
}).listen(port, () => console.log('docs/ unter http://localhost:' + port + '/'));
