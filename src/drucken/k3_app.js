/* ---------- Druckseite: Mappen, Teile-Checkliste, Einzelbögen, Drucktipps ----------
   Seitenzahlen und Größen kommen aus docs/pdf/manifest.js (window.FP_PDFS), geschrieben von tools/make-pdf.js. */
const PUI={
 de:{title:'Drucken',sub:'Zwei fertige Mappen als je eine PDF: die SL-Mappe für die Spielleitung und das Spielerpaket für den Tisch. Darunter jedes Teil einzeln, zum Abhaken beim Drucken.',
  whole:'Gesamt-PDF öffnen',pages:'S.',missing:'noch nicht erzeugt: node tools/make-pdf.js',pdf:'PDF',web:'Webseite',land:'quer',port:'hoch',gm:'SL',reset:'Häkchen zurücksetzen',
  singlesH:'Einzelne Runnerbögen',tipsH:'Drucktipps',selfH:'Aus der Webseite selbst drucken',
  tips:['A4, Skalierung „Tatsächliche Größe“ bzw. 100 %, Kopf- und Fußzeilen des Browsers aus.','Die Gesamt-PDFs mischen Hoch- und Querformat (Pläne quer). Die meisten PDF-Betrachter drehen automatisch; sonst die Pläne einzeln drucken.','Runnerbögen und Cheat-Sheets einseitig drucken, damit sie am Tisch nebeneinander liegen können.','Die Spielerpläne zeigen keine SL-Notizen, versteckten Wege oder Sensoren und können offen auf dem Tisch liegen.','Die SL-Mappe enthält die Auflösung des Runs: nicht mit dem Spielerpaket verwechseln.'],
  self:[['Pläne: oben „Druckansicht“, dann SL- oder Spielerpläne.','meridian-spire-plaene.html'],['Runnerbögen: Runner wählen, Straßennamen vorausfüllen oder nicht, „Drucken“.','feuerprobe-runner-bogen.html'],['Cheat-Sheets: Alle, Spieler oder SL wählen, dann „Drucken“.','feuerprobe-regeln.html'],['SL-Leitfaden: „Drucken“ oben rechts; gedruckt wird der ganze Ablauf.','feuerprobe-leitfaden.html']],
  fine:'Die PDFs entstehen mit node tools/make-pdf.js aus denselben Seiten (Edge oder Chrome im Headless-Modus); die Gesamt-PDFs fügt pdf-lib zusammen.'},
 en:{title:'Print',sub:'Two ready-made binders as one PDF each: the GM binder for the game master and the player pack for the table. Below, every part on its own, to tick off while printing.',
  whole:'Open complete PDF',pages:'p.',missing:'not generated yet: node tools/make-pdf.js',pdf:'PDF',web:'Web page',land:'landscape',port:'portrait',gm:'GM',reset:'Reset ticks',
  singlesH:'Single runner sheets',tipsH:'Print tips',selfH:'Printing from the web pages',
  tips:['A4, scale “actual size” or 100 %, browser headers and footers off.','The complete PDFs mix portrait and landscape (plans are landscape). Most PDF viewers rotate automatically; otherwise print the plans separately.','Print runner sheets and cheat sheets single-sided so they can lie side by side at the table.','The player plans show no GM notes, hidden routes or sensors and can lie openly on the table.','The GM binder contains the reveal of the run: don’t mix it up with the player pack.'],
  self:[['Plans: “Print view” at the top, then GM or player plans.','meridian-spire-plaene.html'],['Runner sheets: pick a runner, prefill the street name or not, “Print”.','feuerprobe-runner-bogen.html'],['Cheat sheets: pick All, Players or GM, then “Print”.','feuerprobe-regeln.html'],['GM guide: “Print” at the top right; the whole outline is printed.','feuerprobe-leitfaden.html']],
  fine:'The PDFs are made with node tools/make-pdf.js from the same pages (Edge or Chrome in headless mode); pdf-lib joins the complete PDFs.'},
};
let lang='de';
try{const q=new URLSearchParams(location.search).get('lang');const v=localStorage.getItem('fp-lang');lang=(q==='en'||q==='de')?q:((v==='en'||v==='de')?v:'de');}catch(e){}
const PDFS=(typeof window.FP_PDFS==='object'&&window.FP_PDFS)||{};
let ticks={};try{ticks=JSON.parse(localStorage.getItem('fp-print-ticks')||'{}')||{};}catch(e){}
function saveTicks(){try{localStorage.setItem('fp-print-ticks',JSON.stringify(ticks));}catch(e){}}
function esc(s){return String(s??'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/"/g,'&quot;');}
function L(u){const h=u.indexOf('#');const hash=h>=0?u.slice(h):'';const b=h>=0?u.slice(0,h):u;return b+(b.includes('?')?'&':'?')+'lang='+lang+hash;}
function info(f){const m=PDFS[lang+'/'+f];if(!m)return '';const t=PUI[lang];return `${m.pages} ${t.pages} · ${m.kb>=1024?(m.kb/1024).toFixed(1).replace('.',lang==='de'?',':'.')+' MB':m.kb+' KB'}`;}
function render(){
  const t=PUI[lang];document.documentElement.lang=lang;
  document.querySelectorAll('[data-t]').forEach(el=>{el.textContent=t[el.dataset.t]||'';});
  document.getElementById('binders').innerHTML=Object.entries(MAPPEN).map(([key,M])=>{
    const f=M.file[lang];const have=!!PDFS[lang+'/'+f];
    const parts=M.parts.filter(p=>p.file[lang]);
    return `<section class="binder ${key}"><h2>${esc(M.t[lang])}${key==='gm'?`<span class="gmb">${t.gm}</span>`:''}</h2><p>${esc(M.d[lang])}</p>
      <a class="big${have?'':' missing'}" href="pdf/${lang}/${f}" target="_blank" rel="noopener"><span>${t.whole}</span><small>${have?info(f):t.missing}</small></a>
      <ol class="parts">${parts.map(p=>{const id=lang+':'+p.id;const on=!!ticks[id];return `<li${on?' class="done"':''}>
        <input type="checkbox" data-id="${id}"${on?' checked':''} aria-label="${esc(p.t[lang])}">
        <div><b>${esc(p.t[lang])}</b><span class="n">${esc(p.n[lang])}</span></div>
        <div class="meta"><span class="cp">${esc(p.copies[lang])}</span>${p.land?t.land:t.port}${info(p.file[lang])?' · '+info(p.file[lang]):''}</div>
        <div class="lk"><a href="pdf/${lang}/${p.file[lang]}" target="_blank" rel="noopener">${t.pdf}</a><a href="${esc(L(p.src))}">${t.web}</a></div></li>`;}).join('')}</ol>
      <button type="button" class="reset" data-reset="${key}">${t.reset}</button></section>`;}).join('');
  document.getElementById('singles').innerHTML=SINGLE_SHEETS.map(([id,de,en])=>{const f=(lang==='de'?'bogen-':'sheet-')+id+'.pdf';return `<a href="pdf/${lang}/${f}" target="_blank" rel="noopener">${esc(lang==='de'?de:en)}</a>`;}).join('');
  document.getElementById('tips').innerHTML=t.tips.map(x=>`<li>${esc(x)}</li>`).join('');
  document.getElementById('self').innerHTML=t.self.map(([x,u])=>`<li><a href="${esc(L(u))}">${esc(x.split(':')[0])}</a>:${esc(x.slice(x.indexOf(':')+1))}</li>`).join('');
  document.getElementById('langDE').setAttribute('aria-pressed',lang==='de');document.getElementById('langEN').setAttribute('aria-pressed',lang==='en');
}
document.getElementById('binders').addEventListener('change',e=>{const c=e.target.closest('input[data-id]');if(!c)return;if(c.checked)ticks[c.dataset.id]=1;else delete ticks[c.dataset.id];saveTicks();c.closest('li').classList.toggle('done',c.checked);});
document.getElementById('binders').addEventListener('click',e=>{const b=e.target.closest('[data-reset]');if(!b)return;MAPPEN[b.dataset.reset].parts.forEach(p=>{delete ticks[lang+':'+p.id];});saveTicks();render();});
document.getElementById('langDE').addEventListener('click',()=>{lang='de';try{localStorage.setItem('fp-lang','de');}catch(e){}render();});
document.getElementById('langEN').addEventListener('click',()=>{lang='en';try{localStorage.setItem('fp-lang','en');}catch(e){}render();});
render();
