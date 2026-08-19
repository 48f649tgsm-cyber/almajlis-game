
(function(){
'use strict';
const BUILD='109';
window.ALMAJLIS_BUILD=BUILD;
const $=id=>document.getElementById(id);
const $$=(sel,root=document)=>Array.from(root.querySelectorAll(sel));
const state={lastScore:{},streak:{},lastScreen:'',used:0,total:0,introDone:false,vsDone:false};
const prefersReduced=()=>matchMedia('(prefers-reduced-motion:reduce)').matches;

function injectStyles(){
  if(document.getElementById('build109Styles')) return;
  const s=document.createElement('style');
  s.id='build109Styles';
  s.textContent=`
  :root{
    --b109-gold:#c9a84c;
    --b109-gold2:#f3d675;
    --b109-ink:#0d1117;
    --b109-blue:#153c78;
    --b109-blue2:#2f6dc1;
    --b109-red:#7d2230;
    --b109-glass:rgba(255,255,255,.72);
    --b109-border:rgba(255,255,255,.48);
    --b109-shadow:0 20px 60px rgba(17,24,39,.16);
    --b109-soft:0 10px 30px rgba(17,24,39,.12);
    --b109-safe-top:max(10px,env(safe-area-inset-top));
    --b109-safe-bottom:max(10px,env(safe-area-inset-bottom));
  }

  html,body{background:#eef2f8!important}
  body:before{
    content:"";position:fixed;inset:0;z-index:-5;pointer-events:none;
    background:
      radial-gradient(900px 520px at 50% -5%,rgba(255,255,255,.95),transparent 72%),
      radial-gradient(620px 420px at 7% 24%,rgba(201,168,76,.12),transparent 72%),
      radial-gradient(620px 420px at 93% 28%,rgba(38,89,156,.11),transparent 72%),
      linear-gradient(180deg,#f8fbff 0%,#eef2f7 52%,#e8edf5 100%);
    animation:b109StudioDrift 14s ease-in-out infinite alternate;
  }
  body:after{
    content:"";position:fixed;inset:0;z-index:-4;pointer-events:none;opacity:.28;
    background:
      linear-gradient(115deg,transparent 0 44%,rgba(255,255,255,.55) 49%,transparent 54%),
      repeating-linear-gradient(90deg,transparent 0 82px,rgba(255,255,255,.14) 83px 84px);
    transform:translate3d(var(--b109-px,0px),var(--b109-py,0px),0);
    transition:transform .2s ease-out;
  }

  .screen{padding-top:var(--b109-safe-top)!important;padding-bottom:var(--b109-safe-bottom)!important}
  .screen.active{animation:b109Screen .42s cubic-bezier(.2,.82,.18,1) both}
  .screen.active>*{position:relative;z-index:1}
  @keyframes b109Screen{from{opacity:.1;transform:translateY(10px) scale(.992)}to{opacity:1;transform:none}}
  @keyframes b109StudioDrift{from{filter:saturate(.96) brightness(1)}to{filter:saturate(1.05) brightness(1.02)}}
  @keyframes b109Shine{0%{transform:translateX(-180%) skewX(-18deg)}100%{transform:translateX(300%) skewX(-18deg)}}
  @keyframes b109Pop{0%{opacity:0;transform:scale(.9) translateY(8px)}70%{opacity:1;transform:scale(1.025)}100%{transform:none}}
  @keyframes b109Flip{0%{transform:rotateX(0)}50%{transform:rotateX(90deg)}51%{transform:rotateX(-90deg)}100%{transform:rotateX(0)}}
  @keyframes b109Pulse{0%,100%{transform:scale(1);filter:brightness(1)}50%{transform:scale(1.045);filter:brightness(1.12)}}
  @keyframes b109Danger{0%,100%{box-shadow:0 0 0 0 rgba(184,34,50,.08)}50%{box-shadow:0 0 0 9px rgba(184,34,50,.12)}}
  @keyframes b109Last{0%,100%{box-shadow:0 0 0 2px rgba(201,168,76,.35),0 9px 26px rgba(0,0,0,.14)}50%{box-shadow:0 0 0 4px rgba(243,214,117,.72),0 12px 34px rgba(201,168,76,.32)}}
  @keyframes b109Winner{0%{opacity:0;transform:scale(.7) translateY(18px)}65%{opacity:1;transform:scale(1.06)}100%{transform:none}}
  @keyframes b109Float{0%,100%{transform:translateY(0)}50%{transform:translateY(-8px)}}

  /* Arena chrome */
  .b109-arena-rail{
    position:fixed;left:50%;top:max(8px,env(safe-area-inset-top));transform:translateX(-50%);
    width:min(92vw,760px);height:3px;border-radius:99px;z-index:70;pointer-events:none;
    background:linear-gradient(90deg,transparent,var(--b109-gold),#fff,var(--b109-gold),transparent);
    box-shadow:0 0 16px rgba(201,168,76,.42);opacity:.72
  }
  .b109-turn-banner{
    position:fixed;left:50%;top:calc(var(--b109-safe-top) + 8px);z-index:95;
    transform:translate(-50%,-16px);opacity:0;pointer-events:none;
    background:rgba(13,17,23,.92);color:#fff;border:1px solid rgba(255,255,255,.14);
    padding:8px 18px;border-radius:999px;font-weight:900;box-shadow:var(--b109-soft);
    transition:.26s cubic-bezier(.2,.8,.2,1);backdrop-filter:blur(14px)
  }
  .b109-turn-banner.show{opacity:1;transform:translate(-50%,0)}
  .b109-progress{
    position:fixed;left:50%;bottom:calc(var(--b109-safe-bottom) + 5px);z-index:65;
    width:min(72vw,520px);height:6px;border-radius:99px;overflow:hidden;pointer-events:none;
    background:rgba(12,18,28,.12);box-shadow:inset 0 1px 2px rgba(0,0,0,.1)
  }
  .b109-progress>i{display:block;height:100%;width:0;background:linear-gradient(90deg,var(--b109-gold),var(--b109-gold2));transition:width .35s ease}

  /* Glass + depth */
  .card,.panel,.box,.modal,.teamCard,.catCard,.categoryCard,.questionCard,.answerCard,
  #questionScreen #qText,#answerScreen #aText{
    backdrop-filter:blur(14px) saturate(1.05);
    -webkit-backdrop-filter:blur(14px) saturate(1.05);
  }

  /* Team arena */
  #teams .teamCard,#teams [class*="team"] .card,#teams [class*="team"] button{
    position:relative;overflow:hidden;border:1px solid var(--b109-border)!important;
    box-shadow:var(--b109-shadow)!important;
  }
  #teams .teamCard:before,#teams [class*="team"] .card:before{
    content:"";position:absolute;inset:-60% auto -60% -30%;width:20%;
    background:linear-gradient(90deg,transparent,rgba(255,255,255,.58),transparent);
    animation:b109Shine 4.8s ease-in-out infinite;pointer-events:none
  }

  /* Categories */
  #cats .catCard,#cats .categoryCard,#cats [onclick*="toggleCat"]{
    transform-style:preserve-3d;backface-visibility:hidden;
    border:1px solid rgba(255,255,255,.52)!important;box-shadow:var(--b109-soft)!important
  }
  #cats .catCard.b109-reveal,#cats .categoryCard.b109-reveal,#cats [onclick*="toggleCat"].b109-reveal{
    animation:b109Pop .42s cubic-bezier(.2,.8,.2,1) both
  }

  /* Board wall */
  #boardScreen [class*="board"],#boardScreen .grid{perspective:1200px!important}
  #boardScreen button,#boardScreen .cell,#boardScreen .tile,#boardScreen [onclick*="openQuestion"]{
    transform-style:preserve-3d;backface-visibility:hidden;
    border:1px solid rgba(255,255,255,.28)!important;
    box-shadow:0 10px 26px rgba(20,28,40,.16),inset 0 1px 0 rgba(255,255,255,.2)!important;
  }
  #boardScreen button:not(:disabled):hover,#boardScreen .cell:not(.used):hover,#boardScreen .tile:not(.used):hover{
    transform:translateY(-3px) translateZ(12px)!important
  }
  #boardScreen .b109-v100{filter:saturate(.92)}
  #boardScreen .b109-v300{box-shadow:0 10px 28px rgba(30,65,120,.18),inset 0 1px 0 rgba(255,255,255,.22)!important}
  #boardScreen .b109-v500{
    box-shadow:0 12px 32px rgba(201,168,76,.22),0 0 0 1px rgba(201,168,76,.18)!important
  }
  #boardScreen .b109-v500:after{
    content:"";position:absolute;inset:-45% auto -45% -30%;width:20%;
    background:linear-gradient(90deg,transparent,rgba(255,245,190,.5),transparent);
    animation:b109Shine 4.2s ease-in-out infinite;pointer-events:none
  }
  #boardScreen .used,#boardScreen button:disabled{
    opacity:.34!important;filter:grayscale(.72) saturate(.45)!important;position:relative
  }
  #boardScreen .used:after,#boardScreen button:disabled:after{
    content:"✓";position:absolute;inset:0;display:grid;place-items:center;
    font-weight:1000;font-size:clamp(20px,3vw,38px);color:rgba(255,255,255,.72)
  }
  #boardScreen .b109-last-tile{animation:b109Last 1.35s ease-in-out infinite!important}

  /* Question stage */
  #questionScreen,#answerScreen{position:relative}
  #questionScreen:after,#answerScreen:after{
    content:"";position:fixed;inset:8% 8%;z-index:-1;pointer-events:none;
    background:radial-gradient(circle at 50% 40%,rgba(201,168,76,.11),transparent 58%);
    filter:blur(10px)
  }
  #qCat{
    border:1px solid rgba(255,255,255,.18)!important;
    background:linear-gradient(135deg,rgba(12,17,25,.96),rgba(30,41,59,.94))!important
  }
  #questionScreen #qText,#answerScreen #aText,#answerScreen .answer{
    border:1px solid rgba(255,255,255,.52)!important;
    box-shadow:var(--b109-shadow)!important;
    background:rgba(255,255,255,.78)!important;
    border-radius:24px!important
  }
  #questionScreen img,#answerScreen img{
    border:1px solid rgba(255,255,255,.65)!important;
    box-shadow:0 18px 50px rgba(17,24,39,.18)!important;
    animation:b109Media 9s ease-in-out infinite alternate
  }
  @keyframes b109Media{from{transform:scale(1)}to{transform:scale(1.018)}}

  /* Timer ring */
  .b109-timer-ring{
    position:fixed;right:max(12px,env(safe-area-inset-right));top:calc(var(--b109-safe-top) + 12px);
    z-index:80;width:54px;height:54px;border-radius:50%;
    display:grid;place-items:center;font-weight:1000;font-variant-numeric:tabular-nums;
    background:conic-gradient(var(--b109-gold) var(--b109-p,100%),rgba(17,24,39,.12) 0);
    box-shadow:var(--b109-soft);padding:4px;opacity:0;transition:opacity .2s
  }
  .b109-timer-ring:before{content:"";position:absolute;inset:5px;border-radius:50%;background:#fff}
  .b109-timer-ring>span{position:relative;z-index:1}
  .b109-timer-ring.show{opacity:1}
  .b109-timer-ring.danger{animation:b109Danger .62s ease-in-out infinite;color:#a61d2d}

  /* Active team spotlight */
  .b109-active-team{
    position:relative!important;z-index:2;
    box-shadow:0 0 0 2px rgba(201,168,76,.55),0 14px 36px rgba(201,168,76,.22)!important;
    filter:brightness(1.04)!important;transform:translateY(-1px)
  }
  .b109-inactive-team{opacity:.76;filter:saturate(.82)}

  /* Score animation */
  .b109-score-flip{animation:b109Flip .42s ease}
  .b109-milestone{animation:b109Pulse .62s ease 2}
  .b109-score-fly{
    position:fixed;z-index:150;pointer-events:none;font-size:clamp(24px,5vw,46px);font-weight:1000;
    color:var(--b109-gold);text-shadow:0 4px 15px rgba(0,0,0,.25);transition:transform .7s cubic-bezier(.18,.82,.2,1),opacity .7s
  }

  /* Feedback */
  .b109-correct{animation:b109Pulse .36s ease 1!important}
  .b109-wrong{animation:b109Shake .34s ease!important}
  @keyframes b109Shake{0%,100%{transform:translateX(0)}25%{transform:translateX(-5px)}75%{transform:translateX(5px)}}

  .b109-streak{
    position:fixed;left:50%;top:18%;transform:translate(-50%,-8px);z-index:120;opacity:0;
    padding:9px 17px;border-radius:999px;background:rgba(13,17,23,.91);color:#fff;font-weight:1000;
    transition:.2s ease;box-shadow:var(--b109-soft)
  }
  .b109-streak.show{opacity:1;transform:translate(-50%,0)}

  /* Intro / VS / Winner overlays */
  .b109-overlay{
    position:fixed;inset:0;z-index:999;display:grid;place-items:center;direction:rtl;
    background:
      radial-gradient(circle at 50% 38%,rgba(201,168,76,.24),transparent 34%),
      linear-gradient(145deg,#0b111c,#182235 56%,#0c131f);
    color:#fff;transition:opacity .42s ease,visibility .42s ease
  }
  .b109-overlay.hide{opacity:0;visibility:hidden}
  .b109-logo{
    font-size:clamp(44px,10vw,98px);font-weight:1000;letter-spacing:.02em;
    background:linear-gradient(180deg,#fff 5%,#f7dd83 52%,#b88d2d 100%);
    -webkit-background-clip:text;background-clip:text;color:transparent;
    text-shadow:0 12px 34px rgba(0,0,0,.26);animation:b109Winner .7s cubic-bezier(.2,.8,.2,1) both
  }
  .b109-logo-sub{text-align:center;opacity:.74;font-weight:800;margin-top:8px}
  .b109-vs{
    display:flex;align-items:center;gap:clamp(16px,5vw,58px);font-weight:1000;
    font-size:clamp(26px,6vw,64px);animation:b109Winner .5s ease both
  }
  .b109-vs .vs{color:var(--b109-gold2);font-size:.72em}
  .b109-winner-card{text-align:center;animation:b109Winner .68s cubic-bezier(.2,.85,.2,1) both}
  .b109-trophy{font-size:clamp(64px,14vw,136px);filter:drop-shadow(0 12px 26px rgba(0,0,0,.25));animation:b109Float 2s ease-in-out infinite}
  .b109-winner-name{font-size:clamp(30px,7vw,68px);font-weight:1000;margin-top:6px}
  .b109-winner-score{font-size:clamp(18px,3.5vw,32px);opacity:.88;margin-top:4px}
  .b109-stats{
    margin:18px auto 0;display:flex;gap:10px;flex-wrap:wrap;justify-content:center;max-width:820px
  }
  .b109-stat{min-width:120px;padding:10px 14px;border-radius:16px;background:rgba(255,255,255,.09);border:1px solid rgba(255,255,255,.12)}
  .b109-stat b{display:block;font-size:1.35em;color:#f5d56e}
  .b109-newgame{margin-top:18px;border:0;border-radius:999px;padding:12px 24px;font-weight:1000;font-size:17px;background:#fff;color:#111}

  /* Tile-to-question transition clone */
  .b109-tile-clone{
    position:fixed!important;z-index:600!important;margin:0!important;pointer-events:none!important;
    transition:left .42s cubic-bezier(.2,.82,.18,1),top .42s cubic-bezier(.2,.82,.18,1),
      width .42s cubic-bezier(.2,.82,.18,1),height .42s cubic-bezier(.2,.82,.18,1),
      border-radius .42s ease,opacity .18s .3s;
    box-shadow:0 28px 90px rgba(0,0,0,.28)!important
  }

  /* Loading skeleton */
  img:not([src]),img[src=""],img[src*="undefined"]{background:linear-gradient(90deg,#eceff4 25%,#f7f8fa 40%,#eceff4 60%);background-size:300% 100%;animation:b109Skeleton 1.2s ease infinite}
  @keyframes b109Skeleton{0%{background-position:100% 0}100%{background-position:0 0}}

  @media (orientation:landscape) and (max-height:540px){
    .b109-timer-ring{width:44px;height:44px;top:8px}
    .b109-progress{bottom:5px;height:4px}
    .b109-turn-banner{top:6px;padding:5px 12px;font-size:12px}
    #questionScreen #qText,#answerScreen #aText{border-radius:18px!important}
  }
  @media (min-width:900px){
    #boardScreen [class*="board"],#boardScreen .grid{max-width:1260px;margin-inline:auto!important}
  }
  @media (prefers-reduced-motion:reduce){
    *,*:before,*:after{animation-duration:.01ms!important;animation-iteration-count:1!important;transition-duration:.01ms!important}
  }`;
  document.head.appendChild(s);
}

function ensureChrome(){
  if(!document.querySelector('.b109-arena-rail')){
    const r=document.createElement('div');r.className='b109-arena-rail';document.body.appendChild(r);
  }
  if(!document.querySelector('.b109-turn-banner')){
    const b=document.createElement('div');b.className='b109-turn-banner';document.body.appendChild(b);
  }
  if(!document.querySelector('.b109-progress')){
    const p=document.createElement('div');p.className='b109-progress';p.innerHTML='<i></i>';document.body.appendChild(p);
  }
  if(!document.querySelector('.b109-timer-ring')){
    const t=document.createElement('div');t.className='b109-timer-ring';t.innerHTML='<span></span>';document.body.appendChild(t);
  }
  if(!document.querySelector('.b109-streak')){
    const t=document.createElement('div');t.className='b109-streak';document.body.appendChild(t);
  }
}

function screenId(){
  return $$('.screen.active').map(x=>x.id).find(Boolean)||'';
}

function intro(){
  if(state.introDone || sessionStorage.getItem('b109IntroSeen')) return;
  state.introDone=true;sessionStorage.setItem('b109IntroSeen','1');
  const o=document.createElement('div');o.className='b109-overlay';
  o.innerHTML='<div><div class="b109-logo">المجلس</div><div class="b109-logo-sub">ARENA • BUILD 109</div></div>';
  document.body.appendChild(o);
  const close=()=>{o.classList.add('hide');setTimeout(()=>o.remove(),480)};
  o.addEventListener('pointerdown',close,{once:true});
  setTimeout(close,2400);
}

function categoryReveal(){
  const cards=$$('#cats .catCard,#cats .categoryCard,#cats [onclick*="toggleCat"]');
  cards.slice(0,60).forEach((el,i)=>{
    if(el.dataset.b109Reveal) return;
    el.dataset.b109Reveal='1';el.classList.add('b109-reveal');
    el.style.animationDelay=(Math.min(i,20)*26)+'ms';
  });
}

function showVS(){
  if(state.vsDone) return;
  state.vsDone=true;
  const teams=guessTeams();
  if(teams.length<2) return;
  const o=document.createElement('div');o.className='b109-overlay';
  o.innerHTML=`<div class="b109-vs"><span>${escapeHtml(teams[0].name)}</span><span class="vs">VS</span><span>${escapeHtml(teams[1].name)}</span></div>`;
  document.body.appendChild(o);
  setTimeout(()=>{o.classList.add('hide');setTimeout(()=>o.remove(),450)},1200);
}

function escapeHtml(s){return String(s||'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))}

function classifyBoardValues(){
  const tiles=$$('#boardScreen button,#boardScreen .cell,#boardScreen .tile,#boardScreen [onclick*="openQuestion"]');
  tiles.forEach(el=>{
    const txt=(el.textContent||'').trim();
    el.classList.remove('b109-v100','b109-v300','b109-v500');
    if(/\b100\b/.test(txt))el.classList.add('b109-v100');
    else if(/\b300\b/.test(txt))el.classList.add('b109-v300');
    else if(/\b500\b/.test(txt))el.classList.add('b109-v500');
  });
  state.total=tiles.filter(el=>/\b(?:100|300|500)\b/.test((el.textContent||''))).length||state.total;
  state.used=tiles.filter(el=>el.disabled||el.classList.contains('used')).length;
  updateProgress();
  markLastTile(tiles);
}

function updateProgress(){
  const bar=document.querySelector('.b109-progress i');if(!bar)return;
  const pct=state.total?Math.min(100,(state.used/state.total)*100):0;
  bar.style.width=pct+'%';
}

function markLastTile(tiles){
  tiles.forEach(x=>x.classList.remove('b109-last-tile'));
  const avail=tiles.filter(el=>!(el.disabled||el.classList.contains('used')) && /\b(?:100|300|500)\b/.test(el.textContent||''));
  if(avail.length===1)avail[0].classList.add('b109-last-tile');
}

function tileTransition(el){
  if(prefersReduced()||!el)return;
  const r=el.getBoundingClientRect();if(!r.width||!r.height)return;
  const c=el.cloneNode(true);c.classList.add('b109-tile-clone');
  Object.assign(c.style,{left:r.left+'px',top:r.top+'px',width:r.width+'px',height:r.height+'px'});
  document.body.appendChild(c);
  requestAnimationFrame(()=>requestAnimationFrame(()=>{
    c.style.left='8vw';c.style.top='14vh';c.style.width='84vw';c.style.height='68vh';c.style.borderRadius='28px';c.style.opacity='.15';
  }));
  setTimeout(()=>c.remove(),520);
}

function findTimerNumber(){
  const candidates=$$('[id*="timer" i],[class*="timer" i],[id*="time" i],[class*="time" i]');
  for(const el of candidates){
    if(el.closest('.b109-timer-ring'))continue;
    const m=(el.textContent||'').match(/\b([0-9]{1,2})\b/);
    if(m){
      const n=Number(m[1]); if(n>=0&&n<=99) return n;
    }
  }
  return null;
}

function updateTimer(){
  const ring=document.querySelector('.b109-timer-ring');if(!ring)return;
  const n=findTimerNumber();
  const active=['questionScreen','answerScreen'].includes(screenId());
  ring.classList.toggle('show',active&&n!==null);
  if(n===null)return;
  ring.querySelector('span').textContent=n;
  const max=30;
  ring.style.setProperty('--b109-p',Math.max(0,Math.min(100,(n/max)*100))+'%');
  ring.classList.toggle('danger',n<=5);
  const q=$('questionScreen');
  if(q)q.classList.toggle('b109-danger-stage',n<=5);
}

function guessTeams(){
  const out=[];
  const scoreEls=$$('[id*="score" i],[class*="score" i]').filter(x=>/\d/.test(x.textContent||''));
  scoreEls.forEach((score,i)=>{
    const host=score.closest('.teamCard,[class*="team"],.card,.panel')||score.parentElement;
    const nameEl=host?.querySelector('[id*="name" i],[class*="name" i],h2,h3,strong,b');
    const name=(nameEl?.textContent||('الفريق '+(i+1))).trim();
    if(!out.some(t=>t.scoreEl===score))out.push({name,scoreEl:score,host});
  });
  return out.slice(0,2);
}

function spotlightTeams(){
  const teams=guessTeams();if(teams.length<2)return;
  teams.forEach(t=>t.host?.classList.remove('b109-active-team','b109-inactive-team'));
  const activeHints=$$('[class*="activeTeam" i],[id*="turn" i],[class*="turn" i]').map(x=>(x.textContent||'').trim()).join(' ');
  let active=-1;
  teams.forEach((t,i)=>{if(activeHints&&activeHints.includes(t.name))active=i});
  if(active<0){
    const a=teams.findIndex(t=>t.host?.classList.contains('active')||t.host?.classList.contains('current'));
    if(a>=0)active=a;
  }
  if(active>=0){
    teams[active].host?.classList.add('b109-active-team');
    teams[1-active]?.host?.classList.add('b109-inactive-team');
  }
}

function scoreEffects(){
  const teams=guessTeams();
  teams.forEach((t,i)=>{
    const txt=(t.scoreEl.textContent||'').replace(/[^\d-]/g,'');
    const val=Number(txt);if(!Number.isFinite(val))return;
    const key='t'+i,prev=state.lastScore[key];
    if(prev!==undefined&&prev!==val){
      t.scoreEl.classList.remove('b109-score-flip');void t.scoreEl.offsetWidth;t.scoreEl.classList.add('b109-score-flip');
      const delta=val-prev;
      if(delta>0) flyScore('+'+delta,t.scoreEl);
      if(Math.floor(prev/1000)!==Math.floor(val/1000)&&val>=1000){
        t.scoreEl.classList.add('b109-milestone');setTimeout(()=>t.scoreEl.classList.remove('b109-milestone'),1300);
      }
    }
    state.lastScore[key]=val;
  });
}

function flyScore(text,target){
  const r=target.getBoundingClientRect();
  const f=document.createElement('div');f.className='b109-score-fly';f.textContent=text;
  f.style.left='50vw';f.style.top='48vh';f.style.transform='translate(-50%,-50%)';
  document.body.appendChild(f);
  requestAnimationFrame(()=>requestAnimationFrame(()=>{
    f.style.transform=`translate(${r.left+r.width/2-innerWidth/2}px,${r.top+r.height/2-innerHeight*.48}px) scale(.65)`;
    f.style.opacity='0';
  }));
  particleBurst(r.left+r.width/2,r.top+r.height/2);
  setTimeout(()=>f.remove(),760);
}

function particleBurst(x,y){
  if(prefersReduced())return;
  for(let i=0;i<9;i++){
    const p=document.createElement('i');
    Object.assign(p.style,{
      position:'fixed',left:x+'px',top:y+'px',width:'5px',height:'5px',borderRadius:'50%',
      background:'var(--b109-gold)',zIndex:149,pointerEvents:'none',transition:'transform .55s ease-out,opacity .55s'
    });
    document.body.appendChild(p);
    const a=(Math.PI*2*i/9),d=24+Math.random()*32;
    requestAnimationFrame(()=>{p.style.transform=`translate(${Math.cos(a)*d}px,${Math.sin(a)*d}px)`;p.style.opacity='0'});
    setTimeout(()=>p.remove(),580);
  }
}

function showTurn(text){
  const b=document.querySelector('.b109-turn-banner');if(!b||!text)return;
  b.textContent='الدور ← '+text;b.classList.add('show');clearTimeout(showTurn.t);
  showTurn.t=setTimeout(()=>b.classList.remove('show'),1200);
}

function feedbackFromClick(target){
  const txt=(target.textContent||'').trim();
  const host=target.closest('.card,.panel,.box,#questionScreen,#answerScreen')||target;
  if(/صحيح|إجابة صحيحة|correct/i.test(txt)){
    host.classList.add('b109-correct');setTimeout(()=>host.classList.remove('b109-correct'),500);
    updateStreak(1);
  }else if(/خطأ|إجابة خاطئة|wrong|incorrect/i.test(txt)){
    host.classList.add('b109-wrong');setTimeout(()=>host.classList.remove('b109-wrong'),500);
    updateStreak(0);
  }
}

function updateStreak(ok){
  const key='all';state.streak[key]=ok?(state.streak[key]||0)+1:0;
  if(state.streak[key]>=2){
    const s=document.querySelector('.b109-streak');s.textContent='🔥 '+state.streak[key]+' STREAK';s.classList.add('show');
    clearTimeout(updateStreak.t);updateStreak.t=setTimeout(()=>s.classList.remove('show'),1000);
  }
}

function enhanceMedia(){
  $$('#questionScreen img,#answerScreen img').forEach(img=>{
    img.loading='eager';img.decoding='async';
    img.addEventListener('error',()=>{img.style.opacity='.25';img.setAttribute('aria-label','تعذر تحميل الصورة')},{once:true});
  });
}

function winnerIfNeeded(){
  const id=screenId();
  const bodyTxt=(document.body.innerText||'').slice(-2500);
  if(!/فائز|الفائز|winner|انتهت المباراة|النتيجة النهائية/i.test(bodyTxt))return;
  if(document.querySelector('.b109-winner-overlay'))return;
  const teams=guessTeams();if(teams.length<2)return;
  const vals=teams.map(t=>Number((t.scoreEl.textContent||'').replace(/[^\d-]/g,''))||0);
  const win=vals[0]===vals[1]?null:(vals[0]>vals[1]?0:1);
  const o=document.createElement('div');o.className='b109-overlay b109-winner-overlay';
  const title=win===null?'تعادل':teams[win].name;
  const score=vals.length>=2?`${vals[0]} — ${vals[1]}`:'';
  o.innerHTML=`<div class="b109-winner-card">
    <div class="b109-trophy">${win===null?'🤝':'🏆'}</div>
    <div class="b109-winner-name">${escapeHtml(title)}</div>
    <div class="b109-winner-score">${escapeHtml(score)}</div>
    <div class="b109-stats">
      <div class="b109-stat"><b>${state.used}</b>أسئلة لُعبت</div>
      <div class="b109-stat"><b>${state.total||'—'}</b>إجمالي الأسئلة</div>
      <div class="b109-stat"><b>${state.streak.all||0}</b>أفضل سلسلة حالية</div>
    </div>
    <button class="b109-newgame">مباراة جديدة</button>
  </div>`;
  document.body.appendChild(o);
  o.querySelector('.b109-newgame').onclick=()=>{
    o.classList.add('hide');
    const candidates=$$('button,a').filter(x=>/مباراة جديدة|لعبة جديدة|إعادة|الرئيسية|new game/i.test(x.textContent||''));
    const original=candidates.find(x=>!x.closest('.b109-winner-overlay'));
    if(original) original.click(); else location.reload();
    setTimeout(()=>o.remove(),450);
  };
}

function tieMoment(){
  const t=guessTeams();if(t.length<2)return;
  const a=Number((t[0].scoreEl.textContent||'').replace(/[^\d-]/g,'')),b=Number((t[1].scoreEl.textContent||'').replace(/[^\d-]/g,''));
  if(Number.isFinite(a)&&a===b&&a>0){
    t[0].host?.classList.add('b109-milestone');t[1].host?.classList.add('b109-milestone');
    setTimeout(()=>{t[0].host?.classList.remove('b109-milestone');t[1].host?.classList.remove('b109-milestone')},850);
  }
}

function detectScreenChange(){
  const id=screenId();if(id===state.lastScreen)return;
  const prev=state.lastScreen;state.lastScreen=id;
  if(id==='cats')categoryReveal();
  if(id==='boardScreen'&&prev==='teams')showVS();
  if(id==='boardScreen')classifyBoardValues();
  if(id==='questionScreen')enhanceMedia();
  if(id==='answerScreen')enhanceMedia();
}

function observerTick(){
  detectScreenChange();
  classifyBoardValues();
  spotlightTeams();
  scoreEffects();
  tieMoment();
  updateTimer();
  winnerIfNeeded();
}

function markBuild(){
  document.title=(document.title||'المجلس').replace(/BUILD\s*108/gi,'BUILD 109');
  const walker=document.createTreeWalker(document.body,NodeFilter.SHOW_TEXT);let n,count=0;
  while((n=walker.nextNode())&&count<4000){count++;if(/BUILD\s*108/i.test(n.nodeValue||''))n.nodeValue=n.nodeValue.replace(/BUILD\s*108/gi,'BUILD 109')}
}

function parallax(){
  addEventListener('pointermove',e=>{
    const x=((e.clientX/innerWidth)-.5)*8,y=((e.clientY/innerHeight)-.5)*6;
    document.documentElement.style.setProperty('--b109-px',x+'px');
    document.documentElement.style.setProperty('--b109-py',y+'px');
  },{passive:true});
}

function clickHooks(){
  document.addEventListener('click',e=>{
    const target=e.target.closest('button,[role="button"],[onclick],.cell,.tile');
    if(!target)return;
    if(target.closest('#boardScreen')&&/\b(?:100|300|500)\b/.test(target.textContent||''))tileTransition(target);
    feedbackFromClick(target);
    const txt=(target.textContent||'').trim();
    const teamMatch=txt.match(/(?:الدور|فريق)\s*[:：-]?\s*(.+)/);
    if(teamMatch)showTurn(teamMatch[1]);
    setTimeout(observerTick,45);setTimeout(observerTick,260);
  },true);
}

function init(){
  injectStyles();ensureChrome();markBuild();parallax();clickHooks();intro();
  const mo=new MutationObserver(()=>{clearTimeout(mo._t);mo._t=setTimeout(observerTick,30)});
  mo.observe(document.body,{subtree:true,childList:true,characterData:true,attributes:true,attributeFilter:['class','disabled','style']});
  setInterval(updateTimer,280);
  setTimeout(observerTick,80);setTimeout(observerTick,500);
  console.info('Almajlis BUILD 109 visual arena loaded');
}

if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
})();
