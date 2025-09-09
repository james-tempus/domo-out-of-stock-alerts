# DOMO OUT-OF-STOCK ALERTS APP - COMPLETE DOCUMENTATION & AI PROMPT

## ⚠️ IMPORTANT: DATASET CONFIGURATION REQUIRED ⚠️

**BEFORE USING THIS APP:**
- The app currently uses **sample data** (8 product alerts)
- To connect to a **real dataset**, you MUST replace the dataset ID in `manifest.json`
- See "Manifest Configuration" section below for detailed instructions
- Without a real dataset ID, the app will only show sample data

## OVERVIEW
This is a Domo Procode Custom App that displays out-of-stock product alerts in a Tabulator table with acknowledgment functionality. The app integrates with Domo datasets using proper SQL querying and responds to page-level filters.

## APP ARCHITECTURE

### Core Files
- `index.html` - Main HTML structure with Tabulator integration
- `app.js` - Main application logic and Tabulator table management
- `data-service.js` - Data abstraction layer for Domo/local data handling
- `styles.css` - Custom styling and Tabulator overrides
- `manifest.json` - Domo app configuration and dataset mapping
- `thumbnail.png` - App icon (300x300px required)

### Key Dependencies
- **Tabulator 6.3.1** - Table library (CDN: cdn.jsdelivr.net)
- **Domo JS API** - For dataset querying and filter listening
- **Python HTTP Server** - For local development (port 8080)

## FUNCTIONALITY

### Primary Features
1. **Data Display**: Shows product alerts in a responsive Tabulator table
2. **Acknowledgment System**: Checkbox-based acknowledgment with AppDB persistence
3. **Filter Integration**: Responds to page-level Domo filters automatically
4. **Summary Statistics**: Real-time counts (Total, Acknowledged, Pending)
5. **View Toggle**: Switch between Pending, Acknowledged, and All Items
6. **Real-time Updates**: Auto-refresh on filter changes and data updates

### Data Flow
1. App loads → DataService detects environment (Domo vs local)
2. Production: Queries Domo dataset with SQL via `domo.query()`
3. Development: Uses fallback sample data
4. Filters applied → Converts to SQL WHERE clauses
5. Data displayed in Tabulator table with acknowledgment checkboxes
6. User interactions → AppDB storage → Auto-sync to datasets

## DATASET CONFIGURATION

### Required Dataset Schema
The app expects a dataset with these columns (case-sensitive):
```sql
CREATE TABLE product_alerts (
    product_id VARCHAR(50) PRIMARY KEY,
    product_name VARCHAR(255),
    category VARCHAR(100),
    current_stock INTEGER,
    min_threshold INTEGER,
    last_restock DATE,
    priority VARCHAR(20),
    status VARCHAR(50),
    alert_date DATE,
    supplier VARCHAR(255)
);
```

### Manifest Configuration
Update `manifest.json` for new instances:

⚠️ **CRITICAL: REPLACE DATASET ID** ⚠️
The app currently uses a placeholder dataset ID. You MUST replace it with your actual dataset ID for the app to work with real data.

```json
{
  "name": "Your App Name",
  "version": "1.1.0",
  "description": "Your app description",
  "main": "index.html",
  "width": 3,
  "height": 2,
  "fileName": "manifest.json",
  "id": "YOUR_APP_ID_HERE",
  "datasetsMapping": [
    {
      "alias": "your-dataset-alias",
      "dataSetId": "REPLACE_WITH_YOUR_ACTUAL_DATASET_ID",
      "fields": [
        "product_id",
        "product_name", 
        "category",
        "current_stock",
        "min_threshold",
        "last_restock",
        "priority",
        "status",
        "alert_date",
        "supplier"
      ]
    }
  ]
}
```

**Steps to Connect Real Dataset:**
1. **Find your dataset ID** in Domo's dataset management
2. **Replace** `"REPLACE_WITH_YOUR_ACTUAL_DATASET_ID"` with the real ID
3. **Update alias** if needed (currently `"your-dataset-alias"`)
4. **Redeploy** with `domo publish`

### Column Mapping for Different Data Sources
To adapt for different datasets, update these locations:

1. **manifest.json** - Update `datasetsMapping.fields` array
2. **data-service.js** - Update `buildSQLQuery()` SELECT clause (lines 310-321)
3. **data-service.js** - Update `loadDomoData()` transformation mapping (lines 38-52)
4. **data-service.js** - Update `buildWhereConditions()` column mapping (lines 345-351)

## SUMMARY BOXES CONFIGURATION

### Current Summary Logic
Located in `app.js` `updateStats()` method (lines ~200-220):
- **Total**: Count of all items in current dataset
- **Acknowledged**: Count of items with acknowledged=true
- **Pending**: Count of items with acknowledged=false

### Customizing Summary Boxes
To change summary calculations:

1. **Modify `updateStats()` method** in `app.js`:
```javascript
updateStats() {
    const total = this.sampleData.length;
    const acknowledged = this.sampleData.filter(item => 
        this.acknowledgedAlerts.has(item.productId)
    ).length;
    const pending = total - acknowledged;
    
    // Add custom calculations here
    const highPriority = this.sampleData.filter(item => 
        item.priority === 'high'
    ).length;
    
    // Update DOM elements
    document.getElementById('total-count').textContent = total;
    document.getElementById('acknowledged-count').textContent = acknowledged;
    document.getElementById('pending-count').textContent = pending;
}
```

2. **Update HTML structure** in `index.html` if adding new summary boxes
3. **Update CSS** in `styles.css` for new box styling

## FILTER SYSTEM

### Domo Filter Integration
The app uses proper Domo JS API methods:
- `domo.onFiltersUpdate()` - Listens for page filter changes
- `domo.onDataUpdate()` - Listens for dataset updates
- `domo.filterContainer()` - Creates programmatic filters
- `domo.query()` - Executes SQL queries with filters

### Supported Filter Types
- **IN**: Multiple values (categories, priorities)
- **EQUALS**: Exact matches
- **CONTAINS**: Text search with wildcards
- **BETWEEN**: Range filters (stock levels, dates)
- **GREATER_THAN/LESS_THAN**: Numeric comparisons

### Creating Filters Programmatically
```javascript
// In app.js or data-service.js
dataService.createCategoryFilter(['Electronics', 'Office Supplies']);
dataService.createPriorityFilter(['high']);
dataService.createStatusFilter(['out-of-stock']);
dataService.createStockRangeFilter(0, 10);
dataService.createProductNameFilter('Bluetooth');
```

## TABULATOR CONFIGURATION - CRITICAL LESSONS LEARNED

### ⚠️ CRITICAL: Sorting Arrow Issues & Solutions
**Problem**: Custom CSS can break Tabulator's default sorting arrow positioning, causing arrows to stick to text instead of right-aligning to column borders.

**Root Cause**: Any CSS that changes `display`, `position`, or layout properties on `.tabulator-col-content`, `.tabulator-col-title`, or `.tabulator-col-sorter` can break the default positioning.

**DEFINITIVE SOLUTION** (tested and working):
```css
/* Restore proper sorting arrow positioning */
.tabulator .tabulator-header .tabulator-col .tabulator-col-sorter {
    position: absolute !important;
    right: 8px !important;
    top: 50% !important;
    transform: translateY(-50%) !important;
}

.tabulator .tabulator-header .tabulator-col {
    position: relative;
}

.tabulator .tabulator-header .tabulator-col .tabulator-col-title {
    padding-right: 20px; /* Ensure space for the arrow */
}
```

**AVOID**: Never use `display: flex` or `justify-content: space-between` on `.tabulator-col-content` as it breaks arrow positioning.

### ⚠️ CRITICAL: Double Border Fix
**Problem**: When using `fitColumns` layout, a double border appears on the right side of the table.

**SOLUTION** (tested and working):
```css
/* Remove border from last column using multiple selectors for reliability */
.tabulator .tabulator-header .tabulator-col:nth-child(10),
.tabulator .tabulator-row .tabulator-cell:nth-child(10),
.tabulator .tabulator-header .tabulator-col:last-of-type,
.tabulator .tabulator-row .tabulator-cell:last-of-type,
.tabulator .tabulator-header .tabulator-col[tabulator-field="acknowledged"],
.tabulator .tabulator-row .tabulator-cell[tabulator-field="acknowledged"] {
    border-right: none !important;
}
```

**Why multiple selectors**: `:last-child` alone may not work due to Tabulator's complex DOM structure.

### ⚠️ CRITICAL: Header Vertical Alignment
**Problem**: Column header text and sorting arrows are not vertically aligned.

**SOLUTION**: Use the global table option (NOT individual column properties):
```javascript
new Tabulator("#table", {
    columnHeaderVertAlign: "middle", // This is the correct property
    // ... other options
});
```

**WRONG**: `headerVertAlign: "middle"` on individual columns (this property doesn't exist).

### ⚠️ CRITICAL: Header Height Reduction
**Problem**: Default header padding is too large.

**SOLUTION**:
```css
.tabulator .tabulator-header .tabulator-col {
    padding: 4px 8px; /* Reduced from default 12px to 4px (67% reduction) */
}
```

### Current Table Setup
- **Version**: 6.3.1 (CDN: cdn.jsdelivr.net)
- **Layout**: fitColumns with responsive design
- **Height**: 400px (required for Virtual DOM)
- **Sorting**: Enabled on all columns
- **Header Alignment**: `columnHeaderVertAlign: "middle"`
- **Filtering**: Internal app filtering (Pending/Acknowledged/All)

### Column Configuration Best Practices
```javascript
{
    title: "Column Name",
    field: "fieldName",
    sorter: "string", // or "number", "date"
    minWidth: 100, // Prevent columns becoming too narrow
    widthGrow: 1, // How much this column grows (2 = twice as much)
    widthShrink: 1, // How much this column shrinks
    headerWordWrap: true, // Allow multi-line headers
    hozAlign: "center", // Data alignment: "left", "center", "right"
    headerHozAlign: "left", // Header text alignment (keep left for sorting arrows)
    formatter: (cell) => { /* Custom formatting */ }
}
```

### CRITICAL: Width Management
**NEVER mix fixed `width` with `widthGrow`/`widthShrink`** - this causes conflicts.

**CORRECT**:
```javascript
// Either use fixed widths:
{ width: 150 }

// OR use flexible sizing:
{ minWidth: 100, widthGrow: 2, widthShrink: 1 }

// NEVER mix both in the same column
```

### Data Alignment Strategy (Current App)
- **Left-aligned**: Product ID, Product Name, Category (text data)
- **Center-aligned**: Current Stock, Min Threshold, Priority, Last Restock, Alert Date, Supplier, Acknowledged (numbers, dates, status)

### Header Word Wrapping
**Enable**: `headerWordWrap: true` in column definition
**CSS Support**: 
```css
.tabulator .tabulator-header .tabulator-col .tabulator-col-content .tabulator-col-title {
    white-space: normal;
}
```

### Custom Formatters Examples
```javascript
// Status indicators
formatter: (cell) => {
    const value = cell.getValue();
    const row = cell.getRow().getData();
    if (value === 0) {
        return `<span class="status-out-of-stock">Out of Stock</span>`;
    } else if (value <= row.minThreshold) {
        return `<span class="status-low-stock">${value} (Low)</span>`;
    }
    return value;
}

// Priority styling
formatter: (cell) => {
    const value = cell.getValue();
    const className = `priority-${value}`;
    return `<span class="${className}">${value.toUpperCase()}</span>`;
}

// Checkboxes with data attributes
formatter: (cell) => {
    const row = cell.getRow().getData();
    const isAcknowledged = this.acknowledgedAlerts.has(row.productId);
    return `<input type="checkbox" class="acknowledgment-checkbox" 
            ${isAcknowledged ? 'checked' : ''} 
            data-product-id="${row.productId}" 
            data-product-name="${row.productName}">`;
}
```

### CSS Override Priorities
When overriding Tabulator CSS, use high specificity:
```css
/* HIGH SPECIFICITY - Works reliably */
.tabulator .tabulator-header .tabulator-col .tabulator-col-sorter {
    /* styles with !important if needed */
}

/* LOW SPECIFICITY - May not work */
.tabulator-col-sorter {
    /* styles */
}
```

### Debugging Tabulator Issues
1. **Check browser console** for JavaScript errors
2. **Inspect DOM structure** - Tabulator creates complex nested elements
3. **Test with minimal config** - Strip down to basic table first
4. **Use cache-busting** - Add `?v=X` to CSS/JS files during development
5. **Check CSS conflicts** - Disable custom CSS to test vanilla behavior
6. **Test without custom styles** - Comment out `styles.css` to verify base functionality

### Working Table Configuration (Current App)
Located in `app.js` `initializeTable()` method:

```javascript
columns: [
    {
        title: "Product ID",
        field: "productId",
        width: 120,
        headerWordWrap: true
    },
    {
        title: "Product Name", 
        field: "productName",
        width: 200,
        headerWordWrap: true
    },
    // ... more columns
    {
        title: "Acknowledged",
        field: "acknowledged",
        width: 130,
        formatter: "tickCross",
        hozAlign: "center",
        headerHozAlign: "left"
    }
]
```

### Customizing Columns
1. **Add/Remove columns**: Modify the columns array
2. **Change field mappings**: Update `field` property
3. **Adjust widths**: Modify `width` property
4. **Change formatters**: Update `formatter` property
5. **Update alignment**: Modify `hozAlign` and `headerHozAlign`

### Tabulator Documentation
- **Official Docs**: https://tabulator.info/docs
- **Formatters**: https://tabulator.info/docs/6.3/format
- **Column Types**: https://tabulator.info/docs/6.3/columns
- **Responsive Design**: https://tabulator.info/docs/6.3/layout

## STYLING CUSTOMIZATION

### CSS Structure
- **Domo Branding**: Neutral colors, clean fonts
- **Summary Cards**: Light grey with color-coded top borders
- **Table Styling**: Clean white background, subtle borders
- **Responsive Design**: Adapts to different screen sizes

### Key CSS Classes
- `.stats-container` - Summary boxes container
- `.stat-card` - Individual summary boxes
- `.table-container` - Table wrapper
- `.tabulator` - Table styling overrides

### Color Scheme
- **Background**: Transparent/white
- **Summary Cards**: Light grey (#f8f9fa)
- **Acknowledged Border**: Green (#28a745)
- **Pending Border**: Red (#dc3545)
- **Table Headers**: Light grey (#e9ecef)

## DEPLOYMENT PROCESS

### Local Development
1. Start Python server: `python3 -m http.server 8080 --bind 127.0.0.1`
2. Access: `http://127.0.0.1:8080`
3. Uses fallback sample data
4. Filter listening disabled in development

### Domo Deployment
1. Update `manifest.json` with correct dataset ID and alias
2. Deploy via Domo CLI: `domo publish`
3. Create cards from Asset Library
4. Configure dataset permissions

### Required Domo Permissions
- **Dataset Read**: Access to source dataset
- **AppDB Write**: Create/update/delete acknowledgments
- **Filter Access**: Read page-level filters

## APPDB INTEGRATION

### Collection Structure
```javascript
{
    productId: "PROD-001",
    productName: "Product Name",
    acknowledgedAt: "2024-01-20T10:30:00.000Z",
    acknowledgedBy: "user@company.com"
}
```

### API Endpoints Used
- **Save**: `POST /data/v1/appdb/acknowledged-alerts`
- **Load**: `GET /data/v1/appdb/acknowledged-alerts`
- **Delete**: `DELETE /data/v1/appdb/acknowledged-alerts/{documentId}`
- **Export**: `POST /data/v1/appdb/acknowledged-alerts/export`

### Sync Configuration
AppDB collections can be synced to datasets via manifest:
```json
{
  "syncEnabled": true,
  "syncConfig": {
    "collections": [
      {
        "collectionName": "acknowledged-alerts",
        "targetDatasetId": "YOUR_SYNC_DATASET_ID",
        "syncFrequency": "realtime",
        "columnMapping": {
          "productId": "product_id",
          "productName": "product_name",
          "acknowledgedAt": "acknowledged_at",
          "acknowledgedBy": "acknowledged_by"
        }
      }
    ]
  }
}
```

## TROUBLESHOOTING

### Common Issues
1. **Table not rendering**: Check Tabulator height is set (400px)
2. **Filters not working**: Verify `domo.onFiltersUpdate()` is available
3. **Data not loading**: Check dataset alias and permissions
4. **AppDB errors**: Verify collection permissions and API endpoints
5. **Files not visible in Domo Editor**: Check file extensions and MIME types
6. **Documentation files empty**: Use .md extension instead of .txt for large files

### Debug Mode
Enable console logging by checking browser dev tools:
- Data loading: "Data loaded: X items"
- Filter changes: "Page filters updated:"
- SQL queries: "Executing SQL query:"
- AppDB operations: "Saving acknowledgment to Domo AppDB:"

### Cache Issues
Update cache-busting parameters in `index.html`:
```html
<script src="app.js?v=33"></script>
<script src="styles.css?v=20"></script>
```

## CUSTOMIZATION CHECKLIST

### For New Dataset
- [ ] Update `manifest.json` dataset alias and ID
- [ ] Map column names in `buildSQLQuery()`
- [ ] Update data transformation in `loadDomoData()`
- [ ] Test with sample data first
- [ ] Verify all columns display correctly

### For New Use Case
- [ ] Modify summary box calculations
- [ ] Update table columns and formatters
- [ ] Change acknowledgment logic if needed
- [ ] Update AppDB collection structure
- [ ] Test filter integration

### For New Environment
- [ ] Update app name and description
- [ ] Generate new app ID
- [ ] Configure dataset permissions
- [ ] Test deployment process
- [ ] Verify filter listening works

## AI ASSISTANT INSTRUCTIONS

### CRITICAL TABULATOR RULES
When working with Tabulator in this app:

1. **NEVER use `display: flex` on `.tabulator-col-content`** - This breaks sorting arrow positioning
2. **Always use `columnHeaderVertAlign: "middle"`** as a global table option, not individual column properties
3. **Use multiple CSS selectors for last column border removal** - `:last-child` alone may not work
4. **Always include `position: relative` on `.tabulator-col`** when using absolute positioning for sorters
5. **Use `!important` sparingly but decisively** when overriding Tabulator's internal CSS
6. **Test with vanilla Tabulator first** (comment out custom CSS) when debugging issues
7. **Use cache-busting parameters** (`?v=X`) during development to avoid browser caching issues

### TABULATOR DEBUGGING PROCESS
When Tabulator issues arise:

1. **Comment out `styles.css`** to test vanilla behavior
2. **Check browser console** for JavaScript errors
3. **Use minimal table config** to isolate issues
4. **Add one feature at a time** after confirming basic functionality
5. **Use browser dev tools** to inspect DOM structure and CSS conflicts
6. **Test responsive behavior** at different screen sizes

### COLUMN CONFIGURATION RULES
- **Width management**: Use EITHER fixed `width` OR `widthGrow`/`widthShrink`, never both
- **Text alignment**: Use `hozAlign` for data, `headerHozAlign` for headers
- **Word wrapping**: Use `headerWordWrap: true` for multi-word headers
- **Formatters**: Always include error handling and data validation

### CSS SPECIFICITY REQUIREMENTS
Always use full Tabulator selector chains:
```css
.tabulator .tabulator-header .tabulator-col .tabulator-col-sorter {
    /* High specificity - works reliably */
}
```

### ENVIRONMENT DETECTION RULES
**CRITICAL**: Proper environment detection is essential for app functionality.

**WRONG APPROACH** (causes issues):
```javascript
// DON'T use - domo.env exists even in local development
if (typeof domo !== 'undefined' && domo.env) {
    // This will incorrectly identify local as Domo environment
}
```

**CORRECT APPROACH** (reliable):
```javascript
// DO use - check domain name for reliable detection
const isDomoDomain = window.location.hostname.includes('domo.com') || 
                    window.location.hostname.includes('domo');

if (typeof domo !== 'undefined' && isDomoDomain && typeof domo.get === 'function') {
    // This correctly identifies Domo environment
}
```

**Why Domain Checking Works**:
- `domo` object may exist in local development (from CDN scripts)
- `domo.env` may be available even locally (from ryuu.js)
- Domain checking is the most reliable indicator of actual Domo environment
- Always test both local and Domo environments after changes

### GENERAL APP DEVELOPMENT
When making changes to this app:

1. **Always update cache versions** in `index.html` after JS/CSS changes
2. **Test locally first** before deploying to Domo
3. **Maintain backward compatibility** with existing data structures
4. **Use proper Domo API methods** (domo.query, domo.onFiltersUpdate, etc.)
5. **Follow Tabulator 6.3.1 documentation** for table modifications
6. **Preserve responsive design** and Domo branding
7. **Update this documentation** when making structural changes
8. **Remember: Deleting files locally does NOT remove them from Domo**
9. **Always verify what files are actually in Domo using `domo download`**
10. **Clean up old files manually in Domo UI if needed**
11. **Use .md extension** for documentation files (Domo truncates large .txt files)
12. **Test file downloads** with `domo download` to verify content integrity
13. **Document any new Tabulator discoveries** in this PROMPT.md file
14. **Always test environment detection** in both local and Domo environments

### Key Files to Modify
- **Data changes**: `data-service.js`
- **UI changes**: `app.js`, `styles.css`, `index.html`
- **Configuration**: `manifest.json`
- **Documentation**: `PROMPT.txt`, `README.md`

### Testing Checklist
- [ ] Local development works
- [ ] Domo deployment succeeds
- [ ] Filters respond correctly
- [ ] Acknowledgments persist
- [ ] Summary boxes update
- [ ] Table displays properly
- [ ] Responsive design works
- [ ] Documentation files download correctly (use .md extension)
- [ ] File integrity verified with `domo download`

### Workflow for Checking Domo Changes
1. **Download from Domo**: `domo download -i 5e067702-328a-4d47-9fbe-dca1c34eca5e`
2. **Compare files**: `git status` and `git diff`
3. **Verify content**: Check that .md files downloaded with full content
4. **Merge changes**: `git add .` and `git commit` if changes are valid
5. **Test locally**: Ensure changes work before redeploying

## VERSION HISTORY
- v1.0.0: Initial implementation with basic Tabulator table
- v1.1.0: Added proper Domo dataset querying and filter listening
- v1.1.1: Fixed filter listening to use domo.onFiltersUpdate()
- v1.2.0: Added comprehensive documentation and discovered Domo file handling limitations
- v1.2.1: Renamed PROMPT.txt to PROMPT.md for better Domo compatibility

## DOCUMENTATION SOURCES & REFERENCES

### Primary Documentation Used
- **Domo JS API**: https://developer.domo.com/portal/e947d87e17547-domo-js
- **Domo Query API**: https://developer.domo.com/portal/d5da72027f4a1-query#building-a-query
- **Domo AppDB API**: https://developer.domo.com/portal/1l1fm2g0sfm69-app-db-api
- **Tabulator Documentation**: https://tabulator.info/docs
- **Tabulator 6.3.1 Reference**: https://tabulator.info/docs/6.3

### Specific API References
- **Domo Filter Methods**: `domo.onFiltersUpdate()`, `domo.filterContainer()`
- **Domo Data Methods**: `domo.query()`, `domo.get()`, `domo.onDataUpdate()`
- **Domo AppDB Endpoints**: `/data/v1/appdb/{collectionName}`
- **Domo Dataset Endpoints**: `/data/v1/{alias}`

### Tabulator Specific Documentation
- **Column Configuration**: https://tabulator.info/docs/6.3/columns
- **Formatters**: https://tabulator.info/docs/6.3/format
- **Layout Options**: https://tabulator.info/docs/6.3/layout
- **Responsive Design**: https://tabulator.info/docs/6.3/layout#responsive
- **Event Handling**: https://tabulator.info/docs/6.3/callbacks

### Domo Platform Documentation
- **Custom Apps Overview**: https://developer.domo.com/docs/custom-apps
- **Procode Apps**: https://developer.domo.com/docs/procode-apps
- **Dataset API**: https://developer.domo.com/docs/dataset-api
- **AppDB Sync**: https://developer.domo.com/docs/appdb-sync

### Development Resources
- **Domo CLI**: https://developer.domo.com/docs/domo-cli
- **Local Development**: https://developer.domo.com/docs/local-development
- **App Deployment**: https://developer.domo.com/docs/app-deployment

### Domo File Handling Limitations
**CRITICAL: File Extension Requirements**
- **.txt files**: Large files (>10KB) download as 0 bytes from Domo
- **.md files**: Full content preserved and downloadable
- **Recommendation**: Use .md extension for all documentation files
- **Tested**: PROMPT.txt (15KB) → 0 bytes, PROMPT.md (15KB) → full content
- **Workaround**: Rename large .txt files to .md before publishing

**CRITICAL: File Deletion Behavior**
- **Deleting files locally does NOT remove them from Domo**
- **Domo CLI `domo publish` only uploads/updates files, never deletes**
- **Old files persist in Domo design even after local deletion**
- **Workaround**: Manually delete files in Domo UI or create new design
- **Verification**: Use `domo download` to check what files are actually in Domo
- **Best Practice**: Keep local directory clean and republish to sync

### Domo Pro Code Editor File Support
**Supported File Types in Domo Editor:**
- **General files**: bash, bat, clj, cljc, cljs, cmd, css, csv, edn, go, gql, graphql, html, java, js, json, jsx, kt, kts, less, markdown, md, php, ps1, py, r, rb, scss, sh, sql, swift, ts, tsv, tsx, txt, xml, yaml, yml
- **Image files**: bmp, eps, gif, ico, jpeg, jpg, png, svg, tif, tiff, webp
- **MIME types**: Domo uses specific MIME type detection for file handling

**File Visibility Issues:**
- **Some files may not appear** in Domo Pro Code Editor due to MIME type detection
- **JSON/JS files**: Should be visible with proper MIME types (application/json, application/javascript)
- **Markdown files**: Supported with text/markdown MIME type
- **Recommendation**: Use standard file extensions and ensure proper MIME type detection

**App-Specific MIME Types:**
- **app.js**: application/javascript, text/javascript
- **data-service.js**: application/javascript, text/javascript
- **index.html**: text/html, application/html
- **manifest.json**: application/json, text/json
- **styles.css**: text/css
- **PROMPT.md**: text/markdown, text/plain
- **README.md**: text/markdown, text/plain
- **thumbnail.png**: image/png

### Domo Example App Structure Analysis
**Generated from `domo init` command with starter kits:**

**Available Starter Kits:**
- `hello world`: Basic HTML/JS app with minimal structure
- `basic chart`: Phoenix chart integration with data querying
- `map chart`: Map visualization with geographic data
- `sugarforce`: Salesforce integration example
- `manifest only`: Minimal manifest-only app

**Standard Domo App Structure:**
```
app-name/
├── manifest.json          # App configuration
├── index.html            # Main HTML file
├── app.js               # Main JavaScript logic
├── app.css              # Styling (optional)
└── thumbnail.png        # App icon (300x300px)
```

**Example Manifest Structure (from Domo CLI):**
```json
{
  "name": "app-name",
  "version": "1.0.0",
  "size": {
    "width": 1,
    "height": 1
  },
  "mapping": []
}
```

**Key Differences from Our App (UPDATED):**
- **Standard manifests** use `size` object instead of `width`/`height` directly ✅ **FIXED**
- **Standard manifests** use `mapping` array instead of `datasetsMapping` ✅ **FIXED**
- **No additional fields** like `description`, `main`, `fileName`, `id` in examples ✅ **FIXED**
- **Minimal structure** focuses on core functionality ✅ **FIXED**

**Our App Now Follows Domo Standards:**
- **Manifest**: Uses standard `size` object and `mapping` array
- **Data API**: Uses `/data/v2/` endpoint with query object pattern
- **HTML Structure**: Simplified to match Domo examples
- **Helper Functions**: Implements standard `makeQueryString()`, `getColumnNames()` patterns
- **Domo Utils**: Includes `ryuu.js` for standard Domo functionality

**Data Querying Patterns from Examples:**
- **API Endpoint**: `/data/v2/{datasetAlias}?` (not `/data/v1/`)
- **Query Structure**: Uses query object with fields, groupby, dategrain
- **Limit Parameter**: `&limit=1000` to prevent large result sets
- **Helper Functions**: `makeQueryString()`, `getColumnNames()`, `processGrains()`
- **Error Handling**: `displayError()` function for data loading failures

**Example Data Query Pattern:**
```javascript
function getData(datasetAlias, columns){
  var query = {
    "fields": getColumnNames(columns)
  };
  processGrains(columns, query);
  return domo.get(makeQueryString(datasetAlias, query) + '&limit=1000');
}
```

### App Updates to Follow Domo Standards (v1.3.0)
**Changes Made:**
1. **Manifest.json**: Updated to standard format
   - Changed `width`/`height` to `size: {width: 3, height: 2}`
   - Changed `datasetsMapping` to `mapping: []`
   - Removed non-standard fields (`description`, `main`, `fileName`, `id`)
   - Updated version to 1.3.0

2. **Data Service**: Updated to use `/data/v2/` API
   - Replaced `domo.query()` with `domo.get()` using `/data/v2/` endpoint
   - Added `buildQueryObject()` method following Domo patterns
   - Added `getColumnNames()` helper function
   - Added `makeQueryString()` helper function
   - Removed old `buildSQLQuery()` and `buildWhereConditions()` methods

3. **HTML Structure**: Simplified to match Domo examples
   - Removed DOCTYPE and meta tags
   - Added `ryuu.js` Domo utility library
   - Simplified script loading order
   - Updated cache version to v34

4. **Code Patterns**: Now follows Domo standards
   - Uses standard query object structure
   - Implements proper error handling
   - Follows Domo naming conventions
   - Uses standard helper function patterns

### Source Data & References Used
- **Sample Data**: 8 product alerts with various categories and priorities
- **Data Types**: Electronics, Food & Beverage, Home & Kitchen, Sports & Fitness, Clothing, Health & Wellness, Office Supplies
- **Priority Levels**: high, medium, low
- **Status Types**: out-of-stock, low-stock
- **Stock Thresholds**: 0-30 units with min thresholds 5-30
- **Suppliers**: Various fictional suppliers for each category

### Key Implementation Decisions
- **Tabulator Version**: 6.3.1 (latest stable with proper responsive features)
- **CDN Provider**: cdn.jsdelivr.net (reliable, fast loading)
- **Domo API Methods**: Used official methods from documentation
- **Filter Integration**: Implemented proper domo.onFiltersUpdate() instead of generic events
- **SQL Querying**: Used domo.query() with proper WHERE clause building
- **AppDB Sync**: Configured for real-time synchronization to datasets

## CONTACT & SUPPORT
- **GitHub Repository**: https://github.com/james-tempus/domo-out-of-stock-alerts
- **Live Preview**: https://james-tempus.github.io/domo-out-of-stock-alerts/
- **Domo Developer Portal**: https://developer.domo.com/
- **Tabulator Documentation**: https://tabulator.info/docs
