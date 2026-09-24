/* ---------- Spielerbögen: ein Runner pro A4 ---------- */
const ATTRS=[
 ['Intuition','Intuition',[['engineer','Engineer','Technik, Basteln'],['interface','Interface','Matrix, Hacken'],['stalk','Stalk','Aufspüren, Zielen'],['survey','Survey','Beobachten, Lage']]],
 ['Body','Körper',[['fight','Fight','Kämpfen'],['finesse','Finesse','Geschick, Fahrzeuge'],['prowl','Prowl','Schleichen, Klettern'],['wreck','Wreck','Zerstören, Gewalt']]],
 ['Willpower','Wille',[['command','Command','Befehlen, Drohen'],['consort','Consort','Umgang, Kontakte'],['influence','Influence','Überzeugen, Täuschen'],['study','Study','Analysieren, Zaubern']]],
];
const TRAUMA=['Cold','Haunted','Obsessed','Paranoid','Reckless','Soft','Unstable','Vicious'];
const STD='Kommlink 0 · Armor 2 · Pistole 1 · Burglary Gear 1 · Climbing Gear 2 · Subterfuge Supplies 1 · Quiet Weapon 1 · Medieval Weapon 1 · Technical Tools 1 · Demolition Tools 2 · Lighting Gear 1 · Ammo 1';
function esc(s){return String(s??'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/"/g,'&quot;');}
function bx(n,cls){let h='';for(let i=0;i<n;i++)h+='<i class="bx'+(cls?' '+cls:'')+'"></i>';return h;}
function dots(n){let h='<span class="dots">';for(let i=0;i<4;i++)h+='<i class="'+(i<n?'on':'')+'"></i>';return h+'</span>';}
function short(t,max){const s=String(t||'').replace(/<[^>]+>/g,'');const m=s.match(/^.*?[.!?](\s|$)/);let r=(m?m[0]:s).trim();if(r.length>max)r=r.slice(0,max-1).replace(/\s+\S*$/,'')+'…';return r;}
const STORE='fp-runner';
let saved={};try{saved=JSON.parse(localStorage.getItem(STORE)||'{}')||{};}catch(e){saved={};}
function save(){try{localStorage.setItem(STORE,JSON.stringify(saved));}catch(e){}}
function st(id){return saved[id]||(saved[id]={});}

function renderSheet(R,idx,total){
  const a=R.actions||{},s=st(R.id);
  const resist=k=>ATTRS.find(x=>x[0]===k)[2].filter(([id])=>(a[id]||0)>0).length;
  const lb=R.loadBonus||0;
  const supRow=R.sup?`<div class="act sup"><div class="an">${esc(R.sup.name)}<small>${esc(R.sup.gloss)}</small></div>${dots(R.sup.dots)}</div>`:'';
  const attrs=ATTRS.map(([k,de,acts])=>`<div class="attr"><h4><span>${k} <span class="res">· ${de} · Resistance ${resist(k)}d</span></span><span class="kt" title="Karma ${k}">${bx(6,'sm')}</span></h4>${acts.map(([id,en,gl])=>`<div class="act"><div class="an">${en}<small>${gl}</small></div>${dots(a[id]||0)}</div>`).join('')}${k==='Willpower'?supRow:''}</div>`).join('');
  const armor=[['Armor'],['Heavy'],['Special']].concat(R.extraArmor?[['Troll','dash']]:[]).map(([l,c])=>`<label><i class="bx${c?' '+c:''}"></i>${l}</label>`).join('');
  const load=[['Light',3],['Normal',5],['Heavy',6]].map(([l,n])=>`<label><i class="bx"></i>${l} ${n+lb}</label>`).join('');
  const pbDesc=R.pbDesc.replace(/^[^:]+:\s*/,'');
  const spells=R.spells?`<section><h3>${esc(R.spells.h)}</h3><ul class="ab">${R.spells.list.map(sp=>`<li><b>${esc(sp.n)}</b>${sp.t}</li>`).join('')}</ul></section>`:'';
  return `<section class="sheet" id="${R.id}" style="--pb:var(--pb-${R.color})" data-street="${esc(R.street)}">
  <header class="sh">
    <div class="ids">
      <label class="fld big"><span>Straßenname <em>Vorschlag: ${esc(R.street)}</em></span><input type="text" id="${R.id}-b-street" data-k="street" value="${esc(s.street||'')}" autocomplete="off"></label>
      <label class="fld"><span>Name</span><input type="text" id="${R.id}-b-name" data-k="name" value="${esc(s.name||'')}" autocomplete="off"></label>
      <label class="fld"><span>Pronomen</span><input type="text" id="${R.id}-b-pron" data-k="pron" value="${esc(s.pron||'')}" autocomplete="off"></label>
    </div>
    <div class="pbbox"><div class="pbname">${esc(R.pb)}</div><div class="pbdesc">${esc(pbDesc)}</div><p class="role">${R.role}</p><div class="meta">${esc(R.meta)} · Feuerprobe · Runners in the Shadows</div></div>
  </header>
  <div class="cols">
    <div class="col">
      <section><h3>Profil</h3><dl class="kv"><dt>Aussehen</dt><dd>${esc(R.look)}</dd><dt>Herkunft</dt><dd>${esc(R.heritage)}</dd><dt>Hintergrund</dt><dd>${esc(R.background)}</dd><dt>Laster</dt><dd>${esc(R.vice)}</dd><dt>IDN (SIN)</dt><dd>${esc(R.idn)}</dd><dt>Kontakte</dt><dd>${esc(R.friendsLabel)}</dd></dl></section>
      <section><h3>Metatyp · ${esc(R.meta)}</h3><ul class="tr">${R.metaTraits.map(([n,t])=>`<li><b>${esc(n)}.</b> ${esc(t)}</li>`).join('')}</ul></section>
      ${R.cyber?`<section><h3>Implantate & Körper</h3><p class="txt">${R.cyber}</p></section>`:''}
      <section><h3>Karma · Playbook-Leiste <span class="boxes" style="display:inline-flex;vertical-align:middle;margin-left:1mm">${bx(10,'xs')}</span></h3><ul class="tr"><li><b>Playbook:</b> ${R.karma.join(' ')}</li><li>Du hast Überzeugung, Herkunft oder Hintergrund ausgespielt.</li><li>Dein Laster oder Trauma hat dir Ärger gemacht.</li></ul></section>
      ${spells}
    </div>
    <div class="col">
      <section><h3>Actions · 7 Punkte · Kästchen = Karma-Leisten</h3>${attrs}</section>
      <div class="trk" style="margin-top:2mm"><h4>Edge <span>pushen 2 · assistieren 1 · voll = Trauma</span></h4><div class="boxes">${bx(9)}</div><div class="trauma"><span class="boxes">${bx(4,'sm')}</span>${TRAUMA.map(t=>`<span>${t}</span>`).join('')}</div></div>
      <div class="trk"><h4>Harm <span>Stufe 4 = tödlich</span></h4><div class="harm">
        <div class="row"><div class="lv">Stufe 3<small>braucht Hilfe</small></div><div class="cells one"><div class="cell"></div></div></div>
        <div class="row"><div class="lv">Stufe 2<small>−1d</small></div><div class="cells"><div class="cell"></div><div class="cell"></div></div></div>
        <div class="row"><div class="lv">Stufe 1<small>weniger Effect</small></div><div class="cells"><div class="cell"></div><div class="cell"></div></div></div>
      </div></div>
      <div class="trk"><div class="grp"><div><h5>Armor</h5><div class="inl">${armor}</div></div><div><h5>Load${lb?' (+'+lb+')':''}</h5><div class="inl">${load}</div></div></div></div>
    </div>
    <div class="col">
      <section><h3>Spezialfähigkeiten</h3><ul class="ab">${R.abilities.map(ab=>`<li><b>${esc(ab.n)}<i>${esc(ab.tag)}</i></b>${ab.t}</li>`).join('')}</ul></section>
      <section><h3>Ausrüstung · Kästchen = eingepackt · ● empfohlen</h3><table class="items"><tbody>${R.items.map(it=>`<tr class="${it.rec?'rec':''}"><td class="ck"><i class="bx sm"></i></td><td class="ld">${it.l}</td><td><b>${esc(it.n)}</b> ${esc(short(it.t,80))}</td></tr>`).join('')}</tbody></table><p class="std"><b>Standard jederzeit:</b> ${STD}</p></section>
      <section><h3>So glänzt du im Meridian Spire</h3><ul class="shine">${R.shine.map(x=>`<li>${x}</li>`).join('')}</ul></section>
      <div class="trk" style="margin-top:2mm"><div class="grp"><div><h5>Nuyen <span style="font:400 5.8pt 'IBM Plex Mono',monospace;text-transform:none;letter-spacing:0;color:var(--muted)">Start 2</span></h5><div class="boxes">${bx(4)}</div></div><div><h5>Stash</h5><div class="stash">${bx(20,'xs')}</div></div></div></div>
    </div>
  </div>
  <div class="band">
    <section style="margin-top:0"><h3>Freund</h3><p><b>${esc(R.friend.n)}.</b> ${R.friend.t}</p></section>
    <section style="margin-top:0"><h3>Rivale</h3><p><b>${esc(R.rival.n)}.</b> ${R.rival.t}</p></section>
    <section style="margin-top:0"><h3>Warum du diesen Job nimmst</h3><p>${R.why}</p></section>
    <section class="lore"><b>${esc(R.lore.h)}.</b> ${R.lore.t}</section>
  </div>
  <footer class="foot"><span><b>Würfeln:</b> nur der höchste W6 zählt · 6 Erfolg · 4/5 Erfolg mit Consequence · 1–3 Fehlschlag · zwei 6en Critical · Position tauschen gegen Effect</span><span>Bogen ${idx+1}/${total}</span></footer>
</section>`;
}

function applyHash(){
  const id=(location.hash||'').replace('#','');
  const ok=RUNNERS.some(r=>r.id===id);
  document.body.classList.toggle('only',ok);
  document.querySelectorAll('.sheet').forEach(s=>s.classList.toggle('show',s.id===id));
  const sel=document.getElementById('selRunner');if(sel)sel.value=ok?id:'';
}
function fillStreets(on){
  document.querySelectorAll('.sheet').forEach(sh=>{const inp=sh.querySelector('input[data-k="street"]');if(!inp)return;
    if(on&&!inp.value){inp.value=sh.dataset.street;inp.dataset.auto='1';}
    else if(!on&&inp.dataset.auto==='1'){inp.value='';delete inp.dataset.auto;}
  });
}
window.fpCheck=()=>[...document.querySelectorAll('.sheet')].map(s=>({id:s.id,sheetOverflow:s.scrollHeight-s.clientHeight,cols:[...s.querySelectorAll('.col')].map(c=>{const k=[...c.children];return Math.round(k.reduce((a,x)=>a+x.getBoundingClientRect().height,0)+(k.length-1)*2*3.7795);}),colsBox:Math.round(s.querySelector('.cols').getBoundingClientRect().height),band:Math.round(s.querySelector('.band').getBoundingClientRect().height),head:Math.round(s.querySelector('.sh').getBoundingClientRect().height)}));

(function boot(){
  const stack=document.getElementById('stack');
  stack.innerHTML=RUNNERS.map((R,i)=>renderSheet(R,i,RUNNERS.length)).join('');
  const sel=document.getElementById('selRunner');
  RUNNERS.forEach(R=>{const o=document.createElement('option');o.value=R.id;o.textContent=`${R.street} · ${R.pb} · ${R.meta}`;sel.appendChild(o);});
  sel.addEventListener('change',()=>{if(sel.value)location.hash=sel.value;else history.replaceState(null,'',location.pathname);applyHash();window.scrollTo(0,0);});
  window.addEventListener('hashchange',applyHash);
  document.querySelectorAll('.sheet input').forEach(i=>i.addEventListener('input',()=>{const id=i.closest('.sheet').id;st(id)[i.dataset.k]=i.value;delete i.dataset.auto;save();}));
  const chk=document.getElementById('chkStreet');
  let pre=false;try{pre=localStorage.getItem('fp-bogen-street')==='1';}catch(e){}
  chk.checked=pre;fillStreets(pre);
  chk.addEventListener('change',()=>{fillStreets(chk.checked);try{localStorage.setItem('fp-bogen-street',chk.checked?'1':'0');}catch(e){}});
  document.getElementById('btnClear').addEventListener('click',()=>{document.querySelectorAll('.sheet input').forEach(i=>{i.value='';delete i.dataset.auto;const s=st(i.closest('.sheet').id);delete s[i.dataset.k];});chk.checked=false;save();try{localStorage.setItem('fp-bogen-street','0');}catch(e){}});
  document.getElementById('btnPrint').addEventListener('click',()=>{try{window.print();}catch(e){}});
  applyHash();
})();
