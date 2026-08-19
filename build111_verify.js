/* BUILD 111 */
(function(){
'use strict';
var EXPECTED=1744;
function mark(){
 var n=Object.values((window.__ALMAJLIS_CLEAN_MASTER__||{categories:{}}).categories||{})
   .reduce(function(s,a){return s+(Array.isArray(a)?a.length:0)},0);
 var b=document.createElement('div');
 b.id='build111Audit'; b.textContent='BUILD 111 • EMBEDDED CLEAN '+n;
 b.style.cssText='position:fixed;left:8px;bottom:8px;z-index:99999;font:700 10px system-ui;padding:4px 7px;border-radius:8px;background:rgba(0,0,0,.7);color:#fff;direction:ltr;pointer-events:none';
 document.body.appendChild(b);
 console.info('BUILD111 embedded clean',n,'expected',EXPECTED);
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',mark,{once:true});else mark();
})();
