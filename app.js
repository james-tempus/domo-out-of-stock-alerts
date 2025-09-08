// Domo Procode App - Out of Stock Alerts
// This app creates a Tabulator table for out-of-stock alerts with acknowledgment functionality

class OutOfStockAlertsApp {
    constructor() {
        this.table = null;
        this.acknowledgedAlerts = new Set();
        this.sampleData = this.generateSampleData();
        this.currentFilter = 'pending'; // Default to pending
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.initializeTable();
        this.updateStats();
    }

    generateSampleData() {
        return [
            {
                id: 1,
                productId: "PROD-001",
                productName: "Wireless Bluetooth Headphones",
                category: "Electronics",
                currentStock: 0,
                minThreshold: 10,
                lastRestock: "2024-01-15",
                priority: "high",
                status: "out-of-stock",
                alertDate: "2024-01-20",
                supplier: "TechSupply Co.",
                acknowledged: false
            },
            {
                id: 2,
                productId: "PROD-002",
                productName: "Organic Coffee Beans (1lb)",
                category: "Food & Beverage",
                currentStock: 2,
                minThreshold: 15,
                lastRestock: "2024-01-18",
                priority: "high",
                status: "low-stock",
                alertDate: "2024-01-21",
                supplier: "Green Bean Co.",
                acknowledged: false
            },
            {
                id: 3,
                productId: "PROD-003",
                productName: "Stainless Steel Water Bottle",
                category: "Home & Kitchen",
                currentStock: 0,
                minThreshold: 25,
                lastRestock: "2024-01-10",
                priority: "medium",
                status: "out-of-stock",
                alertDate: "2024-01-19",
                supplier: "Kitchen Essentials",
                acknowledged: false
            },
            {
                id: 4,
                productId: "PROD-004",
                productName: "Yoga Mat (Premium)",
                category: "Sports & Fitness",
                currentStock: 1,
                minThreshold: 8,
                lastRestock: "2024-01-16",
                priority: "medium",
                status: "low-stock",
                alertDate: "2024-01-22",
                supplier: "Fitness Pro",
                acknowledged: false
            },
            {
                id: 5,
                productId: "PROD-005",
                productName: "LED Desk Lamp",
                category: "Office Supplies",
                currentStock: 0,
                minThreshold: 12,
                lastRestock: "2024-01-12",
                priority: "high",
                status: "out-of-stock",
                alertDate: "2024-01-18",
                supplier: "Office Solutions",
                acknowledged: false
            },
            {
                id: 6,
                productId: "PROD-006",
                productName: "Cotton T-Shirt (Black)",
                category: "Clothing",
                currentStock: 3,
                minThreshold: 20,
                lastRestock: "2024-01-14",
                priority: "low",
                status: "low-stock",
                alertDate: "2024-01-23",
                supplier: "Fashion Forward",
                acknowledged: false
            },
            {
                id: 7,
                productId: "PROD-007",
                productName: "Smartphone Case (Clear)",
                category: "Electronics",
                currentStock: 0,
                minThreshold: 30,
                lastRestock: "2024-01-08",
                priority: "medium",
                status: "out-of-stock",
                alertDate: "2024-01-17",
                supplier: "TechSupply Co.",
                acknowledged: false
            },
            {
                id: 8,
                productId: "PROD-008",
                productName: "Protein Powder (Vanilla)",
                category: "Health & Wellness",
                currentStock: 1,
                minThreshold: 5,
                lastRestock: "2024-01-19",
                priority: "high",
                status: "low-stock",
                alertDate: "2024-01-24",
                supplier: "Health Plus",
                acknowledged: false
            }
        ];
    }


    initializeTable() {
        console.log('Initializing full Tabulator table...');
        console.log('Current filter:', this.currentFilter);
        console.log('Pre-filtered data:', this.getFilteredData());
        
        this.table = new Tabulator("#alerts-table", {
            data: this.getFilteredData(),
            height: "400px",
            layout: "fitColumns",
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
                    sorter: "string"
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
                    sorter: "number",
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
                    sorter: "number"
                },
                {
                    title: "Priority",
                    field: "priority",
                    width: 100,
                    sorter: "string",
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
                    sorter: "date"
                },
                {
                    title: "Alert Date",
                    field: "alertDate",
                    width: 120,
                    sorter: "date"
                },
                {
                    title: "Supplier",
                    field: "supplier",
                    width: 150,
                    sorter: "string"
                },
                {
                    title: "Acknowledged",
                    field: "acknowledged",
                    width: 120,
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

    handleAcknowledgment(productId, isAcknowledged, productData) {
        if (isAcknowledged) {
            this.acknowledgedAlerts.add(productId);
            this.saveAcknowledgmentToAppDB(productData);
            this.showSuccessMessage(`Alert acknowledged for ${productData.productName}`);
            
            // If we're showing pending only, hide the row after a brief delay
            if (this.currentFilter === 'pending') {
                setTimeout(() => {
                    this.updateTableData();
                }, 1000);
            }
        } else {
            this.acknowledgedAlerts.delete(productId);
            this.removeAcknowledgmentFromAppDB(productId);
            this.showSuccessMessage(`Acknowledgment removed for ${productData.productName}`);
        }
        
        this.updateStats();
    }

    saveAcknowledgmentToAppDB(productData) {
        // In a real Domo app, this would save to AppDB
        // For demo purposes, we'll simulate this with localStorage
        const acknowledgmentData = {
            productId: productData.productId,
            productName: productData.productName,
            category: productData.category,
            acknowledgedAt: new Date().toISOString(),
            acknowledgedBy: "Current User", // In Domo, this would be the actual user
            alertId: productData.id,
            originalAlertDate: productData.alertDate
        };

        // Simulate AppDB save
        console.log("Saving to AppDB:", acknowledgmentData);
        
        // Store in localStorage for demo
        const existingData = JSON.parse(localStorage.getItem('acknowledgedAlerts') || '[]');
        existingData.push(acknowledgmentData);
        localStorage.setItem('acknowledgedAlerts', JSON.stringify(existingData));
        
        // In a real Domo app, you would use:
        // domo.post('/data/v1/appdb/acknowledged-alerts', acknowledgmentData);
    }

    removeAcknowledgmentFromAppDB(productId) {
        // In a real Domo app, this would remove from AppDB
        console.log("Removing from AppDB for product ID:", productId);
        
        // Remove from localStorage for demo
        const existingData = JSON.parse(localStorage.getItem('acknowledgedAlerts') || '[]');
        const filteredData = existingData.filter(item => item.alertId !== productId);
        localStorage.setItem('acknowledgedAlerts', JSON.stringify(filteredData));
        
        // In a real Domo app, you would use:
        // domo.delete(`/data/v1/appdb/acknowledged-alerts/${productId}`);
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
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.outOfStockAlertsApp = new OutOfStockAlertsApp();
});

// Export for potential use in other parts of the Domo platform
if (typeof module !== 'undefined' && module.exports) {
    module.exports = OutOfStockAlertsApp;
}
