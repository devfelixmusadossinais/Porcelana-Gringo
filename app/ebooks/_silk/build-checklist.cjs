'use strict';
/* Weekly checklist. Run from app/:  node ebooks/_silk/build-checklist.cjs */
const K=require('./kit.cjs'),S=K.S,esc=S.esc;
const {K:C}=K.load({K:['checklist','CHECKLIST']});
const L1=S.LAYERS[1],L2=S.LAYERS[2],L3=S.LAYERS[3];
const book=S.Book({name:'Weekly Checklist'});
const pages=[];const add=(inner,o)=>pages.push(book.page(inner,o));
const circ=(x,y,size,tone,o=.7)=>S.circle({x,y,size,tone,opacity:o});
const hdr=(eyebrow,title,sub,layer)=>S.header({eyebrow,title,subtitle:sub,layer});
const names={};C.cardapio.receitas.forEach(r=>names[r.receita]=r.nome);
const layerOfRec=n=>C.cardapio.receitas.find(r=>r.receita===n).camada;
const lname=n=>K.lay(C.camadas[n-1].nome);

/* 1. cover */
add(S.cover({kicker:'Weekly planner · 8 weeks',
  lines:[{t:'Korean Silk',color:'#A9505A',size:62},{t:'Weekly',color:'#B27C3C',size:128},{t:'Checklist',color:'#4A3B38',size:104}],
  subtitle:C.subtitulo.charAt(0).toUpperCase()+C.subtitulo.slice(1),
  mock:{title:'My week',sideTitle:'Week by week',morningLabel:'THE BASICS',nightLabel:'MY EXTRAS',
    morning:['Gently cleanse','Moisturize','Sunscreen'],night:['Rice Water Refresh','Rich Comfort Cream','Gentle Eye Moisturizer'],checked:['Gently cleanse','Moisturize','Rice Water Refresh','Rich Comfort Cream']},
  stats:['8 weeks','30-recipe menu','8 weekly templates'],bottom:'KOREAN SILK METHOD  ·  HYDRATE  ·  NOURISH  ·  REJUVENATE  ·  ONE WEEK AT A TIME'}),{bg:'cover',footer:false,fit:false,deco:S.coverDeco});

/* 2. how it works */
const cf=C.comoFunciona;
add(`<div class="eyebrow">How it works</div><h1 class="title" style="font-size:2.7em">${esc(cf.titulo)}</h1><div class="rule"></div>
  <p class="lead" style="font-size:1.05em;line-height:1.5">${esc(cf.introducao)}</p>
  <div class="gap l"></div>
  <div class="eyebrow" style="margin-bottom:.5em">Which material to use</div>
  <div class="grid2" style="gap:.8em">${cf.qualMaterialUsar.map((m,i)=>`<div class="card t${(i%3)+1}" style="border-radius:26px;padding:1em 1.2em"><div class="eyebrow ${S.LAYERS[(i%3)+1].cls}" style="font-size:.58em">${esc(m.etapa)}</div><div class="h2" style="font-size:1.3em;margin-top:.15em">${esc(m.material)}</div><p class="txt xs" style="margin-top:.3em;line-height:1.4">${esc(m.descricao)}</p></div>`).join('')}</div>
  <div class="gap"></div>
  <p class="txt xs muted" style="line-height:1.5">${esc(cf.nota)}</p>
  <div class="grow"></div>
  <div class="card t3" style="border-radius:30px;padding:1.1em 1.5em"><div class="eyebrow l3" style="margin-bottom:.6em">The order of the method</div><div class="seq">${cf.sequenciaDoMetodo.map((s,i)=>`${i?'<span class="arrow">→</span>':''}${S.pill(K.lay(s),{variant:'outline'})}`).join('')}</div><p class="txt xs" style="margin-top:.7em;font-weight:600;line-height:1.45">${esc(cf.sequenciaNota)}</p></div>`,
  {deco:[circ('5.4in','-1.3in',380,'blush'),circ('-1.3in','8.8in',260,'mint')]});

/* 3. four steps + skin types */
add(`${hdr('Your weekly rhythm','Four simple steps','Choose what feels comfortable. Skip anything else.')}
  <div class="grid2" style="gap:.9em">${cf.passos.map((p,i)=>`<div class="card" style="border-radius:28px;padding:1.1em 1.3em"><div class="row" style="align-items:flex-start;gap:.8em">${S.numCircle(p.numero,{layer:[1,2,3,1][i],size:'lg'})}<div class="h3" style="padding-top:.25em">${esc(p.titulo)}</div></div><p class="txt sm" style="margin-top:.7em;line-height:1.45">${esc(p.texto)}</p></div>`).join('')}</div>
  <div class="gap l"></div>
  <div class="eyebrow">Your skin type</div><div class="gap s"></div>
  <div class="grid3" style="align-items:start">${cf.tipoDePele.map((t,i)=>`<div class="card t${i+1}" style="border-radius:24px;padding:.9em 1.1em"><div class="h3">${esc(t.tipo)}</div><p class="txt xs" style="margin-top:.35em;line-height:1.45">${esc(t.dica)}</p></div>`).join('')}</div>
  <div class="grow"></div>
  ${S.promoCard({title:'Busy week?',text:cf.diasCorridos.replace(/^Busy-day shortcut: /,'').replace(/^./,c=>c.toUpperCase()),layer:2,icon:'clock'})}`,
  {deco:[circ('6.2in','-1in',260,'sand',.7)]});

/* 4. with guided plan + golden rules */
const rg=C.regrasDeUsoComPlanoGuiado,gr=C.cardapio.seisRegrasDeOuro;
add(`${hdr('Good to know',rg.titulo,null)}
  <div class="card t1" style="border-radius:30px;padding:1.2em 1.5em"><div class="stack" style="--g:.7em">${rg.regras.map((r,i)=>`<div class="row" style="align-items:flex-start;gap:.8em">${S.numCircle(i+1,{layer:1,size:'sm'})}<p class="txt sm" style="line-height:1.45;font-weight:${i===0?800:600}">${esc(r)}</p></div>`).join('')}</div></div>
  <div class="gap l"></div>
  <div class="eyebrow">The 6 golden rules</div><div class="gap s"></div>
  <div class="grid2" style="gap:.8em">${gr.map((r,i)=>`<div class="card t${[1,2,3,3,1,2][i]}" style="border-radius:26px;padding:1em 1.2em"><div class="row" style="align-items:flex-start;gap:.7em">${S.numCircle(r.numero,{layer:[1,2,3,3,1,2][i],size:'sm'})}<div class="h3" style="padding-top:.1em">${esc(r.titulo)}</div></div><p class="txt xs" style="margin-top:.5em;line-height:1.42;font-weight:600">${esc(r.texto)}</p></div>`).join('')}</div>`,
  {deco:[circ('6.3in','-1.2in',270,'mint',.7)]});

/* 5-7. recipe menu by layer */
C.camadas.forEach(cm=>{
  const L=S.LAYERS[cm.numero];
  const rows=C.cardapio.receitas.filter(r=>r.camada===cm.numero);
  add(`<div class="eyebrow ${L.cls}" style="margin-top:.1in">Recipe menu · Layer ${cm.numero} of 3</div>
    <h1 class="title xl" style="margin-top:.1em;font-size:4.2em">${esc(K.lay(cm.nome))}</h1>
    <p class="subtitle ${L.cls}" style="font-size:1.1em">${esc(cm.descricao)}</p><div class="rule ${L.cls}" style="width:40px"></div>
    ${S.tableCard({head:['Recipe','When','Time','Weekly limit','How long it lasts'],rows:rows.map(r=>[r.receita+'. '+r.nome,r.quando,r.tempo,r.limiteSemanal,r.dura]),layer:L,cols:'1.25fr .8fr .95fr 1fr 1.1fr'})}
    ${cm.numero===3?`<p class="muted txt xs it" style="margin-top:.8em;line-height:1.45">${esc(C.cardapio.observacoes)}</p>`:''}`,
    {layer:L,max:1.25,deco:[circ('6.3in','-1.4in',330,cm.numero===1?'mint':cm.numero===2?'sand':'blush',.55),S.sparkle({x:'7.45in',y:'.35in',size:20,color:L.color})]});
});

/* 8. check-in colors */
const ci=C.checkInDaPele,rn_=ci.receitaNova;
add(`${hdr('Your Sunday check-in',ci.titulo,ci.subtitulo)}
  <div class="eyebrow plum" style="margin-bottom:.5em">${esc(ci.perguntaPrincipal)}</div>
  <div class="stack" style="--g:.7em">${ci.estados.map((e,i)=>{const L=S.LAYERS[[1,2,3][i]];return `<div class="card t${L.n}" style="border-radius:28px;padding:1em 1.4em"><div class="row" style="align-items:flex-start;gap:.9em"><span style="flex:none;width:2.2em;height:2.2em;border-radius:50%;background:${['#6E9D93','#E2B95E','#C8807C'][i]}"></span><div><div class="h2" style="font-size:1.35em">${esc(e.titulo)}</div><p class="txt sm" style="margin-top:.2em;font-weight:700">${esc(e.quando)}</p><p class="txt xs" style="margin-top:.3em;line-height:1.45">${esc(e.oQueFazer)}</p></div></div></div>`}).join('')}</div>
  <div class="gap l"></div>
  <div class="eyebrow">${esc(rn_.titulo)}</div><div class="gap s"></div>
  <div class="grid3" style="align-items:start">${rn_.passos.map((p,i)=>`<div class="card tight" style="border-radius:22px"><div class="row" style="gap:.6em">${S.numCircle(p.numero,{layer:i+1,size:'sm'})}<div class="nm" style="font-size:1.05em">${esc(p.titulo)}</div></div><p class="txt xs" style="margin-top:.4em;line-height:1.4">${esc(p.texto)}</p></div>`).join('')}</div>
  <div class="grow"></div>
  <div class="card" style="border-radius:26px;padding:1em 1.3em"><p class="txt sm it" style="font-weight:700;line-height:1.5">${esc(ci.semanaMinima)}</p></div>`,
  {deco:[circ('6.3in','-1.2in',270,'blush',.7)]});

/* 9-16. 8 weekly templates */
const mm=C.modelosDeSemana;
add(`${hdr('Ready-to-use templates',mm.titulo,mm.subtitulo)}
  <p class="txt sm" style="font-weight:700;line-height:1.5">${esc(mm.nota)}</p><div class="gap"></div>
  <div class="stack" style="--g:.55em">${mm.modelos.map((m,i)=>{const L=S.LAYERS[(i%3)+1];return `<div class="card" style="border-radius:22px;padding:.7em 1em"><div class="row" style="gap:.8em">${S.numCircle(m.semana,{layer:L})}<div><div class="nm" style="font-size:1.15em">${esc(m.nome)}</div><div class="txt xs muted" style="line-height:1.35">${esc(m.descricao)}</div></div></div></div>`}).join('')}</div>`,
  {deco:[circ('6.3in','-1.2in',270,'sand',.7)]});
mm.modelos.forEach((m,i)=>{
  const L=S.LAYERS[(i%3)+1];
  const chip=(n,k)=>`<span class="pill sm l${k}" style="letter-spacing:.04em;text-transform:none;font-weight:800;font-size:.7em;white-space:normal;margin:.12em .15em .12em 0">${esc(names[n]||n)}</span>`;
  const dayRows=m.dias.map(d=>{
    const chips=[...d.hidratar.map(n=>chip(n,1)),...d.nutrir.map(n=>chip(n,2)),...d.rejuvenescer.map(n=>chip(n,3))].join('');
    const rest=!chips&&!d.receitas.length?`<span class="txt sm it" style="color:var(--muted);font-weight:700">${esc(d.texto||'Just the basics')}</span>`:'';
    const extra=!chips&&d.receitas.length?d.receitas.map(n=>chip(n,layerOfRec(n))).join(''):'';
    return `<div class="wkr" style="grid-template-columns:auto 1fr 3.3em"><span class="dp" style="background:${L.color}">${esc(d.dia)}</span><span>${chips||extra||rest}${chips&&d.texto?`<small class="txt xs muted" style="display:block">${esc(d.texto)}</small>`:''}</span><span class="bx"><span class="box big ${L.cls}"></span></span></div>`}).join('');
  add(`<div class="eyebrow ${L.cls}" style="margin-top:.1in">Weekly template ${m.semana} of 8</div>
    <h1 class="title" style="font-size:3.2em;margin-top:.15em">${esc(m.nome)}</h1><p class="subtitle ${L.cls}">${esc(m.descricao)}</p><div class="rule ${L.cls}"></div>
    <div class="card t${L.n}" style="border-radius:26px;padding:.9em 1.3em"><div class="row" style="align-items:flex-start;gap:.8em">${S.iconDisc('sun',L)}<div><div class="eyebrow ${L.cls}">Every day</div><p class="txt xs" style="margin-top:.3em;font-weight:700;line-height:1.45">${esc(m.todoDia.texto)}</p></div></div></div>
    <div class="gap"></div>
    <div class="row sb" style="padding:0 .9em 0 .5em"><span class="eyebrow ${L.cls}">Evening ideas</span><span class="tagright" style="font-size:.5em">Done</span></div>
    <div>${dayRows}</div>
    <div class="grow"></div>
    <div class="card" style="border-radius:22px;padding:.8em 1.2em"><p class="txt xs" style="line-height:1.45;font-weight:600"><b style="font-weight:800">Good to know:</b> ${esc(m.observacoes)}</p></div>`,
    {layer:L,max:1.3,deco:[circ('6.3in','-1.4in',330,['mint','sand','blush'][i%3],.55)]});
});

/* printable weekly sheets (8 x front + Sunday back) */
const fs_=C.folhaSemanal,bs=C.balancoDeDomingo;
const grp=(cam,L)=>`<div class="gh"><span class="pill ${L.cls}" style="letter-spacing:.12em">${esc(K.lay(cam.titulo))}</span><span class="txt xs muted">${esc(cam.subtitulo)}</span></div>${cam.itens.map(it=>`<div class="r"><span class="t">${it.linhaEmBranco?`${esc(it.nome)} <i class="blank"></i>`:esc(it.nome)}<small>${esc(it.limite)}</small></span>${fs_.dias.map(()=>`<span class="box ${L.cls}"></span>`).join('')}</div>`).join('')}`;
const dayHead=`<div class="r dh"><span></span>${fs_.dias.map(d=>`<span>${d}</span>`).join('')}</div>`;
for(let w=1;w<=8;w++){
  const L=S.LAYERS[((w-1)%3)+1];
  add(`<div class="pillrow">${S.pill('Weekly sheet',{layer:L})}<span class="tagright">Week ${w} of 8</span></div>
    <div class="rhead"><span class="bignum ${L.cls}">${S.pad2(w)}</span><div><h1 class="title">${esc(fs_.titulo)}</h1></div></div>
    <div class="row" style="gap:1.2em;margin-top:.4em"><div class="fld" style="margin:0;flex:1"><span>From</span><i></i><span>to</span><i></i></div>
      <div class="row" style="gap:.4em;flex:none">${fs_.foco.map(f=>`<span class="pill sm outline" style="letter-spacing:.08em">${esc(K.lay(f))}</span>`).join('')}</div></div>
    <div class="gap s"></div>
    <div class="card wsheet" style="border-radius:26px;padding:.7em 1.1em">
      ${dayHead}
      <div class="gh"><span class="pill outline" style="letter-spacing:.12em">${esc(fs_.base.titulo)}</span><span class="txt xs muted">${esc(fs_.base.subtitulo)}</span></div>
      ${fs_.base.itens.map(t=>`<div class="r"><span class="t">${esc(t)}</span>${fs_.dias.map(()=>`<span class="box gold"></span>`).join('')}</div>`).join('')}
      ${grp(fs_.camada1,L1)}${grp(fs_.camada2,L2)}${grp(fs_.camada3,L3)}
    </div>
    <div class="grow"></div>
    <p class="muted txt xs it" style="margin-top:.5em;line-height:1.4">${esc(fs_.observacoes)}</p>`,
    {layer:L,bg:"soft",max:1.45,group:"wsheet"});
  add(`<div class="pillrow">${S.pill('Sunday check-in',{layer:L})}<span class="tagright">Week ${w} of 8</span></div>
    <div class="rhead"><span class="bignum ${L.cls}">${S.pad2(w)}</span><div><h1 class="title">${esc(bs.titulo)}</h1></div></div>
    <p class="subtitle ${L.cls}" style="margin-top:.2em">How does my skin feel?</p><div class="gap"></div>
    <div class="grid3" style="gap:.6em">${bs.escalaCor.map((e,i)=>`<div class="card tight t${i+1}" style="border-radius:22px"><div class="row" style="gap:.6em"><span class="box big" style="border-color:${['#6E9D93','#E2B95E','#C8807C'][i]}"></span><span class="txt sm" style="font-weight:800;line-height:1.2">${esc(e)}</span></div></div>`).join('')}</div>
    <div class="gap"></div>
    <div class="card" style="border-radius:28px;padding:1em 1.4em"><div class="eyebrow ${L.cls}">Rate from ${esc(bs.notas.escala.replace(' to ',' (low) to '))} (high)</div>${S.scaleRows(bs.notas.itens,{layer:L})}</div>
    <div class="gap"></div>
    ${bs.perguntas.map(q=>`<div class="card" style="border-radius:24px;padding:.8em 1.2em;margin-bottom:.6em"><div class="eyebrow ${L.cls}">${esc(q)}</div><div class="ln2" style="height:2em;border-bottom:1px solid var(--line)"></div><div class="ln2" style="height:2em;border-bottom:1px solid var(--line)"></div></div>`).join('')}
    <div class="grow"></div>`,
    {layer:L,bg:'soft',max:1.25,group:'wback'});
}

/* freshness & restocking */
const es=C.estoque;
add(`${hdr('Before you plan',es.titulo,es.subtitulo)}
  ${S.tableCard({head:['Preparation','How long it lasts'],rows:es.validadeDosPreparos.map(p=>[p.preparo,p.dura]),layer:2,cols:'1.1fr 1.4fr'})}
  <div class="gap"></div>
  <div class="card t3" style="border-radius:24px;padding:.9em 1.3em"><p class="txt xs" style="font-weight:700;line-height:1.45">${esc(es.aviso)}</p></div>`,
  {max:1.2,deco:[circ('6.3in','-1.2in',270,'sand',.7)]});
add(`${hdr('Before you plan','Restock check',es.notaReposicao)}
  <div class="card" style="border-radius:30px">${S.checklistRows(es.reposicaoDaSemana,{layer:1})}</div>
  <div class="gap"></div>
  ${S.tableCard({head:es.colunas,rows:[['','',''],['','',''],['','',''],['','','']],layer:2,cols:'1fr 1fr 1fr'})}`,
  {max:1.2,deco:[circ('6.3in','-1.2in',270,'mint',.7)]});

/* month check-ins */
const bm=C.balancoDoMes,cmp=bm.compareComOInicio;
bm.meses.forEach(mo=>{
  add(`${hdr(`Month ${mo.mes} · Weeks ${mo.semanas[0]} to ${mo.semanas[3]}`,bm.titulo,bm.subtitulo)}
    <div class="card" style="border-radius:28px;padding:.9em 1.3em"><div class="row sb" style="margin-bottom:.2em"><span class="eyebrow">My weeks in color</span><span class="txt xs muted">${bm.corDeCadaSemana.join(' · ')}</span></div>
      ${mo.semanas.map((w,i)=>`<div class="row" style="padding:.4em 0;border-bottom:1px solid var(--line)"><span class="pill sm ${S.LAYERS[(i%3)+1].cls}" style="flex:none">Week ${w}</span><span class="row" style="gap:.4em;flex:none">${['#6E9D93','#E2B95E','#C8807C'].map(c=>`<span class="cr" style="border-color:${c};width:1.4em;height:1.4em"></span>`).join('')}</span><div class="fld" style="margin:0;flex:1"><span>${esc(bm.campoPorSemana)}</span><i></i></div></div>`).join('')}</div>
    <div class="gap"></div>
    <div class="card" style="border-radius:28px;padding:1em 1.4em"><div class="eyebrow l3">Then and now</div><p class="txt xs muted" style="margin:.3em 0 .2em">${esc(cmp.instrucao)}</p>${S.scaleRows(cmp.itens,{layer:3,heads:cmp.colunas})}</div>
    <div class="gap"></div>
    <div class="stack" style="--g:.1em">${bm.perguntas.map(q=>S.fieldLine(q)).join('')}</div>
    <div class="grow"></div><p class="muted txt xs it" style="line-height:1.45">${esc(bm.lembrete)}</p>`,
    {max:1.15,deco:[circ('6.3in','-1.2in',270,mo.mes===1?'mint':'blush',.7)]});
});

/* closing */
add(`<div class="eyebrow">A gentle note</div><h1 class="title">${esc(C.encerramento.titulo)}</h1><div class="rule"></div>
  <p style="font-size:1.15em;font-weight:700;max-width:5.8in">${esc(C.encerramento.texto)}</p>
  <div class="gap l"></div>
  <div class="card t3" style="border-radius:32px;padding:1.3em 1.6em"><div class="row" style="gap:.7em;margin-bottom:.5em"><span style="width:1.3em;height:1.3em">${S.icon('warn','#A9505A','100%')}</span><span class="eyebrow plum">Important notice</span></div><p class="txt sm" style="font-weight:600;line-height:1.5">${esc(C.avisoLegal)}</p></div>`,
  {deco:[circ('-1.4in','7.8in',340,'mint',.8),S.sparkle({x:'7.4in',y:'.5in',size:28})]});
add(S.backCover({title:'Korean Silk Method',subtitle:'Weekly Checklist',tagline:'One week at a time',legal:null}),{bg:'cover',footer:false,fit:false,deco:S.backDeco});
K.finish({slug:'weekly-checklist',title:'Korean Silk Method · Weekly Checklist',pages}).catch(e=>{console.error(e);process.exit(1)});
