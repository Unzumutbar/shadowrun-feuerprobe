/* ---------- Gemeinsame Navigationsleiste mit Suche (von build.js in jede Seite in docs/ eingesetzt) ----------
   Sprache: ?lang=, sonst localStorage 'fp-lang', sonst <html lang>; folgt danach jeder Änderung von <html lang>.
   Suche: lädt search-index.js (von build.js erzeugt) beim ersten Fokus aufs Suchfeld; Strg+K oder / fokussiert. */
(function(){
  const nav=document.getElementById('fpnav');if(!nav)return;
  const page=nav.dataset.page||'';
  const L={
    de:{home:'Start',run:'Der Run',guide:'SL-Leitfaden',plans:'Pläne',runner:'Runner',dossiers:'Dossiers',sheets:'Bögen',rules:'Cheat-Sheets',print:'Drucken',
      search:'Suchen …  (Strg+K)',menu:'Menü',none:'Nichts gefunden.',loading:'Suche wird geladen …',gm:'SL',failed:'Suchindex nicht gefunden (search-index.js).',
      k:{plan:'Orte auf den Plänen',route:'Wege',chapter:'SL-Leitfaden',npc:'Personen',runner:'Runner',rule:'Cheat-Sheets',run:'Der Run (Text)',page:'Seiten'}},
    en:{home:'Home',run:'The run',guide:'GM guide',plans:'Plans',runner:'Runners',dossiers:'Dossiers',sheets:'Sheets',rules:'Cheat sheets',print:'Print',
      search:'Search …  (Ctrl+K)',menu:'Menu',none:'No results.',loading:'Loading search …',gm:'GM',failed:'Search index not found (search-index.js).',
      k:{plan:'Places on the plans',route:'Routes',chapter:'GM guide',npc:'People',runner:'Runners',rule:'Cheat sheets',run:'The run (text)',page:'Pages'}},
  };
  let lang='de';
  try{const q=new URLSearchParams(location.search).get('lang');const v=localStorage.getItem('fp-lang');const h=document.documentElement.lang;
    lang=(q==='en'||q==='de')?q:((v==='en'||v==='de')?v:(h==='en'?'en':'de'));}catch(e){}
  const esc=s=>String(s??'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/"/g,'&quot;');
  function withLang(u){
    if(!u||/^(https?:|mailto:)/.test(u)||/\.pdf(#|$)/.test(u))return u;
    const h=u.indexOf('#');const hash=h>=0?u.slice(h):'';let base=h>=0?u.slice(0,h):u;
    if(!base)return u;
    base=base.replace(/([?&])lang=[a-z]+&?/,'$1').replace(/[?&]$/,'');
    return base+(base.includes('?')?'&':'?')+'lang='+lang+hash;
  }
  const a=(id,href,label,gm)=>`<a class="fn-a" data-href="${href}" href="${href}"${page===id?' aria-current="page"':''}>${label}${gm?` <span class="fn-gm">${L[lang].gm}</span>`:''}</a>`;
  function render(){
    const t=L[lang];
    const q=nav.querySelector('.fn-search input');const keep=q?q.value:'';
    nav.innerHTML=`<div class="fn-in">
      <a class="fn-brand" data-href="index.html" href="index.html"><i></i>Feuerprobe</a>
      <button type="button" class="fn-menu" aria-expanded="false">☰ ${t.menu}</button>
      <div class="fn-links">
        ${a('run','feuerprobe-oneshot.html',t.run,true)}
        ${a('guide','feuerprobe-leitfaden.html',t.guide,true)}
        <span class="fn-grp"><span>${t.plans}</span>${a('plans','meridian-spire-plaene.html','2D')}${a('plans3d','meridian-spire-3d.html','3D')}</span>
        <span class="fn-grp"><span>${t.runner}</span>${a('runner','feuerprobe-runner.html',t.dossiers)}${a('sheets','feuerprobe-runner-bogen.html',t.sheets)}</span>
        ${a('rules','feuerprobe-regeln.html',t.rules)}
        ${a('print','drucken.html','🖨 '+t.print)}
      </div>
      <div class="fn-search" role="search"><svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="11" cy="11" r="7"/><path d="M20 20l-4-4"/></svg>
        <input type="search" placeholder="${esc(t.search)}" aria-label="${esc(t.search)}" autocomplete="off" spellcheck="false">
        <div class="fn-res" hidden role="listbox"></div></div>
    </div>`;
    nav.querySelectorAll('[data-href]').forEach(el=>{el.href=withLang(el.dataset.href);});
    const inp=nav.querySelector('.fn-search input');inp.value=keep;
    nav.querySelector('.fn-menu').addEventListener('click',e=>{const o=nav.classList.toggle('open');e.currentTarget.setAttribute('aria-expanded',o);});
    bindSearch(inp,nav.querySelector('.fn-res'));
  }

  /* ---------- Suche ---------- */
  const norm=s=>String(s||'').toLowerCase().replace(/ß/g,'ss').normalize('NFD').replace(/[̀-ͯ]/g,'');
  let idx=null,loading=false,failed=false;
  function load(cb){
    if(idx||failed){cb();return;}
    if(window.FP_INDEX){prep();cb();return;}
    if(loading)return;loading=true;
    const s=document.createElement('script');s.src='search-index.js';
    s.onload=()=>{prep();cb();};s.onerror=()=>{failed=true;cb();};document.head.appendChild(s);
  }
  function prep(){idx=(window.FP_INDEX||[]).map(e=>Object.assign({},e,{nt:norm(e.t),ns:norm(e.s),nx:norm(e.x||'')}));}
  function score(e,toks){
    let sc=0;
    for(const tk of toks){
      const wb=new RegExp('(^|[^a-z0-9])'+tk.replace(/[.*+?^${}()|[\]\\]/g,'\\$&'));
      if(e.nt===tk)sc+=30;
      else if(wb.test(e.nt))sc+=12;else if(e.nt.includes(tk))sc+=7;
      else if(wb.test(e.ns))sc+=4;else if(e.ns.includes(tk))sc+=2;
      else if(wb.test(e.nx))sc+=2;else if(tk.length>3&&e.nx.includes(tk))sc+=1;
      else return 0;
    }
    return sc+(e.w||0);
  }
  function hl(s,toks){
    let out=esc(s);
    toks.forEach(tk=>{if(tk.length<2)return;const n=norm(out);const i=n.indexOf(tk);if(i>=0&&n.length===out.length)out=out.slice(0,i)+'<mark>'+out.slice(i,i+tk.length)+'</mark>'+out.slice(i+tk.length);});
    return out;
  }
  function bindSearch(inp,res){
    let sel=-1;
    const run=()=>{
      const t=L[lang];const q=norm(inp.value).trim();
      if(!q){res.hidden=true;res.innerHTML='';return;}
      if(failed){res.hidden=false;res.innerHTML=`<p>${t.failed}</p>`;return;}
      if(!idx){res.hidden=false;res.innerHTML=`<p>${t.loading}</p>`;load(run);return;}
      const toks=q.split(/\s+/).filter(Boolean);
      const hits=idx.filter(e=>e.l===lang||e.l==='*').map(e=>[score(e,toks),e]).filter(x=>x[0]>0).sort((x,y)=>y[0]-x[0]).slice(0,40);
      if(!hits.length){res.hidden=false;res.innerHTML=`<p>${t.none}</p>`;return;}
      const order=[];const groups={};
      hits.forEach(([,e])=>{if(!groups[e.k]){groups[e.k]=[];order.push(e.k);}groups[e.k].push(e);});
      res.innerHTML=order.map(k=>`<h4>${t.k[k]||k}</h4>`+groups[k].map(e=>`<a href="${esc(withLang(e.u))}" role="option"><b><span>${hl(e.t,toks)}</span>${e.gm?` <span class="fn-gm">${t.gm}</span>`:''}</b>${e.s?`<small>${hl(e.s,toks)}</small>`:''}</a>`).join('')).join('');
      res.hidden=false;sel=-1;
    };
    inp.addEventListener('focus',()=>load(()=>{if(inp.value)run();}));
    inp.addEventListener('input',run);
    inp.addEventListener('keydown',e=>{
      const items=[...res.querySelectorAll('a')];
      if(e.key==='ArrowDown'||e.key==='ArrowUp'){if(!items.length)return;e.preventDefault();sel=(sel+(e.key==='ArrowDown'?1:-1)+items.length)%items.length;
        items.forEach((x,i)=>x.classList.toggle('sel',i===sel));items[sel].scrollIntoView({block:'nearest'});}
      else if(e.key==='Enter'){const it=items[sel>=0?sel:0];if(it){e.preventDefault();go(it.href);}}
      else if(e.key==='Escape'){inp.value='';res.hidden=true;inp.blur();}
    });
    res.addEventListener('click',e=>{const it=e.target.closest('a');if(it){e.preventDefault();go(it.href);}});
    document.addEventListener('click',e=>{if(!nav.contains(e.target))res.hidden=true;});
  }
  // Treffer auf derselben Seite: Hash/Query wechseln und neu laden, damit die Seiten-App den Deep Link auswertet.
  function go(href){
    const u=new URL(href,location.href);
    if(u.pathname===location.pathname&&u.search===location.search&&u.hash){location.hash=u.hash;
      const el=document.getElementById(decodeURIComponent(u.hash.slice(1)));if(el)el.scrollIntoView({behavior:'smooth',block:'start'});
      nav.querySelector('.fn-res').hidden=true;return;}
    location.href=href;
  }
  document.addEventListener('keydown',e=>{
    const tag=(e.target.tagName||'').toLowerCase();const typing=tag==='input'||tag==='textarea'||tag==='select'||e.target.isContentEditable;
    if(((e.ctrlKey||e.metaKey)&&e.key.toLowerCase()==='k')||(!typing&&e.key==='/')){e.preventDefault();const i=nav.querySelector('.fn-search input');i.focus();i.select();}
  });
  render();
  // Sprachwechsel der Seite übernehmen
  new MutationObserver(()=>{const h=document.documentElement.lang==='en'?'en':'de';if(h!==lang){lang=h;render();}})
    .observe(document.documentElement,{attributes:true,attributeFilter:['lang']});
})();
