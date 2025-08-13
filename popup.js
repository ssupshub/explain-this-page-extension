// Popup script for Explain This Page extension v2.1

const levelSelect = document.getElementById('level-select');
const autoDetectCheckbox = document.getElementById('auto-detect');
const explainBtn = document.getElementById('explain-btn');
const statusDiv = document.getElementById('status');
const pagesCount = document.getElementById('pages-count');
const wordsCount = document.getElementById('words-count');
const lastUsedDiv = document.getElementById('last-used');

function showStatus(message, type = 'info', duration = 3000) {
  statusDiv.textContent = message;
  statusDiv.className = `status-message ${type}`;
  if (duration > 0) setTimeout(() => { statusDiv.textContent = ''; statusDiv.className = 'status-message'; }, duration);
}

function formatLastUsed(timestamp) {
  if (!timestamp) return '';
  const date = new Date(timestamp);
  const now = new Date();
  const diffTime = Math.abs(now - date);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  if (diffDays === 1) return 'Last used: Yesterday';
  if (diffDays < 7) return `Last used: ${diffDays} days ago`;
  return `Last used: ${date.toLocaleDateString()}`;
}

function loadSettings() {
  try {
    chrome.storage.sync.get(['explainPageLevel', 'autoDetect', 'pagesExplained', 'totalWordsSimplified', 'lastUsed'], (result) => {
      if (result.explainPageLevel) levelSelect.value = result.explainPageLevel;
      if (result.autoDetect !== undefined) autoDetectCheckbox.checked = result.autoDetect;
      pagesCount.textContent = result.pagesExplained || 0;
      wordsCount.textContent = result.totalWordsSimplified || 0;
      if (result.lastUsed) lastUsedDiv.textContent = formatLastUsed(result.lastUsed);
    });
  } catch (err) {
    console.error('Error loading settings:', err);
    showStatus('Error loading settings', 'error');
  }
}

function saveSettings() {
  try {
    const settings = { explainPageLevel: levelSelect.value, autoDetect: autoDetectCheckbox.checked };
    chrome.storage.sync.set(settings, () => {
      if (chrome.runtime.lastError) {
        showStatus('Error saving settings', 'error');
      } else {
        showStatus('✅ Settings saved!', 'success', 1200);
      }
    });
  } catch (err) {
    console.error('Error saving settings:', err);
    showStatus('Error saving settings', 'error');
  }
}

function setButtonLoading(loading) {
  if (loading) {
    explainBtn.classList.add('loading');
    explainBtn.innerHTML = "<span class=\"btn-icon\">🔄</span>Explaining...";
  } else {
    explainBtn.classList.remove('loading');
    explainBtn.innerHTML = "<span class=\"btn-icon\">🔍</span>Explain Current Page";
  }
}

function explainCurrentPage() {
  setButtonLoading(true);
  showStatus('🔄 Analyzing page...', 'info', 0);

  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    if (!tabs.length || !tabs[0]?.id) {
      setButtonLoading(false);
      showStatus('❌ No active tab found', 'error');
      return;
    }
    const tab = tabs[0];
    if (!tab.url || tab.url.startsWith('chrome://') || tab.url.startsWith('chrome-extension://') || tab.url.startsWith('edge://')) {
      setButtonLoading(false);
      showStatus('❌ Cannot explain browser pages', 'error');
      return;
    }

    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      func: () => { window.dispatchEvent(new CustomEvent('explain-page-request')); return true; }
    }).then((results) => {
      setButtonLoading(false);
      if (results && results[0] && results[0].result) {
        showStatus('✅ Page explanation opened!', 'success');
        setTimeout(() => window.close(), 900);
      } else {
        showStatus('⚠️ Page explained (if complex)', 'info');
        setTimeout(() => window.close(), 1500);
      }
    }).catch(error => {
      setButtonLoading(false);
      console.error('Error triggering explanation:', error);
      showStatus('❌ Error explaining page', 'error');
    });
  });
}

levelSelect.addEventListener('change', () => {
  saveSettings();
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    if (!tabs.length || !tabs[0]?.id) return;
    chrome.scripting.executeScript({
      target: { tabId: tabs[0].id },
      func: (newLevel) => {
        window.currentLevel = newLevel;
        window.dispatchEvent(new CustomEvent('explain-page-level-changed', { detail: newLevel }));
      },
      args: [levelSelect.value]
    }).catch(() => {});
  });
});

autoDetectCheckbox.addEventListener('change', saveSettings);
explainBtn.addEventListener('click', explainCurrentPage);

document.addEventListener('keydown', (e) => {
  if (e.key === 'Enter' && document.activeElement === explainBtn) explainCurrentPage();
});

// Update stats periodically in the popup
function startStatsUpdater() {
  setInterval(() => {
    chrome.storage.sync.get(['pagesExplained', 'totalWordsSimplified', 'lastUsed'], (result) => {
      if (result.pagesExplained !== undefined) pagesCount.textContent = result.pagesExplained;
      if (result.totalWordsSimplified !== undefined) wordsCount.textContent = result.totalWordsSimplified;
      if (result.lastUsed) lastUsedDiv.textContent = formatLastUsed(result.lastUsed);
    });
  }, 2000);
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
  loadSettings();
  startStatsUpdater();
});

console.log('Explain This Page popup loaded (v2.1)');
