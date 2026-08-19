/* ALMAJLIS QUALITY 108 — HARD USED-QUESTION LOCK
   Purpose: a board value can be opened only once during the current board.
   Does not change audio, scoring, question text, or category visuals.
*/
(function(){
  'use strict';
  if (window.__ALMAJLIS_Q108_USED_LOCK__) return;
  window.__ALMAJLIS_Q108_USED_LOCK__ = true;

  function qCellFromEvent(e){
    var t=e && e.target;
    if(!t || !t.closest) return null;
    return t.closest('[onclick*="openQuestion"]');
  }

  function markUsed(cell){
    if(!cell) return;
    cell.dataset.q108Used='1';
    cell.setAttribute('aria-disabled','true');
    cell.classList.add('q108-used');
  }

  /* Capture phase: first click is allowed, later clicks are blocked. */
  document.addEventListener('click', function(e){
    var cell=qCellFromEvent(e);
    if(!cell) return;

    if(cell.dataset.q108Used==='1'){
      e.preventDefault();
      e.stopImmediatePropagation();
      return false;
    }

    markUsed(cell);
  }, true);

  /* Keyboard/accessibility guard if a board cell is focusable. */
  document.addEventListener('keydown', function(e){
    if(e.key!=='Enter' && e.key!==' ') return;
    var cell=e.target && e.target.closest ? e.target.closest('[onclick*="openQuestion"]') : null;
    if(!cell) return;
    if(cell.dataset.q108Used==='1'){
      e.preventDefault();
      e.stopImmediatePropagation();
    }
  }, true);

  var s=document.createElement('style');
  s.id='q108-used-style';
  s.textContent=`
    .q108-used{
      opacity:.24!important;
      filter:grayscale(1)!important;
      cursor:not-allowed!important;
      box-shadow:none!important;
      transform:none!important;
    }
    .q108-used::after{
      content:"✓";
      display:inline-block;
      margin-inline-start:.25em;
      font-size:.72em;
      opacity:.85;
    }
  `;
  (document.head||document.documentElement).appendChild(s);
})();