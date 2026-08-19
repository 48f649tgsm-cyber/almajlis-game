/* BUILD 110 verification badge: reports the CLEAN master count itself. */
(function(){
'use strict';
window.ALMAJLIS_BUILD='110';
function countMaster(){
 fetch('questions_MATCH_READY_MASTER_CLEAN.json?v=clean-110',{cache:'no-store'})
 .then(function(r){return r.json()})
 .then(function(d){
   var cats=d.categories||{};
   var n=Object.keys(cats).reduce(function(s,k){return s+(Array.isArray(cats[k])?cats[k].length:0)},0);
   window.ALMAJLIS_CLEAN_MASTER_COUNT=n;
   console.info('BUILD 110 CLEAN MASTER COUNT:',n);
   var old=document.getElementById('build110Audit');
   if(old) old.remove();
   var b=document.createElement('div');b.id='build110Audit';
   b.textContent='BUILD 110 • CLEAN '+n;
   b.style.cssText='position:fixed;left:8px;bottom:8px;z-index:99999;font:700 10px system-ui;padding:4px 7px;border-radius:8px;background:rgba(0,0,0,.65);color:#fff;direction:ltr;pointer-events:none';
   document.body.appendChild(b);
 }).catch(function(e){console.error('BUILD110 master verify',e)});
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',countMaster,{once:true});else countMaster();
})();
