'use strict';
/* Shared helpers for the Silk e-book builders.
   const K=require('./kit.cjs'); const {D}=K.load({D:['desafio','DESAFIO'], R:['receitas','RECEITAS']});
   await K.finish({slug,title,pages});   // writes html, renders PDF + cover (1200 wide), prints page count */
const fs=require('fs'),path=require('path'),vm=require('vm');
const S=require('./components.js'),{render}=require('./chromium.cjs');
const root=path.resolve(__dirname,'..','..'),out=path.join(root,'ebooks');
function load(map){
  const ctx={};vm.createContext(ctx);const res={};
  for(const k in map){const [file,v]=map[k];vm.runInContext(fs.readFileSync(path.join(root,'data',file+'.js'),'utf8'),ctx,{filename:file+'.js'});vm.runInContext('this.__x='+v,ctx);res[k]=ctx.__x}
  return res;
}
async function finish({slug,title,pages}){
  const html=S.document({title,pages});
  const file=path.join(out,slug+'.html');fs.writeFileSync(file,html);
  fs.mkdirSync(path.join(out,'covers'),{recursive:true});
  const r=await render({html:file,pdf:path.join(out,slug+'.pdf'),fit:true,shot:{selector:'.page',index:0,out:path.join(out,'covers',slug+'.png'),width:1200}});
  console.log(slug,'pages',r.pages,'still overflowing:',r.overflow);
  return r;
}
const lay=s=>String(s==null?'':s).replace(/\bRefresh\b/g,'Rejuvenate');
module.exports={S,root,out,load,finish,lay};
