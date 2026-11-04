(function(){
  var reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
  /* mobile menu */
  var mb=document.getElementById('menuBtn'),mn=document.getElementById('mnav');
  if(mb&&mn){
    mb.addEventListener('click',function(){var o=mn.hidden;mn.hidden=!o;mb.setAttribute('aria-expanded',String(o));mb.textContent=o?'Close':'Menu'});
    mn.addEventListener('click',function(e){if(e.target.tagName==='A'){mn.hidden=true;mb.setAttribute('aria-expanded','false');mb.textContent='Menu'}});
  }
  /* mobile action bar: Call + Request a bid */
  var onBid=/^\/bidding/.test(location.pathname);
  var bar=document.createElement('nav');bar.className='mbar';bar.setAttribute('aria-label','Quick actions');
  bar.innerHTML='<a class="mbar-call" href="tel:+14693750495"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6.6 10.8a15.1 15.1 0 0 0 6.6 6.6l2.2-2.2a1 1 0 0 1 1-.25 11.4 11.4 0 0 0 3.6.57 1 1 0 0 1 1 1V20a1 1 0 0 1-1 1A17 17 0 0 1 3 4a1 1 0 0 1 1-1h3.5a1 1 0 0 1 1 1c0 1.25.2 2.45.57 3.6a1 1 0 0 1-.25 1z"/></svg>Call</a>'+
    '<a class="mbar-bid" href="'+(onBid?'#bid':'/bidding#bid')+'">Request a bid</a>';
  document.body.appendChild(bar);document.body.classList.add('has-mbar');
  /* tuck the bar away while typing, so it never covers a form */
  document.addEventListener('focusin',function(e){if(e.target.matches('input,textarea,select'))bar.classList.add('away')});
  document.addEventListener('focusout',function(){setTimeout(function(){if(!document.activeElement||!document.activeElement.matches('input,textarea,select'))bar.classList.remove('away')},50)});

  /* shared form feedback */
  window.PW={
    show:function(el,ok,msg){
      el.hidden=false;el.style.borderColor=el.style.color='';
      el.classList.remove('ok','err');void el.offsetWidth;el.classList.add(ok?'ok':'err');
      el.innerHTML=(ok?'<svg class="chk" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="10"/><path d="M7.5 12.5l3 3 6-6.5"/></svg>':'<svg class="xmk" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="10"/><path d="M12 7.5v6M12 16.5v.01"/></svg>')+'<span></span>';
      el.lastChild.textContent=msg;el.setAttribute('role',ok?'status':'alert');
      try{el.scrollIntoView({block:'nearest',behavior:reduce?'auto':'smooth'})}catch(x){}
    },
    busy:function(btn,on){btn.classList.toggle('busy',on)},
    got:function(el){el.classList.remove('got');void el.offsetWidth;el.classList.add('got')}
  };
  /* pulse file drop zones when a file is chosen */
  document.querySelectorAll('.drop input[type=file],.filebox input[type=file]').forEach(function(inp){
    inp.addEventListener('change',function(){if(inp.files&&inp.files.length)PW.got(inp.closest('.drop,.filebox'))})});
  document.querySelectorAll('.drop').forEach(function(d){d.addEventListener('drop',function(){setTimeout(function(){PW.got(d)},0)})});
})();
