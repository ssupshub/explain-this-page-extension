// Background service worker for "Explain This Page" extension
// Uses Manifest V3 APIs

// Create context menu on installation
chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: "explain-selection",
    title: "Explain selected text",
    contexts: ["selection"]
  });
});

// Handle context menu clicks
chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === "explain-selection" && tab?.id) {
    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      function: explainSelection,
      args: [info.selectionText]
    }).catch(err => {
      console.error("Failed to explain selection:", err);
    });
  }
});

// Function to inject for explaining selected text
function explainSelection(selectedText) {
  // Create a simple explanation popup
  const explanationDiv = document.createElement('div');
  explanationDiv.style.cssText = `
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background: white;
    border: 2px solid #2d89ef;
    border-radius: 10px;
    padding: 20px;
    max-width: 400px;
    z-index: 999999;
    box-shadow: 0 4px 20px rgba(0,0,0,0.3);
    font-family: Arial, sans-serif;
  `;

  explanationDiv.innerHTML = `
    <h3 style="margin-top: 0; color: #2d89ef;">Selected Text Explanation</h3>
    <p><strong>Original:</strong> "${selectedText}"</p>
    <p><strong>Simplified:</strong> This text can be explained in simpler terms. (This is a demonstration - full AI explanation would go here)</p>
    <button onclick="this.parentElement.remove()" style="background: #2d89ef; color: white; border: none; padding: 8px 16px; border-radius: 4px; cursor: pointer;">Close</button>
  `;

  document.body.appendChild(explanationDiv);

  // Auto-remove after 10 seconds
  setTimeout(() => {
    if (explanationDiv.parentElement) {
      explanationDiv.remove();
    }
  }, 10000);
}

// Handle messages from content script or popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "analyzeComplexity") {
    // Could add more sophisticated analysis here
    sendResponse({complex: request.wordCount > 100});
  }
});
