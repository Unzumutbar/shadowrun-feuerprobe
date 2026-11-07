/* ---------- Startseite: Inhalte nach Zweck, „Wo finde ich was?“ ---------- */
const START={
 de:{sub:'Oneshot für Runners in the Shadows im Meridian Spire. Eine Crew soll während einer Gala einen Aktenkoffer aus dem Tresorgeschoss stehlen und ahnt nicht, wem Turm und Koffer gehören.',
  tip:'Tipp: <kbd>Strg</kbd> + <kbd>K</kbd> oder <kbd>/</kbd> durchsucht alles: Orte auf den Plänen, Personen, Runner, Regeln und Kapitel.',
  gm:'SL',faqH:'Wo finde ich was?',faqD:'Typische Fragen am Spieltisch und wo die Antwort steht.',
  groups:[
   {h:'Vorbereiten',gm:true,d:'Für die Spielleitung, vor dem Abend. Enthält die Auflösung.',cards:[
    {t:'SL-Leitfaden',gm:true,d:'Der Run Schritt für Schritt: Einstieg, Johnson, Recherche, Party, Tresorgeschoss, Flucht, Enthüllung, Payoff. Mit NPCs und Porträts.',u:'feuerprobe-leitfaden.html',btns:[['Öffnen','feuerprobe-leitfaden.html',1],['Personen','feuerprobe-leitfaden.html#npc-johnson']]},
    {t:'Der Run',gm:true,d:'Der vollständige Oneshot-Text zum Durchlesen (nur auf Deutsch).',u:'feuerprobe-oneshot.html'},
    {t:'SL-Cheat-Sheets',gm:true,d:'Würfe leiten, Kampf & Gegner, Magie im Turm, Alert/Matrix/Payoff. Je eine A4-Seite.',u:'feuerprobe-regeln.html?aud=gm'}]},
   {h:'Am Tisch',d:'Was während des Spiels offen liegt.',cards:[
    {t:'Pläne des Meridian Spire',d:'Schnitt, Tiefgarage, Ebene 111 und 112, Dach, Tresorgeschoss 110. Als Grundriss mit Orten und Wegen oder in 3-D zum Drehen und Begehen. Beide mit SL- und Spieleransicht.',btns:[['2D-Pläne','meridian-spire-plaene.html',1],['3D-Ansicht','meridian-spire-3d.html'],['Ebene 110','meridian-spire-plaene.html?level=110']]},
    {t:'Runner-Dossiers',d:'Acht vorgefertigte Runner mit Werten, Fähigkeiten, Ausrüstung, Kontakten. Klickbare Tracker, SL-Notizen schaltbar.',u:'feuerprobe-runner.html'},
    {t:'Cheat-Sheets',d:'Grundregeln, Welche Action?, Kampf, Magie, Matrix/Technik/Alert für alle am Tisch.',u:'feuerprobe-regeln.html?aud=player'},
    {t:'Alert Clock & Payoff',gm:true,d:'Klickbare Alert Clock und Payoff-Rechner in der Seitenleiste des Leitfadens.',btns:[['Alert Clock','feuerprobe-leitfaden.html#alertPanel',1],['Payoff-Rechner','feuerprobe-leitfaden.html#calcPanel']]}]},
   {h:'Austeilen & Drucken',d:'Alles auf Papier: fertige Mappen oder einzeln.',cards:[
    {t:'Druckmappen',d:'SL-Mappe und Spielerpaket als je eine PDF, dazu alle Einzel-PDFs, Checkliste und Drucktipps.',u:'drucken.html',btns:[['Zur Druckseite','drucken.html',1]]},
    {t:'Runnerbögen',d:'Ein Runner pro A4 zum Austeilen, ohne SL-Notizen. Straßenname, Name und Pronomen tragen die Spielenden selbst ein.',u:'feuerprobe-runner-bogen.html'}]}],
  faq:[['Wie sieht Ebene 110 aus?','Pläne 2D','meridian-spire-plaene.html?level=110'],['Kann ich durch den Turm laufen?','3D-Ansicht','meridian-spire-3d.html?level=111'],
   ['Wie kommt man vom Dach nach unten?','Schnitt','meridian-spire-plaene.html?level=schnitt'],['Wer ist Dorian Kade?','Leitfaden','feuerprobe-leitfaden.html#npc-kade'],
   ['Wer ist Dr. Venn?','Leitfaden','feuerprobe-leitfaden.html#npc-venn'],['Was steht im Briefing?','Leitfaden','feuerprobe-leitfaden.html#johnson'],
   ['Welche Werte hat Ravn?','Dossier','feuerprobe-runner.html#ravn'],['Wie funktioniert ein Action Roll?','Cheat-Sheet','feuerprobe-regeln.html?aud=all#grundregeln'],
   ['Wie läuft Kampf?','Cheat-Sheet','feuerprobe-regeln.html?aud=all#kampf'],['Was passiert bei Alert 4?','Alert Clock','feuerprobe-leitfaden.html#alertPanel'],
   ['Wie viel zahlt Johnson?','Payoff','feuerprobe-leitfaden.html#payoff'],['Was drucke ich für die Runde?','Drucken','drucken.html']],
  fine:'Fan-Material für den privaten Spieltisch. Runners in the Shadows ist ein Spiel von Mark Cleveland Massengale; Shadowrun ist eine Marke von The Topps Company / Catalyst Game Labs.'},
 en:{sub:'One-shot for Runners in the Shadows in the Meridian Spire. During a gala a crew is hired to steal a briefcase from the vault level, unaware of who owns the tower and the case.',
  tip:'Tip: <kbd>Ctrl</kbd> + <kbd>K</kbd> or <kbd>/</kbd> searches everything: places on the plans, people, runners, rules and chapters.',
  gm:'GM',faqH:'Where do I find …?',faqD:'Typical questions at the table and where the answer is.',
  groups:[
   {h:'Prepare',gm:true,d:'For the GM, before the session. Contains the reveal.',cards:[
    {t:'GM guide',gm:true,d:'The run step by step: entry, Johnson, legwork, party, vault level, escape, reveal, payoff. With NPCs and portraits.',u:'feuerprobe-leitfaden.html',btns:[['Open','feuerprobe-leitfaden.html',1],['People','feuerprobe-leitfaden.html#npc-johnson']]},
    {t:'The run',gm:true,d:'The complete one-shot text to read through (German only).',u:'feuerprobe-oneshot.html'},
    {t:'GM cheat sheets',gm:true,d:'Running rolls, combat & opposition, magic in the tower, alert/Matrix/payoff. One A4 page each.',u:'feuerprobe-regeln.html?aud=gm'}]},
   {h:'At the table',d:'What stays open during play.',cards:[
    {t:'Plans of the Meridian Spire',d:'Section, parking garage, levels 111 and 112, roof, vault level 110. As floor plans with places and routes or in 3D to rotate and walk. Both with GM and player view.',btns:[['2D plans','meridian-spire-plaene.html',1],['3D view','meridian-spire-3d.html'],['Level 110','meridian-spire-plaene.html?level=110']]},
    {t:'Runner dossiers',d:'Eight pregenerated runners with stats, abilities, gear, contacts. Clickable trackers, GM notes switchable.',u:'feuerprobe-runner.html'},
    {t:'Cheat sheets',d:'Core rules, which action?, combat, magic, Matrix/tech/alert for everyone at the table.',u:'feuerprobe-regeln.html?aud=player'},
    {t:'Alert clock & payoff',gm:true,d:'Clickable alert clock and payoff calculator in the guide’s sidebar.',btns:[['Alert clock','feuerprobe-leitfaden.html#alertPanel',1],['Payoff calculator','feuerprobe-leitfaden.html#calcPanel']]}]},
   {h:'Hand out & print',d:'Everything on paper: ready-made binders or one by one.',cards:[
    {t:'Print binders',d:'GM binder and player pack as one PDF each, plus all single PDFs, a checklist and print tips.',u:'drucken.html',btns:[['Go to print page','drucken.html',1]]},
    {t:'Runner sheets',d:'One runner per A4 page to hand out, without GM notes. Players fill in street name, name and pronouns.',u:'feuerprobe-runner-bogen.html'}]}],
  faq:[['What does level 110 look like?','Plans 2D','meridian-spire-plaene.html?level=110'],['Can I walk through the tower?','3D view','meridian-spire-3d.html?level=111'],
   ['How do you get down from the roof?','Section','meridian-spire-plaene.html?level=schnitt'],['Who is Dorian Kade?','Guide','feuerprobe-leitfaden.html#npc-kade'],
   ['Who is Dr. Venn?','Guide','feuerprobe-leitfaden.html#npc-venn'],['What is in the briefing?','Guide','feuerprobe-leitfaden.html#johnson'],
   ['What are Ravn’s stats?','Dossier','feuerprobe-runner.html#ravn'],['How does an action roll work?','Cheat sheet','feuerprobe-regeln.html?aud=all#grundregeln'],
   ['How does combat work?','Cheat sheet','feuerprobe-regeln.html?aud=all#kampf'],['What happens at alert 4?','Alert clock','feuerprobe-leitfaden.html#alertPanel'],
   ['How much does Johnson pay?','Payoff','feuerprobe-leitfaden.html#payoff'],['What do I print for the group?','Print','drucken.html']],
  fine:'Fan material for the private gaming table. Runners in the Shadows is a game by Mark Cleveland Massengale; Shadowrun is a trademark of The Topps Company / Catalyst Game Labs.'},
};
let lang='de';
try{const q=new URLSearchParams(location.search).get('lang');const v=localStorage.getItem('fp-lang');lang=(q==='en'||q==='de')?q:((v==='en'||v==='de')?v:'de');}catch(e){}
function esc(s){return String(s??'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/"/g,'&quot;');}
// Sprache an interne Links anhängen (Hash bleibt hinten)
function L(u){if(/\.pdf(#|$)/.test(u))return u;const h=u.indexOf('#');const hash=h>=0?u.slice(h):'';const b=h>=0?u.slice(0,h):u;return b+(b.includes('?')?'&':'?')+'lang='+lang+hash;}
function render(){
  const t=START[lang];document.documentElement.lang=lang;
  document.querySelectorAll('[data-t]').forEach(el=>{el.textContent=t[el.dataset.t]||'';});
  document.querySelectorAll('[data-h]').forEach(el=>{el.innerHTML=t[el.dataset.h]||'';});
  const gmb=`<span class="gmb">${t.gm}</span>`;
  document.getElementById('groups').innerHTML=t.groups.map(g=>`<section class="grp"><h2>${esc(g.h)}${g.gm?gmb:''}</h2><p>${esc(g.d)}</p><div class="cards">${
    g.cards.map(c=>{const head=`<b>${esc(c.t)}${c.gm&&!g.gm?gmb:''}</b><span class="d">${esc(c.d)}</span>`;
      if(c.btns)return `<div class="card">${head}<div class="btns">${c.btns.map(([l,u,p])=>`<a href="${esc(L(u))}"${p?' class="pri"':''}>${esc(l)}</a>`).join('')}</div></div>`;
      return `<a class="card" href="${esc(L(c.u))}">${head}</a>`;}).join('')}</div></section>`).join('');
  document.getElementById('faq').innerHTML=t.faq.map(([q,l,u])=>`<div><span>${esc(q)}</span><a href="${esc(L(u))}">${esc(l)} →</a></div>`).join('');
  document.getElementById('langDE').setAttribute('aria-pressed',lang==='de');document.getElementById('langEN').setAttribute('aria-pressed',lang==='en');
}
document.getElementById('langDE').addEventListener('click',()=>{lang='de';try{localStorage.setItem('fp-lang','de');}catch(e){}render();});
document.getElementById('langEN').addEventListener('click',()=>{lang='en';try{localStorage.setItem('fp-lang','en');}catch(e){}render();});
render();
