// Enhanced content script for Explain This Page extension v2.0
(function() {
  'use strict';

  // Prevent multiple injections
  if (window.__explainPageInjected) {
    console.log("Explain This Page: Already injected, skipping");
    return;
  }
  window.__explainPageInjected = true;

  // Enhanced jargon dictionary with 35+ terms
  const jargonDictionary = {
    // Tech terms
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

    // Academic terms
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

    // Business terms
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

    // Medical/Science terms
    "diagnosis": "Identifying what disease or problem someone has",
    "therapy": "Treatment to help someone get better",
    "symptoms": "Signs that show someone might be sick",
    "chronic": "Long-lasting or ongoing",
    "acute": "Happening suddenly or severely"
  };

  // Word simplification dictionary
  const wordSimplifications = {
    'utilize': 'use',
    'demonstrate': 'show',
    'implement': 'do',
    'facilitate': 'help',
    'approximately': 'about',
    'subsequently': 'then',
    'consequently': 'so',
    'furthermore': 'also',
    'however': 'but',
    'therefore': 'so',
    'nevertheless': 'but',
    'predominantly': 'mostly',
    'substantial': 'large',
    'commence': 'start',
    'terminate': 'end',
    'acquire': 'get',
    'sufficient': 'enough',
    'eliminate': 'remove',
    'construct': 'build',
    'purchase': 'buy',
    'establish': 'set up',
    'maintain': 'keep',
    'indicate': 'show',
    'require': 'need',
    'assist': 'help',
    'provide': 'give',
    'obtain': 'get',
    'create': 'make',
    'develop': 'make',
    'produce': 'make'
  };

  // Reading levels
  const readingLevels = {
    elementary: { maxSentenceWords: 10, maxWordLength: 6 },
    middle: { maxSentenceWords: 15, maxWordLength: 8 },
    high: { maxSentenceWords: 20, maxWordLength: 10 }
  };

  let currentLevel = 'middle';
  let pageStats = { wordsSimplified: 0, jargonExplained: 0 };

  // Load user settings
  try {
    chrome.storage.sync.get(['explainPageLevel', 'autoDetect'], (result) => {
      if (result.explainPageLevel) {
        currentLevel = result.explainPageLevel;
      }
      if (result.autoDetect !== false && checkComplexity()) {
        setTimeout(() => injectBanner(), 1000);
      }
    });
  } catch (error) {
    console.log("Error loading settings:", error);
    // Fallback: show banner if page is complex
    if (checkComplexity()) {
      setTimeout(() => injectBanner(), 1000);
    }
  }

  // Enhanced complexity detection
  function checkComplexity() {
    try {
      const text = document.body.innerText || '';
      if (text.length < 500) return false; // Skip very short pages

      const words = text.split(/\s+/);
      const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);

      // Count long words (8+ characters)
      const longWords = words.filter(w => w.length > 8);
      const longWordRatio = longWords.length / words.length;

      // Count jargon terms
      const jargonHits = Object.keys(jargonDictionary).filter(term => 
        text.toLowerCase().includes(term.toLowerCase())
      );

      // Count long sentences (20+ words)
      const longSentences = sentences.filter(s => s.split(/\s+/).length > 20);
      const longSentenceRatio = longSentences.length / sentences.length;

      // Complex if:
      // - More than 12% long words
      // - 3+ jargon terms
      // - More than 30% long sentences
      return longWordRatio > 0.12 || jargonHits.length >= 3 || longSentenceRatio > 0.3;
    } catch (error) {
      console.log("Error checking complexity:", error);
      return false;
    }
  }

  // Enhanced text simplification
  function simplifyText(element, level = currentLevel) {
    try {
      const walker = document.createTreeWalker(
        element,
        NodeFilter.SHOW_TEXT,
        {
          acceptNode: function(node) {
            // Skip script, style, and other non-content elements  
            const parent = node.parentElement;
            if (!parent) return NodeFilter.FILTER_REJECT;

            const excludeTags = ['SCRIPT', 'STYLE', 'NOSCRIPT', 'TEXTAREA', 'INPUT', 'BUTTON'];
            if (excludeTags.includes(parent.tagName)) {
              return NodeFilter.FILTER_REJECT;
            }

            return NodeFilter.FILTER_ACCEPT;
          }
        },
        false
      );

      const textNodes = [];
      let node;
      while (node = walker.nextNode()) {
        textNodes.push(node);
      }

      textNodes.forEach(textNode => {
        let text = textNode.nodeValue;
        if (!text || text.trim().length === 0) return;

        // Replace jargon with tooltips
        text = replaceJargonWithTooltips(text, textNode);

        // Simplify words
        text = simplifyWords(text);

        // Break long sentences
        text = breakLongSentences(text, level);

        // Update the text node
        if (text !== textNode.nodeValue) {
          textNode.nodeValue = text;
        }
      });
    } catch (error) {
      console.log("Error simplifying text:", error);
    }
  }

  // Replace jargon terms with tooltip spans
  function replaceJargonWithTooltips(text, textNode) {
    try {
      const fragment = document.createDocumentFragment();
      let lastIndex = 0;
      let modified = false;

      Object.entries(jargonDictionary).forEach(([term, definition]) => {
        const regex = new RegExp(`\\b${term}\\b`, 'gi');
        let match;

        while ((match = regex.exec(text)) !== null) {
          if (!modified) {
            // Add text before the match
            if (match.index > lastIndex) {
              fragment.appendChild(document.createTextNode(text.slice(lastIndex, match.index)));
            }

            // Create tooltip span
            const span = document.createElement('span');
            span.textContent = match[0];
            span.className = 'explain-tooltip';
            span.title = definition;
            fragment.appendChild(span);

            lastIndex = match.index + match[0].length;
            modified = true;
            pageStats.jargonExplained++;
          }
        }
      });

      if (modified) {
        // Add remaining text
        if (lastIndex < text.length) {
          fragment.appendChild(document.createTextNode(text.slice(lastIndex)));
        }

        // Replace the text node with the fragment
        textNode.parentNode.replaceChild(fragment, textNode);
        return text; // Return original for further processing
      }

      return text;
    } catch (error) {
      console.log("Error replacing jargon:", error);
      return text;
    }
  }

  // Simplify complex words
  function simplifyWords(text) {
    let simplified = text;

    try {
      Object.entries(wordSimplifications).forEach(([complex, simple]) => {
        const regex = new RegExp(`\\b${complex}\\b`, 'gi');
        if (regex.test(simplified)) {
          simplified = simplified.replace(regex, simple);
          pageStats.wordsSimplified++;
        }
      });
    } catch (error) {
      console.log("Error simplifying words:", error);
    }

    return simplified;
  }

  // Break long sentences based on reading level
  function breakLongSentences(text, level) {
    try {
      const levelConfig = readingLevels[level] || readingLevels.middle;
      const sentences = text.split(/([.!?]+)/);

      let result = '';
      for (let i = 0; i < sentences.length; i += 2) {
        const sentence = sentences[i];
        const punctuation = sentences[i + 1] || '';

        if (sentence) {
          const words = sentence.trim().split(/\s+/);
          if (words.length > levelConfig.maxSentenceWords) {
            // Break long sentence at conjunctions or commas
            const breakWords = ['and', 'but', 'or', 'because', 'since', 'when', 'while', 'although'];
            let broken = sentence;

            breakWords.forEach(word => {
              const regex = new RegExp(`\\s+${word}\\s+`, 'gi');
              broken = broken.replace(regex, `.\n${word.charAt(0).toUpperCase() + word.slice(1)} `);
            });

            // Also break at commas if sentence is still long
            if (broken.split(/\s+/).length > levelConfig.maxSentenceWords) {
              broken = broken.replace(/,\s+/g, '.\n');
            }

            result += broken + punctuation;
          } else {
            result += sentence + punctuation;
          }
        }
      }

      return result;
    } catch (error) {
      console.log("Error breaking sentences:", error);
      return text;
    }
  }

  // Create enhanced overlay with better UI
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

      // Set up event listeners
      document.getElementById('explain-close-btn').onclick = () => overlay.remove();
      document.getElementById('explain-level-selector').value = currentLevel;
      document.getElementById('explain-level-selector').onchange = (e) => {
        currentLevel = e.target.value;
        regenerateSimplifiedContent();
      };

      // Add original content
      document.getElementById('original-content').innerHTML = originalHTML;

      // Generate simplified content
      setTimeout(() => regenerateSimplifiedContent(), 500);
    } catch (error) {
      console.log("Error creating overlay:", error);
    }
  }

  function regenerateSimplifiedContent() {
    const simplifiedContainer = document.getElementById('simplified-content');
    if (!simplifiedContainer) return;

    try {
      simplifiedContainer.innerHTML = '<div class="explain-loading">🔄 Simplifying content...</div>';

      setTimeout(() => {
        // Reset stats
        pageStats = { wordsSimplified: 0, jargonExplained: 0 };

        // Clone and simplify content
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = document.getElementById('original-content').innerHTML;
        simplifyText(tempDiv, currentLevel);

        simplifiedContainer.innerHTML = '';
        simplifiedContainer.appendChild(tempDiv);

        // Update stats
        const statsElement = document.querySelector('.explain-stats');
        if (statsElement) {
          statsElement.innerHTML = `
            <span>Words simplified: <strong>${pageStats.wordsSimplified}</strong></span>
            <span>Jargon explained: <strong>${pageStats.jargonExplained}</strong></span>
          `;
        }

        // Update header
        const header = document.querySelector('.explain-simplified-content h3');
        if (header) {
          header.textContent = `Simplified Content (${currentLevel.charAt(0).toUpperCase() + currentLevel.slice(1)} Level)`;
        }
      }, 800);
    } catch (error) {
      console.log("Error regenerating content:", error);
    }
  }

  // Enhanced banner injection
  function injectBanner() {
    if (document.getElementById('explain-page-banner')) return;

    try {
      const banner = document.createElement('div');
      banner.id = 'explain-page-banner';
      banner.innerHTML = `
        <div class="explain-banner-content">
          <div class="explain-banner-icon">📖</div>
          <div class="explain-banner-text">
            <strong>This page looks complex!</strong>
            <br>Click to simplify it for easier reading
          </div>
          <button class="explain-banner-btn">Explain This Page</button>
        </div>
      `;

      banner.onclick = () => {
        createOverlay(document.body.innerHTML);
        updateUsageStats();
      };

      document.body.appendChild(banner);

      // Auto-hide after 10 seconds
      setTimeout(() => {
        if (banner.parentNode) {
          banner.style.opacity = '0.7';
        }
      }, 10000);
    } catch (error) {
      console.log("Error injecting banner:", error);
    }
  }

  // Update usage statistics
  function updateUsageStats() {
    try {
      chrome.storage.sync.get(['pagesExplained', 'totalWordsSimplified'], (result) => {
        const pagesExplained = (result.pagesExplained || 0) + 1;
        const totalWordsSimplified = (result.totalWordsSimplified || 0) + pageStats.wordsSimplified;

        chrome.storage.sync.set({
          pagesExplained,
          totalWordsSimplified,
          lastUsed: Date.now()
        });
      });
    } catch (error) {
      console.log("Error updating stats:", error);
    }
  }

  // Listen for events from popup or background
  window.addEventListener('explain-page-request', () => {
    createOverlay(document.body.innerHTML);
    updateUsageStats();
  });

  // Listen for messages
  if (typeof chrome !== 'undefined' && chrome.runtime) {
    chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
      if (request.action === 'explainPage') {
        createOverlay(document.body.innerHTML);
        updateUsageStats();
        sendResponse({ success: true });
      }
    });
  }

  console.log('Explain This Page content script loaded successfully');
})();