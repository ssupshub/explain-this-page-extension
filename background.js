// Background service worker for Explain This Page extension
chrome.runtime.onInstalled.addListener(() => {
  // Create context menu item for selected text explanation
  chrome.contextMenus.create({
    id: "explain-selection",
    title: "Explain selected text",
    contexts: ["selection"]
  });

  console.log("Explain This Page extension installed successfully");
});

// Handle context menu clicks
chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === "explain-selection" && tab?.id) {
    // Use chrome.scripting.executeScript instead of deprecated chrome.tabs.executeScript
    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      function: explainSelectedText,
      args: [info.selectionText]
    }).catch(err => {
      console.error("Failed to explain selected text:", err);
    });
  }
});

// Function to inject into page for explaining selected text
function explainSelectedText(selectedText) {
  // Create a simple explanation popup
  const popup = document.createElement('div');
  popup.style.cssText = `
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background: white;
    border: 2px solid #2d89ef;
    border-radius: 8px;
    padding: 20px;
    max-width: 400px;
    z-index: 999999;
    box-shadow: 0 4px 20px rgba(0,0,0,0.3);
    font-family: Arial, sans-serif;
  `;

  const title = document.createElement('h3');
  title.textContent = 'Text Explanation';
  title.style.marginTop = '0';
  title.style.color = '#2d89ef';

  const originalText = document.createElement('p');
  originalText.innerHTML = '<strong>Original:</strong> ' + selectedText;
  originalText.style.marginBottom = '10px';

  const simplifiedText = document.createElement('p');
  simplifiedText.innerHTML = '<strong>Simplified:</strong> ' + simplifyTextBasic(selectedText);
  simplifiedText.style.marginBottom = '15px';

  const closeBtn = document.createElement('button');
  closeBtn.textContent = 'Close';
  closeBtn.style.cssText = `
    background: #2d89ef;
    color: white;
    border: none;
    padding: 8px 16px;
    border-radius: 4px;
    cursor: pointer;
    float: right;
  `;
  closeBtn.onclick = () => popup.remove();

  popup.appendChild(title);
  popup.appendChild(originalText);
  popup.appendChild(simplifiedText);
  popup.appendChild(closeBtn);

  document.body.appendChild(popup);

  // Auto-remove after 10 seconds
  setTimeout(() => {
    if (popup.parentNode) popup.remove();
  }, 10000);
}

// Basic text simplification function
function simplifyTextBasic(text) {
  const replacements = {
    'utilize': 'use',
    'demonstrate': 'show',
    'implement': 'do',
    'facilitate': 'help',
    'approximately': 'about',
    'subsequently': 'then',
    'consequently': 'so',
    'furthermore': 'also',
    'however': 'but',
    'therefore': 'so'
  };

  let simplified = text;
  for (const [complex, simple] of Object.entries(replacements)) {
    const regex = new RegExp('\\b' + complex + '\\b', 'gi');
    simplified = simplified.replace(regex, simple);
  }

  return simplified;
}

// Listen for messages from content script or popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "explainPage") {
    // Inject content script to explain the current page
    chrome.scripting.executeScript({
      target: { tabId: sender.tab.id },
      function: () => {
        window.dispatchEvent(new CustomEvent('explain-page-request'));
      }
    }).catch(err => {
      console.error("Failed to explain page:", err);
    });
  }

  sendResponse({ success: true });
});
