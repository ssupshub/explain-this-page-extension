\
/* content.js — Explain This Page — Full fixes (summarize + simplify + UX fixes) v2.2 */
(function () {
  'use strict';

  if (window.__explainPageInjected_v2_2) return;
  window.__explainPageInjected_v2_2 = true;

  const jargonDictionary = {
    "API": "Application Programming Interface - a way for software to talk to other software",
    "JavaScript": "A programming language that makes web pages interactive",
    "HTML": "HyperText Markup Language - the basic structure of web pages",
    "CSS": "Cascading Style Sheets - what makes web pages look good",
    "algorithm": "A set of steps to solve a problem",
    "database": "A place where information is stored and organized",
    "server": "A computer that provides services to others",
    "browser": "Software used to view websites (like Chrome)",
    "debugging": "Finding and fixing problems in programs",
    "framework": "Tools that help developers build software faster",
    "hypothesis": "An educated guess that can be tested",
    "methodology": "The way research or work is done",
    "analysis": "Breaking something down to understand it",
    "optimization": "Making something work better",
    "implementation": "Putting a plan into action",
    "infrastructure": "The systems needed for something to work",
    "stakeholder": "Someone who is interested in a project",
    "sustainability": "Ability to keep working without causing harm",
    "revenue": "Money coming in from sales",
    "expenditure": "Money being spent"
  };

  const wordSimplifications = {
    'utilize': 'use', 'demonstrate': 'show', 'implement': 'do', 'facilitate': 'help',
    'approximately': 'about', 'subsequently': 'then', 'consequently': 'so', 'furthermore': 'also',
    'however': 'but', 'therefore': 'so', 'nevertheless': 'but', 'predominantly': 'mostly',
    'substantial': 'large', 'commence': 'start', 'terminate': 'end', 'acquire': 'get',
    'sufficient': 'enough', 'eliminate': 'remove', 'construct': 'build', 'purchase': 'buy',
    'establish': 'set up', 'maintain': 'keep', 'indicate': 'show', 'require': 'need',
    'assist': 'help', 'provide': 'give', 'obtain': 'get', 'create': 'make', 'develop': 'make',
    'produce': 'make'
  };

  const readingLevels = {
    elementary: { maxSentenceWords: 12, summarySentences: 2 },
    middle: { maxSentenceWords: 18, summarySentences: 3 },
    high: { maxSentenceWords: 28, summarySentences: 5 }
  };

  const STOPWORDS = new Set([
    'the','is','in','at','which','on','and','a','an','of','for','to','with','that','this','it','as','are','by','from','or','be','we','you','can','will','has','have'
  ]);

  function escapeRegExp(s){ return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); }

  function extractPageText() {
    try {
      const excludeTags = new Set(['SCRIPT','STYLE','NOSCRIPT','TEXTAREA','INPUT','BUTTON','CODE','PRE','IFRAME','SVG']);
      let parts = [];
      const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_ELEMENT, {
        acceptNode(node) {
          if (!node || !node.tagName) return NodeFilter.FILTER_REJECT;
          if (excludeTags.has(node.tagName)) return NodeFilter.FILTER_REJECT;
          const style = window.getComputedStyle(node);
          if (style && (style.visibility === 'hidden' || style.display === 'none' || style.opacity === '0')) return NodeFilter.FILTER_REJECT;
          return NodeFilter.FILTER_ACCEPT;
        }
      });
      let cur;
      while ((cur = walker.nextNode())) {
        const txt = cur.innerText || '';
        if (txt && txt.trim().length > 30) {
          parts.push(txt.trim());
        }
      }
      const joined = parts.join('\n\n');
      return joined.length ? joined : (document.body.innerText || document.body.textContent || '');
    } catch (e) {
      console.error('extractPageText error', e);
      return (document.body && (document.body.innerText || document.body.textContent)) || '';
    }
  }

  function summarizeText(fullText, levelKey = 'middle') {
    const config = readingLevels[levelKey] || readingLevels.middle;
    const rawSentences = (fullText.match(/[^.!?]+[.!?]?/g) || []).map(s => s.trim()).filter(Boolean);
    if (!rawSentences.length) return [];

    const freq = {};
    rawSentences.forEach(sent => {
      const words = sent.toLowerCase().replace(/[^a-z0-9\s]/gi,' ').split(/\s+/).filter(Boolean);
      words.forEach(w => {
        if (STOPWORDS.has(w)) return;
        freq[w] = (freq[w] || 0) + 1;
      });
    });

    const scores = rawSentences.map((sent, idx) => {
      const words = sent.toLowerCase().replace(/[^a-z0-9\s]/gi,' ').split(/\s+/).filter(Boolean);
      let score = 0;
      words.forEach(w => {
        if (STOPWORDS.has(w)) return;
        score += (freq[w] || 0);
      });
      score = words.length ? (score / Math.sqrt(words.length)) : 0;
      return { idx, sent, score };
    });

    const N = Math.max(1, config.summarySentences || 3);
    const top = scores.slice().sort((a,b)=> b.score - a.score).slice(0, N).sort((a,b)=> a.idx - b.idx);
    return top.map(t => t.sent);
  }

  function breakIntoShortChunks(sentence, maxWords) {
    const words = sentence.split(/\s+/).filter(Boolean);
    if (words.length <= maxWords) return [sentence];
    const splitPoints = sentence.split(/[,;:]+/).map(s => s.trim()).filter(Boolean);
    if (splitPoints.length > 1) {
      const chunks = [];
      splitPoints.forEach(sp => {
        const w = sp.split(/\s+/).filter(Boolean);
        if (w.length <= maxWords) chunks.push(sp);
        else {
          for (let i=0;i<w.length;i+=maxWords){
            chunks.push(w.slice(i, i+maxWords).join(' '));
          }
        }
      });
      return chunks;
    }
    const out = [];
    for (let i=0;i<words.length;i+=maxWords) out.push(words.slice(i,i+maxWords).join(' '));
    return out;
  }

  function simplifyStringAndCount(s, stats) {
    let text = s;
    try {
      Object.entries(wordSimplifications).forEach(([complex, simple]) => {
        const r = new RegExp(`\\b${escapeRegExp(complex)}\\b`, 'gi');
        const matches = text.match(r);
        if (matches && matches.length) {
          stats.wordsSimplified += matches.length;
          text = text.replace(r, simple);
        }
      });
    } catch (e) { console.error('simplifyString error', e); }
    return text;
  }

  function buildSimplifiedFragment(sentences, levelKey, stats) {
    const frag = document.createDocumentFragment();
    const terms = Object.keys(jargonDictionary).map(escapeRegExp).sort((a,b)=> b.length - a.length);
    const jargonRegex = terms.length ? new RegExp(`\\b(${terms.join('|')})\\b`, 'gi') : null;
    const config = readingLevels[levelKey] || readingLevels.middle;
    sentences.forEach(sentence => {
      let processed = simplifyStringAndCount(sentence, stats);
      const chunks = breakIntoShortChunks(processed, config.maxSentenceWords || 18);
      chunks.forEach(chunk => {
        const p = document.createElement('p');
        if (!jargonRegex) {
          p.textContent = chunk;
        } else {
          let lastIndex = 0;
          let m;
          jargonRegex.lastIndex = 0;
          while ((m = jargonRegex.exec(chunk)) !== null) {
            const idx = m.index;
            const matched = m[0];
            if (idx > lastIndex) p.appendChild(document.createTextNode(chunk.slice(lastIndex, idx)));
            const span = document.createElement('span');
            span.textContent = matched;
            span.className = 'explain-tooltip';
            span.title = jargonDictionary[matched] || jargonDictionary[matched.toLowerCase()] || '';
            p.appendChild(span);
            stats.jargonExplained++;
            lastIndex = idx + matched.length;
          }
          if (lastIndex < chunk.length) p.appendChild(document.createTextNode(chunk.slice(lastIndex)));
        }
        frag.appendChild(p);
      });
    });
    return frag;
  }

  function createBanner() {
    if (document.getElementById('explain-page-banner')) return;
    try {
      const banner = document.createElement('div');
      banner.id = 'explain-page-banner';
      banner.innerHTML = `
        <div class="explain-banner-content">
          <div class="explain-banner-icon">📖</div>
          <div class="explain-banner-text"><strong>This page looks complex!</strong><br>Click to simplify it.</div>
          <button class="explain-banner-btn">Explain This Page</button>
        </div>
      `;
      banner.classList.remove('fade-out');
      document.body.appendChild(banner);
      banner.addEventListener('click', (ev) => {
        ev.preventDefault();
        banner.classList.add('fade-out');
        banner.addEventListener('transitionend', () => {
          if (banner.parentNode) banner.parentNode.removeChild(banner);
        }, { once: true });
        dispatchExplainWithSnapshot();
      }, { once: true });
    } catch (e) { console.error('createBanner error', e); }
  }

  function createOverlayFromSnapshot(snapshotText, levelKey = currentLevel) {
    try {
      if (document.getElementById('explain-page-overlay')) return;
      const overlay = document.createElement('div');
      overlay.id = 'explain-page-overlay';
      overlay.innerHTML = `
        <div class="explain-overlay-content">
          <div class="explain-header">
            <h2>📖 Explain This Page</h2>
            <div class="explain-controls">
              <select id="explain-level-selector">
                <option value="elementary">Elementary</option>
                <option value="middle">Middle School</option>
                <option value="high">High School</option>
              </select>
              <button id="explain-close-btn" aria-label="Close overlay">✖ Close</button>
            </div>
          </div>
          <div class="explain-content-container">
            <div class="explain-original-content">
              <h3>Original Content</h3>
              <div class="explain-content-scroll" id="original-content"></div>
            </div>
            <div class="explain-simplified-content">
              <h3 class="simplified-title">Simplified Content</h3>
              <div class="explain-content-scroll" id="simplified-content">
                <div class="explain-loading">🔄 Simplifying content...</div>
              </div>
            </div>
          </div>
          <div class="explain-stats">
            <span>Words simplified: <strong id="stat-words">0</strong></span>
            <span>Jargon explained: <strong id="stat-jargon">0</strong></span>
          </div>
        </div>
      `;
      document.body.appendChild(overlay);
      const origElem = document.getElementById('original-content');
      if (origElem) {
        snapshotText.split(/\n\s*\n/).forEach(pText => {
          const p = document.createElement('p');
          p.textContent = pText.trim();
          origElem.appendChild(p);
        });
      }
      const closeBtn = document.getElementById('explain-close-btn');
      if (closeBtn) closeBtn.onclick = () => { overlay.remove(); };
      const levelSelector = document.getElementById('explain-level-selector');
      if (levelSelector) {
        levelSelector.value = levelKey;
        levelSelector.onchange = (e) => {
          currentLevel = e.target.value;
          regenerateSimplified(snapshotText, currentLevel);
        };
      }
      regenerateSimplified(snapshotText, levelKey);
    } catch (e) { console.error('createOverlayFromSnapshot error', e); }
  }

  function regenerateSimplified(snapshotText, levelKey) {
    try {
      const simplifiedContainer = document.getElementById('simplified-content');
      const statWordsEl = document.getElementById('stat-words');
      const statJargonEl = document.getElementById('stat-jargon');
      const titleEl = document.querySelector('.simplified-title');
      if (!simplifiedContainer) return;
      simplifiedContainer.innerHTML = '<div class="explain-loading">🔄 Simplifying content...</div>';
      if (titleEl) titleEl.textContent = `Simplified Content (${(levelKey || currentLevel || 'middle').charAt(0).toUpperCase() + (levelKey || currentLevel || 'middle').slice(1)} Level)`;
      setTimeout(() => {
        try {
          const stats = { wordsSimplified: 0, jargonExplained: 0 };
          const sentences = summarizeText(snapshotText, levelKey);
          const finalSentences = (sentences.length ? sentences : snapshotText.split(/\n+/).slice(0, (readingLevels[levelKey]||readingLevels.middle).summarySentences || 3));
          const frag = buildSimplifiedFragment(finalSentences, levelKey, stats);
          simplifiedContainer.innerHTML = '';
          simplifiedContainer.appendChild(frag);
          if (statWordsEl) statWordsEl.textContent = stats.wordsSimplified || 0;
          if (statJargonEl) statJargonEl.textContent = stats.jargonExplained || 0;
          try {
            if (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.sync) {
              chrome.storage.sync.get(['pagesExplained','totalWordsSimplified'], (res) => {
                const pagesExplained = (res.pagesExplained || 0) + 1;
                const totalWordsSimplified = (res.totalWordsSimplified || 0) + (stats.wordsSimplified || 0);
                chrome.storage.sync.set({ pagesExplained, totalWordsSimplified, lastUsed: Date.now() });
              });
            }
          } catch(e) { console.warn('storage update failed', e); }
        } catch (err) {
          console.error('Error during regenerateSimplified inner', err);
          simplifiedContainer.innerHTML = '<div class="explain-loading">Error simplifying content.</div>';
        }
      }, 120);
    } catch (err) { console.error('regenerateSimplified error', err); }
  }

  function dispatchExplainWithSnapshot(level) {
    try {
      const snapshot = extractPageText();
      if (!snapshot || snapshot.trim().length < 60) {
        createOverlayFromSnapshot(snapshot || document.title || 'No textual content detected on this page.', level || currentLevel);
      } else {
        createOverlayFromSnapshot(snapshot, level || currentLevel);
      }
    } catch (e) { console.error('dispatchExplainWithSnapshot error', e); }
  }

  function dispatchExplainWithSnapshotWrapper() { dispatchExplainWithSnapshot(currentLevel); }

  window.addEventListener('explain-page-request', () => {
    try { dispatchExplainWithSnapshot(); } catch(e) { console.error(e); }
  });

  window.addEventListener('explain-page-level-changed', (e) => {
    if (e && e.detail) {
      currentLevel = e.detail;
      try {
        const origEl = document.getElementById('original-content');
        if (origEl) {
          const snapshot = Array.from(origEl.querySelectorAll('p')).map(p => p.textContent).join('\n\n');
          regenerateSimplified(snapshot, currentLevel);
        }
      } catch (err) { console.error('level change handling error', err); }
    }
  });

  if (typeof chrome !== 'undefined' && chrome.runtime && chrome.runtime.onMessage) {
    chrome.runtime.onMessage.addListener((req, sender, sendResponse) => {
      if (req && req.action === 'explainPage') {
        dispatchExplainWithSnapshot();
        sendResponse && sendResponse({ success: true });
      }
    });
  }

  function checkComplexityAndMaybeShowBanner() {
    try {
      const text = extractPageText();
      if (!text || text.length < 500) return false;
      const words = text.split(/\s+/).filter(Boolean);
      const sentences = text.split(/[.!?]+/).filter(Boolean);
      const longWords = words.filter(w=> w.length > 8).length;
      const longWordRatio = words.length ? longWords/words.length : 0;
      const jargonHits = Object.keys(jargonDictionary).filter(t => text.toLowerCase().includes(t.toLowerCase()));
      if (longWordRatio > 0.12 || (jargonHits.length >= 2) || (sentences.length && (sentences.filter(s => s.split(/\s+/).length > 25).length / sentences.length) > 0.25)) {
        createBanner();
        return true;
      }
      return false;
    } catch (e) { console.error('checkComplexity error', e); return false; }
  }

  let currentLevel = 'middle';

  try {
    if (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.sync) {
      chrome.storage.sync.get(['explainPageLevel'], (res) => {
        if (res && res.explainPageLevel) currentLevel = res.explainPageLevel;
        setTimeout(() => checkComplexityAndMaybeShowBanner(), 400);
      });
    } else {
      setTimeout(() => checkComplexityAndMaybeShowBanner(), 400);
    }
  } catch (err) {
    console.warn('init storage load failed', err);
    setTimeout(() => checkComplexityAndMaybeShowBanner(), 400);
  }

  (function ensureFadeCss() {
    if (document.getElementById('explain-page-fade-css')) return;
    const style = document.createElement('style');
    style.id = 'explain-page-fade-css';
    style.textContent = `
      #explain-page-banner.fade-out { opacity: 0 !important; transform: translateY(8px); transition: opacity .36s ease, transform .36s ease; }
    `;
    document.head.appendChild(style);
  })();

  console.log('Explain This Page content script v2.2 loaded (summarizer + fixes)');
})();
