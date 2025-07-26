// Popup script for "Explain This Page" extension

document.addEventListener('DOMContentLoaded', function() {
  // Get references to DOM elements
  const complexityLevel = document.getElementById('complexity-level');
  const explainCurrentPageBtn = document.getElementById('explain-current-page');
  const analyzeComplexityBtn = document.getElementById('analyze-complexity');
  const autoDetectCheckbox = document.getElementById('auto-detect');
  const showTooltipsCheckbox = document.getElementById('show-tooltips');
  const statusMessage = document.getElementById('status-message');
  const statsSection = document.getElementById('stats-section');
  const pagesExplainedSpan = document.getElementById('pages-explained');
  const termsSimplifiedSpan = document.getElementById('terms-simplified');
  const helpLink = document.getElementById('help-link');
  const feedbackLink = document.getElementById('feedback-link');

  // Storage keys
  const STORAGE_KEYS = {
    complexityLevel: 'explainPage_complexityLevel',
    autoDetect: 'explainPage_autoDetect',
    showTooltips: 'explainPage_showTooltips',
    pagesExplained: 'explainPage_pagesExplained',
    termsSimplified: 'explainPage_termsSimplified'
  };

  // Initialize popup
  function initializePopup() {
    loadSettings();
    loadStatistics();
    attachEventListeners();
    showStatusMessage('Ready to explain pages!', 'success');
  }

  // Load user settings from storage
  function loadSettings() {
    chrome.storage.sync.get(Object.values(STORAGE_KEYS), function(data) {
      // Set complexity level
      if (data[STORAGE_KEYS.complexityLevel]) {
        complexityLevel.value = data[STORAGE_KEYS.complexityLevel];
      }

      // Set auto-detect checkbox
      if (data[STORAGE_KEYS.autoDetect] !== undefined) {
        autoDetectCheckbox.checked = data[STORAGE_KEYS.autoDetect];
      }

      // Set show tooltips checkbox
      if (data[STORAGE_KEYS.showTooltips] !== undefined) {
        showTooltipsCheckbox.checked = data[STORAGE_KEYS.showTooltips];
      }
    });
  }

  // Load usage statistics
  function loadStatistics() {
    chrome.storage.local.get([STORAGE_KEYS.pagesExplained, STORAGE_KEYS.termsSimplified], function(data) {
      const pagesExplained = data[STORAGE_KEYS.pagesExplained] || 0;
      const termsSimplified = data[STORAGE_KEYS.termsSimplified] || 0;

      pagesExplainedSpan.textContent = pagesExplained;
      termsSimplifiedSpan.textContent = termsSimplified;

      // Show stats section if there are any statistics
      if (pagesExplained > 0 || termsSimplified > 0) {
        statsSection.style.display = 'flex';
      }
    });
  }

  // Save setting to storage
  function saveSetting(key, value) {
    chrome.storage.sync.set({ [key]: value }, function() {
      if (chrome.runtime.lastError) {
        console.error('Error saving setting:', chrome.runtime.lastError);
        showStatusMessage('Error saving settings', 'error');
      } else {
        showStatusMessage('Settings saved!', 'success');
      }
    });
  }

  // Update statistics
  function updateStatistics(pagesIncrement = 0, termsIncrement = 0) {
    chrome.storage.local.get([STORAGE_KEYS.pagesExplained, STORAGE_KEYS.termsSimplified], function(data) {
      const newPagesCount = (data[STORAGE_KEYS.pagesExplained] || 0) + pagesIncrement;
      const newTermsCount = (data[STORAGE_KEYS.termsSimplified] || 0) + termsIncrement;

      chrome.storage.local.set({
        [STORAGE_KEYS.pagesExplained]: newPagesCount,
        [STORAGE_KEYS.termsSimplified]: newTermsCount
      }, function() {
        pagesExplainedSpan.textContent = newPagesCount;
        termsSimplifiedSpan.textContent = newTermsCount;

        if (newPagesCount > 0 || newTermsCount > 0) {
          statsSection.style.display = 'flex';
        }
      });
    });
  }

  // Show status message to user
  function showStatusMessage(message, type = 'info') {
    statusMessage.textContent = message;
    statusMessage.className = `status-message ${type}`;

    // Clear message after 3 seconds
    setTimeout(() => {
      statusMessage.textContent = '';
      statusMessage.className = 'status-message';
    }, 3000);
  }

  // Set button loading state
  function setButtonLoading(button, isLoading) {
    if (isLoading) {
      button.classList.add('loading');
      button.disabled = true;
    } else {
      button.classList.remove('loading');
      button.disabled = false;
    }
  }

  // Get current active tab
  function getCurrentTab(callback) {
    chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
      if (tabs.length > 0) {
        callback(tabs[0]);
      } else {
        callback(null);
      }
    });
  }

  // Explain current page
  function explainCurrentPage() {
    setButtonLoading(explainCurrentPageBtn, true);
    showStatusMessage('Analyzing and explaining page...', 'info');

    getCurrentTab(function(tab) {
      if (!tab) {
        showStatusMessage('Could not access current tab', 'error');
        setButtonLoading(explainCurrentPageBtn, false);
        return;
      }

      // Skip certain URLs
      const skipUrls = ['chrome://', 'chrome-extension://', 'moz-extension://', 'about:', 'edge://'];
      if (skipUrls.some(url => tab.url.startsWith(url))) {
        showStatusMessage('Cannot explain this type of page', 'error');
        setButtonLoading(explainCurrentPageBtn, false);
        return;
      }

      // Inject script to trigger explanation
      chrome.scripting.executeScript({
        target: { tabId: tab.id },
        function: triggerPageExplanation
      }, function(results) {
        setButtonLoading(explainCurrentPageBtn, false);

        if (chrome.runtime.lastError) {
          console.error('Error injecting script:', chrome.runtime.lastError);
          showStatusMessage('Error explaining page', 'error');
        } else {
          showStatusMessage('Page explanation opened!', 'success');
          updateStatistics(1, 5); // Increment pages explained and estimate terms simplified

          // Close popup after successful explanation
          setTimeout(() => {
            window.close();
          }, 1000);
        }
      });
    });
  }

  // Function to inject for triggering explanation
  function triggerPageExplanation() {
    // Send custom event to content script
    window.dispatchEvent(new CustomEvent('explain-page-request'));
  }

  // Analyze page complexity
  function analyzePageComplexity() {
    setButtonLoading(analyzeComplexityBtn, true);
    showStatusMessage('Analyzing page complexity...', 'info');

    getCurrentTab(function(tab) {
      if (!tab) {
        showStatusMessage('Could not access current tab', 'error');
        setButtonLoading(analyzeComplexityBtn, false);
        return;
      }

      // Inject script to analyze complexity
      chrome.scripting.executeScript({
        target: { tabId: tab.id },
        function: analyzePageComplexityScript
      }, function(results) {
        setButtonLoading(analyzeComplexityBtn, false);

        if (chrome.runtime.lastError) {
          console.error('Error analyzing complexity:', chrome.runtime.lastError);
          showStatusMessage('Error analyzing page', 'error');
        } else if (results && results[0] && results[0].result) {
          const analysis = results[0].result;
          const complexityText = analysis.isComplex ? 'Complex' : 'Simple';
          showStatusMessage(`Page complexity: ${complexityText} (Score: ${analysis.score})`, 'info');
        }
      });
    });
  }

  // Function to inject for complexity analysis
  function analyzePageComplexityScript() {
    const bodyText = document.body.innerText || '';
    const words = bodyText.split(/\s+/).filter(word => word.length > 0);
    const longWords = words.filter(word => word.length > 12);
    const sentences = bodyText.split(/[.!?]+/).filter(s => s.trim().length > 0);
    const avgWordsPerSentence = sentences.length > 0 ? words.length / sentences.length : 0;

    // Simple complexity scoring
    const longWordScore = (longWords.length / words.length) * 100;
    const sentenceLengthScore = Math.min(avgWordsPerSentence * 2, 50);
    const totalScore = Math.round(longWordScore + sentenceLengthScore);

    return {
      isComplex: totalScore > 30,
      score: totalScore,
      totalWords: words.length,
      longWords: longWords.length,
      averageWordsPerSentence: Math.round(avgWordsPerSentence)
    };
  }

  // Attach event listeners
  function attachEventListeners() {
    // Complexity level change
    complexityLevel.addEventListener('change', function() {
      saveSetting(STORAGE_KEYS.complexityLevel, this.value);
    });

    // Auto-detect checkbox
    autoDetectCheckbox.addEventListener('change', function() {
      saveSetting(STORAGE_KEYS.autoDetect, this.checked);
    });

    // Show tooltips checkbox
    showTooltipsCheckbox.addEventListener('change', function() {
      saveSetting(STORAGE_KEYS.showTooltips, this.checked);
    });

    // Explain current page button
    explainCurrentPageBtn.addEventListener('click', explainCurrentPage);

    // Analyze complexity button
    analyzeComplexityBtn.addEventListener('click', analyzePageComplexity);

    // Help link
    helpLink.addEventListener('click', function(e) {
      e.preventDefault();
      showStatusMessage('Visit extension store page for help', 'info');
    });

    // Feedback link
    feedbackLink.addEventListener('click', function(e) {
      e.preventDefault();
      showStatusMessage('Thanks for your interest in feedback!', 'success');
    });

    // Keyboard shortcuts
    document.addEventListener('keydown', function(e) {
      if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
        explainCurrentPage();
      } else if (e.key === 'Escape') {
        window.close();
      }
    });
  }

  // Handle errors gracefully
  window.addEventListener('error', function(e) {
    console.error('Popup error:', e.error);
    showStatusMessage('An error occurred', 'error');
  });

  // Initialize when DOM is ready
  initializePopup();
});

// Handle extension icon click (alternative to popup)
if (typeof chrome !== 'undefined' && chrome.action) {
  chrome.action.onClicked.addListener(function(tab) {
    // This will be handled by background.js, but kept here for reference
    console.log('Extension icon clicked on tab:', tab.id);
  });
}
