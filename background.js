// Explain This Page - Background Script (Service Worker)

// Install event
chrome.runtime.onInstalled.addListener((details) => {
    if (details.reason === 'install') {
        // Set default settings on first install
        chrome.storage.local.set({
            settings: {
                autoDetect: true,
                complexityLevel: 'middle-school',
                showNotifications: true
            },
            stats: {
                pagesExplained: 0,
                wordsSimplified: 0
            }
        });

        // Open welcome page
        chrome.tabs.create({
            url: chrome.runtime.getURL('welcome.html')
        });
    }

    // Create context menu
    chrome.contextMenus.create({
        id: 'explainSelection',
        title: 'Explain selected text',
        contexts: ['selection']
    });

    chrome.contextMenus.create({
        id: 'explainPage',
        title: 'Explain this page',
        contexts: ['page']
    });
});

// Context menu click handler
chrome.contextMenus.onClicked.addListener((info, tab) => {
    if (info.menuItemId === 'explainPage' || info.menuItemId === 'explainSelection') {
        chrome.tabs.sendMessage(tab.id, {
            action: 'explainPage',
            selectedText: info.selectionText || null
        });
    }
});

// Handle messages from content script and popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'getSettings') {
        chrome.storage.local.get(['settings', 'stats'], (result) => {
            sendResponse({
                settings: result.settings || {},
                stats: result.stats || {}
            });
        });
        return true; // Will respond asynchronously
    }

    if (request.action === 'updateStats') {
        chrome.storage.local.get('stats', (result) => {
            const stats = result.stats || { pagesExplained: 0, wordsSimplified: 0 };
            const updatedStats = { ...stats, ...request.stats };
            chrome.storage.local.set({ stats: updatedStats });
        });
    }
});

// Badge update based on page complexity
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (changeInfo.status === 'complete' && tab.url && !tab.url.startsWith('chrome://')) {
        // Inject content script if not already injected
        chrome.scripting.executeScript({
            target: { tabId: tabId },
            files: ['content.js']
        }).catch(() => {
            // Ignore errors (e.g., on chrome:// pages)
        });
    }
});
