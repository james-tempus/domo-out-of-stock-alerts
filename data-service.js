// Data Service for Domo Out-of-Stock Alerts App
// Handles data retrieval from both local SQL (development) and Domo datasets (production)

class DataService {
    constructor() {
        this.isProduction = typeof domo !== 'undefined';
        this.datasetId = 'product-alerts-dataset'; // From manifest.json
        this.localData = null;
    }

    // Initialize data service
    async init() {
        if (this.isProduction) {
            console.log('Running in production mode - will use Domo dataset');
            return await this.loadDomoData();
        } else {
            console.log('Running in development mode - using local sample data');
            return await this.loadLocalData();
        }
    }

    // Load data from Domo dataset (production)
    async loadDomoData() {
        try {
            console.log('Loading data from Domo dataset:', this.datasetId);
            
            // Query the Domo dataset
            const data = await domo.get(`/data/v1/${this.datasetId}`);
            
            // Transform Domo data to match our expected format
            return data.map((row, index) => ({
                id: row.id || index + 1,
                productId: row.product_id || row.productId,
                productName: row.product_name || row.productName,
                category: row.category,
                currentStock: row.current_stock || row.currentStock,
                minThreshold: row.min_threshold || row.minThreshold,
                lastRestock: row.last_restock || row.lastRestock,
                priority: row.priority,
                status: row.status,
                alertDate: row.alert_date || row.alertDate,
                supplier: row.supplier,
                acknowledged: row.acknowledged || false
            }));
        } catch (error) {
            console.error('Error loading Domo data:', error);
            // Fallback to local data if Domo query fails
            console.log('Falling back to local sample data');
            return await this.loadLocalData();
        }
    }

    // Load local sample data (development)
    async loadLocalData() {
        try {
            // In development mode, use fallback sample data
            // In a real implementation, you might use a local SQLite database
            console.log('Using fallback sample data for development');
            return this.getFallbackData();
        } catch (error) {
            console.error('Error loading local data:', error);
            return this.getFallbackData();
        }
    }

    // Fallback data if everything else fails
    getFallbackData() {
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

    // Save acknowledgment to Domo AppDB (production)
    async saveAcknowledgment(productData) {
        if (this.isProduction) {
            try {
                console.log('Saving acknowledgment to Domo AppDB:', productData.productId);
                
                const acknowledgmentData = {
                    productId: productData.productId,
                    productName: productData.productName,
                    acknowledgedAt: new Date().toISOString(),
                    acknowledgedBy: 'user' // In production, get actual user ID
                };

                await domo.post('/data/v1/appdb/acknowledged-alerts', acknowledgmentData);
                console.log('Acknowledgment saved to AppDB');
            } catch (error) {
                console.error('Error saving to AppDB:', error);
                throw error;
            }
        } else {
            // Development mode - use localStorage
            console.log('Saving acknowledgment to localStorage:', productData.productId);
            
            const existingData = JSON.parse(localStorage.getItem('acknowledgedAlerts') || '[]');
            const acknowledgmentData = {
                productId: productData.productId,
                productName: productData.productName,
                acknowledgedAt: new Date().toISOString(),
                acknowledgedBy: 'user'
            };
            
            existingData.push(acknowledgmentData);
            localStorage.setItem('acknowledgedAlerts', JSON.stringify(existingData));
        }
    }

    // Remove acknowledgment from Domo AppDB (production)
    async removeAcknowledgment(productId) {
        if (this.isProduction) {
            try {
                console.log('Removing acknowledgment from Domo AppDB:', productId);
                
                await domo.delete(`/data/v1/appdb/acknowledged-alerts/${productId}`);
                console.log('Acknowledgment removed from AppDB');
            } catch (error) {
                console.error('Error removing from AppDB:', error);
                throw error;
            }
        } else {
            // Development mode - use localStorage
            console.log('Removing acknowledgment from localStorage:', productId);
            
            const existingData = JSON.parse(localStorage.getItem('acknowledgedAlerts') || '[]');
            const filteredData = existingData.filter(item => item.productId !== productId);
            localStorage.setItem('acknowledgedAlerts', JSON.stringify(filteredData));
        }
    }

    // Load acknowledged alerts from storage
    async loadAcknowledgedAlerts() {
        if (this.isProduction) {
            try {
                console.log('Loading acknowledged alerts from Domo AppDB');
                
                const data = await domo.get('/data/v1/appdb/acknowledged-alerts');
                return new Set(data.map(item => item.productId));
            } catch (error) {
                console.error('Error loading acknowledged alerts from AppDB:', error);
                return new Set();
            }
        } else {
            // Development mode - use localStorage
            console.log('Loading acknowledged alerts from localStorage');
            
            const data = JSON.parse(localStorage.getItem('acknowledgedAlerts') || '[]');
            return new Set(data.map(item => item.productId));
        }
    }
}

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = DataService;
}
