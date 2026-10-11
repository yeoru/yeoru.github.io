/* Audio decoding is local, without upload or recording permission. */
(function(root){
 const lengths=[.5,1,2];
 function segment(duration,random=Math.random){const allowed=lengths.filter(n=>n<=duration),length=allowed.length?allowed[Math.floor(random()*allowed.length)]:duration;return{duration:length,offset:Math.max(0,(duration-length)*random())};}
 class WishStoneSound{
  constructor(){this.context=null;this.buffer=null;this.enabled=true;this.sources=new Set();this.name='synthetic';this.volume=.48;}
  unlock(){try{if(!this.context){const AC=root.AudioContext||root.webkitAudioContext;if(!AC)return false;this.context=new AC();}if(this.context.state==='suspended')this.context.resume().catch(()=>{});return true;}catch{return false;}}
  async loadFile(file){if(file.size>40*1024*1024)throw new Error('audio_too_large');if(!this.unlock())throw new Error('audio_unavailable');const decoded=await this.context.decodeAudioData(await file.arrayBuffer());if(decoded.duration<.1||decoded.duration>600)throw new Error('audio_duration');this.stop();this.buffer=decoded;this.name=file.name;return decoded.duration;}
  async loadUrl(url){if(!url)return;this.unlock();const res=await fetch(url);if(!res.ok)throw new Error('audio_file_missing');this.buffer=await this.context.decodeAudioData(await res.arrayBuffer());this.name='bundled';}
  stop(){for(const source of this.sources)try{source.stop();}catch{}this.sources.clear();}
  setEnabled(value){this.enabled=value;if(!value)this.stop();else this.unlock();}
  synthetic(duration){
   const sr=this.context.sampleRate,b=this.context.createBuffer(1,Math.ceil(sr*duration),sr),out=b.getChannelData(0);
   for(let n=0;n<6;n++){const start=n===0?.015:Math.random()*(duration*.72),frequency=650+Math.random()*1850,decay=.018+Math.random()*.03;for(let i=Math.floor(start*sr);i<Math.min(out.length,(start+.19)*sr);i++){const t=i/sr-start,e=Math.exp(-t/decay);out[i]+=((Math.random()*2-1)*.46+Math.sin(t*frequency*6.283)*.24)*e*(n===0?.7:.3);}}
   for(let i=0;i<out.length;i++)out[i]=Math.max(-.8,Math.min(.8,out[i]));return b;
  }
  play(durationOverride){
   if(!this.enabled||!this.unlock()||this.context.state!=='running')return null;this.stop();const chosen=this.buffer?segment(this.buffer.duration):{duration:lengths[Math.floor(Math.random()*3)],offset:0};
   if(this.buffer&&[.5,1,2].includes(durationOverride)){chosen.duration=Math.min(durationOverride,this.buffer.duration);chosen.offset=Math.random()*Math.max(0,this.buffer.duration-chosen.duration);}
   const src=this.context.createBufferSource(),gain=this.context.createGain(),now=this.context.currentTime,fade=Math.min(.025,chosen.duration/5);src.buffer=this.buffer||this.synthetic(chosen.duration);gain.gain.setValueAtTime(0,now);gain.gain.linearRampToValueAtTime(this.volume,now+fade);gain.gain.setValueAtTime(this.volume,now+Math.max(fade,chosen.duration-.05));gain.gain.linearRampToValueAtTime(0,now+chosen.duration);
   src.connect(gain);gain.connect(this.context.destination);src.onended=()=>{this.sources.delete(src);src.disconnect();gain.disconnect();};this.sources.add(src);src.start(now,chosen.offset,chosen.duration);return{...chosen,source:this.buffer?'recording':'synthetic'};
  }
 }
 root.WishStoneSound=WishStoneSound;root.WishAudioSegment=segment;
})(window);
