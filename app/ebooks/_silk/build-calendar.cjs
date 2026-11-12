'use strict';
/* 21-day calendar (65 pages, same order as the original so "(p. 54)" references stay valid).
   Run from app/:  node ebooks/_silk/build-calendar.cjs
   Source: ../calendario-21-dias/calendario_en.md. [MODELING NOTE] lines go to ebooks/REPORT_calendar.md */
const fs=require('fs'),path=require('path');
const K=require('./kit.cjs'),S=K.S,esc=S.esc;
const P=require('./calendar-parse.cjs');
const {pages:SRC,notes}=P.parse();
const lay=K.lay;
const L1=S.LAYERS[1],L2=S.LAYERS[2],L3=S.LAYERS[3];
const book=S.Book({name:'21-Day Calendar'});
const pages=[];const add=(inner,o)=>pages.push(book.page(inner,o));
const circ=(x,y,size,tone,o=.7)=>S.circle({x,y,size,tone,opacity:o});
const J=P.join,ix=P.idx;
const hdr=(eyebrow,title,sub)=>`<div class="eyebrow">${esc(eyebrow)}</div><h1 class="title">${esc(title)}</h1>${sub?`<p class="subtitle">${esc(sub)}</p>`:''}<div class="rule"></div>`;
const weekLayer=w=>/NOURISH/i.test(w)?2:/REFRESH|REJUV/i.test(w)?3:1;
const tcase=s=>s.charAt(0)+s.slice(1).toLowerCase();
const wkLabel=s=>lay(s.replace(/REFRESH/,'Rejuvenate').replace(/REJUVENATE/,'REJUVENATE')); // WEEK 3 · REFRESH -> WEEK 3 · REJUVENATE
const wkPill=s=>s.replace(/REFRESH/i,m=>m===m.toUpperCase()?'REJUVENATE':'Rejuvenate');
const take=(L,from,n)=>L.slice(from,from+n);
const md=s=>s.replace(/^#+\s*/,'').replace(/^- /,'').replace(/<br>/g,' | ');

/* ===== 1. cover ===== */
const p1=SRC[1];
const m1=ix(p1,/^My ritual today$/);
add(S.cover({kicker:J(take(p1,0,1)).replace(/-/g,'-'),
  lines:[{t:'Korean Silk Method',color:'#A9505A',size:44},{t:'21-Day',color:'#B27C3C',size:150},{t:'Calendar',color:'#4A3B38',size:112}],
  subtitle:J(take(p1,ix(p1,/^21 days of skincare$/),2)),
  mock:{title:p1[m1],sideTitle:p1[ix(p1,/^21 days$/)],morningLabel:p1[m1+1],nightLabel:p1[ix(p1,/^EVENING$/)],
    morning:take(p1,m1+2,3),night:take(p1,ix(p1,/^EVENING$/)+1,3),checked:[p1[m1+2],p1[m1+3],p1[ix(p1,/^EVENING$/)+1],p1[ix(p1,/^EVENING$/)+2]]},
  stats:['21 days','Morning and evening','Day by day'],
  bottom:'KOREAN SILK METHOD  ·  MORNING & EVENING  ·  DAY BY DAY  ·  SPACE TO CHECK OFF'}),{bg:'cover',footer:false,fit:false,deco:S.coverDeco});

/* ===== 2. welcome ===== */
{const L=SRC[2];
 const hi=ix(L,/^Hi there!$/),yn=ix(L,/^You don[’']t need more information/),cm=ix(L,/^My commitment/);
 const body=J(L.slice(hi+1,yn)).split(/(?<=[.!?]) (?=Each day has|Over these 21)/);
 add(`<div class="eyebrow">${esc(L[0])}</div><h1 class="title" style="font-size:3.4em">${esc(L[1])}<br>${esc(L[2])}</h1><div class="rule"></div>
  <div class="body" style="font-size:1.02em;max-width:6.2in"><p style="font-weight:800">${esc(L[hi])}</p>${body.map(t=>`<p>${esc(t)}</p>`).join('')}</div>
  <div class="gap l"></div>
  <div class="card t3" style="border-radius:32px;padding:1.3em 1.6em"><div class="row" style="gap:1.2em"><span style="width:2.8em;height:2.8em;flex:none">${S.icon('sparkle','#A9505A','100%')}</span><div><div class="h2" style="font-size:1.55em">${esc(L[yn])}</div><div class="h2 plum" style="font-size:1.55em">${esc(L[yn+1])}</div></div></div></div>
  <div class="gap l"></div>
  <div class="card t2" style="border-radius:32px;padding:1.3em 1.7em"><div class="h2" style="font-size:1.5em">${esc(L[cm])}</div>
   <div class="fld"><span>${esc(L[cm+1].replace(/,$/,''))},</span><i></i><span>commit to making time for myself for 21 days.</span></div>
   <div class="fld"><span>My start date is</span><i></i><span>${esc(L[L.length-1])}</span><i></i></div></div>`,
  {deco:[circ('5.4in','-1.3in',380,'blush'),circ('-1.3in','8.6in',260,'mint'),S.sparkle({x:'7.45in',y:'3.2in',size:24})]});}

/* ===== 3. how to use ===== */
{const L=SRC[3];
 const t=[[2,2],[2,2],[1,2],[2,2]];let i=ix(L,/^1$/);const steps=[];
 for(let k=0;k<4;k++){i++;const ti=take(L,i,t[k][0]);i+=t[k][0];const de=take(L,i,t[k][1]);i+=t[k][1];steps.push({n:k+1,title:J(ti),text:J(de)});if(k<3&&L[i]!==String(k+2))throw Error('p3 parse '+L[i])}
 const hi=ix(L,/^HOW TO READ EACH PAGE$/);
 const leg=[];for(let j=hi+1;j<L.length;){const n=L[j];let d=[];j++;while(j<L.length&&!/^(Morning|Evening|Today[’']s featured recipe|Prepare today|Checkbox|Light day)$/.test(L[j]))d.push(L[j++]);leg.push([n,J(d)])}
 add(`${hdr(L[0],L[1],L[2])}
  <div class="grid2" style="gap:.9em">${steps.map((s,k)=>`<div class="card" style="border-radius:28px;padding:1.1em 1.3em"><div class="row" style="align-items:flex-start;gap:.8em">${S.numCircle(s.n,{layer:[1,2,3,1][k],size:'lg'})}<div class="h3" style="padding-top:.25em">${esc(s.title)}</div></div><p class="txt sm muted" style="margin-top:.8em;line-height:1.5">${esc(s.text)}</p></div>`).join('')}</div>
  <div class="gap l"></div><div class="eyebrow">${esc(L[hi])}</div><div class="gap s"></div>
  <div class="card" style="border-radius:30px"><ul class="legend" style="display:grid;grid-template-columns:1fr 1fr;gap:.9em 1.4em">${leg.map(([a,b],k)=>`<li style="margin:0">${S.iconDisc(['sun','moon','star','jar','check','heart'][k],(k%3)+1)}<div><b>${esc(a)}</b><span class="d">${esc(b)}</span></div></li>`).join('')}</ul></div>`,
  {deco:[circ('6.3in','-1in',260,'sand',.7)]});}

/* ===== 4. golden rules ===== */
{const L=SRC[4];
 const cnt=[[2,3],[2,2],[1,4],[2,5]];let i=3;const rules=[];
 for(const [tn,dn] of cnt){const ti=take(L,i,tn);i+=tn;const de=take(L,i,dn);i+=dn;rules.push({title:J(ti),text:J(de)})}
 const imp=J(L.slice(i));
 const ic=['sun','jar','drop','warn'],tn=[1,2,3,1];
 add(`${hdr(L[0],L[1],L[2])}
  <div class="grid2" style="gap:.9em">${rules.map((r,k)=>`<div class="card t${tn[k]}" style="border-radius:32px;padding:1.3em 1.4em"><span class="ico" style="background:#fff">${S.icon(ic[k],S.LAYERS[tn[k]].dark)}</span><div class="h2" style="font-size:1.5em;margin-top:.7em">${esc(r.title)}</div><p class="txt sm" style="margin-top:.45em;line-height:1.5;font-weight:600">${esc(r.text)}</p></div>`).join('')}</div>
  <div class="gap"></div>
  <div class="card" style="border-radius:28px;padding:1.2em 1.5em"><div class="row" style="align-items:flex-start;gap:1em"><span style="width:1.6em;height:1.6em;flex:none">${S.icon('heart','#B27C3C','100%')}</span><p class="txt sm" style="line-height:1.5;font-weight:600">${esc(imp)}</p></div></div>`,
  {deco:[circ('6.3in','-1in',260,'blush',.7)]});}

/* ===== 5. shopping list ===== */
{const L=SRC[5];
 const a=ix(L,/^From the kitchen$/),b=ix(L,/^From the drugstore/),c=ix(L,/^Tools and supplies$/),d=ix(L,/^W1, W2, and W3 show/);
 const pairs=(arr)=>{const r=[];for(let i=0;i<arr.length;i+=2)r.push({text:arr[i],code:(arr[i+1]||'').replace(/–/g,' to ').replace(/^W(\d) to W(\d)$/,'W$1 to W$2')});return r};
 add(`${hdr(L[0],L[1],L[2])}
  <div class="grid2" style="align-items:start;gap:.9em">
   <div>${S.shopCard({title:L[a],layer:1,items:pairs(L.slice(a+1,b))})}</div>
   <div class="stack" style="--g:.9em">${S.shopCard({title:L[b],layer:2,items:pairs(L.slice(b+1,c))})}${S.shopCard({title:L[c],layer:3,items:L.slice(c+1,d)})}</div></div>
  <div class="grow"></div>
  <div class="card t2" style="border-radius:28px;padding:1.1em 1.5em"><p class="txt sm" style="font-weight:700;line-height:1.5">${esc(J(L.slice(d,d+1)))}</p><p class="txt sm" style="font-weight:700;line-height:1.5;margin-top:.3em">${esc(J(L.slice(d+1)))}</p></div>`,
  {max:1.3,deco:[circ('6.4in','-1.2in',260,'sand',.6)]});}

/* ===== 6. once or on the spot ===== */
{const L=SRC[6];
 const rows=L.filter(x=>/^\|/.test(x)&&!/^\|[-| ]+\|$/.test(x)).map(x=>x.split('|').slice(1,-1).map(s=>s.trim()));
 const head=rows.shift();
 const si=ix(L,/Your Sunday setup/);const sl=L.slice(si+1).filter(x=>/^- /.test(x)).map(x=>x.slice(2));
 add(`${hdr(md(L[0]),md(L[1]),L[2])}
  ${S.tableCard({head,rows,layer:3,cols:'1.1fr .9fr 1.3fr 1.5fr'})}
  <div class="gap l"></div>
  <div class="card t1" style="border-radius:30px;padding:1.2em 1.5em"><div class="row" style="gap:.7em;margin-bottom:.4em">${S.iconDisc('jar',1)}<span class="eyebrow l1">${esc(md(L[si]))}</span></div>${S.checklistRows(sl,{layer:1})}</div>`,
  {max:1.3,deco:[circ('6.4in','-1.2in',260,'mint',.7)]});}

/* ===== 7. Day 0 ===== */
{const L=SRC[7];
 const pt=ix(L,/^### 24-HOUR PATCH TEST/);const disc=ix(L,/^For cosmetic care only/);
 const st=L.slice(pt+1,disc).filter(x=>/^\d\. /.test(x)).map(x=>x.replace(/^\d\. /,''));
 const sp=ix(L,/^## My starting point/);const tb=L.slice(sp).filter(x=>/^\|/.test(x)&&!/^\|[-| ]+\|$/.test(x)).map(x=>x.split('|')[1].trim()).filter(Boolean);
 const sn=ix(L,/^### Day 1 Skin Notes/);const wh=ix(L,/^### WHEN AND WHERE/);
 const fl=L.slice(wh+1).map(x=>x.replace(/_+/g,'').trim());
 add(`<div class="eyebrow">${esc(md(L[0]))}</div><h1 class="title">${esc(md(L[1]))}</h1><p class="subtitle">${esc(L[2])}</p><div class="rule"></div>
  <div class="card t3" style="border-radius:30px;padding:1.1em 1.5em"><div class="row" style="gap:.6em;margin-bottom:.5em"><span style="width:1.3em;height:1.3em">${S.icon('warn','#A9505A','100%')}</span><span class="eyebrow plum">${esc(md(L[pt]))}</span></div>
   <div class="stack" style="--g:.5em">${st.map((t,i)=>`<div class="row" style="align-items:flex-start;gap:.7em">${S.numCircle(i+1,{layer:3,size:'sm'})}<p class="txt sm" style="line-height:1.42;font-weight:600">${esc(t)}</p></div>`).join('')}</div>
   <p class="txt xs" style="margin-top:.7em;line-height:1.4;font-weight:600;color:var(--d3)">${esc(L[disc])}</p></div>
  <div class="gap"></div>
  <div class="card" style="border-radius:28px;padding:1em 1.4em"><div class="eyebrow l1">${esc(md(L[sp]))}</div><p class="txt xs muted" style="margin:.25em 0 .2em">${esc(L[sp+1])}</p>${S.scaleRows(tb,{layer:1})}</div>
  <div class="gap"></div>
  <div class="grid2" style="align-items:stretch;gap:.9em">${S.dashBox({title:md(L[sn]),hint:L[sn+1],h:'2in',layer:3,lines:2})}
   <div class="card t2" style="border-radius:26px;padding:1em 1.3em"><div class="eyebrow l2">${esc(md(L[wh]))}</div>${fl.map(t=>S.fieldLine(t)).join('')}</div></div>`,
  {max:1.2,deco:[circ('6.4in','-1.2in',260,'sand',.7)]});}

/* ===== 8. map ===== */
{const L=SRC[8];
 const wk=[];let i=ix(L,/^### WEEK 1$/);
 for(let w=1;w<=3;w++){const name=md(L[i+1]);const days=[];let j=i+2;while(j<L.length&&/^\d+\. /.test(L[j])){days.push(L[j].replace(/^\d+\. /,''));j++}wk.push({w,name,days,first:(w-1)*7+1});i=j+ (L[j]&&/^### WEEK/.test(L[j])?0:0)}
 const foot=J(L.slice(L.findIndex(x=>/^Days 4, 9/.test(x))));
 add(`<div class="eyebrow">${esc(md(L[0]))}</div><h1 class="title">${esc(md(L[1]))}</h1><p class="subtitle">${esc(L[2])}</p><div class="rule"></div>
  <div class="grid3" style="gap:.8em;align-items:stretch">${wk.map(w=>{const Lw=S.LAYERS[w.w];return `<div class="card t${w.w}" style="border-radius:30px;padding:1.1em 1em"><div class="eyebrow ${Lw.cls}">Week ${w.w}</div><div class="h2" style="font-size:1.7em;margin:.1em 0 .6em">${esc(lay(w.name))}</div><div class="stack" style="--g:.5em">${w.days.map((d,k)=>`<div class="row" style="align-items:flex-start;gap:.5em;background:rgba(255,255,255,.85);border-radius:16px;padding:.45em .6em">${S.numCircle(w.first+k,{layer:Lw,size:'sm'})}<span style="font-weight:800;font-size:.84em;line-height:1.25;padding-top:.15em">${esc(d)}</span></div>`).join('')}</div></div>`}).join('')}</div>
  <div class="gap"></div>
  <div class="card" style="border-radius:26px;padding:1em 1.4em"><div class="row" style="gap:.8em;align-items:flex-start">${S.iconDisc('heart',3)}<p class="txt sm" style="line-height:1.5;font-weight:700">${esc(foot)}</p></div></div>`,
  {max:1.3,deco:[circ('6.3in','-1.2in',270,'blush',.7),circ('-1.4in','9.1in',300,'mint',.6)]});}

/* ===== weeks ===== */
const FRONT=d=>d<=7?10+2*(d-1):d<=14?25+2*(d-8):40+2*(d-15);
function weekPage(pn,wn){
  let L=SRC[pn];
  if(pn===9){ // markdown page -> same line structure as plain pages
    const o=[];for(const x of L){if(/^\|[-| ]+\|$/.test(x)||/^\| *\| MORNING/.test(x))continue;
      const m=x.match(/^\| (DAY \d+)<br>(.*?) \|/);if(m){o.push(m[1],m[2]);continue}
      o.push(x.replace(/^#+\s*/,'').replace(/^- /,''))}
    L=o;}
  const w=P.weekPage(L);const Lw=S.LAYERS[wn];
  const name=w.name==='Refresh'?'Rejuvenate':w.name;
  add(`<div class="eyebrow ${Lw.cls}" style="margin-top:.15in">${esc(w.header)}</div>
   <h1 class="title xl" style="margin-top:.1em;font-size:5em">${esc(name)}</h1>
   <p class="subtitle ${Lw.cls}" style="font-size:1.25em">${esc(w.sub)}</p><div class="rule ${Lw.cls}" style="width:40px"></div>
   <p class="txt sm" style="max-width:6in;line-height:1.5"><b style="font-weight:800">This week’s goal:</b> ${esc(w.goal)}</p>
   ${w.notice?`<p class="txt xs muted" style="max-width:6in;margin:.5em 0 .9em;line-height:1.45"><b style="font-weight:800">You may notice:</b> ${esc(w.notice)}</p>`:''}
   <div class="card" style="border-radius:34px;padding:1.1em 1.5em"><div class="eyebrow ${Lw.cls}" style="margin-bottom:.6em">What you’ll need this week</div>${S.checklistRows(w.needs,{layer:Lw,cols:2})}</div>
   <div class="eyebrow ${Lw.cls}" style="margin:1em 0 .1em">The week at a glance</div>
   ${S.weekRows({layer:Lw,rows:w.days.map(d=>({tag:'Day '+d.n,title:d.title})),cols:['MORNING','EVENING']})}`,
   {layer:Lw,max:1.5,deco:[circ('6.3in','-1.4in',330,['mint','sand','blush'][wn-1],.55),S.sparkle({x:'7.45in',y:'.35in',size:20,color:Lw.color})]});
}

/* ===== days ===== */
const dayTitles={};
function dayPages(d){
  const f=P.dayFront(SRC[FRONT(d)]);const b=P.dayBack(SRC[FRONT(d)+1]);
  const wn=weekLayer(f.week);const Lw=S.LAYERS[wn];
  const pillTxt=wkPill(f.week);
  const rows=a=>a.map(s=>({text:s.text.replace(/^Layer (\d) · Refresh/,'Layer $1 · Rejuvenate'),sub:s.sub,star:/recipe on the back/i.test(s.sub)}));
  let bottom;
  if(f.checkin){
    bottom=`<div class="grid2" style="align-items:stretch"><div class="card"><div class="eyebrow ${Lw.cls}" style="margin-bottom:.3em">${esc(f._ckTitle||'My weekly check-in (1 to 5)')}</div>${S.scaleRows(f.checkin.items,{layer:Lw})}</div>
     <div class="card t${wn}"><div class="eyebrow ${Lw.cls}">What I liked most</div><p class="it txt sm" style="font-weight:700;margin-top:.5em;line-height:1.45">${esc(f.checkin.liked)}</p><div class="ln2" style="height:2em;border-bottom:1px solid rgba(255,255,255,.95);margin-top:.5em"></div><div style="height:2em;border-bottom:1px solid rgba(255,255,255,.95)"></div></div></div>`;
  }
  add(S.dayFront({layer:Lw,pillLabel:pillTxt,dayLabel:f.dayOf,num:f.num,title:f.title,subtitle:f.subtitle,
    morning:{time:f.mTime,rows:rows(f.morning)},night:{time:f.eTime,rows:rows(f.evening)},morningLabel:'Morning',nightLabel:'Evening',
    prepare:f.prepare,tip:f.tip,tipLabel:(f.tipLabel||'').replace(/^TODAY[’']S TIP$/,'Today’s tip').replace(/^TIP OF THE DAY$/,'Tip of the day'),bottomHtml:bottom}),
    {layer:Lw,bg:'soft',max:1.3,group:'cal-front'});
  const r=b.recipe;
  add(S.dayBack({layer:Lw,pillLabel:pillTxt,tagRight:b.label,num:f.num,title:b.spot,subtitle:b.title,cardName:r.name,warnLabel:r.cautionLabel,
    stats:r.stats.map(x=>[x.label,x.value]),eyebrowLabel:tcase(r.kind.replace(/^SPOTLIGHT/,'FEATURED')),
    recipe:{nome:r.name,ingredientes:r.ingredients,passos:r.steps,comoUsar:r.how,atencao:r.caution}}),
    {layer:Lw,bg:'soft',max:1.3,group:'cal-back'});
}
weekPage(9,1);for(let d=1;d<=7;d++)dayPages(d);
weekPage(24,2);for(let d=8;d<=14;d++)dayPages(d);
weekPage(39,3);for(let d=15;d<=21;d++)dayPages(d);

/* ===== 54-62 base recipes ===== */
for(let n=54;n<=62;n++){
  const L=SRC[n];const Lw=S.LAYERS[((n-54)%3)+1];const r=P.recipe(L,2);
  add(S.dayBack({layer:Lw,pillLabel:L[0].replace(/^BASE RECIPE/,'Base recipe').replace(/ OF /,' of '),tagRight:L[1],num:S.pad2(n-53),title:'Base recipe',subtitle:'',cardName:r.name,warnLabel:r.cautionLabel,
    stats:r.stats.map(x=>[x.label,x.value]),eyebrowLabel:'Base recipe',
    recipe:{nome:r.name,ingredientes:r.ingredients,passos:r.steps,comoUsar:r.how,atencao:r.caution}}),
    {layer:Lw,bg:'soft',max:1.3,group:'cal-base'});
}

/* ===== 63. final check-in ===== */
{const L=SRC[63];
 const hi=ix(L,/^HOW DOES MY SKIN/);
 const lab=L.filter(x=>/^\| (Softness|Glow|Comfort|Rested)/.test(x)).map(x=>x.split('|')[1].trim());
 const d1=ix(L,/^Day 1 notes$/);
 add(`<div class="eyebrow">${esc(L[0])}</div><h1 class="title">${esc(L[1])}</h1><p class="subtitle">${esc(L[2])}</p><div class="rule"></div>
  <div class="card" style="border-radius:30px;padding:1em 1.4em"><div class="eyebrow l3">${esc(L[hi])}</div><div class="gap s"></div>${S.scaleRows(lab,{layer:3,heads:['DAY 1','DAY 21']})}</div>
  <div class="gap"></div>
  <div class="grid2" style="gap:.9em">${S.dashBox({title:L[d1],hint:L[d1+1],h:'1.7in',layer:1,lines:1})}${S.dashBox({title:L[d1+2],hint:L[d1+3],h:'1.7in',layer:3,lines:1})}</div>
  <div class="gap"></div>
  <div class="card t2" style="border-radius:28px;padding:1em 1.4em"><div class="eyebrow l2">${esc(L[d1+4])}</div><div class="ln2" style="height:2em;border-bottom:1px solid rgba(255,255,255,.95)"></div><div style="height:2em;border-bottom:1px solid rgba(255,255,255,.95)"></div></div>
  <div class="gap"></div>
  <div class="card t3" style="border-radius:28px;padding:1em 1.4em"><div class="eyebrow l3">${esc(L[d1+5])}</div><div class="ln2" style="height:2em;border-bottom:1px solid rgba(255,255,255,.95)"></div><div style="height:2em;border-bottom:1px solid rgba(255,255,255,.95)"></div></div>`,
  {max:1.45,deco:[circ('6.3in','-1.2in',270,'blush',.7),S.sparkle({x:'7.4in',y:'.5in',size:26})]});}

/* ===== 64. forever ritual ===== */
{const L=SRC[64];
 const rows=L.filter(x=>/^\|/.test(x)&&!/^\|[-| ]+\|$/.test(x)).map(x=>x.split('|').slice(1,-1).map(s=>s.trim()));
 const wk=rows.filter(r=>/^(Mon|Tue|Wed|Thu|Fri|Sat|Sun)$/.test(r[0]));
 const ess=rows.filter(r=>!/^(Mon|Tue|Wed|Thu|Fri|Sat|Sun|Day|Ritual)$/.test(r[0]));
 const qi=ix(L,/^Want more recipes\?$/);const ei=ix(L,/^THE GUIDE/);
 const tone=[1,1,2,2,3,3,1];
 add(`<div class="eyebrow">${esc(L[0])}</div><h1 class="title">${esc(L[1].replace(/^# /,''))}</h1><p class="subtitle">${esc(L[2])}</p><div class="rule"></div>
  <div class="grid2" style="gap:.7em;align-items:start">${wk.map((r,i)=>S.dayChip({abbr:r[0],text:r[1],layer:[1,1,2,2,3,3,1][i]})).join('')}</div>
  <div class="gap"></div><div class="eyebrow">${esc(L[ei])}</div><div class="gap s"></div>
  <div class="grid3" style="gap:.6em">${ess.map((r,i)=>`<div class="card tight" style="border-radius:22px"><div style="width:1.1em;height:1.1em">${S.icon('star',S.LAYERS[[1,2,3,3,1,2][i]].color,'100%')}</div><div class="nm" style="margin-top:.3em">${esc(r[0])}</div><div class="muted txt xs" style="margin-top:.25em;line-height:1.3">${esc(r[1])}</div></div>`).join('')}</div>
  <div class="grow"></div>
  ${S.promoCard({title:L[qi],text:J(L.slice(qi+1)),layer:2,icon:'heart'})}`,
  {max:1.3,deco:[circ('6.3in','-1.2in',270,'mint',.7)]});}

/* ===== 65. back cover ===== */
{const L=SRC[65];
 const bi=ix(L,/^Korean Silk Method Planner$/),lg=L.slice(bi+2);
 add(`<div style="flex:1;display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center">
   <div style="width:64px;height:64px;margin-bottom:.35in">${S.icon('sparkle','#C9955F','100%')}</div>
   <h1 class="title" style="font-size:3.6em;margin:0">${esc(L[0])}</h1><h1 class="title plum" style="font-size:3.6em;margin:.05em 0 0">${esc(L[1])}</h1>
   <div class="rule" style="margin:1em auto"></div>
   <p style="font-weight:700;font-size:1.1em;max-width:4.8in;line-height:1.5">${esc(J(L.slice(2,bi)))}</p>
   <div style="height:.5in"></div>
   <div class="eyebrow">${esc(L[bi+1])}</div><h2 class="h2" style="margin-top:.2em">Korean Silk Method</h2><p class="subtitle" style="margin-top:.1em">21-Day Calendar</p>
   <div class="gap l"></div>
   ${lg.map(t=>`<p class="muted txt sm" style="max-width:5.4in;line-height:1.5;margin-top:.6em">${esc(t)}</p>`).join('')}
  </div>`,{bg:'cover',footer:false,fit:false,deco:[...S.backDeco.slice(0,4),S.sparkle({x:'1.1in',y:'1.6in',size:28}),S.sparkle({x:'6.9in',y:'1.2in',size:22}),S.sparkle({x:'1.0in',y:'9.6in',size:24,color:'#C8807C'})]});}

if(pages.length!==65)throw Error('expected 65 pages, got '+pages.length);

/* ===== report ===== */
{const byPage={};notes.forEach(n=>(byPage[n.page]=byPage[n.page]||[]).push(n));
 let r=`# REPORT: 21-day calendar (modeling notes removed from the e-book)\n\nSource: calendario-21-dias/calendario_en.md (${notes.length} \`[MODELING NOTE]\` lines across ${Object.keys(byPage).length} pages).\nThe e-book keeps the original 65-page structure (page N here = page N of the original, so the "(p. 54)" cross-references stay correct).\nNone of the notes below appear in the e-book text.\n\n`;
 for(const p of Object.keys(byPage).map(Number).sort((a,b)=>a-b)){r+=`## Page ${p}\n`;byPage[p].forEach(n=>{r+=`- After "${n.after}": ${n.note}\n`});r+='\n'}
 fs.writeFileSync(path.join(K.out,'REPORT_calendar.md'),r);}

K.finish({slug:'21-day-calendar',title:'Korean Silk Method · 21-Day Calendar',pages}).catch(e=>{console.error(e);process.exit(1)});
