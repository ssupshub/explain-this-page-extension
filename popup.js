// Explain This Page - Popup Script

class PopupController {
    constructor() {
        this.settings = {};
        this.stats = {};
        this.init();
    }

    async init() {
        await this.loadData();
        this.setupEventListeners();
        this.updateUI();
    }

    async loadData() {
        return new Promise((resolve) => {
            chrome.storage.local.get(['settings', 'stats'], (result) => {
                this.settings = result.settings || {
                    autoDetect: true,
                    complexityLevel: 'middle-school',
                    showNotifications: true
                };
                this.stats = result.stats || {
                    pagesExplained: 0,
                    wordsSimplified: 0
                };
                resolve();
            });
        });
    }

    setupEventListeners() {
        // Explain button
        document.getElementById('explainBtn').addEventListener('click', () => {
            this.explainCurrentPage();
        });

        // Settings
        document.getElementById('autoDetect').addEventListener('change', (e) => {
            this.updateSetting('autoDetect', e.target.checked);
        });

        document.getElementById('showNotifications').addEventListener('change', (e) => {
            this.updateSetting('showNotifications', e.target.checked);
        });

        document.getElementById('complexityLevel').addEventListener('change', (e) => {
            this.updateSetting('complexityLevel', e.target.value);
        });

        // Footer links
        document.getElementById('helpLink').addEventListener('click', (e) => {
            e.preventDefault();
            this.showHelp();
        });

        document.getElementById('feedbackLink').addEventListener('click', (e) => {
            e.preventDefault();
            this.showFeedback();
        });

        document.getElementById('aboutLink').addEventListener('click', (e) => {
            e.preventDefault();
            this.showAbout();
        });
    }

    updateUI() {
        // Update stats
        document.getElementById('pagesExplained').textContent = this.stats.pagesExplained || 0;
        document.getElementById('wordsSimplified').textContent = this.stats.wordsSimplified || 0;

        // Update settings
        document.getElementById('autoDetect').checked = this.settings.autoDetect;
        document.getElementById('showNotifications').checked = this.settings.showNotifications;
        document.getElementById('complexityLevel').value = this.settings.complexityLevel;
    }

    async explainCurrentPage() {
        const button = document.getElementById('explainBtn');
        const originalText = button.innerHTML;

        // Show loading state
        button.classList.add('loading');
        button.innerHTML = '<span class="btn-icon">⏳</span>Processing...';

        try {
            // Get current tab
            const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

            if (!tab) {
                throw new Error('No active tab found');
            }

            // Check if we can access the tab
            if (tab.url.startsWith('chrome://') || tab.url.startsWith('chrome-extension://')) {
                throw new Error('Cannot access this page type');
            }

            // Send message to content script
            await chrome.tabs.sendMessage(tab.id, { action: 'explainPage' });

            // Update stats
            this.stats.pagesExplained = (this.stats.pagesExplained || 0) + 1;
            await this.saveStats();
            this.updateUI();

            // Close popup
            window.close();

        } catch (error) {
            console.error('Error explaining page:', error);

            // Show error message
            button.innerHTML = '<span class="btn-icon">❌</span>Error';

            setTimeout(() => {
                button.classList.remove('loading');
                button.innerHTML = originalText;
            }, 2000);

            // Show user-friendly error
            this.showError(this.getErrorMessage(error.message));
        }
    }

    getErrorMessage(error) {
        if (error.includes('Cannot access this page type')) {
            return 'This extension cannot work on Chrome system pages. Please try on a regular website.';
        }
        if (error.includes('No active tab found')) {
            return 'Please make sure you have a web page open and try again.';
        }
        return 'Unable to explain this page. Please try refreshing the page and try again.';
    }

    showError(message) {
        // Create and show error notification
        const errorDiv = document.createElement('div');
        errorDiv.style.cssText = `
            position: fixed;
            top: 10px;
            left: 10px;
            right: 10px;
            background: #ff4757;
            color: white;
            padding: 10px;
            border-radius: 6px;
            font-size: 12px;
            z-index: 1000;
            animation: slideDown 0.3s ease;
        `;
        errorDiv.textContent = message;

        document.body.appendChild(errorDiv);

        setTimeout(() => {
            errorDiv.remove();
        }, 5000);
    }

    async updateSetting(key, value) {
        this.settings[key] = value;
        await chrome.storage.local.set({ settings: this.settings });

        // Notify content scripts of setting change
        try {
            const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
            if (tab && !tab.url.startsWith('chrome://')) {
                chrome.tabs.sendMessage(tab.id, {
                    action: 'updateSettings',
                    settings: this.settings
                });
            }
        } catch (error) {
            // Ignore errors for inactive tabs
        }
    }

    async saveStats() {
        await chrome.storage.local.set({ stats: this.stats });
    }

    showHelp() {
        const helpContent = `
            <div style="padding: 20px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
                <h2 style="color: #667eea; margin-bottom: 15px;">How to Use Explain This Page</h2>

                <h3 style="color: #333; margin: 15px 0 10px 0;">Getting Started</h3>
                <p style="margin-bottom: 10px;">• Click "Explain Current Page" to simplify complex content</p>
                <p style="margin-bottom: 10px;">• The extension automatically detects complex pages</p>
                <p style="margin-bottom: 10px;">• Right-click on any page and select "Explain this page"</p>

                <h3 style="color: #333; margin: 15px 0 10px 0;">Features</h3>
                <p style="margin-bottom: 10px;">• <strong>Text Simplification:</strong> Replaces complex words with simpler alternatives</p>
                <p style="margin-bottom: 10px;">• <strong>Jargon Tooltips:</strong> Hover over highlighted terms for definitions</p>
                <p style="margin-bottom: 10px;">• <strong>Dual View:</strong> Compare original and simplified text side-by-side</p>
                <p style="margin-bottom: 10px;">• <strong>Reading Levels:</strong> Choose between Elementary, Middle School, or High School level</p>

                <h3 style="color: #333; margin: 15px 0 10px 0;">Tips</h3>
                <p style="margin-bottom: 10px;">• Works best on text-heavy pages like Wikipedia, news articles, and research papers</p>
                <p style="margin-bottom: 10px;">• Disable auto-detection if you prefer manual control</p>
                <p style="margin-bottom: 10px;">• Track your learning progress in the stats section</p>
            </div>
        `;

        this.showModal('Help', helpContent);
    }

    showFeedback() {
        const feedbackContent = `
            <div style="padding: 20px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
                <h2 style="color: #667eea; margin-bottom: 15px;">Feedback & Support</h2>

                <p style="margin-bottom: 15px;">We'd love to hear from you! Your feedback helps us improve the extension.</p>

                <h3 style="color: #333; margin: 15px 0 10px 0;">Report Issues</h3>
                <p style="margin-bottom: 10px;">• Found a bug? Let us know what page you were on and what happened</p>
                <p style="margin-bottom: 10px;">• Extension not working? Check if the page allows extensions</p>

                <h3 style="color: #333; margin: 15px 0 10px 0;">Feature Requests</h3>
                <p style="margin-bottom: 10px;">• Suggest new reading levels or complexity options</p>
                <p style="margin-bottom: 10px;">• Request support for specific types of content</p>

                <h3 style="color: #333; margin: 15px 0 10px 0;">Contact</h3>
                <p style="margin-bottom: 10px;">Email: support@explainthispage.com</p>
                <p style="margin-bottom: 10px;">Website: www.explainthispage.com</p>
            </div>
        `;

        this.showModal('Feedback', feedbackContent);
    }

    showAbout() {
        const aboutContent = `
            <div style="padding: 20px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
                <h2 style="color: #667eea; margin-bottom: 15px;">About Explain This Page</h2>

                <p style="margin-bottom: 15px;"><strong>Version:</strong> 1.0.0</p>

                <h3 style="color: #333; margin: 15px 0 10px 0;">Mission</h3>
                <p style="margin-bottom: 15px;">Making complex web content accessible to everyone, especially students and learners who need simplified explanations.</p>

                <h3 style="color: #333; margin: 15px 0 10px 0;">Privacy</h3>
                <p style="margin-bottom: 10px;">• All processing happens locally on your device</p>
                <p style="margin-bottom: 10px;">• No data is sent to external servers</p>
                <p style="margin-bottom: 10px;">• Settings and stats are stored locally</p>

                <h3 style="color: #333; margin: 15px 0 10px 0;">Technology</h3>
                <p style="margin-bottom: 10px;">• Built with modern JavaScript and Chrome Extension Manifest V3</p>
                <p style="margin-bottom: 10px;">• Uses local word simplification algorithms</p>
                <p style="margin-bottom: 10px;">• Responsive design for all screen sizes</p>

                <h3 style="color: #333; margin: 15px 0 10px 0;">Credits</h3>
                <p>Developed with ❤️ for students and lifelong learners everywhere.</p>
            </div>
        `;

        this.showModal('About', aboutContent);
    }

    showModal(title, content) {
        // Create modal overlay
        const overlay = document.createElement('div');
        overlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0,0,0,0.8);
            z-index: 10000;
            display: flex;
            align-items: center;
            justify-content: center;
        `;

        const modal = document.createElement('div');
        modal.style.cssText = `
            background: white;
            border-radius: 12px;
            max-width: 500px;
            max-height: 80vh;
            overflow-y: auto;
            position: relative;
            box-shadow: 0 20px 60px rgba(0,0,0,0.3);
        `;

        modal.innerHTML = `
            <div style="position: sticky; top: 0; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; display: flex; justify-content: space-between; align-items: center;">
                <h2 style="margin: 0; font-size: 18px;">${title}</h2>
                <button style="background: none; border: none; color: white; font-size: 24px; cursor: pointer; padding: 0; width: 30px; height: 30px;" onclick="this.closest('.modal-overlay').remove();">&times;</button>
            </div>
            ${content}
        `;

        overlay.className = 'modal-overlay';
        overlay.appendChild(modal);
        document.body.appendChild(overlay);

        // Close on overlay click
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) {
                overlay.remove();
            }
        });
    }
}

// Initialize popup when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new PopupController();
});
