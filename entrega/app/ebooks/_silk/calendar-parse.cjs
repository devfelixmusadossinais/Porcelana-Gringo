'use strict';
/* Parses PE/calendario-21-dias/calendario_en.md (pages marked <!-- p.N -->) into structured data.
   [MODELING NOTE: ...] lines are removed from the content and collected in .notes. */
const fs=require('fs'),path=require('path');
const SRC=path.resolve(__dirname,'..','..','..','calendario-21-dias','calendario_en.md');
const clean=s=>s.replace(/\[([^\]]*)\]\((https?:[^)]*)\)/g,'$1').replace(/\*\*/g,'').replace(/(^|\s)\*(\S[^*]*)\*/g,'$1$2').replace(/ /g,' ').replace(/[ \t]+$/,'');
function parse(){
  const raw=fs.readFileSync(SRC,'utf8').replace(/\r/g,'');
  const parts=raw.split(/<!-- p\.(\d+) -->/);
  const pages={},notes=[];
  for(let i=1;i<parts.length;i+=2){
    const n=+parts[i];let body=parts[i+1];
    const lines=[];let prev='';
    for(let l of body.split('\n')){
      const t=l.trim();
      if(!t)continue;
      if(/^\[MODELING NOTE:/.test(t)){notes.push({page:n,after:prev,note:t.replace(/^\[MODELING NOTE:\s*/,'').replace(/\]$/,'')});continue}
      lines.push(clean(t));prev=t.slice(0,70);
    }
    /* drop footer ("Korean Silk Method Planner|Calendar" + number) */
    while(lines.length&&(/^\d+$/.test(lines[lines.length-1])||/^Korean Silk Method (Planner|Calendar)$/.test(lines[lines.length-1])))lines.pop();
    pages[n]=lines;
  }
  return {pages,notes};
}
const idx=(a,re,from=0)=>{for(let i=from;i<a.length;i++)if(re.test(a[i]))return i;return -1};
const join=a=>a.join(' ').replace(/\s+/g,' ').trim();

/* ---- day front ---- */
function dayFront(L){
  const o={};
  o.week=L[0];o.dayOf=L[1];o.num=L[2];
  const mi=idx(L,/^MORNING$/,3);
  const head=L.slice(3,mi);
  /* title = first line + following lines that start lowercase; the rest is the subtitle */
  let t=[head[0]],j=1;while(j<head.length&&/^[a-z]/.test(head[j])){t.push(head[j]);j++}
  o.title=join(t);o.subtitle=join(head.slice(j));
  const m2=idx(L,/^MORNING$/,mi+2);     // second MORNING (card), first two are the two box labels
  const ev=idx(L,/^EVENING$/,m2+1);
  o.mTime=L[m2+1];
  const steps=(a)=>{const r=[];for(let i=0;i<a.length;i+=2)r.push({text:a[i],sub:a[i+1]||''});return r};
  o.morning=steps(L.slice(m2+2,ev));o._mOdd=(ev-(m2+2))%2;
  o.eTime=L[ev+1];
  let k=ev+2;
  const tipIdx=idx(L,/^(TODAY[’']S TIP|TIP OF THE DAY)$/,k);
  const chk=idx(L,/^MY WEEKLY CHECK-IN/,k);
  const endSteps=[tipIdx,chk].filter(x=>x>=0).sort((a,b)=>a-b)[0];
  let ev_lines=L.slice(k,endSteps);
  const pi=ev_lines.findIndex(x=>/^Prepare today:/.test(x));
  if(pi>=0){o.prepare=join(ev_lines.slice(pi)).replace(/^Prepare today:\s*/,'');ev_lines=ev_lines.slice(0,pi)}
  o.evening=steps(ev_lines);o._eOdd=ev_lines.length%2;
  if(chk>=0){
    o.checkin={items:[],liked:''};
    const w=idx(L,/^WHAT I LIKED MOST/,chk);
    const seg=L.slice(chk+1,w);
    for(let i=0;i<seg.length;i++)if(!/^[1-5]$/.test(seg[i]))o.checkin.items.push(seg[i]);
    o.checkin.liked=join(L.slice(w+1));
  }else{
    const h=idx(L,/^HOW I FELT TODAY/,tipIdx);
    o.tipLabel=L[tipIdx];o.tip=join(L.slice(tipIdx+1,h));
  }
  return o;
}
/* ---- day back / base recipe ---- */
function recipe(L,startIdx){
  const r={};
  const fi=idx(L,/^(FEATURED RECIPE|BASE RECIPE|SPOTLIGHT RECIPE|FEATURED CARE)$/,startIdx);
  r.kind=L[fi];
  const LABEL=/^(TIME|HOW OFTEN|STORAGE|USE BY|SHELF LIFE|TIMING)$/;
  const ing=idx(L,/^INGREDIENTS$/,fi),dir=idx(L,/^DIRECTIONS$/,ing),how=idx(L,/^How to use:/,dir),cau=idx(L,/^(Caution|Please note):/,how),notes=idx(L,/^MY NOTES/,cau);
  const first=idx(L,LABEL,fi+1);
  r.name=join(L.slice(fi+1,first));
  const stat=L.slice(first,ing);r.stats=[];
  let cur=null;for(const s of stat){if(LABEL.test(s)){cur={label:s,value:[]};r.stats.push(cur)}else if(cur)cur.value.push(s)}
  r.stats=r.stats.map(x=>({label:x.label,value:join(x.value)}));
  const Q=/^(\d|Up to|A (few|pinch|drop|splash|small|dash|bit|handful)|An? |¼|½|¾|Pinch|Few|Optional|About|Half|Several|Enough)/;
  const il=L.slice(ing+1,dir);r.ingredients=[];
  for(const s of il){if(Q.test(s)||!r.ingredients.length)r.ingredients.push(s);else{const last=r.ingredients[r.ingredients.length-1];r.ingredients[r.ingredients.length-1]=last+' '+s}}
  r.ingredients=r.ingredients.flatMap(x=>{const k=x.indexOf(' Clean, comfortably');return k>0?[x.slice(0,k),x.slice(k+1)]:[x]});
  const dl=L.slice(dir+1,how);r.steps=[];
  for(const s of dl){if(/^\d+$/.test(s))r.steps.push('');else r.steps[r.steps.length-1]=((r.steps[r.steps.length-1]||'')+' '+s).trim()}
  r.how=join(L.slice(how,cau)).replace(/^How to use:\s*/,'');
  r.cautionLabel=L[cau].match(/^(Caution|Please note):/)[1]+':';
  r.caution=join(L.slice(cau,notes)).replace(/^(Caution|Please note):\s*/,'');
  return r;
}
function dayBack(L){
  const fi=idx(L,/^(FEATURED RECIPE|BASE RECIPE|SPOTLIGHT RECIPE|FEATURED CARE)$/,4);
  const o={week:L[0],label:L[1],num:L[2],spot:L[3],title:join(L.slice(4,fi))};
  o.recipe=recipe(L,fi);return o;
}
function weekPage(L){
  const o={};
  o.header=L[0];o.name=L[1];o.sub=L[2];
  const need=idx(L,/^WHAT YOU[’']LL NEED/);const gl=idx(L,/^THE WEEK AT A GLANCE/);
  const txt=join(L.slice(3,need));
  const gm=txt.match(/^(This week[’']s goal:.*?)\s*((?:What )?[Yy]ou may notice:.*)$/);
  o.goal=gm?gm[1].replace(/^This week[’']s goal:\s*/,''):txt;o.notice=gm?gm[2].replace(/^(What )?[Yy]ou may notice:\s*/,''):'';
  o.needs=L.slice(need+1,gl);
  o.days=[];
  for(let i=gl+1;i<L.length;i++){const m=L[i].match(/^DAY (\d+)$/);if(m)o.days.push({n:+m[1],title:L[i+1]})}
  return o;
}
module.exports={parse,idx,join,dayFront,dayBack,weekPage,recipe};
