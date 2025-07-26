# 🚀 Quick Installation Guide

## Prerequisites
- Google Chrome browser (version 88+)
- Basic computer skills
- Internet connection (for initial download only)

## Step-by-Step Installation

### 1. Download the Extension
- Extract the ZIP file to a folder on your computer
- Remember the folder location (e.g., Downloads/explain-this-page-extension)

### 2. Add Extension Icons
**IMPORTANT**: You need to add the 3 icon files to the `icons/` folder:
- Copy `icon16.png` to `icons/icon16.png`
- Copy `icon48.png` to `icons/icon48.png`  
- Copy `icon128.png` to `icons/icon128.png`

The icons are provided separately and must be added before installation.

### 3. Open Chrome Extensions Page
- Open Google Chrome
- Go to `chrome://extensions/` in the address bar
- OR: Menu → More tools → Extensions

### 4. Enable Developer Mode
- Look for "Developer mode" toggle in the top right
- Click to enable it
- New buttons will appear: "Load unpacked", "Pack extension", "Update"

### 5. Load the Extension
- Click "Load unpacked" button
- Navigate to your extracted folder
- Select the `explain-this-page-extension` folder
- Click "Select Folder" or "Open"

### 6. Verify Installation
- The extension should appear in your extensions list
- Look for the 📚 icon in your Chrome toolbar
- If successful, you'll see "Explain This Page" with version 1.0.0

### 7. Test the Extension
- Visit any complex webpage (try Wikipedia)
- Look for a notification: "This page looks complex!"
- Click "Explain It!" to test functionality
- OR click the extension icon and select "Explain Current Page"

## Troubleshooting Installation

### Extension Not Loading
**Error**: "Could not load extension"
**Solution**: 
- Check that all files are present in the folder
- Ensure `manifest.json` is in the root directory
- Verify all icon files are in the `icons/` folder

### Icons Not Displaying
**Problem**: Extension loads but no icons show
**Solution**:
- Make sure all 3 PNG files are in the `icons/` folder
- Check file names exactly match: `icon16.png`, `icon48.png`, `icon128.png`
- Reload the extension after adding icons

### Permission Errors  
**Problem**: Extension requests unexpected permissions
**Solution**:
- Review the permissions in `manifest.json`
- All requested permissions are necessary for functionality
- Chrome will show what the extension can access

### Cannot Load on Certain Pages
**Expected**: Extension won't work on:
- Chrome system pages (`chrome://`)
- Extension pages (`chrome-extension://`)
- Some secure pages (banking, etc.)
- This is normal browser security behavior

## Quick Start After Installation

1. **First Use**: Click the extension icon to open settings
2. **Configure**: Set your preferred reading level
3. **Test**: Visit a complex webpage like a Wikipedia article
4. **Explore**: Try the different features and settings

## Uninstalling

To remove the extension:
1. Go to `chrome://extensions/`
2. Find "Explain This Page"
3. Click "Remove"
4. Confirm removal
5. Delete the extension folder from your computer

## Getting Help

If you encounter issues:
1. Check this guide first
2. Read the full README.md for detailed information
3. Try disabling other extensions temporarily
4. Contact support: support@explainthispage.com

---

**Installation time**: ~2 minutes  
**Difficulty**: Beginner-friendly  
**Requirements**: Chrome browser only
