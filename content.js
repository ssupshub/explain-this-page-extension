// Explain This Page - Content Script
// Automatically detects complex pages and offers simplification

class ExplainThisPage {
    constructor() {
        this.isActive = false;
        this.overlay = null;
        this.settings = {
            autoDetect: true,
            complexityLevel: 'middle-school',
            showNotifications: true
        };
        this.stats = {
            pagesExplained: 0,
            wordsSimplified: 0
        };

        // Simple word replacement dictionary
        this.simplifications = {
            'utilize': 'use',
            'demonstrate': 'show',
            'initiate': 'start',
            'terminate': 'end',
            'facilitate': 'help',
            'implement': 'do',
            'subsequently': 'then',
            'approximately': 'about',
            'nevertheless': 'but',
            'consequently': 'so',
            'furthermore': 'also',
            'therefore': 'so',
            'however': 'but',
            'alternatively': 'instead',
            'simultaneously': 'at the same time',
            'predominantly': 'mainly',
            'substantially': 'mostly',
            'methodology': 'method',
            'comprehensive': 'complete',
            'significant': 'important',
            'phenomenon': 'event',
            'fundamental': 'basic',
            'subsequent': 'next',
            'preliminary': 'first',
            'contemporary': 'modern',
            'accumulated': 'collected',
            'established': 'set up',
            'investigation': 'study',
            'observation': 'watching',
            'collaboration': 'working together',
            'configuration': 'setup',
            'modification': 'change',
            'optimization': 'improvement',
            'administration': 'management',
            'specification': 'details',
            'documentation': 'papers',
            'authorization': 'permission',
            'implementation': 'doing',
            'characteristic': 'feature',
            'approximately': 'about',
            'specifically': 'exactly',
            'particularly': 'especially'
        };

        this.jargonDefinitions = {
            'API': 'Application Programming Interface - a way for programs to talk to each other',
            'algorithm': 'a set of rules or steps to solve a problem',
            'bandwidth': 'how much data can be sent at once',
            'cache': 'temporary storage to make things faster',
            'cloud': 'storing data on internet servers instead of your computer',
            'database': 'organized collection of information',
            'encryption': 'scrambling data to keep it secret',
            'firewall': 'security system that blocks unwanted access',
            'malware': 'harmful software like viruses',
            'protocol': 'rules for how computers communicate',
            'server': 'computer that provides services to other computers',
            'URL': 'web address like www.google.com',
            'virus': 'harmful program that can damage your computer',
            'cryptocurrency': 'digital money like Bitcoin',
            'blockchain': 'secure way to record transactions',
            'machine learning': 'teaching computers to learn patterns',
            'artificial intelligence': 'making computers smart like humans',
            'IoT': 'Internet of Things - everyday objects connected to internet',
            'VPN': 'Virtual Private Network - secure internet connection'
        };

        this.init();
    }

    async init() {
        // Load settings and stats
        await this.loadSettings();

        // Wait for page to load completely
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.checkPage());
        } else {
            this.checkPage();
        }

        // Listen for messages from popup
        chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
            if (request.action === 'explainPage') {
                this.explainPage();
            } else if (request.action === 'getStats') {
                sendResponse(this.stats);
            } else if (request.action === 'updateSettings') {
                this.settings = { ...this.settings, ...request.settings };
                this.saveSettings();
            }
        });
    }

    async loadSettings() {
        return new Promise((resolve) => {
            chrome.storage.local.get(['settings', 'stats'], (result) => {
                if (result.settings) {
                    this.settings = { ...this.settings, ...result.settings };
                }
                if (result.stats) {
                    this.stats = { ...this.stats, ...result.stats };
                }
                resolve();
            });
        });
    }

    saveSettings() {
        chrome.storage.local.set({ 
            settings: this.settings,
            stats: this.stats 
        });
    }

    checkPage() {
        if (!this.settings.autoDetect || this.isActive) return;

        const complexity = this.analyzePageComplexity();

        if (complexity.isComplex && this.settings.showNotifications) {
            this.showNotification(complexity);
        }
    }

    analyzePageComplexity() {
        const textContent = document.body.innerText || '';
        const words = textContent.split(/\s+/);
        const sentences = textContent.split(/[.!?]+/);

        // Count complex indicators
        let complexWords = 0;
        let jargonCount = 0;
        let longSentences = 0;

        words.forEach(word => {
            const cleanWord = word.toLowerCase().replace(/[^a-z]/g, '');
            if (cleanWord.length > 12) complexWords++;
            if (this.jargonDefinitions[cleanWord]) jargonCount++;
        });

        sentences.forEach(sentence => {
            if (sentence.split(/\s+/).length > 25) longSentences++;
        });

        const avgWordsPerSentence = words.length / sentences.length;
        const complexityScore = (complexWords / words.length) * 100 + 
                               (jargonCount / words.length) * 200 + 
                               (longSentences / sentences.length) * 50;

        return {
            isComplex: complexityScore > 15,
            score: complexityScore,
            indicators: {
                complexWords,
                jargonCount,
                longSentences,
                avgWordsPerSentence
            }
        };
    }

    showNotification(complexity) {
        // Don't show if already showing
        if (document.querySelector('.etp-notification')) return;

        const notification = document.createElement('div');
        notification.className = 'etp-notification';
        notification.innerHTML = `
            <div class="etp-notification-content">
                <div class="etp-icon">📚</div>
                <div class="etp-text">
                    <strong>This page looks complex!</strong>
                    <p>I can explain it in simpler language.</p>
                </div>
                <div class="etp-buttons">
                    <button class="etp-btn etp-btn-primary" id="etp-explain">Explain It!</button>
                    <button class="etp-btn etp-btn-secondary" id="etp-dismiss">Not Now</button>
                </div>
            </div>
        `;

        document.body.appendChild(notification);

        // Add event listeners
        document.getElementById('etp-explain').addEventListener('click', () => {
            this.explainPage();
            notification.remove();
        });

        document.getElementById('etp-dismiss').addEventListener('click', () => {
            notification.remove();
        });

        // Auto-dismiss after 10 seconds
        setTimeout(() => {
            if (notification.parentNode) {
                notification.classList.add('etp-fade-out');
                setTimeout(() => notification.remove(), 300);
            }
        }, 10000);
    }

    explainPage() {
        if (this.isActive) return;

        this.isActive = true;
        this.stats.pagesExplained++;
        this.saveSettings();

        this.createOverlay();
    }

    createOverlay() {
        // Create overlay
        this.overlay = document.createElement('div');
        this.overlay.className = 'etp-overlay';
        this.overlay.innerHTML = `
            <div class="etp-overlay-content">
                <div class="etp-header">
                    <h2>📚 Explain This Page</h2>
                    <div class="etp-tabs">
                        <button class="etp-tab active" data-tab="simplified">Simplified</button>
                        <button class="etp-tab" data-tab="original">Original</button>
                    </div>
                    <button class="etp-close">&times;</button>
                </div>
                <div class="etp-loading">
                    <div class="etp-spinner"></div>
                    <p>Simplifying content...</p>
                </div>
                <div class="etp-content" style="display: none;">
                    <div class="etp-tab-content active" id="etp-simplified"></div>
                    <div class="etp-tab-content" id="etp-original"></div>
                </div>
                <div class="etp-footer">
                    <div class="etp-stats">
                        <span>Words simplified: <strong id="etp-word-count">0</strong></span>
                        <span>Reading level: <strong>${this.settings.complexityLevel}</strong></span>
                    </div>
                </div>
            </div>
        `;

        document.body.appendChild(this.overlay);

        // Add event listeners
        this.overlay.querySelector('.etp-close').addEventListener('click', () => this.closeOverlay());

        this.overlay.querySelectorAll('.etp-tab').forEach(tab => {
            tab.addEventListener('click', (e) => this.switchTab(e.target.dataset.tab));
        });

        // Start processing content
        setTimeout(() => this.processContent(), 500);
    }

    processContent() {
        const mainContent = this.extractMainContent();
        const simplified = this.simplifyContent(mainContent);
        const original = mainContent;

        // Hide loading, show content
        this.overlay.querySelector('.etp-loading').style.display = 'none';
        this.overlay.querySelector('.etp-content').style.display = 'block';

        // Populate content
        document.getElementById('etp-simplified').innerHTML = simplified;
        document.getElementById('etp-original').innerHTML = original;

        // Update word count
        document.getElementById('etp-word-count').textContent = this.stats.wordsSimplified;
    }

    extractMainContent() {
        // Try to find main content area
        const selectors = [
            'main',
            'article',
            '[role="main"]',
            '.content',
            '.main-content',
            '#content',
            '#main'
        ];

        for (const selector of selectors) {
            const element = document.querySelector(selector);
            if (element) {
                return element.innerHTML;
            }
        }

        // Fallback: get body content but exclude nav, footer, sidebar
        const body = document.body.cloneNode(true);
        const exclude = body.querySelectorAll('nav, footer, aside, .sidebar, .navigation, .menu, script, style');
        exclude.forEach(el => el.remove());

        return body.innerHTML;
    }

    simplifyContent(html) {
        // Create a temporary div to work with
        const temp = document.createElement('div');
        temp.innerHTML = html;

        // Process text nodes
        this.processTextNodes(temp);

        return temp.innerHTML;
    }

    processTextNodes(element) {
        const walker = document.createTreeWalker(
            element,
            NodeFilter.SHOW_TEXT,
            null,
            false
        );

        const textNodes = [];
        let node;
        while (node = walker.nextNode()) {
            textNodes.push(node);
        }

        textNodes.forEach(textNode => {
            if (textNode.parentNode.tagName === 'SCRIPT' || 
                textNode.parentNode.tagName === 'STYLE') {
                return;
            }

            let text = textNode.textContent;
            const originalText = text;

            // Replace complex words
            Object.keys(this.simplifications).forEach(complex => {
                const simple = this.simplifications[complex];
                const regex = new RegExp(`\\b${complex}\\b`, 'gi');
                const matches = text.match(regex);
                if (matches) {
                    text = text.replace(regex, simple);
                    this.stats.wordsSimplified += matches.length;
                }
            });

            // Add tooltips for jargon
            Object.keys(this.jargonDefinitions).forEach(jargon => {
                const definition = this.jargonDefinitions[jargon];
                const regex = new RegExp(`\\b${jargon}\\b`, 'gi');
                text = text.replace(regex, `<span class="etp-jargon" title="${definition}">$&</span>`);
            });

            // Simplify long sentences
            text = this.simplifySentences(text);

            if (text !== originalText) {
                const wrapper = document.createElement('span');
                wrapper.innerHTML = text;
                textNode.parentNode.replaceChild(wrapper, textNode);
            }
        });
    }

    simplifySentences(text) {
        return text.replace(/([.!?]\s*)([A-Z])/g, '$1\n\n$2')
                  .replace(/,\s*which\s+/gi, '. This ')
                  .replace(/,\s*that\s+/gi, '. This ')
                  .replace(/;\s*/g, '. ')
                  .replace(/\s+/g, ' ')
                  .trim();
    }

    switchTab(tabName) {
        // Update tab buttons
        this.overlay.querySelectorAll('.etp-tab').forEach(tab => {
            tab.classList.toggle('active', tab.dataset.tab === tabName);
        });

        // Update content
        this.overlay.querySelectorAll('.etp-tab-content').forEach(content => {
            content.classList.toggle('active', content.id === `etp-${tabName}`);
        });
    }

    closeOverlay() {
        if (this.overlay) {
            this.overlay.remove();
            this.overlay = null;
        }
        this.isActive = false;
    }
}

// Initialize the extension
if (document.location.protocol !== 'chrome-extension:') {
    new ExplainThisPage();
}
