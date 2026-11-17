/* The Home Collection by Pittman Woodworks: shared store logic for the demo.
   Products, prices and policies are placeholders. */
(function(){
var BASE='/residential-demo';
/* ---------- catalog ---------- */
var FIN=[{id:'white',name:'Chalk White',c:'#F1EEE6',e:'#D6D0C2'},{id:'sage',name:'Sage',c:'#A7B29B',e:'#8B977F'},{id:'navy',name:'Harbor Navy',c:'#2C3B57',e:'#1E2A40'},{id:'char',name:'Charcoal',c:'#3E4042',e:'#2B2D2F'},{id:'oak',name:'Natural Oak',c:'#CDA676',e:'#B48A58',wood:1}];
var STY=[{id:'shaker',name:'Shaker',rail:2.4,d:'The classic five-piece door with a recessed center panel. At home in almost any kitchen.'},{id:'slim',name:'Slim Shaker',rail:1,d:'A thin frame for a cleaner, modern take on Shaker.'},{id:'slab',name:'Slab',rail:0,d:'Flat, minimal fronts for modern and European-style kitchens.'}];
var FM={white:1,sage:1.04,navy:1.04,char:1.04,oak:1.18},SM={shaker:1,slim:1.03,slab:.94};
var W9=[9,12,15,18,21,24,27,30,33,36];
var CAT=[
 {id:'B',cat:'base',rooms:['kitchen','laundry'],name:'Base cabinet',desc:'One drawer over one or two doors, with an adjustable shelf. The workhorse of every kitchen.',ws:W9,hs:[34.5],d:24,p:function(w){return 145+7.6*w},asm:45,feat:['drawers'],pop:1},
 {id:'DB3',cat:'base',rooms:['kitchen','laundry'],name:'3-drawer base',desc:'Three full-extension, soft-close drawers sized for pots, pans and utensils.',ws:[12,15,18,21,24,30,36],hs:[34.5],d:24,p:function(w){return 215+9.4*w},asm:55,feat:['drawers'],pop:2},
 {id:'SB',cat:'base',rooms:['kitchen','laundry'],name:'Sink base',desc:'Open interior behind a false drawer front, ready for plumbing and a garbage disposal.',ws:[30,33,36],hs:[34.5],d:24,p:function(w){return 150+6.2*w},asm:45,feat:['appliance'],pop:3},
 {id:'TPO',cat:'base',rooms:['kitchen'],name:'Trash pull-out base',desc:'A full-height pull-out with two bins for trash and recycling, on soft-close slides.',ws:[15,18],hs:[34.5],d:24,p:function(w){return 330+8*w},asm:55,feat:['drawers'],pop:8,tag:'Organizer'},
 {id:'LS',cat:'base',rooms:['kitchen'],name:'Lazy Susan corner',desc:'A corner base with a two-tier rotating shelf, so nothing gets lost in the corner.',ws:[36],hs:[34.5],d:24,p:function(){return 545},asm:65,feat:['corner'],pop:9},
 {id:'BBC',cat:'base',rooms:['kitchen'],name:'Blind corner base',desc:'Turns an L-shaped corner using the space behind the neighboring cabinet.',ws:[39,42],hs:[34.5],d:24,p:function(w){return 250+7*w},asm:55,feat:['corner'],pop:12},
 {id:'W',cat:'wall',rooms:['kitchen','laundry'],name:'Wall cabinet',desc:'One or two doors with adjustable shelves. Choose the height that suits your ceiling.',ws:W9,hs:[30,36,42],d:12,p:function(w,h){return 92+5.3*w+(h-30)*4.5},asm:35,feat:[],pop:4},
 {id:'WMW',cat:'wall',rooms:['kitchen'],name:'Microwave wall cabinet',desc:'An open bottom shelf sized for a countertop microwave, with doors above.',ws:[24,30],hs:[36,42],d:12,p:function(w,h){return 190+5*w+(h-36)*4},asm:40,feat:['appliance'],pop:10},
 {id:'P',cat:'tall',rooms:['kitchen','laundry'],name:'Pantry cabinet',desc:'Floor-to-ceiling storage with adjustable shelves behind two sets of doors.',ws:[18,24,30],hs:[84,90,96],d:24,p:function(w,h){return 420+12.5*w+(h-84)*6},asm:75,feat:[],pop:5},
 {id:'OV',cat:'tall',rooms:['kitchen'],name:'Oven cabinet',desc:'An opening for a single wall oven, with a drawer below and doors above.',ws:[30,33],hs:[84,90,96],d:24,p:function(w,h){return 560+9*w+(h-84)*6},asm:75,feat:['appliance','drawers'],pop:11},
 {id:'VB',cat:'vanity',rooms:['bath'],name:'Vanity sink base',desc:'A 21″-deep sink base for bathrooms, with doors and a false drawer front.',ws:[24,30,36,48],hs:[34.5],d:21,p:function(w){return 170+6.8*w},asm:45,feat:['appliance'],pop:6},
 {id:'VDB',cat:'vanity',rooms:['bath'],name:'Vanity drawer base',desc:'Three drawers for a double vanity or a makeup station.',ws:[12,15,18],hs:[34.5],d:21,p:function(w){return 205+9*w},asm:50,feat:['drawers'],pop:7},
 {id:'LT',cat:'vanity',rooms:['bath','laundry'],name:'Linen tower',desc:'A tall, narrow cabinet for towels and supplies, with two doors and adjustable shelves.',ws:[15,18],hs:[84],d:21,p:function(w){return 360+11*w},asm:65,feat:[],pop:13},
 {id:'F',cat:'trim',rooms:['kitchen','bath','laundry'],name:'Filler strip',desc:'Closes small gaps against walls and appliances. Cut to fit on site.',ws:[3,6],hs:[30,42,96],d:0.75,p:function(w,h){return 24+w*2+h*.35},asm:0,acc:1,feat:[],pop:14},
 {id:'EP',cat:'trim',rooms:['kitchen','bath','laundry'],name:'Finished end panel',desc:'Covers exposed cabinet sides at the end of a run or on an island.',ws:[24],hs:[34.5,96],d:0.75,p:function(w,h){return h>40?185:95},asm:0,acc:1,feat:[],pop:15},
 {id:'TK',cat:'trim',rooms:['kitchen','bath','laundry'],name:'Toe kick',desc:'A 96″ finished toe kick to cover the base of a run of cabinets.',ws:[96],hs:[4.5],d:0.25,p:function(){return 32},asm:0,acc:1,feat:[],pop:16},
 {id:'CM',cat:'trim',rooms:['kitchen'],name:'Crown molding',desc:'A 96″ length of matching crown molding to finish the tops of wall cabinets.',ws:[96],hs:[3],d:2,p:function(){return 68},asm:0,acc:1,feat:[],pop:17},
 {id:'SAMPLE',cat:'sample',rooms:['kitchen','bath','laundry'],name:'Door sample',desc:'A full-size door in any style and finish. $15, credited back when you order your cabinets.',ws:[15],hs:[24],d:.75,p:function(){return 15},asm:0,acc:1,flat:1,feat:[],pop:18,tag:'$15 credit'}
];
var CATS=[{id:'base',n:'Base cabinets'},{id:'wall',n:'Wall cabinets'},{id:'tall',n:'Tall cabinets'},{id:'vanity',n:'Bath & vanity'},{id:'trim',n:'Panels & trim'},{id:'sample',n:'Samples'}];
var ROOMS=[{id:'kitchen',n:'Kitchen'},{id:'bath',n:'Bathroom'},{id:'laundry',n:'Laundry'}];
function fin(id){return FIN.filter(function(f){return f.id===id})[0]||FIN[0]}
function sty(id){return STY.filter(function(s){return s.id===id})[0]||STY[0]}
function item(id){return CAT.filter(function(c){return c.id===id})[0]}
function price(it,w,h,s,f,asm){var p=it.p(w,h)*(it.acc?1:SM[s])*(it.flat?1:FM[f]);if(asm&&it.asm)p+=it.asm;return Math.round(p)}
function from(it,s,f){return Math.min.apply(null,it.ws.map(function(w){return price(it,w,it.hs[0],s,f)}))}
function money(n){return '$'+Math.round(n).toLocaleString('en-US')}
function esc(t){var d=document.createElement('div');d.textContent=t==null?'':String(t);return d.innerHTML}
function defW(it){return it.ws.indexOf(24)>-1&&!it.acc?24:it.ws.indexOf(30)>-1?30:it.ws.indexOf(36)>-1?36:it.ws[0]}
function sku(it,w,h){return it.id+w+(it.hs.length>1?'-'+h:'')}
var store={get:function(k,d){try{var v=localStorage.getItem(k);return v?JSON.parse(v):d}catch(e){return d}},set:function(k,v){try{localStorage.setItem(k,JSON.stringify(v))}catch(e){}}};
var pref=store.get('hc-pref',{s:'shaker',f:'white'});
function setPref(s,f){pref={s:s||pref.s,f:f||pref.f};store.set('hc-pref',pref)}

/* ---------- drawing (1 unit = 1 inch) ---------- */
var uid=0;
function woodDefs(id,F){return '<defs><pattern id="'+id+'" width="40" height="7" patternUnits="userSpaceOnUse"><rect width="40" height="7" fill="'+F.c+'"/><path d="M0 1.6 Q10 .8 20 1.8 T40 1.4 M0 4.4 Q12 5.2 22 4.2 T40 4.8" stroke="'+F.e+'" stroke-width=".35" fill="none" opacity=".55"/></pattern></defs>'}
function front(x,y,w,h,S,F,fill,pull,o){
  o=o||{};var s='<rect x="'+x+'" y="'+y+'" width="'+w+'" height="'+h+'" fill="'+fill+'" stroke="'+F.e+'" stroke-width=".3" rx=".25"/>';
  var r=Math.min(S.rail,w/4,h/4);
  if(r>0)s+='<rect x="'+(x+r)+'" y="'+(y+r)+'" width="'+(w-2*r)+'" height="'+(h-2*r)+'" fill="none" stroke="'+F.e+'" stroke-width=".35"/><path d="M'+(x+r+.35)+' '+(y+h-r-.3)+'H'+(x+w-r-.3)+'V'+(y+r+.35)+'" stroke="rgba(255,255,255,.28)" stroke-width=".35" fill="none"/>';
  var pc='#1E1F1F';
  if(pull==='h'){var pw=Math.min(w*.4,10);s+='<rect x="'+(x+w/2-pw/2)+'" y="'+(y+Math.min(h/2,2.6)-.35)+'" width="'+pw+'" height=".7" rx=".35" fill="'+pc+'"/>'}
  else if(pull==='l'||pull==='r'){var ph=Math.min(h*.3,7),px=pull==='l'?x+1.6:x+w-2.3,py=o.top?y+h-ph-2:y+2;s+='<rect x="'+px+'" y="'+py+'" width=".7" height="'+ph+'" rx=".35" fill="'+pc+'"/>'}
  if(o.swing){var hx=o.swing==='l'?x:x+w,ox=o.swing==='l'?x+w:x;s+='<path d="M'+ox+' '+y+' L'+hx+' '+(y+h/2)+' L'+ox+' '+(y+h)+'" fill="none" stroke="#7a6f5e" stroke-width=".25" stroke-dasharray="1 .8"/>'}
  return s}
function doors(x,y,w,h,S,F,fill,n,hinge,sw,upper){
  if(n===1)return front(x,y,w,h,S,F,fill,hinge==='l'?'r':'l',{top:upper,swing:sw?hinge:0});
  var g=.125,dw=(w-g)/2;return front(x,y,dw,h,S,F,fill,'r',{top:upper,swing:sw?'l':0})+front(x+dw+g,y,dw,h,S,F,fill,'l',{top:upper,swing:sw?'r':0})}
function cab(id,x,y,w,h,s,f,o){
  o=o||{};var S=sty(s),F=fin(f),fill=o.fill||F.c,g=.125,out='',sw=o.swing,hinge=o.hinge||'l';
  var base=['B','DB3','SB','LS','VB','VDB','TPO','BBC'].indexOf(id)>-1,toe=base?4:0,bh=h-toe;
  if(id==='SAMPLE')return front(x,y,w,h,S,F,fill,'r');
  if(id==='EP'||id==='F'||id==='TK')return '<rect x="'+x+'" y="'+y+'" width="'+w+'" height="'+h+'" fill="'+(id==='TK'?'#2b2a28':fill)+'" stroke="'+F.e+'" stroke-width=".3"/>';
  if(id==='CM')return '<path d="M'+x+' '+(y+h)+'H'+(x+w)+'V'+(y+h*.55)+'Q'+(x+w)+' '+y+' '+(x+w-1)+' '+y+'H'+(x+1)+'Q'+x+' '+y+' '+x+' '+(y+h*.55)+'Z" fill="'+fill+'" stroke="'+F.e+'" stroke-width=".25"/><path d="M'+x+' '+(y+h*.5)+'H'+(x+w)+'" stroke="'+F.e+'" stroke-width=".2"/>';
  out+='<rect x="'+x+'" y="'+y+'" width="'+w+'" height="'+bh+'" fill="'+F.e+'"/>';
  if(base)out+='<rect x="'+(x+.6)+'" y="'+(y+bh)+'" width="'+(w-1.2)+'" height="'+toe+'" fill="#2b2a28"/>';
  var X=x+g,Y=y+g,Wd=w-2*g,n=w>=24?2:1;
  if(id==='B'){out+=front(X,Y,Wd,6,S,F,fill,'h')+doors(X,Y+6+g,Wd,bh-6-3*g,S,F,fill,n,hinge,sw)}
  else if(id==='DB3'||id==='VDB'){var r2=(bh-6-4*g)/2;out+=front(X,Y,Wd,6,S,F,fill,'h')+front(X,Y+6+g,Wd,r2,S,F,fill,'h')+front(X,Y+6+r2+2*g,Wd,r2,S,F,fill,'h')}
  else if(id==='TPO'){out+=front(X,Y,Wd,6,S,F,fill,'h')+front(X,Y+6+g,Wd,bh-6-3*g,S,F,fill,'h')}
  else if(id==='SB'||id==='VB'){out+=front(X,Y,Wd,6,S,F,fill,null)+doors(X,Y+6+g,Wd,bh-6-3*g,S,F,fill,w>=24?2:1,hinge,sw)}
  else if(id==='LS'){var hw=(Wd-g)/2;out+=front(X,Y,Wd,6,S,F,fill,'h')+front(X,Y+6+g,hw,bh-6-3*g,S,F,fill,'r')+front(X+hw+g,Y+6+g,hw,bh-6-3*g,S,F,fill,null)}
  else if(id==='BBC'){var bl=w-24;out+='<rect x="'+X+'" y="'+Y+'" width="'+(bl-g)+'" height="'+(bh-2*g)+'" fill="'+fill+'" stroke="'+F.e+'" stroke-width=".3"/>'+front(X+bl,Y,24-2*g,6,S,F,fill,'h')+front(X+bl,Y+6+g,24-2*g,bh-6-3*g,S,F,fill,'l',{swing:sw?'r':0})}
  else if(id==='W'){out+=doors(X,Y,Wd,h-2*g,S,F,fill,n,hinge,sw,true)}
  else if(id==='WMW'){var mo=18;out+=doors(X,Y,Wd,h-mo-2*g,S,F,fill,n,hinge,sw,true)+'<rect x="'+X+'" y="'+(y+h-mo)+'" width="'+Wd+'" height="'+(mo-g)+'" fill="#3a3632"/><rect x="'+(X+1)+'" y="'+(y+h-mo+1.5)+'" width="'+(Wd-2)+'" height="'+(mo-3)+'" rx="1" fill="#55504a"/>'}
  else if(id==='P'||id==='LT'){var up=Math.round(h*.42);out+=doors(X,Y,Wd,up,S,F,fill,id==='LT'?1:n,hinge,sw,true)+doors(X,Y+up+g,Wd,h-up-3*g,S,F,fill,id==='LT'?1:n,hinge,sw)}
  else if(id==='OV'){var top=h-34.5-30,oy=Y+top+g;out+=doors(X,Y,Wd,top,S,F,fill,n,hinge,sw,true)+'<rect x="'+X+'" y="'+oy+'" width="'+Wd+'" height="30" fill="#2a2a2a"/><rect x="'+(X+2)+'" y="'+(oy+6)+'" width="'+(Wd-4)+'" height="20" rx="1" fill="#444"/><rect x="'+(X+3)+'" y="'+(oy+2.2)+'" width="'+(Wd-6)+'" height="1" rx=".5" fill="#9a9a9a"/>'+front(X,oy+30+g,Wd,h-top-30-3*g,S,F,fill,'h')}
  return out}
function dimH(x1,x2,y,l){return '<g><path d="M'+x1+' '+(y-2)+'V'+(y+2)+'M'+x2+' '+(y-2)+'V'+(y+2)+'M'+x1+' '+y+'H'+x2+'" stroke="#8a7f6c" stroke-width=".25"/><path d="M'+(x1+1.4)+' '+(y-.8)+'L'+x1+' '+y+'L'+(x1+1.4)+' '+(y+.8)+'M'+(x2-1.4)+' '+(y-.8)+'L'+x2+' '+y+'L'+(x2-1.4)+' '+(y+.8)+'" stroke="#8a7f6c" stroke-width=".25" fill="none"/><rect x="'+((x1+x2)/2-l.length*.95)+'" y="'+(y-1.6)+'" width="'+(l.length*1.9)+'" height="3.2" fill="#EFEBE3"/><text x="'+(x1+x2)/2+'" y="'+(y+1.05)+'" text-anchor="middle" font-family="IBM Plex Mono,monospace" font-size="2.8" fill="#4d473e">'+l+'</text></g>'}
function dimV(y1,y2,x,l){return '<g><path d="M'+(x-2)+' '+y1+'H'+(x+2)+'M'+(x-2)+' '+y2+'H'+(x+2)+'M'+x+' '+y1+'V'+y2+'" stroke="#8a7f6c" stroke-width=".25"/><g transform="translate('+x+' '+(y1+y2)/2+') rotate(-90)"><rect x="'+(-l.length*.95)+'" y="-1.6" width="'+(l.length*1.9)+'" height="3.2" fill="#EFEBE3"/><text y="1.05" text-anchor="middle" font-family="IBM Plex Mono,monospace" font-size="2.8" fill="#4d473e">'+l+'</text></g></g>'}
function product(id,w,h,s,f,o){
  o=o||{};var F=fin(f),pid='wd'+(++uid),fill=F.wood?'url(#'+pid+')':F.c,pad=o.dims?9:1,vw=w+pad*2,vh=h+pad*2;
  var svg='<svg viewBox="'+(-pad)+' '+(-pad)+' '+vw+' '+vh+'" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="'+esc((item(id)||{}).name||'')+'">'+(F.wood?woodDefs(pid,F):'')+cab(id,0,0,w,h,s,f,{fill:fill,swing:o.swing,hinge:o.hinge});
  if(o.dims)svg+=dimH(0,w,h+5,w+'″ W')+dimV(0,h,-5,h+'″ H');
  return svg+'</svg>'}
/* side profile for the product page */
function profile(it,h,f){var F=fin(f),d=Math.max(it.d,1),pad=9,svg='<svg viewBox="'+(-pad)+' '+(-pad)+' '+(d+pad*2)+' '+(h+pad*2)+'" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Side view">';
  var base=it.cat==='base'||it.id==='VB'||it.id==='VDB';
  svg+='<rect x="0" y="0" width="'+(d-.75)+'" height="'+(base?h-4:h)+'" fill="'+F.e+'" stroke="#8a7f6c" stroke-width=".25"/><rect x="'+(d-.75)+'" y="0" width=".75" height="'+(base?h-4:h)+'" fill="'+F.c+'" stroke="#8a7f6c" stroke-width=".2"/>';
  if(base)svg+='<rect x="0" y="'+(h-4)+'" width="'+(d-3)+'" height="4" fill="#2b2a28"/>';
  return svg+dimH(0,d,h+5,d+'″ D')+dimV(0,h,-5,h+'″ H')+'</svg>'}
function doorSvg(s,f){var F=fin(f),pid='ds'+(++uid),fill=F.wood?'url(#'+pid+')':F.c;return '<svg viewBox="-1 -1 17 26" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="'+esc(sty(s).name+' door in '+F.name)+'">'+(F.wood?woodDefs(pid,F):'')+front(0,0,15,24,sty(s),F,fill,'r')+'</svg>'}
function thumb(it,s,f,w,h){return it.id==='SAMPLE'?doorSvg(s,f):product(it.id,w||defW(it),h||it.hs[0],s,f)}
/* kitchen elevation */
function kitchen(s,f){
  var F=fin(f),pid='hk'+(++uid),fill=F.wood?'url(#'+pid+')':F.c,o={fill:fill},W=162,H=100,cty=58.5;
  var svg='<svg viewBox="-6 -8 '+(W+12)+' '+(H+12)+'" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Kitchen in '+esc(sty(s).name+', '+F.name)+'">'+(F.wood?woodDefs(pid,F):'');
  svg+='<rect x="-6" y="-8" width="'+(W+12)+'" height="'+(H+12)+'" fill="#EFEBE3"/><rect x="-6" y="'+(H-1)+'" width="'+(W+12)+'" height="5" fill="#DCD3C3"/>';
  svg+='<rect x="24" y="'+(cty-18)+'" width="'+(W-24)+'" height="18" fill="#F8F5EF"/>';
  for(var i=24;i<W;i+=6)svg+='<path d="M'+i+' '+(cty-18)+'V'+cty+'" stroke="#E6DFD1" stroke-width=".25"/>';
  for(var j=cty-18;j<cty;j+=3)svg+='<path d="M24 '+j+'H'+W+'" stroke="#E6DFD1" stroke-width=".25"/>';
  svg+=cab('P',0,H-96,24,96,s,f,o);
  var x=24;[['DB3',18],['SB',36],['DW',24],['RG',30],['B',30]].forEach(function(b){var y=H-34.5;
    if(b[0]==='DW')svg+='<rect x="'+x+'" y="'+y+'" width="'+b[1]+'" height="30.5" fill="#C9CCCD" stroke="#9ea2a4" stroke-width=".3"/><rect x="'+(x+3)+'" y="'+(y+2)+'" width="'+(b[1]-6)+'" height=".8" rx=".4" fill="#8d9194"/><rect x="'+x+'" y="'+(y+30.5)+'" width="'+b[1]+'" height="4" fill="#2b2a28"/>';
    else if(b[0]==='RG')svg+='<rect x="'+x+'" y="'+(y-1)+'" width="'+b[1]+'" height="35.5" fill="#BFC3C5" stroke="#9ea2a4" stroke-width=".3"/><rect x="'+(x+2.5)+'" y="'+(y+6)+'" width="'+(b[1]-5)+'" height="17" rx="1" fill="#3a3c3e"/><rect x="'+(x+4)+'" y="'+(y+3)+'" width="'+(b[1]-8)+'" height=".8" rx=".4" fill="#8d9194"/>'+[0,1,2,3].map(function(k){return '<circle cx="'+(x+5+k*6.7)+'" cy="'+(y+1.4)+'" r=".9" fill="#55585a"/>'}).join('')+'<rect x="'+(x+2.5)+'" y="'+(y+25.5)+'" width="'+(b[1]-5)+'" height="6" fill="#a9adaf"/>';
    else svg+=cab(b[0],x,y,b[1],34.5,s,f,o);x+=b[1]});
  [[23.6,78.4],[132,30.4]].forEach(function(c){svg+='<rect x="'+c[0]+'" y="'+(H-35.9)+'" width="'+c[1]+'" height="1.5" fill="#ECE8E0" stroke="#cfc8bb" stroke-width=".2"/>'});
  svg+='<path d="M'+(24+18+11)+' '+(H-36)+'v-5.5h3.2v1.2" stroke="#8a8f92" stroke-width=".9" fill="none" stroke-linecap="round"/>';
  var wx=24,wy=cty-18-30;[[18,'W'],[36,'W'],[24,'W'],[30,'HOOD'],[30,'W']].forEach(function(b){if(b[1]==='HOOD')svg+='<path d="M'+(wx+3)+' '+(cty-26)+'h'+(b[0]-6)+'l2 8h-'+(b[0]-2)+'z" fill="#B7BBBD" stroke="#9ea2a4" stroke-width=".3"/><rect x="'+(wx+11)+'" y="'+(wy-12)+'" width="8" height="'+(cty-26-wy+12)+'" fill="#C3C7C9"/>';else svg+=cab('W',wx,wy,b[0],30,s,f,o);wx+=b[0]});
  svg+='<rect x="24" y="'+(wy-3)+'" width="'+(W-24)+'" height="3" fill="'+(F.wood?F.e:F.c)+'" stroke="'+F.e+'" stroke-width=".25"/>';
  return svg+'</svg>'}
function kitPrice(s,f){return [['P',24,90],['DB3',18,34.5],['SB',36,34.5],['B',30,34.5],['W',18,30],['W',36,30],['W',24,30],['W',30,30]].reduce(function(t,k){return t+price(item(k[0]),k[1],k[2],s,f)},0)}

/* ---------- controls ---------- */
function seg(el,opts,val,cb){el.innerHTML=opts.map(function(o){return '<button type="button" data-v="'+o.id+'" aria-pressed="'+(o.id===val)+'">'+esc(o.name||o.n)+'</button>'}).join('');
  el.onclick=function(e){var b=e.target.closest('button');if(!b)return;el.querySelectorAll('button').forEach(function(x){x.setAttribute('aria-pressed',x===b)});cb(b.getAttribute('data-v'))}}
function swBg(f){return f.wood?'linear-gradient(115deg,'+f.c+' 0 30%,'+f.e+' 30% 34%,'+f.c+' 34% 62%,'+f.e+' 62% 65%,'+f.c+' 65%)':f.c}
function swatches(el,val,cb){el.innerHTML=FIN.map(function(f){return '<button type="button" data-v="'+f.id+'" title="'+esc(f.name)+'" aria-label="'+esc(f.name)+'" aria-pressed="'+(f.id===val)+'" style="background:'+swBg(f)+'"></button>'}).join('');
  el.onclick=function(e){var b=e.target.closest('button');if(!b)return;el.querySelectorAll('button').forEach(function(x){x.setAttribute('aria-pressed',x===b)});cb(b.getAttribute('data-v'))}}
function chips(el,vals,val,fmt,cb){el.innerHTML=vals.map(function(v){return '<button type="button" data-v="'+v+'" aria-pressed="'+(v===val)+'">'+fmt(v)+'</button>'}).join('');
  el.onclick=function(e){var b=e.target.closest('button');if(!b)return;el.querySelectorAll('button').forEach(function(x){x.setAttribute('aria-pressed',x===b)});cb(parseFloat(b.getAttribute('data-v')))}}

/* ---------- product card ---------- */
function card(it,s,f,o){o=o||{};var w=o.w||defW(it),h=o.h||it.hs[0],href=BASE+'/product?id='+it.id+(o.w?'&w='+w:'')+(o.h&&it.hs.length>1?'&h='+h:'');
  var pr=o.w?price(it,w,h,s,f):from(it,s,f),sub=o.w?(w+'″ W × '+h+'″ H'+(it.d>=12?' × '+it.d+'″ D':'')):(it.ws.length>1?it.ws.length+' widths, '+it.ws[0]+'″–'+it.ws[it.ws.length-1]+'″':it.ws[0]+'″ wide')+(it.hs.length>1?' · '+it.hs.length+' heights':'');
  return '<a class="pc" href="'+href+'" data-id="'+it.id+'"><div class="img">'+(it.tag?'<span class="tag">'+esc(it.tag)+'</span>':'')+thumb(it,s,f,w,h)+(it.id!=='SAMPLE'?'<div class="qa"><button class="btn sm block" type="button" data-quick="'+it.id+'" data-w="'+w+'" data-h="'+h+'">Quick add · '+(o.w?money(pr):w+'″')+'</button></div>':'')+'</div>'+
    '<div class="meta"><div class="nm"><h3>'+esc(o.w?it.name+' '+w+'″':it.name)+'</h3><span class="pr">'+(o.w?'':'<span style="font-weight:400;color:var(--ink-2);font-size:13px">from </span>')+money(pr)+'</span></div><span class="sub">'+esc((o.w?sku(it,w,h)+' · ':'')+sub)+'</span>'+(it.acc&&!it.flat?'':'<span class="dots">'+FIN.map(function(F){return '<i style="background:'+swBg(F)+'" title="'+esc(F.name)+'"></i>'}).join('')+'</span>')+'</div></a>'}

/* ---------- shell: header, footer, cart ---------- */
var IC={bag:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M5 8h14l-1 12H6z"/><path d="M9 8V6a3 3 0 0 1 6 0v2"/></svg>',menu:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M4 7h16M4 12h16M4 17h16"/></svg>'};
function shell(cur){
  var navs=[['shop','Shop all',BASE+'/shop'],['kitchen','Kitchen',BASE+'/shop?room=kitchen'],['bath','Bathroom',BASE+'/shop?room=bath'],['styles','Door styles',BASE+'/#styles'],['samples','Samples',BASE+'/shop?cat=sample'],['design','Free design',BASE+'/#design']];
  var hdr=document.createElement('div');
  hdr.innerHTML='<div class="demo-bar"><b>Demo preview.</b> A concept store for Pittman Woodworks. Products, prices and policies are placeholders, and no orders are taken. <a href="/">Back to pittmanwoodworks.com</a></div>'+
  '<header class="hdr"><div class="wrap"><a class="logo" href="'+BASE+'/"><img src="/images/uploads/pw-final_pw-icon-variation2-navy.png" alt=""><span><b>The Home Collection</b><small>by Pittman Woodworks</small></span></a>'+
  '<nav class="nav" aria-label="Store">'+navs.map(function(n){return '<a href="'+n[2]+'"'+(n[0]===cur?' aria-current="page"':'')+'>'+n[1]+'</a>'}).join('')+'</nav>'+
  '<div class="hdr-r"><button class="icon-btn menu-btn" type="button" id="hcMenu" aria-label="Menu">'+IC.menu+'</button><button class="icon-btn" type="button" id="hcCart" aria-label="Open cart">'+IC.bag+'<span class="cart-n" id="hcN" data-n="0">0</span></button></div></div></header>';
  document.body.insertBefore(hdr,document.body.firstChild);
  var ftr=document.createElement('footer');ftr.className='ftr';
  ftr.innerHTML='<div class="wrap"><div class="cols"><div><a class="logo" href="'+BASE+'/"><img src="/images/uploads/pw-final_pw-icon-variation2-navy.png" alt="" style="filter:invert(1) brightness(1.6)"><span><b>The Home Collection</b><small>by Pittman Woodworks</small></span></a><p style="margin:18px 0 0;max-width:24em">Cabinets cut and built in the Pittman Woodworks shop in North Richland Hills, Texas.</p></div>'+
  '<div><h4>Shop</h4><a href="'+BASE+'/shop">Shop all</a><a href="'+BASE+'/shop?cat=base">Base cabinets</a><a href="'+BASE+'/shop?cat=wall">Wall cabinets</a><a href="'+BASE+'/shop?cat=tall">Tall cabinets</a><a href="'+BASE+'/shop?cat=vanity">Bath &amp; vanity</a><a href="'+BASE+'/shop?cat=sample">Door samples</a></div>'+
  '<div><h4>Help</h4><a href="'+BASE+'/#design">Free kitchen design</a><a href="'+BASE+'/#estimate">Kitchen estimate</a><a href="'+BASE+'/#faq">Shipping &amp; delivery</a><a href="'+BASE+'/#faq">Assembly</a><a href="'+BASE+'/#faq">Returns</a></div>'+
  '<div><h4>Company</h4><a href="/about">About Pittman Woodworks</a><a href="/construction">How we build</a><a href="/contact">Contact</a></div></div>'+
  '<div class="base"><span>© 2026 Pittman Woodworks LLC · Demo preview only</span><span>Commercial work? <a href="/">pittmanwoodworks.com</a></span></div></div>';
  document.body.appendChild(ftr);
  var ov=document.createElement('div');
  ov.innerHTML='<div class="scrim" id="hcScrim"></div>'+
  '<aside class="drawer" id="hcCartD" aria-hidden="true" aria-label="Cart"><div class="drawer-h"><h3>Your cart</h3><button class="x" type="button" data-close aria-label="Close cart">×</button></div><div class="drawer-b" id="hcCartL"></div><div class="drawer-f" id="hcCartF"></div></aside>'+
  '<aside class="drawer left" id="hcMenuD" aria-hidden="true" aria-label="Menu"><div class="drawer-h"><h3>Menu</h3><button class="x" type="button" data-close aria-label="Close menu">×</button></div><nav class="mnav">'+navs.map(function(n){return '<a href="'+n[2]+'">'+n[1]+'</a>'}).join('')+'</nav></aside>'+
  '<div class="modal" id="hcCo" role="dialog" aria-modal="true" aria-labelledby="hcCoH"><h3 id="hcCoH">Checkout goes here.</h3><p>In the live store, this would open a secure checkout (for example Shopify or Stripe) to take payment, add Texas sales tax and schedule freight delivery or shop pickup.</p><p id="hcCoSum" style="color:var(--ink)"></p><button class="btn" type="button" data-close>Back to the demo</button></div>'+
  '<div class="toast" id="hcToast" role="status"></div>';
  document.body.appendChild(ov);
  document.getElementById('hcCart').onclick=function(){renderCart();open('hcCartD')};
  document.getElementById('hcMenu').onclick=function(){open('hcMenuD')};
  document.getElementById('hcScrim').onclick=closeAll;
  document.querySelectorAll('[data-close]').forEach(function(b){b.onclick=closeAll});
  document.addEventListener('keydown',function(e){if(e.key==='Escape')closeAll()});
  document.querySelectorAll('.mnav a').forEach(function(a){a.addEventListener('click',closeAll)});
  document.addEventListener('click',function(e){var q=e.target.closest('[data-quick]');if(!q)return;e.preventDefault();e.stopPropagation();var it=item(q.getAttribute('data-quick'));
    addCart({id:it.id,w:+q.getAttribute('data-w'),h:+q.getAttribute('data-h'),s:pref.s,f:pref.f,hinge:'',asm:false,q:1});toast(it.name+' '+q.getAttribute('data-w')+'″ added',true)});
  renderCart()}
var lastFocus;
function open(id){lastFocus=document.activeElement;['hcCartD','hcMenuD','hcCo'].forEach(function(x){var el=document.getElementById(x);if(x!==id){el.classList.remove('on');el.setAttribute('aria-hidden','true')}});var el=document.getElementById(id);el.classList.add('on');el.setAttribute('aria-hidden','false');document.getElementById('hcScrim').classList.add('on');document.body.style.overflow='hidden';setTimeout(function(){var c=el.querySelector('[data-close]');if(c)c.focus()},60)}
function closeAll(){['hcCartD','hcMenuD','hcCo'].forEach(function(x){var el=document.getElementById(x);el.classList.remove('on');el.setAttribute('aria-hidden','true')});document.getElementById('hcScrim').classList.remove('on');document.body.style.overflow='';if(lastFocus&&lastFocus.focus)lastFocus.focus()}

/* ---------- cart ---------- */
var cart=store.get('hc-cart',[]),FREE=3500;
function key(c){return [c.id,c.w,c.h,c.s,c.f,c.hinge,c.asm].join('|')}
function addCart(c){var k=key(c),ex=cart.filter(function(x){return key(x)===k})[0];if(ex)ex.q+=c.q;else cart.push(c);saveCart();var b=document.getElementById('hcCart');b.classList.remove('bump');void b.offsetWidth;b.classList.add('bump')}
function saveCart(){store.set('hc-cart',cart);renderCart()}
function unit(c){var it=item(c.id);return it?price(it,c.w,c.h,c.s,c.f,c.asm):0}
function desc(c){var it=item(c.id),S=sty(c.s),F=fin(c.f);if(c.id==='SAMPLE')return S.name+' · '+F.name;
  return sku(it,c.w,c.h)+' · '+(it.acc?F.name:S.name+' · '+F.name)+(c.hinge?' · hinged '+(c.hinge==='l'?'left':'right'):'')+(it.asm?(c.asm?' · assembled':' · flat-packed'):'')}
function renderCart(){var n=cart.reduce(function(t,c){return t+c.q},0),sub=cart.reduce(function(t,c){return t+unit(c)*c.q},0),N=document.getElementById('hcN');if(!N)return;N.textContent=n;N.setAttribute('data-n',n);
  var L=document.getElementById('hcCartL'),Fo=document.getElementById('hcCartF');
  if(!cart.length){L.innerHTML='<p class="empty">Your cart is empty.</p><a class="btn block" href="'+BASE+'/shop">Shop all cabinets</a>';Fo.innerHTML='';return}
  L.innerHTML=cart.map(function(c,i){var it=item(c.id);return '<div class="ci"><div class="th">'+thumb(it,c.s,c.f,c.w,c.h)+'</div><div><b>'+esc(c.q+' × '+it.name+(it.ws.length>1?' '+c.w+'″':''))+'</b><span>'+esc(desc(c))+'</span><button class="rm" data-i="'+i+'" type="button">Remove</button></div><b>'+money(unit(c)*c.q)+'</b></div>'}).join('');
  L.querySelectorAll('.rm').forEach(function(b){b.onclick=function(){cart.splice(+b.getAttribute('data-i'),1);saveCart()}});
  var left=FREE-sub;
  Fo.innerHTML='<div class="ln"><span>Subtotal</span><b>'+money(sub)+'</b></div><div class="ln" style="color:var(--ink-2)"><span>Delivery in DFW</span><span>'+(left<=0?'Free':'From $149, or free pickup')+'</span></div><div class="bar"><i style="width:'+Math.min(100,sub/FREE*100)+'%"></i></div><span style="font-size:13px;color:var(--ink-2)">'+(left>0?money(left)+' away from free DFW delivery':'You\'ve unlocked free DFW delivery')+'</span><button class="btn block" type="button" id="hcGo">Checkout · '+money(sub)+'</button>';
  document.getElementById('hcGo').onclick=function(){document.getElementById('hcCoSum').textContent=n+' item'+(n>1?'s':'')+' · subtotal '+money(sub)+'.';open('hcCo')}}
var tt;function toast(m,withCart){var t=document.getElementById('hcToast');t.innerHTML='<span>'+esc(m)+'</span>'+(withCart?'<button type="button">View cart</button>':'');var b=t.querySelector('button');if(b)b.onclick=function(){t.classList.remove('on');renderCart();open('hcCartD')};t.classList.add('on');clearTimeout(tt);tt=setTimeout(function(){t.classList.remove('on')},2600)}

window.HC={BASE:BASE,FIN:FIN,STY:STY,CAT:CAT,CATS:CATS,ROOMS:ROOMS,fin:fin,sty:sty,item:item,price:price,from:from,money:money,esc:esc,defW:defW,sku:sku,
  product:product,profile:profile,doorSvg:doorSvg,thumb:thumb,kitchen:kitchen,kitPrice:kitPrice,cab:cab,seg:seg,swatches:swatches,chips:chips,card:card,swBg:swBg,
  shell:shell,addCart:addCart,toast:toast,open:open,pref:function(){return pref},setPref:setPref,store:store};
})();
