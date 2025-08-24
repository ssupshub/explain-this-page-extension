# 🚀 Installation Guide - Explain This Page v3.0

## Quick Start (5 minutes)

### Step 1: Download Extension Files
- Ensure you have all extension files in a single folder
- Required files: `manifest.json`, `background.js`, `content.js`, `content.css`, `popup.html`, `popup.js`, `popup.css`, and `icons/` folder

### Step 2: Install in Chrome

1. **Open Chrome Extensions Page**
   - Type `chrome://extensions/` in the address bar
   - Or: Chrome Menu → More Tools → Extensions

2. **Enable Developer Mode**
   - Toggle the "Developer mode" switch in the top-right corner
   - This allows loading unpacked extensions

3. **Load the Extension**
   - Click "Load unpacked" button
   - Navigate to and select your extension folder
   - Click "Select Folder"

4. **Verify Installation**
   - Look for "Explain This Page - AI Simplifier" in the extensions list
   - Check that it shows "Enabled" status
   - The brain icon (🧠) should appear in your Chrome toolbar

### Step 3: Test the Extension

1. **Open Test Page**
   - Navigate to `file:///path/to/your/extension/test.html`
   - Or visit any complex webpage (Wikipedia, academic articles)

2. **Check Auto-Detection**
   - Wait 1-2 seconds for the complexity analysis
   - A beautiful banner should appear in the bottom-right corner
   - If not, click the extension icon to manually trigger

3. **Try the Features**
   - Click the banner to open the explanation overlay
   - Try different reading levels in the popup
   - Right-click text to use context menu options

## Troubleshooting

### Extension Won't Load
- **Error: "Manifest file is missing or unreadable"**
  - Ensure `manifest.json` is in the root folder
  - Check that the JSON syntax is valid

- **Error: "Could not load icon"**
  - Verify PNG files exist in `icons/` folder
  - Files needed: `icon16.png`, `icon48.png`, `icon128.png`

### No Banner Appearing
- Check if auto-detection is enabled in popup settings
- Try on different websites with complex content
- Open Developer Tools (F12) and check console for errors

### Popup Not Working
- Right-click the extension icon → "Inspect popup"
- Check console for JavaScript errors
- Try refreshing the extension

## Advanced Configuration

### For Developers
```bash
# Enable debug mode
# Edit content.js and change:
const CONFIG = {
  debug: true,  # Change to true
  # ...
}
```

### Extension Permissions
- **scripting**: Modify page content for simplification
- **activeTab**: Access current tab when extension is clicked
- **storage**: Save user preferences and statistics
- **contextMenus**: Add right-click options

### File Structure Verification
```
your-extension-folder/
├── manifest.json       ✓ Required
├── background.js       ✓ Required
├── content.js          ✓ Required
├── content.css         ✓ Required
├── popup.html          ✓ Required
├── popup.js            ✓ Required
├── popup.css           ✓ Required
├── icons/
│   ├── icon16.png      ✓ Required
│   ├── icon48.png      ✓ Required
│   └── icon128.png     ✓ Required
├── test.html           ○ Optional (for testing)
└── README.md           ○ Optional
```

## Support

If you encounter issues:
1. Check the troubleshooting section above
2. Open browser console (F12) and look for error messages
3. Try disabling other extensions that might conflict
4. Contact support with specific error messages

---

**Ready to simplify the web! 🧠✨**
