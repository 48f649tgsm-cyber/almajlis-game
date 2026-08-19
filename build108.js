/* Almajlis BUILD 108 — Final combined build: iPhone audio + landscape + career display + TV game-show visuals */
(function(){
'use strict';
const BUILD='108';
window.ALMAJLIS_BUILD=BUILD;
const $=id=>document.getElementById(id);
const $$=(sel,root=document)=>Array.from(root.querySelectorAll(sel));
let ambientPrimed=false,priming=false;

/* ===== Core fixes carried forward from BUILD 107 ===== */
function fullAudio(){try{return (localStorage.getItem('audioMode')||'full')==='full'}catch(e){return true}}
function ambientEl(){let a=$('majlisThemeAmbient');if(!a&&typeof window.getThemeAudio==='function'){try{a=window.getThemeAudio('ambient')}catch(e){}}return a}
function primeAmbient(){
  if(ambientPrimed||priming||!fullAudio())return;
  const a=ambientEl();if(!a)return;priming=true;
  const muted=a.muted,vol=a.volume,loop=a.loop;
  try{
    a.muted=true;a.volume=0;a.loop=false;try{a.currentTime=19}catch(e){}
    const p=a.play();
    if(p&&p.then)p.then(()=>{try{a.pause();a.currentTime=19}catch(e){}a.muted=muted;a.volume=vol||.16;a.loop=loop;ambientPrimed=true;priming=false}).catch(()=>{a.muted=muted;a.volume=vol;a.loop=loop;priming=false});
    else{try{a.pause()}catch(e){}a.muted=muted;a.volume=vol||.16;a.loop=loop;ambientPrimed=true;priming=false}
  }catch(e){try{a.muted=muted;a.volume=vol;a.loop=loop}catch(_){}priming=false}
}
function gameScreenActive(){return ['teams','cats','boardScreen','questionScreen','answerScreen','tieScreen'].some(id=>$(id)?.classList.contains('active'))}
function resumeAmbient(){
  if(!fullAudio())return;
  try{if(typeof window.ensureAmbientMusic==='function'){window.ensureAmbientMusic();return}}catch(e){}
  const a=ambientEl();if(!a)return;
  try{a.muted=false;a.loop=true;a.volume=.16;if(a.paused){if(!Number.isFinite(a.currentTime)||a.currentTime<18)a.currentTime=19;const p=a.play();if(p?.catch)p.catch(()=>{})}}catch(e){}
}
['pointerdown','touchstart','click'].forEach(t=>document.addEventListener(t,primeAmbient,{capture:true,passive:true}));
window.startQuestionMusic=function(){if(fullAudio())resumeAmbient()};
window.stopQuestionMusic=function(){};
document.addEventListener('click',()=>setTimeout(()=>{if(gameScreenActive())resumeAmbient()},45),true);
document.addEventListener('visibilitychange',()=>{if(!document.hidden)setTimeout(()=>{if(gameScreenActive())resumeAmbient()},90)});

function applyViewport(){
  const v=window.visualViewport,w=Math.round(v?.width||innerWidth||document.documentElement.clientWidth),h=Math.round(v?.height||innerHeight||document.documentElement.clientHeight);if(!w||!h)return;
  const r=document.documentElement;r.style.setProperty('--app-width',w+'px');r.style.setProperty('--app-height',h+'px');r.style.setProperty('--vh',(h*.01)+'px');
  r.classList.toggle('build108-landscape',w>h);document.body?.classList.toggle('build108-landscape',w>h);
  try{if(typeof window.paintBoardScore==='function'&&$('boardScreen')?.classList.contains('active'))window.paintBoardScore()}catch(e){}
}
addEventListener('orientationchange',()=>{applyViewport();setTimeout(applyViewport,60);setTimeout(applyViewport,220)});
addEventListener('resize',applyViewport,{passive:true});
if(window.visualViewport){visualViewport.addEventListener('resize',applyViewport,{passive:true});visualViewport.addEventListener('scroll',applyViewport,{passive:true})}

function esc(s){return String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))}
function careerParts(raw){
  const t=String(raw||'').replace(/<br\s*\/?>/gi,' ← ').replace(/<[^>]+>/g,' ').replace(/\s+/g,' ').trim()
    .replace(/^(?:مسيرة\s+لاعب\s*[:：-]?|تعرف\s+على\s+اللاعب\s+من\s+مسيرته\s*[:：-]?)/i,'')
    .replace(/(?:من\s+هو\s+اللاعب\??|من\s+اللاعب\??)\s*$/i,'').trim();
  return t.split(/\s*(?:←|→|➡|➜|--?>)\s*/).map(x=>x.trim()).filter(x=>/(?:19|20)\d{2}/.test(x));
}
function careerRow(p){const years=p.match(/(?:19|20)\d{2}/g)||[];if(!years.length)return{club:p,period:''};const i=p.indexOf(years[0]),club=p.slice(0,i).replace(/[\s(\[\-–—:،]+$/,'').trim();const end=/الآن|حتى الآن|present/i.test(p)?'الآن':(years[years.length-1]||years[0]);return{club:club||p,period:years[0]+' – '+end}}
function formatCareer(){
  const q=$('qText'),cat=($('qCat')?.textContent||'').trim();if(cat!=='مسيرة لاعب'||!q||q.dataset.build108Career==='1')return;
  const parts=careerParts(q.innerHTML||q.textContent);if(parts.length<2)return;
  const rows=parts.map((p,i)=>{const x=careerRow(p);return '<li><span class="careerIndex">'+(i+1)+'</span><span class="careerClub">'+esc(x.club)+'</span><span class="careerPeriod">'+esc(x.period)+'</span></li>'}).join('');
  q.innerHTML='<div class="careerTitle">مسيرة اللاعب كاملة</div><ol class="careerTimeline">'+rows+'</ol><div class="careerAsk">من هو اللاعب؟</div>';
  q.dataset.build108Career='1';q.classList.remove('qLong','qShort');q.classList.add('careerQuestion108');
}
function watchCareer(){const q=$('qText');if(!q)return;new MutationObserver(()=>requestAnimationFrame(formatCareer)).observe(q,{childList:true,subtree:true,characterData:true});document.addEventListener('click',e=>{if(e.target.closest('[onclick*="openQuestion"]')){q.dataset.build108Career='0';q.classList.remove('careerQuestion108');setTimeout(formatCareer,80)}},true)}

/* ===== BUILD 108 final TV game-show visual layer ===== */
function styles(){
  if($('build108Styles'))return;
  const s=document.createElement('style');s.id='build108Styles';s.textContent=`
  :root{
    --b108-radius:20px;
    --b108-radius-sm:14px;
    --b108-shadow:0 14px 45px rgba(0,0,0,.22);
    --b108-soft:0 7px 22px rgba(0,0,0,.14);
    --b108-glow:0 0 0 1px rgba(255,255,255,.24),0 0 26px rgba(255,255,255,.10);
  }
  html,body{min-height:var(--app-height,100dvh)}
  body{background:
    radial-gradient(circle at 50% -15%,rgba(255,255,255,.96) 0,rgba(255,255,255,.72) 28%,rgba(245,247,251,.96) 63%,rgba(237,240,246,1) 100%)!important;
    color:#111!important}
  .screen{position:relative;isolation:isolate}
  .screen.active{animation:b108ScreenIn .34s cubic-bezier(.2,.8,.2,1) both}
  .screen.active:before{content:"";position:fixed;inset:0;pointer-events:none;z-index:-1;background:
    radial-gradient(circle at 12% 14%,rgba(255,255,255,.76),transparent 25%),
    radial-gradient(circle at 88% 8%,rgba(255,255,255,.62),transparent 22%)}
  @keyframes b108ScreenIn{from{opacity:.35;transform:translateY(9px) scale(.994)}to{opacity:1;transform:none}}
  @keyframes b108Pop{0%{transform:scale(.96);opacity:.3}65%{transform:scale(1.018);opacity:1}100%{transform:scale(1)}}
  @keyframes b108Pulse{0%,100%{transform:scale(1)}50%{transform:scale(1.025)}}
  @keyframes b108Sweep{0%{transform:translateX(-140%) skewX(-20deg);opacity:0}20%{opacity:.35}100%{transform:translateX(240%) skewX(-20deg);opacity:0}}

  /* Header / title treatment */
  h1,h2,.title,.screenTitle,#qCat{letter-spacing:.01em}
  #qCat{display:inline-flex!important;align-items:center;justify-content:center;min-height:38px;padding:7px 18px!important;border-radius:999px!important;background:rgba(17,17,17,.92)!important;color:#fff!important;box-shadow:var(--b108-soft)!important;font-weight:900!important}

  /* Main panels */
  .card,.panel,.box,.modal,.teamCard,.catCard,.categoryCard,.questionCard,.answerCard{
    border-radius:var(--b108-radius)!important;
    box-shadow:var(--b108-soft)!important;
  }

  /* Team-selection screen */
  #teams .teamCard,#teams [class*="team"] button,#teams [class*="team"] .card{
    transition:transform .18s ease,box-shadow .18s ease,filter .18s ease!important;
  }
  #teams .teamCard:hover,#teams .teamCard:active,#teams button:active{transform:translateY(-2px) scale(.99)!important}

  /* Category selection */
  #cats .catCard,#cats .categoryCard,#cats [onclick*="toggleCat"],#cats button{
    position:relative;overflow:hidden;transition:transform .18s ease,box-shadow .18s ease,filter .18s ease!important;
  }
  #cats .catCard:active,#cats .categoryCard:active,#cats [onclick*="toggleCat"]:active,#cats button:active{transform:scale(.975)!important}
  #cats .selected,#cats .activeCat,#cats [aria-pressed="true"]{box-shadow:var(--b108-shadow),var(--b108-glow)!important;transform:translateY(-2px)!important}

  /* Board: television quiz wall */
  #boardScreen{overflow-x:hidden!important}
  #boardScreen [class*="board"],#boardScreen .grid{perspective:1100px}
  #boardScreen button,#boardScreen .cell,#boardScreen .tile,#boardScreen [onclick*="openQuestion"]{
    position:relative;overflow:hidden;border-radius:var(--b108-radius-sm)!important;
    box-shadow:0 6px 18px rgba(0,0,0,.16)!important;
    transition:transform .16s ease,box-shadow .16s ease,filter .16s ease,opacity .16s ease!important;
    -webkit-tap-highlight-color:transparent;
  }
  #boardScreen button:not(:disabled):active,#boardScreen .cell:active,#boardScreen .tile:active,#boardScreen [onclick*="openQuestion"]:active{
    transform:translateY(2px) scale(.97)!important;box-shadow:0 3px 10px rgba(0,0,0,.17)!important;
  }
  #boardScreen button:not(:disabled):before,#boardScreen .cell:not(.used):before,#boardScreen .tile:not(.used):before{
    content:"";position:absolute;inset:-35% auto -35% -30%;width:28%;background:linear-gradient(90deg,transparent,rgba(255,255,255,.4),transparent);transform:skewX(-20deg);pointer-events:none
  }
  #boardScreen button:not(:disabled):hover:before,#boardScreen .cell:not(.used):hover:before,#boardScreen .tile:not(.used):hover:before{animation:b108Sweep .7s ease-out}
  #boardScreen .used,#boardScreen button:disabled{filter:saturate(.35)!important;opacity:.42!important;box-shadow:none!important}

  /* Question and answer presentation */
  #questionScreen #qText,#answerScreen #qText,#answerScreen #aText,#answerScreen .answer,#questionScreen .question{
    max-width:min(980px,94vw);margin-left:auto!important;margin-right:auto!important;
  }
  #questionScreen #qText{animation:b108Pop .32s cubic-bezier(.2,.8,.2,1) both}
  #answerScreen #aText,#answerScreen .answer{animation:b108Pop .30s cubic-bezier(.2,.8,.2,1) both}
  #questionScreen img,#answerScreen img{border-radius:18px!important;box-shadow:var(--b108-shadow)!important}
  #answerScreen #aText,#answerScreen .answer{font-weight:1000!important}

  /* Buttons */
  button,.btn,[role="button"]{touch-action:manipulation}
  button:not(:disabled),.btn:not(.disabled){transition:transform .14s ease,filter .14s ease,box-shadow .14s ease}
  button:not(:disabled):active,.btn:not(.disabled):active{transform:scale(.97)}

  /* Score emphasis without changing game logic */
  [id*="score" i],[class*="score" i]{font-variant-numeric:tabular-nums}
  #boardScreen [id*="score" i],#boardScreen [class*="score" i]{text-shadow:0 1px 0 rgba(255,255,255,.35)}

  /* Career category */
  .careerQuestion108{font-size:clamp(15px,2.2vw,24px)!important;line-height:1.25!important;text-align:center!important}
  .careerTitle{font-weight:900;margin:0 0 10px;font-size:1.05em}.careerTimeline{list-style:none!important;margin:0 auto!important;padding:0!important;display:grid;gap:7px;max-width:min(760px,96%)}
  .careerTimeline li{display:grid;grid-template-columns:34px minmax(120px,1fr) auto;align-items:center;gap:10px;padding:7px 10px;border:1px solid rgba(0,0,0,.10);border-radius:12px;background:rgba(255,255,255,.80);box-shadow:0 4px 14px rgba(0,0,0,.07);text-align:right}
  .careerIndex{width:28px;height:28px;display:grid;place-items:center;border-radius:50%;font-weight:900;background:rgba(0,0,0,.08)}.careerClub{font-weight:900}.careerPeriod{direction:ltr;unicode-bidi:isolate;white-space:nowrap;font-weight:800;font-variant-numeric:tabular-nums}.careerAsk{margin-top:12px;font-weight:1000;font-size:1.12em}

  /* iPhone landscape compact mode */
  @media (orientation:landscape) and (max-height:540px){
    html,body{height:var(--app-height,100dvh)!important;min-height:var(--app-height,100dvh)!important;overflow:hidden!important}
    .screen,#teams,#cats,#boardScreen,#questionScreen,#answerScreen{max-height:var(--app-height,100dvh)!important;min-height:0!important}
    .screen.active{overflow:auto!important;-webkit-overflow-scrolling:touch}
    .careerTimeline{gap:4px;max-width:92%}.careerTimeline li{padding:4px 8px;grid-template-columns:28px minmax(110px,1fr) auto}.careerIndex{width:24px;height:24px}.careerTitle{margin-bottom:6px}.careerAsk{margin-top:7px}
    #qCat{min-height:30px;padding:4px 13px!important}
  }
  @media (prefers-reduced-motion:reduce){*,*:before,*:after{animation-duration:.01ms!important;animation-iteration-count:1!important;transition-duration:.01ms!important}}
  `;
  document.head.appendChild(s)
}

function markBuild(){
  try{
    const w=document.createTreeWalker(document.body,NodeFilter.SHOW_TEXT);let n;
    while((n=w.nextNode()))if(/BUILD\s*(?:106|107)/i.test(n.nodeValue||''))n.nodeValue=n.nodeValue.replace(/BUILD\s*(?:106|107)/gi,'BUILD 108');
  }catch(e){}
}

function decorateScreen(screen){
  if(!screen||screen.dataset.b108Decorated==='1')return;
  screen.dataset.b108Decorated='1';
  screen.classList.add('b108-screen');
}
function observeScreens(){
  const screens=$$('.screen,#teams,#cats,#boardScreen,#questionScreen,#answerScreen,#tieScreen');screens.forEach(decorateScreen);
  const obs=new MutationObserver(muts=>{
    for(const m of muts){
      if(m.type==='attributes'&&m.attributeName==='class'&&m.target.classList?.contains('active')){
        decorateScreen(m.target);
        m.target.classList.remove('b108-enter');
        void m.target.offsetWidth;
        m.target.classList.add('b108-enter');
        if(m.target.id==='questionScreen')setTimeout(formatCareer,40);
        if(gameScreenActive())setTimeout(resumeAmbient,55);
      }
      if(m.type==='childList')m.addedNodes.forEach(n=>{if(n.nodeType===1){decorateScreen(n);$$('.screen',n).forEach(decorateScreen)}});
    }
  });
  obs.observe(document.body,{subtree:true,childList:true,attributes:true,attributeFilter:['class']});
}

function init(){
  styles();applyViewport();watchCareer();observeScreens();markBuild();formatCareer();
  document.documentElement.classList.add('build108');document.body?.classList.add('build108');
  setTimeout(()=>{markBuild();if(gameScreenActive())resumeAmbient()},120);
  setTimeout(markBuild,900);
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
})();
