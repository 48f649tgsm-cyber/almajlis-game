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
  window.ALMAJLIS_BUILD = '108-fixed';

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
  }

  function resetQuestionFlags() {
    var q = byId('qText');
    if (!q) return;
    q.removeAttribute('data-career108-applied');
    q.removeAttribute('data-career108-source');
    q.removeAttribute('data-who108-story');
    q.removeAttribute('data-who108-result');
  }

  function init() {
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
