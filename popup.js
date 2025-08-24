// Enhanced Popup JavaScript v3.0
class ExplainPagePopup {
  constructor() {
    this.elements = {};
    this.settings = {
      readingLevel: 'middle',
      autoDetect: true
    };
    this.init();
  }

  init() {
    this.getElements();
    this.loadSettings();
    this.bindEvents();
    this.updateStats();
    this.startStatsUpdater();
  }

  getElements() {
    this.elements = {
      explainBtn: document.getElementById('explain-btn'),
      statusMessage: document.getElementById('status'),
      autoDetect: document.getElementById('auto-detect'),
      pagesCount: document.getElementById('pages-count'),
      wordsCount: document.getElementById('words-count'),
      lastUsed: document.getElementById('last-used'),
      readingLevels: document.querySelectorAll('input[name="reading-level"]')
    };
  }

  loadSettings() {
    if (typeof chrome === 'undefined' || !chrome.storage) return;
    
    chrome.storage.sync.get([
      'explainPageLevel', 
      'autoDetect', 
      'pagesExplained', 
      'totalWordsSimplified', 
      'lastUsed'
    ], (result) => {
      if (chrome.runtime.lastError) {
        console.error('Error loading settings:', chrome.runtime.lastError);
        return;
      }

      // Set reading level
      if (result.explainPageLevel) {
        this.settings.readingLevel = result.explainPageLevel;
        const levelInput = document.getElementById(`level-${result.explainPageLevel}`);
        if (levelInput) levelInput.checked = true;
      }

      // Set auto-detect
      if (result.autoDetect !== undefined) {
        this.settings.autoDetect = result.autoDetect;
        if (this.elements.autoDetect) {
          this.elements.autoDetect.checked = result.autoDetect;
        }
      }

      // Update stats
      this.updateStatsDisplay(result);
    });
  }

  saveSettings() {
    if (typeof chrome === 'undefined' || !chrome.storage) return;

    const settings = {
      explainPageLevel: this.settings.readingLevel,
      autoDetect: this.settings.autoDetect
    };

    chrome.storage.sync.set(settings, () => {
      if (chrome.runtime.lastError) {
        this.showStatus('Error saving settings', 'error');
      } else {
        this.showStatus('Settings saved!', 'success', 1000);
      }
    });
  }

  bindEvents() {
    // Explain button
    if (this.elements.explainBtn) {
      this.elements.explainBtn.addEventListener('click', () => {
        this.explainCurrentPage();
      });
    }

    // Reading level changes
    this.elements.readingLevels.forEach(input => {
      input.addEventListener('change', (e) => {
        if (e.target.checked) {
          this.settings.readingLevel = e.target.value;
          this.saveSettings();
          this.notifyLevelChange(e.target.value);
        }
      });
    });

    // Auto-detect toggle
    if (this.elements.autoDetect) {
      this.elements.autoDetect.addEventListener('change', (e) => {
        this.settings.autoDetect = e.target.checked;
        this.saveSettings();
      });
    }

    // Keyboard shortcuts
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && e.target === this.elements.explainBtn) {
        this.explainCurrentPage();
      }
    });
  }

  async explainCurrentPage() {
    if (!this.elements.explainBtn) return;

    this.setButtonLoading(true);
    this.showStatus('Analyzing current page...', 'info', 0);

    try {
      const tabs = await this.getCurrentTab();
      if (!tabs || !tabs.length) {
        throw new Error('No active tab found');
      }

      const tab = tabs[0];
      
      // Check if it's a restricted page
      if (this.isRestrictedPage(tab.url)) {
        throw new Error('Cannot explain internal browser pages');
      }

      // Execute the explanation script
      await chrome.scripting.executeScript({
        target: { tabId: tab.id },
        func: () => {
          window.dispatchEvent(new CustomEvent('explain-page-request'));
          return true;
        }
      });

      this.showStatus('Page explanation opened!', 'success', 1500);
      
      // Close popup after successful execution
      setTimeout(() => {
        try {
          window.close();
        } catch(e) {
          console.log('Could not close popup window');
        }
      }, 500);

    } catch (error) {
      console.error('Error explaining page:', error);
      this.showStatus(error.message || 'Error explaining page', 'error', 3000);
    } finally {
      this.setButtonLoading(false);
    }
  }

  getCurrentTab() {
    return new Promise((resolve) => {
      chrome.tabs.query({ active: true, currentWindow: true }, resolve);
    });
  }

  isRestrictedPage(url) {
    if (!url) return true;
    const restrictedProtocols = ['chrome://', 'chrome-extension://', 'edge://', 'moz-extension://'];
    return restrictedProtocols.some(protocol => url.startsWith(protocol));
  }

  notifyLevelChange(newLevel) {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (!tabs || !tabs.length) return;
      
      const tab = tabs[0];
      if (!tab.id || this.isRestrictedPage(tab.url)) return;

      chrome.scripting.executeScript({
        target: { tabId: tab.id },
        func: (level) => {
          window.dispatchEvent(new CustomEvent('explain-page-level-changed', { 
            detail: level 
          }));
          return true;
        },
        args: [newLevel]
      }).catch(err => {
        console.warn('Could not notify level change:', err);
      });
    });
  }

  setButtonLoading(isLoading) {
    if (!this.elements.explainBtn) return;
    
    if (isLoading) {
      this.elements.explainBtn.classList.add('loading');
      this.elements.explainBtn.disabled = true;
    } else {
      this.elements.explainBtn.classList.remove('loading');
      this.elements.explainBtn.disabled = false;
    }
  }

  showStatus(message, type = 'info', duration = 2000) {
    if (!this.elements.statusMessage) return;
    
    this.elements.statusMessage.textContent = message;
    this.elements.statusMessage.className = `status-message ${type}`;
    
    if (duration > 0) {
      setTimeout(() => {
        if (this.elements.statusMessage) {
          this.elements.statusMessage.textContent = '';
          this.elements.statusMessage.className = 'status-message';
        }
      }, duration);
    }
  }

  updateStats() {
    if (typeof chrome === 'undefined' || !chrome.storage) return;

    chrome.storage.sync.get([
      'pagesExplained', 
      'totalWordsSimplified', 
      'lastUsed'
    ], (result) => {
      this.updateStatsDisplay(result);
    });
  }

  updateStatsDisplay(data) {
    if (this.elements.pagesCount && data.pagesExplained !== undefined) {
      this.animateNumber(this.elements.pagesCount, data.pagesExplained);
    }
    
    if (this.elements.wordsCount && data.totalWordsSimplified !== undefined) {
      this.animateNumber(this.elements.wordsCount, data.totalWordsSimplified);
    }
    
    if (this.elements.lastUsed && data.lastUsed) {
      const date = new Date(data.lastUsed);
      this.elements.lastUsed.textContent = `Last used: ${date.toLocaleDateString()}`;
    }
  }

  animateNumber(element, targetNumber) {
    const currentNumber = parseInt(element.textContent) || 0;
    if (currentNumber === targetNumber) return;

    const increment = targetNumber > currentNumber ? 1 : -1;
    const duration = Math.min(Math.abs(targetNumber - currentNumber) * 50, 1000);
    const steps = Math.min(Math.abs(targetNumber - currentNumber), 20);
    const stepDuration = duration / steps;

    let current = currentNumber;
    const timer = setInterval(() => {
      current += increment * Math.ceil(Math.abs(targetNumber - current) / steps);
      element.textContent = Math.min(Math.max(current, 0), targetNumber);
      
      if (current === targetNumber) {
        clearInterval(timer);
        element.textContent = targetNumber;
      }
    }, stepDuration);
  }

  startStatsUpdater() {
    // Update stats every 3 seconds
    setInterval(() => {
      this.updateStats();
    }, 3000);
  }
}

// Initialize popup when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  new ExplainPagePopup();
});

// Handle popup visibility
document.addEventListener('visibilitychange', () => {
  if (!document.hidden) {
    // Refresh stats when popup becomes visible
    setTimeout(() => {
      const popup = window.explainPagePopup;
      if (popup) popup.updateStats();
    }, 100);
  }
});