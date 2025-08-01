// Background service worker for Explain This Page extension v2.0

// Create context menu item for selected text explanation
chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: "explain-selection",
    title: "Explain selected text",
    contexts: ["selection"]
  });
});

// Listen to context menu clicks
chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === "explain-selection" && tab?.id) {
    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      function: explainSelection,
      args: [info.selectionText]
    }).catch(error => {
      console.error("Error executing explain selection:", error);
    });
  }
});

// Function injected into page to handle selected text explanation
function explainSelection(selectedText) {
  const maxLength = 200;
  const truncated = selectedText.length > maxLength 
    ? selectedText.substring(0, maxLength) + "..." 
    : selectedText;

  alert(`Explain selected text:\n\n"${truncated}"\n\n(This would show simplified explanation and jargon definitions)`);
}

// Listen for extension icon clicks (if popup is disabled)
chrome.action.onClicked.addListener((tab) => {
  if (!tab.id) return;

  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    function: () => {
      window.dispatchEvent(new CustomEvent('explain-page-request'));
    }
  }).catch(error => {
    console.error("Error triggering page explanation:", error);
  });
});

// Handle messages from content scripts
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'updateStats') {
    // Handle statistics updates
    chrome.storage.sync.get(['pagesExplained', 'totalWordsSimplified'], (result) => {
      const pagesExplained = (result.pagesExplained || 0) + (request.pages || 0);
      const totalWordsSimplified = (result.totalWordsSimplified || 0) + (request.words || 0);

      chrome.storage.sync.set({
        pagesExplained,
        totalWordsSimplified,
        lastUsed: Date.now()
      });

      sendResponse({ success: true });
    });
    return true; // Keep message channel open for async response
  }
});

console.log("Explain This Page background service worker loaded");