/* ---------- Cheat-Sheets: Renderer, Sprache, Spieler/SL-Filter ---------- */
let lang='de',aud='all',only='',kOver=0;
(function(){try{
  const p=new URLSearchParams(location.search),q=p.get('lang'),a=p.get('aud')||p.get('print');
  if(q==='en'||q==='de')lang=q;else{const v=localStorage.getItem('fp-lang');if(v==='en'||v==='de')lang=v;}
  // nur für tools/fit-sheets.js: ein einzelnes Sheet (?sheet=id) mit fester Druckskalierung (?k=1.3)
  only=p.get('sheet')||'';kOver=parseFloat(p.get('k'))||0;
  if(a==='player'||a==='gm'||a==='all')aud=a;else{const v=localStorage.getItem('fp-sheets-aud');if(v==='player'||v==='gm'||v==='all')aud=v;}
}catch(e){}})();
function save(){try{localStorage.setItem('fp-lang',lang);localStorage.setItem('fp-sheets-aud',aud);}catch(e){}}
const D=()=>lang==='en'?SHEETS_EN:SHEETS_DE;
const $=id=>document.getElementById(id);
// Druckschrift je Sheet hochskalieren, damit jede A4-Seite gut gefüllt ist (gemessen an der längeren deutschen Fassung)
const PRINT_K={grundregeln:1.08,actions:1.34,kampf:1.26,magie:1.32,heist:1.38,'sl-wuerfe':1.26,'sl-kampf':1.34,'sl-magie':1.36,'sl-alert':1.34};
const list=(tag,items)=>items&&items.length?`<${tag}>${items.map(i=>`<li>${i}</li>`).join('')}</${tag}>`:'';

function block(b){
  const [t,a,b2,c]=b;
  switch(t){
    case 'p':return `<p>${a}</p>`;
    case 'ul':return list('ul',a);
    case 'ol':return list('ol',a);
    case 'tbl':return `<table class="tb${c?' '+c:''}"><thead><tr>${a.map(h=>`<th>${h}</th>`).join('')}</tr></thead><tbody>${b2.map(r=>`<tr>${r.map(x=>`<td>${x}</td>`).join('')}</tr>`).join('')}</tbody></table>`;
    case 'dice':return `<div class="dice">${a.map(([d,col,txt])=>`<div><span class="d" style="--dc:${col}">${d}</span><span>${txt}</span></div>`).join('')}</div>`;
    case 'ladder':return `<div class="ladder">${a.map(([l,col,txt])=>`<div style="--lc:${col}"><b>${l}</b> <span>${txt}</span></div>`).join('')}</div>`;
    case 'note':return `<div class="note${a?' '+a:''}">${b2}</div>`;
    case 'chips':return `<div class="chips">${a.map(x=>`<span class="chip">${x}</span>`).join('')}</div>`;
  }
  return '';
}
function box(x){
  return `<section class="bx${x.cls?' '+x.cls:''}"><h4>${x.h}${x.sm?`<small>${x.sm}</small>`:''}</h4>${x.b.map(block).join('')}</section>`;
}
function sheet(s,i,n){
  const U=D().ui,gm=s.aud==='gm';
  return `<article class="sheet${gm?' gm':''}" id="${s.id}" style="--k:${kOver||PRINT_K[s.id]||1}"><header>
    <div class="aud">${gm?U.audGm:U.audPlayer}</div><div class="no">${String(i+1).padStart(2,'0')}</div>
    <h2>${s.title}</h2><p class="lead">${s.lead}</p></header>
    <div class="cols${s.c3?' c3':''}">${s.boxes.map(box).join('')}</div>
    <div class="foot">${U.foot} · ${s.title} · ${i+1}/${n}</div></article>`;
}
function render(){
  const d=D(),U=d.ui;
  document.documentElement.lang=lang;
  document.title=(lang==='en'?'Feuerprobe Cheat Sheets':'Feuerprobe Cheat-Sheets');
  $('eyebrow').textContent=U.eyebrow;$('title').textContent=U.title;$('subtitle').textContent=U.subtitle;
  $('audAll').textContent=U.all;$('audPlayer').textContent=U.player;$('audGm').textContent=U.gm;
  $('lnkHome').textContent=U.home;$('lnkHome').href='index.html?lang='+lang;
  $('lnkGuide').textContent=U.guide;$('lnkGuide').href='feuerprobe-leitfaden.html?lang='+lang;
  $('btnPrint').textContent=U.print;$('fine').innerHTML=U.fine;
  $('langDE').setAttribute('aria-pressed',lang==='de');$('langEN').setAttribute('aria-pressed',lang==='en');
  document.querySelectorAll('#audGroup button').forEach(b=>b.setAttribute('aria-pressed',b.dataset.aud===aud));
  const shown=d.sheets.filter(s=>only?s.id===only:(aud==='all'||s.aud===aud));
  $('sheets').innerHTML=shown.map((s,i)=>sheet(s,i,shown.length)).join('');
  $('index').innerHTML=shown.map(s=>`<a href="#${s.id}"${s.aud==='gm'?' class="gm"':''}><i>${s.aud==='gm'?U.gm:U.player}</i>${s.title}</a>`).join('');
}
$('langDE').addEventListener('click',()=>{lang='de';save();render();});
$('langEN').addEventListener('click',()=>{lang='en';save();render();});
document.querySelectorAll('#audGroup button').forEach(b=>b.addEventListener('click',()=>{aud=b.dataset.aud;save();render();}));
$('btnPrint').addEventListener('click',()=>window.print());
addEventListener('scroll',()=>$('toplink').classList.toggle('show',scrollY>600),{passive:true});
render();
