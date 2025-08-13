// Enhanced content script for Explain This Page extension v2.1
(function() {
  'use strict';

  if (window.__explainPageInjected) return;
  window.__explainPageInjected = true;

  const jargonDictionary = {
    "API": "Application Programming Interface - a way for software to talk to other software",
    "JavaScript": "A programming language that makes web pages interactive",
    "HTML": "HyperText Markup Language - the basic structure of web pages",
    "CSS": "Cascading Style Sheets - what makes web pages look good",
    "algorithm": "A set of rules or steps to solve a problem",
    "database": "A place where information is stored and organized",
    "server": "A computer that provides services to other computers",
    "browser": "Software used to view websites (like Chrome, Firefox)",
    "debugging": "Finding and fixing problems in computer programs",
    "framework": "A set of tools that helps programmers build software faster",
    "hypothesis": "An educated guess that can be tested",
    "methodology": "The way research is done",
    "paradigm": "A way of thinking about something",
    "synthesis": "Combining different ideas or parts",
    "empirical": "Based on observation and experiment",
    "analysis": "Breaking something down to understand it",
    "correlation": "When two things are connected or related",
    "phenomenon": "Something that happens or exists",
    "criteria": "Standards used to judge or decide something",
    "assessment": "Evaluation or testing",
    "optimization": "Making something work better",
    "implementation": "Putting a plan into action",
    "infrastructure": "The basic systems needed for something to work",
    "stakeholder": "Someone who has an interest in a project",
    "benchmark": "A standard to compare things against",
    "sustainability": "Ability to keep going without causing harm",
    "logistics": "Planning and managing resources",
    "revenue": "Money coming in from sales",
    "expenditure": "Money being spent",
    "acquisition": "Buying or obtaining something",
    "diagnosis": "Identifying what disease or problem someone has",
    "therapy": "Treatment to help someone get better",
    "symptoms": "Signs that show someone might be sick",
    "chronic": "Long-lasting or ongoing",
    "acute": "Happening suddenly or severely"
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
    elementary: { maxSentenceWords: 10, maxWordLength: 6 },
    middle: { maxSentenceWords: 15, maxWordLength: 8 },
    high: { maxSentenceWords: 20, maxWordLength: 10 }
  };

  let currentLevel = 'middle';
  let pageStats = { wordsSimplified: 0, jargonExplained: 0 };

  function escapeRegExp(string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }

  // Load user settings
  try {
    chrome.storage.sync.get(['explainPageLevel', 'autoDetect'], (result) => {
      if (result.explainPageLevel) currentLevel = result.explainPageLevel;
      if (result.autoDetect !== false && checkComplexity()) {
        setTimeout(() => injectBanner(), 800);
      }
    });
  } catch (err) {
    console.warn('Storage load failed, defaulting behavior', err);
    if (checkComplexity()) setTimeout(() => injectBanner(), 800);
  }

  function checkComplexity() {
    try {
      const text = (document.body && document.body.innerText) || '';
      if (text.length < 500) return false;

      const words = text.split(/\s+/).filter(Boolean);
      if (!words.length) return false;

      const sentences = text.split(/[.!?]+/).map(s => s.trim()).filter(Boolean);

      const longWords = words.filter(w => w.length > 8);
      const longWordRatio = longWords.length / words.length;

      const jargonHits = Object.keys(jargonDictionary).filter(term => text.toLowerCase().includes(term.toLowerCase()));

      const longSentences = sentences.filter(s => s.split(/\s+/).filter(Boolean).length > 20);
      const longSentenceRatio = sentences.length ? (longSentences.length / sentences.length) : 0;

      return longWordRatio > 0.12 || jargonHits.length >= 3 || longSentenceRatio > 0.3;
    } catch (error) {
      console.error('Error checking complexity', error);
      return false;
    }
  }

  // Simplify words (string-level) and count occurrences
  function simplifyWords(text) {
    let simplified = text;
    try {
      Object.entries(wordSimplifications).forEach(([complex, simple]) => {
        const regex = new RegExp(`\\b${escapeRegExp(complex)}\\b`, 'gi');
        const matches = [...simplified.matchAll(regex)];
        if (matches.length) {
          pageStats.wordsSimplified += matches.length;
          simplified = simplified.replace(regex, simple);
        }
      });
    } catch (err) {
      console.error('Error in simplifyWords', err);
    }
    return simplified;
  }

  function breakLongSentences(text, level) {
    try {
      const levelConfig = readingLevels[level] || readingLevels.middle;
      // Split by sentence terminators while keeping them
      const parts = text.split(/([.!?]+)/);
      let result = '';
      for (let i = 0; i < parts.length; i += 2) {
        const sentence = (parts[i] || '').trim();
        const punctuation = parts[i + 1] || '';
        if (!sentence) {
          result += punctuation;
          continue;
        }

        const words = sentence.split(/\s+/).filter(Boolean);
        if (words.length > levelConfig.maxSentenceWords) {
          const breakWords = ['and', 'but', 'or', 'because', 'since', 'when', 'while', 'although'];
          let broken = sentence;
          breakWords.forEach(word => {
            const r = new RegExp(`\\s+${escapeRegExp(word)}\\s+`, 'gi');
            broken = broken.replace(r, `.\\n${word.charAt(0).toUpperCase() + word.slice(1)} `);
          });

          if (broken.split(/\s+/).filter(Boolean).length > levelConfig.maxSentenceWords) {
            broken = broken.replace(/,\s+/g, '.\\n');
          }

          result += broken + punctuation + ' ';
        } else {
          result += sentence + punctuation + ' ';
        }
      }
      return result.trim();
    } catch (err) {
      console.error('Error in breakLongSentences', err);
      return text;
    }
  }

  // Main text simplification: operate on text nodes, produce a fragment with tooltips
  function simplifyText(element, level = currentLevel) {
    try {
      const walker = document.createTreeWalker(element, NodeFilter.SHOW_TEXT, {
        acceptNode: function(node) {
          const parent = node.parentElement;
          if (!parent) return NodeFilter.FILTER_REJECT;
          const excludeTags = ['SCRIPT', 'STYLE', 'NOSCRIPT', 'TEXTAREA', 'INPUT', 'BUTTON', 'CODE', 'PRE'];
          if (excludeTags.includes(parent.tagName)) return NodeFilter.FILTER_REJECT;
          if (!node.nodeValue || !node.nodeValue.trim()) return NodeFilter.FILTER_REJECT;
          return NodeFilter.FILTER_ACCEPT;
        }
      }, false);

      const textNodes = [];
      let node;
      while (node = walker.nextNode()) textNodes.push(node);

      // Build combined jargon regex
      const terms = Object.keys(jargonDictionary).map(escapeRegExp).sort((a,b)=> b.length-a.length);
      const jargonRegex = terms.length ? new RegExp(`\\b(${terms.join('|')})\\b`, 'gi') : null;

      textNodes.forEach(textNode => {
        const original = textNode.nodeValue;
        if (!original) return;

        // String-level simplification first
        let processed = simplifyWords(original);
        processed = breakLongSentences(processed, level);

        // If no jargon terms, just replace text node's value
        if (!jargonRegex) {
          if (processed !== original) {
            textNode.nodeValue = processed;
          }
          return;
        }

        // Build a fragment with text nodes + tooltip spans
        const frag = document.createDocumentFragment();
        let lastIndex = 0;
        let m;
        while ((m = jargonRegex.exec(processed)) !== null) {
          const idx = m.index;
          const matched = m[0];
          if (idx > lastIndex) {
            frag.appendChild(document.createTextNode(processed.slice(lastIndex, idx)));
          }

          const span = document.createElement('span');
          span.textContent = matched;
          span.className = 'explain-tooltip';
          span.title = jargonDictionary[matched] || jargonDictionary[matched.toLowerCase()] || '';
          frag.appendChild(span);

          pageStats.jargonExplained++;
          lastIndex = idx + matched.length;
        }

        if (lastIndex < processed.length) {
          frag.appendChild(document.createTextNode(processed.slice(lastIndex)));
        }

        // Replace the original text node with the built fragment
        if (frag.childNodes.length) {
          textNode.parentNode.replaceChild(frag, textNode);
        } else if (processed !== original) {
          textNode.nodeValue = processed;
        }
      });

    } catch (err) {
      console.error('Error simplifying text:', err);
    }
  }

  // Overlay creation and regeneration
  function createOverlay(originalHTML) {
    if (document.getElementById('explain-page-overlay')) return;
    try {
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
              <button id="explain-close-btn">✖ Close</button>
            </div>
          </div>
          <div class="explain-content-container">
            <div class="explain-original-content">
              <h3>Original Content</h3>
              <div class="explain-content-scroll" id="original-content"></div>
            </div>
            <div class="explain-simplified-content">
              <h3>Simplified Content (${currentLevel.charAt(0).toUpperCase() + currentLevel.slice(1)} Level)</h3>
              <div class="explain-content-scroll" id="simplified-content">
                <div class="explain-loading">🔄 Simplifying content...</div>
              </div>
            </div>
          </div>
          <div class="explain-stats">
            <span>Words simplified: <strong>${pageStats.wordsSimplified}</strong></span>
            <span>Jargon explained: <strong>${pageStats.jargonExplained}</strong></span>
          </div>
        </div>
      `;

      document.body.appendChild(overlay);

      document.getElementById('explain-close-btn').onclick = () => overlay.remove();
      document.getElementById('explain-level-selector').value = currentLevel;
      document.getElementById('explain-level-selector').onchange = (e) => {
        currentLevel = e.target.value;
        regenerateSimplifiedContent();
      };

      document.getElementById('original-content').innerHTML = originalHTML;
      setTimeout(() => regenerateSimplifiedContent(), 400);

    } catch (err) {
      console.error('Error creating overlay', err);
    }
  }

  function regenerateSimplifiedContent() {
    const simplifiedContainer = document.getElementById('simplified-content');
    if (!simplifiedContainer) return;
    try {
      simplifiedContainer.innerHTML = '<div class="explain-loading">🔄 Simplifying content...</div>';
      setTimeout(() => {
        pageStats = { wordsSimplified: 0, jargonExplained: 0 };
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = document.getElementById('original-content').innerHTML;
        simplifyText(tempDiv, currentLevel);

        simplifiedContainer.innerHTML = '';
        // Move children of tempDiv into simplifiedContainer
        Array.from(tempDiv.childNodes).forEach(node => simplifiedContainer.appendChild(node));

        const statsElement = document.querySelector('.explain-stats');
        if (statsElement) {
          statsElement.innerHTML = `
            <span>Words simplified: <strong>${pageStats.wordsSimplified}</strong></span>
            <span>Jargon explained: <strong>${pageStats.jargonExplained}</strong></span>
          `;
        }

        const header = document.querySelector('.explain-simplified-content h3');
        if (header) header.textContent = `Simplified Content (${currentLevel.charAt(0).toUpperCase() + currentLevel.slice(1)} Level)`;
      }, 400);
    } catch (err) {
      console.error('Error regenerating content', err);
    }
  }

  function injectBanner() {
    if (document.getElementById('explain-page-banner')) return;
    try {
      const banner = document.createElement('div');
      banner.id = 'explain-page-banner';
      banner.innerHTML = `
        <div class="explain-banner-content">
          <div class="explain-banner-icon">📖</div>
          <div class="explain-banner-text">
            <strong>This page looks complex!</strong><br>Click to simplify it for easier reading
          </div>
          <button class="explain-banner-btn">Explain This Page</button>
        </div>
      `;

      banner.onclick = () => { createOverlay(document.body.innerHTML); updateUsageStats(); };
      document.body.appendChild(banner);
      setTimeout(() => { if (banner.parentNode) banner.style.opacity = '0.85'; }, 10000);
    } catch (err) {
      console.error('Error injecting banner', err);
    }
  }

  function updateUsageStats() {
    try {
      chrome.storage.sync.get(['pagesExplained', 'totalWordsSimplified'], (result) => {
        const pagesExplained = (result.pagesExplained || 0) + 1;
        const totalWordsSimplified = (result.totalWordsSimplified || 0) + pageStats.wordsSimplified;
        chrome.storage.sync.set({ pagesExplained, totalWordsSimplified, lastUsed: Date.now() });
      });
    } catch (err) {
      console.error('Error updating stats', err);
    }
  }

  // Listen for events from popup or background
  window.addEventListener('explain-page-request', () => { createOverlay(document.body.innerHTML); updateUsageStats(); });

  // Listen for level changes triggered from popup
  window.addEventListener('explain-page-level-changed', (e) => {
    if (e && e.detail) {
      currentLevel = e.detail;
      regenerateSimplifiedContent();
    }
  });

  // Message listener (for explicit messages)
  if (typeof chrome !== 'undefined' && chrome.runtime) {
    chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
      if (request.action === 'explainPage') {
        createOverlay(document.body.innerHTML);
        updateUsageStats();
        sendResponse({ success: true });
      }
    });
  }

  console.log('Explain This Page content script loaded (v2.1)');
})();
