# Explain This Page - Chrome Extension v2.0

## 🎯 Overview
"Explain This Page" is a powerful Chrome extension designed to help students, researchers, and non-experts understand complex or technical web pages by automatically simplifying language, explaining jargon, and breaking down difficult concepts into easily digestible content.

## ✨ Key Features

### 🔍 Smart Content Detection
- Automatically identifies complex pages based on word length, jargon density, and sentence structure
- Uses advanced algorithms to detect technical content that may benefit from simplification
- Customizable complexity thresholds for different user needs

### 📖 Advanced Text Simplification
- **35+ Jargon Dictionary**: Comprehensive definitions for technical, academic, and business terms
- **Word Replacement**: Replaces complex words with simpler alternatives (e.g., "utilize" → "use")
- **Sentence Breaking**: Splits long, complex sentences into shorter, more readable ones
- **Three Reading Levels**: Elementary, Middle School, and High School complexity levels

### 🎨 Professional User Interface
- **Floating Banner**: Elegant notification system for complex pages
- **Dual-View Overlay**: Side-by-side comparison of original and simplified content
- **Interactive Tooltips**: Hover over technical terms for instant definitions
- **Responsive Design**: Works perfectly on all screen sizes
- **Modern Styling**: Professional gradient designs and smooth animations

### ⚙️ Customizable Settings
- **Reading Level Selection**: Choose your preferred complexity level
- **Auto-Detection Toggle**: Enable/disable automatic page scanning
- **Usage Statistics**: Track pages explained and words simplified
- **Persistent Settings**: All preferences saved across browser sessions

### 🔧 Multiple Access Methods
- **Automatic Mode**: Banner appears automatically on complex pages
- **Manual Mode**: Click extension icon to explain any page
- **Context Menu**: Right-click selected text for instant explanations
- **Keyboard Shortcuts**: Quick access to explanation features

## 🚀 Installation Instructions

### Method 1: Manual Installation (Recommended for Testing)
1. **Download**: Extract the extension files to a folder named `explain-this-page-extension`
2. **Add Icons**: Place your PNG icon files (16x16, 48x48, 128x128) in the `icons/` folder
3. **Open Chrome**: Navigate to `chrome://extensions/`
4. **Developer Mode**: Enable the toggle in the top-right corner
5. **Load Extension**: Click "Load unpacked" and select your extension folder
6. **Verify**: Look for the extension icon in your Chrome toolbar

### Method 2: Icon Requirements
Create or download three PNG icons with transparent backgrounds:
- `icon16.png` - 16×16 pixels (toolbar icon)
- `icon48.png` - 48×48 pixels (extension management)
- `icon128.png` - 128×128 pixels (Chrome Web Store)

## 📱 How to Use

### Automatic Detection
1. Visit any complex website (Wikipedia, academic papers, technical documentation)
2. Look for the blue "Explain This Page" banner in the bottom-right corner
3. Click the banner to open the explanation overlay
4. Compare original and simplified content side-by-side

### Manual Explanation
1. Click the extension icon in your Chrome toolbar
2. Select your preferred reading level (Elementary/Middle School/High School)
3. Click "Explain Current Page" to start the simplification process
4. View results in the full-screen overlay

### Text Selection Method
1. Select any text on a webpage
2. Right-click and choose "Explain selected text"
3. View instant explanation in a popup window

### Settings Configuration
- **Reading Level**: Adjust complexity (Elementary = simplest, High School = most advanced)
- **Auto-Detect**: Toggle automatic scanning of pages
- **Statistics**: View your usage history and progress

## 🎓 Educational Benefits

### For Students
- **Homework Help**: Understand complex textbook material and online resources
- **Research Assistance**: Make academic papers and journals more accessible
- **Vocabulary Building**: Learn new terms through contextual definitions
- **Reading Comprehension**: Improve understanding through simplified explanations

### For Educators
- **Lesson Planning**: Adapt complex materials for different grade levels
- **Differentiated Learning**: Provide appropriate content for diverse learners
- **Assessment Preparation**: Help students understand test materials
- **Digital Literacy**: Teach students to navigate complex online content

### For General Users
- **News Articles**: Understand complex political, economic, or scientific news
- **Technical Documentation**: Make software manuals and guides accessible
- **Legal Documents**: Simplify contracts, terms of service, and legal text
- **Medical Information**: Understand health articles and medical terminology

## 🔧 Technical Specifications

### System Requirements
- **Browser**: Chrome 88+ or any Chromium-based browser
- **Manifest**: Version 3 (latest Chrome extension standard)
- **Permissions**: Minimal required permissions for security
- **Storage**: Local storage only (no data collection)

### Architecture
- **Background Service Worker**: Handles context menus and messaging
- **Content Scripts**: Analyzes and modifies webpage content
- **Popup Interface**: Provides user controls and settings
- **Storage API**: Saves preferences and usage statistics locally

### Performance
- **Memory Usage**: Optimized for minimal impact (~5MB)
- **Page Load**: No noticeable delay on page loading
- **Processing Speed**: Real-time text analysis and simplification
- **Compatibility**: Works on 99% of websites

## 🛠️ Troubleshooting Guide

### Common Issues

#### Extension Not Loading
- **Solution**: Ensure all files are in the correct folder structure
- **Check**: Icons must be present in the `icons/` folder
- **Verify**: Enable Developer Mode in Chrome extensions

#### Banner Not Appearing
- **Cause**: Page may not be complex enough to trigger detection
- **Solution**: Use manual mode via extension icon
- **Alternative**: Check if auto-detect is enabled in settings

#### Text Not Simplifying
- **Cause**: Some websites have strict security policies
- **Solution**: Refresh the page and try again
- **Workaround**: Use text selection method for specific passages

#### Popup Not Opening
- **Cause**: Extension may not be properly installed
- **Solution**: Reload the extension from chrome://extensions/
- **Check**: Ensure all required permissions are granted

### Advanced Troubleshooting
- **Console Logs**: Check browser console for error messages
- **Extension Inspector**: Use Chrome DevTools to debug issues
- **Safe Mode**: Try disabling other extensions temporarily
- **Fresh Install**: Remove and reinstall the extension

## 📊 Usage Statistics

The extension tracks the following statistics locally:
- **Pages Explained**: Total number of pages processed
- **Words Simplified**: Count of complex words replaced
- **Last Used**: Timestamp of most recent usage
- **Reading Level**: Most commonly used complexity setting

*Note: All statistics are stored locally and never shared externally.*

## 🔒 Privacy & Security

### Data Protection
- **No Data Collection**: Extension doesn't track or store personal information
- **Local Processing**: All text analysis happens in your browser
- **No External Requests**: No data sent to external servers
- **Minimal Permissions**: Only requests necessary permissions

### Security Features
- **Manifest V3**: Uses latest Chrome security standards
- **Content Security Policy**: Prevents malicious code injection
- **Sandboxed Execution**: Isolated from other browser processes
- **Regular Updates**: Security patches and improvements

## 🚀 Future Development Roadmap

### Version 2.1 (Planned)
- **AI Integration**: Advanced natural language processing
- **Multi-Language Support**: Support for Spanish, French, German
- **Voice Reading**: Text-to-speech for explained content
- **Export Options**: Save simplified content as PDF/Word

### Version 2.2 (Planned)
- **Collaborative Features**: Share simplified pages with others
- **Custom Dictionaries**: Add your own term definitions
- **Learning Progress**: Track vocabulary improvement over time
- **Integration APIs**: Connect with educational platforms

### Long-term Goals
- **Mobile Support**: Extension for mobile browsers
- **Offline Mode**: Work without internet connection
- **Advanced Analytics**: Detailed reading comprehension insights
- **Teacher Dashboard**: Classroom management features

## 🤝 Contributing

We welcome contributions from the community! Here's how you can help:

### Code Contributions
- **Bug Fixes**: Report and fix issues
- **Feature Development**: Add new functionality
- **Performance Optimization**: Improve speed and efficiency
- **Documentation**: Enhance guides and help content

### Content Contributions
- **Jargon Dictionary**: Add new term definitions
- **Translation**: Help with multi-language support
- **Testing**: Test on different websites and scenarios
- **Feedback**: Provide user experience insights

## 📝 Changelog

### Version 2.0 (Current)
- ✅ Fixed Chrome Manifest V3 compatibility
- ✅ Enhanced text simplification with 35+ jargon terms
- ✅ Professional UI with gradient designs and animations
- ✅ Comprehensive usage statistics and settings
- ✅ Improved error handling and performance
- ✅ Context menu integration for selected text
- ✅ Responsive design for all screen sizes

### Version 1.0 (Previous)
- Basic text simplification
- Simple banner notification
- Limited jargon dictionary
- Basic popup interface

## 📞 Support & Feedback

### Getting Help
- **Documentation**: Refer to this comprehensive README
- **Common Issues**: Check the troubleshooting section
- **Community Support**: Share experiences with other users


### Contact Information
- **Email**: subhamchauhan1310@gmail.com
- **GitHub**: [github.com/explain-this-page](https://github.com/ssupshub)
=======
### Reporting Issues
- **Bug Reports**: Provide detailed steps to reproduce
- **Feature Requests**: Suggest improvements and new features
- **Performance Issues**: Report slow or problematic behavior


## 📄 License

This project is open-source and available under the MIT License. Feel free to modify, distribute, and use for educational purposes.

## 🙏 Acknowledgments

- **Chrome Extension APIs**: Google Chrome development team
- **Design Inspiration**: Modern web application interfaces
- **Educational Research**: Studies on reading comprehension and accessibility
- **Community Feedback**: Users who provided valuable testing and suggestions

---

**Made with ❤️ for better web accessibility and education**

*Last updated: August 2025*
*Version: 2.0*
*Chrome Extension Manifest: V3*
