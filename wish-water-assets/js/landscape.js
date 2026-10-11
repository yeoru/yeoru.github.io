/* Progressive, connected pixel water with transparent artwork. Stylized, not CFD. */
(function(root){
 const clamp=(x,a=0,b=1)=>Math.max(a,Math.min(b,x)),mix=(a,b,t)=>a+(b-a)*t;
 const smooth=x=>{x=clamp(x);return x*x*(3-2*x);};
 const ORDER=[0,1,2,3,4,5,6,7,8],LEVELS=[0,0,0,0,0,0,.05,.18,.48,.76];
 class WishLandscape{
  constructor(canvas){
   this.canvas=canvas;this.ctx=canvas.getContext('2d');this.ctx.imageSmoothingEnabled=false;
   this.reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;this.removed=new Map();this.releaseAt=null;this.releasePlan=[];this.releaseWaterDelay=0;this.releaseDuration=2800;this.lastTime=null;this.flow=0;this.waterTravel=0;this.flowStartedAt=null;
   this.imageCache=new Map();this.fish=null;this.oldFish=null;this.fishX=208;this.changeAt=0;this.school=Array.from({length:9},(_,i)=>({x:24+i*30,phase:i*2.399,scale:.48+(i%4)*.16,speed:.72+(i%5)*.12}));
   let seed=79;const rand=()=>{seed=(Math.imul(seed,1664525)+1013904223)>>>0;return seed/4294967296;};
   this.stars=Array.from({length:105},()=>({x:rand()*720,y:12+rand()*159,s:rand()>.94?2:1,p:rand()*6.28}));
   this.pebbles=Array.from({length:100},()=>({x:rand()*720,y:259+rand()*33,s:1+Math.floor(rand()*3),c:rand()}));
   this.rocks=[{x:359,y:120,w:25,h:15},{x:342,y:136,w:42,h:16},{x:378,y:143,w:24,h:20},{x:328,y:154,w:52,h:24},{x:375,y:166,w:36,h:26},{x:317,y:177,w:63,h:22},{x:377,y:193,w:45,h:25},{x:307,y:201,w:61,h:28},{x:354,y:222,w:71,h:25}];
   this.tick=this.tick.bind(this);requestAnimationFrame(this.tick);
  }
  remove(index){const id=ORDER[index];if(id===undefined||this.removed.has(id))return false;this.removed.set(id,performance.now());if(this.flowStartedAt===null&&LEVELS[index+1]>0)this.flowStartedAt=performance.now();return true;}
  release(){if(this.releaseAt!==null)return [];this.releaseAt=performance.now();this.releasePlan=ORDER.filter(id=>!this.removed.has(id)).map((id,i)=>({id,delay:(i+1)*500}));const wet=this.releasePlan.find(r=>r.id===5);this.releaseWaterDelay=wet?wet.delay+150:0;this.releaseDuration=this.releasePlan.length?this.releasePlan.at(-1).delay+1400:2800;if(this.flowStartedAt===null)this.flowStartedAt=this.releaseAt+this.releaseWaterDelay;return this.releasePlan.map(r=>r.delay);}
  restore(count,complete){for(let i=0;i<Math.min(count,9);i++)this.removed.set(ORDER[i],-10000);this.flow=LEVELS[Math.min(count,9)];if(LEVELS[Math.min(count,9)]>0)this.flowStartedAt=-10000;if(complete){this.releaseAt=-10000;this.flow=1;}}
  reset(){this.removed.clear();this.releaseAt=null;this.flow=0;this.flowStartedAt=null;this.fishX=208;}
  setArtwork(src,label,bounds){
   if(this.fish?.src===src&&this.fish?.label===label)return;
   const entry={src,label,bounds};this.requestedArtwork=entry;
   const install=image=>{if(this.requestedArtwork!==entry)return;this.oldFish=this.fish;this.fish={...entry,image};this.changeAt=performance.now();};
   if(this.imageCache.has(src))return install(this.imageCache.get(src));
   const image=new Image();image.onload=()=>{this.imageCache.set(src,image);install(image);};image.onerror=()=>{};image.src=src;
  }
  targetFlow(time){
   let value=0;
   for(let step=0;step<9;step++){const start=this.removed.get(ORDER[step]);if(start!==undefined)value+=(LEVELS[step+1]-LEVELS[step])*(this.reduced?1:smooth((time-start-100)/950));}
   if(this.releaseAt!==null)value=mix(value,1,this.reduced?1:smooth((time-this.releaseAt-this.releaseWaterDelay)/Math.max(900,this.releaseDuration-this.releaseWaterDelay)));return clamp(value);
  }
  surface(x,q,time=0){
   const bend=smooth((x-330)/112),wave=(Math.sin(x*.057-time*(1.2+q*3))*.65+Math.sin(x*.147+time*.75)*.32)*(1-bend*.55);
   return mix(184+q*8,250-q*16-10*smooth((q-.82)/.18),bend)+wave;
  }
  bed(x){return mix(237,Math.min(252,this.surface(x,0,0)+12),smooth((x-322)/46))+Math.sin(x*.037)*.65;}
  bottom(x,q,t){if(x<=324)return this.bed(x);const neck=smooth((x-322)/46)*(1-smooth((x-420)/70));return mix(this.bed(x),Math.min(this.bed(x),this.surface(x,q,t)+2+q*12),neck);}
  rect(x,y,w,h,color,a=1){const g=this.ctx;g.globalAlpha=clamp(a);g.fillStyle=color;g.fillRect(Math.round(x),Math.round(y),Math.max(1,Math.round(w)),Math.max(1,Math.round(h)));g.globalAlpha=1;}
  waterPath(q,t,head){const g=this.ctx;g.beginPath();g.moveTo(0,this.surface(0,q,t));for(let x=0;x<=head;x+=2)g.lineTo(x,this.surface(x,q,t));g.lineTo(head,this.bottom(head,q,t));for(let x=head;x>=0;x-=2)g.lineTo(x,this.bottom(x,q,t));g.closePath();}
  drawWater(q,t,time){
   const g=this.ctx,travel=this.flowStartedAt===null?0:Math.max(0,time-this.flowStartedAt)/1000;
   const head=q<.002?334:Math.min(720,336+travel*(66+q*80));this.wetFront=head;
   this.waterPath(q,t,head);g.save();g.clip();const gradient=g.createLinearGradient(0,180,0,257);gradient.addColorStop(0,'#245746');gradient.addColorStop(.45,'#164234');gradient.addColorStop(1,'#0b2721');g.fillStyle=gradient;g.fillRect(0,174,720,89);
   for(let i=0;i<145;i++){
    const x=(i*61.73+this.waterTravel*(.65+i%5*.12))%720;if(x>head)continue;
    const top=this.surface(x,q,t),bottom=this.bottom(x,q,t),f=(i*.618)%1,y=mix(top+2,bottom-1,f),slope=(this.surface(x+3,q,t)-top)/3;
    const length=(2+i%7)*(x>330?.45+q:1),col=i%7===0?'#bbf0d4':i%3===0?'#6ab298':'#367d64';
    for(let k=0;k<length;k+=2)this.rect(x+k,y+slope*k,2,1,col,(.14+(1-f)*.45)*(x>334?Math.min(1,q*4):1));
   }
   g.restore();
   for(let x=0;x<head;x+=2){const y=this.surface(x,q,t);if((Math.floor(x/9)+Math.floor(this.waterTravel/10))%4!==0)this.rect(x,y,2,1,'#a8dbc0',x<333?.5:.3+q*.45);}
   if(q>.005){
    for(let i=0;i<Math.floor(2+q*11);i++){const p=(t*(.6+q)+i*.193)%1,x=337+p*107,y=this.surface(x,q,t)+1+(i%3)*(1+q*2);if(x<head)this.rect(x,y,1+q*4,1,i%3?'#92d8b9':'#d3fce7',.23+q*.4);}
    for(let i=0;i<Math.floor(4+q*28);i++){const p=(t*(.8+q)+i*.173)%1,x=446+(p-.25)*(18+q*24),y=this.surface(446,q,t)-Math.sin(p*Math.PI)*(2+q*(5+i%12));if(x<head)this.rect(x,y,1,1,'#baf5d4',Math.sin(p*Math.PI)*(.15+q*.5));}
    for(let i=0;i<3;i++){const p=(t*.5+i/3)%1;this.rect(446-p*12,this.surface(449,q,t)+6+p*5,10+p*(20+q*24),1,'#74bba1',(1-p)*q*.4);}
   }
  }
  rock(r,index,time){
   const start=this.removed.get(index);let progress=0;
   if(start!==undefined)progress=this.reduced?1:clamp((time-start)/1400);else if(this.releaseAt!==null)progress=this.reduced?1:clamp((time-this.releaseAt-(this.releasePlan.find(r=>r.id===index)?.delay||0))/1400);
   if(progress>=1)return;const {x,w,h}=r,y=r.y-progress*progress*(start!==undefined?64:123),g=this.ctx;g.save();g.globalAlpha=1-smooth((progress-.4)/.6);g.translate(Math.round(x),Math.round(y));
   g.fillStyle=['#727668','#838877','#606c60'][index%3];g.beginPath();g.moveTo(8,0);g.lineTo(w-10,0);g.lineTo(w-10,3);g.lineTo(w-3,3);g.lineTo(w-3,7);g.lineTo(w,7);g.lineTo(w,h-7);g.lineTo(w-7,h-7);g.lineTo(w-7,h-2);g.lineTo(6,h-2);g.lineTo(6,h-5);g.lineTo(0,h-5);g.lineTo(0,6);g.lineTo(8,6);g.closePath();g.fill();
   g.fillStyle='#a7ad8a';g.fillRect(9,2,w-21,2);g.fillStyle='#344235';g.fillRect(7,h-6,w-18,3);
   for(let j=0;j<11;j++){g.fillStyle=j%3?'#4e5c48':'#95a37b';g.fillRect(5+(j*13+index*7)%(w-11),6+(j*7)%(h-11),2+j%3,1);}g.restore();
   if(progress>0&&!this.reduced)for(let j=0;j<26;j++){
    const age=progress*1.4-(j%3)*.075;if(age<0)continue;
    const vx=Math.sin(j*7.37+index)*54,vy=-22-(j%7)*7;
    const px=x+w/2+Math.sin(j*2.1)*w*.4+vx*age,py=r.y+h*.58+vy*age+74*age*age;
    this.rect(px,py,j%5===0?3:1+j%2,j%5===0?2:1,['#b4ba93','#7b8970','#d2cba1','#4a6048'][j%4],clamp(1-age/1.15)*.85);
   }
  }
  drawFish(q,t,time,dt){
   if(!this.fish)return;const canPass=q>.10,fade=this.reduced?1:clamp((time-this.changeAt)/850),g=this.ctx;
   for(const body of this.school){
    if(!this.reduced){body.x+=dt*(canPass?15+q*58:3.5)*body.speed;if(!canPass&&body.x>286)body.x=-25;if(body.x>762)body.x=-30;}
    const x=body.x,y=this.surface(x,q,t)+2+Math.sin(t*1.05+body.phase)*3.3+(body.scale<.65?8:0),slope=(this.surface(x+7,q,t)-this.surface(x-7,q,t))/14;
    const angle=clamp(Math.atan(slope)*.65,-.22,.40)+(this.reduced?0:Math.sin(t*.8+body.phase)*.07),edge=canPass?clamp((x+22)/38)*clamp((756-x)/35):clamp((x+22)/38)*clamp((306-x)/30);
    const render=(fish,alpha)=>{if(!fish?.image||alpha<=0)return;const b=fish.bounds||[0,0,fish.image.width,fish.image.height],width=53*body.scale,height=width*b[3]/b[2];g.save();g.globalAlpha=alpha*edge;g.translate(x,y);g.rotate(angle);g.imageSmoothingEnabled=true;g.drawImage(fish.image,...b,-width/2,-height*.80,width,height);g.restore();g.imageSmoothingEnabled=false;};
    if(this.oldFish&&fade<1)render(this.oldFish,1-fade);render(this.fish,fade);
    if(x>0){this.rect(x-23*body.scale,y+5,10*body.scale,1,'#8db9a6',.20*edge);if(canPass)this.rect(x-31*body.scale,y+7,7*body.scale,1,'#5d9e87',.15*edge);}
   }
  }
  tick(time){if(!document.hidden)this.draw(time);else this.lastTime=time;requestAnimationFrame(this.tick);}
  draw(time){
   const dt=this.lastTime===null?0:clamp((time-this.lastTime)/1000,0,.1);this.lastTime=time;const target=this.targetFlow(time);this.flow=this.reduced?target:mix(this.flow,target,1-Math.exp(-dt*3));
   const q=this.flow,t=this.reduced?0:time/1000;this.waterTravel+=dt*(5+q*87);const g=this.ctx;g.fillStyle='#060807';g.fillRect(0,0,720,300);
   for(const s of this.stars){const a=.13+.5*(.5+.5*Math.sin(t*.7+s.p));this.rect(s.x,s.y,s.s,s.s,'#e0ece0',a);if(s.s===2){this.rect(s.x-2,s.y,5,1,'#d2efa2',a*.45);this.rect(s.x,s.y-2,1,5,'#d2efa2',a*.45);}}
   for(let x=0;x<720;x+=5){const y=this.bed(x);this.rect(x,y,5,300-y,'#0c140f');this.rect(x,y,5,1,'#1e2c1b');}
   for(const p of this.pebbles)this.rect(p.x,p.y,p.s+1,p.s,p.c>.78?'#48543b':'#25331f',.65);
   this.drawWater(q,t,time);this.drawFish(q,t,time,dt);for(let i=8;i>=0;i--)this.rock(this.rocks[i],i,time);
   if(q>.8)for(let j=0;j<15;j++){const x=432+(j*67)%260,y=208+(j*19)%32,a=(.5+.5*Math.sin(t*1.4+j))*(q-.8)*3;this.rect(x,y,1,3,'#caef94',a);this.rect(x-1,y+1,3,1,'#caef94',a);}
  }
 }
 root.WishLandscape=WishLandscape;root.WishFlow={ORDER,LEVELS,smooth};
})(window);
