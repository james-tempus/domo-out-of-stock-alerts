# Domo Out-of-Stock Alerts App

A clean, minimal Domo Procode app for managing out-of-stock product alerts with acknowledgment functionality.

## 🚀 Live Preview

**[View Live Demo](https://james-tempus.github.io/domo-out-of-stock-alerts/)** - See the app in action with full functionality

## Features

- **Clean Summary Dashboard**: Color-coded summary boxes showing total, acknowledged, and pending alerts
- **Interactive Tabulator Table**: Full-featured table with sorting, filtering, and responsive design
- **Acknowledgment System**: Checkbox-based acknowledgment with localStorage persistence
- **Smart Filtering**: Filter by Pending, Acknowledged, or All Items
- **Row Auto-Hide**: Acknowledged items automatically hide after 1 second when viewing pending
- **Pre-filtered Loading**: No flash of all data - shows only relevant items from start
- **Domo-Inspired Design**: Clean, neutral colors matching Domo dashboard aesthetics

## Color Coding

- **Blue Border**: Total alerts (informational)
- **Green Border**: Acknowledged alerts (completed/resolved)
- **Red Border**: Pending alerts (urgent/needs attention)

## Technical Details

- **Tabulator.js**: Version 6.3.1 for modern table functionality
- **Data Service**: Handles both local SQL data (development) and Domo datasets (production)
- **SQL Sample Data**: `sample-data.sql` contains the sample data structure
- **Responsive Design**: Adapts to different screen sizes with proper column wrapping
- **Clean Styling**: Minimal, professional appearance with Domo-inspired design
- **GitHub Pages**: Automatically deployed from main branch

## Sample Data

- **Development**: Uses fallback data in `data-service.js` for local testing
- **SQL Structure**: `sample-data.sql` contains the database schema and sample data
- **Production**: Connects to Domo dataset specified in `manifest.json`
- **Data Service**: Automatically switches between local and Domo data sources

### SQL Schema
The `sample-data.sql` file contains:
- Table creation with proper column types
- Sample data insertion
- Query examples for production use

## Usage

1. View pending alerts by default
2. Check acknowledgment boxes to mark items as acknowledged
3. Use filter buttons to switch between views
4. Acknowledged items persist across browser sessions

## Development

- Run locally with: `python3 -m http.server 8080`
- Access at: `http://localhost:8080`
- All changes are automatically reflected in the browser

## Deployment

- **GitHub Pages**: Automatically deployed from the main branch
- **Live URL**: https://james-tempus.github.io/domo-out-of-stock-alerts/
- **Repository**: https://github.com/james-tempus/domo-out-of-stock-alerts
- Updates are automatically deployed when changes are pushed to main

## Domo Integration

### Production Deployment
1. **Dataset Connection**: The app automatically connects to the dataset specified in `manifest.json`
2. **Data Service**: Handles data retrieval from Domo datasets in production
3. **AppDB Integration**: Acknowledgments are saved to Domo AppDB for persistence
4. **Error Handling**: Falls back to local data if Domo services are unavailable

### Development vs Production
- **Development**: Uses `sample-data.js` and `localStorage` for testing
- **Production**: Uses Domo dataset queries and AppDB for data persistence
- **Automatic Detection**: The app detects the environment and switches data sources accordingly

### Dataset Requirements
Your Domo dataset should include these columns:
- `product_id` (or `productId`)
- `product_name` (or `productName`) 
- `category`
- `current_stock` (or `currentStock`)
- `min_threshold` (or `minThreshold`)
- `last_restock` (or `lastRestock`)
- `priority`
- `status`
- `alert_date` (or `alertDate`)
- `supplier`
- `acknowledged`

### Setup Instructions
1. **Update manifest.json**: 
   - Replace `YOUR_DATASET_ID_HERE` with your actual product alerts dataset ID
   - Replace `YOUR_ACKNOWLEDGMENTS_DATASET_ID_HERE` with your acknowledgments dataset ID
2. **Dataset Alias**: The app uses the alias `product-alerts` to reference your dataset
3. **AppDB Collection**: Acknowledgments are stored in the `acknowledged-alerts` collection
4. **AppDB Sync**: Enabled with real-time sync to push acknowledgment data to a dataset
5. **Column Mapping**: The app handles both snake_case and camelCase column names automatically

### AppDB Sync Configuration
The app is configured with `syncEnabled: true` to automatically sync acknowledgment data from AppDB to a Domo dataset:

- **Collection**: `acknowledged-alerts`
- **Sync Frequency**: Real-time
- **Column Mapping**: 
  - `productId` → `product_id`
  - `productName` → `product_name`
  - `acknowledgedAt` → `acknowledged_at`
  - `acknowledgedBy` → `acknowledged_by`

### Benefits of AppDB Sync
- **Real-time Data**: Acknowledgments are immediately available in datasets for reporting
- **Security Compliant**: Uses Domo's official sync mechanism (no direct dataset writes from apps)
- **Automatic**: No manual intervention required - sync happens automatically
- **Governance**: Maintains data integrity and access controls
- **Reporting Ready**: Synced data can be used in dashboards, cards, and other Domo features
