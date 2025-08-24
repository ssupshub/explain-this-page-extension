// Enhanced Background Script v3.0
class ExplainPageBackground {
  constructor() {
    this.init();
  }

  init() {
    this.setupInstallListener();
    this.setupContextMenu();
    this.setupActionListener();
    this.setupMessageListener();
  }

  setupInstallListener() {
    chrome.runtime.onInstalled.addListener(() => {
      console.log('Explain This Page extension installed/updated');
      
      this.createContextMenu();
      this.initializeSettings();
    });
  }

  createContextMenu() {
    try {
      // Remove existing context menu items
      chrome.contextMenus.removeAll(() => {
        // Create new context menu
        chrome.contextMenus.create({
          id: 'explain-selection',
          title: 'Explain selected text',
          contexts: ['selection']
        });

        chrome.contextMenus.create({
          id: 'explain-page',
          title: 'Explain this page',
          contexts: ['page']
        });

        console.log('Context menus created successfully');
      });
    } catch (error) {
      console.error('Error creating context menu:', error);
    }
  }

  initializeSettings() {
    chrome.storage.sync.get([
      'explainPageLevel', 
      'autoDetect', 
      'pagesExplained', 
      'totalWordsSimplified'
    ], (result) => {
      const defaults = {};
      
      if (result.explainPageLevel === undefined) {
        defaults.explainPageLevel = 'middle';
      }
      
      if (result.autoDetect === undefined) {
        defaults.autoDetect = true;
      }
      
      if (result.pagesExplained === undefined) {
        defaults.pagesExplained = 0;
      }
      
      if (result.totalWordsSimplified === undefined) {
        defaults.totalWordsSimplified = 0;
      }

      if (Object.keys(defaults).length > 0) {
        chrome.storage.sync.set(defaults, () => {
          console.log('Default settings initialized:', defaults);
        });
      }
    });
  }

  setupContextMenu() {
    chrome.contextMenus.onClicked.addListener((info, tab) => {
      this.handleContextMenuClick(info, tab);
    });
  }

  handleContextMenuClick(info, tab) {
    if (!tab?.id) {
      console.error('No valid tab ID for context menu action');
      return;
    }

    try {
      if (info.menuItemId === 'explain-selection') {
        this.handleTextSelection(info, tab);
      } else if (info.menuItemId === 'explain-page') {
        this.handlePageExplanation(tab);
      }
    } catch (error) {
      console.error('Error handling context menu click:', error);
    }
  }

  handleTextSelection(info, tab) {
    const selectedText = info.selectionText || '';
    
    if (!selectedText.trim()) {
      console.log('No text selected');
      return;
    }

    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      func: (text) => {
        // Create a simple explanation popup for selected text
        const popup = document.createElement('div');
        popup.style.cssText = `
          position: fixed;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          background: white;
          border: 2px solid #2563eb;
          border-radius: 12px;
          padding: 20px;
          max-width: 400px;
          box-shadow: 0 10px 25px rgba(0,0,0,0.15);
          z-index: 2147483000;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        `;
        
        popup.innerHTML = `
          <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 16px;">
            <h3 style="margin: 0; color: #1e293b; font-size: 18px;">Selected Text Explanation</h3>
            <button id="closeSelectedText" style="background: none; border: none; font-size: 20px; cursor: pointer; color: #64748b;">&times;</button>
          </div>
          <div style="background: #f8fafc; padding: 12px; border-radius: 8px; margin-bottom: 16px; border-left: 4px solid #2563eb;">
            <strong style="color: #1e293b;">Selected:</strong><br>
            <span style="color: #475569;">"${text.length > 150 ? text.substring(0, 150) + '...' : text}"</span>
          </div>
          <div style="color: #475569; font-size: 14px; line-height: 1.5;">
            This feature provides instant explanations for selected text. The full page explanation tool offers more comprehensive analysis with jargon definitions and text simplification.
          </div>
          <button id="explainFullPage" style="
            width: 100%;
            background: linear-gradient(135deg, #2563eb, #7c3aed);
            color: white;
            border: none;
            padding: 12px;
            border-radius: 8px;
            font-weight: 600;
            cursor: pointer;
            margin-top: 16px;
            transition: transform 0.2s ease;
          ">Explain Full Page Instead</button>
        `;
        
        document.body.appendChild(popup);
        
        // Add event listeners
        document.getElementById('closeSelectedText').onclick = () => {
          document.body.removeChild(popup);
        };
        
        document.getElementById('explainFullPage').onclick = () => {
          document.body.removeChild(popup);
          window.dispatchEvent(new CustomEvent('explain-page-request'));
        };
        
        // Auto-remove after 10 seconds
        setTimeout(() => {
          if (document.body.contains(popup)) {
            document.body.removeChild(popup);
          }
        }, 10000);
      },
      args: [selectedText]
    }).catch(error => {
      console.error('Error showing text selection explanation:', error);
    });
  }

  handlePageExplanation(tab) {
    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      func: () => {
        window.dispatchEvent(new CustomEvent('explain-page-request'));
        return { success: true };
      }
    }).catch(error => {
      console.error('Error triggering page explanation:', error);
    });
  }

  setupActionListener() {
    chrome.action.onClicked.addListener((tab) => {
      if (!tab?.id) {
        console.error('No valid tab for action click');
        return;
      }

      this.handlePageExplanation(tab);
    });
  }

  setupMessageListener() {
    chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
      this.handleMessage(request, sender, sendResponse);
      return true; // Keep message channel open for async response
    });
  }

  handleMessage(request, sender, sendResponse) {
    try {
      switch (request.action) {
        case 'updateStats':
          this.updateStatistics(request, sendResponse);
          break;
        
        case 'getSettings':
          this.getSettings(sendResponse);
          break;
        
        case 'saveSettings':
          this.saveSettings(request.settings, sendResponse);
          break;
        
        default:
          sendResponse({ success: false, error: 'Unknown action' });
      }
    } catch (error) {
      console.error('Error handling message:', error);
      sendResponse({ success: false, error: error.message });
    }
  }

  updateStatistics(request, sendResponse) {
    const pagesToAdd = request.pages || 0;
    const wordsToAdd = request.words || 0;

    chrome.storage.sync.get(['pagesExplained', 'totalWordsSimplified'], (result) => {
      if (chrome.runtime.lastError) {
        sendResponse({ success: false, error: chrome.runtime.lastError.message });
        return;
      }

      const newStats = {
        pagesExplained: (result.pagesExplained || 0) + pagesToAdd,
        totalWordsSimplified: (result.totalWordsSimplified || 0) + wordsToAdd,
        lastUsed: Date.now()
      };

      chrome.storage.sync.set(newStats, () => {
        if (chrome.runtime.lastError) {
          sendResponse({ success: false, error: chrome.runtime.lastError.message });
        } else {
          sendResponse({ success: true, stats: newStats });
          console.log('Statistics updated:', newStats);
        }
      });
    });
  }

  getSettings(sendResponse) {
    chrome.storage.sync.get(null, (result) => {
      if (chrome.runtime.lastError) {
        sendResponse({ success: false, error: chrome.runtime.lastError.message });
      } else {
        sendResponse({ success: true, settings: result });
      }
    });
  }

  saveSettings(settings, sendResponse) {
    chrome.storage.sync.set(settings, () => {
      if (chrome.runtime.lastError) {
        sendResponse({ success: false, error: chrome.runtime.lastError.message });
      } else {
        sendResponse({ success: true });
        console.log('Settings saved:', settings);
      }
    });
  }
}

// Initialize the background script
new ExplainPageBackground();

// Add error handling for unhandled errors
self.addEventListener('error', (event) => {
  console.error('Background script error:', event.error);
});

self.addEventListener('unhandledrejection', (event) => {
  console.error('Unhandled promise rejection in background script:', event.reason);
});
