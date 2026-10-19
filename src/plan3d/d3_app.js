/* ---------- 3-D-Ansicht der Ebenen (Three.js), gebaut aus denselben Daten wie die 2-D-Pläne ---------- */
let lang='de';
function tr(s){if(lang!=='en'||!s)return s;return PLAN_EN.dict[s]??s;}
function esc(s){return String(s??'').replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));}
function seeded(s){let x=s||1;return()=>{x=(x*1103515245+12345)&0x7fffffff;return x/0x7fffffff;};}

const LEVELS3D=[LGARAGE,L111,L112,LDACH,L110];
// Was der Grundriss nicht hergibt:
//  glassRooms   Räume mit Glaswänden nach außen
//  voidIsFloor  Luftraum ist hier Boden (111 = unterstes Atriumgeschoss)
//  outsideVoids Lufträume außerhalb der Fassade: zählen für die Wände als „draußen“
//  openTypes    Raumtypen ohne Wände untereinander (Fahrgassen der Garage)
//  parapet      Dachrand als massive Brüstung statt Glasgeländer
//  pyramids     Glasdächer als Pyramide; ramps: Rampe steigt nach Norden an
const EXTRA3D={
 'garage':{openTypes:['drive','ramp'],ramps:['Rampe']},
 '111':{glassRooms:['Wintergarten'],voidIsFloor:true},
 '112':{outsideVoids:['Luftraum','Glasdach Wintergarten']},
 'dach':{outsideVoids:['Luftraum'],parapet:true,pyramids:['Glasdach Atrium']},
};
// Übergänge zwischen den Ebenen, nach dem Schnitt (nur Wege für Personen; das EG ist nicht modelliert).
// at: je Ebene die Fläche [x,y,w,h], die den Übergang anbietet; man kommt in ihrer Mitte an. gmAt: Halt nur in der SL-Ansicht.
const ORDER=['garage','110','111','112','dach'];
const LINKS=[
 {name:'Frachtaufzug',c:'staff',at:{garage:[40,200,70,70],'111':[40,200,70,70]}},
 {name:'Personaltreppe',c:'staff',at:{garage:[40,270,70,90],'110':[40,270,70,90],'111':[40,270,70,90],'112':[40,270,70,90],dach:[40,270,70,90]},gmAt:['110']},
 {name:'Wartungsschacht',c:'tech',gm:true,at:{'110':[40,360,70,40],'111':[40,360,70,40],'112':[40,360,70,40],dach:[40,360,70,40]}},
 {name:'Freitreppe',c:'public',at:{'111':[620,470,70,90],'112':[620,470,70,90]}},
 {name:'Privattreppe',c:'private',gm:true,at:{'111':[713,664,44,44],'112':[713,664,44,44]}},
 {name:'Sammlerlift',c:'public',at:{'111':[900,500,60,70],'110':[900,500,60,70]}},
 {name:'Privatlift',c:'private',gm:true,at:{'111':[900,640,60,60],'110':[900,640,60,60]}},
 {name:'Steigleiter',c:'out',at:{'111':[260,40,36,24],dach:[260,140,36,24]}},
 {name:'Skycab-Treppe',c:'public',at:{'112':[250,660,50,60],dach:[250,660,50,60]}},
 {name:'Fassadengondel',c:'out',at:{dach:[962,590,34,60],'110':[920,290,36,60]}},
];
const stopsOf=l=>Object.keys(l.at).filter(id=>state.gm||!(l.gmAt||[]).includes(id)).sort((a,b)=>ORDER.indexOf(a)-ORDER.indexOf(b));
const linksOn=id=>LINKS.filter(l=>(state.gm||!l.gm)&&stopsOf(l).length>1&&stopsOf(l).includes(id)).map(link=>({link,r:link.at[id]}));
const UI={
 de:{subtitle:'3-D-Ansicht von Tiefgarage, Penthouse, Dach und Tresorgeschoss · Seattle 2080',gmOn:'SL-Ansicht',gmOff:'Spieleransicht',routes:'Wege einblenden',walls:'Wände',wallSteps:{low:'niedrig',mid:'halb',full:'voll'},labels:'Beschriftung',guests:'Gäste zeigen',
  back:'← 2-D-Pläne',reset:'Ansicht zurücksetzen',top:'Draufsicht',hint:'Ziehen: drehen · Rechtsklick/zwei Finger: verschieben · Mausrad: zoomen · Nummer anklicken: Ort',
  walk:'Begehen',walkExit:'Rundgang beenden',full:'Vollbild',fullExit:'Vollbild beenden',portalKeys:'Taste 1–3 oder anklicken',
  patrol:'Patrouillen',night:'Nachtmodus',share:'Position teilen',shared:'Link kopiert',alert:'Alert',alertReset:'Klicken setzt den Zähler zurück',
  seenBy:{cam:'Kamera',motion:'Bewegungsmelder',guard:'Wache',kade:'Kade'},seen:'Gesehen',
  doorHint:' · SL: Reader- und Tresortüren anklicken öffnet oder verriegelt sie (verriegelt sperren sie in der Spieleransicht)',walkHint:'W/A/S/D oder Pfeiltasten: gehen · Shift: schneller · Ziehen: umsehen · Doppelklick auf den Boden: dorthin springen · Esc: beenden',
  spots:'Orte auf dem Plan',gmTag:'SL',noGl:'Die 3-D-Ansicht braucht WebGL und eine Verbindung zum Laden von Three.js.',
  lg:[['public','Öffentlich / Gäste'],['service','Service / Personal'],['secure','Gesichert'],['private','Privat (Veyrath)'],['outdoor','Außen / Terrasse'],['core','Kern (Aufzug, Treppe, Schacht)'],['tech','Technik'],['drive','Fahrbahn'],['roof','Dach'],['vault','Vault (lebendes Gewebe)'],['glass','Glas'],['guard','Sicherheit'],['staff','Personal','round'],['guest','Gäste','round'],['venn','Dr. Venn','round'],['kade','Kade','','gm'],['sec','Kamera-Sichtfeld, Sensoren'],['drone','Drohnen','round'],['astral','Astral (nur SL)','','gm'],['hidden','Verborgen (nur SL)','','gm']],
  fine:'Fan-Material für den privaten Spieltisch. <i>Runners in the Shadows</i> ist ein Spiel von Mark Cleveland Massengale; <i>Shadowrun</i> ist eine Marke von The Topps Company / Catalyst Game Labs. Die 3-D-Ansicht ist schematisch: Wandhöhen, Türen und Möbel sind aus dem Grundriss abgeleitet.'},
 en:{subtitle:'3D view of parking garage, penthouse, roof and vault level · Seattle 2080',gmOn:'GM view',gmOff:'Player view',routes:'Show routes',walls:'Walls',wallSteps:{low:'low',mid:'half',full:'full'},labels:'Labels',guests:'Show guests',
  back:'← 2D plans',reset:'Reset view',top:'Top view',hint:'Drag: rotate · right-click/two fingers: pan · wheel: zoom · click a number: location',
  walk:'Walk through',walkExit:'End walk',full:'Fullscreen',fullExit:'Exit fullscreen',portalKeys:'Key 1–3 or click',
  patrol:'Patrols',night:'Night mode',share:'Share position',shared:'Link copied',alert:'Alert',alertReset:'Click to reset the counter',
  seenBy:{cam:'Camera',motion:'Motion sensor',guard:'Guard',kade:'Kade'},seen:'Spotted',
  doorHint:' · GM: click reader and vault doors to open or lock them (locked doors block in player view)',walkHint:'W/A/S/D or arrow keys: walk · Shift: faster · drag: look around · double-click the floor: jump there · Esc: exit',
  spots:'Locations on the plan',gmTag:'GM',noGl:'The 3D view needs WebGL and a connection to load Three.js.',
  lg:[['public','Public / guests'],['service','Service / staff'],['secure','Secured'],['private','Private (Veyrath)'],['outdoor','Outdoor / terrace'],['core','Core (lift, stairs, shaft)'],['tech','Utilities'],['drive','Driveway'],['roof','Roof'],['vault','Vault (living tissue)'],['glass','Glass'],['guard','Security'],['staff','Staff','round'],['guest','Guests','round'],['venn','Dr. Venn','round'],['kade','Kade','','gm'],['sec','Camera field of view, sensors'],['drone','Drones','round'],['astral','Astral (GM only)','','gm'],['hidden','Hidden (GM only)','','gm']],
  fine:'Fan material for the private gaming table. <i>Runners in the Shadows</i> is a game by Mark Cleveland Massengale; <i>Shadowrun</i> is a trademark of The Topps Company / Catalyst Game Labs. The 3D view is schematic: wall heights, doors and furniture are derived from the floor plan.'},
};
const state={gm:true,routes:true,walls:'low',labels:true,guests:true,patrol:false,night:false,open:[],cur:'111'};
try{const s=JSON.parse(localStorage.getItem('ms-3d')||'{}');if(s&&typeof s==='object'){if('full' in s){s.walls=s.full?'full':'low';delete s.full;}Object.assign(state,s);}if(!['low','mid','full'].includes(state.walls))state.walls='low';const v=localStorage.getItem('fp-lang');if(v==='en'||v==='de')lang=v;}catch(e){}
// Geteilte Position: ?level=111&pos=520,540&dir=90&walk=1&view=player
let startAt=null;
try{const q=new URLSearchParams(location.search),l=q.get('lang'),lv=q.get('level');if(l==='en'||l==='de')lang=l;if(lv&&LEVELS3D.some(L=>L.id===lv))state.cur=lv;
  const pos=(q.get('pos')||'').split(',').map(Number);if(pos.length===2&&pos.every(Number.isFinite))startAt={x:pos[0],z:pos[1],dir:+q.get('dir')||0};
  if(q.get('walk')==='1'&&!startAt)startAt={};if(q.get('view')==='player')state.gm=false;}catch(e){}
const openDoors=new Set(Array.isArray(state.open)?state.open:[]);
function save(){try{localStorage.setItem('ms-3d',JSON.stringify(state));localStorage.setItem('fp-lang',lang);}catch(e){}}
const level=()=>LEVELS3D.find(L=>L.id===state.cur)||LEVELS3D[0];
const spotOf=(L,s)=>{if(lang==='en'){const e=(PLAN_EN.spots[L.id]||{})[s.n];if(e)return Object.assign({},s,e);}return s;};

/* ---------- Szene ---------- */
let renderer,scene,camera,controls,world,pickables=[],selected=null;
let colliders=[];// Grundrissrechtecke [x0,z0,x1,z1,undurchsichtig], die beim Begehen nicht betreten werden können
let sensors=[],actors=[],doorPicks=[],nightLights=[];// je Ebene beim Aufbau gesammelt
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
  const top=walk.on?H.wall:{low:H.low,mid:H.mid,full:H.wall}[state.walls],T=6;
  colliders=[];sensors=[];actors=[];doorPicks=[];
  const clampTop=y=>Math.min(y,top);
  const g=new THREE.Group();
  const rooms=(L.rooms||[]).filter(r=>gm||!r.gm);
  const isGlass=r=>r&&(X.glassRooms||[]).includes(r.label);
  const isOut=r=>!r||['outdoor','roof','glass'].includes(r.t);
  const isVoid=r=>r&&r.t==='void'&&!X.voidIsFloor;
  const isOpen=r=>r&&(X.openTypes||[]).includes(r.t);
  const outside=r=>r&&(X.outsideVoids||[]).includes(r.label)?null:r;
  const slab=-0.6*S;

  // Böden: je Raum eine Platte; Lufträume als dunkle Grube, Glasdächer durchsichtig, Rampen schräg
  rooms.forEach((r,i)=>{
    const y1=0.2+i*0.06;
    if(isVoid(r)){colliders.push([r.x,r.y,r.x+r.w,r.y+r.h,0]);const p=box(g,r.x,r.y,r.x+r.w,r.y+r.h,slab-2*S,slab-1.95*S,mat('floor-void',{opacity:.85}),false);if(p)p.renderOrder=1;return;}
    if(r.t==='glass'){
      if((X.pyramids||[]).includes(r.label)){const mn=Math.min(r.w,r.h),py=new THREE.Mesh(new THREE.ConeGeometry(mn/2*Math.SQRT2,3*S,4,1,true),mat('glass',{opacity:.3,roughness:.1,side:THREE.DoubleSide}));
        py.rotation.y=Math.PI/4;py.position.set(r.x+r.w/2,1.5*S,r.y+r.h/2);g.add(py);
        const ed=new THREE.LineSegments(new THREE.EdgesGeometry(py.geometry),new THREE.LineBasicMaterial({color:col('ink-2')}));ed.rotation.copy(py.rotation);ed.position.copy(py.position);g.add(ed);}
      const p=box(g,r.x,r.y,r.x+r.w,r.y+r.h,0,y1,mat('floor-glass',{opacity:.55,roughness:.1}),false);if(p)p.renderOrder=2;return;}
    const ftype=r.t==='void'?'void':r.t;
    const m=r.gm?mat('floor-'+ftype,{roughness:.95,emissive:col('hidden'),emissiveIntensity:.18}):mat('floor-'+ftype,{roughness:.95});
    if((X.ramps||[]).includes(r.label)){
      box(g,r.x,r.y,r.x+r.w,r.y+r.h,slab,0,mat('line-2'),false);
      const hN=H.wall,v=[r.x,hN,r.y, r.x+r.w,hN,r.y, r.x+r.w,y1,r.y+r.h, r.x,y1,r.y+r.h];
      const geo=new THREE.BufferGeometry();geo.setAttribute('position',new THREE.Float32BufferAttribute(v,3));geo.setIndex([0,3,1,1,3,2]);geo.computeVertexNormals();
      const rm=new THREE.Mesh(geo,mat('floor-'+ftype,{roughness:.95,side:THREE.DoubleSide}));rm.receiveShadow=true;g.add(rm);return;}
    box(g,r.x,r.y,r.x+r.w,r.y+r.h,slab,y1,m,false);
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
      const A=outside(hz?roomAt(rooms,m,c-1):roomAt(rooms,c-1,m)),B=outside(hz?roomAt(rooms,m,c+1):roomAt(rooms,c+1,m));
      let kind;
      if(A===B)kind=null;
      else if(isOpen(A)&&isOpen(B))kind=null;
      else if((A&&A.t==='void')||(B&&B.t==='void'))kind=X.voidIsFloor?null:'rail';
      else if((A&&A.t==='vault')||(B&&B.t==='vault'))kind='vault';
      else if((isGlass(A)&&isOut(B))||(isGlass(B)&&isOut(A)))kind='glass';
      else if(isOut(A)&&isOut(B))kind=A&&B?null:(X.parapet?'parapet':'rail');
      else kind='wall';
      const op=ln.ops.find(o=>m>o.a&&m<o.b);
      if(!kind&&!op)continue;
      const last=pieces[pieces.length-1];
      if(last&&last.b===a&&last.kind===kind&&last.op===op)last.b=b;else pieces.push({a,b,kind:kind||'none',op});
    }
    pieces.forEach((p,i)=>{
      const prevOp=i>0&&pieces[i-1].b===p.a&&pieces[i-1].op,nextOp=i<pieces.length-1&&pieces[i+1].a===p.b&&pieces[i+1].op;
      const ext=p.op?0:(p.kind==='vault'?6:T/2);const a=p.a-(prevOp?0:ext),b=p.b+(nextOp?0:ext);
      wallPiece(g,hz,c,a,b,p.kind,p.op&&p.op.o,{H,top,T,clampTop,gm,lid:L.id});
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

  // Nachts: warme Raumleuchten in den größten Räumen, grünliches Licht in Glasräumen
  if(state.night){const big=rooms.filter(r=>['public','private','outdoor','secure','drive','service'].includes(r.t)).sort((a,b)=>b.w*b.h-a.w*a.h).slice(0,6);
    big.forEach(r=>{const green=isGlass(r)||r.t==='outdoor';const pl=new THREE.PointLight(green?0x9fe0b0:0xffc98a,green?.7:.9,Math.max(r.w,r.h)*1.3,1.6);pl.position.set(r.x+r.w/2,2.8*S,r.y+r.h/2);g.add(pl);});}

  // Übergänge zu anderen Ebenen: farbige Bodenfläche, beim Begehen mit Schild
  linksOn(L.id).forEach(({link,r})=>{const c='r-'+link.c;const p=box(g,r[0],r[1],r[0]+r[2],r[1]+r[3],0,2.4,mat(c,{opacity:.45,emissive:col(c),emissiveIntensity:.4}),false);if(p)p.renderOrder=3;
    if(walk.on){const s=sprite(g,tr(link.name),{world:9,bg:css(c),fg:'#fff',upper:false});s.position.set(r[0]+r[2]/2,H.wall+.5*S,r[1]+r[3]/2);}});

  // Raumbeschriftung
  if(state.labels)rooms.forEach(r=>{if(!r.label)return;
    const s=sprite(g,tr(r.label),{world:r.small?11:16,bg:css('surface'),fg:css('ink'),depthTest:walk.on});
    s.position.set(r.lx??(r.x+r.w/2),top+(r.small?14:22),r.ly??(r.y+r.h/2));s.renderOrder=20;
  });

  // Nummern (anklickbar)
  pickables=[];
  (L.marks||[]).forEach(m=>{if(m.gm&&!gm)return;
    const hl=selected===m.n;
    const s=sprite(g,String(m.n),{round:true,world:22,size:56,weight:700,bg:hl?css('accent'):css('surface'),fg:hl?css('surface'):css('ink'),ring:m.gm?css('gmnote'):css('ink'),depthTest:walk.on,renderOrder:30});
    const y=top+40;s.position.set(m.x,y,m.y);s.userData.n=m.n;pickables.push(s);
    const pin=new THREE.Mesh(new THREE.CylinderGeometry(.8,.8,y,6),new THREE.MeshBasicMaterial({color:col('ink'),transparent:true,opacity:.35}));pin.position.set(m.x,y/2,m.y);g.add(pin);
  });
  return g;
}

function wallPiece(g,hz,c,a,b,kind,o,{H,top,T,clampTop,gm,lid}){
  // block: Bauteil steht am Boden und versperrt den Weg (Türblätter, Glastüren und Schranken lassen durch)
  const seg=(y0,y1,m,t=T,sh=true,block=true)=>{if(block&&y0<=0)colliders.push(hz?[a,c-t/2,b,c+t/2,m.transparent?0:1]:[c-t/2,a,c+t/2,b,m.transparent?0:1]);return hz?box(g,a,c-t/2,b,c+t/2,y0,clampTop(y1),m,sh):box(g,c-t/2,a,c+t/2,b,y0,clampTop(y1),m,sh);};
  const glass=mat('glass',{opacity:.28,roughness:.1,metalness:.1}),wall=mat('wall',{roughness:.7}),frame=mat('ink-2');
  if(!o){
    if(kind==='wall')seg(0,H.wall,wall);
    else if(kind==='vault')seg(0,H.wall,mat('floor-vault',{roughness:.5,emissive:col('astral'),emissiveIntensity:.25}),12);
    else if(kind==='parapet')seg(0,H.rail,wall,8);
    else if(kind==='glass'){seg(0,H.wall,glass,2,false);seg(H.wall-6,H.wall,frame,4);}
    else if(kind==='rail'){seg(0,H.rail,glass,2,false);seg(H.rail-3,H.rail,frame,4);}
    return;
  }
  const k=o.k||'door',solid=kind==='wall'||kind==='vault';
  const lintel=(y)=>{if(solid)seg(y,H.wall,wall);else if(kind==='glass')seg(y,H.wall,glass,2,false);};
  const leaf=(m,block=false)=>seg(0,H.door,m,2.5,true,block);
  switch(k){
    case 'open':if(solid)seg(H.open,H.wall,wall);break;
    case 'glass':lintel(H.door);seg(0,H.door,glass,2,false,false);break;
    case 'window':seg(0,H.sill,solid?wall:glass,solid?T:2);seg(H.sill,H.door,glass,2,false);lintel(H.door);break;
    case 'hidden':{seg(0,H.wall,gm?mat('wall',{emissive:col('hidden'),emissiveIntensity:.55}):wall,T,true,!gm);break;}// die SL kennt den Weg
    case 'lift':lintel(H.door);leaf(mat('line-2',{metalness:.6,roughness:.35}));break;
    case 'fire':lintel(H.door);leaf(mat('sec',{roughness:.6}));break;
    case 'mech':lintel(H.door);leaf(mat('venn',{roughness:.6}));break;
    // Gesicherte Türen: verriegelt sperren sie in der Spieleransicht; die SL öffnet sie per Klick (Reader leuchtet dann grün)
    case 'reader':case 'vault':case 'secure':{lintel(H.door);
      const key=lid+':'+o.x+','+o.y,open=openDoors.has(key);
      const lf=leaf(open?mat('r-public',{opacity:.18}):k==='reader'?mat('line-2'):mat('wall',{metalness:.5,roughness:.4}),!open&&!gm);
      if(lf){lf.userData.door=key;doorPicks.push(lf);}
      if(k==='reader'){const p=hz?[a-3,c-5,a+3,c+5]:[c-5,a-3,c+5,a+3],lc=open?'r-public':'sec';box(g,p[0],p[1],p[2],p[3],H.sill+4,Math.min(H.sill+14,top),mat(lc,{emissive:col(lc),emissiveIntensity:.8}),false);}
      break;}
    case 'gate':lintel(H.door);seg(0,H.door,mat('ink-2',{opacity:.55}),2,false,false);break;
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
function item(g,it,ctx){
  const {S,H,top,gm,L}=ctx;
  // Wachen, Kade, Venn und Drohnen als eigene Gruppe, damit Patrouillen sie bewegen können
  if(['guard','kade','venn','droneR','droneW'].includes(it.k)&&!it._local){
    if(it.k==='venn'&&it.gm&&state.patrol)return;// Venns Rückzugsort zeigt die Patrouille selbst
    const a=new THREE.Group();item(a,Object.assign({},it,{x:0,y:0,_local:true}),ctx);a.position.set(it.x,0,it.y);g.add(a);
    actors.push({k:it.k,gm:!!it.gm,obj:a,x:it.x,z:it.y,dir:Math.PI/2});return;}
  const fh=(h)=>Math.min(h,top+0.4*S);
  switch(it.k){
    case 'rect':{
      if(it.cls==='lz'){const p=box(g,it.x,it.y,it.x+it.w,it.y+it.h,0,1.5,mat('accent',{opacity:.3}),false);if(p)p.renderOrder=3;break;}// Landezone: nur Bodenmarkierung
      if(it.cls==='outline'){if(!gm)break;const m=mat('hidden',{opacity:.16});const b=box(g,it.x,it.y,it.x+it.w,it.y+it.h,H.wall-.5*S,H.wall,m,false);if(b)b.renderOrder=3;break;}
      const thin=Math.min(it.w,it.h)<=12,dark=it.cls==='furn-dark';
      const lbl=(it.lbl||'').toLowerCase();
      let h=dark?(thin?2.0*S:1.0*S):.78*S;if(lbl.startsWith('bühne'))h=.45*S;if(lbl==='bar')h=1.1*S;if(lbl==='buffet')h=.9*S;
      box(g,it.x,it.y,it.x+it.w,it.y+it.h,0,fh(h),mat(dark?'line-2':'surface',{roughness:.8}));break;}
    case 'plinth':box(g,it.x,it.y,it.x+it.w,it.y+it.h,0,1.0*S,mat('surface'));
      {const s=Math.min(it.w,it.h)*.55;box(g,it.x+it.w/2-s/2,it.y+it.h/2-s/2,it.x+it.w/2+s/2,it.y+it.h/2+s/2,1.0*S,1.0*S+s*.9,mat(it.dark?'line-2':'venn',{roughness:.4,metalness:.3}));
        if(it.aura&&gm){const a=box(g,it.x-4,it.y-4,it.x+it.w+4,it.y+it.h+4,0,1.6*S,mat('astral',{opacity:.22,emissive:col('astral'),emissiveIntensity:.5}),false);if(a)a.renderOrder=3;}
        if(it.star&&gm){const st=new THREE.Mesh(new THREE.OctahedronGeometry(6),mat('venn',{emissive:col('venn'),emissiveIntensity:1}));st.position.set(it.x+it.w/2,1.0*S+s+12,it.y+it.h/2);g.add(st);}}break;
    case 'crate':box(g,it.x,it.y,it.x+it.w,it.y+it.h,0,fh(1.0*S),mat('floor-service',{roughness:.9}));break;
    case 'tree':{const r=it.r||9;const t=new THREE.Mesh(new THREE.CylinderGeometry(1.5,2,1.2*S,6),mat('ink-2'));t.position.set(it.x,.6*S,it.y);g.add(t);
      const c=new THREE.Mesh(new THREE.SphereGeometry(r,12,8),mat('plant',{roughness:.9}));c.position.set(it.x,1.2*S+r*.6,it.y);c.castShadow=true;g.add(c);break;}
    case 'circle':{if(it.cls==='glyph-fill'){const h=fh(Math.min(2.4*S,it.r*2.2));const c=new THREE.Mesh(new THREE.CylinderGeometry(it.r,it.r,h,20),mat('line-2',{metalness:.3,roughness:.5}));c.position.set(it.x,h/2,it.y);c.castShadow=true;g.add(c);break;}
      if(it.cls==='glyph'){const ring=new THREE.Mesh(new THREE.RingGeometry(it.r-1.5,it.r,40),new THREE.MeshBasicMaterial({color:col('ink'),side:THREE.DoubleSide}));ring.rotation.x=-Math.PI/2;ring.position.set(it.x,1,it.y);g.add(ring);}
      else{const c=new THREE.Mesh(new THREE.CylinderGeometry(it.r,it.r,.45*S,14),mat('surface'));c.position.set(it.x,.225*S,it.y);c.castShadow=true;g.add(c);}break;}
    case 'guests':{if(!state.guests)break;const rnd=seeded(it.seed||7);const look=seeded((it.seed||7)*31+5);// eigene Folge, damit die Positionen wie im 2-D-Plan bleiben
      for(let i=0;i<(it.n||12);i++){const x=it.x+rnd()*it.w,z=it.y+rnd()*it.h;guest(g,x,z,S,look);}break;}
    case 'guard':guardFig(g,it.x,it.y,S);break;
    case 'kade':kadeFig(g,it.x,it.y,S);break;
    case 'venn':vennFig(g,it.x,it.y,S);break;
    case 'staff':person(g,it.x,it.y,'r-staff',S,it.t||'');break;
    case 'cam':{sensors.push({k:'cam',x:it.x,z:it.y,a:(it.a??0)*Math.PI/180,len:it.len??60,spread:(it.spread??24)*Math.PI/180});const y=Math.min(2.8*S,H.wall-4);box(g,it.x-3,it.y-3,it.x+3,it.y+3,y-4,y+2,mat('sec'),false);sector(g,it.x,it.y,it.a??0,it.len??60,it.spread??24,'sec',y,.2,.07);break;}
    case 'motion':sensors.push({k:'motion',x:it.x,z:it.y,a:(it.a||0)*Math.PI/180,len:it.r||34,spread:(it.spread||40)*Math.PI/180});sector(g,it.x,it.y,it.a||0,it.r||34,it.spread||40,'hidden',0,.28,0);break;
    case 'blind':{const b=box(g,it.x,it.y,it.x+it.w,it.y+it.h,0,3,mat('hidden',{opacity:.25}),false);break;}
    // beim Begehen steht man in der Treppe: Stufen dann durchscheinend
    case 'stair':{const sm=walk.on?mat('surface-2',{opacity:.3}):mat('surface-2');const v=it.dir!=='h',len=v?it.h:it.w,n=Math.max(4,Math.floor(len/8)),step=len/n,rise=H.wall/n;
      for(let i=0;i<n;i++){const y1=rise*(i+1);if(v){const z0=it.y+it.h-step*(i+1);box(g,it.x+2,z0,it.x+it.w-2,z0+step,0,y1,sm,!walk.on);}else{const x0=it.x+step*i;box(g,x0,it.y+2,x0+step,it.y+it.h-2,0,y1,sm,!walk.on);}}break;}
    case 'spiral':{const p=new THREE.Mesh(new THREE.CylinderGeometry(2.5,2.5,H.wall,8),mat('ink-2'));p.position.set(it.x,H.wall/2,it.y);g.add(p);
      const n=14;for(let i=0;i<n;i++){const st=new THREE.Mesh(new THREE.BoxGeometry(it.r,3,9),walk.on?mat('surface-2',{opacity:.4}):mat('surface-2'));const a=i*Math.PI*2/12;st.position.set(it.x+Math.cos(a)*it.r/2,(i+1)*H.wall/n,it.y+Math.sin(a)*it.r/2);st.rotation.y=-a;st.castShadow=true;g.add(st);}break;}
    case 'shaft':box(g,it.x+2,it.y+2,it.x+it.w-2,it.y+it.h-2,0,.3,new THREE.MeshBasicMaterial({color:0x05070a}),false);break;
    case 'lift':box(g,it.x+4,it.y+4,it.x+it.w-4,it.y+it.h-4,0,.4,mat('ink-2',{metalness:.5,roughness:.4}),false);break;
    case 'ladder':{const L2=it.len||30,hgt=4*S;const along=it.dir==='h';const x0=it.x,z0=it.y;
      const rails=along?[[x0,z0],[x0+L2,z0]]:[[x0,z0],[x0,z0+L2]];
      rails.forEach(([x,z])=>box(g,x-1,z-1,x+1,z+1,0,hgt,mat('ink-2'),false));
      for(let y=10;y<hgt;y+=10)along?box(g,x0,z0-1,x0+L2,z0+1,y,y+1.5,mat('ink-2'),false):box(g,x0-1,z0,x0+1,z0+L2,y,y+1.5,mat('ink-2'),false);break;}
    case 'fireplace':box(g,it.x-16,it.y-6,it.x+16,it.y+6,0,fh(1.1*S),mat('line-2'));box(g,it.x-8,it.y-7,it.x+8,it.y-5,4,14,mat('drone',{emissive:col('drone'),emissiveIntensity:1.2}),false);break;
    case 'key':box(g,it.x-9,it.y-6,it.x+9,it.y+6,.78*S,.78*S+4,mat('venn',{emissive:col('venn'),emissiveIntensity:.8}),false);break;
    // Drohnen: Rotordrohne als flaches Kreuz mit vier Rotoren, Wachdrohne als Sechseck-Scheibe mit rotem Auge
    case 'droneR':{const y=1.6*S,m=mat('drone',{roughness:.5});box(g,it.x-7,it.y-1.2,it.x+7,it.y+1.2,y,y+1.6,m,true);box(g,it.x-1.2,it.y-7,it.x+1.2,it.y+7,y,y+1.6,m,true);
      [[-7,-7],[7,-7],[-7,7],[7,7]].forEach(([dx,dz])=>{const r=new THREE.Mesh(new THREE.CylinderGeometry(3.5,3.5,.6,12),mat('ink-2',{opacity:.6}));r.position.set(it.x+dx*.75,y+2,it.y+dz*.75);g.add(r);});break;}
    case 'droneW':{const d=new THREE.Mesh(new THREE.CylinderGeometry(8,8,4,6),mat('drone',{roughness:.5}));d.position.set(it.x,1.2*S,it.y);d.castShadow=true;g.add(d);
      const eye=new THREE.Mesh(new THREE.SphereGeometry(2.5,10,8),mat('sec',{emissive:col('sec'),emissiveIntensity:1}));eye.position.set(it.x,1.2*S-2.5,it.y);g.add(eye);break;}
    case 'car':{const v=it.h>it.w,m=mat('surface-2',{metalness:.45,roughness:.35}),gl=mat('ink-2',{roughness:.2,metalness:.4});
      box(g,it.x,it.y,it.x+it.w,it.y+it.h,.2*S,.85*S,m);
      if(v)box(g,it.x+2,it.y+it.h*.28,it.x+it.w-2,it.y+it.h*.72,.85*S,1.4*S,gl);else box(g,it.x+it.w*.28,it.y+2,it.x+it.w*.72,it.y+it.h-2,.85*S,1.4*S,gl);break;}
    case 'rack':box(g,it.x,it.y,it.x+it.w,it.y+it.h,0,fh(2.0*S),mat('line-2'));break;
    case 'pool':box(g,it.x,it.y,it.x+it.w,it.y+it.h,0,1,mat('glass',{opacity:.6}),false);break;
    // Astrale Barriere: durchscheinende Hülle um den ganzen Raum (nur SL)
    case 'barrier':{const b=box(g,it.x+3,it.y+3,it.x+it.w-3,it.y+it.h-3,0,H.wall+.4*S,mat('astral',{opacity:.1,emissive:col('astral'),emissiveIntensity:.6}),false);if(b)b.renderOrder=3;break;}
    case 'watcher':{const pts=it.pts;const shp=new THREE.Shape(pts.map(p=>new THREE.Vector2(p[0],p[1])));const m=new THREE.Mesh(new THREE.ShapeGeometry(shp),mat('astral',{opacity:.25,side:THREE.DoubleSide}));m.rotation.x=Math.PI/2;m.position.y=1.5;m.renderOrder=3;g.add(m);
      const cx=pts.reduce((a,p)=>a+p[0],0)/pts.length,cz=pts.reduce((a,p)=>a+p[1],0)/pts.length;const o=new THREE.Mesh(new THREE.SphereGeometry(7,16,12),mat('astral',{opacity:.7,emissive:col('astral'),emissiveIntensity:1.2}));o.position.set(cx,2*S,cz);g.add(o);break;}
    // Drucksensorplatte, Lichtschranke, RFID-Schleuse
    case 'plate':{const p=box(g,it.x,it.y,it.x+it.w,it.y+it.h,0,2,mat('sec',{opacity:.35}),false);if(p)p.renderOrder=3;break;}
    case 'beam':{const m=mat('sec',{emissive:col('sec'),emissiveIntensity:1.5});const x0=Math.min(it.x1,it.x2),x1=Math.max(it.x1,it.x2),z0=Math.min(it.y1,it.y2),z1=Math.max(it.y1,it.y2);[.5,1.1].forEach(h=>box(g,x0-.6,z0-.6,x1+.6,z1+.6,h*S,h*S+1.2,m,false));break;}
    case 'rfid':{const m=mat('hidden',{opacity:.7});[[it.x,it.y],[it.x+it.w,it.y],[it.x,it.y+it.h],[it.x+it.w,it.y+it.h]].forEach(([x,z])=>box(g,x-1.5,z-1.5,x+1.5,z+1.5,0,2.2*S,m,false));break;}
    case 'duct':{const y=2.75*S;for(let i=0;i<it.pts.length-1;i++){const a=it.pts[i],b=it.pts[i+1];box(g,Math.min(a[0],b[0])-5,Math.min(a[1],b[1])-5,Math.max(a[0],b[0])+5,Math.max(a[1],b[1])+5,y,y+10,mat('line-2',{metalness:.5,roughness:.4}));}break;}
    case 'grille':box(g,it.x-5,it.y-7,it.x+5,it.y+7,2.6*S,2.6*S+3,mat('ink-2'),false);break;
    case 'hatch':box(g,it.x-7,it.y-7,it.x+7,it.y+7,0,1.2,mat(it.gm?'hidden':'ink-2'),false);break;
    // Linien aus dem Plan: Stellplatzmarkierung, Schranken; die Glaslinien ersetzt die Glasfläche
    case 'line':{const x0=Math.min(it.x1,it.x2),x1=Math.max(it.x1,it.x2),z0=Math.min(it.y1,it.y2),z1=Math.max(it.y1,it.y2);
      if(it.cls==='rail')box(g,x0-.8,z0-.8,x1+.8,z1+.8,0,1.2,mat('surface'),false);
      else if(it.cls==='gateline'){box(g,x0-1,z0-1,x1+1,z1+1,1.0*S,1.0*S+2.5,mat('venn'),false);box(g,x0-2,z0-2,x0+2,z0+2,0,1.0*S,mat('ink-2'),false);}
      break;}
    case 'rail':{for(let i=0;i<it.pts.length-1;i++){const a=it.pts[i],b=it.pts[i+1];const x0=Math.min(a[0],b[0]),x1=Math.max(a[0],b[0]),z0=Math.min(a[1],b[1]),z1=Math.max(a[1],b[1]);
      box(g,x0-1,z0-1,x1+1,z1+1,0,H.rail,mat('glass',{opacity:.28,roughness:.1}),false);box(g,x0-2,z0-2,x1+2,z1+2,H.rail-3,H.rail,mat('ink-2'),false);}break;}
    case 'mast':{const m=new THREE.Mesh(new THREE.CylinderGeometry(1.2,2.5,7*S,8),mat('ink-2',{metalness:.5}));m.position.set(it.x,3.5*S,it.y);m.castShadow=true;g.add(m);
      const l=new THREE.Mesh(new THREE.SphereGeometry(2.5,10,8),mat('sec',{emissive:col('sec'),emissiveIntensity:1.5}));l.position.set(it.x,7*S,it.y);g.add(l);break;}
    // Landeplattform: flache Scheibe, Ring, H, Randlichter
    case 'pad':{const d=new THREE.Mesh(new THREE.CylinderGeometry(it.r,it.r,.3*S,48),mat('line-2',{roughness:.7}));d.position.set(it.x,.15*S,it.y);d.receiveShadow=true;g.add(d);
      const ring=new THREE.Mesh(new THREE.RingGeometry(it.r*.68,it.r*.72,64),new THREE.MeshBasicMaterial({color:col('venn'),side:THREE.DoubleSide}));ring.rotation.x=-Math.PI/2;ring.position.set(it.x,.3*S+.5,it.y);g.add(ring);
      const cv=document.createElement('canvas');cv.width=cv.height=128;const c2=cv.getContext('2d');c2.fillStyle=css('venn');c2.font='700 110px "Barlow Condensed",sans-serif';c2.textAlign='center';c2.textBaseline='middle';c2.fillText('H',64,70);
      const h=new THREE.Mesh(new THREE.PlaneGeometry(it.r*.9,it.r*.9),new THREE.MeshBasicMaterial({map:new THREE.CanvasTexture(cv),transparent:true}));h.rotation.x=-Math.PI/2;h.position.set(it.x,.3*S+.6,it.y);g.add(h);
      for(let i=0;i<12;i++){const a=i*Math.PI/6;const l=new THREE.Mesh(new THREE.SphereGeometry(2,8,6),mat('venn',{emissive:col('venn'),emissiveIntensity:1.2}));l.position.set(it.x+Math.cos(a)*(it.r+6),2,it.y+Math.sin(a)*(it.r+6));g.add(l);}break;}
  }
}

/* ---------- Begehen: Ich-Perspektive in Augenhöhe, Wände und Geländer halten auf ---------- */
const walk={on:false,yaw:0,pitch:0,keys:new Set(),pad:new Set(),last:0,portal:null};
const eye=()=>1.65*(level().scale||20);
function blocked(x,z){const r=.28*(level().scale||20);return colliders.some(c=>x+r>c[0]&&x-r<c[2]&&z+r>c[1]&&z-r<c[3]);}
function placeAt(x,z){
  // liegt der Punkt in einer Wand, im näheren Umkreis einen freien suchen
  for(let d=0;d<=60;d+=4)for(let i=0;i<(d?16:1);i++){const a=i*Math.PI/8,px=x+Math.cos(a)*d,pz=z+Math.sin(a)*d;if(!blocked(px,pz)){camera.position.set(px,eye(),pz);return true;}}
  return false;
}
function spawn(){
  const L=level(),r=(L.routes||[]).find(r=>state.gm||!r.gm);
  const p0=r?r.pts[0]:[L.plate[0]+L.plate[2]/2,L.plate[1]+L.plate[3]/2],p1=r&&r.pts[1];
  walk.yaw=p1?Math.atan2(-(p1[0]-p0[0]),-(p1[1]-p0[1])):0;walk.pitch=0;
  placeAt(p0[0],p0[1]);camera.rotation.set(walk.pitch,walk.yaw,0,'YXZ');
}
function setWalk(on){
  if(!controls||walk.on===on)return;
  walk.on=on;walk.keys.clear();walk.pad.clear();controls.enabled=!on;
  camera.fov=on?72:38;camera.near=on?2:5;camera.updateProjectionMatrix();
  rebuild();if(on){spawn();renderer.domElement.focus();}else{camera.rotation.order='XYZ';frameView(false);}
  det.seen=null;noteN=null;renderUI();renderAlert();renderNote();applyMood();
}
function stepWalk(dt){
  const S=level().scale||20,k=walk.keys,p=walk.pad,has=(...c)=>c.some(x=>k.has(x)||p.has(x));
  const fwd=(has('KeyW','ArrowUp','f')?1:0)-(has('KeyS','ArrowDown','b')?1:0);
  const side=(has('KeyD')?1:0)-(has('KeyA')?1:0);
  walk.yaw+=((has('ArrowLeft','l')?1:0)-(has('ArrowRight','r')?1:0))*1.9*dt;
  const n=Math.hypot(fwd,side)||1,sp=(has('ShiftLeft','ShiftRight')?3.4:1.6)*S*dt/n;
  const dx=(-Math.sin(walk.yaw)*fwd+Math.cos(walk.yaw)*side)*sp,dz=(-Math.cos(walk.yaw)*fwd-Math.sin(walk.yaw)*side)*sp;
  const c=camera.position;if(dx&&!blocked(c.x+dx,c.z))c.x+=dx;if(dz&&!blocked(c.x,c.z+dz))c.z+=dz;
  c.y=eye();camera.rotation.set(walk.pitch,walk.yaw,0,'YXZ');
  const here=linksOn(state.cur).find(({r})=>c.x>r[0]&&c.x<r[0]+r[2]&&c.z>r[1]&&c.z<r[1]+r[3]);
  if((here&&here.link)!==walk.portal){walk.portal=here?here.link:null;renderPortal();}
  watch();placeNote();
  drawMini();
}
/* ---------- Beobachtung: Kameras, Bewegungsmelder und patrouillierende Wachen ---------- */
const det={seen:null,count:0};
function sees(s,px,pz){
  const dx=px-s.x,dz=pz-s.z,d=Math.hypot(dx,dz);if(d>s.len)return false;
  let da=Math.atan2(dz,dx)-s.a;da=Math.atan2(Math.sin(da),Math.cos(da));if(Math.abs(da)>s.spread)return false;
  // Sichtlinie: undurchsichtige Wände dazwischen verdecken (Glas nicht)
  // die Wand, an der die Kamera hängt, zählt nicht
  const near=c=>Math.hypot(Math.max(c[0]-s.x,0,s.x-c[2]),Math.max(c[1]-s.z,0,s.z-c[3]))<8;
  const walls=colliders.filter(c=>c[4]&&!near(c));
  const n=Math.ceil(d/4);for(let i=1;i<n;i++){const t=i/n,x=s.x+dx*t,z=s.z+dz*t;if(walls.some(c=>x>c[0]&&x<c[2]&&z>c[1]&&z<c[3]))return false;}
  return true;
}
function watch(){
  const c=camera.position,S=level().scale||20;
  let by=sensors.find(s=>sees(s,c.x,c.z));
  if(!by&&state.patrol)by=actors.filter(a=>a.moving&&(a.k==='guard'||a.k==='kade')).map(a=>({k:a.k,x:a.x,z:a.z,a:a.dir,len:7*S,spread:.6})).find(s=>sees(s,c.x,c.z));
  const k=by?by.k:null;if(k===det.seen)return;
  if(k&&!det.seen)det.count++;det.seen=k;renderAlert();
}
function renderAlert(){
  const t=UI[lang],fx=document.getElementById('alertfx'),hud=document.getElementById('alerthud');
  fx.classList.toggle('on',!!det.seen&&walk.on);hud.hidden=!walk.on;hud.classList.toggle('hot',!!det.seen);
  hud.title=t.alertReset;hud.innerHTML=`${esc(t.alert)} <b>${det.count}</b>${det.seen?` · ${esc(t.seen)}: ${esc(t.seenBy[det.seen]||det.seen)}`:''}`;
}
// Ortsnotizen: in der Nähe einer Nummer erscheint ihr Text
let noteN=null;
function placeNote(){
  const L=level(),c=camera.position,S=L.scale||20;
  const m=(L.marks||[]).filter(m=>state.gm||!m.gm).map(m=>({m,d:Math.hypot(m.x-c.x,m.y-c.z)})).filter(o=>o.d<3.5*S).sort((a,b)=>a.d-b.d)[0];
  const n=m?m.m.n:null;if(n===noteN)return;noteN=n;renderNote();
}
function renderNote(){
  const el=document.getElementById('note'),L=level(),s=noteN&&(L.spots||[]).find(s=>s.n===noteN);
  el.hidden=!s||!walk.on;if(el.hidden)return;const sp=spotOf(L,s);
  el.innerHTML=`<b><span>${sp.n}</span>${esc(sp.t)}</b><p>${esc(sp.p)}</p>${state.gm&&sp.g?`<p class="g" data-l="${UI[lang].gmTag}">${esc(sp.g)}</p>`:''}`;
}
// Patrouillen (Zeit gerafft): Kade zieht seine Runde Foyer → Salon → Galerie, eine Wache umrundet das Atrium,
// Venn zieht sich regelmäßig in den Wintergarten zurück, der Rollbot fährt die Fahrgasse ab.
// i = Nummer der Figur dieser Art auf der Ebene (ohne SL-Figuren); loop = Rundkurs, sonst hin und zurück; wait = Sekunden an den Punkten
const PATROLS={
 '111':[
  {k:'kade',i:0,speed:1.3,wait:{0:6,7:8},pts:[[230,640],[410,640],[410,520],[540,490],[660,440],[790,440],[790,300],[870,330]]},
  {k:'guard',i:2,speed:1.1,loop:true,pts:[[352,245],[650,215],[675,330],[650,455],[395,455],[352,245]]},
  {k:'venn',i:0,speed:.9,wait:{0:55,3:15},pts:[[822,328],[820,262],[820,200],[870,178]]},
 ],
 'garage':[{k:'droneR',i:0,speed:1.6,wait:{0:4,1:4},pts:[[300,350],[930,350]]}],
};
function updatePatrols(dt){
  const defs=state.patrol&&PATROLS[state.cur];actors.forEach(a=>a.moving=false);if(!defs)return;
  const S=level().scale||20;
  defs.forEach(d=>{
    const a=actors.filter(x=>x.k===d.k)[d.i];if(!a)return;
    const rt=d._rt||(d._rt={i:1,dir:1,wait:(d.wait||{})[0]||0,x:d.pts[0][0],z:d.pts[0][1]});
    if(rt.wait>0)rt.wait-=dt;
    else{const [tx,tz]=d.pts[rt.i],dx=tx-rt.x,dz=tz-rt.z,dist=Math.hypot(dx,dz),step=d.speed*S*dt;
      if(dist<=step){rt.x=tx;rt.z=tz;rt.wait=(d.wait||{})[rt.i]||0;
        if(d.loop)rt.i=(rt.i+1)%d.pts.length;else{if(rt.i+rt.dir<0||rt.i+rt.dir>=d.pts.length)rt.dir=-rt.dir;rt.i+=rt.dir;}}
      else{rt.x+=dx/dist*step;rt.z+=dz/dist*step;a.dir=Math.atan2(dz,dx);a.obj.rotation.y=Math.atan2(dx,dz);a.moving=true;}}
    if(rt.wait>0)a.moving=true;// auch beim Stehen schaut die Figur weiter in ihre Richtung
    a.x=rt.x;a.z=rt.z;a.obj.position.set(rt.x,0,rt.z);
  });
}
/* ---------- Nacht: wenig Grundlicht, Laterne beim Gehen, Blitze über Glasdach und Terrassen ---------- */
let hemi=null,sun=null,lantern=null;const storm={next:4,flash:0};
function applyMood(){
  if(!hemi)return;const n=state.night;
  hemi.intensity=n?.2:.75;sun.intensity=n?.1:.75;lantern.intensity=n&&walk.on?1.1:0;
  scene.background=n?new THREE.Color('#05070c'):col('bg');
}
function updateStorm(dt){
  if(!state.night||!hemi||!['111','112','dach'].includes(state.cur))return;
  storm.next-=dt;if(storm.next<=0){storm.flash=.32;storm.next=6+Math.random()*14;}
  if(storm.flash>0){storm.flash-=dt;const on=storm.flash>.22||(storm.flash>0&&storm.flash<.1);hemi.intensity=on?1.5:.2;scene.background=new THREE.Color(on?'#3a4766':'#05070c');}
}
function shareLink(){
  const c=camera.position,u=new URL(location.href);u.search='';
  const q={lang,level:state.cur};if(walk.on){Object.assign(q,{pos:Math.round(c.x)+','+Math.round(c.z),dir:Math.round(walk.yaw*180/Math.PI),walk:'1'});}
  if(!state.gm)q.view='player';
  Object.entries(q).forEach(([k,v])=>u.searchParams.set(k,v));const url=u.toString(),b=document.getElementById('vShare');
  const done=()=>{b.textContent=UI[lang].shared;setTimeout(()=>{b.textContent=UI[lang].share;},1800);};
  try{navigator.clipboard.writeText(url).then(done,()=>window.prompt(UI[lang].share,url));}catch(e){window.prompt(UI[lang].share,url);}
}
function toggleDoor(key){if(openDoors.has(key))openDoors.delete(key);else openDoors.add(key);state.open=[...openDoors];save();rebuild();}

// Steht man in einem Übergang, bietet ein Schild die anderen Haltepunkte an
function renderPortal(){
  const el=document.getElementById('portal'),l=walk.portal;el.hidden=!l||!walk.on;if(el.hidden)return;
  const cur=ORDER.indexOf(state.cur),name=id=>tr((LEVELS3D.find(L=>L.id===id)||{}).name||id);
  const dest=stopsOf(l).filter(id=>id!==state.cur);
  el.innerHTML=`<b style="--c:var(--r-${l.c})">${esc(tr(l.name))}</b>`+dest.map((id,i)=>`<button type="button" data-to="${id}"><kbd>${i+1}</kbd>${ORDER.indexOf(id)>cur?'↑':'↓'} ${esc(name(id))}</button>`).join('')+`<small>${esc(UI[lang].portalKeys)}</small>`;
}
function travel(to){
  const l=walk.portal;if(!l||!l.at[to])return;
  state.cur=to;selected=null;save();renderUI();rebuild();
  const r=l.at[to];placeAt(r[0]+r[2]/2,r[1]+r[3]/2);walk.portal=l;renderPortal();
}
// Minikarte oben rechts: Grundriss, Übergänge, eigene Position mit Blickrichtung; Klick springt dorthin
const mini={base:null,k:1,ox:0,oy:0,w:0,h:0};
function drawMiniBase(){
  const cv=document.getElementById('minimap'),L=level();if(!cv)return;
  const [px,py,pw,ph]=L.plate,pad=20,W=Math.min(240,Math.max(150,document.getElementById('stage').clientWidth*.26)),k=W/(pw+2*pad),H=Math.round((ph+2*pad)*k),dpr=Math.min(window.devicePixelRatio||1,2);
  Object.assign(mini,{k,ox:px-pad,oy:py-pad,w:W,h:H});
  cv.width=W*dpr;cv.height=H*dpr;cv.style.width=W+'px';cv.style.height=H+'px';
  const b=document.createElement('canvas');b.width=cv.width;b.height=cv.height;const x=b.getContext('2d');x.scale(dpr*k,dpr*k);x.translate(-mini.ox,-mini.oy);
  x.fillStyle=css('surface');x.fillRect(mini.ox,mini.oy,pw+2*pad,ph+2*pad);
  const X=EXTRA3D[L.id]||{};
  (L.rooms||[]).filter(r=>state.gm||!r.gm).forEach(r=>{if(r.t==='void'&&!X.voidIsFloor){x.fillStyle=css('bg');}else x.fillStyle=css('floor-'+(r.t==='void'?'void':r.t));x.fillRect(r.x,r.y,r.w,r.h);});
  x.fillStyle=css('wall');colliders.forEach(c=>x.fillRect(c[0],c[1],Math.max(3,c[2]-c[0]),Math.max(3,c[3]-c[1])));
  x.fillStyle=css('bg');(L.rooms||[]).filter(r=>r.t==='void'&&!X.voidIsFloor).forEach(r=>x.fillRect(r.x+2,r.y+2,r.w-4,r.h-4));// Lufträume sind auch Hindernisse, aber keine Wände
  linksOn(L.id).forEach(({link,r})=>{x.fillStyle=css('r-'+link.c);x.fillRect(r[0],r[1],r[2],r[3]);});
  x.fillStyle=css('sec');x.globalAlpha=.3;sensors.forEach(s=>{x.beginPath();x.moveTo(s.x,s.z);x.arc(s.x,s.z,s.len,s.a-s.spread,s.a+s.spread);x.closePath();x.fill();});x.globalAlpha=1;
  mini.base=b;
}
function drawMini(){
  const cv=document.getElementById('minimap');if(!cv||!mini.base||!walk.on)return;
  const x=cv.getContext('2d'),dpr=cv.width/mini.w;x.setTransform(1,0,0,1,0,0);x.clearRect(0,0,cv.width,cv.height);x.drawImage(mini.base,0,0);
  const c=camera.position,s=dpr*mini.k,px=(c.x-mini.ox)*s,pz=(c.z-mini.oy)*s,fx=-Math.sin(walk.yaw),fz=-Math.cos(walk.yaw);
  actors.forEach(a=>{x.fillStyle=css({guard:'guard',kade:'kade',venn:'venn'}[a.k]||'drone');x.beginPath();x.arc((a.x-mini.ox)*s,(a.z-mini.oy)*s,3.5*dpr,0,Math.PI*2);x.fill();});
  x.fillStyle=css('accent');x.globalAlpha=.25;x.beginPath();x.moveTo(px,pz);const a=Math.atan2(fz,fx);x.arc(px,pz,60*s,a-.6,a+.6);x.closePath();x.fill();x.globalAlpha=1;
  x.beginPath();x.arc(px,pz,5*dpr,0,Math.PI*2);x.fill();x.strokeStyle=css('surface');x.lineWidth=2*dpr;x.stroke();
}
// Vollbild: echtes Vollbild, wo der Browser es erlaubt; sonst füllt die Bühne das Fenster (z. B. iPhone, eingebettete Ansichten)
const isFull=()=>!!document.fullscreenElement||document.getElementById('stage').classList.contains('max');
function setMax(on){document.getElementById('stage').classList.toggle('max',on);document.documentElement.classList.toggle('noscroll',on);renderUI();if(walk.on)setTimeout(drawMiniBase,50);}
function setFull(on){const st=document.getElementById('stage');
  if(!on){if(document.fullscreenElement)document.exitFullscreen().catch(()=>{});setMax(false);return;}
  const req=st.requestFullscreen||st.webkitRequestFullscreen;
  if(!req||!(document.fullscreenEnabled||document.webkitFullscreenEnabled)){setMax(true);return;}
  try{const p=req.call(st);if(p&&p.catch)p.catch(()=>setMax(true));}catch(e){setMax(true);return;}
  setTimeout(()=>{if(!document.fullscreenElement)setMax(true);},400);// manche Ansichten antworten gar nicht
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
  updatePatrols(0);applyMood();
  if(walk.on)drawMiniBase();
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
  hemi=new THREE.HemisphereLight(0xffffff,0x8892a0,.75);scene.add(hemi);
  lantern=new THREE.PointLight(0xffe2b8,0,14*20,1.5);camera.add(lantern);scene.add(camera);
  sun=new THREE.DirectionalLight(0xffffff,.75);sun.position.set(px-300,900,py-200);sun.target.position.set(px+pw/2,0,py+ph/2);
  sun.castShadow=true;sun.shadow.mapSize.set(2048,2048);Object.assign(sun.shadow.camera,{left:-800,right:800,top:800,bottom:-800,near:10,far:3000});sun.shadow.bias=-.0005;
  scene.add(sun,sun.target);
  rebuild();frameView(false);
  if(startAt)setTimeout(()=>{setWalk(true);if(startAt.x!==undefined){placeAt(startAt.x,startAt.z);walk.yaw=startAt.dir*Math.PI/180;}startAt=null;},0);
  const resize=()=>{const w=stage.clientWidth,h=stage.clientHeight;renderer.setSize(w,h,false);camera.aspect=w/h;camera.updateProjectionMatrix();};
  new ResizeObserver(resize).observe(stage);resize();
  // Klick auf eine Nummer (nicht beim Ziehen)
  let down=null;
  renderer.domElement.addEventListener('pointerdown',e=>{down=[e.clientX,e.clientY];});
  renderer.domElement.addEventListener('pointerup',e=>{if(!down||Math.hypot(e.clientX-down[0],e.clientY-down[1])>5)return;
    const r=renderer.domElement.getBoundingClientRect();const v=new THREE.Vector2((e.clientX-r.left)/r.width*2-1,-(e.clientY-r.top)/r.height*2+1);
    const rc=new THREE.Raycaster();rc.setFromCamera(v,camera);const hit=rc.intersectObjects(pickables)[0];
    if(hit){select(hit.object.userData.n,true);return;}
    if(state.gm){const d=rc.intersectObjects(doorPicks)[0];if(d)toggleDoor(d.object.userData.door);}});
  // Begehen: umsehen per Ziehen, gehen per Tastatur oder Steuerkreuz, Doppelklick springt
  let look=null;
  renderer.domElement.addEventListener('pointerdown',e=>{if(walk.on){look=[e.clientX,e.clientY];try{renderer.domElement.setPointerCapture(e.pointerId);}catch(_){}}});
  renderer.domElement.addEventListener('pointermove',e=>{if(!walk.on||!look)return;walk.yaw-=(e.clientX-look[0])*.0045;walk.pitch=Math.max(-1.2,Math.min(1.2,walk.pitch-(e.clientY-look[1])*.0045));look=[e.clientX,e.clientY];});
  ['pointerup','pointercancel'].forEach(t=>renderer.domElement.addEventListener(t,()=>{look=null;}));
  renderer.domElement.addEventListener('dblclick',e=>{if(!walk.on)return;
    const r=renderer.domElement.getBoundingClientRect();const v=new THREE.Vector2((e.clientX-r.left)/r.width*2-1,-(e.clientY-r.top)/r.height*2+1);
    const rc=new THREE.Raycaster();rc.setFromCamera(v,camera);const S=level().scale||20;
    const hit=rc.intersectObjects(world.children,false).find(h=>h.object.isMesh&&h.face&&h.point.y<.5*S&&h.face.normal.y>.5);
    if(hit)placeAt(hit.point.x,hit.point.z);});
  const mm=document.getElementById('minimap');
  mm.addEventListener('click',e=>{const r=mm.getBoundingClientRect();placeAt(mini.ox+(e.clientX-r.left)/mini.k,mini.oy+(e.clientY-r.top)/mini.k);});
  document.getElementById('portal').addEventListener('click',e=>{const b=e.target.closest('button');if(b)travel(b.dataset.to);});
  const walkKeys=['KeyW','KeyA','KeyS','KeyD','ArrowUp','ArrowDown','ArrowLeft','ArrowRight','ShiftLeft','ShiftRight'];
  window.addEventListener('keydown',e=>{if(!walk.on||e.target.closest&&e.target.closest('input,textarea'))return;if(e.code==='Escape'){if(document.getElementById('stage').classList.contains('max'))setMax(false);else setWalk(false);return;}
    const d=/^(Digit|Numpad)([1-9])$/.exec(e.code);if(d&&walk.portal){const b=document.querySelectorAll('#portal button')[+d[2]-1];if(b){travel(b.dataset.to);e.preventDefault();}return;}if(walkKeys.includes(e.code)){walk.keys.add(e.code);e.preventDefault();}});
  window.addEventListener('keyup',e=>walk.keys.delete(e.code));
  window.addEventListener('blur',()=>walk.keys.clear());
  const pad=document.getElementById('pad');
  pad.addEventListener('pointerdown',e=>{const b=e.target.closest('button');if(b){walk.pad.add(b.dataset.d);e.preventDefault();}});
  ['pointerup','pointerleave','pointercancel'].forEach(t=>pad.addEventListener(t,()=>walk.pad.clear()));
  (function loop(t){requestAnimationFrame(loop);const dt=Math.min(.05,((t||0)-walk.last)/1000)||0;walk.last=t||0;
    updatePatrols(dt);updateStorm(dt);
    if(walk.on)stepWalk(dt);else controls.update();renderer.render(scene,camera);})();
  try{matchMedia('(prefers-color-scheme: dark)').addEventListener('change',rebuild);}catch(e){}
  document.addEventListener('fullscreenchange',()=>{if(document.fullscreenElement)document.getElementById('stage').classList.remove('max');renderUI();if(walk.on)setTimeout(drawMiniBase,100);});
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
  document.getElementById('tabs').innerHTML=LEVELS3D.map(l=>`<button role="tab" data-id="${l.id}" aria-selected="${l.id===state.cur}">${esc(tr(l.name))}<small>${esc(tr(l.sub))}</small></button>`).join('');
  const setT=(id,on,txt)=>{const b=document.getElementById(id);b.setAttribute('aria-pressed',on?'true':'false');b.lastChild.textContent=txt;};
  setT('btnGM',state.gm,state.gm?t.gmOn:t.gmOff);setT('btnRoutes',state.routes,t.routes);setT('btnGuests',state.guests,t.guests);document.getElementById('wallsLbl').textContent=t.walls;document.querySelectorAll('#walls button').forEach(b=>{b.textContent=t.wallSteps[b.dataset.w];b.setAttribute('aria-pressed',b.dataset.w===state.walls?'true':'false');});setT('btnLabels',state.labels,t.labels);
  document.getElementById('langDE').setAttribute('aria-pressed',lang==='de'?'true':'false');document.getElementById('langEN').setAttribute('aria-pressed',lang==='en'?'true':'false');
  const back=document.getElementById('lnk2d');back.textContent=t.back;back.href='meridian-spire-plaene.html?lang='+lang;
  document.getElementById('vReset').textContent=t.reset;document.getElementById('vTop').textContent=t.top;document.getElementById('hint').textContent=(walk.on?t.walkHint:t.hint)+(state.gm?t.doorHint:'');
  setT('btnPatrol',state.patrol,t.patrol);setT('btnNight',state.night,t.night);document.getElementById('vShare').textContent=t.share;
  const vw=document.getElementById('vWalk');vw.textContent=walk.on?t.walkExit:t.walk;vw.setAttribute('aria-pressed',walk.on?'true':'false');
  document.getElementById('pad').hidden=!walk.on;document.getElementById('minimap').hidden=!walk.on;document.getElementById('stage').classList.toggle('walking',walk.on);
  const vf=document.getElementById('vFull');vf.textContent=isFull()?t.fullExit:t.full;vf.setAttribute('aria-pressed',isFull()?'true':'false');
  walk.portal=walk.on?walk.portal:null;renderPortal();document.getElementById('walls').classList.toggle('off',walk.on);
  document.getElementById('mapTitle').innerHTML=`${esc(tr(L.name))}<span>${esc(tr(L.sub))}</span>`;
  document.getElementById('chips').innerHTML=(L.chips||[]).map(c=>`<span class="chip">${esc(tr(c))}</span>`).join('');
  const sw={glass:'glass',guard:'guard',staff:'r-staff',guest:'muted',venn:'venn',kade:'kade',sec:'sec',hidden:'hidden',drone:'drone',astral:'astral'};
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
document.getElementById('btnGuests').addEventListener('click',()=>set('guests',!state.guests));
document.getElementById('btnLabels').addEventListener('click',()=>set('labels',!state.labels));
document.getElementById('btnPatrol').addEventListener('click',()=>{PATROLS[state.cur]&&PATROLS[state.cur].forEach(d=>delete d._rt);set('patrol',!state.patrol);});
document.getElementById('btnNight').addEventListener('click',()=>set('night',!state.night));
document.getElementById('vShare').addEventListener('click',shareLink);
document.getElementById('alerthud').addEventListener('click',()=>{det.count=0;renderAlert();});
document.getElementById('langDE').addEventListener('click',()=>{lang='de';save();renderUI();rebuild();});
document.getElementById('langEN').addEventListener('click',()=>{lang='en';save();renderUI();rebuild();});
document.getElementById('tabs').addEventListener('click',e=>{const b=e.target.closest('button');if(!b||b.dataset.id===state.cur)return;state.cur=b.dataset.id;selected=null;save();renderUI();rebuild();if(controls){if(walk.on)spawn();else frameView(false);}});
document.getElementById('vReset').addEventListener('click',()=>{setWalk(false);frameView(false);});
document.getElementById('vTop').addEventListener('click',()=>{setWalk(false);frameView(true);});
document.getElementById('vWalk').addEventListener('click',()=>setWalk(!walk.on));
document.getElementById('vFull').addEventListener('click',()=>setFull(!isFull()));
window.addEventListener('keydown',e=>{if(e.code==='Escape'&&document.getElementById('stage').classList.contains('max')&&!walk.on)setMax(false);});
document.getElementById('spots').addEventListener('click',e=>{const li=e.target.closest('li');if(li)select(+li.dataset.n,false);});
document.getElementById('spots').addEventListener('keydown',e=>{const li=e.target.closest('li');if(li&&(e.key==='Enter'||e.key===' ')){e.preventDefault();select(+li.dataset.n,false);}});
renderUI();
if(document.fonts&&document.fonts.ready)document.fonts.ready.then(()=>{initGL();});else initGL();
