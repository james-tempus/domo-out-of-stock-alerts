# Domo Out-of-Stock Alerts App

A Domo Procode Custom App that displays out-of-stock product alerts in an interactive Tabulator table with acknowledgment functionality and real-time filter integration.

## ⚠️ Important: Dataset Configuration Required

**Before using this app in production:**
- The app currently uses **sample data** (8 product alerts)
- To connect to a **real dataset**, you must replace the dataset ID in `manifest.json`
- See the [PROMPT.txt](./PROMPT.txt) file for detailed configuration instructions

## 🚀 Live Preview
[View Live Demo](https://james-tempus.github.io/domo-out-of-stock-alerts/)

## 📋 Features

- **Interactive Table**: Responsive Tabulator table with sorting and filtering
- **Acknowledgment System**: Checkbox-based acknowledgment with AppDB persistence
- **Real-time Filters**: Automatic response to page-level Domo filters
- **Summary Statistics**: Live counts of Total, Acknowledged, and Pending alerts
- **View Toggle**: Switch between Pending, Acknowledged, and All Items
- **Domo Integration**: Proper SQL querying and dataset integration

## 🛠️ Technical Stack

- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **Table Library**: Tabulator 6.3.1
- **Domo Integration**: Domo JS API with SQL querying
- **Data Storage**: Domo AppDB with dataset sync
- **Development**: Python HTTP Server

## 📁 Project Structure

```
├── index.html          # Main HTML structure
├── app.js             # Application logic and Tabulator setup
├── data-service.js    # Data abstraction layer
├── styles.css         # Custom styling and overrides
├── manifest.json      # Domo app configuration
├── thumbnail.png      # App icon (300x300px)
├── PROMPT.txt         # Comprehensive documentation
└── README.md          # This file
```

## 🚀 Quick Start

### Local Development
```bash
# Clone the repository
git clone https://github.com/james-tempus/domo-out-of-stock-alerts.git
cd domo-out-of-stock-alerts

# Start local server
python3 -m http.server 8080 --bind 127.0.0.1

# Open in browser
open http://127.0.0.1:8080
```

### Domo Deployment
```bash
# Install Domo CLI (if not already installed)
npm install -g @domoinc/domo-cli

# Login to Domo
domo login

# Deploy the app
domo publish
```

## ⚙️ Configuration

### Dataset Setup
1. **Create a dataset** with the required schema (see PROMPT.txt for details)
2. **Find your dataset ID** in Domo's dataset management
3. **Update `manifest.json`** with your actual dataset ID:
   ```json
   {
     "datasetsMapping": [
       {
         "alias": "product-alerts",
         "dataSetId": "YOUR_ACTUAL_DATASET_ID_HERE",
         "fields": ["product_id", "product_name", "category", ...]
       }
     ]
   }
   ```
4. **Redeploy** with `domo publish`

### Current Status
- **Sample Data**: App currently uses 8 sample product alerts
- **Real Data**: Requires dataset ID configuration in manifest.json
- **Fallback**: App gracefully falls back to sample data if dataset unavailable

### Customization
- **Summary Boxes**: Modify calculations in `app.js`
- **Table Columns**: Update column definitions in `app.js`
- **Styling**: Customize CSS in `styles.css`
- **Filters**: Add new filter types in `data-service.js`

## 📚 Documentation

For complete documentation including:
- Detailed setup instructions
- Dataset schema requirements
- Customization guidelines
- Troubleshooting guide
- AI assistant instructions

**See [PROMPT.txt](./PROMPT.txt) for comprehensive documentation.**

## 🔧 Key Features Explained

### Filter Integration
The app automatically responds to page-level Domo filters using:
- `domo.onFiltersUpdate()` - Listens for filter changes
- `domo.query()` - Executes SQL with WHERE clauses
- `domo.filterContainer()` - Creates programmatic filters

### Data Flow
1. **Load**: Query Domo dataset with SQL
2. **Filter**: Apply page filters as WHERE conditions
3. **Display**: Show in Tabulator table
4. **Interact**: Handle acknowledgments via AppDB
5. **Sync**: Auto-sync to datasets

### Acknowledgment System
- Checkbox interactions update AppDB collections
- Real-time sync to datasets for reporting
- Persistent storage across sessions
- Filter integration (acknowledged items can be hidden)

## 🎨 UI/UX Features

- **Domo Branding**: Clean, neutral color scheme
- **Responsive Design**: Adapts to different screen sizes
- **Color-coded Summary**: Green for acknowledged, red for pending
- **Smooth Interactions**: Overlay messages and animations
- **Accessibility**: Proper ARIA labels and keyboard navigation

## 📊 Sample Data

The app includes 8 sample products for development:
- Electronics (headphones, desk lamp, phone case)
- Food & Beverage (coffee beans)
- Home & Kitchen (water bottle)
- Sports & Fitness (yoga mat)
- Clothing (t-shirt)
- Health & Wellness (protein powder)

## 🔄 Version History

- **v1.1.1**: Fixed filter listening with proper Domo JS API
- **v1.1.0**: Added SQL querying and filter integration
- **v1.0.0**: Initial implementation with basic functionality

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

- **Issues**: [GitHub Issues](https://github.com/james-tempus/domo-out-of-stock-alerts/issues)
- **Documentation**: [PROMPT.txt](./PROMPT.txt)
- **Domo Docs**: [Domo Developer Portal](https://developer.domo.com/)
- **Tabulator Docs**: [Tabulator Documentation](https://tabulator.info/docs)

---

**For detailed setup, customization, and troubleshooting instructions, please refer to [PROMPT.txt](./PROMPT.txt).**
