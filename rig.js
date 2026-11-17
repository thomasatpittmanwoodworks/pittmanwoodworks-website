/* Homepage hero: "From drawing to install" animated casework scene.
   Draws a breakroom run in axonometric view through four stages: drawn, cut, built, installed. */
(function(){
var rig=document.getElementById('rig');if(!rig)return;
var reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
var A=14*Math.PI/180,B=40*Math.PI/180,ca=Math.cos(A),sa=Math.sin(A),cb=Math.cos(B),sb=Math.sin(B);
function P(x,y,z){return [x*ca-z*cb, x*sa+z*sb-y]}
var BB={x0:1e9,y0:1e9,x1:-1e9,y1:-1e9};
function grow(q){BB.x0=Math.min(BB.x0,q[0]);BB.x1=Math.max(BB.x1,q[0]);BB.y0=Math.min(BB.y0,q[1]);BB.y1=Math.max(BB.y1,q[1])}
function f(n){return n.toFixed(2)}
function pts(a,track){return a.map(function(p){var q=P(p[0],p[1],p[2]);if(track!==false)grow(q);return f(q[0])+','+f(q[1])}).join(' ')}
function d(a,close,track){return 'M'+pts(a,track).split(' ').join('L')+(close?'Z':'')}
function poly(a,cls,fill){return '<polygon class="'+cls+'" points="'+pts(a)+'"'+(fill?' style="fill:'+fill+'"':'')+'/>'}
function wire(a,close,cls){return '<path pathLength="1" class="'+(cls||'')+'" d="'+d(a,close)+'"/>'}
/* faces of a box */
function faces(x,y,z,w,h,dp){var X=x+w,Y=y+h,Z=z+dp;return{
  front:[[x,y,Z],[X,y,Z],[X,Y,Z],[x,Y,Z]],top:[[x,Y,z],[X,Y,z],[X,Y,Z],[x,Y,Z]],side:[[X,y,z],[X,y,Z],[X,Y,Z],[X,Y,z]]}}
function rect(x0,y0,x1,y1,z){return [[x0,y0,z],[x1,y0,z],[x1,y1,z],[x0,y1,z]]}

/* ---------- the run ---------- */
var CABS=[
 {t:'u2',x:0,w:36,y:54,h:30,z:0,d:12,up:1},{t:'u2',x:36,w:36,y:54,h:30,z:0,d:12,up:1},{t:'u2',x:72,w:36,y:54,h:30,z:0,d:12,up:1},
 {t:'db',x:0,w:18,y:4,h:30.5,z:0,d:24},{t:'sb',x:18,w:36,y:4,h:30.5,z:0,d:24},{t:'b1',x:54,w:24,y:4,h:30.5,z:0,d:24},{t:'b2',x:78,w:30,y:4,h:30.5,z:0,d:24}];
function fronts(c){var g=.3,x0=c.x+g,x1=c.x+c.w-g,y0=c.y+g,y1=c.y+c.h-g,mid=(x0+x1)/2,o=[];
  function door(a,b,lo,hi,pull){o.push({r:[a,lo,b,hi],k:'door',pull:pull})}
  function drw(lo,hi,pull){o.push({r:[x0,lo,x1,hi],k:'drawer',pull:pull===false?0:'h'})}
  var top=y1-6;
  if(c.t==='u2'){door(x0,mid-g/2,y0,y1,'rb');door(mid+g/2,x1,y0,y1,'lb')}
  else if(c.t==='db'){var r=(top-g-y0)/2;drw(top,y1);drw(y0+r+g/2,top-g/2);drw(y0,y0+r-g/2)}
  else if(c.t==='sb'){drw(top,y1,false);door(x0,mid-g/2,y0,top-g,'rt');door(mid+g/2,x1,y0,top-g,'lt')}
  else if(c.t==='b1'){drw(top,y1);door(x0,x1,y0,top-g,'lt')}
  else if(c.t==='b2'){drw(top,y1);door(x0,mid-g/2,y0,top-g,'rt');door(mid+g/2,x1,y0,top-g,'lt')}
  return o}
function pull(fr,z){var r=fr.r,L,a,b;z+=.7;
  if(fr.pull==='h'){L=Math.min((r[2]-r[0])*.38,9);var cx=(r[0]+r[2])/2,cy=r[3]-2.6;a=[cx-L/2,cy,z];b=[cx+L/2,cy,z]}
  else{L=6;var px=fr.pull[0]==='r'?r[2]-1.8:r[0]+1.8,top=fr.pull[1]==='t';var y0=top?r[3]-2.2-L:r[1]+2.2;a=[px,y0,z];b=[px,y0+L,z]}
  return [a,b]}

var room='',cabs='',counter='',dims='',cnc='';
/* room: wall + floor */
room+=poly([[-8,0,0],[116,0,0],[116,96,0],[-8,96,0]],'wall');
room+=poly([[-8,0,0],[116,0,0],[116,0,40],[-8,0,40]],'floor');
var grid='';for(var gx=0;gx<=112;gx+=8)grid+=wire([[gx,0,0],[gx,96,0]],false,'gl');for(var gy=8;gy<=96;gy+=8)grid+=wire([[-8,gy,0],[116,gy,0]],false,'gl');
room+='<g class="grid">'+grid+'</g>';
/* cabinets: uppers first, then bases (painter's order) */
CABS.forEach(function(c,i){var F=faces(c.x,c.y,c.z,c.w,c.h,c.d),Z=c.z+c.d,fill='',w='';
  var fc=c.up?'var(--rg-up)':'var(--rg-base)';
  fill+=poly(F.side,'f-side')+poly(F.top,'f-top'+(c.up?'':' f-btop'))+poly(F.front,'f-box');
  if(!c.up){var T=faces(c.x,0,0,c.w,4,c.d-3);fill+=poly(T.front,'f-toe')+poly(T.side,'f-toe2')}
  w+=wire(F.front,true)+wire(F.side,true)+wire(F.top,true);
  fronts(c).forEach(function(fr){var R=rect(fr.r[0],fr.r[1],fr.r[2],fr.r[3],Z+.05);fill+='<polygon class="f-door" points="'+pts(R)+'" style="fill:'+fc+'"/>';w+=wire(R,true);
    if(fr.pull){var p=pull(fr,Z);fill+='<path class="f-pull" d="'+d(p)+'"/>';w+=wire(p,false,'wp')}});
  cabs+='<g class="cab'+(c.up?' up':'')+'" style="--i:'+(c.up?i+4:i-3)+'"><g class="fill">'+fill+'</g><g class="wire">'+w+'</g></g>'});
/* countertop + backsplash */
var C=faces(0,34.5,0,108.5,1.5,25.25),S=faces(0,36,0,108,4,.75);
counter+='<g class="fill">'+poly(C.top,'f-qtop')+poly(C.side,'f-qedge2')+poly(C.front,'f-qedge')+poly(S.front,'f-qedge')+poly(S.top,'f-qtop')+
  '<path class="vein" d="'+d([[10,36,4],[34,36,19],[52,36,14]])+'"/><path class="vein" d="'+d([[60,36,22],[83,36,8],[101,36,13]])+'"/><path class="vein" d="'+d([[40,36,3],[58,36,10]])+'"/>'+
  /* sink */'<polygon class="f-sink" points="'+pts([[25,36.03,5],[47,36.03,5],[47,36.03,17],[25,36.03,17]])+'"/></g>';
counter+='<g class="wire">'+wire(C.top,true)+wire(C.front,true)+wire(C.side,true)+'</g>';
/* faucet */
counter+='<g class="fill"><path class="f-faucet" d="'+d([[36,36,3],[36,46,3],[36,46,8],[36,44,8]])+'"/></g>';
/* dimensions */
function dimLine(a,b,lab,off,anchor){var p=P.apply(null,a),q=P.apply(null,b),mx=(p[0]+q[0])/2+(off?off[0]:0),my=(p[1]+q[1])/2+(off?off[1]:0);grow(p);grow(q);
  return '<path class="dl" pathLength="1" d="M'+f(p[0])+' '+f(p[1])+'L'+f(q[0])+' '+f(q[1])+'"/><circle class="dt" cx="'+f(p[0])+'" cy="'+f(p[1])+'" r=".9"/><circle class="dt" cx="'+f(q[0])+'" cy="'+f(q[1])+'" r=".9"/><text class="dx" x="'+f(mx)+'" y="'+f(my)+'" text-anchor="'+(anchor||'middle')+'">'+lab+'</text>'}
dims+=dimLine([0,90,0],[108,90,0],'108″',[0,-2.4]);
dims+=dimLine([114,4,24],[114,34.5,24],'34½″',[3,1],'start');
dims+=dimLine([114,36,4],[114,54,4],'18″',[3,1],'start');
dims+=dimLine([-4,54,12],[-4,84,12],'30″',[-3,1],'end');
var lab1=P(0,50,12),lab2=P(0,-6,24);
dims+='<text class="dn" x="'+f(lab1[0])+'" y="'+f(lab1[1])+'">UPPERS · 12″ DEEP · ¾″ BOX</text><text class="dn" x="'+f(lab2[0])+'" y="'+f(lab2[1]+3)+'">BASES · 24″ DEEP · SOFT-CLOSE</text>';
grow(P(0,-6,24));grow([lab2[0],lab2[1]+5]);

/* ---------- CNC sheet (same projection, lying flat) ---------- */
var SH={x:0,z:0,w:97,d:49,y:20},PARTS=[[1,1,31.5,24.25,'SIDE'],[32.5,1,63,24.25,'SIDE'],[64,1,94.5,24.25,'SIDE'],[1,25.25,36,48,'BOTTOM'],[37,25.25,72,48,'BOTTOM'],[73,25.25,96,48,'SHELF']];
var shPts=[[SH.x,SH.y,SH.z],[SH.x+SH.w,SH.y,SH.z],[SH.x+SH.w,SH.y,SH.z+SH.d],[SH.x,SH.y,SH.z+SH.d]];
var sb0={x0:1e9,y0:1e9,x1:-1e9,y1:-1e9};shPts.forEach(function(p){var q=P(p[0],p[1],p[2]);sb0.x0=Math.min(sb0.x0,q[0]);sb0.x1=Math.max(sb0.x1,q[0]);sb0.y0=Math.min(sb0.y0,q[1]);sb0.y1=Math.max(sb0.y1,q[1])});
var tx=(BB.x0+BB.x1)/2-(sb0.x0+sb0.x1)/2,ty=(BB.y0+BB.y1)/2-(sb0.y0+sb0.y1)/2+4;
var thick=faces(SH.x,SH.y-.75,SH.z,SH.w,.75,SH.d);
var scx=(sb0.x0+sb0.x1)/2,scy=(sb0.y0+sb0.y1)/2;cnc+='<g transform="translate('+f(tx+scx)+' '+f(ty+scy)+') scale(1.32) translate('+f(-scx)+' '+f(-scy)+')">'+poly(thick.front,'c-edge')+poly(thick.side,'c-edge2')+'<polygon class="c-sheet" points="'+pts(shPts,false)+'"/>';
var ROUTE=[];
PARTS.forEach(function(p,i){var R=[[p[0],SH.y,p[1]],[p[2],SH.y,p[1]],[p[2],SH.y,p[3]],[p[0],SH.y,p[3]]],q=R.map(function(r){return P(r[0],r[1],r[2])});ROUTE.push(q);
  var c=P((p[0]+p[2])/2,SH.y,(p[1]+p[3])/2);
  cnc+='<polygon class="c-part" id="cp'+i+'" points="'+q.map(function(v){return f(v[0])+','+f(v[1])}).join(' ')+'"/><path class="c-cut" id="cc'+i+'" pathLength="1" d="M'+q.map(function(v){return f(v[0])+' '+f(v[1])}).join('L')+'Z"/><text class="c-lab" x="'+f(c[0])+'" y="'+f(c[1]+1.2)+'" text-anchor="middle">'+p[4]+'</text>'});
cnc+='<g id="bit"><line class="c-spindle" x1="0" y1="0" x2="0" y2="-16"/><rect class="c-head" x="-3.2" y="-24" width="6.4" height="8" rx="1"/><circle class="c-glow" r="3.4"/><circle class="c-tip" r="1.1"/></g></g>';

var pad=7,vb=[BB.x0-pad,BB.y0-pad,BB.x1-BB.x0+pad*2,BB.y1-BB.y0+pad*2];
rig.querySelector('.rg-stage').innerHTML='<svg class="rg-svg" viewBox="'+vb.map(f).join(' ')+'" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="A breakroom casework run shown as it moves from shop drawing to CNC cutting, assembly and installation">'+
  '<g class="L-room">'+room+'</g><g class="L-cabs">'+cabs+'</g><g class="L-counter">'+counter+'</g><g class="L-dims">'+dims+'</g><g class="L-cnc">'+cnc+'</g></svg>';

/* ---------- stages ---------- */
var STAGES=[
 {n:'Drawn',dur:4600,tb:['Breakroom run · Elev. A','01 · Shop drawing','A-201','Approved for fabrication']},
 {n:'Cut',dur:4800,tb:['Sheet 3 of 14 · ¾″ TFM','02 · CNC machining','N-03','Parts cut 0 of 6']},
 {n:'Built',dur:4200,tb:['7 cabinet boxes','03 · Assembly','QC-07','Inspected · square ±1/32″']},
 {n:'Installed',dur:6000,tb:['Breakroom run · Level 2','04 · Installed','Punch','0 open items']}];
var steps=rig.querySelector('.rg-steps'),tb=rig.querySelectorAll('.rg-tb strong'),cur=-1,raf=0;
steps.innerHTML=STAGES.map(function(s,i){return '<button type="button" data-i="'+i+'" aria-pressed="false"><span class="n">0'+(i+1)+'</span><span class="t">'+s.n+'</span><i style="--dur:'+s.dur+'ms"></i></button>'}).join('');
function setTB(arr){arr.forEach(function(v,k){tb[k].textContent=v})}
function go(i){cur=i;rig.setAttribute('data-stage',i+1);
  steps.querySelectorAll('button').forEach(function(b,k){b.setAttribute('aria-pressed',k===i);b.classList.toggle('done',k<i);var bar=b.querySelector('i');bar.style.animation='none';void bar.offsetWidth;bar.style.animation=''});
  setTB(STAGES[i].tb);cancelAnimationFrame(raf);
  if(i===1)runCNC();}
steps.addEventListener('click',function(e){var b=e.target.closest('button');if(b)go(+b.dataset.i)});
steps.addEventListener('animationend',function(e){if(e.target.tagName==='I'&&!reduce)go((cur+1)%STAGES.length)});
/* CNC router */
function runCNC(){var bit=document.getElementById('bit'),t0=performance.now(),per=reduce?0:620,done=-1;
  for(var k=0;k<PARTS.length;k++){document.getElementById('cp'+k).classList.remove('cut');document.getElementById('cc'+k).style.strokeDashoffset=1}
  function at(q,t){var L=[],tot=0;for(var j=0;j<4;j++){var a=q[j],b=q[(j+1)%4],l=Math.hypot(b[0]-a[0],b[1]-a[1]);L.push(l);tot+=l}var s=t*tot;for(j=0;j<4;j++){if(s<=L[j]){var a2=q[j],b2=q[(j+1)%4],u=s/L[j];return [a2[0]+(b2[0]-a2[0])*u,a2[1]+(b2[1]-a2[1])*u]}s-=L[j]}return q[0]}
  function tick(now){var e=now-t0,pi=per?Math.min(PARTS.length-1,Math.floor(e/per)):PARTS.length-1,t=per?Math.min(1,(e-pi*per)/(per*.86)):1;
    for(var k=0;k<pi;k++)if(!document.getElementById('cp'+k).classList.contains('cut')){document.getElementById('cp'+k).classList.add('cut');document.getElementById('cc'+k).style.strokeDashoffset=0}
    document.getElementById('cc'+pi).style.strokeDashoffset=1-t;var p=at(ROUTE[pi],t);bit.setAttribute('transform','translate('+f(p[0])+' '+f(p[1])+')');
    var n=pi+(t>=1?1:0);if(t>=1)document.getElementById('cp'+pi).classList.add('cut');if(n!==done){done=n;tb[3].textContent='Parts cut '+n+' of '+PARTS.length}
    if(cur===1&&n<PARTS.length)raf=requestAnimationFrame(tick)}
  raf=requestAnimationFrame(tick)}
/* pause when off screen */
if('IntersectionObserver' in window)new IntersectionObserver(function(en){rig.classList.toggle('off',!en[0].isIntersecting)},{threshold:.15}).observe(rig);
/* subtle tilt */
var svg=rig.querySelector('.rg-svg');
if(!reduce&&matchMedia('(hover:hover)').matches){rig.addEventListener('pointermove',function(e){var r=rig.getBoundingClientRect(),x=(e.clientX-r.left)/r.width-.5,y=(e.clientY-r.top)/r.height-.5;svg.style.transform='perspective(1400px) rotateY('+(x*5).toFixed(2)+'deg) rotateX('+(-y*4).toFixed(2)+'deg)'});
  rig.addEventListener('pointerleave',function(){svg.style.transform=''})}
if(reduce)rig.classList.add('still');
go(reduce?3:0);
})();
