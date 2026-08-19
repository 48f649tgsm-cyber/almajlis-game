/* Almajlis BUILD 108 FIXED
   Safe overlay on top of BUILD 107.
   Goals:
   1) Never replace or redefine the existing audio engine.
   2) Never resize category images globally.
   3) Make "مسيرة لاعب" readable and complete for known corrected items.
   4) Make direct "من هو اللاعب" prompts more story-like without changing the answer.
*/
(function () {
  'use strict';

  if (window.__ALMAJLIS_BUILD108_FIXED__) return;
  window.__ALMAJLIS_BUILD108_FIXED__ = true;
  window.ALMAJLIS_BUILD = '108-fixed-4';

  function byId(id) {
    return document.getElementById(id);
  }

  function norm(value) {
    return String(value || '').replace(/\s+/g, ' ').trim();
  }

  function currentCategory() {
    var el = byId('qCat');
    return norm(el ? el.textContent : '');
  }

  /* Do NOT redefine:
       startQuestionMusic
       stopQuestionMusic
       ensureAmbientMusic
       getThemeAudio
     BUILD 107 owns audio.
  */

  /* Do NOT apply global CSS to category images.
     BUILD 107 already constrains category icons correctly.
  */

  var CAREER_MAP = [
    {
      keys: ['بدأ في كان', 'تييري هنري'],
      text: 'موناكو 1994–1999 ← يوفنتوس 1999 ← آرسنال 1999–2007 ← برشلونة 2007–2010 ← نيويورك ريد بولز 2010–2014 ← آرسنال (إعارة) 2012'
    },
    {
      keys: ['لبوردو ثم يوفنتوس', 'زين الدين زيدان'],
      text: 'كان 1989–1992 ← بوردو 1992–1996 ← يوفنتوس 1996–2001 ← ريال مدريد 2001–2006'
    },
    {
      keys: ['أياكس ثم لعب لسامبدوريا', 'كلارنس سيدورف'],
      text: 'أياكس 1992–1995 ← سامبدوريا 1995–1996 ← ريال مدريد 1996–2000 ← إنتر ميلان 2000–2002 ← ميلان 2002–2012 ← بوتافوغو 2012–2014'
    },
    {
      keys: ['لعب لبارما ثم يوفنتوس', 'جانلويجي بوفون'],
      text: 'بارما 1995–2001 ← يوفنتوس 2001–2018 ← باريس سان جيرمان 2018–2019 ← يوفنتوس 2019–2021 ← بارما 2021–2023'
    },
    {
      keys: ['لعب لبوكا جونيورز ثم برشلونة', 'دييغو مارادونا'],
      text: 'أرجنتينوس جونيورز 1976–1981 ← بوكا جونيورز 1981–1982 ← برشلونة 1982–1984 ← نابولي 1984–1991 ← إشبيلية 1992–1993 ← نيولز أولد بويز 1993–1994 ← بوكا جونيورز 1995–1997'
    },
    {
      keys: ['لعب لأياكس ثم ميلان ثم يوفنتوس', 'إدغار دافيدز'],
      text: 'أياكس 1991–1996 ← ميلان 1996–1997 ← يوفنتوس 1997–2004 ← برشلونة (إعارة) 2004 ← إنتر ميلان 2004–2005 ← توتنهام 2005–2007 ← أياكس 2007–2008 ← كريستال بالاس 2010 ← بارنت 2012–2014'
    },
    {
      keys: ['لعب لفيينورد ثم آرسنال', 'جيوفاني فان برونكهورست'],
      text: 'فينورد 1993–1998 ← آر كي سي فالفيك (إعارة) 1993–1994 ← رينجرز 1998–2001 ← آرسنال 2001–2004 ← برشلونة (إعارة) 2003–2004 ← برشلونة 2004–2007 ← فينورد 2007–2010'
    },
    {
      keys: ['لعب لسبارتا براغ ثم لاتسيو', 'ميلان باروش'],
      text: 'بانيك أوسترافا 1998–2002 ← ليفربول 2002–2005 ← أستون فيلا 2005–2007 ← ليون 2007–2008 ← بورتسموث (إعارة) 2008 ← غلطة سراي 2008–2012 ← بانيك أوسترافا 2013 ← أنطاليا سبور 2013–2014 ← بانيك أوسترافا 2014–2015 ← ملادا بوليسلاف 2015–2016 ← سلوفان ليبيريتس 2016–2017 ← بانيك أوسترافا 2017–2020'
    },
    {
      keys: ['لعب لريد ستار بلغراد ثم لاتسيو', 'نيمانيا فيديتش'],
      text: 'ريد ستار بلغراد 2000–2004 ← سبارتاك سوبوتيتسا (إعارة) 2000–2001 ← سبارتاك موسكو 2004–2006 ← مانشستر يونايتد 2006–2014 ← إنتر ميلان 2014–2016'
    }
  ];

  function applyCareerCorrection() {
    var q = byId('qText');
    if (!q || currentCategory() !== 'مسيرة لاعب') return;

    var current = norm(q.textContent);
    if (!current) return;

    /* Already formatted/corrected for this exact visible question. */
    if (q.getAttribute('data-career108-source') === current) return;

    var hit = null;
    for (var i = 0; i < CAREER_MAP.length && !hit; i++) {
      for (var k = 0; k < CAREER_MAP[i].keys.length; k++) {
        if (current.indexOf(CAREER_MAP[i].keys[k]) !== -1) {
          hit = CAREER_MAP[i];
          break;
        }
      }
    }

    if (!hit) return;

    var target = hit.text + ' ← من هو اللاعب؟';
    if (current !== target) {
      q.setAttribute('data-career108-applied', '1');
      q.textContent = target;
    }
    q.setAttribute('data-career108-source', norm(q.textContent));
  }

  function storyPromptFromDirectQuestion(current) {
    var text = norm(current);
    if (!text) return '';

    /* Keep prompts that are already written as a narrative. */
    if (
      text.length >= 150 ||
      /بدأ مسيرته|خلال مسيرته|في مسيرته|نشأ|انتقل بعدها|بعد أن|قبل أن|رحل إلى/.test(text)
    ) {
      return '';
    }

    /* Convert only direct "who is the player who..." wording.
       The clue itself is preserved; no new factual claim is invented. */
    var m = text.match(/^(?:من هو اللاعب|من اللاعب)\s+الذي\s+(.+?)[؟?]?$/);
    if (!m) return '';

    var clue = norm(m[1]).replace(/[؟?]+$/, '');
    if (!clue) return '';

    return 'بدأت الحكاية من تفصيل كروي لافت: ' + clue +
      '. هذا التفصيل يقود إلى لاعب معروف، لكن اسمه غير مذكور. ' +
      'اعتمد على القصة وحدد هويته: من هو اللاعب؟';
  }

  function applyWhoPlayerStory() {
    var q = byId('qText');
    if (!q || currentCategory() !== 'من هو اللاعب') return;

    var current = norm(q.textContent);
    if (!current) return;

    /* Avoid repeatedly rewriting our own output. */
    if (q.getAttribute('data-who108-story') === '1' &&
        q.getAttribute('data-who108-result') === current) {
      return;
    }

    var story = storyPromptFromDirectQuestion(current);
    if (!story || story === current) return;

    q.textContent = story;
    q.setAttribute('data-who108-story', '1');
    q.setAttribute('data-who108-result', norm(q.textContent));
  }

  function applyQuestionFixes() {
    applyCareerCorrection();
    applyWhoPlayerStory();
    applyVisual108();
  }

  function resetQuestionFlags() {
    var q = byId('qText');
    if (!q) return;
    q.removeAttribute('data-career108-applied');
    q.removeAttribute('data-career108-source');
    q.removeAttribute('data-who108-story');
    q.removeAttribute('data-who108-result');
    q.removeAttribute('data-common108-rendered');
    q.removeAttribute('data-common108-original');
    q.classList.remove('commonClubQuestion108');
  }


  /* ===== BUILD 108 visual refinement: common club + compact career ===== */

  function escHtml(value) {
    return String(value || '').replace(/[&<>"']/g, function (c) {
      return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c];
    });
  }

  function ensure108Styles() {
    if (byId('build108Fixed4Styles')) return;

    var style = document.createElement('style');
    style.id = 'build108Fixed4Styles';
    style.textContent = `
      /* Common-club question */
      #qText.commonClubQuestion108{
        width:min(100%,820px)!important;
        max-width:820px!important;
        padding:12px 10px 10px!important;
        box-sizing:border-box!important;
        text-align:center!important;
        overflow:visible!important;
      }
      .commonClubTitle108{
        font-size:clamp(20px,4.7vw,34px);
        line-height:1.25;
        font-weight:950;
        margin:0 0 14px;
      }
      .commonPlayers108{
        display:grid;
        grid-template-columns:repeat(var(--common-count,3),minmax(0,1fr));
        gap:10px;
        width:100%;
        max-width:720px;
        margin:0 auto;
      }
      .commonPlayer108{
        min-width:0;
        overflow:hidden;
        border:1px solid rgba(214,169,68,.42);
        border-radius:16px;
        background:rgba(255,255,255,.07);
        box-shadow:0 6px 18px rgba(0,0,0,.16);
      }
      .commonPhotoWrap108{
        position:relative;
        aspect-ratio:4/5;
        width:100%;
        overflow:hidden;
        background:linear-gradient(145deg,rgba(255,255,255,.10),rgba(255,255,255,.03));
      }
      .commonPhoto108{
        display:block;
        width:100%!important;
        height:100%!important;
        max-width:none!important;
        object-fit:cover!important;
        object-position:50% 18%;
        border-radius:0!important;
        box-shadow:none!important;
      }
      .commonFallback108{
        position:absolute;
        inset:0;
        display:grid;
        place-items:center;
        font-size:clamp(34px,8vw,58px);
        background:rgba(255,255,255,.04);
      }
      .commonPlayerName108{
        min-height:42px;
        display:flex;
        align-items:center;
        justify-content:center;
        padding:7px 5px 8px;
        font-size:clamp(13px,3.3vw,20px);
        line-height:1.15;
        font-weight:900;
      }
      .commonClubHint108{
        margin-top:12px;
        font-size:clamp(13px,3vw,18px);
        opacity:.78;
        font-weight:750;
      }

      /* Compact career: override BUILD 107 vertical list */
      #qText.careerQuestion107,
      #qText.careerQuestion108{
        width:min(100%,900px)!important;
        max-width:900px!important;
        padding:6px 4px!important;
        box-sizing:border-box!important;
        font-size:clamp(12px,2.6vw,18px)!important;
      }
      #qText .careerTitle{
        margin:0 0 8px!important;
        font-size:clamp(19px,4.2vw,28px)!important;
        line-height:1.15!important;
      }
      #qText .careerTimeline{
        display:grid!important;
        grid-template-columns:repeat(2,minmax(0,1fr))!important;
        gap:7px!important;
        width:100%!important;
        max-width:820px!important;
        margin:0 auto!important;
        padding:0!important;
      }
      #qText .careerTimeline li{
        position:relative!important;
        display:grid!important;
        grid-template-columns:28px minmax(0,1fr)!important;
        grid-template-rows:auto auto!important;
        grid-template-areas:
          "idx club"
          "idx period"!important;
        align-items:center!important;
        column-gap:7px!important;
        row-gap:1px!important;
        min-height:58px!important;
        padding:6px 8px!important;
        margin:0!important;
        border-radius:12px!important;
        box-sizing:border-box!important;
        text-align:right!important;
      }
      #qText .careerIndex{
        grid-area:idx!important;
        width:26px!important;
        height:26px!important;
        font-size:13px!important;
      }
      #qText .careerClub{
        grid-area:club!important;
        min-width:0!important;
        font-size:clamp(13px,3.1vw,18px)!important;
        line-height:1.12!important;
        font-weight:950!important;
        overflow-wrap:anywhere!important;
      }
      #qText .careerPeriod{
        grid-area:period!important;
        justify-self:start!important;
        font-size:clamp(11px,2.6vw,15px)!important;
        line-height:1.1!important;
        opacity:.78!important;
        white-space:nowrap!important;
      }
      #qText .careerAsk{
        margin-top:8px!important;
        font-size:clamp(17px,3.7vw,23px)!important;
        line-height:1.1!important;
        font-weight:950!important;
      }

      @media (orientation:landscape){
        #qText .careerTimeline{
          grid-template-columns:repeat(3,minmax(0,1fr))!important;
          gap:5px!important;
        }
        #qText .careerTimeline li{
          min-height:48px!important;
          padding:4px 6px!important;
        }
        #qText .careerTitle{margin-bottom:5px!important}
        #qText .careerAsk{margin-top:5px!important}
        .commonPlayers108{max-width:620px}
        .commonPhotoWrap108{aspect-ratio:1/1}
      }

      @media (max-width:380px){
        #qText .careerTimeline{gap:5px!important}
        #qText .careerTimeline li{
          min-height:54px!important;
          padding:5px 6px!important;
          grid-template-columns:24px minmax(0,1fr)!important;
          column-gap:5px!important;
        }
        #qText .careerIndex{width:22px!important;height:22px!important;font-size:11px!important}
        .commonPlayers108{gap:7px}
        .commonPlayerName108{font-size:12px;min-height:38px}
      }
    `;
    document.head.appendChild(style);
  }

  function parseCommonClubPlayers(text) {
    var t = norm(text).replace(/[؟?]+$/, '');
    var match = t.match(/(?:في\s+مسيرة|مسيرة)\s+(.+)$/);
    if (!match) return [];

    var raw = match[1];
    var names = raw.split(/\s*[،,]\s*/).map(norm).filter(Boolean);

    /* Questions in this category are audited to contain 3+ players.
       Limit the visual layer to 4 cards so it stays usable on a phone. */
    return names.length >= 3 ? names.slice(0, 4) : [];
  }

  function wikiThumbUrl(name) {
    var params =
      '?action=query&generator=search' +
      '&gsrnamespace=0&gsrlimit=1' +
      '&gsrsearch=' + encodeURIComponent(name + ' لاعب كرة قدم') +
      '&prop=pageimages&piprop=thumbnail&pithumbsize=420' +
      '&format=json&origin=*';
    return 'https://ar.wikipedia.org/w/api.php' + params;
  }

  function loadPlayerPhoto(name, img, fallback) {
    var cacheKey = 'alm108-photo:' + name;
    try {
      var cached = sessionStorage.getItem(cacheKey);
      if (cached) {
        img.onload = function(){ fallback.style.display='none'; };
        img.src = cached;
        return;
      }
    } catch (_) {}

    var controller = typeof AbortController !== 'undefined' ? new AbortController() : null;
    var timer = controller ? setTimeout(function(){ controller.abort(); }, 5000) : null;

    fetch(wikiThumbUrl(name), controller ? {signal:controller.signal} : {})
      .then(function(r){ return r.ok ? r.json() : Promise.reject(new Error('wiki '+r.status)); })
      .then(function(data){
        var pages = data && data.query && data.query.pages ? Object.values(data.query.pages) : [];
        var src = pages[0] && pages[0].thumbnail && pages[0].thumbnail.source;
        if (!src) throw new Error('no thumbnail');
        try { sessionStorage.setItem(cacheKey, src); } catch (_) {}
        img.onload = function(){ fallback.style.display='none'; };
        img.src = src;
      })
      .catch(function(){ /* football fallback remains visible */ })
      .finally(function(){ if (timer) clearTimeout(timer); });
  }

  function renderCommonClub() {
    var q = byId('qText');
    if (!q || currentCategory() !== 'النادي المشترك') return;

    if (q.getAttribute('data-common108-rendered') === '1') return;

    var original = norm(q.textContent);
    var players = parseCommonClubPlayers(original);
    if (players.length < 3) return;

    q.setAttribute('data-common108-original', original);
    q.setAttribute('data-common108-rendered', '1');
    q.classList.add('commonClubQuestion108');

    var columns = players.length >= 4 ? 2 : 3;
    var cards = players.map(function(name, i){
      return (
        '<div class="commonPlayer108">' +
          '<div class="commonPhotoWrap108">' +
            '<div class="commonFallback108" id="commonFallback108_'+i+'">⚽</div>' +
            '<img class="commonPhoto108" id="commonPhoto108_'+i+'" alt="' + escHtml(name) + '">' +
          '</div>' +
          '<div class="commonPlayerName108">' + escHtml(name) + '</div>' +
        '</div>'
      );
    }).join('');

    q.innerHTML =
      '<div class="commonClubTitle108">ما النادي المشترك بين هؤلاء اللاعبين؟</div>' +
      '<div class="commonPlayers108" style="--common-count:' + columns + '">' + cards + '</div>' +
      '<div class="commonClubHint108">ابحث عن النادي الوحيد الذي جمع مسيراتهم</div>';

    players.forEach(function(name, i){
      var img = byId('commonPhoto108_'+i);
      var fallback = byId('commonFallback108_'+i);
      if (img && fallback) loadPlayerPhoto(name, img, fallback);
    });
  }

  function markBuild108() {
    try {
      var walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
      var node;
      while ((node = walker.nextNode())) {
        if (/BUILD\s*107/i.test(node.nodeValue || '')) {
          node.nodeValue = node.nodeValue.replace(/BUILD\s*107/gi, 'BUILD 108');
        }
      }
    } catch (_) {}
  }

  function applyVisual108() {
    ensure108Styles();
    renderCommonClub();

    var q = byId('qText');
    if (q && currentCategory() === 'مسيرة لاعب') {
      q.classList.add('careerQuestion108');
    }

    markBuild108();
  }

  function init() {
    ensure108Styles();
    markBuild108();
    var q = byId('qText');
    if (!q) {
      setTimeout(init, 100);
      return;
    }

    var scheduled = false;
    var observer = new MutationObserver(function () {
      if (scheduled) return;
      scheduled = true;
      requestAnimationFrame(function () {
        scheduled = false;
        applyQuestionFixes();
      });
    });

    observer.observe(q, {
      childList: true,
      subtree: true,
      characterData: true
    });

    document.addEventListener('click', function (e) {
      var target = e.target;
      if (target && target.closest && target.closest('[onclick*="openQuestion"]')) {
        resetQuestionFlags();
        setTimeout(applyQuestionFixes, 30);
        setTimeout(applyQuestionFixes, 100);
      }
    }, true);

    applyQuestionFixes();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init, { once: true });
  } else {
    init();
  }
})();
