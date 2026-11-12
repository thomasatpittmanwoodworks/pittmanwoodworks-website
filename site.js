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

  /* ===== content from the website admin (data/*.json) ===== */
  function esc(t){var d=document.createElement('div');d.textContent=t==null?'':String(t);return d.innerHTML}
  function img(p,w){return /^\//.test(p)?'/.netlify/images?url='+encodeURIComponent(p)+'&w='+w+'&q=80':p}
  function get(u){return fetch(u,{cache:'no-cache'}).then(function(r){if(!r.ok)throw 0;return r.json()})}
  var IND={healthcare:'Healthcare',education:'Education',restaurants:'Restaurant',offices:'Office',multifamily:'Multifamily','retail-automotive':'Retail & Auto'};

  /* site settings */
  get('/data/site.json').then(function(S){
    document.querySelectorAll('[data-site]').forEach(function(el){var v=S[el.getAttribute('data-site')];if(v)el.textContent=v});
    var tel=(S.phone||'').replace(/\D/g,'');
    if(tel){document.querySelectorAll('[data-site-tel],.mbar-call').forEach(function(a){a.href='tel:+1'+tel.slice(-10)});document.querySelectorAll('[data-site-tel]').forEach(function(a){a.textContent=S.phone})}
    if(S.email)document.querySelectorAll('[data-site-mail]').forEach(function(a){a.href='mailto:'+S.email;a.textContent=S.email});
    if(S.credentials&&S.credentials.length)document.querySelectorAll('[data-site-list=credentials]').forEach(function(el){el.innerHTML=S.credentials.map(esc).join('<br>')});
    if(S.hours){document.querySelectorAll('[data-site-hours]').forEach(function(el){el.hidden=false;el.innerHTML='<br>'+esc(S.hours)});document.querySelectorAll('[data-site-hours-row]').forEach(function(el){el.hidden=false})}
    var soc=[['linkedin','LinkedIn'],['facebook','Facebook'],['instagram','Instagram']].filter(function(x){return S[x[0]]});
    if(soc.length)document.querySelectorAll('[data-site-social]').forEach(function(el){el.innerHTML=soc.map(function(x){return '<a href="'+esc(S[x[0]])+'" target="_blank" rel="noopener">'+x[1]+'</a>'}).join('')});
    if(S.logo)document.querySelectorAll('[data-site-logo]').forEach(function(a){a.classList.add('has-logo');a.innerHTML='<img src="'+esc(img(S.logo,480))+'" alt="Pittman Woodworks" onerror="this.onerror=null;this.src=\''+esc(S.logo)+'\'">'});
    if(S.favicon){var l=document.querySelector('link[rel=icon]')||document.createElement('link');l.rel='icon';l.href=S.favicon;document.head.appendChild(l)}
    if(S.notice){var hd=document.querySelector('header.top');if(hd){var n=document.createElement('div');n.className='notice';n.innerHTML='<div class="wrap">'+esc(S.notice)+'</div>';hd.appendChild(n)}}
  }).catch(function(){});

  /* projects */
  var psec=document.querySelectorAll('[data-projects]');
  if(psec.length)get('/data/projects.json').then(function(D){
    var all=(D.projects||[]).filter(function(p){return p.title&&p.photos&&p.photos.length});
    psec.forEach(function(sec){
      var key=sec.getAttribute('data-projects'),list;
      if(key==='featured'){list=all.filter(function(p){return p.featured});if(!list.length)list=all.slice(0,3);list=list.slice(0,6)}
      else list=all.filter(function(p){return p.industry===key}).slice(0,6);
      if(!list.length)return;
      var g=sec.querySelector('[data-proj-grid]');
      g.innerHTML=list.map(function(p,i){var ph=p.photos[0],sub=[p.location,p.client].filter(Boolean).join(' · ');
        return '<button type="button" class="ph has-img" data-i="'+all.indexOf(p)+'" style="background-image:linear-gradient(180deg,rgba(15,20,25,0) 40%,rgba(15,20,25,.85)),url(\''+esc(img(ph,900))+'\')"><span class="tag">'+esc(IND[p.industry]||'Project')+'</span><b>'+esc(p.title)+'</b>'+(sub?'<span class="psub">'+esc(sub)+'</span>':'')+(p.photos.length>1?'<span class="pcount">'+p.photos.length+' photos</span>':'')+'</button>'}).join('');
      g.querySelectorAll('[data-i]').forEach(function(b){b.addEventListener('click',function(){lightbox(all[+b.getAttribute('data-i')])})});
      sec.hidden=false});
  }).catch(function(){});

  /* simple photo viewer */
  function lightbox(p){
    var i=0,lb=document.createElement('div');lb.className='lb';lb.setAttribute('role','dialog');lb.setAttribute('aria-modal','true');lb.setAttribute('aria-label',p.title);
    function draw(){lb.innerHTML='<button class="lb-x" type="button" aria-label="Close">Close</button><figure><img src="'+esc(img(p.photos[i],1800))+'" alt="'+esc(p.title)+'"><figcaption><b>'+esc(p.title)+'</b><span>'+esc([p.location,p.client,p.year].filter(Boolean).join(' · '))+'</span>'+(p.scope?'<span>'+esc(p.scope)+'</span>':'')+(p.photos.length>1?'<em>'+(i+1)+' / '+p.photos.length+'</em>':'')+'</figcaption></figure>'+(p.photos.length>1?'<button class="lb-p" type="button" aria-label="Previous photo">‹</button><button class="lb-n" type="button" aria-label="Next photo">›</button>':'');
      lb.querySelector('.lb-x').onclick=close;var pv=lb.querySelector('.lb-p'),nx=lb.querySelector('.lb-n');if(pv){pv.onclick=function(){i=(i-1+p.photos.length)%p.photos.length;draw()};nx.onclick=function(){i=(i+1)%p.photos.length;draw()}}
      lb.querySelector('.lb-x').focus()}
    function key(e){if(e.key==='Escape')close();if(p.photos.length>1&&e.key==='ArrowRight'){i=(i+1)%p.photos.length;draw()}if(p.photos.length>1&&e.key==='ArrowLeft'){i=(i-1+p.photos.length)%p.photos.length;draw()}}
    function close(){document.removeEventListener('keydown',key);lb.remove();document.body.style.overflow=''}
    lb.addEventListener('click',function(e){if(e.target===lb)close()});document.addEventListener('keydown',key);
    document.body.appendChild(lb);document.body.style.overflow='hidden';draw()}

  /* FAQ */
  var fq=document.querySelector('[data-faq]');
  if(fq)get('/data/faq.json').then(function(D){var q=(D.questions||[]).filter(function(x){return x.q});if(!q.length)return;
    fq.innerHTML=q.map(function(x,i){return '<details'+(i===0?' open':'')+'><summary>'+esc(x.q)+'</summary><p>'+esc(x.a)+'</p></details>'}).join('')}).catch(function(){});
})();
