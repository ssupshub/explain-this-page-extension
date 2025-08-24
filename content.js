/* Enhanced Content Script v3.0 - AI-Powered Page Explanation */
(function() {
  'use strict';

  // Prevent multiple injections
  if (window.__explainPageInjected_v3) return;
  window.__explainPageInjected_v3 = true;

  // Enhanced configuration
  const CONFIG = {
    version: '3.0.0',
    debug: false,
    animation: {
      duration: 300,
      easing: 'cubic-bezier(0.4, 0, 0.2, 1)'
    },
    complexity: {
      minTextLength: 300,
      longWordThreshold: 8,
      longWordRatio: 0.15,
      jargonThreshold: 3,
      longSentenceWords: 25,
      longSentenceRatio: 0.3
    }
  };

  // Comprehensive jargon dictionary
  const JARGON_DICTIONARY = {
    // Technology
    "API": "Application Programming Interface - a way for different software programs to communicate with each other",
    "JavaScript": "A programming language that makes web pages interactive and dynamic",
    "HTML": "HyperText Markup Language - the basic building blocks of web pages",
    "CSS": "Cascading Style Sheets - what makes web pages look beautiful and organized",
    "algorithm": "A set of step-by-step instructions to solve a problem or complete a task",
    "database": "An organized collection of information stored on a computer",
    "server": "A powerful computer that stores websites and delivers them to your device",
    "browser": "Software you use to view websites (like Chrome, Firefox, or Safari)",
    "debugging": "The process of finding and fixing problems in computer programs",
    "framework": "Pre-built tools that help developers create software faster",
    "encryption": "A security method that scrambles information to keep it private",
    "bandwidth": "The amount of data that can be sent over an internet connection",
    "cloud computing": "Using internet-based services instead of your own computer",
    "artificial intelligence": "Computer systems that can perform tasks requiring human-like thinking",
    "machine learning": "A type of AI where computers learn patterns from data",
    "blockchain": "A secure digital ledger that records transactions",
    
    // Science & Research
    "hypothesis": "An educated guess that can be tested through experiments",
    "methodology": "The systematic approach or method used to conduct research",
    "analysis": "The process of examining something carefully to understand it better",
    "synthesis": "Combining different ideas or elements to create something new",
    "correlation": "A relationship between two things that tend to occur together",
    "variable": "A factor that can change in an experiment or study",
    "peer review": "When experts check each other's work before it gets published",
    "empirical": "Based on observation and evidence rather than theory alone",
    "qualitative": "Research that focuses on qualities and characteristics rather than numbers",
    "quantitative": "Research that focuses on numbers and measurable data",
    
    // Business & Finance
    "stakeholder": "Anyone who has an interest in or is affected by a business or project",
    "sustainability": "The ability to continue operating without harming the environment or society",
    "revenue": "The total amount of money a business receives from sales",
    "expenditure": "Money spent or paid out by a person or organization",
    "optimization": "Making something work as effectively and efficiently as possible",
    "implementation": "The process of putting a plan or decision into action",
    "infrastructure": "The basic systems and structures needed for something to operate",
    "scalability": "The ability to grow or expand successfully",
    "ROI": "Return on Investment - how much profit you make compared to what you spent",
    "KPI": "Key Performance Indicator - important measurements of success",
    "B2B": "Business to Business - companies that sell to other companies",
    "B2C": "Business to Consumer - companies that sell directly to customers",
    
    // Medical & Health
    "diagnosis": "Identifying what illness or condition someone has",
    "prognosis": "A prediction of how a medical condition will develop",
    "chronic": "A long-term or recurring medical condition",
    "acute": "Sudden onset or short-term medical condition",
    "symptoms": "Physical or mental signs that indicate an illness or condition",
    "treatment": "Medical care given to help cure or manage an illness",
    "prevention": "Actions taken to stop something from happening",
    "immunity": "The body's ability to resist or fight off infections",
    "metabolism": "The process by which your body converts food into energy",
    "cardiovascular": "Related to the heart and blood vessels"
  };

  // Enhanced word simplifications
  const WORD_SIMPLIFICATIONS = {
    'utilize': 'use', 'demonstrate': 'show', 'implement': 'do', 'facilitate': 'help',
    'approximately': 'about', 'subsequently': 'then', 'consequently': 'so', 'furthermore': 'also',
    'however': 'but', 'therefore': 'so', 'nevertheless': 'but', 'predominantly': 'mostly',
    'substantial': 'large', 'commence': 'start', 'terminate': 'end', 'acquire': 'get',
    'sufficient': 'enough', 'eliminate': 'remove', 'construct': 'build', 'purchase': 'buy',
    'establish': 'set up', 'maintain': 'keep', 'indicate': 'show', 'require': 'need',
    'assist': 'help', 'provide': 'give', 'obtain': 'get', 'create': 'make', 'develop': 'make',
    'produce': 'make', 'generate': 'create', 'determine': 'decide', 'identify': 'find',
    'participate': 'join', 'communicate': 'talk', 'collaborate': 'work together',
    'accommodate': 'fit', 'anticipate': 'expect', 'comprehend': 'understand',
    'magnificent': 'amazing', 'tremendous': 'huge', 'exceptional': 'great',
    'extraordinary': 'amazing', 'phenomenal': 'remarkable', 'sophisticated': 'complex'
  };

  // Reading level configurations
  const READING_LEVELS = {
    elementary: { 
      maxSentenceWords: 10, 
      summarySentences: 2,
      maxParagraphs: 3,
      description: 'Very simple words and short sentences'
    },
    middle: { 
      maxSentenceWords: 15, 
      summarySentences: 3,
      maxParagraphs: 4,
      description: 'Moderate complexity with clear explanations'
    },
    high: { 
      maxSentenceWords: 22, 
      summarySentences: 4,
      maxParagraphs: 5,
      description: 'Standard complexity with detailed information'
    }
  };

  // Stop words for summarization
  const STOP_WORDS = new Set([
    'the', 'is', 'in', 'at', 'which', 'on', 'and', 'a', 'an', 'of', 'for', 'to', 
    'with', 'that', 'this', 'it', 'as', 'are', 'by', 'from', 'or', 'be', 'we', 
    'you', 'can', 'will', 'has', 'have', 'but', 'not', 'do', 'if', 'they', 'he', 
    'she', 'was', 'been', 'their', 'said', 'each', 'would', 'there', 'up', 'out', 
    'many', 'time', 'very', 'when', 'much', 'new', 'who', 'most'
  ]);

  let currentSettings = {
    readingLevel: 'middle',
    autoDetect: true
  };

  // Utility functions
  const utils = {
    escapeRegex(string) {
      return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    },

    debounce(func, wait) {
      let timeout;
      return function executedFunction(...args) {
        const later = () => {
          clearTimeout(timeout);
          func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
      };
    },

    log(message, data = null) {
      if (CONFIG.debug) {
        console.log(`[Explain This Page] ${message}`, data || '');
      }
    },

    animate(element, properties, duration = CONFIG.animation.duration) {
      return new Promise(resolve => {
        element.style.transition = `all ${duration}ms ${CONFIG.animation.easing}`;
        Object.assign(element.style, properties);
        setTimeout(resolve, duration);
      });
    }
  };

  // Enhanced text extraction
  function extractPageText() {
    utils.log('Extracting page text...');
    
    try {
      const excludeTags = new Set([
        'SCRIPT', 'STYLE', 'NOSCRIPT', 'TEXTAREA', 'INPUT', 'BUTTON', 
        'CODE', 'PRE', 'IFRAME', 'SVG', 'NAV', 'FOOTER', 'HEADER'
      ]);
      
      const textParts = [];
      const walker = document.createTreeWalker(
        document.body,
        NodeFilter.SHOW_ELEMENT,
        {
          acceptNode(node) {
            if (!node || !node.tagName) return NodeFilter.FILTER_REJECT;
            
            if (excludeTags.has(node.tagName)) return NodeFilter.FILTER_REJECT;
            
            const style = window.getComputedStyle(node);
            if (style.visibility === 'hidden' || 
                style.display === 'none' || 
                style.opacity === '0' ||
                style.position === 'fixed' ||
                node.offsetHeight === 0) {
              return NodeFilter.FILTER_REJECT;
            }
            
            return NodeFilter.FILTER_ACCEPT;
          }
        }
      );

      let currentNode;
      while ((currentNode = walker.nextNode())) {
        const text = currentNode.innerText || '';
        if (text && text.trim().length > 20) {
          textParts.push(text.trim());
        }
      }

      const fullText = textParts.join('\n\n');
      utils.log('Text extraction complete', `${fullText.length} characters`);
      
      return fullText || document.body.innerText || document.body.textContent || '';
    } catch (error) {
      utils.log('Error in text extraction', error);
      return document.body.innerText || document.body.textContent || '';
    }
  }

  // Advanced summarization algorithm
  function summarizeText(text, readingLevel = 'middle') {
    utils.log('Starting text summarization', `Level: ${readingLevel}`);
    
    const config = READING_LEVELS[readingLevel] || READING_LEVELS.middle;
    
    // Split into sentences
    const sentences = text
      .match(/[^\.!?]+[\.!?]+/g)
      ?.map(s => s.trim())
      .filter(s => s.length > 10) || [];
    
    if (sentences.length === 0) return [];

    // Calculate word frequencies (excluding stop words)
    const wordFreq = {};
    sentences.forEach(sentence => {
      const words = sentence.toLowerCase()
        .replace(/[^\w\s]/g, ' ')
        .split(/\s+/)
        .filter(w => w.length > 2 && !STOP_WORDS.has(w));
      
      words.forEach(word => {
        wordFreq[word] = (wordFreq[word] || 0) + 1;
      });
    });

    // Score sentences based on word frequency and position
    const sentenceScores = sentences.map((sentence, index) => {
      const words = sentence.toLowerCase()
        .replace(/[^\w\s]/g, ' ')
        .split(/\s+/)
        .filter(w => w.length > 2 && !STOP_WORDS.has(w));
      
      let score = 0;
      words.forEach(word => {
        score += wordFreq[word] || 0;
      });
      
      // Normalize by sentence length and add position bonus
      score = words.length > 0 ? score / Math.sqrt(words.length) : 0;
      
      // Give higher weight to sentences at beginning and end
      const positionBonus = index < sentences.length * 0.3 ? 1.5 : 
                           index > sentences.length * 0.7 ? 1.2 : 1.0;
      
      return {
        index,
        sentence,
        score: score * positionBonus
      };
    });

    // Select top sentences
    const topSentences = sentenceScores
      .sort((a, b) => b.score - a.score)
      .slice(0, config.summarySentences)
      .sort((a, b) => a.index - b.index);

    utils.log('Summarization complete', `${topSentences.length} sentences selected`);
    
    return topSentences.map(item => item.sentence);
  }

  // Enhanced sentence breaking
  function breakIntoShorterSentences(sentence, maxWords) {
    const words = sentence.split(/\s+/);
    if (words.length <= maxWords) return [sentence];

    const chunks = [];
    
    // Try to break at natural points (commas, semicolons, conjunctions)
    const naturalBreaks = sentence.split(/[,;]|(?:\s+(?:and|but|or|so|yet|because|since|although|while|if|when|where|after|before)\s+)/i);
    
    if (naturalBreaks.length > 1) {
      naturalBreaks.forEach(chunk => {
        const trimmed = chunk.trim();
        if (trimmed) {
          const chunkWords = trimmed.split(/\s+/);
          if (chunkWords.length <= maxWords) {
            chunks.push(trimmed);
          } else {
            // Further break large chunks
            for (let i = 0; i < chunkWords.length; i += maxWords) {
              chunks.push(chunkWords.slice(i, i + maxWords).join(' '));
            }
          }
        }
      });
      return chunks;
    }

    // Fallback: break by word count
    for (let i = 0; i < words.length; i += maxWords) {
      chunks.push(words.slice(i, i + maxWords).join(' '));
    }

    return chunks;
  }

  // Enhanced text simplification
  function simplifyText(text, stats) {
    let simplified = text;
    
    try {
      // Replace complex words with simpler alternatives
      Object.entries(WORD_SIMPLIFICATIONS).forEach(([complex, simple]) => {
        const regex = new RegExp(`\\b${utils.escapeRegex(complex)}\\b`, 'gi');
        const matches = simplified.match(regex);
        if (matches) {
          stats.wordsSimplified += matches.length;
          simplified = simplified.replace(regex, simple);
        }
      });

      // Additional simplifications for specific phrases
      const phraseReplacements = {
        'in order to': 'to',
        'for the purpose of': 'to',
        'with regard to': 'about',
        'in relation to': 'about',
        'as a result of': 'because of',
        'due to the fact that': 'because',
        'it is important to note that': 'note that',
        'please be advised that': 'please know that'
      };

      Object.entries(phraseReplacements).forEach(([complex, simple]) => {
        const regex = new RegExp(utils.escapeRegex(complex), 'gi');
        simplified = simplified.replace(regex, simple);
      });

    } catch (error) {
      utils.log('Error in text simplification', error);
    }

    return simplified;
  }

  // Create enhanced content with jargon tooltips
  function createSimplifiedContent(sentences, readingLevel, stats) {
    const fragment = document.createDocumentFragment();
    const config = READING_LEVELS[readingLevel] || READING_LEVELS.middle;
    
    // Create regex for jargon detection
    const jargonTerms = Object.keys(JARGON_DICTIONARY)
      .map(utils.escapeRegex)
      .sort((a, b) => b.length - a.length); // Sort by length to match longer terms first
    
    const jargonRegex = jargonTerms.length > 0 ? 
      new RegExp(`\\b(${jargonTerms.join('|')})\\b`, 'gi') : null;

    sentences.forEach((sentence, index) => {
      // Simplify the sentence
      let processed = simplifyText(sentence, stats);
      
      // Break into shorter chunks if needed
      const chunks = breakIntoShorterSentences(processed, config.maxSentenceWords);
      
      chunks.forEach(chunk => {
        const paragraph = document.createElement('p');
        paragraph.className = 'explain-simplified-paragraph';
        
        if (!jargonRegex) {
          paragraph.textContent = chunk;
        } else {
          // Process jargon terms
          let lastIndex = 0;
          let match;
          jargonRegex.lastIndex = 0;
          
          while ((match = jargonRegex.exec(chunk)) !== null) {
            const matchIndex = match.index;
            const matchedTerm = match[0];
            
            // Add text before the jargon term
            if (matchIndex > lastIndex) {
              paragraph.appendChild(
                document.createTextNode(chunk.slice(lastIndex, matchIndex))
              );
            }
            
            // Create jargon tooltip
            const jargonSpan = document.createElement('span');
            jargonSpan.textContent = matchedTerm;
            jargonSpan.className = 'explain-jargon-term';
            
            const definition = JARGON_DICTIONARY[matchedTerm] || 
                            JARGON_DICTIONARY[matchedTerm.toLowerCase()] || 
                            'Technical term';
            
            jargonSpan.setAttribute('data-definition', definition);
            jargonSpan.title = definition; // Accessibility fallback
            
            paragraph.appendChild(jargonSpan);
            stats.jargonExplained++;
            
            lastIndex = matchIndex + matchedTerm.length;
          }
          
          // Add remaining text
          if (lastIndex < chunk.length) {
            paragraph.appendChild(
              document.createTextNode(chunk.slice(lastIndex))
            );
          }
        }
        
        fragment.appendChild(paragraph);
      });
    });

    return fragment;
  }

  // Complexity analysis
  function analyzeComplexity(text) {
    if (!text || text.length < CONFIG.complexity.minTextLength) {
      return { isComplex: false, score: 0, reasons: [] };
    }

    const words = text.split(/\s+/).filter(Boolean);
    const sentences = text.split(/[.!?]+/).filter(Boolean);
    const reasons = [];
    let complexityScore = 0;

    // Check long words
    const longWords = words.filter(word => word.length > CONFIG.complexity.longWordThreshold);
    const longWordRatio = words.length > 0 ? longWords.length / words.length : 0;
    
    if (longWordRatio > CONFIG.complexity.longWordRatio) {
      complexityScore += 2;
      reasons.push(`${Math.round(longWordRatio * 100)}% long words`);
    }

    // Check jargon density
    const jargonCount = Object.keys(JARGON_DICTIONARY)
      .filter(term => text.toLowerCase().includes(term.toLowerCase())).length;
    
    if (jargonCount >= CONFIG.complexity.jargonThreshold) {
      complexityScore += 3;
      reasons.push(`${jargonCount} technical terms found`);
    }

    // Check sentence complexity
    const longSentences = sentences.filter(sentence => 
      sentence.split(/\s+/).length > CONFIG.complexity.longSentenceWords
    );
    const longSentenceRatio = sentences.length > 0 ? 
      longSentences.length / sentences.length : 0;
    
    if (longSentenceRatio > CONFIG.complexity.longSentenceRatio) {
      complexityScore += 2;
      reasons.push(`${Math.round(longSentenceRatio * 100)}% long sentences`);
    }

    // Check reading level indicators
    const advancedWords = words.filter(word => 
      Object.keys(WORD_SIMPLIFICATIONS).includes(word.toLowerCase())
    );
    
    if (advancedWords.length > 5) {
      complexityScore += 1;
      reasons.push(`${advancedWords.length} complex words detected`);
    }

    const isComplex = complexityScore >= 3;
    
    utils.log('Complexity analysis', {
      score: complexityScore,
      isComplex,
      reasons,
      textLength: text.length,
      wordCount: words.length
    });

    return { isComplex, score: complexityScore, reasons };
  }

  // Create modern banner
  function createComplexityBanner() {
    if (document.getElementById('explain-page-banner')) return;

    utils.log('Creating complexity banner');

    const banner = document.createElement('div');
    banner.id = 'explain-page-banner';
    banner.className = 'explain-banner';
    
    banner.innerHTML = `
      <div class="explain-banner-content">
        <div class="explain-banner-icon">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
          </svg>
        </div>
        <div class="explain-banner-text">
          <div class="explain-banner-title">Complex content detected!</div>
          <div class="explain-banner-subtitle">Click to simplify and understand better</div>
        </div>
        <button class="explain-banner-btn" aria-label="Explain this page">
          <span>Explain</span>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <path d="M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6 1.41-1.41z"/>
          </svg>
        </button>
        <button class="explain-banner-close" aria-label="Close banner">×</button>
      </div>
    `;

    // Add event listeners
    const explainBtn = banner.querySelector('.explain-banner-btn');
    const closeBtn = banner.querySelector('.explain-banner-close');

    explainBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      hideBanner(banner);
      setTimeout(() => showExplanationOverlay(), 300);
    });

    closeBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      hideBanner(banner);
    });

    document.body.appendChild(banner);

    // Animate in
    requestAnimationFrame(() => {
      banner.style.transform = 'translateY(0)';
      banner.style.opacity = '1';
    });

    // Auto-hide after 10 seconds
    setTimeout(() => {
      if (banner.parentNode) {
        hideBanner(banner);
      }
    }, 10000);
  }

  // Hide banner with animation
  function hideBanner(banner) {
    if (!banner || !banner.parentNode) return;
    
    utils.animate(banner, {
      transform: 'translateY(100%)',
      opacity: '0'
    }).then(() => {
      if (banner.parentNode) {
        banner.parentNode.removeChild(banner);
      }
    });
  }

  // Show explanation overlay
  function showExplanationOverlay(forcedLevel = null) {
    if (document.getElementById('explain-page-overlay')) return;

    utils.log('Creating explanation overlay');

    const pageText = extractPageText();
    if (!pageText || pageText.trim().length < 50) {
      showNotification('No content found to explain on this page.', 'warning');
      return;
    }

    createOverlay(pageText, forcedLevel || currentSettings.readingLevel);
  }

  // Create main overlay interface
  function createOverlay(pageText, readingLevel) {
    const overlay = document.createElement('div');
    overlay.id = 'explain-page-overlay';
    overlay.className = 'explain-overlay';

    overlay.innerHTML = `
      <div class="explain-overlay-backdrop"></div>
      <div class="explain-overlay-content">
        <div class="explain-header">
          <div class="explain-header-left">
            <h2 class="explain-title">
              <span class="explain-title-icon">🧠</span>
              Page Explanation
            </h2>
            <p class="explain-subtitle">AI-simplified content for better understanding</p>
          </div>
          <div class="explain-header-right">
            <select id="reading-level-selector" class="explain-level-select">
              <option value="elementary">🌟 Elementary</option>
              <option value="middle" selected>📚 Middle School</option>
              <option value="high">🎓 High School</option>
            </select>
            <button id="close-overlay" class="explain-close-btn" aria-label="Close explanation">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
              </svg>
            </button>
          </div>
        </div>
        
        <div class="explain-content">
          <div class="explain-content-section">
            <h3 class="explain-section-title">Original Content</h3>
            <div class="explain-original-content" id="original-content">
              <div class="explain-loading">
                <div class="loading-spinner"></div>
                <span>Analyzing content...</span>
              </div>
            </div>
          </div>
          
          <div class="explain-content-section">
            <h3 class="explain-section-title" id="simplified-title">Simplified Content</h3>
            <div class="explain-simplified-content" id="simplified-content">
              <div class="explain-loading">
                <div class="loading-spinner"></div>
                <span>Creating simplified version...</span>
              </div>
            </div>
          </div>
        </div>
        
        <div class="explain-footer">
          <div class="explain-stats">
            <div class="stat-item">
              <span class="stat-icon">📝</span>
              <span class="stat-label">Words Simplified:</span>
              <span class="stat-value" id="words-simplified">0</span>
            </div>
            <div class="stat-item">
              <span class="stat-icon">💡</span>
              <span class="stat-label">Terms Explained:</span>
              <span class="stat-value" id="terms-explained">0</span>
            </div>
          </div>
          <div class="explain-actions">
            <button class="explain-btn-secondary" id="refresh-explanation">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.65 6.35C16.2 4.9 14.21 4 12 4c-4.42 0-7.99 3.58-7.99 8s3.57 8 7.99 8c3.73 0 6.84-2.55 7.73-6h-2.08c-.82 2.33-3.04 4-5.65 4-3.31 0-6-2.69-6-6s2.69-6 6-6c1.66 0 3.14.69 4.22 1.78L13 11h7V4l-2.35 2.35z"/>
              </svg>
              Refresh
            </button>
          </div>
        </div>
      </div>
    `;

    document.body.appendChild(overlay);

    // Setup event listeners
    setupOverlayEvents(overlay, pageText);

    // Set initial reading level
    const levelSelector = overlay.querySelector('#reading-level-selector');
    if (levelSelector) {
      levelSelector.value = readingLevel;
    }

    // Process content
    processOriginalContent(pageText);
    processSimplifiedContent(pageText, readingLevel);

    // Animate in
    requestAnimationFrame(() => {
      overlay.classList.add('explain-overlay-visible');
    });
  }

  // Setup overlay event listeners
  function setupOverlayEvents(overlay, pageText) {
    const closeBtn = overlay.querySelector('#close-overlay');
    const backdrop = overlay.querySelector('.explain-overlay-backdrop');
    const levelSelector = overlay.querySelector('#reading-level-selector');
    const refreshBtn = overlay.querySelector('#refresh-explanation');

    // Close overlay
    const closeOverlay = () => {
      overlay.classList.remove('explain-overlay-visible');
      setTimeout(() => {
        if (overlay.parentNode) {
          overlay.parentNode.removeChild(overlay);
        }
      }, 300);
    };

    closeBtn?.addEventListener('click', closeOverlay);
    backdrop?.addEventListener('click', closeOverlay);

    // Reading level change
    levelSelector?.addEventListener('change', (e) => {
      currentSettings.readingLevel = e.target.value;
      processSimplifiedContent(pageText, e.target.value);
      saveSettings();
    });

    // Refresh explanation
    refreshBtn?.addEventListener('click', () => {
      const newPageText = extractPageText();
      processOriginalContent(newPageText);
      processSimplifiedContent(newPageText, currentSettings.readingLevel);
    });

    // Keyboard shortcuts
    document.addEventListener('keydown', function handleKeydown(e) {
      if (e.key === 'Escape') {
        closeOverlay();
        document.removeEventListener('keydown', handleKeydown);
      }
    });
  }

  // Process and display original content
  function processOriginalContent(text) {
    const container = document.getElementById('original-content');
    if (!container) return;

    container.innerHTML = '';
    
    // Split into paragraphs
    const paragraphs = text.split(/\n\s*\n/).filter(p => p.trim().length > 20);
    
    paragraphs.slice(0, 5).forEach(paragraph => {
      const p = document.createElement('p');
      p.className = 'explain-original-paragraph';
      p.textContent = paragraph.trim();
      container.appendChild(p);
    });

    if (paragraphs.length > 5) {
      const moreInfo = document.createElement('div');
      moreInfo.className = 'explain-more-info';
      moreInfo.textContent = `... and ${paragraphs.length - 5} more paragraphs`;
      container.appendChild(moreInfo);
    }
  }

  // Process and display simplified content
  function processSimplifiedContent(text, readingLevel) {
    const container = document.getElementById('simplified-content');
    const titleElement = document.getElementById('simplified-title');
    const wordsCount = document.getElementById('words-simplified');
    const termsCount = document.getElementById('terms-explained');

    if (!container) return;

    // Show loading
    container.innerHTML = `
      <div class="explain-loading">
        <div class="loading-spinner"></div>
        <span>Processing content...</span>
      </div>
    `;

    // Update title
    const levelConfig = READING_LEVELS[readingLevel];
    if (titleElement) {
      titleElement.textContent = `Simplified Content (${readingLevel.charAt(0).toUpperCase() + readingLevel.slice(1)} Level)`;
    }

    // Process content asynchronously
    setTimeout(() => {
      try {
        const stats = { wordsSimplified: 0, jargonExplained: 0 };
        
        // Summarize and simplify
        const sentences = summarizeText(text, readingLevel);
        const finalSentences = sentences.length > 0 ? sentences : 
          text.split(/\n+/).filter(s => s.trim().length > 20).slice(0, levelConfig.summarySentences);

        // Create simplified content
        const simplifiedFragment = createSimplifiedContent(finalSentences, readingLevel, stats);
        
        container.innerHTML = '';
        container.appendChild(simplifiedFragment);

        // Update stats
        if (wordsCount) wordsCount.textContent = stats.wordsSimplified;
        if (termsCount) termsCount.textContent = stats.jargonExplained;

        // Update storage stats
        updateUsageStats(1, stats.wordsSimplified);

      } catch (error) {
        utils.log('Error processing simplified content', error);
        container.innerHTML = `
          <div class="explain-error">
            <span>Error processing content. Please try again.</span>
          </div>
        `;
      }
    }, 800);
  }

  // Show notification
  function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `explain-notification explain-notification-${type}`;
    notification.innerHTML = `
      <div class="explain-notification-content">
        <span class="explain-notification-icon">
          ${type === 'success' ? '✅' : type === 'warning' ? '⚠️' : type === 'error' ? '❌' : 'ℹ️'}
        </span>
        <span class="explain-notification-message">${message}</span>
      </div>
    `;

    document.body.appendChild(notification);

    // Animate in
    requestAnimationFrame(() => {
      notification.style.transform = 'translateX(0)';
      notification.style.opacity = '1';
    });

    // Auto-remove
    setTimeout(() => {
      notification.style.transform = 'translateX(100%)';
      notification.style.opacity = '0';
      setTimeout(() => {
        if (notification.parentNode) {
          notification.parentNode.removeChild(notification);
        }
      }, 300);
    }, 3000);
  }

  // Update usage statistics
  function updateUsageStats(pages = 0, words = 0) {
    try {
      if (typeof chrome !== 'undefined' && chrome.storage) {
        chrome.storage.sync.get(['pagesExplained', 'totalWordsSimplified'], (result) => {
          const newStats = {
            pagesExplained: (result.pagesExplained || 0) + pages,
            totalWordsSimplified: (result.totalWordsSimplified || 0) + words,
            lastUsed: Date.now()
          };
          chrome.storage.sync.set(newStats);
        });
      }
    } catch (error) {
      utils.log('Error updating usage stats', error);
    }
  }

  // Load settings from storage
  function loadSettings() {
    try {
      if (typeof chrome !== 'undefined' && chrome.storage) {
        chrome.storage.sync.get(['explainPageLevel', 'autoDetect'], (result) => {
          if (result.explainPageLevel) {
            currentSettings.readingLevel = result.explainPageLevel;
          }
          if (result.autoDetect !== undefined) {
            currentSettings.autoDetect = result.autoDetect;
          }
          
          utils.log('Settings loaded', currentSettings);
          
          // Check for complexity after settings are loaded
          if (currentSettings.autoDetect) {
            setTimeout(checkPageComplexity, 1000);
          }
        });
      } else {
        // Fallback for environments without Chrome storage
        setTimeout(checkPageComplexity, 1000);
      }
    } catch (error) {
      utils.log('Error loading settings', error);
      setTimeout(checkPageComplexity, 1000);
    }
  }

  // Save settings to storage
  function saveSettings() {
    try {
      if (typeof chrome !== 'undefined' && chrome.storage) {
        chrome.storage.sync.set(currentSettings);
      }
    } catch (error) {
      utils.log('Error saving settings', error);
    }
  }

  // Check page complexity and show banner if needed
  function checkPageComplexity() {
    if (!currentSettings.autoDetect) return;

    const pageText = extractPageText();
    const complexity = analyzeComplexity(pageText);

    utils.log('Page complexity check', complexity);

    if (complexity.isComplex) {
      setTimeout(createComplexityBanner, 500);
    }
  }

  // Event listeners
  window.addEventListener('explain-page-request', () => {
    utils.log('Manual explanation requested');
    showExplanationOverlay();
  });

  window.addEventListener('explain-page-level-changed', (event) => {
    if (event.detail) {
      currentSettings.readingLevel = event.detail;
      utils.log('Reading level changed', event.detail);
      
      // If overlay is open, refresh it
      const overlay = document.getElementById('explain-page-overlay');
      if (overlay) {
        const levelSelector = overlay.querySelector('#reading-level-selector');
        if (levelSelector) {
          levelSelector.value = event.detail;
          const pageText = extractPageText();
          processSimplifiedContent(pageText, event.detail);
        }
      }
    }
  });

  // Message listener for popup communication
  if (typeof chrome !== 'undefined' && chrome.runtime) {
    chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
      if (request.action === 'explainPage') {
        showExplanationOverlay();
        sendResponse({ success: true });
      }
      return true;
    });
  }

  // Initialize
  utils.log('Content script initialized', CONFIG.version);
  loadSettings();

})();