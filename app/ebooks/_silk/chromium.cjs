'use strict';
/* Chrome headless via DevTools (no dependencies). Used by build scripts to
   (1) auto-fit pages, (2) print the PDF, (3) screenshot the cover.
   const {render}=require('./_silk/chromium.cjs');
   await render({html:'/abs/file.html', pdf:'/abs/out.pdf', shot:{selector:'.page', out:'/abs/cover.png', width:1200}, fit:true})
   fit:true -> adds .fit-N classes to overflowing pages and re-saves the HTML (the saved file is static).
   Returns {pages, overflow:[page numbers that still overflow]}.                                  */
const fs=require('fs'),os=require('os'),path=require('path'),{spawn}=require('child_process'),{pathToFileURL}=require('url');
const pause=ms=>new Promise(r=>setTimeout(r,ms));
async function launch(){
  const exe=process.env.SILK_CHROME||'C:/Program Files/Google/Chrome/Application/chrome.exe';
  const profile=fs.mkdtempSync(path.join(os.tmpdir(),'silk-chrome-'));
  const child=spawn(exe,['--headless=new','--disable-gpu','--no-first-run','--no-default-browser-check','--disable-extensions','--allow-file-access-from-files','--remote-debugging-port=0',`--user-data-dir=${profile}`,'about:blank'],{stdio:'ignore',windowsHide:true});
  const pf=path.join(profile,'DevToolsActivePort');
  for(let i=0;i<150&&!fs.existsSync(pf);i++)await pause(100);
  if(!fs.existsSync(pf))throw Error('Chrome did not expose DevTools');
  const port=fs.readFileSync(pf,'utf8').split(/\r?\n/)[0];
  const targets=await(await fetch(`http://127.0.0.1:${port}/json/list`)).json();
  const ws=new WebSocket(targets.find(x=>x.type==='page').webSocketDebuggerUrl);
  await new Promise((res,rej)=>{ws.onopen=res;ws.onerror=rej});
  let seq=0;const pending=new Map();
  ws.onmessage=ev=>{const m=JSON.parse(ev.data);if(m.id&&pending.has(m.id)){const p=pending.get(m.id);clearTimeout(p.t);pending.delete(m.id);m.error?p.rej(Error(JSON.stringify(m.error))):p.res(m.result)}};
  const send=(method,params={})=>new Promise((res,rej)=>{const id=++seq,t=setTimeout(()=>{pending.delete(id);rej(Error('CDP timeout '+method))},120000);pending.set(id,{res,rej,t});ws.send(JSON.stringify({id,method,params}))});
  const evaluate=async expr=>{const r=await send('Runtime.evaluate',{expression:expr,awaitPromise:true,returnByValue:true});if(r.exceptionDetails)throw Error(r.exceptionDetails.text+' '+JSON.stringify(r.exceptionDetails.exception));return r.result.value};
  const close=async()=>{try{await send('Browser.close')}catch{}try{ws.close()}catch{}for(let i=0;i<40&&child.exitCode===null;i++)await pause(100);if(child.exitCode===null)child.kill();await pause(300);try{fs.rmSync(profile,{recursive:true,force:true,maxRetries:5,retryDelay:300})}catch{}};
  return {send,evaluate,close};
}
const FIT=`(async()=>{
  await document.fonts.ready;
  if(window.innerWidth<=720)throw new Error('fit must run at the 816px print viewport, not in mobile mode');
  const st=document.createElement('style');st.textContent='.pg.measure .grow{flex:none!important;height:0!important}';document.head.appendChild(st);
  const out=[];
  const pages=[...document.querySelectorAll('.page:not(.nofit)')];
  const need=(pg,f)=>{pg.style.setProperty('--fit',f);const b=pg.querySelector('.pg');b.classList.add('measure');
    const last=b.lastElementChild;const sh=b.scrollHeight;const h=b.clientHeight;const r=sh>h+1?sh:last.offsetTop+last.offsetHeight;b.classList.remove('measure');return {bottom:r,h,sh}};
  pages.forEach((pg,i)=>{
    const max=parseFloat(pg.dataset.max||'1.45');
    let f=1;let n=need(pg,f);
    if(n.bottom>n.h+1){while(f>0.7&&need(pg,f).bottom>n.h+1)f=Math.round((f-0.02)*100)/100}
    else{while(f<max){const t=Math.round((f+0.02)*100)/100;const m=need(pg,t);if(m.bottom>m.h-26)break;f=t}}
    pg.style.setProperty('--fit',f);pg._f=f;
  });
  const mins={};pages.forEach(pg=>{const g=pg.dataset.group;if(g)mins[g]=Math.min(mins[g]||9,pg._f)});
  pages.forEach((pg,i)=>{const g=pg.dataset.group;if(g)pg.style.setProperty('--fit',Math.min(pg._f,Math.round((mins[g]+0.1)*100)/100));const n=need(pg,parseFloat(pg.style.getPropertyValue('--fit')));if(n.bottom>n.h+1)out.push(i+1)});
  return {pages:document.querySelectorAll('.page').length,overflow:out,html:'<!doctype html>'+String.fromCharCode(10)+document.documentElement.outerHTML};
})()`;
async function render(o){
  const b=await launch();let result={};
  try{
    await b.send('Page.enable');
    await b.send('Emulation.setDeviceMetricsOverride',{width:816,height:1056,deviceScaleFactor:1,mobile:false});
    await b.send('Page.navigate',{url:pathToFileURL(o.html).href});
    await pause(800);
    await b.evaluate('document.fonts.ready.then(()=>true)');
    if(o.fit){const r=await b.evaluate(FIT);fs.writeFileSync(o.html,r.html);result={pages:r.pages,overflow:r.overflow};
      await b.send('Page.navigate',{url:pathToFileURL(o.html).href});await pause(800);await b.evaluate('document.fonts.ready.then(()=>true)')}
    if(o.pdf){const r=await b.send('Page.printToPDF',{printBackground:true,preferCSSPageSize:true,displayHeaderFooter:false});fs.writeFileSync(o.pdf,Buffer.from(r.data,'base64'))}
    if(o.shot){const w=o.shot.width||1200;const scale=w/816;
      const rect=await b.evaluate(`(()=>{const e=document.querySelectorAll('${o.shot.selector||'.page'}')[${o.shot.index||0}];const r=e.getBoundingClientRect();return {x:r.x+scrollX,y:r.y+scrollY,w:r.width,h:r.height}})()`);
      const r=await b.send('Page.captureScreenshot',{format:'png',clip:{x:rect.x,y:rect.y,width:rect.w,height:rect.h,scale},captureBeyondViewport:true});
      fs.writeFileSync(o.shot.out,Buffer.from(r.data,'base64'))}
  } finally {await b.close()}
  return result;
}
module.exports={render,launch,pause};
