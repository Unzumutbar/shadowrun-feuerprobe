/* ---------- App ---------- */
const LEVELS=[LSCHNITT,LGARAGE,L111,L112,LDACH,L110];
const TABSUB={schnitt:'Vertikale Wege',garage:'Tiefgarage',111:'Gala-Ebene',112:'Lounge & Suite',dach:'Landeplattform',110:'Tresorgeschoss'};
const state={gm:true,routes:true,cur:'111'};
try{const s=JSON.parse(localStorage.getItem('ms-plaene')||'{}');if(s&&typeof s==='object')Object.assign(state,s);}catch(e){}
if(!LEVELS.some(l=>l.id===state.cur))state.cur='111';
function save(){try{localStorage.setItem('ms-plaene',JSON.stringify(state));}catch(e){}}
function esc(s){return String(s??'').replace(/&/g,'&amp;').replace(/</g,'&lt;');}

function card(title,cls){const c=document.createElement('section');c.className='card'+(cls?' '+cls:'');const h=document.createElement('h3');h.textContent=title;c.appendChild(h);return c;}
function buildSpots(L,forPrint){
  const c=card('Orte auf dem Plan');const ol=document.createElement('ol');ol.className='spots'+(forPrint?' keygrid':'');
  (L.spots||[]).forEach(s=>{const li=document.createElement('li');li.dataset.n=s.n;if(s.gm)li.classList.add('gmonly');
    li.innerHTML=`<span class="n">${s.n}</span><div><b>${esc(s.t)}</b>${s.p?`<p>${esc(s.p)}</p>`:''}${s.g?`<div class="gmn">${esc(s.g)}</div>`:''}</div>`;ol.appendChild(li);});
  c.appendChild(ol);return c;
}
function buildRoutes(L){
  const c=card('Von A nach B');const ul=document.createElement('ul');ul.className='routelist';
  (L.routeText||[]).forEach(r=>{const li=document.createElement('li');if(r.gm)li.classList.add('gmline');
    li.innerHTML=`<span class="rl" style="background:${rcol(r.c)}">${r.id}</span><div><b>${esc(r.t)}</b><br><span>${esc(r.d)}</span></div>`;ul.appendChild(li);});
  c.appendChild(ul);const p=document.createElement('p');p.className='hint';p.textContent='Die Buchstaben markieren den Startpunkt jedes Wegs im Plan. „Wege einblenden“ schaltet das Overlay.';c.appendChild(p);return c;
}
function buildSits(L){
  const c=card('Spielsituationen','gmcard');const ol=document.createElement('ol');ol.className='sits';
  (L.sits||[]).forEach(s=>{const li=document.createElement('li');li.innerHTML=s;ol.appendChild(li);});c.appendChild(ol);return c;
}
function buildSectionTable(L){
  const c=card('Vertikale Verbindungen');const w=document.createElement('div');w.className='tablewrap';
  const rows=L.cons.map(k=>`<tr class="${k.gm?'gmline':''}"><td>V${k.n}</td><td><span class="sw" style="background:${rcol(k.c)}"></span>${esc(k.name)}</td><td>${esc(k.from)} → ${esc(k.to)}</td><td>${esc(k.who)}</td><td>${esc(k.cost)}</td></tr>`).join('');
  w.innerHTML=`<table class="sectable"><thead><tr><th>Nr.</th><th>Verbindung</th><th>Von → Nach</th><th>Wer</th><th>Preis / Risiko</th></tr></thead><tbody>${rows}</tbody></table>`;
  c.appendChild(w);const p=document.createElement('p');p.className='hint';p.textContent='Kreise = Haltepunkte, rotes Kreuz = Ebene wird passiert, aber nicht erreicht. Gestrichelt = nur Gegenstände oder Seil.';c.appendChild(p);return c;
}
function bindHover(box,key){
  const mks=[...box.querySelectorAll('.mk')],lis=[...key.querySelectorAll('.spots li')];
  const set=(n,on)=>{mks.forEach(m=>m.classList.toggle('hl',on&&m.dataset.n===n));lis.forEach(l=>l.classList.toggle('hl',on&&l.dataset.n===n));};
  mks.forEach(m=>{m.addEventListener('mouseenter',()=>set(m.dataset.n,true));m.addEventListener('mouseleave',()=>set(m.dataset.n,false));
    m.addEventListener('click',()=>{const li=lis.find(l=>l.dataset.n===m.dataset.n);if(li){li.scrollIntoView({behavior:'smooth',block:'center'});set(m.dataset.n,true);setTimeout(()=>set(m.dataset.n,false),1800);}});});
  lis.forEach(l=>{l.tabIndex=0;l.addEventListener('mouseenter',()=>set(l.dataset.n,true));l.addEventListener('mouseleave',()=>set(l.dataset.n,false));l.addEventListener('focus',()=>set(l.dataset.n,true));l.addEventListener('blur',()=>set(l.dataset.n,false));});
}
function renderMain(){
  const L=LEVELS.find(l=>l.id===state.cur);
  document.querySelectorAll('#tabs button').forEach(b=>b.setAttribute('aria-selected',b.id==='tab-'+L.id?'true':'false'));
  document.getElementById('mapTitle').innerHTML=`${esc(L.name)}<span>${esc(L.sub)}</span>`;
  document.getElementById('chips').innerHTML=(L.chips||[]).map(c=>`<span class="chip">${esc(c)}</span>`).join('');
  const box=document.getElementById('svgbox');box.innerHTML='';box.appendChild(renderLevel(L,{gm:state.gm,routes:state.routes}));
  const key=document.getElementById('key');key.innerHTML='';
  if(L.kind==='section'){key.appendChild(buildSectionTable(L));key.appendChild(buildSits(L));}
  else{key.appendChild(buildSpots(L,false));key.appendChild(buildRoutes(L));key.appendChild(buildSits(L));}
  bindHover(box,key);
  document.body.classList.toggle('player',!state.gm);
  const bg=document.getElementById('btnGM');bg.setAttribute('aria-pressed',state.gm?'true':'false');bg.lastChild.textContent=state.gm?'SL-Ansicht':'Spieleransicht';
  document.getElementById('btnRoutes').setAttribute('aria-pressed',state.routes?'true':'false');
  save();
}
function buildSheets(){
  const host=document.getElementById('sheets');host.innerHTML='';
  LEVELS.forEach(L=>{const a=document.createElement('article');a.className='sheet';
    const panel=document.createElement('div');panel.className='mappanel';
    panel.innerHTML=`<div class="maphead"><h2>${esc(L.name)}<span>${esc(L.sub)}</span></h2><div class="chips">${(L.chips||[]).map(c=>`<span class="chip">${esc(c)}</span>`).join('')}</div></div>`;
    const sb=document.createElement('div');sb.className='svgbox';sb.appendChild(renderLevel(L,{gm:true,routes:true}));panel.appendChild(sb);a.appendChild(panel);
    if(L.kind==='section')a.appendChild(buildSectionTable(L));else{a.appendChild(buildSpots(L,true));a.appendChild(buildRoutes(L));}
    host.appendChild(a);});
}
(function boot(){
  const tabs=document.getElementById('tabs');
  LEVELS.forEach(L=>{const b=document.createElement('button');b.type='button';b.setAttribute('role','tab');b.id='tab-'+L.id;b.innerHTML=`${esc(L.short)}<small>${esc(TABSUB[L.id]||'')}</small>`;b.addEventListener('click',()=>{state.cur=L.id;renderMain();});tabs.appendChild(b);});
  document.getElementById('btnGM').addEventListener('click',()=>{state.gm=!state.gm;renderMain();});
  document.getElementById('btnRoutes').addEventListener('click',()=>{state.routes=!state.routes;renderMain();});
  document.getElementById('btnPrint').addEventListener('click',()=>{try{window.print();}catch(e){}});
  buildLegend(document.getElementById('legend'));
  renderMain();
  buildSheets();
})();
