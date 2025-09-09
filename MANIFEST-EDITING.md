# Editing the Manifest in Domo

## The Issue
Domo's Pro Code Editor does **not support editing JSON files** directly. When you try to open `manifest.json` in the editor, you'll see:
> "The file type is currently not supported by the editor. Use the file explorer on the left to load a different file."

## Solutions

### Option 1: Use App Studio UI (Recommended)
1. Go to **App Studio** in Domo
2. Find your app: "Out of Stock Alerts"
3. Click **Edit** or **Configure**
4. Use the **visual interface** to edit dataset mappings, collections, etc.
5. The manifest.json will be updated automatically

### Option 2: Edit manifest-config.js (Pro Code Editor)
1. Open `manifest-config.js` in the Pro Code Editor
2. Edit the configuration object
3. Copy the changes to `manifest.json` locally
4. Publish using `domo publish`

### Option 3: Use Domo CLI (Local Development)
1. Edit `manifest.json` locally
2. Run `domo publish` to update the app
3. Changes will be reflected in Domo

## Current Manifest Structure

The manifest includes:
- **datasetsMapping**: Field mappings for product alerts dataset
- **collectionsMapping**: AppDB collection schema for acknowledged alerts
- **fullpage**: Set to true for full page display
- **packagesMapping**: Empty array for future package integrations

## Important Notes

- **Placeholder UUIDs**: Replace `00000000-0000-0000-0000-000000000000` with actual dataset ID
- **Collection ID**: Replace `00000000-0000-0000-0000-000000000001` with actual AppDB collection ID
- **Field Mappings**: Ensure column names match your actual dataset schema
- **AppDB Schema**: Update the collectionsMapping schema to match your needs

## File Types Supported by Domo Pro Code Editor

✅ **Supported:**
- JavaScript (.js)
- HTML (.html)
- CSS (.css)
- TypeScript (.ts)
- Python (.py)
- SQL (.sql)
- Markdown (.md)

❌ **Not Supported:**
- JSON (.json)
- XML (.xml)
- YAML (.yml, .yaml)
- Text (.txt) - for large files
