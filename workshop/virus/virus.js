(function(){
'use strict';
function rank(scores,items,limit=2){return items.map(item=>({item,score:Number(scores?.[item.score_key]??scores?.[item.id]??0)})).filter(x=>Number.isFinite(x.score)&&x.score>0).map(x=>({...x,score:Math.min(100,x.score)})).sort((a,b)=>b.score-a.score||a.item.no-b.item.no).slice(0,limit===3?3:2).map((x,i,a)=>({...x,alpha:x.score/a.reduce((s,y)=>s+y.score,0)}));}
if(typeof module!=='undefined'&&module.exports){module.exports={rank};return;}
const result=document.getElementById('result');if(!result||document.getElementById('virusCollection'))return;
function el(tag,text,cls){const n=document.createElement(tag);if(text)n.textContent=text;if(cls)n.className=cls;return n;}
const root=el('section',null,'va-compact');root.id='virusCollection';root.setAttribute('aria-label','바이러스 이미지 합성');result.after(root);
let data=null,last=null,limit=2,revision=0;
const title=el('h3','VIRAL TRACES'),status=el('p','소원 분석 후 연결된 바이러스 이미지가 나타납니다.','va-meta'),controls=el('label',null,'va-meta'),select=el('select');
for(const [n,t] of [[2,'1위 + 2위'],[3,'1위 + 2위 + 3위']]){const o=el('option',t);o.value=String(n);select.append(o);}controls.append(select);controls.hidden=true;
const content=el('div');root.append(title,status,controls,content);
const dialog=el('dialog',null,'va-dialog'),close=el('button','닫기 ×'),body=el('div');close.type='button';close.onclick=()=>dialog.close();dialog.append(close,body);document.body.append(dialog);
function path(x){return /^\/workshop\/virus\/images\/[\w.-]+$/.test(x.local_image||'')?x.local_image:'';}
function details(x){body.replaceChildren();body.append(el('h3',x.virus||x.scientific_name));const im=el('img');im.src=path(x);im.alt=x.virus;body.append(im,el('p',x.scientific_name));for(const [h,t] of [['생물학적 현상',x.science],['작가의 예술적 해석',x.interpretation]])if(t)body.append(el('h4',h),el('p',t));body.append(el('p','이미지는 작가가 제공한 시각 자료이며, 생물학적 현상과 욕망의 연결은 예술적 해석입니다.'));if(x.research_url){try{const u=new URL(x.research_url);if(u.protocol==='https:'){const a=el('a','연구 자료');a.href=u.href;a.target='_blank';a.rel='noopener noreferrer';body.append(a);}}catch{}}dialog.showModal();}
function render(v){last=v;if(!data)return;const rev=++revision;content.replaceChildren();const pairs=rank(v.result?.scores,data.images,limit);controls.hidden=!pairs.length;status.hidden=!!pairs.length;if(!pairs.length){status.textContent='연결할 양수 점수가 없습니다.';return;}
const stack=el('div',null,'va-stack'),pending=el('p','이미지를 불러오는 중…','va-placeholder'),names=el('div',null,'va-names');stack.append(pending);let loaded=0,failed=0;
for(const [i,x] of pairs.entries()){const layer=el('div',null,'va-layer'),im=el('img');im.alt=x.item.virus;im.style.opacity=String(x.alpha);im.onload=()=>{if(rev!==revision)return;loaded++;pending.hidden=true;};im.onerror=()=>{if(rev!==revision)return;failed++;pending.hidden=false;pending.textContent=loaded?'일부 이미지를 불러오지 못했습니다.':failed===pairs.length?'이미지 경로를 확인해주세요.':'일부 이미지를 불러오는 중…';};im.src=path(x.item);layer.append(im);stack.append(layer);const b=el('button',x.item.virus||x.item.scientific_name);b.type='button';b.title=`${i+1}위 · 합성 비중 ${(x.alpha*100).toFixed(1)}%`;b.setAttribute('aria-label',b.textContent+' 상세 정보');b.onclick=()=>details(x.item);names.append(b);}
content.append(stack,names);}
select.onchange=()=>{limit=Number(select.value);if(last)render(last);};
document.addEventListener('workshop:result',e=>render(e.detail));
document.getElementById('wishForm')?.addEventListener('submit',()=>{revision++;last=null;content.replaceChildren();controls.hidden=true;status.hidden=false;status.textContent='소원을 분석하고 있어요…';});
fetch('/workshop/virus/virus_atlas.json?v=3').then(r=>{if(!r.ok)throw Error();return r.json();}).then(v=>{data=v;if(last)render(last);}).catch(()=>{status.hidden=false;status.textContent='바이러스 목록을 불러오지 못했어요. 배포된 파일 경로를 확인해주세요.';});
})();
