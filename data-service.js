// Data Service for Domo Out-of-Stock Alerts App
// Handles data retrieval from both local SQL (development) and Domo datasets (production)
// Implements proper Domo dataset querying with SQL and filter listening

class DataService {
    constructor() {
        this.isProduction = typeof domo !== 'undefined';
        this.datasetAlias = 'product-alerts'; // From manifest.json mapping
        this.localData = null;
        this.currentFilters = {}; // Store current page filters
        this.filterListeners = []; // Store filter change listeners
    }

    // Initialize data service
    async init() {
        if (this.isProduction) {
            console.log('Running in production mode - will use Domo dataset');
            this.setupFilterListening(); // Set up filter listening
            return await this.loadDomoData();
        } else {
            console.log('Running in development mode - using local sample data');
            return await this.loadLocalData();
        }
    }

    // Load data from Domo dataset (production) using proper SQL querying
    async loadDomoData() {
        try {
            console.log('Loading data from Domo dataset alias:', this.datasetAlias);
            
            // Build SQL query with filters
            const sqlQuery = this.buildSQLQuery();
            console.log('Executing SQL query:', sqlQuery);
            
            // Query the Domo dataset using proper SQL syntax
            const data = await domo.query(sqlQuery);
            
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

                // Use Domo's AppDB API
                await domo.post('/data/v1/appdb/acknowledged-alerts', acknowledgmentData);
                console.log('Acknowledgment saved to AppDB collection');
                
                // Trigger manual sync to dataset (if syncEnabled is true in manifest)
                await this.triggerCollectionSync('acknowledged-alerts');
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
                
                // First, get the document ID for the productId
                const existingData = await domo.get('/data/v1/appdb/acknowledged-alerts');
                const documentToDelete = existingData.find(item => item.productId === productId);
                
                if (documentToDelete && documentToDelete._id) {
                    // Use Domo's AppDB API to delete by document ID
                    await domo.delete(`/data/v1/appdb/acknowledged-alerts/${documentToDelete._id}`);
                    console.log('Acknowledgment removed from AppDB collection');
                } else {
                    console.log('No acknowledgment found to remove for productId:', productId);
                }
                
                // Trigger manual sync to dataset (if syncEnabled is true in manifest)
                await this.triggerCollectionSync('acknowledged-alerts');
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
                console.log('Loading acknowledged alerts from Domo AppDB collection');
                
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

    // Trigger manual sync of AppDB collection to dataset
    async triggerCollectionSync(collectionName) {
        if (this.isProduction) {
            try {
                console.log(`Triggering manual sync for collection: ${collectionName}`);
                
                // Use Domo's manual export API to force sync to dataset
                // Note: This endpoint may vary based on Domo's implementation
                // The sync is typically handled by the manifest syncEnabled configuration
                await domo.post(`/data/v1/appdb/${collectionName}/export`);
                console.log(`Manual sync triggered for collection: ${collectionName}`);
            } catch (error) {
                console.error(`Error triggering sync for collection ${collectionName}:`, error);
                // Don't throw error - sync failure shouldn't break the app
                // The automatic sync via manifest should still work
            }
        } else {
            console.log(`Manual sync triggered for collection: ${collectionName} (development mode - no actual sync)`);
        }
    }

    // Build SQL query with current filters applied
    buildSQLQuery() {
        let baseQuery = `SELECT 
            product_id,
            product_name,
            category,
            current_stock,
            min_threshold,
            last_restock,
            priority,
            status,
            alert_date,
            supplier
        FROM ${this.datasetAlias}`;
        
        // Add WHERE clause if filters are applied
        const whereConditions = this.buildWhereConditions();
        if (whereConditions.length > 0) {
            baseQuery += ` WHERE ${whereConditions.join(' AND ')}`;
        }
        
        // Add ORDER BY for consistent results
        baseQuery += ` ORDER BY alert_date DESC, priority DESC`;
        
        return baseQuery;
    }

    // Build WHERE conditions from current filters
    buildWhereConditions() {
        const conditions = [];
        
        // Map common filter types to SQL conditions
        Object.keys(this.currentFilters).forEach(filterKey => {
            const filterValue = this.currentFilters[filterKey];
            
            if (filterValue && filterValue !== '') {
                // Map filter keys to database column names
                const columnMap = {
                    'category': 'category',
                    'priority': 'priority',
                    'status': 'status',
                    'supplier': 'supplier',
                    'product_name': 'product_name'
                };
                
                const columnName = columnMap[filterKey] || filterKey;
                
                if (Array.isArray(filterValue)) {
                    // Handle array filters (e.g., multiple categories)
                    const values = filterValue.map(v => `'${v.replace(/'/g, "''")}'`).join(', ');
                    conditions.push(`${columnName} IN (${values})`);
                } else if (typeof filterValue === 'string') {
                    // Handle string filters
                    if (filterValue.includes('%') || filterValue.includes('*')) {
                        // Wildcard search
                        const searchValue = filterValue.replace(/\*/g, '%').replace(/'/g, "''");
                        conditions.push(`${columnName} LIKE '${searchValue}'`);
                    } else {
                        // Exact match
                        conditions.push(`${columnName} = '${filterValue.replace(/'/g, "''")}'`);
                    }
                } else if (typeof filterValue === 'object' && filterValue.min !== undefined) {
                    // Handle range filters
                    if (filterValue.min !== null && filterValue.min !== '') {
                        conditions.push(`${columnName} >= ${filterValue.min}`);
                    }
                    if (filterValue.max !== null && filterValue.max !== '') {
                        conditions.push(`${columnName} <= ${filterValue.max}`);
                    }
                }
            }
        });
        
        return conditions;
    }

    // Set up filter listening for page-level filters using proper Domo JS API
    setupFilterListening() {
        if (!this.isProduction) {
            console.log('Filter listening not available in development mode');
            return;
        }

        try {
            // Use the proper Domo JS API for filter listening
            // This listens for filter updates on the page
            domo.onFiltersUpdate((filters) => {
                console.log('Page filters updated:', filters);
                this.handleFilterChange(filters);
            });

            // Also listen for data updates that might affect our dataset
            domo.onDataUpdate((alias) => {
                console.log('Data updated for alias:', alias);
                if (alias === this.datasetAlias) {
                    console.log('Our dataset was updated, refreshing data');
                    this.handleDataUpdate();
                }
            });

            console.log('Filter listening setup complete using domo.onFiltersUpdate()');
        } catch (error) {
            console.error('Error setting up filter listening:', error);
        }
    }

    // Handle data updates
    handleDataUpdate() {
        try {
            console.log('Handling data update, refreshing data');
            // Notify listeners that data should be refreshed
            this.notifyFilterListeners();
        } catch (error) {
            console.error('Error handling data update:', error);
        }
    }

    // Handle filter changes and update current filters
    handleFilterChange(filterData) {
        try {
            // Domo filters come in a specific format with column, operator, values, dataType
            // Convert Domo filter format to our internal format
            if (filterData && Array.isArray(filterData)) {
                this.currentFilters = {};
                
                filterData.forEach(filter => {
                    if (filter.column && filter.values) {
                        const columnName = filter.column;
                        const values = filter.values;
                        
                        // Map Domo filter operators to our SQL conditions
                        switch (filter.operator) {
                            case 'IN':
                                this.currentFilters[columnName] = values;
                                break;
                            case 'EQUALS':
                                this.currentFilters[columnName] = values[0];
                                break;
                            case 'CONTAINS':
                                this.currentFilters[columnName] = `%${values[0]}%`;
                                break;
                            case 'BETWEEN':
                                if (values.length >= 2) {
                                    this.currentFilters[columnName] = {
                                        min: values[0],
                                        max: values[1]
                                    };
                                }
                                break;
                            case 'GREATER_THAN':
                                this.currentFilters[columnName] = {
                                    min: values[0]
                                };
                                break;
                            case 'LESS_THAN':
                                this.currentFilters[columnName] = {
                                    max: values[0]
                                };
                                break;
                            default:
                                // For other operators, store as-is
                                this.currentFilters[columnName] = values[0];
                        }
                    }
                });
                
                console.log('Updated filters from Domo format:', this.currentFilters);
                
                // Notify listeners that filters have changed
                this.notifyFilterListeners();
            }
        } catch (error) {
            console.error('Error handling filter change:', error);
        }
    }

    // Add a listener for filter changes
    addFilterListener(callback) {
        this.filterListeners.push(callback);
    }

    // Remove a filter listener
    removeFilterListener(callback) {
        const index = this.filterListeners.indexOf(callback);
        if (index > -1) {
            this.filterListeners.splice(index, 1);
        }
    }

    // Notify all filter listeners
    notifyFilterListeners() {
        this.filterListeners.forEach(callback => {
            try {
                callback(this.currentFilters);
            } catch (error) {
                console.error('Error in filter listener callback:', error);
            }
        });
    }

    // Refresh data with current filters
    async refreshData() {
        if (this.isProduction) {
            return await this.loadDomoData();
        } else {
            return await this.loadLocalData();
        }
    }

    // Create programmatic filters using domo.filterContainer()
    createFilter(column, operator, values, dataType = 'STRING') {
        if (!this.isProduction) {
            console.log('Filter creation not available in development mode');
            return;
        }

        try {
            const filterConfig = [{
                column: column,
                operator: operator,
                values: values,
                dataType: dataType
            }];

            console.log('Creating filter:', filterConfig);
            domo.filterContainer(filterConfig);
        } catch (error) {
            console.error('Error creating filter:', error);
        }
    }

    // Create common filter types for our app
    createCategoryFilter(categories) {
        this.createFilter('category', 'IN', categories, 'STRING');
    }

    createPriorityFilter(priorities) {
        this.createFilter('priority', 'IN', priorities, 'STRING');
    }

    createStatusFilter(statuses) {
        this.createFilter('status', 'IN', statuses, 'STRING');
    }

    createStockRangeFilter(minStock, maxStock) {
        this.createFilter('current_stock', 'BETWEEN', [minStock, maxStock], 'NUMBER');
    }

    createProductNameFilter(searchTerm) {
        this.createFilter('product_name', 'CONTAINS', [searchTerm], 'STRING');
    }
}

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = DataService;
}
