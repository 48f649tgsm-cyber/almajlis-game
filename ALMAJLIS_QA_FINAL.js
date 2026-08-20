/* ALMAJLIS QUESTION BANK QA CLEANUP - FINAL V2
   Purpose:
   - Keep acceptable 100-point general knowledge questions.
   - Remove trivial/childish questions (e.g. polygon-side counting).
   - Block exact and near-duplicate facts/questions.
   - Preserve "قصص الأنبياء" repeated prophet names when the event/fact differs.
   - Apply stricter per-category rules without rewriting the full bank.
*/

(function () {
  'use strict';

  const QA_VERSION = 'QA-CLEANUP-FINAL-V2';

  const TRIVIAL_PATTERNS = [
    /كم\s+ضلع(?:ًا|ا)?\s+(?:لل|ل)?(?:شكل\s+)?السداسي/i,
    /كم\s+ضلع(?:ًا|ا)?\s+(?:لل|ل)?(?:شكل\s+)?المثمن/i,
    /كم\s+ضلع(?:ًا|ا)?\s+(?:لل|ل)?(?:شكل\s+)?المربع/i,
    /كم\s+ضلع(?:ًا|ا)?\s+(?:لل|ل)?(?:شكل\s+)?المثلث/i
  ];

  const PROPHETS_CATEGORY = 'قصص الأنبياء';

  function normArabic(s) {
    return String(s || '')
      .normalize('NFKD')
      .replace(/[\u064B-\u065F\u0670\u06D6-\u06ED]/g, '')
      .replace(/[أإآ]/g, 'ا')
      .replace(/ة/g, 'ه')
      .replace(/ى/g, 'ي')
      .replace(/ؤ/g, 'و')
      .replace(/ئ/g, 'ي')
      .replace(/[^\u0600-\u06FF0-9A-Za-z]+/g, ' ')
      .replace(/\s+/g, ' ')
      .trim()
      .toLowerCase();
  }

  function isTrivialQuestion(q) {
    const text = String(q && q.question || '');
    return TRIVIAL_PATTERNS.some(r => r.test(text));
  }

  function semanticKey(q, category) {
    if (Array.isArray(q && q.semantic_keys) && q.semantic_keys.length) {
      return q.semantic_keys.map(normArabic).join('|');
    }

    const nq = normArabic(q && q.question);
    const na = normArabic(q && q.answer);

    // In Stories of the Prophets, repeated prophet names are allowed.
    // Therefore answer alone must NEVER be used as a duplicate key.
    if (category === PROPHETS_CATEGORY) {
      return nq;
    }

    return nq + '|' + na;
  }

  function questionOnlyKey(q) {
    return normArabic(q && q.question);
  }

  function cleanCategory(items, category) {
    if (!Array.isArray(items)) return [];

    const seenSemantic = new Set();
    const seenQuestion = new Set();
    const out = [];

    for (const q of items) {
      if (!q || typeof q !== 'object') continue;
      if (!q.question || !q.answer) continue;

      if (isTrivialQuestion(q)) continue;

      const qKey = questionOnlyKey(q);
      if (qKey && seenQuestion.has(qKey)) continue;

      const sKey = semanticKey(q, category);
      if (sKey && seenSemantic.has(sKey)) continue;

      // Basic level sanity:
      // 100 can be easy-to-medium but must not be childish/trivial.
      // 300 and 500 are not auto-deleted here because quality is category-dependent;
      // this layer focuses on safe removals and duplicates only.
      if (![100, 300, 500].includes(Number(q.points))) continue;

      seenQuestion.add(qKey);
      seenSemantic.add(sKey);
      out.push(q);
    }

    return out;
  }

  function findBank() {
    const candidates = [
      window.ALMAJLIS_QUESTIONS,
      window.QUESTIONS,
      window.questions,
      window.questionBank,
      window.QUESTION_BANK
    ];
    for (const c of candidates) {
      if (c && typeof c === 'object') return c;
    }
    return null;
  }

  function applyCleanup() {
    const bank = findBank();
    if (!bank) return false;

    const categories = bank.categories && typeof bank.categories === 'object'
      ? bank.categories
      : bank;

    let removed = 0;
    let total = 0;

    for (const [category, items] of Object.entries(categories)) {
      if (!Array.isArray(items)) continue;
      total += items.length;
      const cleaned = cleanCategory(items, category);
      removed += (items.length - cleaned.length);
      categories[category] = cleaned;
    }

    window.ALMAJLIS_QA_CLEANUP = {
      version: QA_VERSION,
      removed,
      total_before: total,
      prophets_rule:
        'تكرار اسم النبي مسموح إذا اختلفت الواقعة أو المعلومة؛ تكرار نفس الواقعة أو إعادة صياغتها غير مسموح.',
      source_policy:
        'قصص الأنبياء: القرآن الكريم أولًا، ثم الأحاديث الصحيحة أو الحسنة والمصادر السنية الموثوقة.'
    };

    console.info('[ALMAJLIS QA]', window.ALMAJLIS_QA_CLEANUP);
    return true;
  }

  if (!applyCleanup()) {
    let attempts = 0;
    const timer = setInterval(() => {
      attempts++;
      if (applyCleanup() || attempts >= 60) clearInterval(timer);
    }, 250);
  }
})();
