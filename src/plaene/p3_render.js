/* ---------- SVG renderer ---------- */
let lang='de';
function tr(s){if(lang!=='en'||!s||typeof PLAN_EN==='undefined')return s;return PLAN_EN.dict[s]??s;}
const NS='http://www.w3.org/2000/svg';
function el(tag,attrs,parent){const e=document.createElementNS(NS,tag);if(attrs)for(const k in attrs){if(k==='text')e.textContent=attrs[k];else if(attrs[k]!==undefined&&attrs[k]!==null)e.setAttribute(k,attrs[k]);}if(parent)parent.appendChild(e);return e;}
function grp(parent,cls){return el('g',cls?{class:cls}:{},parent);}
function rcol(c){return `var(--r-${c})`;}
let uid=0;
function seeded(s){let x=s||1;return()=>{x=(x*1103515245+12345)&0x7fffffff;return x/0x7fffffff;};}

function token(parent,cls,x,y,r,letter,gm){
  const t=grp(parent,'tok '+(gm?'gm':''));
  el('circle',{cx:x,cy:y,r:r,class:cls},t);
  if(letter)el('text',{x:x,y:y,class:'tok-t',text:letter},t);
  return t;
}
function cam(parent,x,y,a,len,spread,gm){
  const c=grp(parent,gm?'gm':'');
  const a1=(a-spread)*Math.PI/180,a2=(a+spread)*Math.PI/180;
  el('path',{d:`M${x} ${y} L${x+Math.cos(a1)*len} ${y+Math.sin(a1)*len} A${len} ${len} 0 0 1 ${x+Math.cos(a2)*len} ${y+Math.sin(a2)*len} Z`,class:'cone'},c);
  el('circle',{cx:x,cy:y,r:4,class:'cam'},c);
  return c;
}
function hexPts(x,y,r){let p=[];for(let i=0;i<6;i++){const a=Math.PI/6+i*Math.PI/3;p.push((x+Math.cos(a)*r).toFixed(1)+','+(y+Math.sin(a)*r).toFixed(1));}return p.join(' ');}
function starPath(x,y,r){let d='';for(let i=0;i<10;i++){const rr=i%2?r*0.45:r;const a=-Math.PI/2+i*Math.PI/5;d+=(i?'L':'M')+(x+Math.cos(a)*rr).toFixed(1)+' '+(y+Math.sin(a)*rr).toFixed(1);}return d+'Z';}

function drawItem(it,layers,id){
  const {gFurn,gSens,gPeople}=layers;
  const gm=it.gm?' gm':'';
  switch(it.k){
    case 'cam': cam(gSens,it.x,it.y,it.a??0,it.len??60,it.spread??24,it.gm); break;
    case 'guard': token(gPeople,'guard',it.x,it.y,7,'S',it.gm); break;
    case 'kade': token(gPeople,'kade',it.x,it.y,7.5,'K',it.gm); break;
    case 'venn': token(gPeople,'venn',it.x,it.y,7.5,'V',it.gm); break;
    case 'staff': token(gPeople,'staff',it.x,it.y,5.5,it.t||'',it.gm); break;
    case 'guests': {const rnd=seeded(it.seed||7);const gg=grp(gPeople,'guest'+gm);for(let i=0;i<(it.n||12);i++){el('circle',{cx:it.x+rnd()*it.w,cy:it.y+rnd()*it.h,r:2.8,class:'guest'},gg);}break;}
    case 'droneR': {const s=5;el('polygon',{points:`${it.x},${it.y-s} ${it.x+s},${it.y} ${it.x},${it.y+s} ${it.x-s},${it.y}`,class:'droneR'+gm},gPeople);break;}
    case 'droneW': el('polygon',{points:hexPts(it.x,it.y,8),class:'droneW'+gm},gPeople); break;
    case 'beam': el('line',{x1:it.x1,y1:it.y1,x2:it.x2,y2:it.y2,class:'beam'+gm},gSens); break;
    case 'plate': el('rect',{x:it.x,y:it.y,width:it.w,height:it.h,class:'plate-s'+gm,fill:`url(#${id}hS)`},gSens); break;
    case 'motion': {const r=it.r||34,a=(it.a||0)*Math.PI/180,sp=(it.spread||40)*Math.PI/180;el('path',{d:`M${it.x} ${it.y} L${it.x+Math.cos(a-sp)*r} ${it.y+Math.sin(a-sp)*r} A${r} ${r} 0 0 1 ${it.x+Math.cos(a+sp)*r} ${it.y+Math.sin(a+sp)*r} Z`,class:'motion'+gm},gSens);break;}
    case 'rfid': {const g2=grp(gSens,'rfid'+gm);el('path',{d:`M${it.x+6} ${it.y} H${it.x} V${it.y+it.h} H${it.x+6}`},g2);el('path',{d:`M${it.x+it.w-6} ${it.y} H${it.x+it.w} V${it.y+it.h} H${it.x+it.w-6}`},g2);break;}
    case 'blind': {const g2=grp(gSens,'gm');el('rect',{x:it.x,y:it.y,width:it.w,height:it.h,class:'blind',fill:`url(#${id}hB)`},g2);if(it.lbl)el('text',{x:it.x+it.w/2,y:it.y+it.h/2+3,class:'blind-t',text:it.lbl},g2);break;}
    case 'watcher': el('polygon',{points:it.pts.map(p=>p.join(',')).join(' '),class:'watcher'+gm},gSens); break;
    case 'barrier': el('rect',{x:it.x,y:it.y,width:it.w,height:it.h,class:'barrier'+gm},gSens); break;
    case 'duct': {el('polyline',{points:it.pts.map(p=>p.join(',')).join(' '),class:'duct'+gm},gFurn);el('polyline',{points:it.pts.map(p=>p.join(',')).join(' '),class:'duct2'+gm},gFurn);break;}
    case 'grille': {const g2=grp(gFurn,'glyph'+gm);el('rect',{x:it.x-5,y:it.y-7,width:10,height:14},g2);for(let i=-4;i<=4;i+=4)el('line',{x1:it.x-5,y1:it.y+i,x2:it.x+5,y2:it.y+i},g2);break;}
    case 'lift': {const g2=grp(gFurn,'glyph'+gm);el('line',{x1:it.x+4,y1:it.y+4,x2:it.x+it.w-4,y2:it.y+it.h-4},g2);el('line',{x1:it.x+it.w-4,y1:it.y+4,x2:it.x+4,y2:it.y+it.h-4},g2);break;}
    case 'stair': {const g2=grp(gFurn,'glyph'+gm);const v=it.dir!=='h';const n=Math.floor((v?it.h:it.w)/8);for(let i=1;i<n;i++){if(v)el('line',{x1:it.x+3,y1:it.y+i*8,x2:it.x+it.w-3,y2:it.y+i*8},g2);else el('line',{x1:it.x+i*8,y1:it.y+3,x2:it.x+i*8,y2:it.y+it.h-3},g2);}
      const cx=it.x+it.w/2,cy=it.y+it.h/2;if(v){el('line',{x1:cx,y1:it.y+6,x2:cx,y2:it.y+it.h-6,class:'arrow-r','marker-end':`url(#${id}arI)`},g2);}else{el('line',{x1:it.x+6,y1:cy,x2:it.x+it.w-6,y2:cy,class:'arrow-r','marker-end':`url(#${id}arI)`},g2);}break;}
    case 'shaft': {const g2=grp(gFurn,'glyph'+gm);el('rect',{x:it.x,y:it.y,width:it.w,height:it.h,fill:`url(#${id}hB)`,stroke:'none'},g2);break;}
    case 'spiral': {const g2=grp(gFurn,'glyph'+gm);el('circle',{cx:it.x,cy:it.y,r:it.r},g2);el('circle',{cx:it.x,cy:it.y,r:it.r*0.55},g2);el('circle',{cx:it.x,cy:it.y,r:3,class:'glyph-fill'},g2);for(let i=0;i<8;i++){const a=i*Math.PI/4;el('line',{x1:it.x+Math.cos(a)*3,y1:it.y+Math.sin(a)*3,x2:it.x+Math.cos(a)*it.r,y2:it.y+Math.sin(a)*it.r},g2);}break;}
    case 'ladder': {const g2=grp(gFurn,'glyph'+gm);const L=it.len||30;if(it.dir==='h'){el('line',{x1:it.x,y1:it.y-4,x2:it.x+L,y2:it.y-4},g2);el('line',{x1:it.x,y1:it.y+4,x2:it.x+L,y2:it.y+4},g2);for(let i=0;i<=L;i+=6)el('line',{x1:it.x+i,y1:it.y-4,x2:it.x+i,y2:it.y+4},g2);}else{el('line',{x1:it.x-4,y1:it.y,x2:it.x-4,y2:it.y+L},g2);el('line',{x1:it.x+4,y1:it.y,x2:it.x+4,y2:it.y+L},g2);for(let i=0;i<=L;i+=6)el('line',{x1:it.x-4,y1:it.y+i,x2:it.x+4,y2:it.y+i},g2);}break;}
    case 'tree': el('circle',{cx:it.x,cy:it.y,r:it.r||9,class:'plant'+gm},gFurn); break;
    case 'crate': {const g2=grp(gFurn,gm.trim());el('rect',{x:it.x,y:it.y,width:it.w,height:it.h,class:'crate'},g2);el('line',{x1:it.x,y1:it.y,x2:it.x+it.w,y2:it.y+it.h,class:'glyph',opacity:.5},g2);el('line',{x1:it.x+it.w,y1:it.y,x2:it.x,y2:it.y+it.h,class:'glyph',opacity:.5},g2);break;}
    case 'car': {const g2=grp(gFurn,gm.trim());el('rect',{x:it.x,y:it.y,width:it.w,height:it.h,rx:6,class:'car'},g2);const v=it.h>it.w;if(v){el('rect',{x:it.x+4,y:it.y+it.h*0.25,width:it.w-8,height:it.h*0.2,rx:3,class:'furn-dark'},g2);el('rect',{x:it.x+4,y:it.y+it.h*0.62,width:it.w-8,height:it.h*0.14,rx:3,class:'furn-dark'},g2);}else{el('rect',{x:it.x+it.w*0.25,y:it.y+4,width:it.w*0.2,height:it.h-8,rx:3,class:'furn-dark'},g2);el('rect',{x:it.x+it.w*0.62,y:it.y+4,width:it.w*0.14,height:it.h-8,rx:3,class:'furn-dark'},g2);}
      if(it.lbl)el('text',{x:it.x+it.w/2,y:it.y+it.h+11,class:'furn-t',text:tr(it.lbl)},g2);break;}
    case 'pool': el('rect',{x:it.x,y:it.y,width:it.w,height:it.h,rx:4,class:'water'+gm},gFurn); break;
    case 'pad': {const g2=grp(gFurn,'glyph'+gm);el('circle',{cx:it.x,cy:it.y,r:it.r},g2);el('circle',{cx:it.x,cy:it.y,r:it.r*0.72,'stroke-dasharray':'6 6'},g2);el('text',{x:it.x,y:it.y+14,class:'lbl',text:'H','font-size':'40','stroke':'none'},g2);for(let i=0;i<12;i++){const a=i*Math.PI/6;el('circle',{cx:it.x+Math.cos(a)*(it.r+6),cy:it.y+Math.sin(a)*(it.r+6),r:2,class:'lights'},g2);}break;}
    case 'plinth': {const g2=grp(gFurn,gm.trim());el('rect',{x:it.x,y:it.y,width:it.w,height:it.h,class:it.dark?'furn-dark':'furn'},g2);if(it.aura)el('rect',{x:it.x-4,y:it.y-4,width:it.w+8,height:it.h+8,rx:3,fill:'none',stroke:'var(--astral)','stroke-width':2,opacity:.7,class:'gm'},g2);if(it.star)el('path',{d:starPath(it.x+it.w/2,it.y+it.h/2,7),fill:'var(--venn)',stroke:'var(--ink)','stroke-width':.8,class:'gm'},g2);if(it.lbl)el('text',{x:it.x+it.w/2,y:it.y+it.h+10,class:'furn-t'+(it.light?' onvault':''),text:tr(it.lbl),fill:it.light?'#C9D0DA':null},g2);break;}
    case 'star': el('path',{d:starPath(it.x,it.y,it.r||8),fill:'var(--venn)',stroke:'var(--ink)','stroke-width':.8,class:gm.trim()},gFurn); break;
    case 'rect': {const g2=grp(gFurn,gm.trim());el('rect',{x:it.x,y:it.y,width:it.w,height:it.h,rx:it.rx||0,class:it.cls||'furn'},g2);if(it.lbl){const lines=tr(it.lbl).split('|');lines.forEach((ln,i)=>el('text',{x:it.x+it.w/2,y:(it.ly??(it.y+it.h/2+3))+i*11,class:'furn-t',text:ln,transform:it.rot?`rotate(${it.rot} ${it.x+it.w/2} ${it.y+it.h/2})`:null},g2));}break;}
    case 'rack': {const g2=grp(gFurn,gm.trim());el('rect',{x:it.x,y:it.y,width:it.w,height:it.h,class:'furn-dark'},g2);const v=it.h>it.w;const n=Math.floor((v?it.h:it.w)/6);for(let i=1;i<n;i++){if(v)el('line',{x1:it.x,y1:it.y+i*6,x2:it.x+it.w,y2:it.y+i*6,class:'glyph',opacity:.5},g2);else el('line',{x1:it.x+i*6,y1:it.y,x2:it.x+i*6,y2:it.y+it.h,class:'glyph',opacity:.5},g2);}if(it.lbl)el('text',{x:it.x+it.w/2,y:it.y+it.h+10,class:'furn-t',text:tr(it.lbl)},g2);break;}
    case 'text': {const t=el('text',{x:it.x,y:it.y,class:(it.cls||'note')+gm,transform:it.rot?`rotate(${it.rot} ${it.x} ${it.y})`:null},gFurn);const lines=tr(it.text||'').split('|');lines.forEach((ln,i)=>el('tspan',{x:it.x,dy:i?11:0,text:ln},t));break;}
    case 'line': el('line',{x1:it.x1,y1:it.y1,x2:it.x2,y2:it.y2,class:(it.cls||'glyph')+gm},gFurn); break;
    case 'rail': el('polyline',{points:it.pts.map(p=>p.join(',')).join(' '),class:'rail'+gm,fill:'none'},gFurn); break;
    case 'arrow': el('line',{x1:it.x1,y1:it.y1,x2:it.x2,y2:it.y2,class:'arrow-r'+gm,'marker-end':`url(#${id}arI)`},gFurn); break;
    case 'mast': {const g2=grp(gFurn,'glyph'+gm);el('circle',{cx:it.x,cy:it.y,r:9},g2);el('circle',{cx:it.x,cy:it.y,r:2,class:'glyph-fill'},g2);for(let i=0;i<3;i++){const a=Math.PI/2+i*2*Math.PI/3;el('line',{x1:it.x,y1:it.y,x2:it.x+Math.cos(a)*26,y2:it.y+Math.sin(a)*26,'stroke-dasharray':'3 3'},g2);}break;}
    case 'circle': el('circle',{cx:it.x,cy:it.y,r:it.r,class:(it.cls||'furn')+gm},gFurn); break;
    case 'key': {const g2=grp(gFurn,'gm');el('rect',{x:it.x-9,y:it.y-6,width:18,height:12,rx:2,fill:'var(--ink)',stroke:'var(--venn)','stroke-width':1.5},g2);el('rect',{x:it.x-5,y:it.y-2,width:6,height:4,fill:'var(--venn)'},g2);break;}
    case 'fireplace': {const g2=grp(gFurn,'glyph'+gm);el('rect',{x:it.x-16,y:it.y-6,width:32,height:12,class:'furn-dark'},g2);el('path',{d:`M${it.x-6} ${it.y+4} q3 -10 6 -4 q3 -8 6 4`,stroke:'var(--drone)','stroke-width':1.5},g2);break;}
    case 'hatch': {const g2=grp(gFurn,'glyph'+(it.gm?' gm':''));el('rect',{x:it.x-7,y:it.y-7,width:14,height:14,class:'glyph-fill'},g2);el('line',{x1:it.x-7,y1:it.y-7,x2:it.x+7,y2:it.y+7},g2);break;}
  }
}

function drawOpening(o,parent){
  const vert=o.h>o.w;const gp=grp(parent,o.gm?'gm':'');const k=o.k||'door';
  const cutKinds=['door','double','glass','open','reader','mech','lift','gate','fire','vault','secure','cut'];
  if(cutKinds.includes(k))el('rect',{x:o.x,y:o.y,width:o.w,height:o.h,class:'cut'},gp);
  const cx=o.x+o.w/2,cy=o.y+o.h/2,len=vert?o.h:o.w,s=o.flip?-1:1;
  const arcAttrs={class:'leaf',opacity:.5,'stroke-dasharray':'2 2'};
  const single=(ln)=>{if(vert){const hx=cx,hy=o.y;el('line',{x1:hx,y1:hy,x2:hx+s*ln,y2:hy,class:'leaf'},gp);el('path',Object.assign({d:`M${hx+s*ln} ${hy} A${ln} ${ln} 0 0 ${s>0?1:0} ${hx} ${hy+ln}`},arcAttrs),gp);}
    else{const hx=o.x,hy=cy;el('line',{x1:hx,y1:hy,x2:hx,y2:hy+s*ln,class:'leaf'},gp);el('path',Object.assign({d:`M${hx} ${hy+s*ln} A${ln} ${ln} 0 0 ${s>0?0:1} ${hx+ln} ${hy}`},arcAttrs),gp);}};
  if(k==='door'||k==='reader'||k==='mech'||k==='fire')single(len);
  if(k==='double'){const hl=len/2;if(vert){el('line',{x1:cx,y1:o.y,x2:cx+s*hl,y2:o.y,class:'leaf'},gp);el('line',{x1:cx,y1:o.y+o.h,x2:cx+s*hl,y2:o.y+o.h,class:'leaf'},gp);el('path',Object.assign({d:`M${cx+s*hl} ${o.y} A${hl} ${hl} 0 0 ${s>0?1:0} ${cx} ${o.y+hl}`},arcAttrs),gp);el('path',Object.assign({d:`M${cx+s*hl} ${o.y+o.h} A${hl} ${hl} 0 0 ${s>0?0:1} ${cx} ${o.y+o.h-hl}`},arcAttrs),gp);}
    else{el('line',{x1:o.x,y1:cy,x2:o.x,y2:cy+s*hl,class:'leaf'},gp);el('line',{x1:o.x+o.w,y1:cy,x2:o.x+o.w,y2:cy+s*hl,class:'leaf'},gp);el('path',Object.assign({d:`M${o.x} ${cy+s*hl} A${hl} ${hl} 0 0 ${s>0?0:1} ${o.x+hl} ${cy}`},arcAttrs),gp);el('path',Object.assign({d:`M${o.x+o.w} ${cy+s*hl} A${hl} ${hl} 0 0 ${s>0?1:0} ${o.x+o.w-hl} ${cy}`},arcAttrs),gp);}}
  if(k==='glass'){if(vert)el('line',{x1:cx,y1:o.y,x2:cx,y2:o.y+o.h,class:'glassline'},gp);else el('line',{x1:o.x,y1:cy,x2:o.x+o.w,y2:cy,class:'glassline'},gp);}
  if(k==='gate'){if(vert)el('line',{x1:cx,y1:o.y,x2:cx,y2:o.y+o.h,class:'gateline'},gp);else el('line',{x1:o.x,y1:cy,x2:o.x+o.w,y2:cy,class:'gateline'},gp);}
  if(k==='lift'){if(vert){el('line',{x1:cx-2,y1:o.y,x2:cx-2,y2:o.y+o.h,class:'liftline'},gp);el('line',{x1:cx+2,y1:o.y,x2:cx+2,y2:o.y+o.h,class:'liftline'},gp);}else{el('line',{x1:o.x,y1:cy-2,x2:o.x+o.w,y2:cy-2,class:'liftline'},gp);el('line',{x1:o.x,y1:cy+2,x2:o.x+o.w,y2:cy+2,class:'liftline'},gp);}}
  if(k==='secure'){if(vert){el('line',{x1:cx,y1:o.y,x2:cx,y2:o.y+len/2-2,class:'secureleaf'},gp);el('line',{x1:cx,y1:o.y+len/2+2,x2:cx,y2:o.y+o.h,class:'secureleaf'},gp);}else{el('line',{x1:o.x,y1:cy,x2:o.x+len/2-2,y2:cy,class:'secureleaf'},gp);el('line',{x1:o.x+len/2+2,y1:cy,x2:o.x+o.w,y2:cy,class:'secureleaf'},gp);}}
  if(k==='vault'){if(vert){el('line',{x1:cx,y1:o.y,x2:cx+s*len*0.9,y2:o.y+len*0.35,class:'vaultleaf'},gp);}else{el('line',{x1:o.x,y1:cy,x2:o.x+len*0.35,y2:cy+s*len*0.9,class:'vaultleaf'},gp);}}
  if(k==='hidden')el('rect',{x:o.x-2,y:o.y-2,width:o.w+4,height:o.h+4,class:'hiddenop'},gp);
  if(k==='window'){if(vert)el('line',{x1:cx,y1:o.y,x2:cx,y2:o.y+o.h,class:'win'},gp);else el('line',{x1:o.x,y1:cy,x2:o.x+o.w,y2:cy,class:'win'},gp);}
  if(k==='reader'){const rx=vert?cx+s*7:o.x-9,ry=vert?o.y-9:cy+s*7;el('rect',{x:rx-3,y:ry-3,width:6,height:6,class:'reader'},gp);}
  if(k==='mech'){const rx=vert?cx+s*7:o.x-9,ry=vert?o.y-9:cy+s*7;el('circle',{cx:rx,cy:ry,r:3.5,class:'mech'},gp);el('circle',{cx:rx,cy:ry,r:1,fill:'var(--ink)'},gp);}
  if(k==='fire'){const rx=vert?cx+s*7:o.x-9,ry=vert?o.y-9:cy+s*7;el('rect',{x:rx-3.5,y:ry-3.5,width:7,height:7,class:'firedoor'},gp);}
  if(o.lbl){const t=el('text',{x:o.lx??cx,y:o.ly??(cy-9),class:'note'},gp);tr(o.lbl).split('|').forEach((ln,i)=>el('tspan',{x:o.lx??cx,dy:i?10:0,text:ln},t));}
}

function renderLevel(L,opts){
  if(L.kind==='section')return renderSection(L,opts);
  const id='m'+(++uid)+'_';
  const svg=el('svg',{viewBox:`0 0 ${L.view[0]} ${L.view[1]}`,role:'img','aria-label':L.aria||L.name,class:(opts.gm?'':'view-player ')+(opts.routes?'routes-on':'')});
  const defs=el('defs',{},svg);
  const pB=el('pattern',{id:id+'hB',width:8,height:8,patternUnits:'userSpaceOnUse',patternTransform:'rotate(45)'},defs);el('line',{x1:0,y1:0,x2:0,y2:8,class:'hatchline'},pB);
  const pS=el('pattern',{id:id+'hS',width:6,height:6,patternUnits:'userSpaceOnUse',patternTransform:'rotate(-45)'},defs);el('line',{x1:0,y1:0,x2:0,y2:6,class:'hatchsec'},pS);
  const pV=el('pattern',{id:id+'hV',width:14,height:14,patternUnits:'userSpaceOnUse',patternTransform:'rotate(30)'},defs);el('line',{x1:0,y1:0,x2:0,y2:14,class:'hatchline',opacity:.35},pV);
  ['public','staff','tech','out','private'].forEach(c=>{const m=el('marker',{id:id+'ar'+c,viewBox:'0 0 10 10',refX:8,refY:5,markerWidth:4.5,markerHeight:4.5,orient:'auto-start-reverse'},defs);el('path',{d:'M0 0L10 5L0 10z',style:`fill:${rcol(c)}`},m);});
  const mI=el('marker',{id:id+'arI',viewBox:'0 0 10 10',refX:8,refY:5,markerWidth:6,markerHeight:6,orient:'auto'},defs);el('path',{d:'M0 0L10 5L0 10z',fill:'var(--ink-2)'},mI);
  const gRooms=grp(svg),gOps=grp(svg),gFurn=grp(svg),gSens=grp(svg),gPeople=grp(svg),gRoutes=grp(svg,'routes'),gLabels=grp(svg),gMarks=grp(svg),gFrame=grp(svg);
  const layers={gFurn,gSens,gPeople};
  (L.rooms||[]).forEach(r=>{
    const cls='rm rm-'+(r.t||'public')+(r.thin?' rm-thin':'')+(r.gm?' gm':'');
    if(r.pts)el('polygon',{points:r.pts.map(p=>p.join(',')).join(' '),class:cls},gRooms);else el('rect',{x:r.x,y:r.y,width:r.w,height:r.h,class:cls},gRooms);
    if(r.t==='void')el('rect',{x:r.x,y:r.y,width:r.w,height:r.h,fill:`url(#${id}hV)`,stroke:'none'},gRooms);
    if(r.label){const cx=r.lx??(r.x+r.w/2),cy=r.ly??(r.y+r.h/2);const lines=tr(r.label).split('|');const trf=r.rot?`rotate(${r.rot} ${cx} ${cy})`:null;
      const t=el('text',{x:cx,y:cy,class:'lbl'+(r.small?' sm':'')+(r.t==='vault'?' onvault':'')+(r.gm?' gm':''),transform:trf},gLabels);
      const startDy=-(lines.length-1)*6.5+(r.sub?-4:4);lines.forEach((ln,i)=>el('tspan',{x:cx,dy:i===0?startDy:13,text:ln},t));
      if(r.sub){const st=el('text',{x:cx,y:cy+(lines.length-1)*6.5+9,class:'sub'+(r.t==='vault'?' onvault':'')+(r.gm?' gm':''),transform:trf},gLabels);tr(r.sub).split('|').forEach((ln,i)=>el('tspan',{x:cx,dy:i?10:0,text:ln},st));}}
  });
  if(L.plate)el('rect',{x:L.plate[0],y:L.plate[1],width:L.plate[2],height:L.plate[3],class:'plate'},gOps);
  (L.ops||[]).forEach(o=>drawOpening(o,gOps));
  (L.items||[]).forEach(it=>drawItem(it,layers,id));
  (L.routes||[]).forEach(r=>{
    const gr=grp(gRoutes,r.gm?'gm':'');
    el('polyline',{points:r.pts.map(p=>p.join(',')).join(' '),class:'route',style:`stroke:${rcol(r.c)}`,'stroke-dasharray':r.dash?'9 7':null,'marker-end':`url(#${id}ar${r.c})`},gr);
    const p0=r.pts[0];el('circle',{cx:p0[0],cy:p0[1],r:10,style:`fill:${rcol(r.c)}`,stroke:'var(--surface)','stroke-width':2},gr);el('text',{x:p0[0],y:p0[1],class:'route-lbl',text:r.id},gr);
  });
  (L.marks||[]).forEach(m=>{const mk=grp(gMarks,'mk'+(m.gm?' gm gmmk':''));mk.dataset.n=m.n;el('circle',{cx:m.x,cy:m.y,r:11},mk);el('text',{x:m.x,y:m.y,text:m.n},mk);});
  // frame: scale, north, title block
  const sc=L.scale||20,W=L.view[0],H=L.view[1];
  const sx=W-40-sc*10,sy=H-28;
  el('line',{x1:sx,y1:sy,x2:sx+sc*10,y2:sy,class:'scale'},gFrame);[0,5,10].forEach(m=>{el('line',{x1:sx+m*sc,y1:sy-5,x2:sx+m*sc,y2:sy+5,class:'scale'},gFrame);el('text',{x:sx+m*sc,y:sy+17,class:'scale-t',text:m+' m','text-anchor':'middle'},gFrame);});
  if(L.north!==false){const nx=W-40,ny=60;el('circle',{cx:nx,cy:ny,r:16,class:'north'},gFrame);el('path',{d:`M${nx} ${ny-13} L${nx+5} ${ny+2} L${nx} ${ny-2} L${nx-5} ${ny+2} Z`,class:'north-f'},gFrame);el('text',{x:nx,y:ny+30,class:'scale-t',text:'N','text-anchor':'middle'},gFrame);}
  el('text',{x:40,y:H-14,class:'tblock',text:`MERIDIAN SPIRE · ${tr(L.tb||L.name)} · ${T().tbSuffix}`},gFrame);
  return svg;
}

function renderSection(L,opts){
  const W=1040,H=640;const id='s'+(++uid)+'_';
  const svg=el('svg',{viewBox:`0 0 ${W} ${H}`,role:'img','aria-label':L.aria||L.name,class:(opts.gm?'':'view-player ')});
  const rows=L.rows,x0=170,x1=1010;
  rows.forEach(r=>{el('line',{x1:x0,y1:r.y,x2:x1,y2:r.y,class:'secband','stroke-dasharray':r.dash?'4 6':null},svg);const t=el('text',{x:x0-14,y:r.y+4,class:'secl'},svg);tr(r.label).split('|').forEach((ln,i)=>el('tspan',{x:x0-14,dy:i?12:0,text:ln},t));
    if(r.fill)el('rect',{x:x0,y:r.y-32,width:x1-x0,height:64,fill:`var(--floor-${r.fill})`,opacity:.55},svg);});
  const rowY=Object.fromEntries(rows.map(r=>[r.id,r.y]));
  const N=L.cons.length,step=(x1-x0-60)/(N-1);
  L.cons.forEach((c,i)=>{
    const x=x0+30+i*step;const g2=grp(svg,c.gm?'gm':'');
    const ys=[...c.stops,...(c.pass||[]),...(c.block||[])].map(k=>rowY[k]);const ya=Math.min(...ys),yb=Math.max(...ys);
    el('line',{x1:x,y1:ya,x2:x,y2:yb,class:'secv',style:`stroke:${rcol(c.c)}`,'stroke-dasharray':c.items?'4 6':null,opacity:c.gm?.9:1},g2);
    (c.pass||[]).forEach(k=>el('circle',{cx:x,cy:rowY[k],r:3,style:`fill:${rcol(c.c)}`},g2));
    c.stops.forEach(k=>el('circle',{cx:x,cy:rowY[k],r:7,class:'secstop',style:`stroke:${rcol(c.c)}`},g2));
    (c.block||[]).forEach(k=>{const y=rowY[k];el('line',{x1:x-6,y1:y-6,x2:x+6,y2:y+6,class:'secblock'},g2);el('line',{x1:x+6,y1:y-6,x2:x-6,y2:y+6,class:'secblock'},g2);});
    el('circle',{cx:x,cy:ya-24,r:11,class:'secstop',style:`stroke:${rcol(c.c)}`},g2);el('text',{x:x,y:ya-20,class:'secnum',text:'V'+c.n},g2);
    if(c.note){const t=el('text',{x:x,y:yb+18,class:'sub'},g2);tr(c.note).split('|').forEach((ln,j)=>el('tspan',{x:x,dy:j?10:0,text:ln},t));}
  });
  el('text',{x:40,y:H-14,class:'tblock',text:T().sectionTb},svg);
  return svg;
}

/* ---------- Legend ---------- */
const LEGEND=[
  ['Räume',null],
  ['Öffentlich / Gäste','<rect x="2" y="2" width="22" height="12" fill="var(--floor-public)" stroke="var(--wall)" stroke-width="2"/>'],
  ['Service / Personal','<rect x="2" y="2" width="22" height="12" fill="var(--floor-service)" stroke="var(--wall)" stroke-width="2"/>'],
  ['Gesichert','<rect x="2" y="2" width="22" height="12" fill="var(--floor-secure)" stroke="var(--wall)" stroke-width="2"/>'],
  ['Privat (Veyrath)','<rect x="2" y="2" width="22" height="12" fill="var(--floor-private)" stroke="var(--wall)" stroke-width="2"/>'],
  ['Außen / Terrasse','<rect x="2" y="2" width="22" height="12" fill="var(--floor-outdoor)" stroke="var(--wall)" stroke-width="2"/>'],
  ['Technik','<rect x="2" y="2" width="22" height="12" fill="var(--floor-tech)" stroke="var(--wall)" stroke-width="2"/>'],
  ['Kern (Aufzug, Treppe, Schacht)','<rect x="2" y="2" width="22" height="12" fill="var(--floor-core)" stroke="var(--wall)" stroke-width="2"/>'],
  ['Luftraum / offen nach unten','<rect x="2" y="2" width="22" height="12" fill="var(--floor-void)" stroke="var(--wall)" stroke-width="1.5" stroke-dasharray="3 2"/>'],
  ['Vault (lebendes Gewebe)','<rect x="2" y="2" width="22" height="12" fill="var(--floor-vault)" stroke="var(--wall)" stroke-width="3"/>'],
  ['Öffnungen',null],
  ['Tür','<line x1="2" y1="8" x2="24" y2="8" stroke="var(--wall)" stroke-width="3"/><rect x="8" y="5" width="10" height="6" fill="var(--cut)"/><line x1="8" y1="8" x2="8" y2="15" stroke="var(--ink)" stroke-width="1.5"/>'],
  ['Tür mit Reader / Badge','<line x1="2" y1="8" x2="24" y2="8" stroke="var(--wall)" stroke-width="3"/><rect x="8" y="5" width="10" height="6" fill="var(--cut)"/><line x1="8" y1="8" x2="8" y2="15" stroke="var(--ink)" stroke-width="1.5"/><rect x="1" y="11" width="5" height="5" fill="var(--sec)"/>'],
  ['Mechanisches Schloss','<line x1="2" y1="8" x2="24" y2="8" stroke="var(--wall)" stroke-width="3"/><rect x="8" y="5" width="10" height="6" fill="var(--cut)"/><line x1="8" y1="8" x2="8" y2="15" stroke="var(--ink)" stroke-width="1.5"/><circle cx="3" cy="13" r="2.8" fill="var(--surface)" stroke="var(--ink)" stroke-width="1.2"/>'],
  ['Brandschutztür (öffnet bei Feueralarm)','<line x1="2" y1="8" x2="24" y2="8" stroke="var(--wall)" stroke-width="3"/><rect x="8" y="5" width="10" height="6" fill="var(--cut)"/><line x1="8" y1="8" x2="8" y2="15" stroke="var(--ink)" stroke-width="1.5"/><rect x="0" y="10" width="6" height="6" fill="var(--sec)"/>'],
  ['Glastür / Fenster','<line x1="2" y1="8" x2="24" y2="8" stroke="var(--wall)" stroke-width="3"/><line x1="7" y1="8" x2="19" y2="8" stroke="var(--glass)" stroke-width="3" stroke-linecap="round"/>'],
  ['Rolltor / Schranke','<line x1="2" y1="8" x2="24" y2="8" stroke="var(--wall)" stroke-width="3"/><line x1="6" y1="8" x2="20" y2="8" stroke="var(--ink)" stroke-width="2" stroke-dasharray="3 2"/>'],
  ['Schleusentür','<line x1="2" y1="8" x2="24" y2="8" stroke="var(--wall)" stroke-width="3"/><rect x="5" y="5" width="16" height="6" fill="var(--cut)"/><line x1="5" y1="8" x2="11" y2="8" stroke="var(--ink)" stroke-width="3"/><line x1="15" y1="8" x2="21" y2="8" stroke="var(--ink)" stroke-width="3"/>'],
  ['Aufzugstür','<line x1="2" y1="8" x2="24" y2="8" stroke="var(--wall)" stroke-width="3"/><rect x="6" y="5" width="14" height="6" fill="var(--cut)"/><line x1="6" y1="6.5" x2="20" y2="6.5" stroke="var(--ink)" stroke-width="1.3"/><line x1="6" y1="9.5" x2="20" y2="9.5" stroke="var(--ink)" stroke-width="1.3"/>'],
  ['Verborgen / nur SL bekannt','<line x1="2" y1="8" x2="24" y2="8" stroke="var(--wall)" stroke-width="3"/><rect x="6" y="4" width="14" height="8" fill="none" stroke="var(--hidden)" stroke-width="2" stroke-dasharray="3 2"/>','gm'],
  ['Revisionsluke','<rect x="6" y="2" width="12" height="12" fill="var(--floor-core)" stroke="var(--ink)" stroke-width="1.2"/><line x1="6" y1="2" x2="18" y2="14" stroke="var(--ink)" stroke-width="1.2"/>'],
  ['Treppe (Pfeil = aufwärts)','<rect x="2" y="1" width="22" height="14" fill="var(--floor-core)" stroke="none"/><line x1="7" y1="2" x2="7" y2="14" stroke="var(--ink)" stroke-width="1"/><line x1="12" y1="2" x2="12" y2="14" stroke="var(--ink)" stroke-width="1"/><line x1="17" y1="2" x2="17" y2="14" stroke="var(--ink)" stroke-width="1"/>'],
  ['Aufzug','<rect x="4" y="1" width="18" height="14" fill="var(--floor-core)" stroke="var(--wall)" stroke-width="1.5"/><line x1="6" y1="3" x2="20" y2="13" stroke="var(--ink)" stroke-width="1.2"/><line x1="20" y1="3" x2="6" y2="13" stroke="var(--ink)" stroke-width="1.2"/>'],
  ['Sicherheit & Personen',null],
  ['Kamera mit Blickfeld','<path d="M4 8 L24 1 A20 20 0 0 1 24 15 Z" fill="var(--sec)" opacity=".15"/><circle cx="4" cy="8" r="3.5" fill="var(--sec)"/>'],
  ['Lichtschranke','<line x1="2" y1="8" x2="24" y2="8" stroke="var(--sec)" stroke-width="1.5" stroke-dasharray="3 3"/>','gm'],
  ['Druckplatte','<rect x="3" y="3" width="20" height="10" fill="none" stroke="var(--sec)" stroke-dasharray="2 2"/><line x1="5" y1="12" x2="13" y2="4" stroke="var(--sec)"/><line x1="11" y1="12" x2="19" y2="4" stroke="var(--sec)"/>','gm'],
  ['Bewegungsmelder','<path d="M3 3 L24 8 L3 13 Z" fill="var(--sec)" opacity=".25" stroke="var(--sec)"/>','gm'],
  ['Sicherheit (S)','<circle cx="13" cy="8" r="7" fill="var(--guard)"/><text x="13" y="11" font-size="9" font-weight="700" fill="#fff" text-anchor="middle">S</text>'],
  ['Dorian Kade (K)','<circle cx="13" cy="8" r="7" fill="var(--kade)"/><text x="13" y="11" font-size="9" font-weight="700" fill="#fff" text-anchor="middle">K</text>','gm'],
  ['Dr. Amara Venn (V)','<circle cx="13" cy="8" r="7" fill="var(--venn)"/><text x="13" y="11" font-size="9" font-weight="700" fill="#fff" text-anchor="middle">V</text>'],
  ['Personal','<circle cx="13" cy="8" r="5" fill="var(--muted)"/>'],
  ['Gäste','<circle cx="8" cy="6" r="2.5" fill="var(--line-2)"/><circle cx="15" cy="10" r="2.5" fill="var(--line-2)"/><circle cx="19" cy="4" r="2.5" fill="var(--line-2)"/>'],
  ['Aufklärungsdrohne','<polygon points="13,2 19,8 13,14 7,8" fill="var(--drone)" stroke="var(--ink)"/>'],
  ['Wächterdrohne','<polygon points="19.9,12 13,16 6.1,12 6.1,4 13,0 19.9,4" fill="var(--drone)" stroke="var(--ink)" stroke-width="1.2"/>','gm'],
  ['Toter Winkel','<rect x="2" y="2" width="22" height="12" fill="none" stroke="var(--accent)" stroke-dasharray="3 2"/><line x1="4" y1="13" x2="13" y2="3" stroke="var(--hatch)"/><line x1="10" y1="13" x2="19" y2="3" stroke="var(--hatch)"/>','gm'],
  ['Astraler Watcher (Patrouille)','<line x1="2" y1="8" x2="24" y2="8" stroke="var(--astral)" stroke-width="2" stroke-dasharray="5 3"/>','gm'],
  ['Manabarriere / magische Aura','<rect x="3" y="3" width="20" height="10" fill="none" stroke="var(--astral)" stroke-width="3" opacity=".5"/>','gm'],
  ['Koffer (Ziel)','<path d="M13 1 L15 6 L20.5 6 L16 9.5 L17.8 15 L13 11.8 L8.2 15 L10 9.5 L5.5 6 L11 6 Z" fill="var(--venn)" stroke="var(--ink)" stroke-width=".8"/>','gm'],
  ['Keycard-Kassette','<rect x="4" y="2" width="18" height="12" rx="2" fill="var(--ink)" stroke="var(--venn)" stroke-width="1.5"/><rect x="8" y="6" width="6" height="4" fill="var(--venn)"/>','gm'],
  ['Wege (Overlay)',null],
  ['Als Gast / öffentlich','<line x1="2" y1="8" x2="24" y2="8" stroke="var(--r-public)" stroke-width="4" stroke-linecap="round"/>'],
  ['Als Personal','<line x1="2" y1="8" x2="24" y2="8" stroke="var(--r-staff)" stroke-width="4" stroke-linecap="round"/>'],
  ['Technik / verdeckt','<line x1="2" y1="8" x2="24" y2="8" stroke="var(--r-tech)" stroke-width="4" stroke-linecap="round"/>'],
  ['Außen / Fassade / Luft','<line x1="2" y1="8" x2="24" y2="8" stroke="var(--r-out)" stroke-width="4" stroke-linecap="round"/>'],
  ['Privat / verborgen','<line x1="2" y1="8" x2="24" y2="8" stroke="var(--r-private)" stroke-width="4" stroke-linecap="round"/>'],
  ['gestrichelt = nur Gegenstände, Abseilen oder Sonderfall','<line x1="2" y1="8" x2="24" y2="8" stroke="var(--ink-2)" stroke-width="3" stroke-dasharray="5 4" stroke-linecap="round"/>'],
];
function buildLegend(container){
  container.innerHTML='';
  LEGEND.forEach(([name,svgInner,cls])=>{
    if(!svgInner){const h=document.createElement('div');h.className='lgh';h.textContent=tr(name);container.appendChild(h);return;}
    const d=document.createElement('span');d.className='lg'+(cls?' '+cls:'');d.innerHTML=`<svg viewBox="0 0 26 16" aria-hidden="true">${svgInner}</svg><span>${tr(name)}</span>`;container.appendChild(d);
  });
}
