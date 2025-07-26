// Content script for "Explain This Page" extension
// Runs on all pages to detect complexity and provide simplification

// Prevent multiple injections
if (window.__explainPageInjected) {
  console.log("Explain This Page: Already injected");
} else {
  window.__explainPageInjected = true;

  // Dictionary of common jargon terms and their explanations
  const jargonDictionary = {
    "API": "Application Programming Interface – a set of tools that allow different software programs to communicate with each other.",
    "JavaScript": "A programming language that makes web pages interactive and dynamic.",
    "HTML": "HyperText Markup Language – the code used to structure and display content on web pages.",
    "CSS": "Cascading Style Sheets – the code used to style and format the appearance of web pages.",
    "algorithm": "A set of step-by-step instructions to solve a problem or complete a task.",
    "bandwidth": "The amount of data that can be transmitted over an internet connection in a given time.",
    "cache": "A temporary storage area that keeps frequently used data for quick access.",
    "cryptocurrency": "Digital money that uses encryption for security and operates independently of banks.",
    "encryption": "The process of converting information into a secret code to protect it from unauthorized access.",
    "firewall": "A security system that monitors and controls network traffic to protect against threats.",
    "malware": "Malicious software designed to damage or gain unauthorized access to computer systems.",
    "protocol": "A set of rules that govern how data is transmitted and received over a network.",
    "server": "A computer that provides services, data, or programs to other computers over a network.",
    "URL": "Uniform Resource Locator – the web address that specifies the location of a resource on the internet."
  };

  // Word complexity levels - words that might be difficult for different reading levels
  const complexWords = {
    elementary: ["utilize", "facilitate", "demonstrate", "significant", "appropriate", "establish", "determine", "individual"],
    middle: ["synthesize", "methodology", "phenomenon", "demonstrate", "constitute", "preliminary", "substantial"],
    high: ["paradigm", "dichotomy", "quintessential", "ubiquitous", "empirical", "exponential", "hypothetical"]
  };

  // Simple word replacements for easier reading
  const wordReplacements = {
    "utilize": "use",
    "facilitate": "help",
    "demonstrate": "show",
    "significant": "important",
    "appropriate": "right",
    "establish": "set up",
    "determine": "find out",
    "individual": "person",
    "consequently": "so",
    "furthermore": "also",
    "nevertheless": "but",
    "subsequently": "then",
    "approximately": "about",
    "initiate": "start",
    "terminate": "end",
    "acquire": "get",
    "comprehend": "understand",
    "implement": "put into action"
  };

  // Function to replace complex words with simpler alternatives
  function simplifyWords(text) {
    let simplifiedText = text;
    Object.entries(wordReplacements).forEach(([complex, simple]) => {
      const regex = new RegExp(`\\b${complex}\\b`, 'gi');
      simplifiedText = simplifiedText.replace(regex, simple);
    });
    return simplifiedText;
  }

  // Function to add tooltips to jargon terms
  function addJargonTooltips(textNode) {
    if (!textNode.nodeValue) return;

    let text = textNode.nodeValue;
    let hasJargon = false;

    Object.entries(jargonDictionary).forEach(([term, definition]) => {
      const regex = new RegExp(`\\b${term}\\b`, 'gi');
      if (regex.test(text)) {
        hasJargon = true;
      }
    });

    if (hasJargon) {
      const span = document.createElement('span');
      span.innerHTML = text;

      Object.entries(jargonDictionary).forEach(([term, definition]) => {
        const regex = new RegExp(`\\b(${term})\\b`, 'gi');
        span.innerHTML = span.innerHTML.replace(regex, 
          `<span class="explain-tooltip" title="${definition}">$1</span>`
        );
      });

      textNode.parentNode.replaceChild(span, textNode);
    }
  }

  // Function to simplify text content
  function simplifyTextContent(container) {
    const walker = document.createTreeWalker(
      container,
      NodeFilter.SHOW_TEXT,
      {
        acceptNode: function(node) {
          // Skip script, style, and other non-content elements
          const parent = node.parentNode;
          if (parent && ['SCRIPT', 'STYLE', 'NOSCRIPT', 'TEXTAREA', 'INPUT'].includes(parent.nodeName)) {
            return NodeFilter.FILTER_REJECT;
          }
          return NodeFilter.FILTER_ACCEPT;
        }
      },
      false
    );

    let node;
    const textNodes = [];

    // Collect all text nodes first to avoid modification during traversal
    while ((node = walker.nextNode())) {
      textNodes.push(node);
    }

    // Process each text node
    textNodes.forEach(textNode => {
      if (textNode.nodeValue && textNode.nodeValue.trim()) {
        // Add jargon tooltips
        addJargonTooltips(textNode);

        // Simplify the text
        const originalText = textNode.nodeValue;
        const simplifiedText = simplifyWords(originalText);

        // Break long sentences
        const sentences = simplifiedText.split(/(?<=[.!?])\s+/);
        if (sentences.length > 1) {
          const processedText = sentences
            .map(sentence => sentence.trim())
            .filter(sentence => sentence.length > 0)
            .join('.\n') + (simplifiedText.endsWith('.') ? '' : '.');

          textNode.nodeValue = processedText;
        } else {
          textNode.nodeValue = simplifiedText;
        }
      }
    });
  }

  // Function to check if page content is complex
  function analyzePageComplexity() {
    const bodyText = document.body.innerText || '';
    const words = bodyText.split(/\s+/).filter(word => word.length > 0);

    // Check for long words (>12 characters)
    const longWords = words.filter(word => word.length > 12);

    // Check for jargon terms
    const jargonMatches = Object.keys(jargonDictionary).filter(term => 
      bodyText.toLowerCase().includes(term.toLowerCase())
    );

    // Check for complex words
    const complexWordMatches = Object.values(complexWords)
      .flat()
      .filter(word => bodyText.toLowerCase().includes(word.toLowerCase()));

    // Calculate complexity score
    const complexityScore = (longWords.length * 0.5) + (jargonMatches.length * 2) + (complexWordMatches.length * 1.5);

    console.log('Page Complexity Analysis:', {
      totalWords: words.length,
      longWords: longWords.length,
      jargonTerms: jargonMatches.length,
      complexWords: complexWordMatches.length,
      complexityScore: complexityScore
    });

    // Page is considered complex if score > 10 or has significant jargon
    return complexityScore > 10 || jargonMatches.length > 2;
  }

  // Function to create the explanation overlay
  function createExplanationOverlay() {
    // Remove existing overlay if present
    const existingOverlay = document.getElementById('explain-page-overlay');
    if (existingOverlay) {
      existingOverlay.remove();
      return;
    }

    // Create overlay container
    const overlay = document.createElement('div');
    overlay.id = 'explain-page-overlay';
    overlay.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100vw;
      height: 100vh;
      background: rgba(0, 0, 0, 0.9);
      z-index: 999999;
      display: flex;
      flex-direction: column;
      padding: 20px;
      box-sizing: border-box;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif;
      overflow: hidden;
    `;

    // Create header with title and close button
    const header = document.createElement('div');
    header.style.cssText = `
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 20px;
      color: white;
    `;

    const title = document.createElement('h2');
    title.textContent = 'Page Explanation - Simplified View';
    title.style.cssText = 'margin: 0; font-size: 24px; color: #2d89ef;';

    const closeButton = document.createElement('button');
    closeButton.textContent = '✖ Close';
    closeButton.style.cssText = `
      background: #2d89ef;
      color: white;
      border: none;
      padding: 10px 20px;
      border-radius: 6px;
      cursor: pointer;
      font-size: 16px;
      font-weight: bold;
      transition: background-color 0.3s ease;
    `;
    closeButton.onmouseover = () => closeButton.style.background = '#1e5fbd';
    closeButton.onmouseout = () => closeButton.style.background = '#2d89ef';
    closeButton.onclick = () => overlay.remove();

    header.appendChild(title);
    header.appendChild(closeButton);

    // Create content container with side-by-side layout
    const contentContainer = document.createElement('div');
    contentContainer.style.cssText = `
      display: flex;
      gap: 20px;
      flex: 1;
      overflow: hidden;
    `;

    // Original content panel
    const originalPanel = document.createElement('div');
    originalPanel.style.cssText = `
      flex: 1;
      background: white;
      border-radius: 8px;
      padding: 20px;
      overflow-y: auto;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
    `;

    const originalTitle = document.createElement('h3');
    originalTitle.textContent = 'Original Content';
    originalTitle.style.cssText = 'margin-top: 0; color: #333; border-bottom: 2px solid #eee; padding-bottom: 10px;';

    const originalContent = document.createElement('div');
    originalContent.innerHTML = document.body.innerHTML;

    originalPanel.appendChild(originalTitle);
    originalPanel.appendChild(originalContent);

    // Simplified content panel
    const simplifiedPanel = document.createElement('div');
    simplifiedPanel.style.cssText = `
      flex: 1;
      background: #f8f9ff;
      border-radius: 8px;
      padding: 20px;
      overflow-y: auto;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
    `;

    const simplifiedTitle = document.createElement('h3');
    simplifiedTitle.textContent = 'Simplified Content';
    simplifiedTitle.style.cssText = 'margin-top: 0; color: #2d89ef; border-bottom: 2px solid #2d89ef; padding-bottom: 10px;';

    const simplifiedContent = document.createElement('div');
    simplifiedContent.innerHTML = '<p style="color: #666; font-style: italic;">Processing and simplifying content...</p>';

    simplifiedPanel.appendChild(simplifiedTitle);
    simplifiedPanel.appendChild(simplifiedContent);

    // Assemble the overlay
    contentContainer.appendChild(originalPanel);
    contentContainer.appendChild(simplifiedPanel);

    overlay.appendChild(header);
    overlay.appendChild(contentContainer);

    document.body.appendChild(overlay);

    // Process simplified content after a short delay for better UX
    setTimeout(() => {
      const tempContainer = document.createElement('div');
      tempContainer.innerHTML = document.body.innerHTML;

      // Remove the overlay from temp container to avoid processing it
      const tempOverlay = tempContainer.querySelector('#explain-page-overlay');
      if (tempOverlay) tempOverlay.remove();

      simplifyTextContent(tempContainer);
      simplifiedContent.innerHTML = tempContainer.innerHTML;

      // Remove any remaining overlay elements from simplified content
      const remainingOverlays = simplifiedContent.querySelectorAll('#explain-page-overlay');
      remainingOverlays.forEach(el => el.remove());

    }, 1000);
  }

  // Function to create the floating help banner
  function createHelpBanner() {
    // Don't create banner if one already exists
    if (document.getElementById('explain-help-banner')) return;

    const banner = document.createElement('div');
    banner.id = 'explain-help-banner';
    banner.style.cssText = `
      position: fixed;
      bottom: 20px;
      right: 20px;
      background: linear-gradient(135deg, #2d89ef, #1e5fbd);
      color: white;
      padding: 15px 25px;
      border-radius: 25px;
      box-shadow: 0 6px 20px rgba(45, 137, 239, 0.4);
      cursor: pointer;
      z-index: 999998;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif;
      font-size: 14px;
      font-weight: 500;
      user-select: none;
      transition: all 0.3s ease;
      max-width: 280px;
      line-height: 1.4;
    `;

    banner.innerHTML = `
      <div style="display: flex; align-items: center; gap: 10px;">
        <span style="font-size: 18px;">💡</span>
        <span>This page looks complex! Click to get a simplified explanation.</span>
      </div>
    `;

    // Add hover effects
    banner.onmouseenter = () => {
      banner.style.transform = 'translateY(-2px)';
      banner.style.boxShadow = '0 8px 25px rgba(45, 137, 239, 0.6)';
    };

    banner.onmouseleave = () => {
      banner.style.transform = 'translateY(0)';
      banner.style.boxShadow = '0 6px 20px rgba(45, 137, 239, 0.4)';
    };

    banner.onclick = () => {
      createExplanationOverlay();
      banner.remove();
    };

    document.body.appendChild(banner);

    // Auto-hide banner after 15 seconds
    setTimeout(() => {
      if (banner.parentElement) {
        banner.style.opacity = '0';
        setTimeout(() => banner.remove(), 300);
      }
    }, 15000);
  }

  // Listen for messages from popup
  window.addEventListener('explain-page-request', () => {
    createExplanationOverlay();
  });

  // Main initialization
  function initializeExtension() {
    // Wait for page to be fully loaded
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', initializeExtension);
      return;
    }

    // Skip certain pages
    const skipDomains = ['chrome://', 'chrome-extension://', 'moz-extension://', 'about:'];
    if (skipDomains.some(domain => window.location.href.startsWith(domain))) {
      return;
    }

    // Analyze page complexity
    setTimeout(() => {
      if (analyzePageComplexity()) {
        createHelpBanner();
      }
    }, 2000); // Wait 2 seconds after page load to analyze
  }

  // Initialize the extension
  initializeExtension();
}
