/* ---------- 3-D-Ansicht der Ebenen (Three.js), gebaut aus denselben Daten wie die 2-D-Pläne ---------- */
let lang='de';
function tr(s){if(lang!=='en'||!s)return s;return PLAN_EN.dict[s]??s;}
function esc(s){return String(s??'').replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));}
function seeded(s){let x=s||1;return()=>{x=(x*1103515245+12345)&0x7fffffff;return x/0x7fffffff;};}

const LEVELS3D=[L111];
// Was der Grundriss nicht hergibt: Glasräume, und ob der Luftraum hier Boden ist (111 = unterstes Atriumgeschoss).
const EXTRA3D={
 '111':{glassRooms:['Wintergarten'],voidIsFloor:true},
};
const UI={
 de:{subtitle:'3-D-Ansicht · Probe: Gala-Ebene · Seattle 2080',gmOn:'SL-Ansicht',gmOff:'Spieleransicht',routes:'Wege einblenden',walls:'Wände',wallSteps:{low:'niedrig',mid:'halb',full:'voll'},labels:'Beschriftung',
  back:'← 2-D-Pläne',reset:'Ansicht zurücksetzen',top:'Draufsicht',hint:'Ziehen: drehen · Rechtsklick/zwei Finger: verschieben · Mausrad: zoomen · Nummer anklicken: Ort',
  spots:'Orte auf dem Plan',gmTag:'SL',noGl:'Die 3-D-Ansicht braucht WebGL und eine Verbindung zum Laden von Three.js.',
  lg:[['public','Öffentlich / Gäste'],['service','Service / Personal'],['secure','Gesichert'],['private','Privat (Veyrath)'],['outdoor','Außen / Terrasse'],['core','Kern (Aufzug, Treppe, Schacht)'],['glass','Glas'],['guard','Sicherheit'],['staff','Personal','round'],['guest','Gäste','round'],['venn','Dr. Venn','round'],['kade','Kade','','gm'],['sec','Kamera-Sichtfeld'],['hidden','Verborgen (nur SL)','','gm']],
  fine:'Fan-Material für den privaten Spieltisch. <i>Runners in the Shadows</i> ist ein Spiel von Mark Cleveland Massengale; <i>Shadowrun</i> ist eine Marke von The Topps Company / Catalyst Game Labs. Die 3-D-Ansicht ist schematisch: Wandhöhen, Türen und Möbel sind aus dem Grundriss abgeleitet.'},
 en:{subtitle:'3D view · preview: gala level · Seattle 2080',gmOn:'GM view',gmOff:'Player view',routes:'Show routes',walls:'Walls',wallSteps:{low:'low',mid:'half',full:'full'},labels:'Labels',
  back:'← 2D plans',reset:'Reset view',top:'Top view',hint:'Drag: rotate · right-click/two fingers: pan · wheel: zoom · click a number: location',
  spots:'Locations on the plan',gmTag:'GM',noGl:'The 3D view needs WebGL and a connection to load Three.js.',
  lg:[['public','Public / guests'],['service','Service / staff'],['secure','Secured'],['private','Private (Veyrath)'],['outdoor','Outdoor / terrace'],['core','Core (lift, stairs, shaft)'],['glass','Glass'],['guard','Security'],['staff','Staff','round'],['guest','Guests','round'],['venn','Dr. Venn','round'],['kade','Kade','','gm'],['sec','Camera field of view'],['hidden','Hidden (GM only)','','gm']],
  fine:'Fan material for the private gaming table. <i>Runners in the Shadows</i> is a game by Mark Cleveland Massengale; <i>Shadowrun</i> is a trademark of The Topps Company / Catalyst Game Labs. The 3D view is schematic: wall heights, doors and furniture are derived from the floor plan.'},
};
const state={gm:true,routes:true,walls:'low',labels:true,cur:'111'};
try{const s=JSON.parse(localStorage.getItem('ms-3d')||'{}');if(s&&typeof s==='object'){if('full' in s){s.walls=s.full?'full':'low';delete s.full;}Object.assign(state,s);}if(!['low','mid','full'].includes(state.walls))state.walls='low';const v=localStorage.getItem('fp-lang');if(v==='en'||v==='de')lang=v;}catch(e){}
try{const l=new URLSearchParams(location.search).get('lang');if(l==='en'||l==='de')lang=l;}catch(e){}
function save(){try{localStorage.setItem('ms-3d',JSON.stringify(state));localStorage.setItem('fp-lang',lang);}catch(e){}}
const level=()=>LEVELS3D.find(L=>L.id===state.cur)||LEVELS3D[0];
const spotOf=(L,s)=>{if(lang==='en'){const e=(PLAN_EN.spots[L.id]||{})[s.n];if(e)return Object.assign({},s,e);}return s;};

/* ---------- Szene ---------- */
let renderer,scene,camera,controls,world,pickables=[],selected=null;
const css=n=>getComputedStyle(document.documentElement).getPropertyValue('--'+n).trim()||'#888';
const col=n=>new THREE.Color(css(n));
const matCache=new Map();
function mat(name,opts={}){
  const key=name+JSON.stringify(opts);if(matCache.has(key))return matCache.get(key);
  const m=new THREE.MeshStandardMaterial(Object.assign({color:col(name),roughness:.85,metalness:0},opts));
  if(opts.opacity!==undefined&&opts.opacity<1){m.transparent=true;m.depthWrite=false;}
  matCache.set(key,m);return m;
}
// Planpixel → Welt: x bleibt x, Plan-y wird z, Höhe y in Planpixeln (L.scale px = 1 m)
function box(parent,x0,z0,x1,z1,y0,y1,m,shadow=true){
  if(y1<=y0||x1<=x0||z1<=z0)return null;
  const g=new THREE.BoxGeometry(x1-x0,y1-y0,z1-z0);const me=new THREE.Mesh(g,m);
  me.position.set((x0+x1)/2,(y0+y1)/2,(z0+z1)/2);me.castShadow=shadow;me.receiveShadow=true;parent.add(me);return me;
}
function sprite(parent,text,opts={}){
  const fs=opts.size||44,font=`${opts.weight||600} ${fs}px "Barlow Condensed","Arial Narrow",sans-serif`;
  const cv=document.createElement('canvas'),cx=cv.getContext('2d');cx.font=font;
  const up=!opts.round&&opts.upper!==false;// gemessen wird, was gezeichnet wird (Großbuchstaben sind breiter)
  const lines=String(text).split('|').map(l=>up?l.toUpperCase():l);const w=Math.ceil(Math.max(...lines.map(l=>cx.measureText(l).width)))+(opts.round?0:28);
  const lh=fs*1.08,h=Math.ceil(lh*lines.length+(opts.round?0:16));
  const side=opts.round?Math.max(w,h)+24:0;
  cv.width=opts.round?side:w;cv.height=opts.round?side:h;
  const c2=cv.getContext('2d');c2.font=font;c2.textAlign='center';c2.textBaseline='middle';
  if(opts.round){c2.beginPath();c2.arc(side/2,side/2,side/2-4,0,Math.PI*2);c2.fillStyle=opts.bg||css('surface');c2.fill();c2.lineWidth=6;c2.strokeStyle=opts.ring||css('ink');c2.stroke();c2.fillStyle=opts.fg||css('ink');c2.fillText(text,side/2,side/2+2);}
  else{if(opts.bg){c2.fillStyle=opts.bg;c2.globalAlpha=.82;c2.beginPath();c2.roundRect?c2.roundRect(0,0,cv.width,cv.height,10):c2.rect(0,0,cv.width,cv.height);c2.fill();c2.globalAlpha=1;}
    c2.fillStyle=opts.fg||css('ink');lines.forEach((l,i)=>c2.fillText(l,cv.width/2,cv.height/2+(i-(lines.length-1)/2)*lh+2));}
  const tex=new THREE.CanvasTexture(cv);tex.anisotropy=4;
  const sp=new THREE.Sprite(new THREE.SpriteMaterial({map:tex,depthTest:opts.depthTest??true,transparent:true}));
  const k=(opts.world||22)/fs;sp.scale.set(cv.width*k,cv.height*k,1);sp.renderOrder=opts.renderOrder||10;parent.add(sp);return sp;
}

function roomAt(rooms,x,y){
  for(let i=rooms.length-1;i>=0;i--){const r=rooms[i];if(x>r.x&&x<r.x+r.w&&y>r.y&&y<r.y+r.h)return r;}
  return null;
}

function buildLevel(L){
  const S=L.scale||20,X=EXTRA3D[L.id]||{},gm=state.gm;
  const H={wall:3.2*S,low:1.15*S,mid:2.0*S,door:2.3*S,sill:.9*S,rail:1.1*S,open:2.8*S,eye:2.7*S};
  // Wandstufen: niedrig = Blick in jeden Raum, halb = Türöffnungen erkennbar, voll = echte Sichtlinien
  const top={low:H.low,mid:H.mid,full:H.wall}[state.walls],T=6;
  const clampTop=y=>Math.min(y,top);
  const g=new THREE.Group();
  const rooms=(L.rooms||[]).filter(r=>gm||!r.gm);
  const isGlass=r=>r&&(X.glassRooms||[]).includes(r.label);
  const isOut=r=>!r||r.t==='outdoor';
  const isVoid=r=>r&&r.t==='void'&&!X.voidIsFloor;

  // Deckenplatte und Böden
  const [px,py,pw,ph]=L.plate;
  box(g,px-20,py-20,px+pw+20,py+ph+20+40,-0.6*S,-1,mat('line-2'),false).receiveShadow=true;
  rooms.forEach((r,i)=>{
    if(isVoid(r))return;
    const ftype=r.t==='void'?'void':r.t;
    const m=mat('floor-'+ftype,{roughness:.95});
    const f=box(g,r.x,r.y,r.x+r.w,r.y+r.h,-1,0.2+i*0.06,m,false);
    if(r.gm&&f)f.material=mat('floor-'+ftype,{emissive:col('hidden'),emissiveIntensity:.18});
  });

  // Wände aus den Raumkanten: jede Kante wird beidseitig abgetastet, Öffnungen schneiden sie auf
  const lines=new Map();const add=(k,a,b)=>{if(!lines.has(k))lines.set(k,{iv:[],ops:[]});lines.get(k).iv.push([a,b]);};
  rooms.forEach(r=>{add('h:'+r.y,r.x,r.x+r.w);add('h:'+(r.y+r.h),r.x,r.x+r.w);add('v:'+r.x,r.y,r.y+r.h);add('v:'+(r.x+r.w),r.y,r.y+r.h);});
  (L.ops||[]).forEach(o=>{if(o.gm&&!gm&&o.k==='hidden')return;const hz=o.w>=o.h;const k=hz?'h:'+(o.y+o.h/2):'v:'+(o.x+o.w/2);if(lines.has(k))lines.get(k).ops.push({o,a:hz?o.x:o.y,b:hz?o.x+o.w:o.y+o.h});});
  const xs=[...new Set(rooms.flatMap(r=>[r.x,r.x+r.w]))],ys=[...new Set(rooms.flatMap(r=>[r.y,r.y+r.h]))];
  for(const [k,ln] of lines){
    const hz=k[0]==='h',c=+k.slice(2);
    const lo=Math.min(...ln.iv.map(v=>v[0])),hi=Math.max(...ln.iv.map(v=>v[1]));
    const bps=[...new Set([...(hz?xs:ys),...ln.iv.flat(),...ln.ops.flatMap(o=>[o.a,o.b])])].filter(v=>v>=lo&&v<=hi).sort((a,b)=>a-b);
    const pieces=[];
    for(let i=0;i<bps.length-1;i++){
      const a=bps[i],b=bps[i+1],m=(a+b)/2;if(b-a<0.5)continue;
      if(!ln.iv.some(v=>m>v[0]&&m<v[1]))continue;
      const A=hz?roomAt(rooms,m,c-1):roomAt(rooms,c-1,m),B=hz?roomAt(rooms,m,c+1):roomAt(rooms,c+1,m);
      let kind;
      if(A===B)kind=null;
      else if((A&&A.t==='void')||(B&&B.t==='void'))kind=X.voidIsFloor?null:'rail';
      else if((isGlass(A)&&isOut(B))||(isGlass(B)&&isOut(A)))kind='glass';
      else if(isOut(A)&&isOut(B))kind='rail';
      else kind='wall';
      const op=ln.ops.find(o=>m>o.a&&m<o.b);
      if(!kind&&!op)continue;
      const last=pieces[pieces.length-1];
      if(last&&last.b===a&&last.kind===kind&&last.op===op)last.b=b;else pieces.push({a,b,kind:kind||'wall',op});
    }
    pieces.forEach((p,i)=>{
      const prevOp=i>0&&pieces[i-1].b===p.a&&pieces[i-1].op,nextOp=i<pieces.length-1&&pieces[i+1].a===p.b&&pieces[i+1].op;
      const ext=p.op?0:T/2;const a=p.a-(prevOp?0:ext),b=p.b+(nextOp?0:ext);
      wallPiece(g,hz,c,a,b,p.kind,p.op&&p.op.o,{H,top,T,clampTop,gm});
    });
  }

  // Einrichtung, Personen, Sensoren
  (L.items||[]).forEach(it=>{if(it.gm&&!gm)return;item(g,it,{S,H,top,gm,L});});

  // Wege
  if(state.routes)(L.routes||[]).forEach(r=>{if(r.gm&&!gm)return;
    const path=new THREE.CurvePath();const y=0.35*S;
    for(let i=0;i<r.pts.length-1;i++)path.add(new THREE.LineCurve3(new THREE.Vector3(r.pts[i][0],y,r.pts[i][1]),new THREE.Vector3(r.pts[i+1][0],y,r.pts[i+1][1])));
    const tube=new THREE.Mesh(new THREE.TubeGeometry(path,r.pts.length*8,3,6,false),new THREE.MeshBasicMaterial({color:col('r-'+r.c),transparent:true,opacity:r.dash?.6:.9}));
    tube.renderOrder=5;g.add(tube);
    const s=sprite(g,r.id,{round:true,bg:css('r-'+r.c),ring:css('surface'),fg:'#fff',world:24,size:52,weight:700});s.position.set(r.pts[0][0],y+14,r.pts[0][1]);
  });

  // Raumbeschriftung
  if(state.labels)rooms.forEach(r=>{if(!r.label)return;
    const s=sprite(g,tr(r.label),{world:r.small?11:16,bg:css('surface'),fg:css('ink'),depthTest:false});
    s.position.set(r.lx??(r.x+r.w/2),top+(r.small?14:22),r.ly??(r.y+r.h/2));s.renderOrder=20;
  });

  // Nummern (anklickbar)
  pickables=[];
  (L.marks||[]).forEach(m=>{if(m.gm&&!gm)return;
    const hl=selected===m.n;
    const s=sprite(g,String(m.n),{round:true,world:22,size:56,weight:700,bg:hl?css('accent'):css('surface'),fg:hl?css('surface'):css('ink'),ring:m.gm?css('gmnote'):css('ink'),depthTest:false,renderOrder:30});
    const y=top+40;s.position.set(m.x,y,m.y);s.userData.n=m.n;pickables.push(s);
    const pin=new THREE.Mesh(new THREE.CylinderGeometry(.8,.8,y,6),new THREE.MeshBasicMaterial({color:col('ink'),transparent:true,opacity:.35}));pin.position.set(m.x,y/2,m.y);g.add(pin);
  });
  return g;
}

function wallPiece(g,hz,c,a,b,kind,o,{H,top,T,clampTop,gm}){
  const seg=(y0,y1,m,t=T,sh=true)=>hz?box(g,a,c-t/2,b,c+t/2,y0,clampTop(y1),m,sh):box(g,c-t/2,a,c+t/2,b,y0,clampTop(y1),m,sh);
  const glass=mat('glass',{opacity:.28,roughness:.1,metalness:.1}),wall=mat('wall',{roughness:.7}),frame=mat('ink-2');
  if(!o){
    if(kind==='wall')seg(0,H.wall,wall);
    else if(kind==='glass'){seg(0,H.wall,glass,2,false);seg(H.wall-6,H.wall,frame,4);}
    else if(kind==='rail'){seg(0,H.rail,glass,2,false);seg(H.rail-3,H.rail,frame,4);}
    return;
  }
  const k=o.k||'door',solid=kind==='wall';
  const lintel=(y)=>{if(solid)seg(y,H.wall,wall);else if(kind==='glass')seg(y,H.wall,glass,2,false);};
  const leaf=(m)=>seg(0,H.door,m,2.5);
  switch(k){
    case 'open':if(solid)seg(H.open,H.wall,wall);break;
    case 'glass':lintel(H.door);seg(0,H.door,glass,2,false);break;
    case 'window':seg(0,H.sill,solid?wall:glass,solid?T:2);seg(H.sill,H.door,glass,2,false);lintel(H.door);break;
    case 'hidden':{seg(0,H.wall,gm?mat('wall',{emissive:col('hidden'),emissiveIntensity:.55}):wall);break;}
    case 'lift':lintel(H.door);leaf(mat('line-2',{metalness:.6,roughness:.35}));break;
    case 'fire':lintel(H.door);leaf(mat('sec',{roughness:.6}));break;
    case 'mech':lintel(H.door);leaf(mat('venn',{roughness:.6}));break;
    case 'reader':lintel(H.door);leaf(mat('line-2'));
      {const cx=(a+b)/2;const p=hz?[a-3,c-5,a+3,c+5]:[c-5,a-3,c+5,a+3];box(g,p[0],p[1],p[2],p[3],H.sill+4,Math.min(H.sill+14,top),mat('sec',{emissive:col('sec'),emissiveIntensity:.6}),false);}break;
    case 'vault':case 'secure':lintel(H.door);leaf(mat('wall',{metalness:.5,roughness:.4}));break;
    case 'gate':lintel(H.door);seg(0,H.door,mat('ink-2',{opacity:.55}),2,false);break;
    default:lintel(H.door);leaf(mat('surface-2'));
  }
}

const geoCache={};
// Figur: Körper als nach unten weiter werdender Kegelstumpf (Mantel/Abendkleid), Kopf als Kugel
function figure(g,x,z,m,S,k=1){
  if(!geoCache.body){geoCache.body=new THREE.CylinderGeometry(.15*S,.27*S,1.3*S,12);geoCache.head=new THREE.SphereGeometry(.13*S,12,8);geoCache.body.userData.keep=geoCache.head.userData.keep=true;}
  const b=new THREE.Mesh(geoCache.body,m);b.position.set(x,.65*S*k,z);b.scale.set(1,k,1);b.castShadow=true;g.add(b);
  const h=new THREE.Mesh(geoCache.head,headMat());h.position.set(x,(1.3*k+.16)*S,z);h.castShadow=true;g.add(h);
}
function person(g,x,z,color,S,letter,ring){
  figure(g,x,z,mat(color,{roughness:.6}),S,1.05);
  if(letter)tag(g,x,z,color,S,letter,2.15,ring);
}
function tag(g,x,z,color,S,letter,y,ring){const s=sprite(g,letter,{round:true,world:12,size:44,weight:700,bg:css(color),fg:'#fff',ring:ring||css('surface')});s.position.set(x,y*S,z);}
// Bauteil einer Figur; Maße in Metern relativ zum Fußpunkt
function part(g,geo,m,x,z,S,dx,y,dz,rx=0,rz=0){const me=new THREE.Mesh(geo,m);me.position.set(x+dx*S,y*S,z+dz*S);me.rotation.set(rx,0,rz);me.castShadow=true;g.add(me);return me;}
const headMat=()=>{if(!matCache.has('head'))matCache.set('head',new THREE.MeshStandardMaterial({color:new THREE.Color('#D2C4B4'),roughness:.7}));return matCache.get('head');};
const chrome=()=>mat('line-2',{color:new THREE.Color('#C9D2DC'),metalness:.35,roughness:.25,emissive:new THREE.Color('#2A3340')});
// Sicherheit: kantig, breite Schultern im Blazer, Schirmmütze
function guardFig(g,x,z,S){
  const c=mat('guard',{roughness:.55}),dark=mat('ink-2',{roughness:.6});
  part(g,new THREE.BoxGeometry(.32*S,.8*S,.2*S),dark,x,z,S,0,.4,0);
  part(g,new THREE.BoxGeometry(.52*S,.62*S,.28*S),c,x,z,S,0,1.11,0);
  part(g,new THREE.SphereGeometry(.12*S,12,8),headMat(),x,z,S,0,1.56,0);
  part(g,new THREE.CylinderGeometry(.135*S,.135*S,.06*S,12),dark,x,z,S,0,1.66,0);
  part(g,new THREE.BoxGeometry(.2*S,.02*S,.12*S),dark,x,z,S,0,1.64,.14);
  tag(g,x,z,'guard',S,'S',2.1);
}
// Kade: größer und massiger, verchromte Cyberarme, rotes Cyberauge
function kadeFig(g,x,z,S){
  const c=mat('kade',{roughness:.5}),dark=mat('ink-2',{roughness:.6}),cr=chrome();
  part(g,new THREE.BoxGeometry(.38*S,.88*S,.24*S),dark,x,z,S,0,.44,0);
  part(g,new THREE.BoxGeometry(.64*S,.7*S,.34*S),c,x,z,S,0,1.23,0);
  [-1,1].forEach(s=>{part(g,new THREE.SphereGeometry(.1*S,10,8),cr,x,z,S,s*.36,1.5,0);part(g,new THREE.CylinderGeometry(.075*S,.065*S,.78*S,10),cr,x,z,S,s*.4,1.1,0,0,s*.12);part(g,new THREE.SphereGeometry(.085*S,10,8),cr,x,z,S,s*.45,.7,0);});
  part(g,new THREE.SphereGeometry(.13*S,12,8),headMat(),x,z,S,0,1.74,0);
  part(g,new THREE.BoxGeometry(.2*S,.04*S,.06*S),mat('sec',{emissive:col('sec'),emissiveIntensity:1}),x,z,S,0,1.77,.11);
  tag(g,x,z,'kade',S,'K',2.3);
}
// Dr. Venn: schmal und hochgewachsen im langen Mantel, goldenes AR-Visier, leuchtendes Tablet
function vennFig(g,x,z,S){
  const c=mat('venn',{roughness:.5});
  part(g,new THREE.CylinderGeometry(.11*S,.21*S,1.42*S,14),c,x,z,S,0,.71,0);
  part(g,new THREE.CylinderGeometry(.13*S,.11*S,.1*S,14),c,x,z,S,0,1.42,0);
  part(g,new THREE.SphereGeometry(.12*S,12,8),headMat(),x,z,S,0,1.6,0);
  part(g,new THREE.TorusGeometry(.13*S,.022*S,8,20),mat('venn',{emissive:col('venn'),emissiveIntensity:.7,metalness:.6,roughness:.3}),x,z,S,0,1.62,0,Math.PI/2);
  part(g,new THREE.BoxGeometry(.24*S,.03*S,.17*S),mat('glass',{emissive:col('glass'),emissiveIntensity:.9}),x,z,S,0,1.05,.22,-.5);
  tag(g,x,z,'venn',S,'V',2.15);
}
// Gäste: gedeckte Abendgarderobe, leicht unterschiedlich groß, ohne Buchstaben, damit Wachen & Co. herausstechen
const GUEST_TONES=['#8C6A7E','#5E7F96','#A88B63','#7C8A62','#9A5A63','#B8AFA0','#6E6A8E','#4F6F6A'];
const guestMats=()=>GUEST_TONES.map(c=>{const k='guest'+c;if(!matCache.has(k))matCache.set(k,new THREE.MeshStandardMaterial({color:new THREE.Color(c),roughness:.75}));return matCache.get(k);});
function guest(g,x,z,S,rnd){const ms=guestMats();figure(g,x,z,ms[Math.floor(rnd()*ms.length)],S,.9+rnd()*.14);}
function sector(g,x,z,a,len,spread,color,yApex,opFloor,opSide){
  const n=14,a0=(a-spread)*Math.PI/180,a1=(a+spread)*Math.PI/180;const pts=[];
  for(let i=0;i<=n;i++){const t=a0+(a1-a0)*i/n;pts.push([x+Math.cos(t)*len,z+Math.sin(t)*len]);}
  const fl=[],sd=[];const y=1.2;
  for(let i=0;i<n;i++){fl.push(x,y,z,pts[i][0],y,pts[i][1],pts[i+1][0],y,pts[i+1][1]);if(yApex)sd.push(x,yApex,z,pts[i][0],y,pts[i][1],pts[i+1][0],y,pts[i+1][1]);}
  const mk=(arr,op)=>{const geo=new THREE.BufferGeometry();geo.setAttribute('position',new THREE.Float32BufferAttribute(arr,3));const m=new THREE.Mesh(geo,new THREE.MeshBasicMaterial({color:col(color),transparent:true,opacity:op,side:THREE.DoubleSide,depthWrite:false}));m.renderOrder=4;g.add(m);};
  mk(fl,opFloor);if(sd.length)mk(sd,opSide);
}
function item(g,it,{S,H,top,gm,L}){
  const fh=(h)=>Math.min(h,top+0.4*S);
  switch(it.k){
    case 'rect':{
      if(it.cls==='outline'){if(!gm)break;const m=mat('hidden',{opacity:.16});const b=box(g,it.x,it.y,it.x+it.w,it.y+it.h,H.wall-.5*S,H.wall,m,false);if(b)b.renderOrder=3;break;}
      const thin=Math.min(it.w,it.h)<=12,dark=it.cls==='furn-dark';
      const lbl=(it.lbl||'').toLowerCase();
      let h=dark?(thin?2.0*S:1.0*S):.78*S;if(lbl.startsWith('bühne'))h=.45*S;if(lbl==='bar')h=1.1*S;if(lbl==='buffet')h=.9*S;
      box(g,it.x,it.y,it.x+it.w,it.y+it.h,0,fh(h),mat(dark?'line-2':'surface',{roughness:.8}));break;}
    case 'plinth':box(g,it.x,it.y,it.x+it.w,it.y+it.h,0,1.0*S,mat('surface'));
      {const s=Math.min(it.w,it.h)*.55;box(g,it.x+it.w/2-s/2,it.y+it.h/2-s/2,it.x+it.w/2+s/2,it.y+it.h/2+s/2,1.0*S,1.0*S+s*.9,mat('venn',{roughness:.4,metalness:.3}));}break;
    case 'crate':box(g,it.x,it.y,it.x+it.w,it.y+it.h,0,fh(1.0*S),mat('floor-service',{roughness:.9}));break;
    case 'tree':{const r=it.r||9;const t=new THREE.Mesh(new THREE.CylinderGeometry(1.5,2,1.2*S,6),mat('ink-2'));t.position.set(it.x,.6*S,it.y);g.add(t);
      const c=new THREE.Mesh(new THREE.SphereGeometry(r,12,8),mat('plant',{roughness:.9}));c.position.set(it.x,1.2*S+r*.6,it.y);c.castShadow=true;g.add(c);break;}
    case 'circle':{if(it.cls==='glyph'){const ring=new THREE.Mesh(new THREE.RingGeometry(it.r-1.5,it.r,40),new THREE.MeshBasicMaterial({color:col('ink'),side:THREE.DoubleSide}));ring.rotation.x=-Math.PI/2;ring.position.set(it.x,1,it.y);g.add(ring);}
      else{const c=new THREE.Mesh(new THREE.CylinderGeometry(it.r,it.r,.45*S,14),mat('surface'));c.position.set(it.x,.225*S,it.y);c.castShadow=true;g.add(c);}break;}
    case 'guests':{const rnd=seeded(it.seed||7);const look=seeded((it.seed||7)*31+5);// eigene Folge, damit die Positionen wie im 2-D-Plan bleiben
      for(let i=0;i<(it.n||12);i++){const x=it.x+rnd()*it.w,z=it.y+rnd()*it.h;guest(g,x,z,S,look);}break;}
    case 'guard':guardFig(g,it.x,it.y,S);break;
    case 'kade':kadeFig(g,it.x,it.y,S);break;
    case 'venn':vennFig(g,it.x,it.y,S);break;
    case 'staff':person(g,it.x,it.y,'r-staff',S,it.t||'');break;
    case 'cam':{const y=Math.min(2.8*S,H.wall-4);box(g,it.x-3,it.y-3,it.x+3,it.y+3,y-4,y+2,mat('sec'),false);sector(g,it.x,it.y,it.a??0,it.len??60,it.spread??24,'sec',y,.2,.07);break;}
    case 'motion':sector(g,it.x,it.y,it.a||0,it.r||34,it.spread||40,'hidden',0,.28,0);break;
    case 'blind':{const b=box(g,it.x,it.y,it.x+it.w,it.y+it.h,0,3,mat('hidden',{opacity:.25}),false);break;}
    case 'stair':{const v=it.dir!=='h',len=v?it.h:it.w,n=Math.max(4,Math.floor(len/8)),step=len/n,rise=H.wall/n;
      for(let i=0;i<n;i++){const y1=rise*(i+1);if(v){const z0=it.y+it.h-step*(i+1);box(g,it.x+2,z0,it.x+it.w-2,z0+step,0,y1,mat('surface-2'));}else{const x0=it.x+step*i;box(g,x0,it.y+2,x0+step,it.y+it.h-2,0,y1,mat('surface-2'));}}break;}
    case 'spiral':{const p=new THREE.Mesh(new THREE.CylinderGeometry(2.5,2.5,H.wall,8),mat('ink-2'));p.position.set(it.x,H.wall/2,it.y);g.add(p);
      const n=14;for(let i=0;i<n;i++){const st=new THREE.Mesh(new THREE.BoxGeometry(it.r,3,9),mat('surface-2'));const a=i*Math.PI*2/12;st.position.set(it.x+Math.cos(a)*it.r/2,(i+1)*H.wall/n,it.y+Math.sin(a)*it.r/2);st.rotation.y=-a;st.castShadow=true;g.add(st);}break;}
    case 'shaft':box(g,it.x+2,it.y+2,it.x+it.w-2,it.y+it.h-2,0,.3,new THREE.MeshBasicMaterial({color:0x05070a}),false);break;
    case 'lift':box(g,it.x+4,it.y+4,it.x+it.w-4,it.y+it.h-4,0,.4,mat('ink-2',{metalness:.5,roughness:.4}),false);break;
    case 'ladder':{const L2=it.len||30,hgt=4*S;const along=it.dir==='h';const x0=it.x,z0=it.y;
      const rails=along?[[x0,z0],[x0+L2,z0]]:[[x0,z0],[x0,z0+L2]];
      rails.forEach(([x,z])=>box(g,x-1,z-1,x+1,z+1,0,hgt,mat('ink-2'),false));
      for(let y=10;y<hgt;y+=10)along?box(g,x0,z0-1,x0+L2,z0+1,y,y+1.5,mat('ink-2'),false):box(g,x0-1,z0,x0+1,z0+L2,y,y+1.5,mat('ink-2'),false);break;}
    case 'fireplace':box(g,it.x-16,it.y-6,it.x+16,it.y+6,0,fh(1.1*S),mat('line-2'));box(g,it.x-8,it.y-7,it.x+8,it.y-5,4,14,mat('drone',{emissive:col('drone'),emissiveIntensity:1.2}),false);break;
    case 'key':box(g,it.x-9,it.y-6,it.x+9,it.y+6,.78*S,.78*S+4,mat('venn',{emissive:col('venn'),emissiveIntensity:.8}),false);break;
    case 'droneR':case 'droneW':box(g,it.x-5,it.y-5,it.x+5,it.y+5,1.4*S,1.4*S+4,mat('drone'),true);break;
    case 'car':box(g,it.x,it.y,it.x+it.w,it.y+it.h,0,1.4*S,mat('surface-2',{metalness:.4,roughness:.4}));break;
    case 'rack':box(g,it.x,it.y,it.x+it.w,it.y+it.h,0,fh(2.0*S),mat('line-2'));break;
    case 'pool':box(g,it.x,it.y,it.x+it.w,it.y+it.h,0,1,mat('glass',{opacity:.6}),false);break;
    case 'barrier':box(g,it.x,it.y,it.x+it.w,it.y+it.h,0,1.0*S,mat('sec'));break;
  }
}

function frameView(top){
  const L=level(),[px,py,pw,ph]=L.plate,cx=px+pw/2,cz=py+ph/2,d=Math.max(pw,ph);
  controls.target.set(cx,0,cz);
  if(top)camera.position.set(cx,d*1.45,cz+1);else camera.position.set(cx+d*.42,d*.78,cz+d*.92);
  controls.update();
}
function rebuild(){
  if(!scene)return;
  matCache.forEach(m=>m.dispose());matCache.clear();
  if(world){scene.remove(world);world.traverse(o=>{if(o.geometry&&!o.geometry.userData.keep)o.geometry.dispose();if(o.material&&o.material.map)o.material.map.dispose();});}
  scene.background=col('bg');
  world=buildLevel(level());scene.add(world);
}
function initGL(){
  const stage=document.getElementById('stage');
  if(typeof THREE==='undefined'||!THREE.OrbitControls){stage.insertAdjacentHTML('beforeend',`<div class="err">${esc(UI[lang].noGl)}</div>`);return;}
  try{renderer=new THREE.WebGLRenderer({antialias:true});}catch(e){stage.insertAdjacentHTML('beforeend',`<div class="err">${esc(UI[lang].noGl)}</div>`);return;}
  renderer.setPixelRatio(Math.min(window.devicePixelRatio||1,2));renderer.shadowMap.enabled=true;renderer.shadowMap.type=THREE.PCFSoftShadowMap;
  renderer.outputEncoding=THREE.sRGBEncoding;
  stage.prepend(renderer.domElement);renderer.domElement.tabIndex=0;renderer.domElement.setAttribute('aria-label',ariaLabel());
  scene=new THREE.Scene();
  camera=new THREE.PerspectiveCamera(38,1,5,20000);
  controls=new THREE.OrbitControls(camera,renderer.domElement);controls.enableDamping=true;controls.dampingFactor=.08;controls.maxPolarAngle=Math.PI*.47;controls.minDistance=120;controls.maxDistance=4000;controls.screenSpacePanning=false;
  const L=level(),[px,py,pw,ph]=L.plate;
  scene.add(new THREE.HemisphereLight(0xffffff,0x8892a0,.75));
  const sun=new THREE.DirectionalLight(0xffffff,.75);sun.position.set(px-300,900,py-200);sun.target.position.set(px+pw/2,0,py+ph/2);
  sun.castShadow=true;sun.shadow.mapSize.set(2048,2048);Object.assign(sun.shadow.camera,{left:-800,right:800,top:800,bottom:-800,near:10,far:3000});sun.shadow.bias=-.0005;
  scene.add(sun,sun.target);
  rebuild();frameView(false);
  const resize=()=>{const w=stage.clientWidth,h=stage.clientHeight;renderer.setSize(w,h,false);camera.aspect=w/h;camera.updateProjectionMatrix();};
  new ResizeObserver(resize).observe(stage);resize();
  // Klick auf eine Nummer (nicht beim Ziehen)
  let down=null;
  renderer.domElement.addEventListener('pointerdown',e=>{down=[e.clientX,e.clientY];});
  renderer.domElement.addEventListener('pointerup',e=>{if(!down||Math.hypot(e.clientX-down[0],e.clientY-down[1])>5)return;
    const r=renderer.domElement.getBoundingClientRect();const v=new THREE.Vector2((e.clientX-r.left)/r.width*2-1,-(e.clientY-r.top)/r.height*2+1);
    const rc=new THREE.Raycaster();rc.setFromCamera(v,camera);const hit=rc.intersectObjects(pickables)[0];
    if(hit)select(hit.object.userData.n,true);});
  (function loop(){requestAnimationFrame(loop);controls.update();renderer.render(scene,camera);})();
  try{matchMedia('(prefers-color-scheme: dark)').addEventListener('change',rebuild);}catch(e){}
}
function ariaLabel(){const L=level();return (lang==='en'&&PLAN_EN.aria&&PLAN_EN.aria[L.id])||L.aria||L.name;}

/* ---------- Seite ---------- */
function select(n,scroll){
  selected=selected===n?null:n;rebuild();
  document.querySelectorAll('#spots li').forEach(li=>li.classList.toggle('hl',+li.dataset.n===selected));
  if(scroll&&selected){const li=document.querySelector(`#spots li[data-n="${selected}"]`);if(li)li.scrollIntoView({block:'nearest',behavior:'smooth'});}
}
function renderUI(){
  const t=UI[lang],L=level();document.documentElement.lang=lang;document.body.classList.toggle('gm',state.gm);
  document.getElementById('subtitle').textContent=t.subtitle;
  document.getElementById('tabs').innerHTML=LEVELS3D.map(l=>`<button role="tab" aria-selected="${l.id===state.cur}">${esc(tr(l.name))}<small>${esc(tr(l.sub))}</small></button>`).join('');
  const setT=(id,on,txt)=>{const b=document.getElementById(id);b.setAttribute('aria-pressed',on?'true':'false');b.lastChild.textContent=txt;};
  setT('btnGM',state.gm,state.gm?t.gmOn:t.gmOff);setT('btnRoutes',state.routes,t.routes);document.getElementById('wallsLbl').textContent=t.walls;document.querySelectorAll('#walls button').forEach(b=>{b.textContent=t.wallSteps[b.dataset.w];b.setAttribute('aria-pressed',b.dataset.w===state.walls?'true':'false');});setT('btnLabels',state.labels,t.labels);
  document.getElementById('langDE').setAttribute('aria-pressed',lang==='de'?'true':'false');document.getElementById('langEN').setAttribute('aria-pressed',lang==='en'?'true':'false');
  const back=document.getElementById('lnk2d');back.textContent=t.back;back.href='meridian-spire-plaene.html?lang='+lang;
  document.getElementById('vReset').textContent=t.reset;document.getElementById('vTop').textContent=t.top;document.getElementById('hint').textContent=t.hint;
  document.getElementById('mapTitle').innerHTML=`${esc(tr(L.name))}<span>${esc(tr(L.sub))}</span>`;
  document.getElementById('chips').innerHTML=(L.chips||[]).map(c=>`<span class="chip">${esc(tr(c))}</span>`).join('');
  const sw={glass:'glass',guard:'guard',staff:'r-staff',guest:'muted',venn:'venn',kade:'kade',sec:'sec',hidden:'hidden'};
  document.getElementById('legend').innerHTML=t.lg.map(([k,n,round,g])=>`<span class="lg${g?' gm':''}"><span class="sw${round?' round':''}" style="background:${k==='guest'?`conic-gradient(${GUEST_TONES.join(',')})`:`var(--${sw[k]||'floor-'+k})`}"></span>${esc(n)}</span>`).join('');
  document.getElementById('spotsHead').textContent=t.spots;
  document.getElementById('spots').innerHTML=(L.spots||[]).map(s=>spotOf(L,s)).map(s=>`<li data-n="${s.n}" tabindex="0" class="${s.gm?'gmonly':''}${selected===s.n?' hl':''}"><span class="n">${s.n}</span><div><b>${esc(s.t)}</b><p>${esc(s.p)}</p>${s.g?`<div class="gmn" data-l="${t.gmTag}">${esc(s.g)}</div>`:''}</div></li>`).join('');
  document.getElementById('fine').innerHTML=t.fine;
  if(renderer)renderer.domElement.setAttribute('aria-label',ariaLabel());
}
function set(k,v){state[k]=v;save();renderUI();rebuild();}
document.getElementById('btnGM').addEventListener('click',()=>set('gm',!state.gm));
document.getElementById('btnRoutes').addEventListener('click',()=>set('routes',!state.routes));
document.getElementById('walls').addEventListener('click',e=>{const b=e.target.closest('button');if(b)set('walls',b.dataset.w);});
document.getElementById('btnLabels').addEventListener('click',()=>set('labels',!state.labels));
document.getElementById('langDE').addEventListener('click',()=>{lang='de';save();renderUI();rebuild();});
document.getElementById('langEN').addEventListener('click',()=>{lang='en';save();renderUI();rebuild();});
document.getElementById('vReset').addEventListener('click',()=>frameView(false));
document.getElementById('vTop').addEventListener('click',()=>frameView(true));
document.getElementById('spots').addEventListener('click',e=>{const li=e.target.closest('li');if(li)select(+li.dataset.n,false);});
document.getElementById('spots').addEventListener('keydown',e=>{const li=e.target.closest('li');if(li&&(e.key==='Enter'||e.key===' ')){e.preventDefault();select(+li.dataset.n,false);}});
renderUI();
if(document.fonts&&document.fonts.ready)document.fonts.ready.then(()=>{initGL();});else initGL();
