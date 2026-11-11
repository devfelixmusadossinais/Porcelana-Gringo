(function(){
  var KEY='ksm_offer_end',DUR=10*60*1000;
  function end(){var e=0;try{e=+sessionStorage.getItem(KEY)||0}catch(_){}
    if(!e||e<Date.now()){e=Date.now()+DUR;try{sessionStorage.setItem(KEY,e)}catch(_){}}return e}
  var e=end();
  function tick(){
    var r=e-Date.now();if(r<=0){e=end();r=e-Date.now()}
    var m=Math.floor(r/60000),s=Math.floor(r/1000)%60,t=(m<10?'0':'')+m+':'+(s<10?'0':'')+s;
    var n=document.querySelectorAll('[data-otimer] [data-t]');for(var i=0;i<n.length;i++)n[i].textContent=t}
  tick();setInterval(tick,1000)
})();
