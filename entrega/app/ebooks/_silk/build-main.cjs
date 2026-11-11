'use strict';
/* Builds the main e-book. Run from app/:  node ebooks/_silk/build-main.cjs
   Outputs ebooks/korean-silk-method-3-layer-ritual.{html,pdf} and covers/...png
   Use this file as the template for the bonus e-books and the calendar. */
const fs=require('fs'),path=require('path'),vm=require('vm');
const S=require('./components.js'),{render}=require('./chromium.cjs');
const root=path.resolve(__dirname,'..','..'),out=path.join(root,'ebooks'),slug='korean-silk-method-3-layer-ritual';

/* ---- data (read only) ---- */
const ctx={};vm.createContext(ctx);
for(const f of ['guia','receitas','rotinas'])vm.runInContext(fs.readFileSync(path.join(root,'data',f+'.js'),'utf8'),ctx,{filename:f+'.js'});
vm.runInContext('this.G=GUIA;this.R=RECEITAS',ctx);
const G=ctx.G,R=ctx.R;
if(R.length!==30)throw Error('expected 30 recipes');
const byN=n=>R.find(r=>r.n===n);
const lyr=r=>S.layerOf(r.camada);
const esc=S.esc,L1=S.LAYERS[1],L2=S.LAYERS[2],L3=S.LAYERS[3];
const book=S.Book({name:'The 3-Layer Ritual'});
const pages=[];
const add=(inner,o)=>pages.push(book.page(inner,o));
const rname=n=>byN(n).nome;

/* 1. cover */
const m=G.rotinasProntas;
add(S.cover({kicker:'30 Homemade Recipes · 3 Layers',
  lines:[{t:'Korean',color:'#A9505A',size:62},{t:'Silk',color:'#B27C3C',size:150},{t:'Method',color:'#4A3B38',size:112}],
  subtitle:'The 3-Layer Ritual: Hydrate, Nourish and Rejuvenate, one small step at a time',
  mock:{title:'My ritual for today',sideTitle:'Week by week',morningLabel:'MORNING',nightLabel:'EVENING',
    morning:[rname(1),rname(3),'Sunscreen'],night:[rname(11),rname(12),rname(9)],checked:[rname(1),rname(3),rname(11),rname(12)]},
  stats:['30 recipes','6 essential rituals','Morning & evening'],
  bottom:'KOREAN SILK METHOD  ·  HYDRATE  ·  NOURISH  ·  REJUVENATE'}),{bg:'cover',footer:false,fit:false,deco:S.coverDeco});

/* 2. welcome */
const bv=G.boasVindas;
add(`<div class="eyebrow">Welcome</div><h1 class="title">${esc(bv.titulo)}</h1><div class="rule"></div>
  <div class="body" style="font-size:1.04em">${bv.texto.map((t,i)=>`<p ${i===0?'class="lead" style="font-size:1.12em"':''}>${esc(t)}</p>`).join('')}</div>
  <div class="gap l"></div>
  <div class="card t3" style="border-radius:32px;padding:1.2em 1.6em"><div class="row" style="gap:1.1em"><span style="width:2.8em;height:2.8em;flex:none">${S.icon('sparkle','#A9505A','100%')}</span>
    <div><div class="h2" style="font-size:1.5em">The 6 Essential Rituals</div><div class="h3 plum" style="font-size:1.05em;margin-top:.2em">${esc(G.essenciais.map(rname).join(' · '))}</div></div></div></div>
  <div class="gap"></div>
  <div class="grid3">${[L1,L2,L3].map(L=>`<div class="card t${L.n}" style="border-radius:26px;padding:1em 1.1em"><div class="eyebrow ${L.cls}" style="font-size:.58em">Layer ${L.n}</div><div class="h2" style="font-size:1.45em;margin-top:.15em">${L.name}</div><div class="txt xs muted" style="margin-top:.2em">Recipes ${R.filter(r=>S.layerOf(r.camada).n===L.n).map(r=>r.n).filter((n,i,a)=>i===0||i===a.length-1).join(' to ')}</div></div>`).join('')}</div>
  <div class="gap"></div>
  <div class="card t2" style="border-radius:32px"><div class="eyebrow">Where the inspiration comes from</div><p style="margin-top:.45em;font-weight:700;font-size:.95em">${esc(G.inspiracao)}</p></div>`,
  {deco:[S.circle({x:'5.4in',y:'-1.3in',size:380,tone:'blush'}),S.circle({x:'-1.3in',y:'8.6in',size:260,tone:'mint'}),S.sparkle({x:'7.3in',y:'.9in',size:24})]});

/* 3. golden rules */
const rtint=[1,2,3,3,1,2];
add(`<div class="eyebrow">Before you start</div><h1 class="title">The golden rules</h1><p class="subtitle">Six habits that keep every recipe gentle and safe.</p><div class="rule"></div>
  <div class="grid2" style="gap:.8em">${G.regrasDeOuro.map((r,i)=>`<div class="card t${rtint[i%6]}" style="border-radius:28px;padding:1.1em 1.3em"><div class="row" style="align-items:flex-start;gap:.7em">${S.numCircle(r.n,{layer:rtint[i%6]})}<div class="h3" style="padding-top:.15em">${esc(r.titulo)}</div></div><p style="margin-top:.6em;font-size:.84em;line-height:1.42;font-weight:600">${esc(r.texto)}</p></div>`).join('')}</div>`,
  {deco:[S.circle({x:'6.2in',y:'-.9in',size:260,tone:'sand',opacity:.7})]});

/* 4. how to use: method */
const me=G.metodo;
const seq=me.sequencia.map(S.label);
add(`<div class="eyebrow">How to use this book</div><h1 class="title">${esc(me.titulo)}</h1><p class="subtitle">${esc(me.subtitulo)}</p><div class="rule"></div>
  <div class="stack">${me.camadas.map(c=>{const L=S.LAYERS[c.n];return `<div class="card" style="border-radius:30px;padding:1.1em 1.4em"><div class="row" style="align-items:flex-start;gap:1em">${S.numCircle(c.n,{layer:L,size:'lg'})}<div style="flex:1">
    <div class="h2" style="font-size:1.55em">${esc(S.label(c.nome))}</div><div class="subtitle ${L.cls}" style="margin:.1em 0 .4em;font-size:1em">${esc(c.foco)}</div>
    <p class="txt sm">${esc(c.texto)}</p><div class="gap s"></div><div class="pill ${L.cls} sm" style="letter-spacing:.08em;white-space:normal">${esc(c.tipos)}</div></div></div></div>`}).join('')}</div>
  <div class="gap"></div>
  <div class="eyebrow" style="margin-bottom:.6em">Your order, every time</div>
  <div class="seq">${seq.map((s,i)=>`${i?'<span class="arrow">→</span>':''}${S.pill(s,{layer:({Hydrate:1,Nourish:2,Rejuvenate:3})[s],variant:({Hydrate:1,Nourish:1,Rejuvenate:1})[s]?'':'outline'})}`).join('')}</div>`,
  {deco:[S.circle({x:'-1.2in',y:'-1in',size:230,tone:'mint',opacity:.8})]});

/* 5. before you start: kit + legend + essentials */
const kit=G.kitBasico.replace(/\.$/,'').split(' · ').map(s=>s.charAt(0).toUpperCase()+s.slice(1));
const leg=[['sun','Time','How long the mix stays on, or how long it takes',1],['clock','How often','A gentle starting point, never a goal',2],['jar','Shelf life','Most mixes are made fresh and used once',1],['moon','Best moment','Morning, evening or both',2],['warn','Heads up','Cautions to read before you try it',3],['star','Essential','The six rituals to begin with',3]];
add(`<div class="eyebrow">Before you start</div><h1 class="title">Your basic kit</h1><p class="subtitle">Simple tools you probably already have.</p><div class="rule"></div>
  <div class="card" style="border-radius:30px"><div class="eyebrow l1" style="margin-bottom:.5em">What you will use</div>${S.checklistRows(kit,{layer:1,cols:2})}</div>
  <div class="gap l"></div>
  <div class="eyebrow">How to read each recipe page</div><div class="gap s"></div>
  <div class="card" style="border-radius:30px"><ul class="legend" style="display:grid;grid-template-columns:1fr 1fr;gap:.8em 1.4em">${leg.map(([ic,a,b,t])=>`<li style="margin:0">${S.iconDisc(ic,t)}<div><b>${a}</b><span class="d">${b}</span></div></li>`).join('')}</ul></div>
  <div class="gap l"></div>
  <div class="eyebrow">The 6 essential rituals</div><div class="gap s"></div>
  <div class="grid3">${G.essenciais.map(n=>{const r=byN(n),L=lyr(r);return `<div class="card tight" style="border-radius:22px"><div style="width:1.1em;height:1.1em">${S.icon('star',L.color,'100%')}</div><div class="nm" style="margin-top:.3em">${esc(r.nome)}</div><div class="muted txt xs" style="margin-top:.25em">Recipe ${S.pad2(r.n)} · ${esc(S.label(L.name))}</div></div>`}).join('')}</div>`,
  {deco:[S.circle({x:'6.6in',y:'8.8in',size:240,tone:'blush',opacity:.7})]});

/* layers: divider + recipes */
for(const L of [L1,L2,L3]){
  const rs=R.filter(r=>S.layerOf(r.camada).n===L.n);
  const cdata=me.camadas[L.n-1];
  add(S.layerPage({layer:L,eyebrow:`Layer ${L.n} of 3 · Recipes ${rs[0].n} to ${rs[rs.length-1].n}`,title:L.name,subtitle:cdata.foco,
      goalHtml:`<p>${esc(cdata.texto)}</p><p class="muted txt xs" style="margin-top:.5em">${esc(cdata.tipos)}</p>`,
      needsTitle:'In this layer',needs:[],listTitle:'The layer at a glance',
      list:rs.map(r=>({tag:'No. '+S.pad2(r.n),title:r.nome,sub:r.subtitulo,star:r.essencial}))}),
    {layer:L,deco:[S.circle({x:'6.3in',y:'-1.4in',size:330,tone:L.n===1?'mint':L.n===2?'sand':'blush',opacity:.55}),S.sparkle({x:'6.4in',y:'1.4in',size:22,color:L.color})]});
  for(const r of rs){
    add(S.recipePage({recipe:r,layer:L,pillLabel:`Layer ${L.n} · ${L.name}`,tagRight:`Recipe ${S.pad2(r.n)} of 30`,num:S.pad2(r.n),essential:r.essencial}),{layer:L,bg:'soft',max:1.38,group:'recipes'});
  }
}

/* ingredient guide (5 per page) */
const ing=G.ingredientes;
S.chunk(ing,5).forEach((grp,pi,all)=>add(`<div class="eyebrow">Ingredient guide ${all.length>1?`· ${pi+1} of ${all.length}`:''}</div><h1 class="title">What's in your kitchen</h1><p class="subtitle">What each staple is for, and how to choose it.</p><div class="rule"></div>
  <div class="stack">${grp.map((g,i)=>{const t=(pi*5+i)%3+1;return `<div class="card" style="border-radius:26px;padding:1em 1.3em"><div class="row" style="align-items:flex-start;gap:.9em">${S.iconDisc(['leaf','drop','leaf','heart','jar'][i%5],t)}<div style="flex:1"><div class="nm">${esc(g.nome)}</div>
    <p class="subtitle l${t}" style="font-size:.92em;margin:.1em 0 .45em">${esc(g.paraQueServe)}</p><div class="eyebrow l${t}" style="font-size:.58em;margin-bottom:.15em">Good to know</div><p class="txt sm">${esc(g.cuidado)}</p></div></div></div>`}).join('')}</div>`,
  {deco:[S.circle({x:'6.4in',y:'-1in',size:260,tone:'sand',opacity:.7})]}));

/* ready-made routines */
const rp=G.rotinasProntas;
const routineCard=(ro,L,ic)=>`<div class="card t${L.n}" style="border-radius:30px;padding:1em 1.3em"><div class="row">${S.iconDisc(ic,L,'#fff').replace('class="ico','class="ico').replace('<span class="ico t'+L.n+'">','<span class="ico" style="background:'+L.color+'">')}<div><div class="nm" style="font-size:1.35em">${esc(ro.nome)}</div><div class="eyebrow ${L.cls}" style="font-size:.6em">${esc(ro.duracao)}</div></div></div>
  <ul class="stack" style="margin-top:.7em">${ro.passos.map((p,i)=>`<li style="background:rgba(255,255,255,.85);border-radius:18px;padding:.5em .9em;display:flex;gap:.8em;align-items:flex-start">${S.numCircle(i+1,{layer:L,size:'sm'})}<div style="flex:1"><div style="font-weight:800;line-height:1.25">${esc(p.titulo)}${p.receita?` <span class="pill sm ${L.cls}" style="margin-left:.4em;letter-spacing:.1em">Recipe ${S.pad2(p.receita)}</span>`:''}</div><div class="txt xs muted" style="line-height:1.35">${esc(p.detalhe)}</div></div></li>`).join('')}</ul></div>`;
add(`<div class="eyebrow">Ready-made rituals</div><h1 class="title">Morning &amp; evening</h1><p class="subtitle">Two simple routines to follow as they are.</p><div class="rule"></div>
  ${routineCard(rp.manha,L1,'sun')}<div class="gap s"></div>${routineCard(rp.noite,L2,'moon')}`,{deco:[S.circle({x:'6.5in',y:'-1.2in',size:260,tone:'mint',opacity:.7})]});
add(`<div class="eyebrow">Ready-made rituals</div><h1 class="title">On busy days</h1><div class="rule"></div>
  <div class="card t3" style="border-radius:32px;padding:1.4em 1.7em"><div class="row" style="align-items:flex-start;gap:1em"><span style="width:2.4em;height:2.4em;flex:none">${S.icon('heart','#C8807C','100%')}</span><p class="it" style="font-weight:700;font-size:1.12em;line-height:1.5">${esc(rp.dica)}</p></div></div>
  <div class="gap l"></div><div class="eyebrow">Alternatives you will meet in the evening ritual</div><div class="gap s"></div>
  <div class="grid2">${[...new Set(rp.noite.passos.flatMap(p=>p.alternativas||[]))].map(n=>{const r=byN(n),L=lyr(r);return `<div class="card tight" style="border-radius:22px"><div class="eyebrow ${L.cls}" style="font-size:.58em">Recipe ${S.pad2(n)} · ${esc(S.label(L.name))}</div><div class="nm" style="margin-top:.2em">${esc(r.nome)}</div><div class="muted txt xs">${esc(r.subtitulo)}</div></div>`}).join('')}</div>`,{deco:[]});

/* routines by goal (3 per page) */
const goals=G.rotinasObjetivo;
S.chunk(goals,3).forEach((grp,pi,all)=>add(`<div class="eyebrow">Routines by goal ${all.length>1?`· ${pi+1} of ${all.length}`:''}</div><h1 class="title">Pick what you need</h1><p class="subtitle">Optional starting points, not a checklist.</p><div class="rule"></div>
  <div class="stack">${grp.map((g,i)=>{const t=(pi*3+i)%3+1,L=S.LAYERS[t];return `<div class="card t${t}" style="border-radius:30px;padding:1em 1.3em"><div class="h2" style="font-size:1.4em">${esc(g.nome)}</div><p class="txt xs muted" style="margin:.2em 0 .6em">${esc(g.para)}</p>
    <div class="grid2" style="gap:.5em">${g.itens.map(it=>{const r=byN(it.receita);return `<div style="background:rgba(255,255,255,.85);border-radius:16px;padding:.55em .8em;display:flex;gap:.7em;align-items:center"><span class="box ${lyr(r).cls}"></span><div><div style="font-weight:800;line-height:1.2">${esc(r.nome)}</div><div class="txt xs muted" style="line-height:1.25">${esc(it.uso)}</div></div></div>`}).join('')}</div></div>`}).join('')}</div>`,
  {deco:[S.circle({x:'6.4in',y:'-1.2in',size:260,tone:'blush',opacity:.7})]}));

/* FAQ */
S.chunk(G.faq,6).forEach((grp,pi,all)=>add(`<div class="eyebrow">Good to know</div><h1 class="title">Questions &amp; answers</h1>${all.length>1?`<p class="subtitle">Part ${pi+1} of ${all.length}</p>`:''}<div class="rule"></div>
  <div class="stack">${grp.map((f,i)=>{const t=(pi*3+i)%3+1;return `<div class="card qa" style="border-radius:28px;padding:1.1em 1.4em"><div class="row" style="align-items:flex-start;gap:.8em">${S.numCircle('?',{layer:t,size:'sm'})}<div><div class="q">${esc(f.p)}</div><p class="a">${esc(f.r)}</p></div></div></div>`}).join('')}</div>`,
  {deco:[S.circle({x:'6.4in',y:'-1.2in',size:260,tone:'mint',opacity:.7})]}));

/* closing note */
add(`<div class="eyebrow">A gentle note</div><h1 class="title">${esc(G.mensagemFinal.titulo)}</h1><div class="rule"></div>
  <p style="font-size:1.15em;font-weight:700;max-width:5.8in">${esc(G.mensagemFinal.texto)}</p>
  <div class="gap l"></div>
  <div class="card t3" style="border-radius:32px;padding:1.3em 1.6em"><div class="row" style="gap:.7em;margin-bottom:.5em"><span style="width:1.3em;height:1.3em">${S.icon('warn','#A9505A','100%')}</span><span class="eyebrow plum">Important notice</span></div><p class="txt sm" style="font-weight:600;line-height:1.5">${esc(G.avisoImportante)}</p></div>`,
  {deco:[S.circle({x:'-1.4in',y:'7.8in',size:340,tone:'mint',opacity:.8}),S.sparkle({x:'7.4in',y:'.5in',size:28})]});

/* back cover */
add(S.backCover({title:'Korean Silk Method',subtitle:'The 3-Layer Ritual',tagline:'Hydrate · Nourish · Rejuvenate',legal:null}),{bg:'cover',footer:false,fit:false,deco:S.backDeco});

const html=S.document({title:'Korean Silk Method · The 3-Layer Ritual',pages});
const file=path.join(out,slug+'.html');
fs.writeFileSync(file,html);
(async()=>{
  const r=await render({html:file,pdf:path.join(out,slug+'.pdf'),fit:true,shot:{selector:'.page',index:0,out:path.join(out,'covers',slug+'.png'),width:1200}});
  console.log('pages',r.pages,'still overflowing:',r.overflow);
  // re-render PDF/cover from the fitted html already done inside render()
})().catch(e=>{console.error(e);process.exit(1)});
