/* ---------- App: Tabs, Sprache, Ansichten, Druck ---------- */
const LEVELS=[LSCHNITT,LGARAGE,L111,L112,LDACH,L110];
const UI_DE={
 subtitle:'Pläne für Tiefgarage, Penthouse, Dach und Tresorgeschoss · Seattle 2080',tabs:{schnitt:'Vertikale Wege',garage:'Tiefgarage',111:'Gala-Ebene',112:'Lounge & Suite',dach:'Landeplattform',110:'Tresorgeschoss'},
 short:{schnitt:'Schnitt',dach:'Dach'},gmOn:'SL-Ansicht',gmOff:'Spieleransicht',routes:'Wege einblenden',print:'Druckansicht',back:'Zurück zu den Plänen',
 spots:'Orte auf dem Plan',routesH:'Von A nach B',sits:'Spielsituationen',cons:'Vertikale Verbindungen',
 routesHint:'Die Buchstaben markieren den Startpunkt jedes Wegs im Plan. „Wege einblenden“ schaltet das Overlay.',
 consHint:'Kreise = Haltepunkte, rotes Kreuz = Ebene wird passiert, aber nicht erreicht. Gestrichelt = nur Gegenstände oder Seil.',
 th:['Nr.','Verbindung','Von → Nach','Wer','Preis / Risiko'],gmTag:'SL',gmSuffix:' · SL',tbSuffix:'1 Einheit = 1 m · Wände schematisch',sectionTb:'MERIDIAN SPIRE · SCHNITT · vertikale Verbindungen (schematisch, nicht maßstäblich)',
 printGm:'SL-Pläne',printPlayer:'Spielerpläne',printHint:'Eine Ebene pro A4-Querseite. SL-Pläne ergänzen je Ebene ein Notizblatt; Spielerpläne zeigen nur, was die Crew wissen kann. Drucken funktioniert aus der Datei im Repo oder den PDFs, nicht aus der claude.ai-Ansicht.',
 printBtn:'Drucken',orte:'Orte',wege:'Wege',legende:'Legende',notesTitle:'SL-Notizen',playerBadge:'SPIELERPLAN',gmBadge:'SL-PLAN',pageOf:'Blatt',
 fine:'Fan-Material für den privaten Spieltisch. <i>Runners in the Shadows</i> ist ein Spiel von Mark Cleveland Massengale; <i>Shadowrun</i> ist eine Marke von The Topps Company / Catalyst Game Labs. Der Meridian Spire und alle Personen darin sind Eigenkreationen für den Oneshot Feuerprobe.',
};
function T(){return lang==='en'?PLAN_EN.ui:UI_DE;}
function spotOf(L,s){if(lang==='en'){const e=(PLAN_EN.spots[L.id]||{})[s.n];if(e)return Object.assign({},s,e);}return s;}
function routeOf(L,r){if(lang==='en'){const e=(PLAN_EN.routes[L.id]||{})[r.id];if(e)return Object.assign({},r,e);}return r;}
function sitsOf(L){return (lang==='en'&&PLAN_EN.sits[L.id])||L.sits||[];}
function ariaOf(L){return (lang==='en'&&PLAN_EN.aria[L.id])||L.aria||L.name;}
const state={gm:true,routes:true,cur:'111',variant:'gm'};
try{const s=JSON.parse(localStorage.getItem('ms-plaene')||'{}');if(s&&typeof s==='object')Object.assign(state,s);const v=localStorage.getItem('fp-lang');if(v==='en'||v==='de')lang=v;}catch(e){}
let printMode=false;
(function(){try{const q=new URLSearchParams(location.search);const l=q.get('lang');if(l==='en'||l==='de')lang=l;const p=q.get('print');if(p==='gm'||p==='player'){printMode=true;state.variant=p;}}catch(e){}})();
if(!LEVELS.some(l=>l.id===state.cur))state.cur='111';
function save(){try{localStorage.setItem('ms-plaene',JSON.stringify({gm:state.gm,routes:state.routes,cur:state.cur,variant:state.variant}));localStorage.setItem('fp-lang',lang);}catch(e){}}
function esc(s){return String(s??'').replace(/&/g,'&amp;').replace(/</g,'&lt;');}

function card(title,cls){const c=document.createElement('section');c.className='card'+(cls?' '+cls:'');const h=document.createElement('h3');h.textContent=title;c.appendChild(h);return c;}
function buildSpots(L,forPrint){
  const t=T();const c=card(t.spots);const ol=document.createElement('ol');ol.className='spots'+(forPrint?' keygrid':'');
  (L.spots||[]).map(s=>spotOf(L,s)).forEach(s=>{const li=document.createElement('li');li.dataset.n=s.n;if(s.gm)li.classList.add('gmonly');
    li.innerHTML=`<span class="n">${s.n}</span><div><b>${esc(s.t)}</b>${s.p?`<p>${esc(s.p)}</p>`:''}${s.g?`<div class="gmn" data-l="${t.gmTag}">${esc(s.g)}</div>`:''}</div>`;ol.appendChild(li);});
  c.appendChild(ol);return c;
}
function buildRoutes(L){
  const t=T();const c=card(t.routesH);const ul=document.createElement('ul');ul.className='routelist';
  (L.routeText||[]).map(r=>routeOf(L,r)).forEach(r=>{const li=document.createElement('li');if(r.gm)li.classList.add('gmline');
    li.innerHTML=`<span class="rl" style="background:${rcol(r.c)}">${r.id}</span><div><b>${esc(r.t)}${r.gm?`<i class="gmsfx">${esc(t.gmSuffix)}</i>`:''}</b><br><span>${esc(r.d)}</span></div>`;ul.appendChild(li);});
  c.appendChild(ul);const p=document.createElement('p');p.className='hint';p.textContent=t.routesHint;c.appendChild(p);return c;
}
function buildSits(L){
  const c=card(T().sits,'gmcard');const ol=document.createElement('ol');ol.className='sits';
  sitsOf(L).forEach(s=>{const li=document.createElement('li');li.innerHTML=s;ol.appendChild(li);});c.appendChild(ol);return c;
}
function consRows(L,hideGm){
  const t=T();
  return L.cons.filter(k=>!(hideGm&&k.gm)).map(k=>`<tr class="${k.gm?'gmline':''}" data-l="${t.gmSuffix}"><td>V${k.n}</td><td><span class="sw" style="background:${rcol(k.c)}"></span>${esc(tr(k.name))}</td><td>${esc(tr(k.from))} → ${esc(tr(k.to))}</td><td>${esc(tr(k.who))}</td><td>${esc(tr(k.cost))}</td></tr>`).join('');
}
function buildSectionTable(L,hideGm){
  const t=T();const c=card(t.cons);const w=document.createElement('div');w.className='tablewrap';
  w.innerHTML=`<table class="sectable"><thead><tr>${t.th.map(h=>`<th>${h}</th>`).join('')}</tr></thead><tbody>${consRows(L,hideGm)}</tbody></table>`;
  c.appendChild(w);const p=document.createElement('p');p.className='hint';p.textContent=t.consHint;c.appendChild(p);return c;
}
function bindHover(box,key){
  const mks=[...box.querySelectorAll('.mk')],lis=[...key.querySelectorAll('.spots li')];
  const set=(n,on)=>{mks.forEach(m=>m.classList.toggle('hl',on&&m.dataset.n===n));lis.forEach(l=>l.classList.toggle('hl',on&&l.dataset.n===n));};
  mks.forEach(m=>{m.addEventListener('mouseenter',()=>set(m.dataset.n,true));m.addEventListener('mouseleave',()=>set(m.dataset.n,false));
    m.addEventListener('click',()=>{const li=lis.find(l=>l.dataset.n===m.dataset.n);if(li){li.scrollIntoView({behavior:'smooth',block:'center'});set(m.dataset.n,true);setTimeout(()=>set(m.dataset.n,false),1800);}});});
  lis.forEach(l=>{l.tabIndex=0;l.addEventListener('mouseenter',()=>set(l.dataset.n,true));l.addEventListener('mouseleave',()=>set(l.dataset.n,false));l.addEventListener('focus',()=>set(l.dataset.n,true));l.addEventListener('blur',()=>set(l.dataset.n,false));});
}
function renderChrome(){
  const t=T();document.documentElement.lang=lang;
  document.getElementById('subtitle').textContent=t.subtitle;
  document.getElementById('langDE').setAttribute('aria-pressed',lang==='de'?'true':'false');document.getElementById('langEN').setAttribute('aria-pressed',lang==='en'?'true':'false');
  const tabs=document.getElementById('tabs');tabs.innerHTML='';
  LEVELS.forEach(L=>{const b=document.createElement('button');b.type='button';b.setAttribute('role','tab');b.id='tab-'+L.id;b.innerHTML=`${esc(t.short[L.id]||L.short)}<small>${esc(t.tabs[L.id]||'')}</small>`;b.addEventListener('click',()=>{state.cur=L.id;renderMain();});tabs.appendChild(b);});
  document.getElementById('btnRoutes').lastChild.textContent=t.routes;document.getElementById('btnPrint').lastChild.textContent=t.print;
  document.getElementById('fine').innerHTML=t.fine;
}
function renderMain(){
  const t=T();const L=LEVELS.find(l=>l.id===state.cur);
  document.querySelectorAll('#tabs button').forEach(b=>b.setAttribute('aria-selected',b.id==='tab-'+L.id?'true':'false'));
  document.getElementById('mapTitle').innerHTML=`${esc(tr(L.name))}<span>${esc(tr(L.sub))}</span>`;
  document.getElementById('chips').innerHTML=(L.chips||[]).map(c=>`<span class="chip">${esc(tr(c))}</span>`).join('');
  const box=document.getElementById('svgbox');box.innerHTML='';box.appendChild(renderLevel(L,{gm:state.gm,routes:state.routes}));
  const key=document.getElementById('key');key.innerHTML='';
  if(L.kind==='section'){key.appendChild(buildSectionTable(L,false));key.appendChild(buildSits(L));}
  else{key.appendChild(buildSpots(L,false));key.appendChild(buildRoutes(L));key.appendChild(buildSits(L));}
  bindHover(box,key);
  document.body.classList.toggle('player',!state.gm);
  const bg=document.getElementById('btnGM');bg.setAttribute('aria-pressed',state.gm?'true':'false');bg.lastChild.textContent=state.gm?t.gmOn:t.gmOff;
  document.getElementById('btnRoutes').setAttribute('aria-pressed',state.routes?'true':'false');
  buildLegend(document.getElementById('legend'));
  save();
}
/* ---------- Druckansicht ---------- */
function legendStrip(hideGm){
  return `<div class="plegend">${LEGEND.filter(([n,s,c])=>s&&!(hideGm&&c==='gm')).map(([n,s,c])=>`<span class="lg${c?' '+c:''}"><svg viewBox="0 0 26 16" aria-hidden="true">${s}</svg>${esc(tr(n))}</span>`).join('')}</div>`;
}
function printSheets(variant){
  const t=T(),gm=variant==='gm';let n=0;const out=[];
  const head=(L,extra)=>`<header class="ph"><div><div class="pe">Meridian Spire · Feuerprobe</div><h2>${esc(tr(L.name))}<span>${esc(tr(L.sub))}${extra?' · '+extra:''}</span></h2></div><div class="pbadge ${gm?'g':'p'}">${gm?t.gmBadge:t.playerBadge}</div></header>`;
  const foot=()=>`<footer class="pf"><span>Shadowrun · Feuerprobe · Runners in the Shadows</span><span>${t.pageOf} ${++n}</span></footer>`;
  for(const L of LEVELS){
    const svg=renderLevel(L,{gm,routes:gm});const wrap=document.createElement('div');wrap.appendChild(svg);
    if(L.kind==='section'){
      out.push(`<section class="psheet auto"><div class="pin">${head(L)}<div class="psec">${wrap.innerHTML}</div><div class="psecrow${gm?'':' one'}"><table class="sectable small"><thead><tr>${t.th.map(h=>`<th>${h}</th>`).join('')}</tr></thead><tbody>${consRows(L,!gm)}</tbody></table>${gm?`<div class="pnotes one"><h3>${t.sits}</h3>${sitsOf(L).map(s=>`<p class="pn">${s}</p>`).join('')}</div>`:''}</div>${foot()}</div></section>`);
      continue;
    }
    const spots=(L.spots||[]).map(s=>spotOf(L,s)).filter(s=>gm||!s.gm);
    const routes=(L.routeText||[]).map(r=>routeOf(L,r)).filter(r=>gm||!r.gm);
    const side=gm
      ?`${(L.chips||[]).length?`<div class="pchips">${L.chips.map(c=>`<span>${esc(tr(c))}</span>`).join('')}</div>`:''}<h3>${t.orte}</h3><ol class="pspots titles">${spots.map(s=>`<li><span class="n">${s.n}</span><b>${esc(s.t)}</b></li>`).join('')}</ol><h3>${t.wege}</h3><ul class="proutes">${routes.map(r=>`<li><span class="rl" style="background:${rcol(r.c)}">${r.id}</span><span><b>${esc(r.t)}</b></span></li>`).join('')}</ul>`
      :`<h3>${t.orte}</h3><ol class="pspots">${spots.map(s=>`<li><span class="n">${s.n}</span><div><b>${esc(s.t)}</b>${s.p?`<p>${esc(s.p)}</p>`:''}</div></li>`).join('')}</ol>`;
    out.push(`<section class="psheet"><div class="pin">${head(L)}<div class="pbody"><div class="pmap">${wrap.innerHTML}${legendStrip(!gm)}</div><aside class="pside">${side}</aside></div>${foot()}</div></section>`);
    if(gm){
      out.push(`<section class="psheet auto"><div class="pin">${head(L,t.notesTitle)}<div class="pnotes"><h3>${t.orte}</h3>${spots.map(s=>`<div class="pn"><b><span class="n">${s.n}</span>${esc(s.t)}</b>${s.p?`<p>${esc(s.p)}</p>`:''}${s.g?`<p class="g"><i>${t.gmTag}</i> ${esc(s.g)}</p>`:''}</div>`).join('')}<h3>${t.wege}</h3>${routes.map(r=>`<div class="pn"><b><span class="rl" style="background:${rcol(r.c)}">${r.id}</span>${esc(r.t)}</b><p>${esc(r.d)}</p></div>`).join('')}<h3>${t.sits}</h3>${sitsOf(L).map(s=>`<p class="pn">${s}</p>`).join('')}</div>${foot()}</div></section>`);
    }
  }
  return out.join('');
}
function renderPrint(){
  const t=T();
  document.getElementById('pvGm').setAttribute('aria-pressed',state.variant==='gm'?'true':'false');document.getElementById('pvPlayer').setAttribute('aria-pressed',state.variant==='player'?'true':'false');
  document.getElementById('pvGm').textContent=t.printGm;document.getElementById('pvPlayer').textContent=t.printPlayer;document.getElementById('btnPrintNow').textContent=t.printBtn;document.getElementById('btnBack').textContent=t.back;document.getElementById('pvHint').textContent=t.printHint;
  document.getElementById('psheets').innerHTML=printSheets(state.variant);
}
function setPrintMode(on){printMode=on;document.body.classList.toggle('printmode',on);document.getElementById('printview').hidden=!on;if(on){renderPrint();window.scrollTo(0,0);}}
function renderAll(){renderChrome();renderMain();renderPrint();}
(function boot(){
  document.getElementById('btnGM').addEventListener('click',()=>{state.gm=!state.gm;state.variant=state.gm?'gm':'player';renderMain();renderPrint();});
  document.getElementById('btnRoutes').addEventListener('click',()=>{state.routes=!state.routes;renderMain();});
  document.getElementById('btnPrint').addEventListener('click',()=>setPrintMode(true));
  document.getElementById('btnBack').addEventListener('click',()=>setPrintMode(false));
  document.getElementById('btnPrintNow').addEventListener('click',()=>{try{window.print();}catch(e){}});
  document.getElementById('pvGm').addEventListener('click',()=>{state.variant='gm';save();renderPrint();});
  document.getElementById('pvPlayer').addEventListener('click',()=>{state.variant='player';save();renderPrint();});
  const setLang=l=>{lang=l;save();renderAll();};
  document.getElementById('langDE').addEventListener('click',()=>setLang('de'));document.getElementById('langEN').addEventListener('click',()=>setLang('en'));
  renderAll();
  if(printMode)setPrintMode(true);
})();
