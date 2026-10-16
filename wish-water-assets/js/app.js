(function(){
 'use strict';
 const $=id=>document.getElementById(id),D=window.WISH_DATA,C=window.WishCore,R=window.WISH_RUNTIME;
 const scene=new WishLandscape($('landscape')),sound=new WishStoneSound(),local=R.transport==='local';
 const music=new WishBackgroundMusic(sound,R.musicUrl,updateMusicButton);
 const MUSIC={ko:['♫ 음악 켜기','♫ 음악 끄기','음악을 불러오지 못했어요. 다시 눌러주세요.'],en:['♫ Music on','♫ Music off','Music could not load. Tap to retry.'],de:['♫ Musik an','♫ Musik aus','Musik nicht geladen. Erneut versuchen.'],ja:['♫ 音楽オン','♫ 音楽オフ','音楽を読み込めません。もう一度押してください。'],fr:['♫ Musique on','♫ Musique off','Musique indisponible. Réessaie.']};
 const AUDIO={ko:{enabled:'돌 소리 켜기',synthetic:'임시 합성 돌 소리',choose:'내 돌 소리 파일 선택',hint:'파일은 이 기기에서만 사용해요. 임의 구간을 0.5초·1초·2초로 재생합니다.',test:'소리 들어보기',loaded:'선택한 녹음 사용 중',error:'이 파일을 읽지 못했어요. WAV 또는 MP3로 다시 골라주세요.'},en:{enabled:'Stone sounds on',synthetic:'Temporary synthesized stone sound',choose:'Choose a stone recording',hint:'The file stays on this device. Random 0.5, 1 or 2 second excerpts will play.',test:'Listen',loaded:'Using your recording',error:'Could not read this file. Please try WAV or MP3.'},de:{enabled:'Steingeräusche einschalten',synthetic:'Vorläufiges synthetisches Steingeräusch',choose:'Steinaufnahme auswählen',hint:'Die Datei bleibt auf diesem Gerät. Zufällige Ausschnitte von 0,5, 1 oder 2 Sekunden werden abgespielt.',test:'Anhören',loaded:'Deine Aufnahme wird verwendet',error:'Datei nicht lesbar. Bitte WAV oder MP3 versuchen.'}};
 const I={
 ko:{about:'작품 안내',badge:'체험 시안 · AI 미연결',serverBadge:'서버 시험 · AI 미연결',liveBadge:'참여형 웹아트',specimen:'아직 이름 없는 물결',scene:'말 한 조각이, 돌 하나를 움직입니다.',introTitle:'너의 이야기로<br><em>물길을 열어줘.</em>',introDescription:'우리는 현재 어떻게 변이하고 있을까?',countryLabel:'어느 곳의 이야기를 들려줄래?',countryPlaceholder:'나라 · 문화적 배경 선택',otherCountry:'여러 곳 / 선택하지 않음',countryHint:'국적 대신, 오늘 이야기하고 싶은 곳을 골라도 좋아.',howTime:'30초마다 한 번',howPause:'잠시 멈춰도 괜찮아',howSkip:'건너뛰면 돌은 그대로',consentLabel:'작품 참여와 답변의 연구용 저장에 동의해요.',demoConsent:'동작 확인을 위한 체험에 참여할게요.',start:'물가에 앉기 ↗',answer:'너의 이야기',placeholder:'여기에 너의 이야기를 남겨줘…',pause:'Ⅱ 잠시 멈춤',resume:'▷ 다시 흐르기',skip:'이 돌은 남겨두기',send:'보내기 ↗',sending:'네 이야기가 물가에 닿는 중…',savedError:'이야기는 저장했어. 욕망 분석은 잠시 쉬어갈게.',paused:'시간을 멈췄어. 천천히 써도 괜찮아.',hidden:'자리를 비운 동안 시간을 멈췄어. 준비되면 다시 시작해줘.',ime:'쓰던 글자를 마무리하면 보내줄게.',retry:'연결이 잠시 끊겼어. 글은 이 탭에 남아 있어. 다시 연결해줘.',retryButton:'다시 연결하기',startError:'아직 연결되지 않았어. 잠시 후 다시 시작해줘.',reply:'네가 들려준 이야기를 물가에 놓아둘게.',missing:'이 돌은 그대로 두고, 다음 이야기로 갈게.',finalTitle:'너의 소원이<br><em>흐르기 시작했어.</em>',finalDescription:'남겨둔 돌들도 함께 떠올라. 네가 보낸 마음은 물결 속에 남아 있어.',emptyTitle:'물은 아직<br><em>기다리고 있어.</em>',emptyDescription:'마지막 소원이 비어 있었어. 준비되면 한 줄을 놓아줘.',wishAgain:'소원을 다시 놓기 ↗',trace:'남겨진 마음의 흔적',disclaimer:'이 비율은 작품 안에서 해석한 욕망의 비중이야. 심리검사나 객관적인 확률은 아니야.',demoDisclaimer:'체험 시안의 단어 규칙으로 만든 임시 비율이야. 실제 AI 분석과 연구 데이터가 아니야.',noEvidence:'지금의 말만으로 이름을 붙이지 않았어.',download:'내 기록 내려받기',restart:'새로운 물길',footer:'각자의 이야기가 만나는 물길.',aboutTitle:'물은 이야기를 기억해.',aboutText:'우리는 현재 어떻게 변이하고 있을까?',technical:'질문마다 30초. 시간이 끝나면 작성한 글을 보내고, 빈칸이면 건너뛰어. 일시정지 중에도 쓸 수 있어. AI는 답변을 받은 뒤 해석하며, 글자를 입력할 때마다 전송하지 않아.',demoPrivacy:'이 파일은 시안이야. 답변은 이 탭에서만 처리되고 외부 AI나 연구 서버에 보내지 않아. 새로고침하면 이 체험은 사라져.',serverPrivacy:'시험 데이터로 저장하며 실제 연구 통계에 포함하지 않아. 이름·연락처 등 개인정보는 적지 않아도 돼.',livePrivacy:'선택한 문화적 배경·답변·응답 시간·AI 해석을 양영주의 문화·욕망 연구를 위해 저장해. 답변은 해석을 위해 OpenAI API로 전달돼. 이름·연락처는 적지 말아줘. 건너뛰거나 언제든 창을 닫아 중단할 수 있어.',retention:'보관 기간',days:'일',contact:'문의·삭제 요청',receipt:'참여 기록 번호',remaining:'남은 돌',hint:'Enter 전송 · Shift+Enter 줄바꿈'},
 en:{about:'About',badge:'Preview · no AI',serverBadge:'Server test · no AI',liveBadge:'Participatory artwork',specimen:'An unnamed current',scene:'A fragment of a story moves one stone.',introTitle:'Let your words<br><em>open the water.</em>',introDescription:'How are we mutating now?',countryLabel:'Which place will your story come from?',countryPlaceholder:'Choose a cultural context',otherCountry:'Multiple places / prefer not to say',countryHint:'Choose a place you want to talk about. It does not have to be your nationality.',howTime:'30 seconds at a time',howPause:'Pause to stay longer',howSkip:'Skip, and a stone stays',consentLabel:'I agree to participate and to have my answers stored for this research.',demoConsent:'I would like to try this interaction preview.',start:'Sit by the water ↗',answer:'Your story',placeholder:'Leave a little of your story here…',pause:'Ⅱ Pause',resume:'▷ Resume',skip:'Leave this stone',send:'Send ↗',sending:'Your words are reaching the water…',savedError:'Your words are saved. The interpretation will rest for now.',paused:'Time is paused. Take your time writing.',hidden:'Time paused while you were away. Resume when you are ready.',ime:'Finish the character you are writing; then it will be sent.',retry:'The connection paused. Your words are still in this tab. Please reconnect.',retryButton:'Reconnect',startError:'We could not connect yet. Please try again.',reply:'I will leave your words beside the water.',missing:'This stone stays. Let us move to the next story.',finalTitle:'Your wish<br><em>is beginning to flow.</em>',finalDescription:'Even the stones left behind rise with it. Your words remain in the current.',emptyTitle:'The water<br><em>is still waiting.</em>',emptyDescription:'The last wish was empty. Leave a line when you are ready.',wishAgain:'Leave your wish ↗',trace:'Traces left in the water',disclaimer:'These are interpretive weights within an artwork, not a psychological test or objective probabilities.',demoDisclaimer:'These temporary weights come from simple preview keyword rules, not AI or research data.',noEvidence:'These words remain unnamed for now.',download:'Download my record',restart:'A new current',footer:'A current where our stories meet.',aboutTitle:'The water remembers stories.',aboutText:'How are we mutating now?',technical:'Each question has 30 seconds. At the end, your draft is sent; an empty answer is skipped. You can write while paused. AI interprets submitted answers, not individual keystrokes.',demoPrivacy:'This is a preview. Answers stay in this tab and are not sent to AI or a research server. Reloading clears the experience.',serverPrivacy:'Stored as test data, excluded from live research statistics. Please avoid names, contact details or identifying information.',livePrivacy:'Your selected cultural context, answers, response timing and AI interpretations are stored for Yang Yeongju’s research on culture and desire. Answers are sent to the OpenAI API for interpretation. Please do not enter names or contact details. You may skip or close the window at any time.',retention:'Retention',days:'days',contact:'Questions / deletion requests',receipt:'Participation record',remaining:'Stones remaining',hint:'Enter to send · Shift+Enter for a new line'},
 de:{about:'Über das Werk',badge:'Vorschau · ohne KI',serverBadge:'Servertest · ohne KI',liveBadge:'Partizipative Kunst',specimen:'Eine namenlose Strömung',scene:'Ein Stück deiner Geschichte bewegt einen Stein.',introTitle:'Deine Worte<br><em>öffnen das Wasser.</em>',introDescription:'Wie verändern wir uns gerade?',countryLabel:'Von welchem Ort möchtest du erzählen?',countryPlaceholder:'Kulturellen Bezug wählen',otherCountry:'Mehrere Orte / keine Angabe',countryHint:'Wähle einen Ort, von dem du erzählen möchtest. Es muss nicht deine Nationalität sein.',howTime:'Jeweils 30 Sekunden',howPause:'Zeit zum Pausieren',howSkip:'Überspringen lässt den Stein',consentLabel:'Ich stimme der Teilnahme und der Speicherung meiner Antworten für diese Forschung zu.',demoConsent:'Ich möchte diese Interaktionsvorschau ausprobieren.',start:'Ans Wasser setzen ↗',answer:'Deine Geschichte',placeholder:'Lass hier ein Stück deiner Geschichte zurück…',pause:'Ⅱ Pause',resume:'▷ Weiter',skip:'Diesen Stein lassen',send:'Senden ↗',sending:'Deine Worte erreichen das Wasser…',savedError:'Deine Worte sind gespeichert. Die Deutung macht gerade Pause.',paused:'Die Zeit steht still. Schreib in Ruhe.',hidden:'Während deiner Abwesenheit wurde pausiert. Starte wieder, wenn du bereit bist.',ime:'Beende das Zeichen, dann wird dein Text gesendet.',retry:'Die Verbindung wurde unterbrochen. Deine Worte sind noch in diesem Tab. Verbinde dich erneut.',retryButton:'Erneut verbinden',startError:'Die Verbindung fehlt noch. Bitte versuche es erneut.',reply:'Ich lege deine Worte ans Wasser.',missing:'Dieser Stein bleibt. Gehen wir zur nächsten Geschichte.',finalTitle:'Dein Wunsch<br><em>beginnt zu fließen.</em>',finalDescription:'Auch die verbliebenen Steine steigen auf. Deine Worte bleiben in der Strömung.',emptyTitle:'Das Wasser<br><em>wartet noch.</em>',emptyDescription:'Der letzte Wunsch war leer. Lass eine Zeile zurück, wenn du bereit bist.',wishAgain:'Deinen Wunsch ablegen ↗',trace:'Spuren im Wasser',disclaimer:'Die Anteile sind künstlerische Deutungen, kein psychologischer Test und keine objektiven Wahrscheinlichkeiten.',demoDisclaimer:'Diese vorläufigen Anteile stammen aus einfachen Stichwortregeln, nicht aus KI oder Forschungsdaten.',noEvidence:'Diese Worte bleiben vorerst ohne Namen.',download:'Meinen Eintrag herunterladen',restart:'Eine neue Strömung',footer:'Eine Strömung, in der Geschichten einander begegnen.',aboutTitle:'Das Wasser erinnert sich.',aboutText:'Wie verändern wir uns gerade?',technical:'Jede Frage hat 30 Sekunden. Danach wird der geschriebene Text gesendet; eine leere Antwort wird übersprungen. In der Pause kannst du weiterschreiben. Die KI deutet gesendete Antworten, nicht jeden Tastendruck.',demoPrivacy:'Dies ist eine Vorschau. Antworten bleiben in diesem Tab und werden nicht an KI oder einen Forschungsserver gesendet. Neuladen löscht das Erlebnis.',serverPrivacy:'Als Testdaten gespeichert und nicht in die Forschung einbezogen. Bitte keine Namen, Kontaktdaten oder identifizierenden Angaben eingeben.',livePrivacy:'Der gewählte kulturelle Bezug, Antworten, Antwortzeiten und KI-Deutungen werden für Yang Yeongjus Forschung zu Kultur und Wünschen gespeichert. Antworten werden zur Deutung an die OpenAI API gesendet. Bitte keine Namen oder Kontaktdaten eingeben. Du kannst Fragen überspringen oder jederzeit das Fenster schließen.',retention:'Speicherdauer',days:'Tage',contact:'Fragen / Löschanfragen',receipt:'Teilnahmebeleg',remaining:'Verbliebene Steine',hint:'Enter sendet · Shift+Enter für neue Zeile'}
 };
 Object.assign(I,window.WISH_EXTRA_LOCALES.interface);
 for(const [l,values] of Object.entries({
  ko:['AI와 대화 중','아직 소원을 읽을 수 없었어. 준비되면 다시 들려줘.','글은 저장했어. 연결 문제라서 돌은 그대로야. 잠시 후 다시 보내줘.','AI 연결 안내가 갱신됐어요. 아래 내용을 확인하고 다시 동의해 주세요.'],
  en:['Conversation with AI','I could not read your wish yet. Try again when you are ready.','Your words are saved. A connection problem left the stone in place. Please send again shortly.','The AI notice has changed. Please read it and agree again.'],
  de:['Gespräch mit KI','Deinen Wunsch konnte ich noch nicht lesen. Versuch es erneut, wenn du bereit bist.','Deine Worte sind gespeichert. Wegen der Verbindung bleibt der Stein. Sende sie gleich erneut.','Der KI-Hinweis wurde aktualisiert. Bitte lies ihn und stimme erneut zu.'],
  ja:['AIと対話中','まだ願いを読み取れなかったよ。準備ができたら、また聞かせてね。','言葉は保存したよ。接続の問題で石は残っているよ。少し待って再送してね。','AIの案内を更新しました。確認して、もう一度同意してください。'],
  fr:['Dialogue avec l’IA','Je n’ai pas encore pu lire ton souhait. Réessaie quand tu veux.','Tes mots sont enregistrés. Un problème de connexion laisse la pierre en place. Renvoie-les dans un instant.','L’avis sur l’IA a changé. Lis-le et confirme à nouveau ton accord.']
 }))['liveBadge','emptyDescription','savedError','reconsent'].forEach((k,i)=>I[l][k]=values[i]);
 Object.assign(AUDIO,window.WISH_EXTRA_LOCALES.audio);
 const FLAG_COPY={ko:{title:'어느 곳의 이야기를<br><em>흘려보낼까?</em>',hint:'국기를 고르면 물가로 이동해요. 국적 대신, 이야기하고 싶은 곳을 골라도 좋아.',search:'나라 이름으로 국기 찾기',change:'다시 고르기',empty:'일치하는 국기가 없어요.',bundled:'첨부한 돌 마찰음',audioError:'돌 소리를 불러오지 못했어요. 파일을 다시 선택해 주세요.'},en:{title:'Where does<br><em>your story begin?</em>',hint:'Choose a flag to reach the water. Choose the place you want to talk about.',search:'Find a flag by country name',change:'Choose again',empty:'No matching flags.',bundled:'Your stone friction recording',audioError:'Could not load the recording. Please choose the file again.'},de:{title:'Wo beginnt<br><em>deine Geschichte?</em>',hint:'Wähle eine Flagge, um ans Wasser zu kommen. Erzähle von einem Ort deiner Wahl.',search:'Flagge nach Ländernamen suchen',change:'Neu wählen',empty:'Keine passende Flagge.',bundled:'Deine Steinaufnahme',audioError:'Aufnahme nicht geladen. Bitte Datei erneut auswählen.'}};
 Object.assign(FLAG_COPY,window.WISH_EXTRA_LOCALES.flags);
 for(const [l,values] of Object.entries({ko:["물이 기다리고 있어","가는 물줄기가 길을 찾아","물살이 점점 커져","물이 흐르고 있어"],en:["THE WATER IS WAITING","A TRICKLE FINDS ITS WAY","THE CURRENT IS GROWING","THE WATER IS FLOWING"],de:["Das Wasser wartet","Ein Rinnsal findet seinen Weg","Die Strömung wird stärker","Das Wasser fließt"]})) ["waiting","trickle","growing","flowing"].forEach((k,i)=>I[l][k]=values[i]);
 let audioLoading=null;
 function loadBundledSound(){sound.unlock();if(!R.stoneAudioUrl||sound.buffer)return Promise.resolve();if(!audioLoading)audioLoading=sound.loadUrl(R.stoneAudioUrl).then(()=>setText('soundStatus',FLAG_COPY[lang].bundled)).catch(()=>{audioLoading=null;setText('soundStatus',FLAG_COPY[lang].audioError);});return audioLoading;}
 function showCountryGate(){if(s)return;$('countryGate').hidden=false;$('landscapeSection').hidden=true;$('welcome').hidden=true;renderFlags();}
 function chooseCountry(code){$('country').value=code;$('countryGate').hidden=true;$('landscapeSection').hidden=false;$('welcome').hidden=false;updateSelectedCountry();ready();loadBundledSound();music.start();$('startButton').focus({preventScroll:true});}
 function updateSelectedCountry(){const code=$('country').value;setText('selectedCountry',code?countryName(code):'');const flag=D.flags?.[code];$('selectedFlag').hidden=!flag;if(flag)$('selectedFlag').src=flag.src;}
 function renderFlags(){
  const query=$('flagSearch').value.trim().toLocaleLowerCase(lang),items=Object.keys(D.flags||{}).filter(code=>[countryName(code),code,D.flags[code].name_ko,D.flags[code].name_en].some(v=>v?.toLocaleLowerCase(lang).includes(query))).sort((a,b)=>countryName(a).localeCompare(countryName(b),lang));
  const buttons=items.map(code=>{const button=document.createElement('button');button.type='button';button.className='flag-card';button.setAttribute('aria-label',countryName(code));button.title=countryName(code);button.setAttribute('data-country',code);const img=document.createElement('img');img.src=D.flags[code].src;img.alt='';img.loading='eager';const label=document.createElement('span');label.textContent=countryName(code);button.append(img,label);button.addEventListener('click',()=>chooseCountry(code));return button;});
  $('flagGrid').replaceChildren(...buttons);$('flagEmpty').hidden=items.length>0;
 }

 let lang='ko',s=null,phase='welcome',paused=false,active=0,pauseMs=0,pauseCount=0,last=performance.now(),composing=false,expirePending=false,pending=null,flashTimer=null;
 let auth=null,history=[],records=[],counters={},flashUsed=false,answers=[],wishText='';
 const T=()=>I[lang],uuid=()=>crypto.randomUUID?crypto.randomUUID():Date.now().toString(16)+'-'+Math.random().toString(16).slice(2);
 const setText=(id,value)=>$(id).textContent=value;
 function updateMusicButton(){const b=$('musicButton'),t=MUSIC[lang];b.textContent=t[music.playing?1:0];b.setAttribute('aria-pressed',String(music.playing));b.title=music.error?t[2]:'';}
 function countryName(code){if(code==='ZZ')return T().otherCountry;if(lang==='ko'&&D.flags?.[code]?.name_ko)return D.flags[code].name_ko;try{return new Intl.DisplayNames([lang],{type:'region'}).of(code);}catch{return code;}}
 function applyLanguage(){
  lang=$('language').value;document.documentElement.lang=lang;const t=T(),old=$('country').value;
  const f=FLAG_COPY[lang];$('flagTitle').innerHTML=f.title;setText('flagHint',f.hint);$('flagSearch').placeholder=f.search;setText('flagSearchLabel',f.search);setText('changeCountry',f.change);setText('flagEmpty',f.empty);setText('otherCountryButton',t.otherCountry);renderFlags();updateSelectedCountry();
  for(const id of ['countryLabel','countryHint','howTime','howPause','howSkip'])setText(id,t[id]);
  $('introTitle').innerHTML=t.introTitle;$('introDescription').innerHTML=t.introDescription;
  setText('aboutButton',t.about);setText('modeBadge',R.mode==='live'?t.liveBadge:local?t.badge:t.serverBadge);
  setText('sceneState',t.waiting);setText('specimenCaption',t.specimen);setText('sceneCaption',t.scene);setText('startButton',t.start);
  setText('consentLabel',R.mode==='live'?t.consentLabel:t.demoConsent);
  let privacy=local?t.demoPrivacy:R.mode==='demo'?t.serverPrivacy:t.livePrivacy;
  if(!local)privacy+=` ${t.retention}: ${R.retentionDays} ${t.days}.`;
  if(R.contact)privacy+=` ${t.contact}: ${R.contact}`;
  setText('privacyNote',privacy);setText('aboutContact',privacy);
  setText('aboutTitle',t.aboutTitle);setText('aboutText',t.aboutText);setText('aboutTechnical',t.technical);
  setText('answerLabel',t.answer);$('answer').placeholder=t.placeholder;
  setText('pauseButton',t.pause);setText('skipButton',t.skip);setText('sendButton',t.send);setText('inputHint',t.hint);
  setText('traceTitle',t.trace);setText('downloadButton',t.download);setText('restartButton',t.restart);setText('footerNote',t.footer);
  setText('retryButton',t.retryButton);setText('wishAgain',t.wishAgain);
  const a=AUDIO[lang];setText('soundLabel',a.enabled);setText('soundStatus',sound.buffer?(sound.name==='bundled'?FLAG_COPY[lang].bundled:a.loaded):R.stoneAudioUrl?FLAG_COPY[lang].bundled:a.synthetic);setText('audioFileLabel',a.choose);setText('audioHint',a.hint);setText('testSound',a.test);
  updateMusicButton();
 }
 function saveMeta(){if(local)return;try{sessionStorage.setItem('wish-water-session',JSON.stringify({auth,lang,active,pauseMs,pauseCount,pending,answers,wishText}));}catch{/* Storage may be unavailable; in-memory flow still works. */}}
 function clearMeta(){try{sessionStorage.removeItem('wish-water-session');}catch{}}
 async function api(path,body){
  const options={method:body?'POST':'GET',headers:{'Content-Type':'application/json'},signal:AbortSignal.timeout(26000)};
  if(auth){options.headers['X-Session-Id']=auth.session_id;options.headers['X-Session-Token']=auth.session_token;}
  if(body)options.body=JSON.stringify(body);
  const response=await fetch(R.apiBase+path,options);if(!response.ok)throw new Error('connection_failed');return response.json();
 }
 let configPromise=null;
 function syncConfig(){
  if(local)return Promise.resolve();
  if(!configPromise)configPromise=api('/config').then(config=>{
   if(!['live','demo'].includes(config.mode))throw new Error('invalid_config');
   const changed=R.mode!==config.mode;Object.assign(R,{mode:config.mode,contact:config.contact,retentionDays:config.retentionDays});
   if(!s){applyLanguage();if(changed){$('consent').checked=false;ready();setText('startError',T().reconsent);}}
  }).finally(()=>{configPromise=null;});
  return configPromise;
 }
 function displayImage(path,label){if(!path)return;const key=label||'STAB_02',paths=D.assets[key]||[],index=paths.findIndex(p=>p===path||p.endsWith('/'+path));scene.setArtwork(index<0?path:paths[index],label,D.assetBounds?.[key]?.[Math.max(0,index)]);if(label){const item=D.taxonomy.find(t=>t.id===label);setText('specimenCaption',`${String(item.number).padStart(2,'0')} / ${item['name_'+lang]}`);}}
 function renderState(){
  setText('stoneCount',`${String(s.accepted_count).padStart(2,'0')} / 09`);
  setText('questionStep',`${String(s.next_index+1).padStart(2,'0')} / 09`);setText('contextLabel',countryName(s.country));
  $('progressDots').replaceChildren(...D.questions.map((q,i)=>{const dot=document.createElement('span');dot.className=answers[i]===true?'answered':answers[i]===false?'skipped':i===s.next_index?'current':'';return dot;}));
  if(s.image)displayImage(s.image,s.leader);
 }
 function enableForm(enabled){$('answer').readOnly=!enabled;for(const id of ['sendButton','pauseButton','skipButton'])$(id).disabled=!enabled;}
 function ask(reset=true){
  phase='asking';paused=false;if(reset){active=0;pauseMs=0;pauseCount=0;$('answer').value='';setText('charCount','0 / 3000');}
  expirePending=false;$('welcome').hidden=true;$('ending').hidden=true;$('talk').hidden=false;$('retryBox').hidden=true;
  setText('question',s.question);setText('statusMessage','');setText('pauseButton',T().pause);enableForm(true);renderState();saveMeta();
  // Preserve the active input across async turns, including mobile keyboards.
  $('answer').focus({preventScroll:true});
 }
 async function start(){
  loadBundledSound();music.start();
  $('startButton').disabled=true;setText('startError','');
  try{
   if(local){s={revision:0,next_index:0,question:D.questions[0][lang],accepted_count:0,cumulative:null,leader:null,image:null,completed:false,final_empty:false,locale:lang,country:$('country').value};}
   else {await syncConfig();if(!$('consent').checked){ready();return;}const response=await api('/session',{country:$('country').value,locale:lang,consent:true});auth={session_id:response.session_id,session_token:response.session_token};s=response;}
   $('language').disabled=true;ask();
  }catch{setText('startError',T().startError);$('startButton').disabled=false;}
 }
 function localTurn(req){
  const text=req.trigger==='skip'?'':req.text.trim(),idx=s.next_index,final=idx===8,v=text?C.classify(text):null;
  if(!final&&v)history.push(v);const cumulative=C.combine(history,final?v:null),winner=C.leader(cumulative,s.leader),flash=C.flash(v,flashUsed,final);flashUsed||=flash;
  if(text)s.accepted_count++;
  const record={session_mode:'local_demo',question_id:D.questions[idx].id,question_presented:s.question,country:s.country,ui_language:lang,
   text,instantaneous:v,cumulative,missing_reason:text?null:req.trigger==='skip'?'manual_skip':'timeout_empty',
   analysis_status:text?'demo':'missing',cultural_observations:[],...req};records.push(record);
  return {...s,revision:s.revision+1,next_index:final?idx:idx+1,question:final?(text?'':D.questions[8][lang]):D.questions[idx+1][lang],
   cumulative,leader:winner,image:text?C.image(winner,counters)||s.image:s.image,completed:!!(final&&text),final_empty:!!(final&&!text),
   accepted:!!text,reply:text?T().reply:T().missing,instantaneous:v,analysis_status:text?'demo':'missing',flash_image:flash?C.image('DESTR_01',{},'random'):null};
 }
 async function transmit(){
  phase='sending';enableForm(false);$('retryBox').hidden=true;setText('statusMessage',T().sending);saveMeta();
  try{
   const oldIdx=s.next_index,before=s.accepted_count;
   const result=local?localTurn(pending):await api('/turn',pending);
   if(result.analysis_status!=='error')answers[oldIdx]=result.accepted;
   if(oldIdx===8&&result.accepted)wishText=pending.text;
   if(!local)records.push({question_id:D.questions[oldIdx].id,input:pending.text,...result});
   const submittedText=pending.text;
   s=result;if(result.accepted&&scene.remove(before)){sound.play();setText('sceneState',s.accepted_count<=5?T().waiting:s.accepted_count<8?T().trickle:T().growing);}pending=null;setText('reply',result.reply);renderState();
   if(result.completed||result.final_empty)finish();else{ask();if(result.analysis_status==='error'){$('answer').value=submittedText;setText('charCount',`${submittedText.length} / 3000`);pause('paused');setText('statusMessage',T().savedError);}}
   if(result.flash_image){clearTimeout(flashTimer);displayImage(result.flash_image,'DESTR_01');flashTimer=setTimeout(()=>displayImage(s.image,s.leader),1200);}
   saveMeta();
  }catch{
   phase='error';setText('statusMessage','');setText('retryMessage',T().retry);$('retryBox').hidden=false;saveMeta();
  }
 }
 function submit(trigger){
  if(phase!=='asking')return;
  if(composing&&trigger!=='skip'){expirePending=true;setText('statusMessage',T().ime);return;}
  if(trigger==='manual'&&!$('answer').value.trim())return;
  pending={turn_id:uuid(),revision:s.revision,text:trigger==='skip'?'':$('answer').value,trigger,active_ms:Math.round(Math.min(active,30000)),paused_ms:Math.round(pauseMs),pause_count:pauseCount};
  transmit();
 }
 function pause(reason){if(phase!=='asking'||paused)return;paused=true;pauseCount++;setText('pauseButton',T().resume);setText('statusMessage',T()[reason]||T().paused);saveMeta();}
 function finish(){
  phase='ending';$('talk').hidden=true;$('ending').hidden=false;enableForm(false);clearTimeout(flashTimer);
  const complete=s.completed;$('endTitle').innerHTML=complete?T().finalTitle:T().emptyTitle;
  setText('endDescription',complete?T().finalDescription:s.analysis_status==='rejected'?s.reply:T().emptyDescription);setText('wishEcho',complete?wishText:'');
  $('wishAgain').hidden=complete;$('traceDetails').hidden=!complete;
  if(complete){const delays=scene.release()||[];for(const delay of delays)setTimeout(()=>{if(phase==='ending'&&!document.hidden)sound.play(.5);},delay);setText('sceneState',T().flowing);}
  const bars=$('scoreBars');bars.replaceChildren();
  const sorted=s.cumulative?Object.entries(s.cumulative).filter(([,v])=>v>0).sort((a,b)=>b[1]-a[1]).slice(0,3):[];
  for(const [id,v] of sorted){const row=document.createElement('div');row.className='score-row';const name=document.createElement('span');name.textContent=D.taxonomy.find(t=>t.id===id)['name_'+lang];const track=document.createElement('div');track.className='score-track';const fill=document.createElement('div');fill.className='score-value';fill.style.width=(v*100)+'%';track.append(fill);const percent=document.createElement('span');percent.className='score-number';percent.textContent=(v*100).toFixed(1)+'%';row.append(name,track,percent);bars.append(row);}
  if(!sorted.length)bars.textContent=T().noEvidence;
  setText('scoreDisclaimer',R.mode==='live'?T().disclaimer:T().demoDisclaimer);
  setText('sessionReceipt',auth?`${T().receipt}: ${auth.session_id}`:'');saveMeta();
 }
 let lastSave=0;
 function clock(t){
  const delta=Math.max(0,t-last);last=t;
  if(phase==='asking'&&!document.hidden){
   if(paused)pauseMs+=delta;else if(!expirePending){active+=delta;if(active>=30000)submit('timeout');}
   const elapsed=Math.min(30,active/1000);setText('timerNumber',Math.max(0,Math.ceil(30-elapsed))+'s');$('waterFill').style.width=(elapsed/30*100)+'%';
   document.querySelector('.water-timer').setAttribute('aria-valuenow',String(Math.floor(elapsed)));
   if(t-lastSave>1000){lastSave=t;saveMeta();}
  }
  requestAnimationFrame(clock);
 }
 // UI bindings keep untrusted participant/model text out of innerHTML.
 $('language').addEventListener('change',applyLanguage);
 $('flagSearch').addEventListener('input',renderFlags);$('changeCountry').addEventListener('click',showCountryGate);$('otherCountryButton').addEventListener('click',()=>chooseCountry('ZZ'));
 function ready(){$('startButton').disabled=!($('country').value&&$('consent').checked);}
 $('consent').addEventListener('change',ready);$('startButton').addEventListener('click',start);
 $('answerForm').addEventListener('submit',event=>{event.preventDefault();submit('manual');});
 $('answer').addEventListener('input',()=>setText('charCount',`${$('answer').value.length} / 3000`));
 $('answer').addEventListener('compositionstart',()=>composing=true);
 $('answer').addEventListener('compositionend',()=>{composing=false;if(expirePending){expirePending=false;setTimeout(()=>submit('timeout'),0);}});
 $('answer').addEventListener('keydown',event=>{if(event.key==='Enter'&&!event.shiftKey&&!event.isComposing&&!composing&&event.keyCode!==229){event.preventDefault();submit('manual');}});
 $('pauseButton').addEventListener('click',()=>{loadBundledSound();if(paused){paused=false;setText('pauseButton',T().pause);setText('statusMessage','');last=performance.now();}else pause('paused');});
 $('skipButton').addEventListener('click',()=>submit('skip'));$('retryButton').addEventListener('click',transmit);
 $('wishAgain').addEventListener('click',()=>ask());
 document.addEventListener('visibilitychange',()=>{if(document.hidden){pause('hidden');sound.stop();music.suspend();}else music.resume();last=performance.now();});
 $('musicButton').addEventListener('click',()=>music.toggle());
 $('restartButton').addEventListener('click',()=>{clearMeta();location.reload();});
 $('aboutButton').addEventListener('click',()=>$('aboutDialog').showModal());$('closeAbout').addEventListener('click',()=>$('aboutDialog').close());
 $('aboutDialog').addEventListener('click',event=>{if(event.target===$('aboutDialog'))$('aboutDialog').close();});
 $('soundEnabled').addEventListener('change',()=>sound.setEnabled($('soundEnabled').checked));
 $('stoneAudioFile').addEventListener('change',async()=>{const file=$('stoneAudioFile').files?.[0];if(!file)return;setText('soundStatus','…');try{await sound.loadFile(file);setText('soundStatus',AUDIO[lang].loaded+' · '+file.name);}catch{setText('soundStatus',AUDIO[lang].error);}});
 $('testSound').addEventListener('click',async()=>{sound.unlock();if(sound.context?.state==='suspended')await sound.context.resume();await loadBundledSound();sound.play();});
 $('downloadButton').addEventListener('click',()=>{const blob=new Blob([JSON.stringify({version:D.version,mode:R.mode,session_id:auth?.session_id||'local-preview',country:s.country,language:lang,cumulative:s.cumulative,turns:records},null,2)],{type:'application/json'}),url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download='wish-water-my-record.json';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);});
 async function restore(){
  if(local)return;
  try{const stored=JSON.parse(sessionStorage.getItem('wish-water-session')||'null');if(!stored?.auth)return;auth=stored.auth;lang=stored.lang;$('language').value=lang;applyLanguage();s=await api('/session');records=s.turns||[];answers=stored.answers||[];wishText=stored.wishText||'';active=stored.active||0;pauseMs=stored.pauseMs||0;pauseCount=stored.pauseCount||0;pending=stored.pending;
   $('language').disabled=true;$('countryGate').hidden=true;$('landscapeSection').hidden=false;$('welcome').hidden=true;scene.restore(s.accepted_count,s.completed);
   if(pending){$('talk').hidden=false;setText('question',s.question);$('answer').value=pending.text;renderState();transmit();}
   else if(s.completed||s.final_empty){renderState();finish();}else{ask(false);pause('hidden');}
  }catch{auth=null;clearMeta();}
 }
 applyLanguage();displayImage(D.assets.STAB_02[0],null);
 if(local)restore();else syncConfig().then(restore).catch(()=>setText('startError',T().startError));
 requestAnimationFrame(clock);
})();
