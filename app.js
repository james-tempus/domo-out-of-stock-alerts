// Domo Procode App - Out of Stock Alerts
// This app creates a Tabulator table for out-of-stock alerts with acknowledgment functionality

class OutOfStockAlertsApp {
    constructor() {
        this.table = null;
        this.acknowledgedAlerts = new Set();
        this.sampleData = []; // Will be loaded from data service
        this.currentFilter = 'pending'; // Default to pending
        this.dataService = new DataService();
        this.init();
    }

    async init() {
        try {
            // Load data from data service (Domo dataset or local)
            this.sampleData = await this.dataService.init();
            console.log('Data loaded:', this.sampleData.length, 'items');
            
            // Load acknowledged alerts from storage
            this.acknowledgedAlerts = await this.dataService.loadAcknowledgedAlerts();
            console.log('Acknowledged alerts loaded:', this.acknowledgedAlerts.size, 'items');
            
            // Set up filter listening for page-level filters
            this.setupFilterListening();
            
            this.setupEventListeners();
            this.initializeTable();
            this.updateStats();
        } catch (error) {
            console.error('Error initializing app:', error);
            // Fallback to empty data
            this.sampleData = [];
            this.acknowledgedAlerts = new Set();
            this.setupEventListeners();
            this.initializeTable();
            this.updateStats();
        }
    }

    initializeTable() {
        console.log('Initializing full Tabulator table...');
        console.log('Current filter:', this.currentFilter);
        console.log('Pre-filtered data:', this.getFilteredData());
        
        this.table = new Tabulator("#alerts-table", {
            data: this.getFilteredData(),
            height: "400px",
            layout: "fitColumns",
            responsiveLayout: "hide",
            columns: [
                {
                    title: "Product ID",
                    field: "productId",
                    width: 120,
                    sorter: "string"
                },
                {
                    title: "Product Name",
                    field: "productName",
                    width: 200,
                    widthGrow: 2,
                    widthShrink: 1,
                    sorter: "string",
                    headerWordWrap: true,
                    responsive: 0
                },
                {
                    title: "Category",
                    field: "category",
                    width: 120,
                    sorter: "string"
                },
                {
                    title: "Current Stock",
                    field: "currentStock",
                    width: 120,
                    widthGrow: 1,
                    widthShrink: 1,
                    sorter: "number",
                    headerWordWrap: true,
                    headerHozAlign: "left",
                    hozAlign: "center",
                    responsive: 1,
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
                },
                {
                    title: "Min Threshold",
                    field: "minThreshold",
                    width: 120,
                    sorter: "number",
                    headerWordWrap: true,
                    headerHozAlign: "left",
                    hozAlign: "center"
                },
                {
                    title: "Priority",
                    field: "priority",
                    width: 100,
                    widthGrow: 1,
                    widthShrink: 1,
                    sorter: "string",
                    headerHozAlign: "left",
                    hozAlign: "center",
                    responsive: 2,
                    formatter: (cell) => {
                        const value = cell.getValue();
                        const className = `priority-${value}`;
                        return `<span class="${className}">${value.toUpperCase()}</span>`;
                    }
                },
                {
                    title: "Last Restock",
                    field: "lastRestock",
                    width: 120,
                    sorter: "date",
                    headerWordWrap: true,
                    headerHozAlign: "left",
                    hozAlign: "center"
                },
                {
                    title: "Alert Date",
                    field: "alertDate",
                    width: 120,
                    sorter: "date",
                    headerWordWrap: true,
                    headerHozAlign: "left",
                    hozAlign: "center"
                },
                {
                    title: "Supplier",
                    field: "supplier",
                    width: 150,
                    sorter: "string",
                    headerHozAlign: "left",
                    hozAlign: "center"
                },
                {
                    title: "Acknowledged",
                    field: "acknowledged",
                    width: 130,
                    widthGrow: 1,
                    widthShrink: 1,
                    headerWordWrap: true,
                    headerHozAlign: "left",
                    hozAlign: "center",
                    responsive: 3,
                    formatter: (cell) => {
                        const row = cell.getRow().getData();
                        const isAcknowledged = this.acknowledgedAlerts.has(row.productId);
                        return `<input type="checkbox" class="acknowledgment-checkbox" ${isAcknowledged ? 'checked' : ''} 
                                data-product-id="${row.productId}" data-product-name="${row.productName}">`;
                    },
                    cellClick: (e, cell) => {
                        if (e.target.type === 'checkbox') {
                            const productId = e.target.getAttribute('data-product-id');
                            const productName = e.target.getAttribute('data-product-name');
                            const isAcknowledged = e.target.checked;
                            const productData = this.sampleData.find(item => item.productId === productId);
                            
                            this.handleAcknowledgment(productId, isAcknowledged, productData);
                        }
                    }
                }
            ]
        });
        
        console.log('Full table created:', this.table);
        console.log('Table data:', this.table.getData());
    }

    async handleAcknowledgment(productId, isAcknowledged, productData) {
        try {
            if (isAcknowledged) {
                this.acknowledgedAlerts.add(productId);
                await this.dataService.saveAcknowledgment(productData);
                this.showSuccessMessage(`Alert acknowledged for ${productData.productName}`);
                
                // If we're showing pending only, hide the row after a brief delay
                if (this.currentFilter === 'pending') {
                    setTimeout(() => {
                        this.updateTableData();
                    }, 1000);
                }
            } else {
                this.acknowledgedAlerts.delete(productId);
                await this.dataService.removeAcknowledgment(productId);
                this.showSuccessMessage(`Acknowledgment removed for ${productData.productName}`);
                
                // Update table data to reflect the change
                this.updateTableData();
            }
            
            this.updateStats();
        } catch (error) {
            console.error('Error handling acknowledgment:', error);
            this.showSuccessMessage('Error saving acknowledgment. Please try again.');
        }
    }


    updateStats() {
        const totalAlerts = this.sampleData.length;
        const acknowledgedCount = this.acknowledgedAlerts.size;
        const pendingCount = totalAlerts - acknowledgedCount;

        document.getElementById('total-alerts').textContent = totalAlerts;
        document.getElementById('acknowledged-alerts').textContent = acknowledgedCount;
        document.getElementById('pending-alerts').textContent = pendingCount;
    }

    showSuccessMessage(message) {
        // Create or update success message overlay
        let successDiv = document.querySelector('.success-message');
        if (!successDiv) {
            successDiv = document.createElement('div');
            successDiv.className = 'success-message';
            document.querySelector('.table-container').appendChild(successDiv);
        }
        
        successDiv.textContent = message;
        successDiv.style.display = 'block';
        
        // The CSS animation will handle the fade out automatically
        // Reset for next use
        setTimeout(() => {
            successDiv.style.display = 'none';
        }, 3000);
    }

    getFilteredData() {
        const filtered = (() => {
            switch (this.currentFilter) {
                case 'acknowledged':
                    return this.sampleData.filter(item => this.acknowledgedAlerts.has(item.productId));
                case 'pending':
                    return this.sampleData.filter(item => !this.acknowledgedAlerts.has(item.productId));
                case 'all':
                default:
                    return this.sampleData;
            }
        })();
        
        return filtered;
    }

    updateTableData() {
        this.table.setData(this.getFilteredData());
    }

    setFilter(filter) {
        this.currentFilter = filter;
        
        // Update button states
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        document.getElementById(`filter-${filter}`).classList.add('active');
        
        // Update table data
        this.updateTableData();
        this.updateStats();
    }

    setupEventListeners() {
        // Load existing acknowledgments from localStorage (demo)
        const existingData = JSON.parse(localStorage.getItem('acknowledgedAlerts') || '[]');
        existingData.forEach(item => {
            this.acknowledgedAlerts.add(item.productId);
        });
        
        // Setup filter button event listeners
        document.getElementById('filter-pending').addEventListener('click', () => {
            this.setFilter('pending');
        });
        
        document.getElementById('filter-acknowledged').addEventListener('click', () => {
            this.setFilter('acknowledged');
        });
        
        document.getElementById('filter-all').addEventListener('click', () => {
            this.setFilter('all');
        });
        
        // Initial filter state is already set to 'pending' in constructor
    }

    // Method to get acknowledged data for merging with source dataset
    getAcknowledgedData() {
        return Array.from(this.acknowledgedAlerts).map(id => {
            const product = this.sampleData.find(p => p.id === id);
            return {
                productId: product.productId,
                acknowledged: true,
                acknowledgedAt: new Date().toISOString()
            };
        });
    }

    // Set up filter listening for page-level filters
    setupFilterListening() {
        // Add a listener for filter changes from the data service
        this.dataService.addFilterListener(async (filters) => {
            console.log('Page filters changed, refreshing data:', filters);
            
            try {
                // Refresh data with new filters
                this.sampleData = await this.dataService.refreshData();
                console.log('Data refreshed with filters:', this.sampleData.length, 'items');
                
                // Update the table with new data
                this.updateTableData();
                this.updateStats();
            } catch (error) {
                console.error('Error refreshing data with filters:', error);
            }
        });
        
        // Example: Create some default filters for demonstration
        // In production, these would be created based on user interaction or page context
        this.setupDefaultFilters();
        
        console.log('Filter listening setup complete');
    }

    // Set up default filters for demonstration
    setupDefaultFilters() {
        if (typeof domo !== 'undefined') {
            // Example: Create a filter to show only high priority alerts
            // this.dataService.createPriorityFilter(['high']);
            
            // Example: Create a filter to show only out-of-stock items
            // this.dataService.createStatusFilter(['out-of-stock']);
            
            // Example: Create a filter for specific categories
            // this.dataService.createCategoryFilter(['Electronics', 'Office Supplies']);
            
            console.log('Default filters available (commented out for demo)');
        }
    }
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.outOfStockAlertsApp = new OutOfStockAlertsApp();
});

// Export for potential use in other parts of the Domo platform
if (typeof module !== 'undefined' && module.exports) {
    module.exports = OutOfStockAlertsApp;
}
