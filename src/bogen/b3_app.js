/* ---------- Spielerbögen / player sheets: ein Runner pro A4, DE + EN ---------- */
const UI={
 de:{sub:'ein Runner pro A4',selAll:'Alle acht',chkStreet:'Straßennamen vorausfüllen',btnClear:'Eingaben leeren',btnPrint:'Drucken',
  hint:'Straßenname, Name und Pronomen lassen sich hier eintippen und werden mitgedruckt; leer gelassen bleiben Schreiblinien für den Tisch. Drucken funktioniert aus der Datei im Repo oder den fertigen PDFs, nicht aus der claude.ai-Ansicht.',
  street:'Straßenname',suggest:'Vorschlag',name:'Name',pron:'Pronomen',meta:'Feuerprobe · Runners in the Shadows',
  profile:'Profil',look:'Aussehen',heritage:'Herkunft',background:'Hintergrund',vice:'Laster',idn:'IDN (SIN)',contacts:'Kontakte',metatype:'Metatyp',implants:'Implantate & Körper',
  karma:'Karma · Playbook-Leiste',karmaPb:'Playbook:',karma2:'Du hast Überzeugung, Herkunft oder Hintergrund ausgespielt.',karma3:'Dein Laster oder Trauma hat dir Ärger gemacht.',
  actions:'Actions · 7 Punkte · Kästchen = Karma-Leisten',resist:'Resistance',sup:'übernatürlich',
  edge:'Edge',edgeSub:'pushen 2 · assistieren 1 · voll = Trauma',harm:'Harm',harmSub:'Stufe 4 = tödlich',lvl:'Stufe',h3:'braucht Hilfe',h2:'−1d',h1:'weniger Effect',
  armor:'Armor',load:'Load',loadSub:'vor dem Run wählen',loadBonus:'durch Metatyp',nuyen:'Nuyen',nuyenSub:'Start 2',stash:'Stash',
  abilities:'Spezialfähigkeiten',gear:'Ausrüstung · Kästchen = eingepackt · ● empfohlen',std:'Standard jederzeit:',
  stdList:'Kommlink 0 · Armor 2 · Pistole 1 · Burglary Gear 1 · Climbing Gear 2 · Subterfuge Supplies 1 · Quiet Weapon 1 · Medieval Weapon 1 · Technical Tools 1 · Demolition Tools 2 · Lighting Gear 1 · Ammo 1',
  shine:'So glänzt du im Meridian Spire',friend:'Freund',rival:'Rivale',why:'Warum du diesen Job nimmst',
  dice:'<b>Würfeln:</b> nur der höchste W6 zählt · 6 Erfolg · 4/5 Erfolg mit Consequence · 1–3 Fehlschlag · zwei 6en Critical · Position tauschen gegen Effect',sheet:'Bogen',
  glosses:{engineer:'Technik, Basteln',interface:'Matrix, Hacken',stalk:'Aufspüren, Zielen',survey:'Beobachten, Lage',fight:'Kämpfen',finesse:'Geschick, Fahrzeuge',prowl:'Schleichen, Klettern',wreck:'Zerstören, Gewalt',command:'Befehlen, Drohen',consort:'Umgang, Kontakte',influence:'Überzeugen, Täuschen',study:'Analysieren, Zaubern'},
  attrDe:{Intuition:'Intuition',Body:'Körper',Willpower:'Wille'}},
 en:{sub:'one runner per A4 page',selAll:'All eight',chkStreet:'Prefill street names',btnClear:'Clear entries',btnPrint:'Print',
  hint:'Street name, name and pronouns can be typed here and are printed with the sheet; left empty they remain writing lines for the table. Printing works from the file in the repo or the ready-made PDFs, not from the claude.ai view.',
  street:'Street name',suggest:'Suggestion',name:'Name',pron:'Pronouns',meta:'Feuerprobe · Runners in the Shadows',
  profile:'Profile',look:'Look',heritage:'Heritage',background:'Background',vice:'Vice',idn:'IDN (SIN)',contacts:'Contacts',metatype:'Metatype',implants:'Implants & body',
  karma:'Karma · playbook track',karmaPb:'Playbook:',karma2:'You expressed your beliefs, heritage or background.',karma3:'Your vice or trauma caused you trouble.',
  actions:'Actions · 7 dots · boxes = karma tracks',resist:'Resistance',sup:'supernatural',
  edge:'Edge',edgeSub:'push 2 · assist 1 · full = trauma',harm:'Harm',harmSub:'level 4 = fatal',lvl:'Level',h3:'needs help',h2:'−1d',h1:'less effect',
  armor:'Armor',load:'Load',loadSub:'choose before the run',loadBonus:'from metatype',nuyen:'Nuyen',nuyenSub:'start 2',stash:'Stash',
  abilities:'Special abilities',gear:'Gear · box = packed · ● recommended',std:'Standard anytime:',
  stdList:'Comm 0 · Armor 2 · Pistol 1 · Burglary Gear 1 · Climbing Gear 2 · Subterfuge Supplies 1 · Quiet Weapon 1 · Medieval Weapon 1 · Technical Tools 1 · Demolition Tools 2 · Lighting Gear 1 · Ammo 1',
  shine:'How you shine in the Meridian Spire',friend:'Friend',rival:'Rival',why:'Why you take this job',
  dice:'<b>Rolling:</b> only the highest d6 counts · 6 success · 4/5 success with consequence · 1–3 failure · two 6s critical · trade position for effect',sheet:'Sheet',
  glosses:{engineer:'tech, tinkering',interface:'Matrix, hacking',stalk:'tracking, aiming',survey:'observing, the scene',fight:'combat',finesse:'dexterity, vehicles',prowl:'sneaking, climbing',wreck:'breaking, force',command:'orders, threats',consort:'rapport, contacts',influence:'persuasion, deceit',study:'analysis, spellcasting'},
  attrDe:{Intuition:'Intuition',Body:'Body',Willpower:'Willpower'}},
};
const ATTRS=[['Intuition',[['engineer','Engineer'],['interface','Interface'],['stalk','Stalk'],['survey','Survey']]],['Body',[['fight','Fight'],['finesse','Finesse'],['prowl','Prowl'],['wreck','Wreck']]],['Willpower',[['command','Command'],['consort','Consort'],['influence','Influence'],['study','Study']]]];
const TRAUMA=['Cold','Haunted','Obsessed','Paranoid','Reckless','Soft','Unstable','Vicious'];
function esc(s){return String(s??'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/"/g,'&quot;');}
function bx(n,cls){let h='';for(let i=0;i<n;i++)h+='<i class="bx'+(cls?' '+cls:'')+'"></i>';return h;}
function dots(n){let h='<span class="dots">';for(let i=0;i<4;i++)h+='<i class="'+(i<n?'on':'')+'"></i>';return h+'</span>';}
function short(t,max){const s=String(t||'').replace(/<[^>]+>/g,'');const m=s.match(/^.*?[.!?](\s|$)/);let r=(m?m[0]:s).trim();if(r.length>max)r=r.slice(0,max-1).replace(/\s+\S*$/,'')+'…';return r;}
/* Sprachschicht: EN-Texte über die deutsche Basis legen (Arrays nach Index) */
function loc(R,lang){
  if(lang!=='en'||!EN[R.id])return R;const e=EN[R.id];const o=Object.assign({},R,e);
  o.metaTraits=R.metaTraits.map((t,i)=>[t[0],(e.metaTraits||[])[i]??t[1]]);
  o.abilities=R.abilities.map((a,i)=>Object.assign({},a,(e.abilities||[])[i]||{}));
  o.items=R.items.map((it,i)=>Object.assign({},it,{t:(e.items||[])[i]??it.t}));
  o.karma=e.karma||R.karma;o.shine=e.shine||R.shine;o.lore=e.lore||R.lore;o.friend=e.friend||R.friend;o.rival=e.rival||R.rival;
  if(R.sup)o.sup=Object.assign({},R.sup,e.sup||{});if(R.spells)o.spells=e.spells||R.spells;
  return o;
}
const STORE='fp-runner';
let saved={};try{saved=JSON.parse(localStorage.getItem(STORE)||'{}')||{};}catch(e){saved={};}
function save(){try{localStorage.setItem(STORE,JSON.stringify(saved));}catch(e){}}
function st(id){return saved[id]||(saved[id]={});}
let lang='de';
(function(){try{const q=new URLSearchParams(location.search).get('lang');if(q==='en'||q==='de')lang=q;else{const v=localStorage.getItem('fp-lang');if(v==='en'||v==='de')lang=v;}}catch(e){}})();

function renderSheet(R0,idx,total){
  const T=UI[lang],R=loc(R0,lang),a=R.actions||{},s=st(R.id),lb=R.loadBonus||0;
  const resist=k=>ATTRS.find(x=>x[0]===k)[1].filter(([id])=>(a[id]||0)>0).length;
  const supRow=R.sup?`<div class="act sup" data-sup="${esc(T.sup)}"><div class="an">${esc(R.sup.name)}<small>${esc(R.sup.gloss)}</small></div>${dots(R.sup.dots)}</div>`:'';
  const attrs=ATTRS.map(([k,acts])=>`<div class="attr"><h4><span>${k} <span class="res">· ${T.attrDe[k]} · ${T.resist} ${resist(k)}d</span></span><span class="kt" title="Karma ${k}">${bx(6,'sm')}</span></h4>${acts.map(([id,en])=>`<div class="act"><div class="an">${en}<small>${T.glosses[id]}</small></div>${dots(a[id]||0)}</div>`).join('')}${k==='Willpower'?supRow:''}</div>`).join('');
  const armor=[['Armor'],['Heavy'],['Special']].concat(R.extraArmor?[['Troll','dash']]:[]).map(([l,c])=>`<label><i class="bx${c?' '+c:''}"></i>${l}</label>`).join('');
  const load=[['Light',3],['Normal',5],['Heavy',6]].map(([l,n])=>`<label><i class="bx"></i>${l} ${n+lb}</label>`).join('');
  const pbDesc=R.pbDesc.replace(/^[^:]+:\s*/,'');
  const spells=R.spells?`<section><h3>${esc(R.spells.h)}</h3><ul class="ab">${R.spells.list.map(sp=>`<li><b>${esc(sp.n)}</b>${sp.t}</li>`).join('')}</ul></section>`:'';
  return `<section class="sheet" id="${R.id}" style="--pb:var(--pb-${R.color})" data-street="${esc(R.street)}">
  <header class="sh">
    <div class="ids">
      <label class="fld big"><span>${T.street} <em>${T.suggest}: ${esc(R.street)}</em></span><input type="text" id="${R.id}-b-street" data-k="street" value="${esc(s.street||'')}" autocomplete="off"></label>
      <label class="fld"><span>${T.name}</span><input type="text" id="${R.id}-b-name" data-k="name" value="${esc(s.name||'')}" autocomplete="off"></label>
      <label class="fld"><span>${T.pron}</span><input type="text" id="${R.id}-b-pron" data-k="pron" value="${esc(s.pron||'')}" autocomplete="off"></label>
    </div>
    <div class="pbbox"><div class="pbname">${esc(R.pb)}</div><div class="pbdesc">${esc(pbDesc)}</div><p class="role">${R.role}</p><div class="meta">${esc(R.meta)} · ${T.meta}</div></div>
  </header>
  <div class="cols">
    <div class="col">
      <section><h3>${T.profile}</h3><dl class="kv"><dt>${T.look}</dt><dd>${esc(R.look)}</dd><dt>${T.heritage}</dt><dd>${esc(R.heritage)}</dd><dt>${T.background}</dt><dd>${esc(R.background)}</dd><dt>${T.vice}</dt><dd>${esc(R.vice)}</dd><dt>${T.idn}</dt><dd>${esc(R.idn)}</dd><dt>${T.contacts}</dt><dd>${esc(R.friendsLabel)}</dd></dl></section>
      <section><h3>${T.metatype} · ${esc(R.meta)}</h3><ul class="tr">${R.metaTraits.map(([n,t])=>`<li><b>${esc(n)}.</b> ${esc(t)}</li>`).join('')}</ul></section>
      ${R.cyber?`<section><h3>${T.implants}</h3><p class="txt">${R.cyber}</p></section>`:''}
      <section><h3>${T.karma} <span class="boxes" style="display:inline-flex;vertical-align:middle;margin-left:1mm">${bx(10,'xs')}</span></h3><ul class="tr"><li><b>${T.karmaPb}</b> ${R.karma.join(' ')}</li><li>${T.karma2}</li><li>${T.karma3}</li></ul></section>
      ${spells}
    </div>
    <div class="col">
      <section><h3>${T.actions}</h3>${attrs}</section>
      <div class="trk" style="margin-top:2mm"><h4>${T.edge} <span>${T.edgeSub}</span></h4><div class="boxes">${bx(9)}</div><div class="trauma"><span class="boxes">${bx(4,'sm')}</span>${TRAUMA.map(t=>`<span>${t}</span>`).join('')}</div></div>
      <div class="trk"><h4>${T.harm} <span>${T.harmSub}</span></h4><div class="harm">
        <div class="row"><div class="lv">${T.lvl} 3<small>${T.h3}</small></div><div class="cells one"><div class="cell"></div></div></div>
        <div class="row"><div class="lv">${T.lvl} 2<small>${T.h2}</small></div><div class="cells"><div class="cell"></div><div class="cell"></div></div></div>
        <div class="row"><div class="lv">${T.lvl} 1<small>${T.h1}</small></div><div class="cells"><div class="cell"></div><div class="cell"></div></div></div>
      </div></div>
      <div class="trk"><div class="grp"><div><h5>${T.armor}</h5><div class="inl">${armor}</div></div><div><h5>${T.load}${lb?' (+'+lb+')':''}</h5><div class="inl">${load}</div></div></div></div>
    </div>
    <div class="col">
      <section><h3>${T.abilities}</h3><ul class="ab">${R.abilities.map(ab=>`<li><b>${esc(ab.n)}<i>${esc(ab.tag)}</i></b>${ab.t}</li>`).join('')}</ul></section>
      <section><h3>${T.gear}</h3><table class="items"><tbody>${R.items.map(it=>`<tr class="${it.rec?'rec':''}"><td class="ck"><i class="bx sm"></i></td><td class="ld">${it.l}</td><td><b>${esc(it.n)}</b> ${esc(short(it.t,80))}</td></tr>`).join('')}</tbody></table><p class="std"><b>${T.std}</b> ${T.stdList}</p></section>
      <section><h3>${T.shine}</h3><ul class="shine">${R.shine.map(x=>`<li>${x}</li>`).join('')}</ul></section>
      <div class="trk" style="margin-top:2mm"><div class="grp"><div><h5>${T.nuyen} <span style="font:400 5.8pt 'IBM Plex Mono',monospace;text-transform:none;letter-spacing:0;color:var(--muted)">${T.nuyenSub}</span></h5><div class="boxes">${bx(4)}</div></div><div><h5>${T.stash}</h5><div class="stash">${bx(20,'xs')}</div></div></div></div>
    </div>
  </div>
  <div class="band">
    <section style="margin-top:0"><h3>${T.friend}</h3><p><b>${esc(R.friend.n)}.</b> ${R.friend.t}</p></section>
    <section style="margin-top:0"><h3>${T.rival}</h3><p><b>${esc(R.rival.n)}.</b> ${R.rival.t}</p></section>
    <section style="margin-top:0"><h3>${T.why}</h3><p>${R.why}</p></section>
    <section class="lore"><b>${esc(R.lore.h)}.</b> ${R.lore.t}</section>
  </div>
  <footer class="foot"><span>${T.dice}</span><span>${T.sheet} ${idx+1}/${total}</span></footer>
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

function renderAll(){
  const T=UI[lang];document.documentElement.lang=lang;
  document.getElementById('tbSub').textContent=T.sub;document.getElementById('tbHint').textContent=T.hint;
  document.getElementById('lblStreet').textContent=T.chkStreet;document.getElementById('btnClear').textContent=T.btnClear;document.getElementById('btnPrint').textContent=T.btnPrint;
  document.getElementById('langDE').setAttribute('aria-pressed',lang==='de'?'true':'false');document.getElementById('langEN').setAttribute('aria-pressed',lang==='en'?'true':'false');
  const sel=document.getElementById('selRunner');sel.innerHTML=`<option value="">${T.selAll}</option>`+RUNNERS.map(R=>{const L=loc(R,lang);return `<option value="${R.id}">${esc(L.street)} · ${esc(R.pb)} · ${esc(R.meta)}</option>`;}).join('');
  document.getElementById('stack').innerHTML=RUNNERS.map((R,i)=>renderSheet(R,i,RUNNERS.length)).join('');
  document.querySelectorAll('.sheet input').forEach(i=>i.addEventListener('input',()=>{const id=i.closest('.sheet').id;st(id)[i.dataset.k]=i.value;delete i.dataset.auto;save();}));
  const chk=document.getElementById('chkStreet');fillStreets(chk.checked);
  applyHash();
}
(function boot(){
  const sel=document.getElementById('selRunner');
  sel.addEventListener('change',()=>{if(sel.value)location.hash=sel.value;else history.replaceState(null,'',location.pathname+location.search);applyHash();window.scrollTo(0,0);});
  window.addEventListener('hashchange',applyHash);
  const chk=document.getElementById('chkStreet');
  let pre=false;try{pre=localStorage.getItem('fp-bogen-street')==='1';}catch(e){}
  chk.checked=pre;
  chk.addEventListener('change',()=>{fillStreets(chk.checked);try{localStorage.setItem('fp-bogen-street',chk.checked?'1':'0');}catch(e){}});
  document.getElementById('btnClear').addEventListener('click',()=>{document.querySelectorAll('.sheet input').forEach(i=>{i.value='';delete i.dataset.auto;const s=st(i.closest('.sheet').id);delete s[i.dataset.k];});chk.checked=false;save();try{localStorage.setItem('fp-bogen-street','0');}catch(e){}});
  document.getElementById('btnPrint').addEventListener('click',()=>{try{window.print();}catch(e){}});
  const setLang=l=>{lang=l;try{localStorage.setItem('fp-lang',l);}catch(e){}renderAll();};
  document.getElementById('langDE').addEventListener('click',()=>setLang('de'));
  document.getElementById('langEN').addEventListener('click',()=>setLang('en'));
  renderAll();
})();
