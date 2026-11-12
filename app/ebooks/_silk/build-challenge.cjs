'use strict';
/* 7-day challenge. Run from app/:  node ebooks/_silk/build-challenge.cjs */
const K=require('./kit.cjs'),S=K.S,esc=S.esc;
const {D,R}=K.load({D:['desafio','DESAFIO'],R:['receitas','RECEITAS']});
const L1=S.LAYERS[1],L2=S.LAYERS[2],L3=S.LAYERS[3];
const book=S.Book({name:'7-Day Challenge'});
const pages=[];const add=(inner,o)=>pages.push(book.page(inner,o));
const byN=n=>R.find(r=>r.n===n);
const dayLayer=n=>[1,1,2,2,2,3,3][n-1];
const circ=(x,y,size,tone,o=.7)=>S.circle({x,y,size,tone,opacity:o});

/* recipe names as the challenge calls them */
const nm={};
D.dias.forEach(d=>[...d.manha.passos,...d.noite.passos].forEach(p=>{if(p.receitas.length===1)nm[p.receitas[0]]=nm[p.receitas[0]]||p.titulo}));
(D.vespera.prepareHoje.itens||[]).forEach(i=>nm[i.receita]=i.nome);
const rn=n=>nm[n]||byN(n).nome;

/* 1. cover */
add(S.cover({kicker:'Skin Comfort Challenge · 7 Days',
  lines:[{t:'Korean Silk Method',color:'#A9505A',size:46},{t:'7-Day',color:'#B27C3C',size:150},{t:'Challenge',color:'#4A3B38',size:104}],
  subtitle:D.subtitulo+'. A morning ritual, an evening mask and a recipe for every day',
  mock:{title:'My day today',sideTitle:'7 days',morningLabel:'MORNING',nightLabel:'EVENING',
    morning:['Gently cleanse',rn(1),'Sunscreen'],night:[rn(6),rn(3),rn(12)],checked:['Gently cleanse',rn(1),rn(6),rn(3)]},
  stats:['7 days','2 moments a day','21 recipes'],bottom:'KOREAN SILK METHOD  ·  7 DAYS  ·  MORNING & EVENING  ·  ONE DAY AT A TIME'}),{bg:'cover',footer:false,fit:false,deco:S.coverDeco});

/* 2. welcome */
const bv=D.intro.boasVindas,rt=D.intro.ritmoPorDia;
add(`<div class="eyebrow">Welcome</div><h1 class="title" style="font-size:2.7em">${esc(bv.titulo)}</h1><div class="rule"></div>
  <div class="body" style="font-size:1.04em"><p class="lead" style="font-size:1.1em">${esc(bv.texto)}</p></div>
  <div class="gap l"></div>
  <div class="card t3" style="border-radius:32px;padding:1.2em 1.6em"><div class="row" style="gap:1.1em"><span style="width:2.8em;height:2.8em;flex:none">${S.icon('sparkle','#A9505A','100%')}</span><div class="h2" style="font-size:1.5em">${esc(bv.fecho)}</div></div></div>
  <div class="gap"></div>
  <div class="eyebrow" style="margin-bottom:.5em">Your daily rhythm</div>
  <div class="grid2">
    <div class="card t1" style="border-radius:28px"><div class="row">${S.iconDisc('sun',1)}<div><div class="eyebrow l1">Morning</div><div class="h2" style="font-size:1.5em">${esc(rt.manha)}</div></div></div></div>
    <div class="card t2" style="border-radius:28px"><div class="row">${S.iconDisc('moon',2)}<div><div class="eyebrow l2">Evening</div><div class="h2" style="font-size:1.5em">${esc(rt.noite)}</div></div></div></div></div>
  <div class="grow"></div>
  <div class="card t2" style="border-radius:32px;padding:1.2em 1.6em"><div class="h2" style="font-size:1.45em">My commitment to myself</div>
    <div class="fld"><span>I,</span><i></i><span>commit to caring for my skin for 7 days.</span></div>
    <div class="fld"><span>My start date is</span><i></i><span>Signature</span><i></i></div></div>`,
  {deco:[circ('5.4in','-1.3in',380,'blush'),circ('-1.3in','8.6in',260,'mint')]});

/* 3. how it works + about */
const cf=D.intro.comoFunciona,so=D.intro.sobreODesafio;
add(`<div class="eyebrow">Before you start</div><h1 class="title">${esc(cf.titulo)}</h1><p class="subtitle">${esc(cf.subtitulo)}</p><div class="rule"></div>
  <div class="grid2" style="gap:.9em">${cf.combinados.map((c,i)=>{const L=S.LAYERS[[1,2,3,1][i]];return `<div class="card" style="border-radius:28px;padding:1.1em 1.3em"><div class="row" style="align-items:flex-start;gap:.8em">${S.numCircle(c.n,{layer:L,size:'lg'})}<div class="h3" style="padding-top:.25em">${esc(c.titulo)}</div></div><p class="txt sm" style="margin-top:.7em;line-height:1.45">${esc(c.texto)}</p></div>`}).join('')}</div>
  <div class="gap l"></div>
  <div class="eyebrow">${esc(so.titulo)}</div><div class="gap s"></div>
  <div class="card" style="border-radius:28px;padding:1.1em 1.4em"><div class="stack" style="--g:.8em">${[['clock','Pace',so.ritmo],['heart','A good choice for',so.boaEscolhaPara],['star','How it is organized',so.comoEOrganizado],['leaf','One path at a time',so.umCaminhoPorVez]].map(([ic,a,b],i)=>`<div class="row" style="align-items:flex-start;gap:.8em">${S.iconDisc(ic,(i%3)+1)}<div><b style="font-weight:800">${a}</b><div class="txt sm" style="line-height:1.4">${esc(b)}</div></div></div>`).join('')}</div></div>`,
  {deco:[circ('6.2in','-.9in',260,'sand'),circ('-1.4in','9in',300,'blush',.6)]});

/* 4. 7 days at a glance */
add(`<div class="eyebrow">At a glance</div><h1 class="title">Your 7 days</h1><p class="subtitle">One small theme for each day. Check them off as you go.</p><div class="rule"></div>
  ${S.weekRows({layer:1,rows:D.intro.diasEmUmOlhar.map(d=>({tag:'Day '+d.n,title:d.titulo,layer:dayLayer(d.n)}))})}
  <div class="gap l"></div>
  <div class="grid3">${[[L1,'Days 1 and 2','Hydrate'],[L2,'Days 3 to 5','Nourish'],[L3,'Days 6 and 7','Rejuvenate']].map(([L,a,b])=>`<div class="card t${L.n}" style="border-radius:24px;padding:.9em 1.1em"><div class="eyebrow ${L.cls}" style="font-size:.58em">${a}</div><div class="h2" style="font-size:1.4em">${b}</div></div>`).join('')}</div>`,
  {layer:1,max:1.6,deco:[circ('6.3in','-1.4in',330,'mint',.55)]});

/* 5. morning ritual */
const rd=D.intro.ritualDespertarDaPele;
add(`<div class="eyebrow">Every morning</div><h1 class="title">Morning Refresh Ritual</h1><p class="subtitle">${esc(rd.duracao)}. The same five steps, every day.</p><div class="rule"></div>
  <div class="stack">${rd.passos.map((p,i)=>`<div class="card" style="border-radius:26px;padding:1em 1.3em"><div class="row" style="align-items:flex-start;gap:.9em">${S.numCircle(p.ordem,{layer:[1,2,3,1,2][i],size:'lg'})}<div style="flex:1"><div class="nm" style="font-size:1.35em">${esc(p.titulo)}</div><p class="txt sm" style="margin-top:.3em;line-height:1.45">${esc(p.texto)}</p></div></div></div>`).join('')}</div>`,
  {deco:[circ('6.4in','-1.1in',280,'sand',.7),S.sparkle({x:'7.5in',y:'.35in',size:20})]});

/* 6. Day 0: patch test */
const vt=D.vespera.testeDeContato,pp=D.vespera.pontoDePartida;
add(`<div class="eyebrow">Day 0</div><h1 class="title">${esc(D.diaZero.titulo.replace(/^Day 0 · /,''))}</h1><p class="subtitle">${esc(D.diaZero.subtitulo)}</p><div class="rule"></div>
  <div class="card t3" style="border-radius:30px;padding:1.2em 1.5em"><div class="row" style="gap:.6em;margin-bottom:.4em"><span style="width:1.4em;height:1.4em">${S.icon('warn','#A9505A','100%')}</span><span class="eyebrow plum">${esc(vt.titulo)}</span></div><p class="txt sm" style="font-weight:700;line-height:1.5">${esc(vt.instrucao)}</p></div>
  <div class="gap"></div>
  <div class="card" style="border-radius:30px"><div class="eyebrow l1" style="margin-bottom:.5em">What to test</div>${S.checklistRows(vt.ingredientes,{layer:1,cols:1})}</div>`,
  {deco:[circ('6.4in','-1.2in',260,'blush',.7),circ('-1.4in','9.2in',300,'mint',.6)]});

/* 7. Day 0: starting point + prepare */
const ph=D.vespera.prepareHoje;
add(`<div class="eyebrow">Day 0</div><h1 class="title">${esc(pp.titulo)}</h1><p class="subtitle">${esc(pp.instrucao)}</p><div class="rule"></div>
  <div class="card" style="border-radius:30px;padding:1.1em 1.5em">${S.scaleRows(pp.itens,{layer:3})}</div>
  <div class="gap"></div>
  ${S.dashBox({title:'My starting note',hint:pp.fotoOpcional,h:'1.9in',layer:3,lines:2})}
  <div class="gap l"></div>
  <div class="eyebrow">${esc(ph.titulo)}</div><div class="gap s"></div>
  <div class="stack">${ph.itens.map(i=>`<div class="card t${i.receita===1?1:2}" style="border-radius:24px;padding:.9em 1.2em"><div class="row" style="align-items:flex-start;gap:.8em">${S.iconDisc('jar',i.receita===1?1:2)}<div><div class="nm" style="font-size:1.15em">${esc(i.nombre||i.nome)}</div><p class="txt xs" style="margin-top:.2em;line-height:1.4">${esc(i.texto)}</p></div></div></div>`).join('')}</div>
  <div class="gap s"></div><p class="muted txt xs it">${esc(ph.nota)}</p>`,
  {deco:[circ('6.4in','-1.2in',260,'sand',.7)]});

/* 8. shopping list */
const lc=D.vespera.listaDeCompras;
const sitems=a=>a.map(i=>({text:i.item,sub:`${i.vaiUsar}${i.para?' · '+i.para:''}`,code:i.tag==='essential'?'★':''}));
add(`<div class="eyebrow">Day 0 · Shopping list</div><h1 class="title">${esc(lc.titulo.replace(/^Your /,''))}</h1><p class="subtitle">${esc(lc.subtitulo)}</p><div class="rule"></div>
  <div class="dayg" style="grid-template-columns:1fr 1fr;align-items:start">
    ${S.shopCard({title:'Grocery store',layer:1,items:sitems(lc.mercadoEFeira)})}
    ${S.shopCard({title:'Drugstore & natural stores',layer:2,items:sitems(lc.farmaciaELojasNaturais)})}</div>
  <div class="grow"></div>
  <div class="card t2" style="border-radius:28px;padding:1em 1.4em"><p class="txt xs" style="font-weight:700;line-height:1.45"><span style="color:#B27C3C">★</span> marks the essentials. ${esc(lc.nota)}</p></div>`,
  {deco:[circ('6.4in','-1.2in',260,'blush',.7)]});

/* 9. tools + get-ready checklist + review */
const rv=D.vespera.receitasDaVespera,ut=D.vespera.utensilios,ck=D.vespera.checklist;
add(`<div class="eyebrow">Day 0 · Final check</div><h1 class="title">${esc(ck.titulo)}</h1><div class="rule"></div>
  <div class="card" style="border-radius:30px">${S.checklistRows(ck.itens,{layer:1})}</div>
  <div class="gap"></div>
  <div class="grid2" style="align-items:start">
    <div class="card" style="border-radius:28px"><div class="eyebrow l2" style="margin-bottom:.5em">${esc(ut.titulo)}</div>${S.checklistRows(ut.itens,{layer:2})}</div>
    <div class="stack"><div class="card t3" style="border-radius:28px"><div class="eyebrow l3">${esc(rv.titulo)}</div><p class="txt xs muted" style="margin:.3em 0 .6em">${esc(rv.subtitulo)}</p>
      ${rv.receitas.map(n=>`<div style="background:rgba(255,255,255,.85);border-radius:16px;padding:.6em .8em;margin-top:.45em"><div class="nm" style="font-size:1.1em">${esc(rn(n))}</div><div class="txt xs muted">${esc(byN(n).subtitulo)}</div></div>`).join('')}</div></div></div>`,
  {deco:[circ('6.4in','-1.2in',260,'mint',.7)]});

/* days */
const stepRows=(passos,starIds)=>passos.map(p=>({text:p.titulo+(p.opcional?' (optional)':''),sub:p.texto,star:p.receitas.some(r=>starIds.includes(r))&&false}));
D.dias.forEach(d=>{
  const L=S.LAYERS[dayLayer(d.n)];
  const nightStar=d.noite.passos.findIndex(p=>p.receitas.some(r=>d.receitasDoDia.includes(r)));
  const night=d.noite.passos.map((p,i)=>({text:p.titulo+(p.opcional?' (optional)':''),sub:p.texto,star:i===nightStar}));
  const morn=d.manha.passos.map(p=>({text:p.titulo+(p.opcional?' (optional)':''),sub:p.texto}));
  const ps=d.preparoNaVespera.map(p=>({lab:p.quando,text:p.texto}));
  const tipHtml=`<div class="card t${L.n}"><div class="eyebrow ${L.cls}">Today's gesture</div><div class="nm" style="margin-top:.4em">${esc(d.gestoDoDia.titulo)}</div><p class="it txt sm" style="font-weight:700;margin-top:.3em;line-height:1.4">${esc(d.gestoDoDia.texto)}</p></div>`;
  add(S.dayFront({layer:L,pillLabel:`The 7-day challenge`,dayLabel:`Day ${d.n} of 7`,num:S.pad2(d.n),title:d.titulo,subtitle:d.foco,
    morning:{time:d.manha.duracao,rows:morn},night:{time:d.noite.duracao,rows:night},prepareItems:ps,tipHtml}),{layer:L,bg:'soft',max:1.3,group:'dayfront'});
  /* back: the day's recipes */
  const recs=d.receitasDoDia;
  const cards=recs.map((n,i)=>{const r=byN(n);const wide=recs.length===2||(recs.length===3&&i===2);return `<div${wide?' class="span2"':''}>${S.recipeMini(r,{layer:L,name:rn(n),num:null,wide})}</div>`});
  const busy=`<div class="card" style="border-radius:22px;padding:.8em 1.2em"><div class="row" style="align-items:flex-start;gap:.7em">${S.iconDisc('heart',L)}<div class="txt sm" style="line-height:1.4">${esc(d.seODiaApertar)}</div></div></div>`;
  const obs=d.observacoes.length?`<div class="warn" style="margin-top:0;font-size:.78em">${S.icon('warn','#A9505A')}<div><b>Good to know:</b> <span>${esc(d.observacoes.join(' '))}</span></div></div>`:'';
  add(`<div class="pillrow">${S.pill('The 7-day challenge',{layer:L})}<span class="tagright">Back of day ${d.n}</span></div>
    <div class="rhead"><span class="bignum ${L.cls}">${S.pad2(d.n)}</span><div><h1 class="title">Today's recipes</h1></div></div>
    <p class="subtitle ${L.cls}" style="margin-top:.2em">${esc(d.titulo)}</p><div class="gap s"></div>
    <div class="dayg">${cards.join('')}</div><div class="grow"></div><div class="stack" style="--g:.5em">${busy}${obs}</div>`,{layer:L,bg:'soft',max:1.3,group:'dayback'});
});

/* when life gets busy */
const ba=D.seOdiaApertar,ve=ba.versaoEssencial;
add(`<div class="eyebrow">Real life</div><h1 class="title">${esc(ba.titulo)}</h1><p class="subtitle">${esc(ba.subtitulo)}</p><div class="rule"></div>
  <div class="stack">${[[ve.diaCorrido,1,'clock'],[ve.esqueciUmDia,2,'heart'],[ve.peleReagiu,3,'warn']].map(([c,t,ic])=>`<div class="card t${t}" style="border-radius:30px;padding:1.1em 1.4em"><div class="row" style="align-items:flex-start;gap:.9em">${S.iconDisc(ic,t,'#fff').replace('<span class="ico t'+t+'">','<span class="ico" style="background:'+S.LAYERS[t].color+'">')}<div><div class="h2" style="font-size:1.4em">${esc(c.titulo)}</div><p class="txt sm" style="margin-top:.35em;line-height:1.5;font-weight:700">${esc(c.texto)}</p></div></div></div>`).join('')}</div>
  <div class="gap l"></div>
  <div class="eyebrow">${esc(ba.cadaPeleUmAjuste.titulo)}</div><div class="gap s"></div>
  <div class="grid3" style="align-items:start">${ba.cadaPeleUmAjuste.itens.map((c,i)=>`<div class="card tight" style="border-radius:22px"><div class="eyebrow ${S.LAYERS[i+1].cls}" style="font-size:.6em">${esc(c.pele)}</div><p class="txt xs" style="margin-top:.4em;line-height:1.4">${esc(c.texto)}</p></div>`).join('')}</div>
  <div class="gap"></div><p class="txt sm it" style="font-weight:700;line-height:1.45">${esc(ba.cadaPeleUmAjuste.usarComOutrosProdutos)}</p>`,
  {deco:[circ('6.4in','-1.2in',260,'blush',.7)]});
add(`<div class="eyebrow">Real life</div><h1 class="title">${esc(ba.trocas.titulo)}</h1><div class="rule"></div>
  ${S.tableCard({head:['Instead of','You can use','In'],rows:ba.trocas.itens.map(t=>[t.emVezDe,t.podeUsar,t.emQualReceita]),layer:3,cols:'1fr 1.7fr 1fr'})}`,
  {deco:[circ('6.4in','-1.2in',260,'mint',.7)]});

/* reflection */
const bf=D.balancoFinal;
add(`<div class="eyebrow">Day 7 and beyond</div><h1 class="title">${esc(bf.titulo)}</h1><p class="subtitle">${esc(bf.subtitulo)}</p><div class="rule"></div>
  <div class="eyebrow" style="margin-bottom:.5em">My 7 days</div>
  <div class="row" style="gap:.5em;flex-wrap:wrap">${D.dias.map(d=>`<div style="flex:1;min-width:5.5em;text-align:center"><div style="width:100%;aspect-ratio:1;border:1.6px solid ${S.LAYERS[dayLayer(d.n)].color};border-radius:.9em;background:#fff"></div><div class="tagright" style="font-size:.52em;margin-top:.4em">Day ${d.n}</div></div>`).join('')}</div>
  <div class="gap l"></div>
  <div class="card" style="border-radius:30px;padding:1.1em 1.5em"><div class="eyebrow l3">Then and now</div><p class="txt xs muted" style="margin:.3em 0 .4em">${esc(bf.compareComODia0.instrucao)}</p>${S.scaleRows(bf.compareComODia0.itens,{layer:3})}</div>
  <div class="gap"></div>
  <div class="stack" style="--g:.15em">${bf.perguntas.map(q=>S.fieldLine(q)).join('')}</div>
  <div class="grow"></div>
  <div class="card t2" style="border-radius:26px;padding:1em 1.3em"><div class="eyebrow l2">My next step</div>${S.checklistRows(bf.meuProximoPasso,{layer:2})}</div>`,
  {deco:[circ('6.4in','-1.2in',260,'sand',.7)]});

/* what's next */
const ov=bf.oQueVemDepois,cal=ov.calendarioDe21Dias;
add(`<div class="eyebrow">What comes next</div><h1 class="title">${esc(ov.titulo)}</h1><p class="subtitle">${esc(ov.subtitulo)}</p><div class="rule"></div>
  <div class="grid2">${ov.opcoes.map((o,i)=>`<div class="card t${i+1}" style="border-radius:28px"><div class="row" style="align-items:flex-start;gap:.8em">${S.numCircle(o.n,{layer:i+1})}<div><div class="h3">${esc(o.titulo)}</div><p class="txt sm" style="margin-top:.3em;line-height:1.45">${esc(o.texto)}</p></div></div></div>`).join('')}</div>
  <div class="gap l"></div>
  <div class="eyebrow">How long each preparation lasts</div><div class="gap s"></div>
  ${S.tableCard({head:['Preparation','Shelf life'],rows:ov.quantoDuraCadaPreparo.map(q=>[q.preparo,q.validade]),layer:2,cols:'1fr 1.5fr'})}
  <div class="grow"></div>
  <div class="card t3" style="border-radius:30px;padding:1.2em 1.6em"><div class="h2" style="font-size:1.45em">${esc(ov.fechamento.titulo)}</div><p class="txt sm" style="margin-top:.4em;font-weight:700;line-height:1.5">${esc(ov.fechamento.texto)}</p></div>`,
  {deco:[circ('6.4in','-1.2in',260,'blush',.7)]});
add(`<div class="eyebrow">Keep going</div><h1 class="title">${esc(cal.opcao.titulo)}</h1><p class="subtitle">${esc(cal.opcao.texto)}</p><div class="rule"></div>
  <div class="grid2" style="gap:.9em">${cal.comoEntrarSemAtrito.map((c,i)=>`<div class="card" style="border-radius:28px;padding:1.1em 1.3em"><div class="row" style="align-items:flex-start;gap:.8em">${S.numCircle(c.n,{layer:[1,2,3,1][i],size:'lg'})}<div class="h3" style="padding-top:.2em">${esc(c.titulo)}</div></div><p class="txt sm" style="margin-top:.7em;line-height:1.45">${esc(c.texto)}</p></div>`).join('')}</div>
  <div class="gap l"></div>
  <div class="card t1" style="border-radius:30px;padding:1.2em 1.6em"><div class="row" style="gap:1em">${S.iconDisc('star',1)}<p class="txt sm" style="font-weight:700;line-height:1.5">${esc(cal.jaFazendoOCalendario)}</p></div></div>`,
  {deco:[circ('-1.3in','8.2in',320,'mint',.7),S.sparkle({x:'7.3in',y:'.8in',size:26})]});

/* safety notes (28 notes, 2 pages) */
S.chunk(D.avisos,14).forEach((grp,pi,all)=>add(`<div class="eyebrow">Safety</div><h1 class="title">Good to know</h1><p class="subtitle">Part ${pi+1} of ${all.length}. Read before you start and come back any time.</p><div class="rule"></div>
  <div class="stack" style="--g:.45em">${grp.map((a,i)=>`<div class="card tight t${(i%3)+1}" style="border-radius:18px;padding:.55em 1em"><div class="row" style="align-items:flex-start;gap:.7em">${S.numCircle(pi*14+i+1,{layer:(i%3)+1,size:'sm'})}<p class="txt xs" style="line-height:1.4;font-weight:600">${esc(a)}</p></div></div>`).join('')}</div>`,
  {deco:[circ('6.4in','-1.2in',260,pi?'mint':'sand',.7)]}));

/* back cover */
add(S.backCover({title:'Korean Silk Method',subtitle:'7-Day Challenge',tagline:'One day at a time',legal:null}),{bg:'cover',footer:false,fit:false,deco:S.backDeco});

K.finish({slug:'7-day-challenge',title:'Korean Silk Method · 7-Day Challenge',pages}).catch(e=>{console.error(e);process.exit(1)});
