/* ---------- SL-Leitfaden: Renderer, Alert Clock, Payoff-Rechner, Porträts ---------- */
let lang='de';
const state={alert:0,done:{},calc:{}};
let printMode=false; // ?print=1: Druckfassung für tools/make-pdf.js (alle Antworten aufgeklappt)
(function(){try{
  const q=new URLSearchParams(location.search).get('lang');
  if(q==='en'||q==='de')lang=q;
  if(new URLSearchParams(location.search).get('print')==='1')printMode=true;else{const v=localStorage.getItem('fp-lang');if(v==='en'||v==='de')lang=v;}
  const s=JSON.parse(localStorage.getItem('fp-guide')||'{}');if(s&&typeof s==='object')Object.assign(state,s);
}catch(e){}})();
function save(){try{localStorage.setItem('fp-guide',JSON.stringify(state));localStorage.setItem('fp-lang',lang);}catch(e){}}
const G=()=>lang==='en'?GUIDE_EN:GUIDE_DE;
const T=()=>G().ui;
const $=id=>document.getElementById(id);
const esc=s=>String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;');
const list=(tag,items,cls)=>items&&items.length?`<${tag}${cls?` class="${cls}"`:''}>${items.map(i=>`<li>${i}</li>`).join('')}</${tag}>`:'';

/* ---- Blöcke ---- */
function tile(t){
  return `<div class="tile"><h4>${t.h}${t.sub?`<small>${t.sub}</small>`:''}</h4>${t.p?`<p>${t.p}</p>`:''}${list('ul',t.ul)}${list('ol',t.ol)}${list('ul',t.pro,'pro')}${list('ul',t.con,'con')}${t.fb?`<div class="fb">${t.fb}</div>`:''}</div>`;
}
function block(b){
  const [t,a,b2,c,d]=b;
  switch(t){
    case 'h3':return `<h3>${a}</h3>`;
    case 'h4':return `<h4>${a}</h4>`;
    case 'p':return `<p>${a}</p>`;
    case 'ul':return list('ul',a);
    case 'ol':return list('ol',a);
    case 'q':return `<blockquote class="q${b2?' '+b2:''}">${a}</blockquote>`;
    case 'note':return `<div class="note${a?' '+a:''}">${b2?`<h5>${b2}</h5>`:''}${/^\s*</.test(c)?c:`<p>${c}</p>`}</div>`;
    case 'tiles':return `<div class="grid c${a}">${b2.map(tile).join('')}</div>`;
    case 'table':{const r=c||[];return `<table class="tb"><thead><tr>${a.map(h=>`<th>${h}</th>`).join('')}</tr></thead><tbody>${b2.map(row=>`<tr>${row.map((cell,i)=>`<td${r.includes(i)?' class="r"':''}>${cell}</td>`).join('')}</tr>`).join('')}</tbody></table>`;}
    case 'qa':return a.map(x=>`<details class="qa"><summary>${x.q}</summary><div class="a">${x.a}</div></details>`).join('');
    case 'stages':return `<div class="stages">${a.map(s=>`<div class="stage" style="--sc:${s.col}"><b>${s.name}</b><i>${s.range}</i>${list('ul',s.items)}</div>`).join('')}</div>`;
    case 'deals':return list('ul',a,'deals');
    case 'chips':return `<div class="chips">${a.map(x=>`<span class="chip">${x}</span>`).join('')}</div>`;
    case 'qr':return `<div class="qr">${a.map(x=>`<div class="tile"><h4>${x.h}</h4>${list('ul',x.items)}</div>`).join('')}</div>`;
    case 'npcs':return `<div class="npcs">${G().npcs.map(npc).join('')}</div>`;
  }
  return '';
}

/* ---- NPCs mit Porträt-Platzhalter ---- */
const SIL={
  person:`<svg viewBox="0 0 132 176" aria-hidden="true"><rect width="132" height="176" fill="none"/><circle cx="66" cy="62" r="28" fill="currentColor" opacity=".45"/><path d="M14 176c0-38 24-60 52-60s52 22 52 60z" fill="currentColor" opacity=".45"/></svg>`,
  dragon:`<svg viewBox="0 0 132 176" aria-hidden="true"><path d="M20 118c10-40 34-64 70-70-16 12-24 26-26 40 18-14 40-18 62-10-22 4-36 16-44 34 10-2 20 0 30 6-16 4-28 12-36 26-6-10-16-18-30-22 4 14 2 26-6 36-6-16-12-28-20-40z" fill="currentColor" opacity=".45"/><circle cx="84" cy="70" r="3" fill="currentColor"/></svg>`,
};
function porKey(id){return 'fp-guide-por-'+id;}
/* Feste Porträts kommen aus PORTRAITS (von build.js aus src/leitfaden/img eingebettet); ein eigenes Bild per Klick ersetzt sie im Browser. */
const PORS=typeof PORTRAITS==='object'?PORTRAITS:{};
const WIDE={veyrath:1};
/* Personen in zwei Varianten: online zeigt eine Karte mit Umschalter (Wahl bleibt gespeichert), der Druck beide */
const VARS={johnson:['johnson','johnson-rookie'],kade:['kade','kade-troll']};
const VAR_OF={};Object.entries(VARS).forEach(([g,ids])=>ids.forEach(i=>{VAR_OF[i]=g;}));
let varSel={};try{varSel=JSON.parse(localStorage.getItem('fp-npc-var')||'{}')||{};}catch(e){}
function curVar(g){return VARS[g].includes(varSel[g])?varSel[g]:VARS[g][0];}
function varLabel(m){const v=(m.role.match(/^Varia\w*\s+(\w)/)||[])[1]||'';return `${v} · ${m.tags[0]}`;}
function varSwitch(n){
  const g=VAR_OF[n.id];if(!g)return '';
  return `<div class="vsw" role="group" aria-label="${lang==='en'?'Variant':'Variante'}">${VARS[g].map(id=>{const m=G().npcs.find(x=>x.id===id);return m?`<button type="button" data-var="${id}" aria-pressed="${id===n.id}" title="${m.role}">${varLabel(m)}</button>`:'';}).join('')}</div>`;
}
function setVar(id,scroll){
  const g=VAR_OF[id];if(!g)return;varSel[g]=id;try{localStorage.setItem('fp-npc-var',JSON.stringify(varSel));}catch(e){}
  document.querySelectorAll(`.npc[data-grp="${g}"]`).forEach(a=>a.classList.toggle('on',a.id==='npc-'+id));
  if(scroll){const el=document.getElementById('npc-'+id);if(el)el.scrollIntoView({block:'start',behavior:'instant'});}
}
function npc(n){
  let own='';try{own=localStorage.getItem(porKey(n.id))||'';}catch(e){}
  const img=own||PORS[n.id]||'';
  const g=VAR_OF[n.id];
  return `<article class="npc${WIDE[n.id]?' wide':''}${g?' var'+(curVar(g)===n.id?' on':''):''}" id="npc-${n.id}"${g?` data-grp="${g}"`:''}>
  <div class="por${img?' has':''}${own?' own':''}" data-id="${n.id}">${SIL[n.kind]||SIL.person}${img?`<img src="${img}" alt="${n.name}">`:''}<span class="lbl">${T().portrait}</span><input type="file" accept="image/*" class="pick" title="${T().portrait}"><button type="button" class="rm">${T().portraitRm}</button>${varSwitch(n)}</div>
  <div class="info"><div class="nm">${n.name}</div><div class="rl">${n.role}</div>
  <div class="tags">${n.tags.map((t,i)=>`<span${n.key&&i===n.tags.length-1?' class="k"':''}>${t}</span>`).join('')}</div>
  <p>${n.bio}</p>
  <h5>${lang==='en'?'Look':'Aussehen'}</h5>${list('ul',n.look)}
  <h5>${lang==='en'?'At the table':'Am Tisch'}</h5>${list('ul',n.play)}
  <div class="sec"><h5>${lang==='en'?'GM only':'Nur für die SL'}</h5>${n.secret}</div>
  <div class="say">${n.say}</div></div></article>`;
}
function bindPortraits(){
  document.querySelectorAll('.npc .por').forEach(p=>{
    const id=p.dataset.id;
    p.querySelector('.pick').addEventListener('change',e=>{
      const f=e.target.files&&e.target.files[0];if(!f)return;
      const r=new FileReader();r.onload=()=>{const im=new Image();im.onload=()=>{
        const W=600,H=600,cv=document.createElement('canvas');cv.width=W;cv.height=H;const cx=cv.getContext('2d');
        const s=Math.max(W/im.width,H/im.height),w=im.width*s,h=im.height*s;cx.drawImage(im,(W-w)/2,(H-h)/2,w,h);
        const url=cv.toDataURL('image/jpeg',.82);
        try{localStorage.setItem(porKey(id),url);}catch(err){alert(lang==='en'?'Could not store the image (browser storage full).':'Bild konnte nicht gespeichert werden (Browserspeicher voll).');return;}
        let img=p.querySelector('img');if(!img){img=document.createElement('img');img.alt='';p.insertBefore(img,p.querySelector('.lbl'));}img.src=url;p.classList.add('has','own');
      };im.src=r.result;};r.readAsDataURL(f);e.target.value='';
    });
    p.querySelector('.rm').addEventListener('click',()=>{try{localStorage.removeItem(porKey(id));}catch(e){}p.classList.remove('own');const img=p.querySelector('img');if(PORS[id]){if(img)img.src=PORS[id];}else{if(img)img.remove();p.classList.remove('has');}});
  });
}

/* ---- Querverweise: Kapitel → Planebenen, Cheat-Sheets, Personen (sprachneutral) ---- */
const XREF={
  blick:{plans:['schnitt']},
  einstieg:{sheets:['grundregeln','sl-wuerfe'],runner:true},
  johnson:{npcs:['johnson','johnson-rookie']},
  info:{plans:['schnitt'],sheets:['heist'],npcs:['venn','kade']},
  plan:{plans:['schnitt','garage','111'],sheets:['actions']},
  party:{plans:['111','112'],sheets:['sl-kampf'],npcs:['kade','kade-troll','venn']},
  ebene110:{plans:['110'],sheets:['sl-alert','sl-magie']},
  tresor:{plans:['110'],sheets:['sl-magie'],npcs:['veyrath']},
  flucht:{plans:['dach','schnitt','garage'],sheets:['sl-kampf','kampf'],npcs:['kade']},
  enthuellung:{npcs:['veyrath','johnson']},
  payoff:{sheets:['sl-alert'],npcs:['johnson']},
  werkzeuge:{sheets:['sl-wuerfe','sl-alert']},
  referenz:{sheets:['grundregeln','actions']},
};
const XL={
  de:{see:'Dazu',plan:'Plan',sheet:'Cheat-Sheet',runner:'Runner-Dossiers',sheets:'Bögen',
    lv:{schnitt:'Schnitt',garage:'Tiefgarage',111:'Ebene 111',112:'Ebene 112',dach:'Dach',110:'Ebene 110'},
    sh:{grundregeln:'Grundregeln',actions:'Welche Action?',kampf:'Kampf',magie:'Magie',heist:'Matrix, Technik & Alert','sl-wuerfe':'Würfe leiten','sl-kampf':'Kampf & Gegner','sl-magie':'Magie im Turm','sl-alert':'Alert, Matrix & Payoff'}},
  en:{see:'See also',plan:'Plan',sheet:'Cheat sheet',runner:'Runner dossiers',sheets:'Sheets',
    lv:{schnitt:'Section',garage:'Parking garage',111:'Level 111',112:'Level 112',dach:'Roof',110:'Level 110'},
    sh:{grundregeln:'Core rules',actions:'Which action?',kampf:'Combat',magie:'Magic',heist:'Matrix, tech & alert','sl-wuerfe':'Running rolls','sl-kampf':'Combat & opposition','sl-magie':'Magic in the tower','sl-alert':'Alert, Matrix & payoff'}},
};
const NPCL={johnson:'Johnson (A)','johnson-rookie':'Johnson (B)',kade:'Kade (A)','kade-troll':'Kade (B)',venn:'Dr. Venn',veyrath:'Veyrath'};
function xref(id){
  const x=XREF[id];if(!x)return '';const t=XL[lang],q='?lang='+lang;const out=[];
  (x.plans||[]).forEach(l=>out.push(`<span class="xp">${t.plan} ${t.lv[l]}: <a href="meridian-spire-plaene.html${q}&level=${l}">2D</a>${l!=='schnitt'?` · <a href="meridian-spire-3d.html${q}&level=${l}">3D</a>`:''}</span>`));
  (x.sheets||[]).forEach(s=>out.push(`<a href="feuerprobe-regeln.html${q}&aud=all#${s}">${t.sheet} ${t.sh[s]}</a>`));
  if(x.runner)out.push(`<a href="feuerprobe-runner.html${q}">${t.runner}</a>`,`<a href="feuerprobe-runner-bogen.html${q}">${t.sheets}</a>`);
  (x.npcs||[]).forEach(n=>out.push(`<a href="#npc-${n}">${NPCL[n]}</a>`));
  return out.length?`<nav class="xref" aria-label="${t.see}"><b>${t.see}</b>${out.join('')}</nav>`:'';
}

/* ---- Kapitel ---- */
function chapter(ch){
  const on=!!state.done[ch.id];
  return `<article class="card chap${ch.long?' long':''}" id="${ch.id}" data-id="${ch.id}"><header>
  <div class="num">${ch.num}</div>
  <div class="meta"><span class="time">${ch.time}</span><label class="done${on?' on':''}"><input type="checkbox" data-done="${ch.id}"${on?' checked':''}>${T().doneLbl}</label></div>
  <h2>${ch.title}</h2><p class="lead">${ch.lead}</p>${xref(ch.id)}</header>${ch.blocks.map(block).join('')}</article>`;
}
function renderNav(){
  const chs=G().chapters;
  $('nav').innerHTML=chs.map((c,i)=>`<li${c.id==='werkzeuge'?' class="sep"':''}><a href="#${c.id}" data-nav="${c.id}" class="${state.done[c.id]?'done':''}"><span class="n">${/^\D*(\d+)/.test(c.num)&&/\d/.test(c.num)?c.num.match(/\d+/)[0]:(i===0?'◎':c.id==='werkzeuge'?'⚙':'§')}</span><span>${c.title}</span><span class="t">${c.time.replace(/ Min\.|min$/,'')}</span></a></li>`).join('');
  const steps=chs.filter(c=>/\d/.test(c.num));const n=steps.filter(c=>state.done[c.id]).length;
  $('progBar').style.width=Math.round(100*n/steps.length)+'%';
}

/* ---- Alert Clock ---- */
function arc(i){
  const r1=48,r0=26,a0=(-90+i*60)*Math.PI/180,a1=(-90+(i+1)*60)*Math.PI/180;
  const p=(r,a)=>`${(50+r*Math.cos(a)).toFixed(2)} ${(50+r*Math.sin(a)).toFixed(2)}`;
  return `M${p(r1,a0)}A${r1} ${r1} 0 0 1 ${p(r1,a1)}L${p(r0,a1)}A${r0} ${r0} 0 0 0 ${p(r0,a0)}Z`;
}
function renderClock(){
  const a=state.alert,col=a<=1?'var(--alert0)':a<=3?'var(--alert1)':a<=5?'var(--alert2)':'var(--alert3)';
  $('clockSvg').innerHTML=[0,1,2,3,4,5].map(i=>`<path class="seg${i<a?' on':''}" d="${arc(i)}" data-seg="${i}"><title>${i+1}</title></path>`).join('')+`<text x="50" y="55" text-anchor="middle" font-family="Barlow Condensed,sans-serif" font-weight="700" font-size="22" fill="currentColor">${a}</text>`;
  $('clockSvg').style.setProperty('--alertcol',col);
  $('alertN').textContent=a;$('alertName').textContent=T().alertNames[a];$('alertDesc').innerHTML=T().alertDesc[a];
  renderCalcOut();
}
function setAlert(n){state.alert=Math.max(0,Math.min(6,n));save();renderClock();}

/* ---- Payoff-Rechner ---- */
function renderCalc(){
  $('calcBody').innerHTML=T().calcChecks.map(([k,l])=>`<label><input type="checkbox" data-calc="${k}"${state.calc[k]?' checked':''}>${l}</label>`).join('')+`<div class="out" id="calcOut"></div>`;
  $('calcBody').querySelectorAll('[data-calc]').forEach(cb=>cb.addEventListener('change',()=>{state.calc[cb.dataset.calc]=cb.checked;save();renderCalcOut();}));
  renderCalcOut();
}
function renderCalcOut(){
  const out=$('calcOut');if(!out)return;const c=state.calc,a=state.alert,U=T();
  let pay=a<=1?6:a<=5?5:3;const notes=[U.calcBase.replace('{a}',a)];
  if(c.harm||c.venn||c.gore){pay=Math.min(pay,3);notes.push(U.calcHarm);}
  if(c.loot){pay=Math.max(0,pay-1);notes.push(U.calcLootCut);}
  const bad=c.open||c.loot||c.venn||c.gore,good=!bad&&a<=1&&!c.harm;
  out.innerHTML=`<b>${pay}</b><span>${U.calcNuyen}<br>${notes.join(' · ')}</span><div class="verdict ${good?'good':bad?'bad':'mid'}">${good?U.verdictGood:bad?U.verdictBad:U.verdictMid}</div>`;
}

/* ---- Gesamtrender ---- */
function renderAll(){
  const U=T();document.documentElement.lang=lang;
  document.title=lang==='en'?'Feuerprobe GM Guide':'Feuerprobe SL-Leitfaden';
  $('title').textContent=U.title;$('subtitle').textContent=U.subtitle;$('eyebrow').textContent=U.eyebrow;
  $('btnPrint').textContent=U.print;
  $('navH').innerHTML=`${U.nav}<span id="navCount"></span>`;$('alertH').innerHTML=`${U.alert}<span>${U.alertSub}</span>`;$('calcH').textContent=U.calc;$('alertReset').textContent=U.alertReset;
  $('main').innerHTML=G().chapters.map(chapter).join('');
  $('fine').innerHTML=U.fine;
  $('langDE').setAttribute('aria-pressed',lang==='de');$('langEN').setAttribute('aria-pressed',lang==='en');
  renderNav();renderClock();renderCalc();bindPortraits();
  document.querySelectorAll('[data-done]').forEach(cb=>cb.addEventListener('change',()=>{state.done[cb.dataset.done]=cb.checked;cb.closest('.done').classList.toggle('on',cb.checked);save();renderNav();}));
  observe();
  if(printMode)document.querySelectorAll('details.qa').forEach(d=>{d.open=true;});
}
let io;
function observe(){
  if(io)io.disconnect();
  io=new IntersectionObserver(es=>{es.forEach(e=>{if(e.isIntersecting){document.querySelectorAll('[data-nav]').forEach(a=>a.classList.toggle('cur',a.dataset.nav===e.target.dataset.id));}});},{rootMargin:'-10% 0px -75% 0px'});
  document.querySelectorAll('.chap').forEach(c=>io.observe(c));
}

/* ---- Events ---- */
$('clockSvg').addEventListener('click',e=>{const s=e.target.closest('[data-seg]');if(!s)return;const i=+s.dataset.seg;setAlert(state.alert===i+1?i:i+1);});
$('alertPlus').addEventListener('click',()=>setAlert(state.alert+1));
$('alertMinus').addEventListener('click',()=>setAlert(state.alert-1));
$('alertReset').addEventListener('click',()=>setAlert(0));
const setLang=l=>{lang=l;save();renderAll();};
$('langDE').addEventListener('click',()=>setLang('de'));
$('langEN').addEventListener('click',()=>setLang('en'));
$('btnPrint').addEventListener('click',()=>window.print());
window.addEventListener('beforeprint',()=>{document.querySelectorAll('details.qa').forEach(d=>{d.dataset.was=d.open?'1':'';d.open=true;});});
window.addEventListener('afterprint',()=>{document.querySelectorAll('details.qa').forEach(d=>{d.open=d.dataset.was==='1';});});
window.addEventListener('scroll',()=>{$('toplink').classList.toggle('show',window.scrollY>600);},{passive:true});
$('toplink').addEventListener('click',e=>{e.preventDefault();window.scrollTo({top:0,behavior:'smooth'});});
$('main').addEventListener('click',e=>{
  const b=e.target.closest('[data-var]');if(b){e.preventDefault();setVar(b.dataset.var,false);return;}
  const a=e.target.closest('a[href^="#npc-"]');if(a){const id=a.getAttribute('href').slice(5);if(VAR_OF[id])setVar(id,false);}
});
window.addEventListener('hashchange',()=>{const id=decodeURIComponent(location.hash.slice(1)).replace(/^npc-/,'');if(VAR_OF[id])setVar(id,true);});
if(/^#npc-/.test(location.hash)){const id=decodeURIComponent(location.hash.slice(5));if(VAR_OF[id])setVar(id,false);}
renderAll();
// Deep Link (#kapitel, #npc-…, #alertPanel): nach dem Rendern und dem Laden der Schriften hinscrollen
if(location.hash&&!printMode){const go=()=>{const el=document.getElementById(decodeURIComponent(location.hash.slice(1)));if(el)el.scrollIntoView({block:'start',behavior:'instant'});};go();if(document.fonts&&document.fonts.ready)document.fonts.ready.then(go);}
