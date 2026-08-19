/* Almajlis BUILD 107 — iPhone audio + landscape + career display */
(function(){
'use strict';
const BUILD='107';window.ALMAJLIS_BUILD=BUILD;
const $=id=>document.getElementById(id);
let ambientPrimed=false,priming=false;
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
  r.classList.toggle('build107-landscape',w>h);document.body?.classList.toggle('build107-landscape',w>h);
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
  const q=$('qText'),cat=($('qCat')?.textContent||'').trim();if(cat!=='مسيرة لاعب'||!q||q.dataset.build107Career==='1')return;
  const parts=careerParts(q.innerHTML||q.textContent);if(parts.length<2)return;
  const rows=parts.map((p,i)=>{const x=careerRow(p);return '<li><span class="careerIndex">'+(i+1)+'</span><span class="careerClub">'+esc(x.club)+'</span><span class="careerPeriod">'+esc(x.period)+'</span></li>'}).join('');
  q.innerHTML='<div class="careerTitle">مسيرة اللاعب كاملة</div><ol class="careerTimeline">'+rows+'</ol><div class="careerAsk">من هو اللاعب؟</div>';
  q.dataset.build107Career='1';q.classList.remove('qLong','qShort');q.classList.add('careerQuestion107');
}
function watchCareer(){const q=$('qText');if(!q)return;new MutationObserver(()=>requestAnimationFrame(formatCareer)).observe(q,{childList:true,subtree:true,characterData:true});document.addEventListener('click',e=>{if(e.target.closest('[onclick*="openQuestion"]')){q.dataset.build107Career='0';q.classList.remove('careerQuestion107');setTimeout(formatCareer,80)}},true)}
function styles(){
  if($('build107Styles'))return;const s=document.createElement('style');s.id='build107Styles';s.textContent=`
  html,body{min-height:var(--app-height,100dvh)}
  .careerQuestion107{font-size:clamp(15px,2.2vw,24px)!important;line-height:1.25!important;text-align:center!important}
  .careerTitle{font-weight:900;margin:0 0 10px;font-size:1.05em}.careerTimeline{list-style:none!important;margin:0 auto!important;padding:0!important;display:grid;gap:7px;max-width:min(760px,96%)}
  .careerTimeline li{display:grid;grid-template-columns:34px minmax(120px,1fr) auto;align-items:center;gap:10px;padding:7px 10px;border:1px solid rgba(255,255,255,.18);border-radius:12px;background:rgba(255,255,255,.07);text-align:right}
  .careerIndex{width:28px;height:28px;display:grid;place-items:center;border-radius:50%;font-weight:900;background:rgba(255,255,255,.14)}.careerClub{font-weight:900}.careerPeriod{direction:ltr;unicode-bidi:isolate;white-space:nowrap;font-weight:800;font-variant-numeric:tabular-nums}.careerAsk{margin-top:12px;font-weight:1000;font-size:1.12em}
  @media (orientation:landscape) and (max-height:540px){html,body{height:var(--app-height,100dvh)!important;min-height:var(--app-height,100dvh)!important;overflow:hidden!important}.screen,#teams,#cats,#boardScreen,#questionScreen,#answerScreen{max-height:var(--app-height,100dvh)!important;min-height:0!important}.screen.active{overflow:auto!important;-webkit-overflow-scrolling:touch}.careerTimeline{gap:4px;max-width:92%}.careerTimeline li{padding:4px 8px;grid-template-columns:28px minmax(110px,1fr) auto}.careerIndex{width:24px;height:24px}.careerTitle{margin-bottom:6px}.careerAsk{margin-top:7px}}
  `;document.head.appendChild(s)
}
function markBuild(){const w=document.createTreeWalker(document.body,NodeFilter.SHOW_TEXT);let n;while((n=w.nextNode()))if(/BUILD\s*106/i.test(n.nodeValue||''))n.nodeValue=n.nodeValue.replace(/BUILD\s*106/gi,'BUILD 107')}
function init(){styles();applyViewport();watchCareer();markBuild();setTimeout(()=>{if(gameScreenActive())resumeAmbient()},120)}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
})();
