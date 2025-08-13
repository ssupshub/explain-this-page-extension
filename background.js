// Background service worker for Explain This Page extension v2.1

// Create context menu item for selected text explanation and set defaults
chrome.runtime.onInstalled.addListener(() => {
  // Create context menu
  try {
    chrome.contextMenus.create({
      id: 'explain-selection',
      title: 'Explain selected text',
      contexts: ['selection']
    });
  } catch (e) {
    console.error('Context menu creation failed', e);
  }

  // Set default settings if not set
  chrome.storage.sync.get(['explainPageLevel', 'autoDetect'], (res) => {
    const defaults = {};
    if (res.explainPageLevel === undefined) defaults.explainPageLevel = 'middle';
    if (res.autoDetect === undefined) defaults.autoDetect = true;
    if (Object.keys(defaults).length) {
      chrome.storage.sync.set(defaults);
    }
  });
});

// Listen to context menu clicks
chrome.contextMenus.onClicked.addListener((info, tab) => {
  try {
    if (info.menuItemId === 'explain-selection' && tab?.id) {
      chrome.scripting.executeScript({
        target: { tabId: tab.id },
        func: (sel) => {
          // Run in page context: show a quick alert (this is a simple fallback)
          alert(`Explain selected text:\n\n"${sel.length > 200 ? sel.substring(0, 200) + '...' : sel}"\n\n(This would show simplified explanation and jargon definitions)`);
        },
        args: [info.selectionText || '']
      }).catch(err => console.error('Error executing explain-selection script', err));
    }
  } catch (err) {
    console.error('Context menu click handler error:', err);
  }
});

// Listen for extension icon clicks (if popup disabled)
chrome.action.onClicked.addListener((tab) => {
  if (!tab?.id) return;
  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    func: () => window.dispatchEvent(new CustomEvent('explain-page-request'))
  }).catch(error => {
    console.error('Error triggering page explanation:', error);
  });
});

// Handle messages from content scripts
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'updateStats') {
    chrome.storage.sync.get(['pagesExplained', 'totalWordsSimplified'], (result) => {
      const pagesExplained = (result.pagesExplained || 0) + (request.pages || 0);
      const totalWordsSimplified = (result.totalWordsSimplified || 0) + (request.words || 0);

      chrome.storage.sync.set({ pagesExplained, totalWordsSimplified, lastUsed: Date.now() }, () => {
        sendResponse({ success: true });
      });
    });
    return true; // keep channel open
  }
});

console.log('Explain This Page background service worker loaded (v2.1)');
