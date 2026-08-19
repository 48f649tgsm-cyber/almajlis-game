/* ALMAJLIS MATCH READY LOADER V1
   Loaded before the stable game scripts.
   Legacy question-bank requests are redirected to the single clean master.
*/
(function(){
  'use strict';
  if(window.__ALMAJLIS_MATCH_READY_LOADER_V1__) return;
  window.__ALMAJLIS_MATCH_READY_LOADER_V1__=true;

  var nativeFetch=window.fetch.bind(window);
  var CLEAN='questions_MATCH_READY_MASTER_CLEAN.json?v=clean-1';

  function isQuestionBank(url){
    var s=String(url||'');
    return /(?:^|\/)questions_(?:v4_8_READY|batch_\d+|v6_batch_\d+)\.json(?:[?#]|$)/i.test(s);
  }

  var cleanPromise=null;
  function getClean(){
    if(!cleanPromise){
      cleanPromise=nativeFetch(CLEAN,{cache:'no-store'}).then(function(r){
        if(!r.ok) throw new Error('Clean master HTTP '+r.status);
        return r.json();
      });
    }
    return cleanPromise;
  }

  window.fetch=function(input,init){
    var url=(typeof input==='string')?input:(input&&input.url)||'';
    if(!isQuestionBank(url)) return nativeFetch(input,init);

    return getClean().then(function(master){
      var payload;
      // Base request receives the full clean bank.
      if(/questions_v4_8_READY\.json/i.test(url)){
        payload=master;
      }else{
        // All legacy batches become empty so they cannot re-add quarantined questions.
        payload={version:'MATCH_READY_EMPTY_LEGACY',categories:{}};
      }
      return new Response(JSON.stringify(payload),{
        status:200,
        headers:{'Content-Type':'application/json; charset=utf-8','Cache-Control':'no-store'}
      });
    });
  };

  console.info('MATCH READY CLEAN loader active');
})();