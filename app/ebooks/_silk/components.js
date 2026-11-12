'use strict';
/* ==========================================================================
   SILK components: every function returns an HTML string.
   Pair with _silk/silk.css. See _silk/build-main.cjs for a complete example.

   HOW TO USE
   ----------
   const S=require('./_silk/components.js');
   const book=S.Book({name:'The 3-Layer Ritual'});     // footer text + page counter
   const html=S.document({title:'...', pages:[ ...page strings... ]});
   // each page string = book.page(inner,{layer:1|2|3, bg:'soft'|'l1'|'l2'|'l3'|'cover', footer:true, deco:[...]})
   // Pages are numbered in call order (cover = 1). Footer default: "Korean Silk Method · <name>   <n>".
   // render({fit:true}) in chromium.cjs auto-scales each page's type (--fit, 0.7..1.3) so content fills the page without overflow.
   // opts: fit:false (cover/back cover) and max:1.5 (data-max cap) and group:'name' (pages sharing a group get the same smallest fit) are available.

   LAYERS            {1:{key,name,color,tint,dark,cls:'l1'}, 2:..., 3:...}; layer 3 is shown as "Rejuvenate".
   layerOf(x)        accepts 1|2|3, 'hidratar'|'nutrir'|'rejuvenescer'|'refresh'... -> LAYERS entry.
   label(s)          maps the word "Refresh" to "Rejuvenate" (use on any layer label coming from data).
   esc(s)            HTML-escape. All functions escape their text args; *Html args are trusted raw HTML.
   icon(name,color,size)   svg string. names: sun moon star starOutline jar heart warn check sparkle clock drop leaf
   sparkle(opts)     absolutely positioned 4-point star: {x,y,size,color,opacity}  (x,y are CSS values, e.g. '10%')
   circle(opts)      absolutely positioned pastel circle: {x,y,size,tone:'blush'|'mint'|'sand',opacity}
                     (use negative x/y to bleed off the edge). Pass these in page opts.deco (array of strings).
   pill(text,{layer,variant})   rounded label. variant: 'outline'|'solid'|'sm'
   header({eyebrow,title,subtitle,layer})   standard page header: eyebrow + big Fredoka title + subtitle + gold rule.
   card(innerHtml,{tint:1|2|3,cls,style})   white (or tinted) rounded card.
   checkbox(layer)   empty rounded check box.   numCircle(n,{layer,size:'sm'|'lg'})   numbered colored circle.
   checklistRows(items,{layer,cols:1|2})    ul of box + text. items: strings or {text,sub}.
   rows5() / scale5(layer)   five empty circles 1-5 ("how I felt").   notesBox({title,lines,tint})   lined notes card.
   statBlocks([[label,value],...])           row of white mini blocks (TIME / HOW OFTEN ...).
   warnLine(text,label='Heads up:')          triangle warning strip.
   tipCard({label,text,layer})               tinted tip card (italic bold text).

   PAGES (complete layouts)
   cover({kicker,lines:[{t,color,size}],subtitle,mock:{title,morning:[..],night:[..],checked:[..]},stats:[..],bottom})
   layerPage({layer,eyebrow,title,subtitle,goalHtml,needsTitle,needs:[..],listTitle,list:[{tag,title,sub,star,tagCls}],page})
        -> the "week page" (ref p.9): gradient in the layer color, giant title, "you will need" card, day-by-day list.
   dayFront({layer,pillLabel,dayLabel,num,title,subtitle,morning:{time,rows:[{text,sub,star}]},night:{...},prepare,tip,mornCount,nightCount})
        -> daily sheet front (ref p.10).
   dayBack({layer,pillLabel,tagRight,num,title,subtitle,recipe})   -> star-recipe page (ref p.11) = recipePage with a day header.
   recipeCard(recipe,{layer,eyebrowLabel,stats:[[label,value]...]})  -> the big tinted "star recipe" card.
        recipe = {nome, subtitulo?, porQue?, ingredientes[], passos[], comoUsar, atencao, tempoAcao, frequencia, melhorMomento, validade, essencial}
   recipePage({recipe,layer,pillLabel,tagRight,num,essential})       -> full recipe page (header + card + notes).
   steps(list,{layer}) ol with numbered circles; bullets(list,{layer}) ul with dots.
   dividerPage / backCover({title,subtitle,tagline,legal})

   Utility: chunk(arr,n), pad2(n), Book, document.
   ========================================================================== */
const esc=x=>String(x==null?'':x).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
const pad2=n=>String(n).padStart(2,'0');
const chunk=(a,n)=>{const o=[];for(let i=0;i<a.length;i+=n)o.push(a.slice(i,i+n));return o};
const label=s=>String(s==null?'':s).replace(/^Refresh$/,'Rejuvenate');

const LAYERS={
  1:{n:1,key:'hidratar',name:'Hydrate',color:'#6E9D93',tint:'#E4EDE8',dark:'#4D8177',cls:'l1'},
  2:{n:2,key:'nutrir',name:'Nourish',color:'#C9955F',tint:'#F7EADB',dark:'#9A6A35',cls:'l2'},
  3:{n:3,key:'rejuvenescer',name:'Rejuvenate',color:'#C8807C',tint:'#F8E1DF',dark:'#A9505A',cls:'l3'}
};
const layerOf=x=>{
  if(x&&x.cls)return x;
  if(LAYERS[x])return LAYERS[x];
  const s=String(x||'').toLowerCase();
  return Object.values(LAYERS).find(l=>l.key===s||l.name.toLowerCase()===s||(l.n===3&&s==='refresh'))||LAYERS[1];
};

/* ---------- icons ---------- */
const PATHS={
  sun:c=>`<circle cx="12" cy="12" r="4.2" fill="${c}"/><g stroke="${c}" stroke-width="2" stroke-linecap="round"><path d="M12 2.5v2.6M12 18.9v2.6M2.5 12h2.6M18.9 12h2.6M5.3 5.3l1.8 1.8M16.9 16.9l1.8 1.8M5.3 18.7l1.8-1.8M16.9 7.1l1.8-1.8"/></g>`,
  moon:c=>`<path d="M19.5 14.6A8 8 0 0 1 9.4 4.5a8 8 0 1 0 10.1 10.1z" fill="${c}"/>`,
  star:c=>`<path d="M12 2.6l2.8 6 6.6.7-4.9 4.5 1.4 6.5L12 16.9l-5.9 3.4 1.4-6.5L2.6 9.3l6.6-.7z" fill="${c}"/>`,
  starOutline:c=>`<path d="M12 3.4l2.5 5.6 6.1.6-4.6 4.1 1.3 6L12 16.5 6.7 19.7l1.3-6L3.4 9.6l6.1-.6z" fill="none" stroke="${c}" stroke-width="2" stroke-linejoin="round"/>`,
  jar:c=>`<rect x="5" y="3.5" width="14" height="4" rx="1.5" fill="${c}"/><rect x="4" y="8.2" width="16" height="12.3" rx="3.2" fill="${c}"/>`,
  heart:c=>`<path d="M12 20.6S3.2 15 3.2 8.9A4.6 4.6 0 0 1 12 7a4.6 4.6 0 0 1 8.8 1.9C20.8 15 12 20.6 12 20.6z" fill="${c}"/>`,
  warn:c=>`<path d="M12 3.2L22 20.6H2z" fill="${c}" stroke="${c}" stroke-width="1.6" stroke-linejoin="round"/><path d="M12 9.5v5" stroke="#fff" stroke-width="2.2" stroke-linecap="round"/><circle cx="12" cy="17.4" r="1.3" fill="#fff"/>`,
  check:c=>`<circle cx="12" cy="12" r="10" fill="${c}"/><path d="M7.3 12.3l3.3 3.3 6-6.6" fill="none" stroke="#fff" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/>`,
  sparkle:c=>`<path d="M12 1C12.8 7.5 16.5 11.2 23 12C16.5 12.8 12.8 16.5 12 23C11.2 16.5 7.5 12.8 1 12C7.5 11.2 11.2 7.5 12 1Z" fill="${c}"/>`,
  clock:c=>`<circle cx="12" cy="12" r="9" fill="none" stroke="${c}" stroke-width="2.2"/><path d="M12 6.8V12l3.4 2" fill="none" stroke="${c}" stroke-width="2.2" stroke-linecap="round"/>`,
  drop:c=>`<path d="M12 2.8C9 7.400 5.600 10.600 5.600 14.600a6.400 6.400 0 0 0 12.800 0C18.400 10.600 15 7.400 12 2.800z" fill="${c}"/>`,
  leaf:c=>`<path d="M20 4C9 4 4.500 9.500 4.500 15.300c0 1.600.4 3 1.200 4.200 1.200.9 2.600 1.300 4.200 1.300C15.700 20.800 20 15 20 4z" fill="${c}"/><path d="M5 20C8.500 14 12 11.500 15 10" stroke="#fff" stroke-width="1.500" fill="none" stroke-linecap="round"/>`
};
const icon=(name,color='#B27C3C',size='1em')=>`<svg viewBox="0 0 24 24" width="${size}" height="${size}" aria-hidden="true" style="display:block">${(PATHS[name]||PATHS.star)(color)}</svg>`;
const iconDisc=(name,layer,color)=>{const L=layerOf(layer);return `<span class="ico t${L.n}">${icon(name,color||L.dark)}</span>`};

const sparkle=({x='10%',y='10%',size=22,color='#C9955F',opacity=1}={})=>`<span class="spark" style="left:${x};top:${y};width:${size}px;height:${size}px;opacity:${opacity}">${icon('sparkle',color,'100%')}</span>`;
const circle=({x='0',y='0',size=200,tone='blush',opacity=1}={})=>`<span class="circle ${tone}" style="left:${x};top:${y};width:${size}px;height:${size}px;opacity:${opacity}"></span>`;

/* ---------- small pieces ---------- */
const pill=(text,{layer,variant='',cls=''}={})=>`<span class="pill ${layer?layerOf(layer).cls:''} ${variant==='solid'&&layer?'solid'+layerOf(layer).n:variant} ${cls}">${esc(text)}</span>`;
const checkbox=(layer)=>`<span class="box ${layer?layerOf(layer).cls:''}"></span>`;
const numCircle=(n,{layer,size=''}={})=>`<span class="num ${layer?layerOf(layer).cls:''} ${size}">${esc(n)}</span>`;
const header=({eyebrow,title,subtitle,layer,size='',rule=true})=>{const L=layer?layerOf(layer):null;
  return `${eyebrow?`<div class="eyebrow ${L?L.cls:''}">${esc(eyebrow)}</div>`:''}<h1 class="title ${size}">${esc(title)}</h1>${subtitle?`<p class="subtitle ${L?L.cls:''}">${esc(subtitle)}</p>`:''}${rule?`<div class="rule ${L?L.cls:''}"></div>`:''}`};
const card=(inner,{tint,cls='',style=''}={})=>`<div class="card ${tint?'t'+tint:''} ${cls}" style="${style}">${inner}</div>`;
const checklistRows=(items,{layer,cols=1}={})=>`<ul class="cl ${cols===2?'two':''}">${items.map(it=>{const o=typeof it==='string'?{text:it}:it;
  return `<li>${checkbox(layer)}<span>${esc(o.text)}${o.sub?`<small class="muted" style="display:block;font-weight:600;font-size:.82em">${esc(o.sub)}</small>`:''}</span></li>`}).join('')}</ul>`;
const scale5=(layer)=>`<div class="row" style="gap:.6em">${[1,2,3,4,5].map(n=>`<span class="cr" style="border-color:${layerOf(layer||3).color}"></span>`).join('')}</div>`;
const notesBox=({title='My notes',lines=4,tint,grow=false,layer=1}={})=>`<div class="card notes ${tint?'t'+tint:''} ${grow?'grow ruled':''}"><div class="eyebrow ${layerOf(layer).cls}">${esc(title)}</div>${grow?'<div class="lines">'+'<div class="ln"></div>'.repeat(9)+'</div>':'<div class="ln"></div>'.repeat(lines)}</div>`;
const statBlocks=pairs=>`<div class="stats" style="grid-template-columns:repeat(${pairs.length},1fr)">${pairs.map(([a,b])=>`<div class="stat"><div class="eyebrow l${'1'}">${esc(a)}</div><p>${esc(b)}</p></div>`).join('')}</div>`;
const warnLine=(text,lab='Heads up:')=>`<div class="warn">${icon('warn','#A9505A')}<div><b>${esc(lab)}</b> <span>${esc(text)}</span></div></div>`;
const tipCard=({label:lab='Tip',text,layer=1})=>{const L=layerOf(layer);return `<div class="card t${L.n}"><div class="eyebrow ${L.cls}">${esc(lab)}</div><p class="it" style="font-weight:700;margin-top:.5em">${esc(text)}</p></div>`};
const steps=(list,{layer}={})=>`<ol class="steps">${list.map((s,i)=>`<li>${numCircle(i+1,{layer,size:'sm'})}<span>${esc(s)}</span></li>`).join('')}</ol>`;
const bullets=(list,{layer}={})=>`<ul class="bul ${layer?layerOf(layer).cls:''}">${list.map(s=>`<li>${esc(s)}</li>`).join('')}</ul>`;

/* ---------- book shell ---------- */
const footer=(name,n)=>`<footer class="foot"><span>Korean Silk Method · ${esc(name)}</span><span><b>${n}</b></span></footer>`;
function Book({name}){
  let n=0;
  return {name,get count(){return n},
    page(inner,{layer,bg,footer:f=true,deco=[],cls='',center=false,fit=true,max,group}={}){
      n++;const L=layer?layerOf(layer):null;
      const bgc=bg||(L?'l'+L.n:'soft');
      return `<section class="page bg-${bgc} ${cls} ${fit?'':'nofit'}" ${max?`data-max="${max}"`:''} ${group?`data-group="${group}"`:''}><div class="deco">${deco.join('')}</div><div class="pg ${center?'center':''}">${inner}</div>${f?footer(name,n):''}</section>`;
    }};
}
const document_=({title,pages,css='_silk/silk.css'})=>`<!doctype html>\n<html lang="en"><head><meta charset="utf-8"><title>${esc(title)}</title><meta name="viewport" content="width=device-width,initial-scale=1"><link rel="stylesheet" href="${css}"></head><body>\n${pages.join('\n')}\n<script>${HEIGHT_JS}</script>\n</body></html>`;
/* Mobile reader hook: tells the app (parent window) how tall the content is, so the iframe can grow to fit. */
const HEIGHT_JS="(function(){if(window.parent===window)return;var l=0;function p(){var h=Math.ceil(document.body.getBoundingClientRect().height);if(h===l)return;l=h;try{parent.postMessage({type:'ebook-height',height:h},'*')}catch(e){}}addEventListener('load',p);addEventListener('resize',p);if(window.ResizeObserver){var r=new ResizeObserver(p);r.observe(document.documentElement);r.observe(document.body)}if(document.fonts&&document.fonts.ready)document.fonts.ready.then(p);p()})();";

/* ---------- cover ---------- */
const pencil=`<svg viewBox="0 0 260 60" width="260" height="60"><g transform="rotate(0)"><path d="M10 30l26-14 6 28z" fill="#F0D9C5"/><path d="M10 30l9-5 2 12z" fill="#4A3B38"/><rect x="36" y="14" width="176" height="30" rx="3" transform="skewX(0)" fill="#F2B83F"/><rect x="36" y="14" width="176" height="9" fill="#F7CE6B"/><rect x="36" y="38" width="176" height="6" fill="#DB9F26"/><rect x="212" y="14" width="14" height="30" fill="#D9D3CF"/><rect x="226" y="14" width="26" height="30" rx="9" fill="#E8878C"/></g></svg>`;
function cover({kicker,lines,subtitle,mock,stats=[],bottom}){
  const m=mock;
  const ticks=(arr,L)=>arr.map(t=>`<div class="item"><span class="tick ${m.checked.includes(t)?'on':'off'}" style="${m.checked.includes(t)?`background:${L}`:''}"></span><span>${esc(t)}</span></div>`).join('');
  return `<div style="text-align:center;margin-top:.1in">${pill(kicker,{variant:'outline'})}</div>
  <div class="cover-title" style="margin-top:.4in">${lines.map(l=>`<div style="font-size:${l.size}px;color:${l.color}">${esc(l.t)}</div>`).join('')}</div>
  <p style="text-align:center;font-size:1.45em;font-weight:700;color:#5d4e4a;line-height:1.35;margin-top:.34in;padding:0 .5in">${esc(subtitle)}</p>
  <div style="position:relative;flex:1">
    <div class="mock" style="left:3.95in;top:.55in;width:2.9in;height:3.1in;transform:rotate(6deg);background:#FBF5EC;box-shadow:0 14px 30px rgba(120,80,60,.12)"><div class="head" style="background:#F6E6D2;color:#9A6A35;font-size:1.25em">${esc(m.sideTitle)}</div>
      <div style="padding:1em 1.3em;display:grid;gap:.55em">${[['#6E9D93',5],['#C9955F',5],['#fff',5]].map(([c,k])=>`<div class="row" style="gap:.5em">${Array.from({length:k},(_,i)=>`<span style="width:1.4em;height:1.4em;border-radius:50%;background:${c==='#fff'?'#fff':c};border:2px solid ${c==='#fff'?'#C8807C':c}"></span>`).join('')}</div>`).join('')}</div></div>
    <div class="mock" style="left:.05in;top:.35in;width:4.3in;transform:rotate(-3.5deg);padding-bottom:1.1em"><span class="clip"></span><div class="head">${esc(m.title)}</div>
      <div style="padding:.3em 1.5em 0"><div class="sec">${esc(m.morningLabel)}</div>${ticks(m.morning,'#6E9D93')}<div class="sec">${esc(m.nightLabel)}</div>${ticks(m.night,'#C8807C')}</div></div>
    <div style="position:absolute;left:3.0in;top:3.3in;transform:rotate(-26deg);filter:drop-shadow(0 6px 6px rgba(120,80,60,.18))">${pencil}</div>
  </div>
  <div class="row" style="justify-content:center;gap:.5em;margin-bottom:.16in;margin-top:.1in">${stats.map(s=>pill(s,{variant:'sm',cls:'l2'})).join('')}</div>
  <div style="text-align:center;font-size:.62em;font-weight:800;letter-spacing:.24em;color:var(--muted);margin-bottom:.05in">${esc(bottom)}</div>`;
}
const coverDeco=[circle({x:'-.8in',y:'-.5in',size:230,tone:'blush'}),circle({x:'5.1in',y:'-1.2in',size:400,tone:'blush',opacity:.8}),circle({x:'-1.4in',y:'4.4in',size:320,tone:'mint',opacity:.9}),circle({x:'6.2in',y:'8.4in',size:330,tone:'sand'}),
  sparkle({x:'.9in',y:'3.55in',size:34,color:'#C9955F'}),sparkle({x:'7.0in',y:'3.25in',size:26,color:'#C9955F'}),sparkle({x:'.3in',y:'6.9in',size:22,color:'#C9955F'}),sparkle({x:'7.6in',y:'6.1in',size:30,color:'#C9955F'}),sparkle({x:'2.0in',y:'8.65in',size:20,color:'#C9955F'})];

/* ---------- layer / week page ---------- */
function layerPage({layer,eyebrow,title,subtitle,goalHtml='',needsTitle,needs=[],listTitle,list=[],extraHtml=''}){
  const L=layerOf(layer);
  return `<div class="eyebrow ${L.cls}" style="margin-top:.15in">${esc(eyebrow)}</div>
  <h1 class="title xl" style="margin-top:.1em">${esc(title)}</h1>
  <p class="subtitle ${L.cls}" style="font-size:1.3em">${esc(subtitle)}</p>
  <div class="rule ${L.cls}" style="width:40px"></div>
  ${goalHtml?`<div class="txt sm" style="max-width:5.6in;margin-bottom:.9em">${goalHtml}</div>`:''}
  ${needs.length?`<div class="card" style="border-radius:34px;padding:1.2em 1.5em"><div class="eyebrow ${L.cls}" style="margin-bottom:.6em">${esc(needsTitle)}</div>${checklistRows(needs,{layer:L,cols:2})}</div>`:''}
  ${extraHtml}
  ${list.length?`<div class="eyebrow ${L.cls}" style="margin:1.1em 0 .1em">${esc(listTitle)}</div><ul class="glance">${list.map(r=>`<li><span class="dp" style="background:${L.color}">${esc(r.tag)}</span><span class="nm">${esc(r.title)}${r.sub?`<small>${esc(r.sub)}</small>`:''}</span>${r.star?`<span class="st">${icon('star','#B27C3C','100%')}</span>`:''}</li>`).join('')}</ul>`:''}`;
}

/* ---------- recipe card & page ---------- */
function recipeCard(r,{layer=1,eyebrowLabel,stats,name,warnLabel='Heads up:'}={}){
  const L=layerOf(layer);
  const st=stats||[['Time',r.tempoAcao],['How often',r.frequencia],['Best moment',r.melhorMomento],['Shelf life',r.validade]];
  return `<div class="card rcard t${L.n}"><div class="row" style="gap:.5em"><span style="width:1.15em;height:1.15em">${icon('star','#B27C3C','100%')}</span><span class="eyebrow ${L.cls}">${esc(eyebrowLabel||'Star recipe')}</span></div>
    ${name?`<div class="title" style="font-size:2.1em;margin-top:.15em;line-height:1.05">${esc(name)}</div>`:''}${r.porQue?`<p style="margin-top:.55em;font-weight:700;font-size:.98em">${esc(r.porQue)}</p>`:''}
    ${statBlocks(st).replace(/eyebrow l1/g,'eyebrow '+L.cls)}
    <div class="twocol"><div><div class="eyebrow ${L.cls}">Ingredients</div>${bullets(r.ingredientes,{layer:L})}</div>
    <div><div class="eyebrow ${L.cls}">Method</div>${steps(r.passos,{layer:L})}</div></div>
    <p class="howto"><b>How to use:</b> ${esc(r.comoUsar)}</p>
    ${warnLine(r.atencao,warnLabel)}</div>`;
}
function recipePage({recipe:r,layer,pillLabel,tagRight,num,title,subtitle,eyebrowLabel,essential,cardName,warnLabel,stats,hideHead}){
  const L=layerOf(layer);
  return `<div class="pillrow">${pill(pillLabel,{layer:L})}<span class="tagright">${esc(tagRight)}</span></div>
  <div class="rhead"><span class="bignum ${L.cls}">${esc(num)}</span><div><h1 class="title">${esc(title||r.nome)}</h1></div></div>
  ${(subtitle||r.subtitulo)?`<p class="subtitle ${L.cls}" style="margin-top:.2em">${esc(subtitle||r.subtitulo)}</p>`:''}
  <div class="gap"></div>
  ${recipeCard(r,{layer:L,eyebrowLabel:eyebrowLabel||(essential?'Essential ritual':'Star recipe'),name:cardName,warnLabel,stats})}
  <div class="gap"></div>
  ${notesBox({title:'My notes on this recipe',grow:true,layer:L})}`;
}

/* ---------- daily sheets (calendar) ---------- */
function dayFront({layer,pillLabel,dayLabel,num,title,subtitle,morning,night,prepare,prepareItems,tip,tipLabel='Tip of the day',tipHtml,mornCount,nightCount,bottomHtml,morningLabel='Morning',nightLabel='Night'}){
  const L=layerOf(layer);
  const rows=(blk,ic,lab,color)=>`<div class="card" style="padding:1em 1.3em"><div class="row sb"><div class="row">${iconDisc(ic,L,color)}<span class="h3">${lab}</span></div><span class="tagright">${esc(blk.time||'')}</span></div>
    <ul class="cl" style="margin-top:.5em">${blk.rows.map(r=>`<li style="${r.star?`background:${L.tint};border-radius:14px;padding:.45em .6em;margin:.2em -.6em`:''}">${checkbox(L)}<span style="flex:1">${esc(r.text)}${r.sub?`<small class="muted" style="display:block;font-weight:600;font-size:.82em">${esc(r.sub)}</small>`:''}</span>${r.star?`<span style="width:1.2em">${icon('star','#B27C3C','100%')}</span>`:''}</li>`).join('')}</ul></div>`;
  return `<div class="pillrow">${pill(pillLabel,{layer:L})}<span class="tagright">${esc(dayLabel)}</span></div>
  <div class="row" style="align-items:flex-start;margin-top:.5em"><div style="flex:1;display:flex;gap:.5em;align-items:flex-end"><span class="bignum ${L.cls}" style="font-size:4.6em">${esc(num)}</span><div style="padding-bottom:.1em"><h1 class="title" style="font-size:2.3em;margin:0">${esc(title)}</h1><p class="subtitle ${L.cls}" style="margin-top:.15em">${esc(subtitle)}</p></div></div>
    <div class="row" style="gap:.5em;margin-top:.5em">${[[morningLabel.toUpperCase(),mornCount],[nightLabel.toUpperCase(),nightCount]].map(([l,c])=>`<div style="text-align:center"><div style="width:3.6em;height:3.6em;border-radius:.9em;border:1.6px solid ${L.color};display:flex;align-items:center;justify-content:center;font-family:Fredoka;font-weight:600;font-size:1.3em;color:${L.dark}">${c==null?'':c}</div><div class="tagright" style="font-size:.5em;margin-top:.3em">${l}</div></div>`).join('')}</div></div>
  <div class="gap"></div>${rows(morning,'sun',morningLabel,L.dark)}<div class="gap s"></div>${rows(night,'moon',nightLabel,L.dark)}
  ${prepare?`<div class="gap s"></div><div class="card t${L.n}" style="border-radius:20px;padding:.8em 1.2em"><div class="row">${iconDisc('jar',L)}<span><b class="${''}" style="font-weight:800">Prepare today:</b> ${esc(prepare)}</span></div></div>`:''}
  ${prepareItems&&prepareItems.length?`<div class="gap s"></div><div class="card t${L.n}" style="border-radius:20px;padding:.75em 1.2em"><div class="row" style="align-items:flex-start">${iconDisc('jar',L)}<div class="stack" style="flex:1;font-size:.86em;line-height:1.38;--g:.35em">${prepareItems.map(p=>`<div><b style="font-weight:800">${esc(p.lab)}:</b> ${esc(p.text)}</div>`).join('')}</div></div></div>`:''}
  <div class="grow"></div>
  ${bottomHtml||`<div class="grid2">${tipHtml||(tip?tipCard({label:tipLabel,text:tip,layer:L}):'')}<div class="card"><div class="eyebrow ${L.cls}">How I felt today</div><div style="margin:.6em 0">${scale5(L)}</div><div class="muted txt sm" style="border-bottom:1px solid var(--line);padding-bottom:.5em">Note:</div></div></div>`}`;
}
const dayBack=o=>recipePage({cardName:o.cardName,warnLabel:o.warnLabel,stats:o.stats,recipe:o.recipe,layer:o.layer,pillLabel:o.pillLabel,tagRight:o.tagRight,num:o.num,title:o.title||'Today’s star',subtitle:o.subtitle,eyebrowLabel:o.eyebrowLabel||'Star recipe'});

/* ---------- back cover ---------- */
function backCover({title,subtitle,tagline,legal}){
  return `<div style="flex:1;display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center">
    <div style="width:70px;height:70px;margin-bottom:.4in">${icon('sparkle','#C9955F','100%')}</div>
    <div class="eyebrow">${esc(tagline)}</div>
    <h1 class="title" style="font-size:4em;margin-top:.15em">${esc(title)}</h1>
    <p class="subtitle" style="font-size:1.5em">${esc(subtitle)}</p><div class="rule" style="margin:1em auto"></div>
    ${legal?`<p class="muted txt xs" style="max-width:4.6in;margin-top:.8in;line-height:1.5">${esc(legal)}</p>`:''}</div>`;
}
const backDeco=[circle({x:'-1.2in',y:'-1in',size:420,tone:'blush'}),circle({x:'5.4in',y:'6.3in',size:520,tone:'mint',opacity:.9}),circle({x:'6.4in',y:'0.4in',size:140,tone:'sand'}),circle({x:'.6in',y:'8.2in',size:190,tone:'sand',opacity:.8}),sparkle({x:'1.6in',y:'3.2in',size:28}),sparkle({x:'6.6in',y:'2.4in',size:22}),sparkle({x:'5.8in',y:'7.9in',size:30,color:'#C8807C'})];


/* ---------- v2 additions (bonus e-books + calendar) ----------
   fieldLine(label)                      "label ______" write-in line
   fields([labels],{cols})               stacked write-in lines
   dashBox({title,hint,h,layer,lines})   dashed writing area
   scaleRows(labels,{layer,heads})       rows "label (1)(2)(3)(4)(5)" with numbered circles
   weekRows({layer,rows:[{tag,title,sub}],cols})   "week at a glance" rows with 2 check boxes (ref p.9)
   tableCard({head,rows,layer,cols})     white card table with colored pill header
   shopCard({title,layer,items:[{text,sub,code}],note,cols})   colored-pill title + check rows + week codes (ref p.5)
   dayChip({abbr,text,layer})            "Mon | text" tinted card (ref p.64)
   promoCard({title,text,layer,icon})    big tinted callout with icon
   recipeMini(r,{layer,name,num})        compact recipe card (several recipes per page)
   ----------------------------------------------------------------- */
const fieldLine=(label,{w}={})=>`<div class="fld"${w?` style="width:${w}"`:''}><span>${esc(label)}</span><i></i></div>`;
const fields=(labels,{cols=1}={})=>`<div class="${cols===2?'grid2':'stack'}" style="--g:.2em">${labels.map(l=>fieldLine(l)).join('')}</div>`;
const dashBox=({title,hint,h='1.5in',layer=1,lines=0}={})=>`<div class="dashbox" style="min-height:${h}"><div class="eyebrow ${layerOf(layer).cls}">${esc(title||'')}</div>${hint?`<div class="muted txt xs" style="margin-top:.25em">${esc(hint)}</div>`:''}${'<div class="ln2"></div>'.repeat(lines)}</div>`;
const cr5=(layer)=>`<span class="crs">${[1,2,3,4,5].map(n=>`<span class="cr n" style="border-color:${layerOf(layer).color}">${n}</span>`).join('')}</span>`;
const scaleRows=(labels,{layer=3,heads=[]}={})=>`<div class="scale">${heads.length?`<div class="srow shead"><span></span>${heads.map(h=>`<span class="eyebrow ${layerOf(layer).cls}" style="width:10.5em;text-align:center;margin-left:1.2em">${esc(h)}</span>`).join('')}</div>`:''}${labels.map(l=>`<div class="srow"><span class="nm" style="font-size:1.05em">${esc(l)}</span>${heads.length?heads.map(h=>`<span style="margin-left:1.2em" data-label="${esc(h)}">${cr5(layer)}</span>`).join(''):cr5(layer)}</div>`).join('')}</div>`;
const weekRows=({layer,rows,cols=['MORNING','NIGHT']})=>{const L0=layerOf(layer);return `<div class="wk"><div class="wkh"><span></span><span></span><span class="tagright">${esc(cols[0])}</span><span class="tagright">${esc(cols[1])}</span></div>${rows.map(r=>{const L=r.layer?layerOf(r.layer):L0;return `<div class="wkr"><span class="dp" style="background:${L.color}">${esc(r.tag)}</span><span class="nm">${esc(r.title)}${r.sub?`<small>${esc(r.sub)}</small>`:''}</span><span class="bx"><span class="box big ${L.cls}"></span></span><span class="bx"><span class="box big ${L.cls}"></span></span></div>`}).join('')}</div>`};
const tableCard=({head,rows,layer=3,cols,tint})=>{const L=layerOf(layer),g=cols||head.map(()=> '1fr').join(' ');
  return `<div class="card tbl ${tint?'t'+tint:''}" style="--cols:${g}"><div class="tr th">${head.map(h=>`<span class="pill ${L.cls}" style="letter-spacing:.14em">${esc(h)}</span>`).join('')}</div>${rows.map(r=>`<div class="tr">${r.map((c,i)=>`<span class="${i===0?'first':''}" data-label="${esc(head[i]||'')}">${esc(c)}</span>`).join('')}</div>`).join('')}</div>`};
const shopCard=({title,layer=1,items,note,cols=1})=>{const L=layerOf(layer);
  return `<div class="card shop"><div class="shophead ${L.cls}"><span class="h3">${esc(title)}</span></div><ul class="cl shoplist ${cols===2?'two':''}">${items.map(it=>{const o=typeof it==='string'?{text:it}:it;return `<li>${checkbox(L)}<span class="t">${esc(o.text)}${o.sub?`<small>${esc(o.sub)}</small>`:''}</span>${o.code?`<span class="code">${esc(o.code)}</span>`:''}</li>`}).join('')}</ul>${note?`<p class="muted txt xs" style="margin-top:.7em">${esc(note)}</p>`:''}</div>`};
const dayChip=({abbr,text,layer=1})=>{const L=layerOf(layer);return `<div class="card t${L.n}" style="border-radius:22px;padding:.8em 1em"><div class="row" style="align-items:flex-start;gap:.9em"><span class="h2" style="font-size:1.5em;color:${L.dark};min-width:1.9em">${esc(abbr)}</span><span class="txt sm" style="font-weight:700;line-height:1.32;padding-top:.15em">${esc(text)}</span></div></div>`};
const promoCard=({title,text,layer=2,icon:ic='heart',tint})=>{const L=layerOf(layer);return `<div class="card t${tint||L.n}" style="border-radius:32px;padding:1.3em 1.6em"><div class="row" style="gap:1em"><span style="width:2.4em;height:2.4em;flex:none">${icon(ic,L.dark,'100%')}</span><div><div class="h2" style="font-size:1.45em">${esc(title)}</div><p class="txt sm" style="margin-top:.3em;font-weight:700">${esc(text)}</p></div></div></div>`};
function recipeMini(r,{layer=1,name,num,wide=false}={}){
  const L=layerOf(layer);
  const st=[['Time',r.tempoAcao],['How often',r.frequencia],['Shelf life',r.validade]];
  return `<div class="card rcard rmini t${L.n}"><div class="row" style="gap:.5em;align-items:flex-start">${num!=null?`<span class="bignum ${L.cls}" style="font-size:2.2em;opacity:.45">${esc(num)}</span>`:''}<div style="flex:1"><div class="eyebrow ${L.cls}">Recipe of the day</div><div class="nm" style="font-size:1.35em;margin-top:.1em">${esc(name||r.nome)}</div></div><span style="width:1.1em;height:1.1em;flex:none">${icon('star','#B27C3C','100%')}</span></div>
    <div class="mstats">${st.map(([a,b])=>`<div><b>${esc(a)}</b><span>${esc(b)}</span></div>`).join('')}</div>
    ${wide?`<div class="twocol" style="font-size:.88em"><div><div class="eyebrow ${L.cls}">Ingredients</div>${bullets(r.ingredientes,{layer:L})}</div><div><div class="eyebrow ${L.cls}">Method</div>${steps(r.passos,{layer:L})}</div></div>`:`<div class="eyebrow ${L.cls}" style="margin-top:.8em;font-size:.58em">Ingredients</div><div style="font-size:.88em">${bullets(r.ingredientes,{layer:L})}</div>
    <div class="eyebrow ${L.cls}" style="margin-top:.8em;font-size:.58em">Method</div><div style="font-size:.88em">${steps(r.passos,{layer:L})}</div>`}
    <p class="howto" style="font-size:.82em;margin-top:.8em"><b>How to use:</b> ${esc(r.comoUsar)}</p>
    <div class="warn" style="font-size:.72em;padding:.55em .8em">${icon('warn','#A9505A')}<div><b>Heads up:</b> <span>${esc(r.atencao)}</span></div></div></div>`;
}

module.exports={HEIGHT_JS,fieldLine,fields,dashBox,cr5,scaleRows,weekRows,tableCard,shopCard,dayChip,promoCard,recipeMini,PATHS,esc,pad2,chunk,label,LAYERS,layerOf,icon,iconDisc,sparkle,circle,pill,checkbox,numCircle,header,card,checklistRows,scale5,rows5:scale5,notesBox,statBlocks,warnLine,tipCard,steps,bullets,footer,Book,document:document_,cover,coverDeco,layerPage,recipeCard,recipePage,dayFront,dayBack,backCover,backDeco};
