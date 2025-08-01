// Popup script for Explain This Page extension v2.0
document.addEventListener('DOMContentLoaded', async function() {
  // DOM elements
  const levelSelect = document.getElementById('level-select');
  const autoDetectCheckbox = document.getElementById('auto-detect');
  const explainBtn = document.getElementById('explain-btn');
  const testBtn = document.getElementById('test-btn');
  const statusDiv = document.getElementById('status');
  const helpLink = document.getElementById('help-link');
  const resetLink = document.getElementById('reset-link');

  // Stats elements
  const pagesExplainedElement = document.getElementById('pages-explained');
  const wordsSimplifiedElement = document.getElementById('words-simplified');
  const lastUsedElement = document.getElementById('last-used');

  // Load settings and stats
  await loadSettings();
  await loadStats();

  // Event listeners
  levelSelect.addEventListener('change', saveSettings);
  autoDetectCheckbox.addEventListener('change', saveSettings);
  explainBtn.addEventListener('click', explainCurrentPage);
  testBtn.addEventListener('click', openTestPage);
  helpLink.addEventListener('click', showHelp);
  resetLink.addEventListener('click', resetSettings);

  // Load user settings
  async function loadSettings() {
    try {
      const result = await chrome.storage.sync.get(['explainPageLevel', 'autoDetect']);

      if (result.explainPageLevel) {
        levelSelect.value = result.explainPageLevel;
      }

      if (result.autoDetect !== undefined) {
        autoDetectCheckbox.checked = result.autoDetect;
      }
    } catch (error) {
      console.error('Failed to load settings:', error);
    }
  }

  // Save user settings
  async function saveSettings() {
    try {
      await chrome.storage.sync.set({
        explainPageLevel: levelSelect.value,
        autoDetect: autoDetectCheckbox.checked
      });

      showStatus('Settings saved!', 'success');
    } catch (error) {
      console.error('Failed to save settings:', error);
      showStatus('Failed to save settings', 'error');
    }
  }

  // Load usage statistics
  async function loadStats() {
    try {
      const result = await chrome.storage.sync.get([
        'pagesExplained',
        'totalWordsSimplified',
        'lastUsed'
      ]);

      pagesExplainedElement.textContent = result.pagesExplained || 0;
      wordsSimplifiedElement.textContent = result.totalWordsSimplified || 0;

      if (result.lastUsed) {
        const lastUsedDate = new Date(result.lastUsed);
        const now = new Date();
        const diffInHours = Math.floor((now - lastUsedDate) / (1000 * 60 * 60));

        if (diffInHours < 1) {
          lastUsedElement.textContent = 'Used just now';
        } else if (diffInHours < 24) {
          lastUsedElement.textContent = `Used ${diffInHours} hour${diffInHours === 1 ? '' : 's'} ago`;
        } else {
          const diffInDays = Math.floor(diffInHours / 24);
          lastUsedElement.textContent = `Used ${diffInDays} day${diffInDays === 1 ? '' : 's'} ago`;
        }
      } else {
        lastUsedElement.textContent = 'Never used';
      }
    } catch (error) {
      console.error('Failed to load stats:', error);
    }
  }

  // Explain current page
  async function explainCurrentPage() {
    try {
      explainBtn.classList.add('loading');
      explainBtn.textContent = 'Processing...';

      const [tab] = await chrome.tabs.query({
        active: true,
        currentWindow: true
      });

      if (!tab || !tab.id) {
        throw new Error('No active tab found');
      }

      // Check if page is explainable
      if (tab.url.startsWith('chrome://') || tab.url.startsWith('chrome-extension://')) {
        throw new Error('Cannot explain browser pages');
      }

      // Inject content script and trigger explanation
      await chrome.scripting.executeScript({
        target: { tabId: tab.id },
        function: () => {
          window.dispatchEvent(new CustomEvent('explain-page-request'));
        }
      });

      showStatus('Page explanation started!', 'success');

      // Close popup after short delay
      setTimeout(() => {
        window.close();
      }, 1000);

    } catch (error) {
      console.error('Failed to explain page:', error);
      showStatus(error.message || 'Failed to explain page', 'error');
    } finally {
      explainBtn.classList.remove('loading');
      explainBtn.textContent = 'Explain Current Page';
    }
  }

  // Open test page (Wikipedia)
  function openTestPage() {
    const testUrls = [
      'https://en.wikipedia.org/wiki/Artificial_intelligence',
      'https://en.wikipedia.org/wiki/Quantum_computing',
      'https://en.wikipedia.org/wiki/Machine_learning',
      'https://en.wikipedia.org/wiki/Blockchain',
      'https://en.wikipedia.org/wiki/Climate_change'
    ];

    const randomUrl = testUrls[Math.floor(Math.random() * testUrls.length)];
    chrome.tabs.create({ url: randomUrl });
    window.close();
  }

  // Show help information
  function showHelp(e) {
    e.preventDefault();

    const helpText = `
How to use Explain This Page:

1. AUTOMATIC MODE:
   • Extension detects complex pages
   • Blue banner appears automatically
   • Click banner to start explanation

2. MANUAL MODE:
   • Click extension icon
   • Select reading level
   • Click "Explain Current Page"

3. TEXT SELECTION:
   • Select any text on a page
   • Right-click → "Explain selected text"

READING LEVELS:
• Elementary: Simple words, short sentences
• Middle School: Moderate complexity
• High School: More advanced but clear

TIPS:
• Works best on text-heavy pages
• Hover over blue words for definitions
• Use side-by-side view to compare
• Try different reading levels

The extension works on most websites but cannot access browser pages (chrome://) or some secure sites.
    `;

    alert(helpText);
  }

  // Reset all settings and stats
  async function resetSettings(e) {
    e.preventDefault();

    if (confirm('Reset all settings and statistics? This cannot be undone.')) {
      try {
        await chrome.storage.sync.clear();

        // Reset UI to defaults
        levelSelect.value = 'middle';
        autoDetectCheckbox.checked = true;
        pagesExplainedElement.textContent = '0';
        wordsSimplifiedElement.textContent = '0';
        lastUsedElement.textContent = 'Never used';

        showStatus('Settings reset successfully!', 'success');
      } catch (error) {
        console.error('Failed to reset settings:', error);
        showStatus('Failed to reset settings', 'error');
      }
    }
  }

  // Show status message
  function showStatus(message, type = 'success') {
    statusDiv.textContent = message;
    statusDiv.className = `status-message ${type} show`;

    // Hide after 3 seconds
    setTimeout(() => {
      statusDiv.classList.remove('show');
    }, 3000);
  }

  // Check for updates periodically
  setInterval(loadStats, 30000); // Refresh stats every 30 seconds
});

// Handle errors globally
window.addEventListener('error', function(e) {
  console.error('Popup error:', e.error);
});
