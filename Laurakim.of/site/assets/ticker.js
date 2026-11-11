(function(){
  var tr=document.querySelector('.ticker-track');if(!tr)return;
  var pos=0,last=0,SPEED=0.05; // px/ms (~50px/s)
  function step(ts){
    var dt=last?Math.min(ts-last,50):16;last=ts;
    var one=tr.scrollWidth/4;
    pos+=dt*SPEED;if(pos>=one)pos-=one;
    tr.style.transform='translate3d('+(-pos)+'px,0,0)';
    requestAnimationFrame(step)}
  requestAnimationFrame(step);
})();
