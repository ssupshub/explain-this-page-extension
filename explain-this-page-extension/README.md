# Explain This Page - Chrome Extension

![Version](https://img.shields.io/badge/version-1.0-blue.svg)
![Chrome Web Store](https://img.shields.io/badge/chrome-extension-brightgreen.svg)
![Manifest](https://img.shields.io/badge/manifest-v3-orange.svg)

## 🎯 Overview

**Explain This Page** is a powerful Chrome extension designed to help students, non-experts, and anyone struggling with complex web content. The extension automatically detects difficult pages and provides simplified explanations, jargon tooltips, and side-by-side comparisons of original and simplified content.

### 🌟 Key Features

- **Smart Content Detection**: Automatically identifies complex web pages based on word length, jargon density, and sentence complexity
- **Dual-View Interface**: Side-by-side comparison of original and simplified content
- **Jargon Tooltips**: Hover over technical terms to see easy-to-understand definitions
- **Reading Level Customization**: Choose between Elementary, Middle School, and High School complexity levels
- **Context Menu Integration**: Right-click selected text for instant explanations
- **Usage Statistics**: Track your learning progress with built-in analytics
- **Auto-Detection**: Optional automatic scanning of complex pages
- **Modern UI**: Clean, accessible interface with dark mode support

## 📦 Installation Guide

### Method 1: Direct Installation (Recommended)

1. **Download the Extension**
   - Download this repository as a ZIP file
   - Extract the contents to a folder named `explain-this-page-extension`

2. **Add Extension Icons**
   - Create three PNG icon files and place them in the `icons/` folder:
     - `icon16.png` (16×16 pixels) - Toolbar icon
     - `icon48.png` (48×48 pixels) - Extension management icon
     - `icon128.png` (128×128 pixels) - Chrome Web Store icon

3. **Load Extension in Chrome**
   - Open Chrome and navigate to `chrome://extensions/`
   - Enable "Developer mode" (toggle in top-right corner)
   - Click "Load unpacked" button
   - Select the `explain-this-page-extension` folder
   - The extension should now appear in your extensions list

4. **Verify Installation**
   - Look for the extension icon in your Chrome toolbar
   - Visit a complex website (like a technical article or research paper)
   - You should see a blue banner offering to explain the page

### Method 2: Manual File Creation

If you prefer to create the files manually:

1. Create a new folder: `explain-this-page-extension`
2. Copy all the code files from this repository into the folder
3. Create the `icons` subfolder and add your PNG icons
4. Follow steps 3-4 from Method 1 above

## 🚀 How to Use

### Basic Usage

1. **Automatic Detection**
   - Visit any web page
   - If the page is detected as complex, a blue banner will appear
   - Click the banner to open the explanation overlay

2. **Manual Activation**
   - Click the extension icon in your toolbar
   - Click "Explain Current Page" in the popup
   - The overlay will open with simplified content

3. **Text Selection**
   - Select any text on a webpage
   - Right-click and choose "Explain selected text"
   - A popup will show a simplified explanation

### Advanced Features

#### Customizing Reading Level
- Click the extension icon to open the popup
- Select your preferred reading level:
  - **Elementary School**: Simplest explanations
  - **Middle School**: Moderate complexity (default)
  - **High School**: More detailed but still accessible

#### Using the Overlay Interface
- **Original Content** (left panel): Shows the original webpage
- **Simplified Content** (right panel): Shows the processed, simplified version
- **Jargon Tooltips**: Hover over highlighted terms for definitions
- **Close Button**: Click the X to close the overlay

#### Settings Configuration
- **Auto-detect complex pages**: Automatically show banners on difficult content
- **Show jargon tooltips**: Enable/disable term definitions on hover

## 🔧 Technical Specifications

### System Requirements
- **Browser**: Google Chrome 88+ or Chromium-based browsers
- **Permissions**: scripting, activeTab, storage, contextMenus
- **Manifest Version**: 3 (latest Chrome extension standard)

### Architecture Overview
- **Background Script**: Handles context menus and extension lifecycle
- **Content Script**: Analyzes pages and injects simplification interface
- **Popup Interface**: User settings and manual controls
- **Storage**: Local and sync storage for settings and statistics

### File Structure
```
explain-this-page-extension/
├── manifest.json          # Extension configuration
├── background.js          # Background service worker
├── content.js            # Main content analysis and UI
├── content.css           # Styling for injected elements
├── popup.html            # Extension popup interface
├── popup.js              # Popup functionality
├── popup.css             # Popup styling
├── README.md             # This documentation
└── icons/                # Extension icons
    ├── icon16.png        # 16x16 toolbar icon
    ├── icon48.png        # 48x48 management icon
    └── icon128.png       # 128x128 store icon
```

### Technologies Used
- **JavaScript ES6+**: Core functionality and DOM manipulation
- **HTML5**: Extension interface and content overlays
- **CSS3**: Modern styling with gradients, animations, and responsive design
- **Chrome Extension APIs**: Manifest V3, storage, scripting, contextMenus
- **Web APIs**: MutationObserver, custom events, TreeWalker

## 🐛 Troubleshooting

### Common Issues

#### Extension Won't Load
- **Problem**: "Manifest file is missing or unreadable"
- **Solution**: Ensure `manifest.json` is in the root folder and properly formatted
- **Check**: Verify all commas and brackets are correctly placed in JSON

#### No Banner Appears on Pages
- **Problem**: Complex pages don't show the help banner
- **Solution**: 
  - Check if auto-detection is enabled in extension popup
  - Try manually clicking "Explain Current Page" in the popup
  - Some pages may not be complex enough to trigger detection

#### Icons Not Displaying
- **Problem**: Extension shows default icon or broken images
- **Solution**: 
  - Ensure PNG files are exactly named: `icon16.png`, `icon48.png`, `icon128.png`
  - Check that files are in the `icons/` folder
  - Verify PNG files are valid and not corrupted

#### Extension Doesn't Work on Certain Sites
- **Problem**: Some websites block the extension
- **Solution**: 
  - This is normal for sites with strict Content Security Policies
  - Try refreshing the page
  - Check browser console for error messages

#### Performance Issues
- **Problem**: Pages load slowly after installing extension
- **Solution**: 
  - Disable auto-detection in extension settings
  - Only use manual activation on pages you need explained
  - Clear browser cache and reload extension

### Debug Mode

To enable debug mode for troubleshooting:

1. Open Chrome DevTools (F12)
2. Go to Console tab
3. Look for messages starting with "Explain This Page:"
4. Check for any error messages in red

### Getting Help

If you encounter issues not covered here:

1. **Check Browser Console**: Look for JavaScript errors
2. **Verify Permissions**: Ensure extension has necessary permissions
3. **Test on Different Pages**: Try various websites to isolate the issue
4. **Reload Extension**: Go to `chrome://extensions/` and click the reload button

## 🔄 Future Development Roadmap

### Version 1.1 (Planned)
- [ ] AI-powered explanations using OpenAI API
- [ ] Multi-language support (Spanish, French, German)
- [ ] Export simplified pages to PDF
- [ ] Enhanced complexity analysis algorithms

### Version 1.2 (Planned)
- [ ] Text-to-speech functionality
- [ ] Collaborative features for sharing explanations
- [ ] Integration with educational platforms
- [ ] Advanced customization options

### Version 2.0 (Future)
- [ ] Machine learning-based content analysis
- [ ] Personalized difficulty adaptation
- [ ] Cloud sync across devices
- [ ] Teacher/student dashboard features

## 📊 Privacy & Data Usage

### What We Collect
- **Settings**: Reading level preferences and feature toggles (stored locally)
- **Statistics**: Number of pages explained and terms simplified (stored locally)
- **No Personal Data**: We don't collect browsing history, personal information, or page content

### What We Don't Do
- **No Tracking**: No analytics or tracking cookies
- **No Data Transmission**: All processing happens locally in your browser
- **No Account Required**: Extension works completely offline after installation

### Data Storage
- **Local Storage**: Settings and statistics are stored only on your device
- **Chrome Sync**: Settings can optionally sync across your Chrome browsers
- **No External Servers**: No data is sent to external servers or third parties

## 🤝 Contributing

We welcome contributions to improve the extension! Here's how you can help:

### Reporting Issues
1. Check existing issues first
2. Provide detailed steps to reproduce
3. Include browser version and extension version
4. Add screenshots if applicable

### Code Contributions
1. Fork the repository
2. Create a feature branch
3. Make your changes with clear commit messages
4. Test thoroughly on different websites
5. Submit a pull request with description

### Improvement Ideas
- Better complexity detection algorithms
- Additional language simplifications
- UI/UX enhancements
- Performance optimizations
- Accessibility improvements

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 📞 Support

For support, questions, or suggestions:

- **GitHub Issues**: Report bugs and request features
- **Email**: Contact the development team
- **Chrome Web Store**: Leave reviews and ratings

---

**Made with ❤️ for students and lifelong learners everywhere**

*"Making complex content accessible to everyone, one page at a time."*

## 📈 Changelog

### Version 1.0 (Current)
- ✅ Initial release
- ✅ Smart content detection
- ✅ Dual-view overlay interface
- ✅ Jargon tooltips with definitions
- ✅ Three reading levels
- ✅ Context menu integration
- ✅ Usage statistics tracking
- ✅ Chrome Manifest V3 compliance
- ✅ Responsive design with accessibility features
- ✅ Dark mode support

---

**Total Documentation Size**: ~15KB of comprehensive guides and technical details
**Installation Time**: ~5 minutes
**Learning Curve**: Beginner-friendly with advanced options available
