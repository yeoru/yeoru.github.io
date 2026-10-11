(function(root){
 'use strict';
 const data=root.WISH_DATA,labels=data.taxonomy.map(t=>t.id);
 function norm(v){let sum=labels.reduce((s,k)=>s+(v[k]||0),0);return sum?Object.fromEntries(labels.map(k=>[k,(v[k]||0)/sum])):null;}
 function mean(xs){xs=xs.filter(Boolean);return xs.length?norm(Object.fromEntries(labels.map(k=>[k,xs.reduce((s,x)=>s+x[k],0)/xs.length]))):null;}
 function combine(history,wish){const prior=mean(history);return wish&&prior?norm(Object.fromEntries(labels.map(k=>[k,.5*wish[k]+.5*prior[k]]))):wish||prior;}
 function leader(v,previous){if(!v)return null;const max=Math.max(...Object.values(v));const ties=labels.filter(k=>Math.abs(v[k]-max)<1e-9);return ties.includes(previous)?previous:ties[0];}
 function flash(v,used,final){return !!(v&&!used&&!final&&v.DESTR_01>=.85&&v.DESTR_01-Math.max(...labels.filter(k=>k!=='DESTR_01').map(k=>v[k]))>=.35);}
 function classify(text){const low=text.toLowerCase(),v={};data.taxonomy.forEach(t=>v[t.id]=t.keywords.filter(w=>low.includes(w.toLowerCase())).length);if(/전쟁.*(걱정|무서|끝|없)|war.*(end|afraid|worr)|krieg.*(angst|enden)/i.test(low)){v.DESTR_01=0;v.PEACE_15+=2;v.STAB_02+=1;}return norm(v);}
 function image(label,counters,mode='sequential'){const paths=data.assets[label];if(!paths?.length)return null;let n=counters[label]||0;const i=mode==='random'?Math.floor(Math.random()*paths.length):n%paths.length;counters[label]=n+1;return paths[i];}
 root.WishCore={norm,mean,combine,leader,flash,classify,image};
})(typeof window!=='undefined'?window:globalThis);
