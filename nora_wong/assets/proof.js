(function(){
  var t=document.querySelector('[data-igcar]');if(!t)return;
  var kids=Array.prototype.slice.call(t.children);
  kids.forEach(function(k){var c=k.cloneNode(true);c.setAttribute('aria-hidden','true');t.appendChild(c)});
  var pos=0,last=0,hold=false,tmr=null,SPEED=0.045; // px por ms (~45px/s)
  function stop(){hold=true;clearTimeout(tmr)}
  function go(d){clearTimeout(tmr);tmr=setTimeout(function(){pos=t.scrollLeft;hold=false},d)}
  ['touchstart','pointerdown','wheel'].forEach(function(e){t.addEventListener(e,stop,{passive:true})});
  ['touchend','touchcancel','pointerup','pointercancel'].forEach(function(e){t.addEventListener(e,function(){go(1800)},{passive:true})});
  t.addEventListener('wheel',function(){go(1800)},{passive:true});
  t.addEventListener('mouseenter',stop);t.addEventListener('mouseleave',function(){go(300)});
  // arrastar com o mouse (touch ja e nativo)
  var down=false,sx=0,sl=0;
  t.addEventListener('pointerdown',function(e){if(e.pointerType!=='mouse')return;down=true;sx=e.clientX;sl=t.scrollLeft;t.classList.add('drag');try{t.setPointerCapture(e.pointerId)}catch(_){}});
  t.addEventListener('pointermove',function(e){if(!down)return;t.scrollLeft=sl-(e.clientX-sx)});
  function up(){if(!down)return;down=false;t.classList.remove('drag');go(1800)}
  t.addEventListener('pointerup',up);t.addEventListener('pointercancel',up);
  function half(){return t.scrollWidth/2}
  function step(ts){
    var dt=last?Math.min(ts-last,50):16;last=ts;
    if(!hold){pos+=dt*SPEED;if(pos>=half())pos-=half();t.scrollLeft=pos}
    else{pos=t.scrollLeft;if(pos>=half()){pos-=half();t.scrollLeft=pos}}
    requestAnimationFrame(step)}
  requestAnimationFrame(step);
})();
