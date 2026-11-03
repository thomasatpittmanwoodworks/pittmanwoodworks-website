(function(){
  var mb=document.getElementById('menuBtn'),mn=document.getElementById('mnav');
  if(!mb||!mn)return;
  mb.addEventListener('click',function(){var o=mn.hidden;mn.hidden=!o;mb.setAttribute('aria-expanded',String(o));mb.textContent=o?'Close':'Menu'});
  mn.addEventListener('click',function(e){if(e.target.tagName==='A'){mn.hidden=true;mb.setAttribute('aria-expanded','false');mb.textContent='Menu'}});
})();
