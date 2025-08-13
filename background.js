// background.js v2.2.1 (unchanged functionality)
chrome.runtime.onInstalled.addListener(() => {
  try {
    chrome.contextMenus.create({ id: 'explain-selection', title: 'Explain selected text', contexts: ['selection'] });
  } catch (e) { console.error('Context menu creation failed', e); }
  chrome.storage.sync.get(['explainPageLevel', 'autoDetect'], (res) => {
    const defaults = {};
    if (res.explainPageLevel === undefined) defaults.explainPageLevel = 'middle';
    if (res.autoDetect === undefined) defaults.autoDetect = true;
    if (Object.keys(defaults).length) chrome.storage.sync.set(defaults);
  });
});
chrome.contextMenus.onClicked.addListener((info, tab) => {
  try {
    if (info.menuItemId === 'explain-selection' && tab?.id) {
      chrome.scripting.executeScript({ target: { tabId: tab.id }, func: (sel) => {
        alert(`Explain selected text:\n\n"${sel.length > 200 ? sel.substring(0,200) + '...' : sel}"\n\n(This would show simplified explanation and jargon definitions)`);
      }, args: [info.selectionText || ''] }).catch(err => console.error('Error executing explain-selection script', err));
    }
  } catch (err) { console.error('Context menu click handler error:', err); }
});
chrome.action.onClicked.addListener((tab) => {
  if (!tab?.id) return;
  chrome.scripting.executeScript({ target: { tabId: tab.id }, func: () => window.dispatchEvent(new CustomEvent('explain-page-request')) }).catch(error => console.error('Error triggering page explanation:', error));
});
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'updateStats') {
    chrome.storage.sync.get(['pagesExplained','totalWordsSimplified'], (result) => {
      const pagesExplained = (result.pagesExplained || 0) + (request.pages || 0);
      const totalWordsSimplified = (result.totalWordsSimplified || 0) + (request.words || 0);
      chrome.storage.sync.set({ pagesExplained, totalWordsSimplified, lastUsed: Date.now() }, () => sendResponse({ success: true }));
    });
    return true;
  }
});
