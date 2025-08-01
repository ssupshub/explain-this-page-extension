// Popup script for Explain This Page extension v2.0

const levelSelect = document.getElementById('level-select');
const autoDetectCheckbox = document.getElementById('auto-detect');
const explainBtn = document.getElementById('explain-btn');
const statusDiv = document.getElementById('status');
const pagesCount = document.getElementById('pages-count');
const wordsCount = document.getElementById('words-count');
const lastUsedDiv = document.getElementById('last-used');

// Show status message with styling
function showStatus(message, type = 'info', duration = 3000) {
  statusDiv.textContent = message;
  statusDiv.className = `status-message ${type}`;

  if (duration > 0) {
    setTimeout(() => {
      statusDiv.textContent = '';
      statusDiv.className = 'status-message';
    }, duration);
  }
}

// Format date for last used display
function formatLastUsed(timestamp) {
  if (!timestamp) return '';

  const date = new Date(timestamp);
  const now = new Date();
  const diffTime = Math.abs(now - date);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays === 1) {
    return 'Last used: Yesterday';
  } else if (diffDays < 7) {
    return `Last used: ${diffDays} days ago`;
  } else {
    return `Last used: ${date.toLocaleDateString()}`;
  }
}

// Load saved settings and statistics
function loadSettings() {
  try {
    chrome.storage.sync.get([
      'explainPageLevel', 
      'autoDetect', 
      'pagesExplained', 
      'totalWordsSimplified',
      'lastUsed'
    ], (result) => {
      // Load reading level
      if (result.explainPageLevel) {
        levelSelect.value = result.explainPageLevel;
      }

      // Load auto-detect setting
      if (result.autoDetect !== undefined) {
        autoDetectCheckbox.checked = result.autoDetect;
      }

      // Load statistics
      pagesCount.textContent = result.pagesExplained || 0;
      wordsCount.textContent = result.totalWordsSimplified || 0;

      // Show last used
      if (result.lastUsed) {
        lastUsedDiv.textContent = formatLastUsed(result.lastUsed);
      }
    });
  } catch (error) {
    console.error('Error loading settings:', error);
    showStatus('Error loading settings', 'error');
  }
}

// Save settings to storage
function saveSettings() {
  try {
    const settings = {
      explainPageLevel: levelSelect.value,
      autoDetect: autoDetectCheckbox.checked
    };

    chrome.storage.sync.set(settings, () => {
      if (chrome.runtime.lastError) {
        showStatus('Error saving settings', 'error');
        console.error('Storage error:', chrome.runtime.lastError);
      } else {
        showStatus('✅ Settings saved!', 'success', 2000);
      }
    });
  } catch (error) {
    console.error('Error saving settings:', error);
    showStatus('Error saving settings', 'error');
  }
}

// Add loading state to button
function setButtonLoading(loading) {
  if (loading) {
    explainBtn.classList.add('loading');
    explainBtn.innerHTML = '<span class="btn-icon">🔄</span>Explaining...';
  } else {
    explainBtn.classList.remove('loading');
    explainBtn.innerHTML = '<span class="btn-icon">🔍</span>Explain Current Page';
  }
}

// Trigger page explanation
function explainCurrentPage() {
  setButtonLoading(true);
  showStatus('🔄 Analyzing page...', 'info', 0);

  chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
    if (!tabs.length || !tabs[0]?.id) {
      setButtonLoading(false);
      showStatus('❌ No active tab found', 'error');
      return;
    }

    const tab = tabs[0];

    // Check if we can access this tab
    if (tab.url.startsWith('chrome://') || tab.url.startsWith('chrome-extension://') || tab.url.startsWith('edge://')) {
      setButtonLoading(false);
      showStatus('❌ Cannot explain browser pages', 'error');
      return;
    }

    try {
      // Send message to content script to trigger explanation
      chrome.scripting.executeScript({
        target: {tabId: tab.id},
        function: () => {
          // Trigger the explanation overlay
          window.dispatchEvent(new CustomEvent('explain-page-request'));
          return true;
        }
      }).then((results) => {
        setButtonLoading(false);
        if (results && results[0]?.result) {
          showStatus('✅ Page explanation opened!', 'success');
          // Close popup after successful explanation
          setTimeout(() => window.close(), 1000);
        } else {
          showStatus('⚠️ Page explained (if complex)', 'info');
          setTimeout(() => window.close(), 1500);
        }
      }).catch(error => {
        setButtonLoading(false);
        console.error('Error triggering explanation:', error);

        if (error.message.includes('Cannot access')) {
          showStatus('❌ Cannot access this page', 'error');
        } else {
          showStatus('❌ Error explaining page', 'error');
        }
      });
    } catch (error) {
      setButtonLoading(false);
      console.error('Error in explainCurrentPage:', error);
      showStatus('❌ Unexpected error', 'error');
    }
  });
}

// Event listeners
levelSelect.addEventListener('change', () => {
  saveSettings();
  // Also send message to content script about level change
  chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
    if (tabs[0]?.id) {
      chrome.scripting.executeScript({
        target: {tabId: tabs[0].id},
        function: (newLevel) => {
          if (window.currentLevel !== undefined) {
            window.currentLevel = newLevel;
          }
        },
        args: [levelSelect.value]
      }).catch(() => {
        // Ignore errors if content script not loaded
      });
    }
  });
});

autoDetectCheckbox.addEventListener('change', saveSettings);

explainBtn.addEventListener('click', explainCurrentPage);

// Keyboard shortcut support
document.addEventListener('keydown', (e) => {
  if (e.key === 'Enter' && e.target === explainBtn) {
    explainCurrentPage();
  }
});

// Load settings when popup opens
document.addEventListener('DOMContentLoaded', () => {
  loadSettings();

  // Update statistics every few seconds
  setInterval(() => {
    chrome.storage.sync.get(['pagesExplained', 'totalWordsSimplified', 'lastUsed'], (result) => {
      if (result.pagesExplained !== undefined) {
        pagesCount.textContent = result.pagesExplained;
      }
      if (result.totalWordsSimplified !== undefined) {
        wordsCount.textContent = result.totalWordsSimplified;
      }
      if (result.lastUsed) {
        lastUsedDiv.textContent = formatLastUsed(result.lastUsed);
      }
    });
  }, 2000);
});

// Initialize popup
loadSettings();

console.log('Explain This Page popup loaded');