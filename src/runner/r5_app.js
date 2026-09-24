/* ---------- Dossiers: Renderer, DE + EN ---------- */
const UI={
 de:{subtitle:'Acht vorgefertigte Runner für den Oneshot im Meridian Spire · Seattle 2080',gmOn:'SL-Notizen anzeigen',gmOff:'Spieleransicht',plans:'Zu den Plänen des Meridian Spire',
  role:'Rolle im Run:',profile:'Profil',look:'Aussehen',heritage:'Herkunft',background:'Hintergrund',vice:'Laster',idn:'IDN (SIN)',contacts:'Kontakte',metatype:'Metatyp:',implants:'Implantate & Körper',
  karma:'Karma-Auslöser',karmaAlways:'Dazu immer: Überzeugung, Herkunft oder Hintergrund ausgespielt · Laster oder Trauma haben Ärger gemacht.',
  actions:'Actions · 7 Punkte',sup:'Übernatürlich',resist:'Resistance',edgeSub:'Kästchen · pushen 2 · assistieren 1',harm:'Harm',harmSub:'Stufe 4 = tödlich',lvl:'Stufe',h1:'weniger Effect',h2:'−1d',h3:'braucht Hilfe',
  armor:'Armor',armorTroll:'Troll-Panzer',load:'Load',loadDefault:'Light 3 · Normal 5 · Heavy 6',loadBonus:'durch Metatyp',nuyen:'Nuyen',nuyenSub:'Start 2 · Stash 0',nuyenText:'Bezahlung laut Johnson: 6 Nuyen für die Crew bei sauberer Übergabe.',reset:'Tracker zurücksetzen',
  abilities:'Spezialfähigkeiten',gear:'Ausrüstung · Load',gearHint:'● empfohlen für die Feuerprobe. Dazu jederzeit Standardausrüstung: Kommlink (0), Armor (2), Pistole (1), Burglary Gear (1), Climbing Gear (2), Subterfuge Supplies (1) und mehr.',
  friend:'Freund',rival:'Rivale',why:'Warum du diesen Job nimmst',shine:'So glänzt du im Meridian Spire',lore:'Shadowrun-Einblick:',gm:'Nur für die Spielleitung',
  name:'Name',namePh:'frei wählbar · „{s}“ ist nur der Straßenname',pron:'Pronomen',pronPh:'sie · er · dey · …',
  crews:'Empfohlene Crews für 3–4 Spieler:innen.',crewsSub:'Jede Zusammenstellung deckt Zugang, Keycard, Venn und den Weg nach 110 auf eigene Weise ab.',
  fine:'Fan-Material für den privaten Spieltisch. <i>Runners in the Shadows</i> ist ein Forged-in-the-Dark-Spiel von Mark Cleveland Massengale; <i>Shadowrun</i> ist eine Marke von The Topps Company / Catalyst Game Labs. Fähigkeiten, Gegenstände und Metatyp-Merkmale folgen der RitS-Version 0.998, ins Deutsche übertragen; Namen, Kontakte und Geheimnisse sind Eigenkreationen für die Feuerprobe.',
  glosses:{engineer:'Technik, Basteln, Reparieren',interface:'Matrix, Hacken, Geräte steuern',stalk:'Aufspüren, Verfolgen, Zielen',survey:'Beobachten, Lage erfassen',fight:'Kämpfen, Nahkampf, Schusswechsel',finesse:'Geschick, Präzision, Fahrzeuge',prowl:'Schleichen, Klettern, Verstecken',wreck:'Zerstören, Sprengen, rohe Gewalt',command:'Befehlen, Einschüchtern',consort:'Umgang, Netzwerken, Kontakte',influence:'Überzeugen, Täuschen, Charme',study:'Analysieren, Wissen, Zaubern'},
  attrDe:{Intuition:'Intuition',Body:'Körper',Willpower:'Wille'}},
 en:{subtitle:'Eight pregenerated runners for the one-shot in the Meridian Spire · Seattle 2080',gmOn:'Show GM notes',gmOff:'Player view',plans:'To the Meridian Spire plans (German)',
  role:'Role in the run:',profile:'Profile',look:'Look',heritage:'Heritage',background:'Background',vice:'Vice',idn:'IDN (SIN)',contacts:'Contacts',metatype:'Metatype:',implants:'Implants & body',
  karma:'Karma triggers',karmaAlways:'Always in addition: you expressed your beliefs, heritage or background · your vice or trauma caused trouble.',
  actions:'Actions · 7 dots',sup:'Supernatural',resist:'Resistance',edgeSub:'boxes · push 2 · assist 1',harm:'Harm',harmSub:'level 4 = fatal',lvl:'Level',h1:'less effect',h2:'−1d',h3:'needs help',
  armor:'Armor',armorTroll:'Troll armor',load:'Load',loadDefault:'Light 3 · Normal 5 · Heavy 6',loadBonus:'from metatype',nuyen:'Nuyen',nuyenSub:'start 2 · stash 0',nuyenText:'Johnson’s pay: 6 nuyen for the crew on a clean handover.',reset:'Reset trackers',
  abilities:'Special abilities',gear:'Gear · load',gearHint:'● recommended for the Trial by Fire. Standard gear anytime: Comm (0), Armor (2), Pistol (1), Burglary Gear (1), Climbing Gear (2), Subterfuge Supplies (1) and more.',
  friend:'Friend',rival:'Rival',why:'Why you take this job',shine:'How you shine in the Meridian Spire',lore:'Shadowrun insight:',gm:'GM only',
  name:'Name',namePh:'your choice · “{s}” is just the street name',pron:'Pronouns',pronPh:'she · he · they · …',
  crews:'Recommended crews for 3–4 players.',crewsSub:'Each line-up covers entry, keycard, Venn and the way down to 110 in its own way.',
  fine:'Fan material for the private gaming table. <i>Runners in the Shadows</i> is a Forged in the Dark game by Mark Cleveland Massengale; <i>Shadowrun</i> is a trademark of The Topps Company / Catalyst Game Labs. Abilities, items and metatype traits follow RitS version 0.998; names, contacts and secrets are original creations for the Feuerprobe one-shot.',
  glosses:{engineer:'tech, tinkering, repairs',interface:'Matrix, hacking, controlling devices',stalk:'tracking, hunting, aiming',survey:'observing, reading the scene',fight:'combat, melee, gunfire',finesse:'dexterity, precision, vehicles',prowl:'sneaking, climbing, hiding',wreck:'breaking, blasting, brute force',command:'orders, intimidation',consort:'rapport, networking, contacts',influence:'persuasion, deceit, charm',study:'analysis, knowledge, spellcasting'},
  attrDe:{Intuition:'Intuition',Body:'Body',Willpower:'Willpower'}},
};
const INTRO={
 de:`<article class="card"><h2>Willkommen in den Schatten</h2>
<p><b>Seattle, 2080.</b> Die Stadt gehört den Megakonzernen. Ihre Türme stehen auf exterritorialem Boden, ihre Sicherheitsdienste ersetzen die Polizei, ihre Werbung hängt als AR-Schicht über jeder Straße. In Bellevue glitzert das Geld, in den Redmond Barrens fällt der Strom stundenweise aus.</p>
<p><b>Metamenschen.</b> Seit dem Erwachen der Magie (2011) und der Goblinisierung (2021) gibt es Elfen, Zwerge, Orks und Trolle. Sie sind Nachbarn, Kolleginnen, Kinder. Vorurteile gegen Orks und Trolle gehören trotzdem zum Alltag, und mancher Elf tut so, als wäre er etwas Besseres.</p>
<p><b>Die Matrix.</b> Jeder trägt ein Kommlink, jede Oberfläche spricht mit dir. Wer tiefer will, geht per Trodes oder Datenbuchse in die virtuelle Realität. Hacker knacken Konzernsysteme, Konzern-Spinnen jagen sie.</p>
<p><b>Magie.</b> Erwachte sind selten und begehrt. Magier zaubern und beschwören Geister, Adepten lenken Magie in ihren Körper. Es gibt Astralraum, Manabarrieren und Drachen, die Konzerne leiten und in den Nachrichten auftreten.</p>
<p><b>Runner.</b> Ihr seid Profis ohne offizielle Existenz. Wer keine SIN (System-Identifikationsnummer) hat, ist für den Staat nicht da: kein Konto, keine Wohnung, keine Rechte. Dafür gibt es Aufträge von Leuten, die sich <i>Mr. Johnson</i> nennen, bezahlt in Nuyen. Die alte Regel lautet: Vertrau niemandem. Schieß nie zuerst. Halt dich an den Deal.</p></article>
<article class="card"><h2>So liest du deinen Bogen</h2><ul class="rules">
<li><span>Actions</span><span>Zwölf Fertigkeiten in drei Gruppen. Du würfelst so viele W6, wie die Action Punkte hat, und zählst nur den höchsten: <span class="dice">6</span> voller Erfolg, <span class="dice">4/5</span> Erfolg mit Consequence, <span class="dice">1–3</span> schlecht. Zwei Sechsen sind ein Critical. Null Punkte: zwei Würfel, der schlechtere zählt.</span></li>
<li><span>Position</span><span>Vor dem Wurf sagt die SL, wie gefährlich (Controlled, Risky, Desperate) und wie wirksam (Limited, Standard, Great) dein Ansatz ist. Du darfst tauschen: mehr Risiko für mehr Wirkung.</span></li>
<li><span>Edge</span><span>Deine Reserve (9 Kästchen). 2 Edge: dich pushen, +1d oder mehr Effect. 1 Edge: einem Teammitglied assistieren. Eine Consequence darfst du mit einem Resistance Roll abmildern; der Wurf bestimmt, was es kostet. Volles Edge bedeutet ein Trauma.</span></li>
<li><span>Resistance</span><span>Gewürfelt wird mit der Attributsgruppe: so viele W6, wie du dort Actions mit mindestens einem Punkt hast. Der Wert steht auf dem Bogen.</span></li>
<li><span>Harm</span><span>Stufe 1 (leicht): weniger Effect. Stufe 2 (mittel): −1d. Stufe 3 (schwer): du brauchst Hilfe. Stufe 4 ist tödlich. Armor-Kästchen fangen Schaden ab, Special Armor nur das, was deine Fähigkeit nennt.</span></li>
<li><span>Load</span><span>Du legst vor dem Run nur fest, wie viel du trägst (Light 3, Normal 5, Heavy 6). Welche Gegenstände das sind, entscheidest du, wenn du sie brauchst. ● markiert unsere Empfehlung für diesen Run.</span></li>
<li><span>Flashback</span><span>Ihr müsst nicht alles vorausplanen. Erkläre mitten im Run, was du vorbereitet hattest, und zahle dafür Edge (0 bis 2, je nach Aufwand).</span></li>
<li><span>Karma</span><span>Am Ende der Sitzung: Karma für deine Playbook-Auslöser, dafür, dass du Herkunft oder Überzeugung ausgespielt hast, und wenn dein Laster oder Trauma dir Probleme gemacht hat.</span></li></ul>
<h3>Name, Geschlecht, Gesicht</h3><p class="small">Die Bögen legen weder Namen noch Geschlecht fest. Der große Titel ist nur der Straßenname, unter dem die Figur in den Schatten bekannt ist; Name und Pronomen trägst du oben im Bogen selbst ein. Aussehen, Herkunft und Hintergrund sind Vorschläge, die du mit der SL anpassen kannst.</p>
<h3>Aufbau der Werte</h3><p class="small">Jeder Bogen hat 7 Action-Punkte (drei vom Playbook, vier frei), keine Action über 2. Erwachte tragen ihre Pflichtfähigkeit zusätzlich zur gewählten Startfähigkeit. Die drei Playbook-Punkte stehen auf deinem offiziellen Playbook-Bogen; weichen sie von hier ab, verschiebe einfach einen der freien Punkte.</p></article>`,
 en:`<article class="card"><h2>Welcome to the shadows</h2>
<p><b>Seattle, 2080.</b> The city belongs to the megacorporations. Their towers stand on extraterritorial ground, their security services replace the police, their advertising hangs as an AR layer over every street. In Bellevue the money glitters; in the Redmond Barrens the power goes out for hours.</p>
<p><b>Metahumans.</b> Since the Awakening of magic (2011) and goblinization (2021) there are elves, dwarves, orks and trolls. They are neighbors, colleagues, children. Prejudice against orks and trolls is still everyday life, and some elves act as if they were something better.</p>
<p><b>The Matrix.</b> Everyone carries a commlink, every surface talks to you. Those who want to go deeper enter virtual reality via trodes or datajack. Hackers crack corporate systems; corporate spiders hunt them.</p>
<p><b>Magic.</b> The Awakened are rare and in demand. Mages cast spells and summon spirits; adepts channel magic into their bodies. There is astral space, mana barriers and dragons who run corporations and appear on the news.</p>
<p><b>Runners.</b> You are professionals without an official existence. Whoever has no SIN (System Identification Number) does not exist for the state: no account, no apartment, no rights. In return there are jobs from people who call themselves <i>Mr. Johnson</i>, paid in nuyen. The old rule: Never trust anyone. Never shoot first. Stick to the deal.</p></article>
<article class="card"><h2>How to read your sheet</h2><ul class="rules">
<li><span>Actions</span><span>Twelve skills in three groups. Roll as many d6 as the action has dots and count only the highest: <span class="dice">6</span> full success, <span class="dice">4/5</span> success with a consequence, <span class="dice">1–3</span> bad. Two sixes are a critical. Zero dots: roll two dice, the worse one counts.</span></li>
<li><span>Position</span><span>Before the roll the GM says how dangerous (controlled, risky, desperate) and how effective (limited, standard, great) your approach is. You may trade: more risk for more effect.</span></li>
<li><span>Edge</span><span>Your reserve (9 boxes). 2 edge: push yourself, +1d or more effect. 1 edge: assist a teammate. You may soften a consequence with a resistance roll; the roll decides what it costs. A full edge track means a trauma.</span></li>
<li><span>Resistance</span><span>Roll with the attribute group: as many d6 as you have actions with at least one dot there. The value is on the sheet.</span></li>
<li><span>Harm</span><span>Level 1 (lesser): less effect. Level 2 (moderate): −1d. Level 3 (severe): you need help. Level 4 is fatal. Armor boxes absorb harm; special armor only what your ability names.</span></li>
<li><span>Load</span><span>Before the run you only decide how much you carry (light 3, normal 5, heavy 6). Which items those are you decide when you need them. ● marks our recommendation for this run.</span></li>
<li><span>Flashback</span><span>You do not have to plan everything ahead. Mid-run, explain what you had prepared and pay edge for it (0 to 2, depending on effort).</span></li>
<li><span>Karma</span><span>At the end of the session: karma for your playbook triggers, for expressing heritage or beliefs, and when your vice or trauma caused you trouble.</span></li></ul>
<h3>Name, gender, face</h3><p class="small">The sheets fix neither name nor gender. The big title is only the street name the character is known by in the shadows; you enter name and pronouns at the top of the sheet yourself. Look, heritage and background are suggestions you can adjust with the GM.</p>
<h3>How the numbers work</h3><p class="small">Every sheet has 7 action dots (three from the playbook, four free), no action above 2. Awakened characters carry their required ability in addition to the chosen starting ability. The three playbook dots are on your official playbook sheet; if they differ from here, simply move one of the free dots.</p></article>`,
};
const ATTRS=[['Intuition',[['engineer','Engineer'],['interface','Interface'],['stalk','Stalk'],['survey','Survey']]],['Body',[['fight','Fight'],['finesse','Finesse'],['prowl','Prowl'],['wreck','Wreck']]],['Willpower',[['command','Command'],['consort','Consort'],['influence','Influence'],['study','Study']]]];
const TRAUMA=['Cold','Haunted','Obsessed','Paranoid','Reckless','Soft','Unstable','Vicious'];
function esc(s){return String(s??'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/"/g,'&quot;');}
function dots(n,max){let h='<span class="dots" aria-label="'+n+' / '+max+'">';for(let i=0;i<max;i++)h+='<i class="'+(i<n?'on':'')+'"></i>';return h+'</span>';}
function loc(R,lang){
  if(lang!=='en'||typeof EN==='undefined'||!EN[R.id])return R;const e=EN[R.id];const o=Object.assign({},R,e);
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
function st(id){return saved[id]||(saved[id]={edge:[],armor:{},harm:{},load:'normal'});}
let lang='de',gm=true;
(function(){try{const q=new URLSearchParams(location.search).get('lang');if(q==='en'||q==='de')lang=q;else{const v=localStorage.getItem('fp-lang');if(v==='en'||v==='de')lang=v;}const g=localStorage.getItem('fp-runner-gm');if(g!==null)gm=g==='1';}catch(e){}})();

function renderDossier(R0){
  const T=UI[lang],R=loc(R0,lang),a=R.actions||{},s=st(R.id),lb=R.loadBonus||0,loadBase={light:3,normal:5,heavy:6};
  const resist=k=>ATTRS.find(x=>x[0]===k)[1].filter(([id])=>(a[id]||0)>0).length;
  const attrsHtml=ATTRS.map(([k,acts])=>`<div class="attr"><h4>${k}<span>${T.attrDe[k]} · ${T.resist} ${resist(k)}d</span></h4>${acts.map(([id,en])=>`<div class="act"><div class="an">${en}<small>${T.glosses[id]}</small></div>${dots(a[id]||0,4)}</div>`).join('')}</div>`).join('')
    +(R.sup?`<div class="attr"><h4>${T.sup}<span>${esc(R.sup.attr)}</span></h4><div class="act sup"><div class="an">${esc(R.sup.name)}<small>${esc(R.sup.gloss)}</small></div>${dots(R.sup.dots,4)}</div></div>`:'');
  const edgeMax=R.edgeMax||9;
  const edgeBoxes=Array.from({length:edgeMax},(_,i)=>`<button type="button" class="box" id="${R.id}-edge-${i}" data-k="edge" data-i="${i}" aria-pressed="${s.edge[i]?'true':'false'}" aria-label="Edge ${i+1}"></button>`).join('');
  const armorDefs=[['armor','Armor'],['heavy','Heavy'],['special','Special']].concat(R.extraArmor?[['extra',T.armorTroll]]:[]);
  const armorHtml=armorDefs.map(([k,l])=>`<label><button type="button" class="box${k==='extra'?' extra':''}" id="${R.id}-armor-${k}" data-k="armor" data-i="${k}" aria-pressed="${s.armor[k]?'true':'false'}" aria-label="${l}"></button>${l}</label>`).join('');
  const harmRow=(lv,title,sub,n)=>`<div class="row"><div class="lv">${title}<small>${sub}</small></div><div class="cells${n===1?' one':''}">${Array.from({length:n},(_,i)=>`<input type="text" id="${R.id}-harm-${lv}${i}" data-k="harm" data-i="${lv}${i}" value="${esc((s.harm||{})[lv+i]||'')}" placeholder="…">`).join('')}</div></div>`;
  const loadHtml=['light','normal','heavy'].map(k=>`<label class="${s.load===k?'on':''}"><input type="radio" name="${R.id}-load" id="${R.id}-load-${k}" value="${k}" ${s.load===k?'checked':''}>${k[0].toUpperCase()+k.slice(1)} ${loadBase[k]+lb}</label>`).join('');
  const kv=(rows)=>`<dl class="kv">${rows.map(([k,v])=>`<dt>${k}</dt><dd>${v}</dd>`).join('')}</dl>`;
  return `<article class="dossier" id="${R.id}" style="--pb:var(--pb-${R.color})">
  <div class="dhead">
    <div class="name">${esc(R.street)}<small>${esc(R.pbDesc)}</small></div>
    <div class="badges"><span class="badge pb">${esc(R.pb)}</span><span class="badge">${esc(R.meta)}</span><span class="badge">${esc(R.idnShort)}</span></div>
    <div class="ident"><label for="${R.id}-name">${T.name}</label><input type="text" id="${R.id}-name" data-k="name" value="${esc(s.name||'')}" placeholder="${esc(T.namePh.replace('{s}',R.street))}"><label for="${R.id}-pron">${T.pron}</label><input type="text" id="${R.id}-pron" data-k="pron" value="${esc(s.pron||'')}" placeholder="${T.pronPh}"></div>
    <p class="role"><b>${T.role}</b> ${R.role}</p>
  </div>
  <div class="dbody">
    <div class="col">
      <section><h3>${T.profile}</h3>${kv([[T.look,esc(R.look)],[T.heritage,esc(R.heritage)],[T.background,esc(R.background)],[T.vice,esc(R.vice)],[T.idn,esc(R.idn)],[T.contacts,esc(R.friendsLabel)]])}</section>
      <section><h3>${T.metatype} ${esc(R.meta)}</h3><ul class="traits">${R.metaTraits.map(([n,t])=>`<li><b>${esc(n)}.</b> ${esc(t)}</li>`).join('')}</ul></section>
      ${R.cyber?`<section><h3>${T.implants}</h3><p class="traits" style="margin:0">${R.cyber}</p></section>`:''}
      <section><h3>${T.karma}</h3><ul class="traits">${R.karma.map(k=>`<li>${k}</li>`).join('')}<li class="small">${T.karmaAlways}</li></ul></section>
    </div>
    <div class="col">
      <section><h3>${T.actions}</h3><div class="attrs">${attrsHtml}</div></section>
      <div class="tracks">
        <div class="trk"><h4>Edge <span>${edgeMax} ${T.edgeSub}</span></h4><div class="boxes">${edgeBoxes}</div><div class="trauma">${TRAUMA.map(t=>`<span>${t}</span>`).join('')}</div></div>
        <div class="trk"><h4>${T.harm} <span>${T.harmSub}</span></h4><div class="harm">${harmRow('l',T.lvl+' 1',T.h1,2)}${harmRow('m',T.lvl+' 2',T.h2,2)}${harmRow('h',T.lvl+' 3',T.h3,1)}</div></div>
        <div class="trk"><h4>${T.armor}</h4><div class="armorrow">${armorHtml}</div></div>
        <div class="trk"><h4>${T.load} <span>${lb?'+'+lb+' '+T.loadBonus:T.loadDefault}</span></h4><div class="loadsel">${loadHtml}</div></div>
        <div class="trk"><h4>${T.nuyen} <span>${T.nuyenSub}</span></h4><p class="small" style="margin:6px 0 0">${T.nuyenText}</p></div>
        <button type="button" class="badge" data-reset="${R.id}" style="cursor:pointer;justify-self:start">${T.reset}</button>
      </div>
    </div>
    <div class="col">
      <section><h3>${T.abilities}</h3><ul class="abil">${R.abilities.map(ab=>`<li><b>${esc(ab.n)}<i>${esc(ab.tag)}</i></b>${ab.t}</li>`).join('')}</ul></section>
      ${R.spells?`<section><h3>${esc(R.spells.h)}</h3><ul class="abil">${R.spells.list.map(sp=>`<li><b>${esc(sp.n)}</b>${sp.t}</li>`).join('')}</ul></section>`:''}
      <section><h3>${T.gear}</h3><table class="items"><tbody>${R.items.map(it=>`<tr class="${it.rec?'rec':''}"><td class="ld">${it.l}</td><td><b>${esc(it.n)}</b> ${it.t}</td></tr>`).join('')}</tbody></table><p class="hint">${T.gearHint}</p></section>
    </div>
  </div>
  <div class="dfoot">
    <div><h3>${T.friend}</h3><p><b>${esc(R.friend.n)}.</b> ${R.friend.t}</p><h3 style="margin-top:12px">${T.rival}</h3><p><b>${esc(R.rival.n)}.</b> ${R.rival.t}</p></div>
    <div><h3>${T.why}</h3><p>${R.why}</p></div>
    <div><h3>${T.shine}</h3><ul>${R.shine.map(x=>`<li>${x}</li>`).join('')}</ul></div>
    <div class="lore"><h3>${T.lore} ${esc(R.lore.h)}</h3>${R.lore.t}</div>
    <div class="gmnote"><h3>${T.gm}</h3>${R.gm}</div>
  </div>
</article>`;
}

function renderAll(){
  const T=UI[lang];document.documentElement.lang=lang;
  document.getElementById('subtitle').textContent=T.subtitle;document.getElementById('lnkPlans').textContent=T.plans;
  document.getElementById('langDE').setAttribute('aria-pressed',lang==='de'?'true':'false');document.getElementById('langEN').setAttribute('aria-pressed',lang==='en'?'true':'false');
  document.getElementById('intro').innerHTML=INTRO[lang];
  const crews=(lang==='en'&&typeof CREWS_EN!=='undefined')?CREWS_EN:CREWS;
  document.getElementById('crewnav').innerHTML=RUNNERS.map(R0=>{const R=loc(R0,lang);return `<a href="#${R.id}" style="--pb:var(--pb-${R.color})"><div class="sn">${esc(R.street)}</div><div class="pb">${esc(R.pb)} · ${esc(R.meta)}</div><div class="rl">${esc(R.feel)}</div></a>`;}).join('');
  document.getElementById('crews').innerHTML=`<b>${T.crews}</b> ${T.crewsSub}<ul>${crews.map(c=>`<li><b>${esc(c.n)}:</b> ${esc(c.t)}</li>`).join('')}</ul>`;
  document.getElementById('dossiers').innerHTML=RUNNERS.map(renderDossier).join('');
  document.getElementById('fine').innerHTML=T.fine;
  document.body.classList.toggle('player',!gm);
  const bg=document.getElementById('btnGM');bg.setAttribute('aria-pressed',gm?'true':'false');bg.lastChild.textContent=gm?T.gmOn:T.gmOff;
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
  const btn=document.getElementById('btnGM');
  btn.addEventListener('click',()=>{gm=!gm;try{localStorage.setItem('fp-runner-gm',gm?'1':'0');}catch(e){}renderAll();});
  const setLang=l=>{lang=l;try{localStorage.setItem('fp-lang',l);}catch(e){}renderAll();};
  document.getElementById('langDE').addEventListener('click',()=>setLang('de'));
  document.getElementById('langEN').addEventListener('click',()=>setLang('en'));
  renderAll();
})();
