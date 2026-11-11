'use strict';
/* Shopping lists. Run from app/:  node ebooks/_silk/build-lists.cjs */
const K=require('./kit.cjs'),S=K.S,esc=S.esc;
const {C}=K.load({C:['compras','COMPRAS']});
const L1=S.LAYERS[1],L2=S.LAYERS[2],L3=S.LAYERS[3];
const book=S.Book({name:'Shopping Lists'});
const pages=[];const add=(inner,o)=>pages.push(book.page(inner,o));
const circ=(x,y,size,tone,o=.7)=>S.circle({x,y,size,tone,opacity:o});
const hdr=(eyebrow,title,sub)=>`<div class="eyebrow">${esc(eyebrow)}</div><h1 class="title">${esc(title)}</h1>${sub?`<p class="subtitle">${esc(sub)}</p>`:''}<div class="rule"></div>`;
const seloTxt=s=>s?String(s).split(' / ').map(x=>x.charAt(0)+x.slice(1).toLowerCase()).join(' · '):'';

/* 1. cover */
add(S.cover({kicker:'Ritual shopping lists · 21 days',
  lines:[{t:'Korean Silk',color:'#A9505A',size:66},{t:'Shopping',color:'#B27C3C',size:104},{t:'Lists',color:'#4A3B38',size:140}],
  subtitle:C.subtitulo.charAt(0).toUpperCase()+C.subtitulo.slice(1),
  mock:{title:'My shopping list',sideTitle:'Week by week',morningLabel:'GROCERY STORE',nightLabel:'DRUGSTORE',
    morning:['White or jasmine rice','Pure honey','Rice flour'],night:['Aloe vera gel','Shea butter','Sweet almond oil'],checked:['White or jasmine rice','Pure honey','Aloe vera gel','Shea butter']},
  stats:['Starter Kit','3 weekly lists','Master list'],bottom:'KOREAN SILK METHOD  ·  WHAT TO BUY  ·  HOW MUCH  ·  WHERE TO FIND IT'}),{bg:'cover',footer:false,fit:false,deco:S.coverDeco});

/* 2. welcome */
const bv=C.boasVindas;
add(`<div class="eyebrow">Welcome</div><h1 class="title" style="font-size:2.7em">${esc(bv.titulo)}</h1><div class="rule"></div>
  <div class="body" style="font-size:1.04em"><p class="lead" style="font-size:1.1em">${esc(bv.texto)}</p></div>
  <div class="gap l"></div>
  <div class="card t3" style="border-radius:32px;padding:1.3em 1.7em"><div class="row" style="gap:1.1em"><span style="width:2.8em;height:2.8em;flex:none">${S.icon('sparkle','#A9505A','100%')}</span><div class="h2" style="font-size:1.55em">${esc(bv.destaque)}</div></div></div>
  <div class="gap l"></div>
  <div class="grid3">${[[L1,'Starter Kit','6 ingredients, 6 Essential Rituals'],[L2,'Weekly lists','Weeks 1, 2 and 3 of the 21-day plan'],[L3,'Master list','One main shopping trip']].map(([L,a,b])=>`<div class="card t${L.n}" style="border-radius:26px;padding:1em 1.1em"><div class="eyebrow ${L.cls}" style="font-size:.58em">Option ${L.n}</div><div class="h2" style="font-size:1.4em;margin-top:.15em">${a}</div><div class="txt xs muted" style="margin-top:.25em">${b}</div></div>`).join('')}</div>`,
  {deco:[circ('5.4in','-1.3in',380,'blush'),circ('-1.3in','8.6in',260,'mint')]});

/* 3. how to use */
const cu=C.comoUsar;
add(`${hdr('Before you shop',cu.titulo,cu.subtitulo)}
  <div class="stack">${cu.caminhos.map(c=>`<div class="card" style="border-radius:28px;padding:1em 1.4em"><div class="row" style="gap:1em">${S.numCircle(c.numero,{layer:c.numero,size:'lg'})}<div><div class="h3">${esc(c.titulo)}</div><p class="txt sm" style="margin-top:.15em">${esc(c.descricao)}</p></div></div></div>`).join('')}</div>
  <div class="gap l"></div>
  <div class="eyebrow">How to read the lists</div><div class="gap s"></div>
  <div class="card" style="border-radius:30px"><ul class="legend" style="display:grid;grid-template-columns:1fr 1fr;gap:.8em 1.4em">${cu.legenda.map((l,i)=>`<li style="margin:0">${S.iconDisc(['star','leaf','heart','clock','jar','check'][i],(i%3)+1)}<div><b>${esc(l.selo)}</b><span class="d">${esc(l.significado)}</span></div></li>`).join('')}</ul></div>
  <div class="gap"></div>
  <div class="card t2" style="border-radius:26px;padding:1em 1.4em"><p class="txt sm" style="font-weight:700;line-height:1.45">${esc(cu.marcar)}</p><p class="txt xs muted" style="margin-top:.5em;line-height:1.45">${esc(cu.medidas)}</p></div>`,
  {deco:[circ('6.3in','-1in',260,'sand',.7)]});

/* 4. starter kit */
const ki=C.kitInicial;
add(`${hdr('Option 1 · Starter Kit',ki.titulo,ki.subtitulo)}
  <p class="txt sm" style="font-weight:700;line-height:1.5;margin-bottom:.9em">${esc(ki.descricao)}</p>
  <div class="stack">${ki.itens.map((it,i)=>{const L=i<3?L1:L2;return `<div class="card" style="border-radius:24px;padding:.8em 1.2em"><div class="row" style="align-items:flex-start;gap:.9em">${S.checkbox(i<3?1:2).replace('box','box big')}<div style="flex:1"><div class="row sb" style="align-items:flex-start"><div class="nm" style="font-size:1.2em">${esc(it.item)}</div><span class="pill sm ${L.cls}" style="letter-spacing:.1em">${esc(it.lugar)}</span></div><p class="txt xs" style="margin-top:.2em;line-height:1.4"><b style="font-weight:800">Buy:</b> ${esc(it.compre)}</p><p class="txt xs muted" style="line-height:1.4"><b style="font-weight:800">Use:</b> ${esc(it.uso)}</p></div></div></div>`}).join('')}</div>`,
  {layer:1,max:1.4,deco:[circ('6.3in','-1.4in',330,'mint',.55)]});
add(`${hdr('Option 1 · Starter Kit','Tools & what you have',null)}
  <div class="grid2" style="align-items:start"><div class="card" style="border-radius:28px"><div class="eyebrow l1" style="margin-bottom:.5em">Minimum tools</div>${S.checklistRows(ki.utensiliosMinimos,{layer:1})}</div>
  <div class="card" style="border-radius:28px"><div class="eyebrow l2" style="margin-bottom:.5em">Probably at home</div>${S.checklistRows(ki.jaTemEmCasa.map(j=>({text:j.item,sub:j.nota})),{layer:2})}</div></div>
  <div class="gap l"></div>
  <div class="card t3" style="border-radius:30px;padding:1.2em 1.5em"><div class="row" style="gap:.6em;margin-bottom:.4em"><span style="width:1.4em;height:1.4em">${S.icon('warn','#A9505A','100%')}</span><span class="eyebrow plum">Patch test first</span></div><p class="txt sm" style="font-weight:700;line-height:1.5">${esc(ki.testeDeContato)}</p></div>
  <div class="gap"></div><p class="muted txt xs it">${esc(ki.observacoes)}</p>`,
  {deco:[circ('6.4in','-1.2in',260,'blush',.7)]});

/* 6-8. weekly lists */
C.semanas.forEach(w=>{
  const L=S.LAYERS[w.camada];
  const it=a=>a.map(i=>({text:i.item,sub:[seloTxt(i.selo),i.para,i.quando].filter(Boolean).join(' · '),code:i.quantidade}));
  add(`<div class="eyebrow ${L.cls}" style="margin-top:.1in">Option 2 · Week ${w.numero} of 3 · ${esc(w.dias)}</div>
    <h1 class="title xl" style="margin-top:.1em;font-size:4.6em">${esc(w.titulo)}</h1>
    <p class="subtitle ${L.cls}" style="font-size:1.2em">Shop by ${esc(w.compreAte)}</p><div class="rule ${L.cls}" style="width:40px"></div>
    <div class="dayg" style="align-items:start">${S.shopCard({title:'Grocery store',layer:L,items:it(w.mercadoEFeira)})}${S.shopCard({title:'Drugstore & natural stores',layer:L,items:it(w.farmaciaELojasNaturais)})}</div>
    <div class="grow"></div>
    <div class="card t${L.n}" style="border-radius:28px;padding:1em 1.4em"><div class="eyebrow ${L.cls}">Plan the week</div><p class="txt xs" style="margin-top:.4em;font-weight:700;line-height:1.5">${esc(w.planejeASemana)}</p>${w.utensiliosDaSemana?`<p class="txt xs" style="margin-top:.5em;line-height:1.5"><b style="font-weight:800">Tools:</b> ${esc(w.utensiliosDaSemana)}</p>`:''}</div>
    <p class="muted txt xs it" style="margin-top:.6em">${esc(w.observacoes)}</p>`,
    {layer:L,max:1.5,deco:[circ('6.3in','-1.4in',330,w.numero===1?'mint':w.numero===2?'sand':'blush',.55),S.sparkle({x:'7.45in',y:'.35in',size:20,color:L.color})]});
});

/* 9-10. master list */
const lm=C.listaMestra,mf=lm.mercadoEFeira,fl=lm.farmaciaELojasNaturais;
const mi=a=>a.map(i=>({text:i.item,sub:[seloTxt(i.selo),i.compre].filter(Boolean).join(' · '),code:i.vaiUsarEm21Dias}));
add(`${hdr('Option 3 · Master list',lm.titulo,lm.subtitulo)}
  <div class="eyebrow l1" style="margin-bottom:.5em">${esc(mf.titulo)}</div>
  <div class="dayg" style="align-items:start">${S.shopCard({title:mf.despensa.titulo,layer:1,items:mi(mf.despensa.itens)})}${S.shopCard({title:mf.frescos.titulo,layer:2,items:mi(mf.frescos.itens)})}</div>
  <div class="grow"></div><div class="card t2" style="border-radius:24px;padding:.9em 1.3em"><p class="txt xs" style="font-weight:700;line-height:1.45">${esc(lm.observacoes)}</p></div>`,
  {layer:1,max:1.3,deco:[circ('6.3in','-1.4in',330,'mint',.55)]});
add(`${hdr('Option 3 · Master list',fl.titulo,fl.subtitulo)}
  <div class="card shop" style="border-radius:30px"><div class="shophead l3"><span class="h3">${esc(fl.secao)}</span></div>${S.checklistRows(mi(fl.itens).map(o=>({text:o.text+'  ·  '+o.code,sub:o.sub})),{layer:3,cols:1})}</div>
  <div class="gap"></div>
  <div class="grid2" style="align-items:start"><div class="card t3" style="border-radius:26px;padding:1em 1.3em"><div class="eyebrow l3">Where to find each item</div><p class="txt xs" style="margin-top:.4em;font-weight:600;line-height:1.5">${esc(fl.ondeAcharCadaItem)}</p></div>
  <div class="card t2" style="border-radius:26px;padding:1em 1.3em"><div class="eyebrow l2">Rosehip seed oil is optional</div><p class="txt xs" style="margin-top:.4em;font-weight:600;line-height:1.5">${esc(fl.rosaMosquetaOpcional)}</p></div></div>`,
  {layer:3,max:1.3,deco:[circ('6.3in','-1.4in',330,'blush',.55)]});

/* 11. tools */
const ut=C.utensilios;
add(`${hdr('Tools & supplies',ut.titulo,ut.subtitulo)}
  <div class="card" style="border-radius:30px;padding:1em 1.4em"><ul class="cl">${ut.kit.map(k=>`<li style="align-items:flex-start;border-bottom:1px solid var(--line)">${S.checkbox(2)}<span style="flex:1"><b style="font-weight:800">${esc(k.item)}</b><small class="muted" style="display:block;font-weight:600;font-size:.82em">${esc(k.paraQue)}</small></span><span class="pill sm l2" style="letter-spacing:.08em;white-space:normal;text-align:center">${esc(k.quando)}</span></li>`).join('')}</ul></div>
  <div class="gap"></div>
  <div class="grid2" style="align-items:start"><div class="card t1" style="border-radius:26px;padding:1em 1.3em"><div class="row" style="gap:.6em">${S.iconDisc('drop',1)}<span class="eyebrow l1">Keep it clean</span></div><p class="txt xs" style="margin-top:.5em;font-weight:600;line-height:1.5">${esc(ut.higiene)}</p></div>
  <div class="card t3" style="border-radius:26px;padding:1em 1.3em"><div class="row" style="gap:.6em">${S.iconDisc('jar',3)}<span class="eyebrow l3">A good habit</span></div><p class="txt xs" style="margin-top:.5em;font-weight:600;line-height:1.5">${esc(ut.dica)}</p></div></div>`,
  {deco:[circ('6.4in','-1.2in',260,'sand',.7)]});

/* 12-13. label reading */
const pr=C.comoEscolherNaPrateleira;
const lab=[...pr.farmaciaELojasNaturais.map(x=>({...x,k:3})),...pr.mercadoEEmCasa.map(x=>({...x,k:1}))];
S.chunk(lab,7).forEach((grp,pi,all)=>add(`${hdr(`Reading labels · ${pi+1} of ${all.length}`,pr.titulo,pr.subtitulo)}
  <div class="stack" style="--g:.6em">${grp.map(x=>`<div class="card" style="border-radius:24px;padding:.8em 1.2em"><div class="row sb" style="align-items:flex-start"><div class="nm" style="font-size:1.2em">${esc(x.item)}</div><span class="pill sm l${x.k}" style="letter-spacing:.1em">${esc(x.lugar)}</span></div>
    <div class="grid2" style="gap:.9em;margin-top:.4em"><p class="txt xs" style="line-height:1.4"><b style="font-weight:800;color:var(--d1)">Look for:</b> ${esc(x.procure)}</p><p class="txt xs" style="line-height:1.4"><b style="font-weight:800;color:var(--d3)">Avoid:</b> ${esc(x.evite)}</p></div></div>`).join('')}</div>`,
  {deco:[circ('6.4in','-1.2in',260,pi?'mint':'blush',.7)]}));

/* 14-15. storage */
const cv=C.conservacaoEValidade;
add(`${hdr('Storage & freshness',cv.titulo,cv.subtitulo)}
  ${S.tableCard({head:['Preparation','When to make it','How long it lasts'],rows:cv.preparos.map(p=>[p.preparo,p.quandoFazer,p.dura]),layer:2,cols:'1.1fr 1fr 1.2fr'})}
  <div class="gap"></div><p class="muted txt xs it">${esc(cv.observacoes)}</p>`,{max:1.3,deco:[circ('6.4in','-1.2in',260,'sand',.7)]});
add(`${hdr('Storage & freshness','Where to keep it',null)}
  <div class="stack">${cv.preparos.map(p=>`<div class="card tight" style="border-radius:20px"><span class="eyebrow l2" style="font-size:.58em">${esc(p.preparo)}</span><p class="txt xs" style="margin-top:.2em;line-height:1.4">${esc(p.ondeGuardar)}</p></div>`).join('')}</div>
  <div class="gap"></div>
  <div class="grid2" style="align-items:start"><div class="card t1" style="border-radius:26px"><div class="eyebrow l1" style="margin-bottom:.5em">Keeping what you bought</div>${cv.guardandoOQueComprou.map(t=>`<p class="txt xs" style="line-height:1.4;margin-top:.4em">${esc(t)}</p>`).join('')}</div>
  <div class="card t3" style="border-radius:26px"><div class="eyebrow l3" style="margin-bottom:.5em">When to discard</div>${cv.quandoDescartar.map(t=>`<p class="txt xs" style="line-height:1.4;margin-top:.4em">${esc(t)}</p>`).join('')}</div></div>`,
  {max:1.2,deco:[circ('6.4in','-1.2in',260,'mint',.7)]});

/* 16-17. swaps */
const tc=C.trocasECuidados;
add(`${hdr('Swaps & skin comfort',tc.titulo,tc.subtitulo)}
  ${S.tableCard({head:['Instead of','You can use','In'],rows:tc.trocas.map(t=>[t.emVezDe,t.podeUsar,t.receitaOuUso]),layer:3,cols:'1fr 1.7fr 1fr'})}
  <div class="gap"></div><p class="muted txt xs it">${esc(tc.observacoes)}</p>`,{max:1.2,deco:[circ('6.4in','-1.2in',260,'blush',.7)]});
add(`${hdr('Swaps & skin comfort','Allergies & care',null)}
  <div class="stack">${tc.alergias.map((a,i)=>`<div class="card t${(i%3)+1}" style="border-radius:22px;padding:.8em 1.2em"><div class="row" style="align-items:flex-start;gap:.8em">${S.iconDisc(['leaf','drop','heart','sun','star','warn'][i%6],(i%3)+1)}<p class="txt sm" style="line-height:1.45;font-weight:700">${esc(a)}</p></div></div>`).join('')}</div>
  <div class="gap"></div>
  <div class="card" style="border-radius:28px;padding:1.1em 1.4em"><p class="txt sm it" style="font-weight:700;line-height:1.5">${esc(tc.naoAchouUmItem)}</p></div>`,
  {max:1.2,deco:[circ('6.4in','-1.2in',260,'mint',.7)]});

/* 18-20. ingredients by recipe */
const ir=C.ingredientesPorReceita;
S.chunk(ir,10).forEach((grp,pi,all)=>add(`${hdr(`Ingredients by recipe · ${pi+1} of ${all.length}`,'What each recipe needs','Approximate US measures. Recipes '+grp[0].receita+' to '+grp[grp.length-1].receita+'.')}
  <div class="dayg" style="align-items:start">${grp.map(r=>{const L=S.LAYERS[r.camada];return `<div class="card t${L.n}" style="border-radius:22px;padding:.7em 1em"><div class="row" style="gap:.6em;align-items:flex-start"><span class="num ${L.cls} sm">${r.receita}</span><div class="nm" style="font-size:1.08em;padding-top:.1em">${esc(r.nome)}</div></div>
    <div style="margin-top:.45em;font-size:.82em;line-height:1.35">${S.bullets(r.ingredientes,{layer:L})}</div></div>`}).join('')}</div>`,
  {layer:pi===0?1:pi===1?2:3,max:1.25,deco:[circ('6.3in','-1.4in',330,pi===0?'mint':pi===1?'sand':'blush',.55)]}));

/* 21. my list */
const ml=C.minhaLista;
add(`${hdr('Your turn',ml.titulo,ml.subtitulo)}
  <div class="grid2" style="align-items:start">${S.dashBox({title:ml.campos[0],h:'3.4in',layer:1,lines:5})}${S.dashBox({title:ml.campos[1],h:'3.4in',layer:2,lines:5})}</div>
  <div class="gap"></div>
  <div class="card t2" style="border-radius:28px;padding:1.1em 1.5em"><div class="eyebrow l2">My planned budget</div>${S.fields(['Week 1 (USD)','Week 2 (USD)','Week 3 (USD)','Total (USD)'],{cols:2})}</div>
  <div class="gap"></div>
  <div class="card" style="border-radius:28px;padding:1.1em 1.5em"><div class="eyebrow">${esc(ml.campos[3])}</div>${S.fieldLine('')}${S.fieldLine('')}</div>`,
  {deco:[circ('6.4in','-1.2in',260,'blush',.7),circ('-1.4in','9.2in',300,'mint',.6)]});

/* 22. closing */
const en=C.encerramento;
add(`<div class="eyebrow">A gentle note</div><h1 class="title">${esc(en.titulo)}</h1><div class="rule"></div>
  <p style="font-size:1.15em;font-weight:700;max-width:5.8in">${esc(en.texto)}</p>
  <div class="gap l"></div>
  <div class="card t3" style="border-radius:32px;padding:1.3em 1.6em"><div class="row" style="gap:.7em;margin-bottom:.5em"><span style="width:1.3em;height:1.3em">${S.icon('warn','#A9505A','100%')}</span><span class="eyebrow plum">Important notice</span></div><p class="txt sm" style="font-weight:600;line-height:1.5">${esc(C.avisoLegal)}</p></div>`,
  {deco:[circ('-1.4in','7.8in',340,'mint',.8),S.sparkle({x:'7.4in',y:'.5in',size:28})]});

add(S.backCover({title:'Korean Silk Method',subtitle:'Shopping Lists',tagline:'Shop with confidence',legal:null}),{bg:'cover',footer:false,fit:false,deco:S.backDeco});
K.finish({slug:'shopping-lists',title:'Korean Silk Method · Shopping Lists',pages}).catch(e=>{console.error(e);process.exit(1)});
