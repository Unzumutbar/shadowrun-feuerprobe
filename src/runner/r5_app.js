/* ---------- Renderer ---------- */
const ATTRS=[
 ['Intuition','Intuition',[['engineer','Engineer','Technik, Basteln, Reparieren'],['interface','Interface','Matrix, Hacken, Geräte steuern'],['stalk','Stalk','Aufspüren, Verfolgen, Zielen'],['survey','Survey','Beobachten, Lage erfassen']]],
 ['Body','Körper',[['fight','Fight','Kämpfen, Nahkampf, Schusswechsel'],['finesse','Finesse','Geschick, Präzision, Fahrzeuge'],['prowl','Prowl','Schleichen, Klettern, Verstecken'],['wreck','Wreck','Zerstören, Sprengen, rohe Gewalt']]],
 ['Willpower','Wille',[['command','Command','Befehlen, Einschüchtern'],['consort','Consort','Umgang, Netzwerken, Kontakte'],['influence','Influence','Überzeugen, Täuschen, Charme'],['study','Study','Analysieren, Wissen, Zaubern']]],
];
const TRAUMA=['Cold','Haunted','Obsessed','Paranoid','Reckless','Soft','Unstable','Vicious'];
function esc(s){return String(s??'').replace(/&/g,'&amp;').replace(/</g,'&lt;');}
function dots(n,max){let h='<span class="dots" aria-label="'+n+' von '+max+'">';for(let i=0;i<max;i++)h+='<i class="'+(i<n?'on':'')+'"></i>';return h+'</span>';}
const STORE='fp-runner';
let saved={};try{saved=JSON.parse(localStorage.getItem(STORE)||'{}')||{};}catch(e){saved={};}
function save(){try{localStorage.setItem(STORE,JSON.stringify(saved));}catch(e){}}
function st(id){return saved[id]||(saved[id]={edge:[],armor:{},harm:{},load:'normal'});}

function renderDossier(R){
  const a=R.actions||{};
  const resist=ATTRS.map(([k,de,acts])=>[k,acts.filter(([id])=>(a[id]||0)>0).length]);
  const loadBase={light:3,normal:5,heavy:6};const lb=R.loadBonus||0;
  const s=st(R.id);
  const attrsHtml=ATTRS.map(([k,de,acts])=>`<div class="attr"><h4>${k}<span>${de} · Resistance ${resist.find(r=>r[0]===k)[1]}d</span></h4>${acts.map(([id,en,gl])=>`<div class="act"><div class="an">${en}<small>${gl}</small></div>${dots(a[id]||0,4)}</div>`).join('')}</div>`).join('')
    +(R.sup?`<div class="attr"><h4>Übernatürlich<span>${esc(R.sup.attr)}</span></h4><div class="act sup"><div class="an">${esc(R.sup.name)}<small>${esc(R.sup.gloss)}</small></div>${dots(R.sup.dots,4)}</div></div>`:'');
  const edgeMax=R.edgeMax||9;
  const edgeBoxes=Array.from({length:edgeMax},(_,i)=>`<button type="button" class="box" id="${R.id}-edge-${i}" data-k="edge" data-i="${i}" aria-pressed="${s.edge[i]?'true':'false'}" aria-label="Edge ${i+1}"></button>`).join('');
  const armorDefs=[['armor','Armor'],['heavy','Heavy'],['special','Special']].concat(R.extraArmor?[['extra','Troll-Panzer']]:[]);
  const armorHtml=armorDefs.map(([k,l])=>`<label><button type="button" class="box${k==='extra'?' extra':''}" id="${R.id}-armor-${k}" data-k="armor" data-i="${k}" aria-pressed="${s.armor[k]?'true':'false'}" aria-label="${l}"></button>${l}</label>`).join('');
  const harmRow=(lv,title,sub,n)=>`<div class="row"><div class="lv">${title}<small>${sub}</small></div><div class="cells${n===1?' one':''}">${Array.from({length:n},(_,i)=>`<input type="text" id="${R.id}-harm-${lv}${i}" data-k="harm" data-i="${lv}${i}" value="${esc((s.harm||{})[lv+i]||'')}" placeholder="…">`).join('')}</div></div>`;
  const loadHtml=['light','normal','heavy'].map(k=>`<label class="${s.load===k?'on':''}"><input type="radio" name="${R.id}-load" id="${R.id}-load-${k}" value="${k}" ${s.load===k?'checked':''}>${k[0].toUpperCase()+k.slice(1)} ${loadBase[k]+lb}</label>`).join('');
  const kv=(rows)=>`<dl class="kv">${rows.map(([k,v])=>`<dt>${k}</dt><dd>${v}</dd>`).join('')}</dl>`;
  return `<article class="dossier" id="${R.id}" style="--pb:var(--pb-${R.color})">
  <div class="dhead">
    <div class="name">${esc(R.street)}<small>${esc(R.pbDesc)}</small></div>
    <div class="badges"><span class="badge pb">${esc(R.pb)}</span><span class="badge">${esc(R.meta)}</span><span class="badge">${esc(R.idnShort)}</span></div>
    <div class="ident"><label for="${R.id}-name">Name</label><input type="text" id="${R.id}-name" data-k="name" value="${esc(s.name||'')}" placeholder="frei wählbar · „${esc(R.street)}“ ist nur der Straßenname"><label for="${R.id}-pron">Pronomen</label><input type="text" id="${R.id}-pron" data-k="pron" value="${esc(s.pron||'')}" placeholder="sie · er · dey · …"></div>
    <p class="role"><b>Rolle im Run:</b> ${R.role}</p>
  </div>
  <div class="dbody">
    <div class="col">
      <section><h3>Profil</h3>${kv([['Aussehen',esc(R.look)],['Herkunft',esc(R.heritage)],['Hintergrund',esc(R.background)],['Laster',esc(R.vice)],['IDN (SIN)',esc(R.idn)],['Kontakte',esc(R.friendsLabel)]])}</section>
      <section><h3>Metatyp: ${esc(R.meta)}</h3><ul class="traits">${R.metaTraits.map(([n,t])=>`<li><b>${esc(n)}.</b> ${esc(t)}</li>`).join('')}</ul></section>
      ${R.cyber?`<section><h3>Implantate & Körper</h3><p class="traits" style="margin:0">${R.cyber}</p></section>`:''}
      <section><h3>Karma-Auslöser</h3><ul class="traits">${R.karma.map(k=>`<li>${k}</li>`).join('')}<li class="small">Dazu immer: Überzeugung, Herkunft oder Hintergrund ausgespielt · Laster oder Trauma haben Ärger gemacht.</li></ul></section>
    </div>
    <div class="col">
      <section><h3>Actions · 7 Punkte</h3><div class="attrs">${attrsHtml}</div></section>
      <div class="tracks">
        <div class="trk"><h4>Edge <span>${edgeMax} Kästchen · pushen 2 · assistieren 1</span></h4><div class="boxes">${edgeBoxes}</div>
          <div class="trauma">${TRAUMA.map(t=>`<span>${t}</span>`).join('')}</div></div>
        <div class="trk"><h4>Harm <span>Stufe 4 = tödlich</span></h4><div class="harm">${harmRow('l','Stufe 1','weniger Effect',2)}${harmRow('m','Stufe 2','−1d',2)}${harmRow('h','Stufe 3','braucht Hilfe',1)}</div></div>
        <div class="trk"><h4>Armor</h4><div class="armorrow">${armorHtml}</div></div>
        <div class="trk"><h4>Load <span>${lb?'+'+lb+' durch Metatyp':'Light 3 · Normal 5 · Heavy 6'}</span></h4><div class="loadsel">${loadHtml}</div></div>
        <div class="trk"><h4>Nuyen <span>Start 2 · Stash 0</span></h4><p class="small" style="margin:6px 0 0">Bezahlung laut Johnson: 6 Nuyen für die Crew bei sauberer Übergabe.</p></div>
        <button type="button" class="badge" data-reset="${R.id}" style="cursor:pointer;justify-self:start">Tracker zurücksetzen</button>
      </div>
    </div>
    <div class="col">
      <section><h3>Spezialfähigkeiten</h3><ul class="abil">${R.abilities.map(ab=>`<li><b>${esc(ab.n)}<i>${esc(ab.tag)}</i></b>${ab.t}</li>`).join('')}</ul></section>
      ${R.spells?`<section><h3>${esc(R.spells.h)}</h3><ul class="abil">${R.spells.list.map(sp=>`<li><b>${esc(sp.n)}</b>${sp.t}</li>`).join('')}</ul></section>`:''}
      <section><h3>Ausrüstung · Load</h3><table class="items"><tbody>${R.items.map(it=>`<tr class="${it.rec?'rec':''}"><td class="ld">${it.l}</td><td><b>${esc(it.n)}</b> ${it.t}</td></tr>`).join('')}</tbody></table>
      <p class="hint">● empfohlen für die Feuerprobe. Dazu jederzeit Standardausrüstung: Kommlink (0), Armor (2), Pistole (1), Burglary Gear (1), Climbing Gear (2), Subterfuge Supplies (1) und mehr.</p></section>
    </div>
  </div>
  <div class="dfoot">
    <div><h3>Freund</h3><p><b>${esc(R.friend.n)}.</b> ${R.friend.t}</p><h3 style="margin-top:12px">Rivale</h3><p><b>${esc(R.rival.n)}.</b> ${R.rival.t}</p></div>
    <div><h3>Warum du diesen Job nimmst</h3><p>${R.why}</p></div>
    <div><h3>So glänzt du im Meridian Spire</h3><ul>${R.shine.map(x=>`<li>${x}</li>`).join('')}</ul></div>
    <div class="lore"><h3>Shadowrun-Einblick: ${esc(R.lore.h)}</h3>${R.lore.t}</div>
    <div class="gmnote"><h3>Nur für die Spielleitung</h3>${R.gm}</div>
  </div>
</article>`;
}

function renderAll(){
  const nav=document.getElementById('crewnav');
  nav.innerHTML=RUNNERS.map(R=>`<a href="#${R.id}" style="--pb:var(--pb-${R.color})"><div class="sn">${esc(R.street)}</div><div class="pb">${esc(R.pb)} · ${esc(R.meta)}</div><div class="rl">${esc(R.feel)}</div></a>`).join('');
  document.getElementById('crews').innerHTML=`<b>Empfohlene Crews für 3–4 Spieler:innen.</b> Jede Zusammenstellung deckt Zugang, Keycard, Venn und den Weg nach 110 auf eigene Weise ab.<ul>${CREWS.map(c=>`<li><b>${esc(c.n)}:</b> ${esc(c.t)}</li>`).join('')}</ul>`;
  document.getElementById('dossiers').innerHTML=RUNNERS.map(renderDossier).join('');
  bind();
}
function bind(){
  document.querySelectorAll('.box').forEach(b=>b.addEventListener('click',()=>{const id=b.closest('.dossier').id,s=st(id);const on=b.getAttribute('aria-pressed')!=='true';b.setAttribute('aria-pressed',on?'true':'false');if(b.dataset.k==='edge')s.edge[+b.dataset.i]=on;else s.armor[b.dataset.i]=on;save();}));
  document.querySelectorAll('.harm input').forEach(i=>i.addEventListener('input',()=>{const id=i.closest('.dossier').id,s=st(id);s.harm=s.harm||{};s.harm[i.dataset.i]=i.value;save();}));
  document.querySelectorAll('.ident input').forEach(i=>i.addEventListener('input',()=>{const id=i.closest('.dossier').id,s=st(id);s[i.dataset.k]=i.value;save();}));
  document.querySelectorAll('.loadsel input').forEach(r=>r.addEventListener('change',()=>{const id=r.closest('.dossier').id,s=st(id);s.load=r.value;r.closest('.loadsel').querySelectorAll('label').forEach(l=>l.classList.toggle('on',l.contains(r)));save();}));
  document.querySelectorAll('[data-reset]').forEach(b=>b.addEventListener('click',()=>{const old=saved[b.dataset.reset]||{};delete saved[b.dataset.reset];const fresh=st(b.dataset.reset);fresh.name=old.name||'';fresh.pron=old.pron||'';save();const R=RUNNERS.find(r=>r.id===b.dataset.reset);const el=document.getElementById(R.id);el.outerHTML=renderDossier(R);bind();}));
}
(function boot(){
  let gm=true;try{const v=localStorage.getItem('fp-runner-gm');if(v!==null)gm=v==='1';}catch(e){}
  const btn=document.getElementById('btnGM');
  const apply=()=>{document.body.classList.toggle('player',!gm);btn.setAttribute('aria-pressed',gm?'true':'false');btn.lastChild.textContent=gm?'SL-Notizen anzeigen':'Spieleransicht';try{localStorage.setItem('fp-runner-gm',gm?'1':'0');}catch(e){}};
  btn.addEventListener('click',()=>{gm=!gm;apply();});
  apply();renderAll();
})();
