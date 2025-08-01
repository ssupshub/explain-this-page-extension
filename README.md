# 📖 Explain This Page - Chrome Extension v2.0

A powerful Chrome extension that simplifies complex web pages for students and non-experts by explaining jargon, breaking down sentences, and providing different reading levels.

## 🚀 Features

### ✅ **Text Simplification Engine**
- **35+ Jargon Dictionary**: Technical, academic, business, and medical terms with clear definitions
- **30+ Word Simplifications**: Complex words replaced with simpler alternatives (utilize→use, demonstrate→show)
- **Smart Sentence Breaking**: Long sentences split at conjunctions and commas for better readability
- **Three Reading Levels**: Elementary, Middle School, and High School complexity settings

### ✅ **Smart Detection System**
- **Automatic Complexity Detection**: Analyzes pages for long words, jargon density, and sentence length
- **Floating Help Banner**: Appears automatically on complex pages
- **Manual Override**: Use extension popup to explain any page
- **Context Menu**: Right-click selected text for instant explanations

### ✅ **Professional Interface**
- **Dual-View Overlay**: Side-by-side comparison of original and simplified content
- **Interactive Tooltips**: Hover over technical terms for definitions
- **Modern UI Design**: Gradient backgrounds, smooth animations, glassmorphism effects
- **Responsive Layout**: Works on desktop and mobile browsers
- **Accessibility Features**: High contrast, keyboard navigation, screen reader support

### ✅ **Advanced Features**
- **Usage Statistics**: Track pages explained and words simplified
- **Settings Persistence**: Preferences saved across browser sessions
- **Performance Optimized**: Minimal memory usage, efficient text processing
- **Privacy Focused**: No data collection, all processing happens locally
- **Chrome Manifest V3**: Latest security standards and API compliance

## 🛠️ Installation

### Method 1: Load Unpacked Extension (Recommended)
1. **Download**: Extract this extension package to a folder
2. **Add Icons**: Place your PNG icon files in the `icons/` folder:
   - `icon16.png` (16×16 pixels)
   - `icon48.png` (48×48 pixels)
   - `icon128.png` (128×128 pixels)
3. **Open Chrome Extensions**: Navigate to `chrome://extensions/`
4. **Enable Developer Mode**: Toggle the switch in the top-right corner
5. **Load Extension**: Click "Load unpacked" and select your extension folder
6. **Verify**: Look for the extension icon in your Chrome toolbar

### Method 2: Package for Distribution
1. Follow steps 1-2 above
2. Click "Pack extension" in Chrome extensions page
3. Select your extension folder
4. Generate .crx file for distribution

## 📖 How to Use

### 🔄 **Automatic Mode**
1. **Browse normally** - Visit any website
2. **Look for banner** - Blue notification appears on complex pages
3. **Click to explain** - Banner opens simplification overlay
4. **Compare content** - Original and simplified versions side-by-side
5. **Hover for definitions** - Technical terms show tooltips

### 🎯 **Manual Mode**
1. **Click extension icon** - Open popup interface
2. **Select reading level** - Choose Elementary, Middle School, or High School
3. **Click "Explain Current Page"** - Force explanation of any page
4. **Adjust settings** - Toggle auto-detection on/off

### 📝 **Text Selection Mode**
1. **Select any text** - Highlight text on any webpage
2. **Right-click** - Open context menu
3. **Choose "Explain selected text"** - Get instant explanation popup

## ⚙️ Settings & Configuration

### Reading Levels
- **🌟 Elementary**: Very simple words, short sentences (10 words max)
- **📚 Middle School**: Moderate complexity, medium sentences (15 words max)
- **🎓 High School**: Standard complexity, longer sentences (20 words max)

### Auto-Detection Options
- **Enabled**: Automatically scan pages and show banner on complex content
- **Disabled**: Only explain pages manually via popup or context menu

### Privacy Settings
- **Local Storage Only**: All settings stored locally in browser
- **No Data Collection**: No information sent to external servers
- **No Tracking**: No usage analytics or personal data gathering

## 🧪 Testing & Examples

### Recommended Test Sites
- **Wikipedia**: Technical articles (Artificial Intelligence, Quantum Computing)
- **Academic Papers**: Research journals and scientific publications
- **Technical Documentation**: Developer docs, API references, software manuals
- **Legal Documents**: Terms of service, privacy policies, contracts
- **Medical Information**: Health websites, medical research papers
- **Business Content**: Corporate reports, financial documents

### Expected Results
- **Complex pages**: Banner appears automatically within 1-2 seconds
- **Jargon terms**: Highlighted in blue with hover tooltips
- **Long sentences**: Broken into shorter, readable chunks
- **Technical words**: Replaced with simpler alternatives
- **Statistics**: Track improvements in comprehension

## 🔧 Technical Details

### File Structure
```
explain-this-page-extension/
├── manifest.json          # Extension configuration
├── background.js           # Service worker (context menus, messaging)
├── content.js             # Main functionality (13.9 KB)
├── content.css            # UI styling and animations
├── popup.html             # Extension popup interface
├── popup.js              # Popup functionality and settings
├── popup.css             # Popup styling
├── README.md             # This documentation file
└── icons/                # Extension icons
    ├── icon16.png        # 16×16 toolbar icon
    ├── icon48.png        # 48×48 management icon
    └── icon128.png       # 128×128 store icon
```

### Technology Stack
- **JavaScript ES6+**: Modern syntax with arrow functions, async/await
- **HTML5**: Semantic markup with ARIA accessibility
- **CSS3**: Flexbox, Grid, CSS variables, animations
- **Chrome APIs**: Storage, Scripting, Context Menus, Tabs
- **Manifest V3**: Latest Chrome extension standards

### Performance Metrics
- **Memory Usage**: ~2-5 MB typical, ~10 MB maximum
- **Processing Speed**: <1 second for most pages
- **Network Requests**: Zero (all processing local)
- **Storage Used**: <1 KB for settings and statistics

## 🐛 Troubleshooting

### Common Issues

#### Extension Not Loading
- **Check icons**: Ensure PNG files are in `icons/` folder with correct names
- **Verify permissions**: Extension needs `scripting`, `activeTab`, `storage`, `contextMenus`
- **Console errors**: Check `chrome://extensions/` → Details → Inspect views → background.html

#### Banner Not Appearing
- **Check auto-detect**: Ensure auto-detection is enabled in popup
- **Page complexity**: Some pages may not meet complexity threshold
- **Manual override**: Use popup "Explain Current Page" button
- **Reload page**: Refresh and wait 2-3 seconds

#### Simplification Not Working
- **Syntax error fixed**: v2.0 resolved illegal return statement
- **Content scripts**: Ensure content.js loads properly
- **Protected pages**: Cannot access chrome://, extension://, or file:// pages
- **CSP restrictions**: Some sites block content script modifications

#### Popup Issues
- **Settings not saving**: Check Chrome storage permissions
- **Statistics not updating**: Refresh popup or restart browser
- **UI problems**: Clear browser cache and reload extension

### Debug Mode
1. **Open Developer Tools**: Right-click → Inspect
2. **Check Console**: Look for "Explain This Page" log messages  
3. **Network Tab**: Verify no external requests (should be empty)
4. **Storage**: Check Local Storage for saved settings

### Reset Extension
1. **Go to**: `chrome://extensions/`
2. **Find extension**: "Explain This Page"
3. **Click Details**: → Extension options
4. **Clear data**: Remove and reload extension
5. **Restart browser**: Complete reset

## 🔄 Changelog & Version History

See `CHANGELOG.md` for detailed version history and updates.

## 🛡️ Privacy & Security

### Data Collection
- **None**: Extension collects no personal information
- **Local Only**: All settings stored in browser's local storage
- **No Tracking**: No analytics, cookies, or external requests
- **No Permissions**: Only requests minimum necessary permissions

### Security Features
- **Manifest V3**: Latest Chrome security standards
- **Content Security Policy**: Prevents injection attacks
- **Sandboxed Execution**: Isolated from other extensions
- **No External URLs**: All code runs locally

### Permissions Explained
- **`scripting`**: Inject content scripts to modify page text
- **`activeTab`**: Access current tab content when user clicks extension
- **`storage`**: Save user preferences and statistics locally
- **`contextMenus`**: Add right-click menu options for text selection

## 🚀 Future Development

### Planned Features (v3.0)
- **AI Integration**: Advanced language models for better simplification
- **Multi-Language Support**: Translations and explanations in different languages
- **Voice Features**: Text-to-speech for explanations
- **Export Options**: Save simplified content as PDF or Word documents
- **Collaborative Features**: Share simplified explanations with others
- **Learning Mode**: Quiz mode to test comprehension
- **Custom Dictionaries**: User-defined jargon and simplifications

### Technical Improvements
- **Performance**: Faster text processing algorithms
- **Accessibility**: Enhanced screen reader support
- **Mobile**: Better responsive design for mobile browsers
- **Offline**: Work without internet connection
- **Sync**: Cloud synchronization of settings across devices

## 🤝 Contributing

We welcome contributions! Here's how to help:

### Bug Reports
1. **Check existing issues** before creating new ones
2. **Provide details**: Browser version, extension version, specific pages
3. **Steps to reproduce**: Detailed instructions
4. **Console logs**: Include any error messages

### Feature Requests
1. **Search existing requests** to avoid duplicates
2. **Describe use case**: Why is this feature needed?
3. **Provide examples**: Specific scenarios where it would help
4. **Consider implementation**: Technical feasibility

### Code Contributions
1. **Fork repository** and create feature branch
2. **Follow coding standards**: Use existing code style
3. **Test thoroughly**: Verify changes work across different sites
4. **Document changes**: Update README and comments
5. **Submit pull request**: Include description of changes

## 📞 Support

### Getting Help
- **Documentation**: Start with this README
- **Troubleshooting**: Check common issues section above
- **Console Logs**: Use browser developer tools
- **Community**: Search existing discussions

<<<<<<< HEAD

### Contact Information
- **Email**: subhamchauhan1310@gmail.com
- **GitHub**: [github.com/explain-this-page](https://github.com/ssupshub)

### Reporting Issues
- **Bug Reports**: Provide detailed steps to reproduce
- **Feature Requests**: Suggest improvements and new features
- **Performance Issues**: Report slow or problematic behavior

=======
### Contact Information
- **Issues**: Report bugs and feature requests
- **Discussions**: General questions and feedback
- **Email**: Extension support contact
>>>>>>> e4f05ee (Update)

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- **Chrome Extension APIs**: Google Chrome team
- **Design Inspiration**: Modern web design trends
- **Educational Research**: Reading comprehension studies
- **User Feedback**: Beta testers and early adopters
- **Open Source**: Community contributions and suggestions

---

**Made with ❤️ for students and lifelong learners**

*Explain This Page v2.0 - Making the web more accessible, one page at a time.*