const http=require('http'),fs=require('fs'),path=require('path');
const root=__dirname;
http.createServer((req,res)=>{
  let u=decodeURIComponent(req.url.split('?')[0]);if(u==='/')u='/preview.html';
  const fp=path.join(root,u);
  fs.readFile(fp,(e,d)=>{if(e){res.writeHead(404);res.end('not found');return;}
    res.writeHead(200,{'Content-Type':fp.endsWith('.html')?'text/html; charset=utf-8':'application/octet-stream','Cache-Control':'no-store'});res.end(d);});
}).listen(8765,()=>console.log('serving '+root+' on 8765'));
