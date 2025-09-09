// Domo App Manifest Configuration
// This file can be edited in Domo's Pro Code Editor
// The manifest.json is generated from this configuration

const manifestConfig = {
    name: "Out of Stock Alerts",
    version: "1.3.0",
    size: {
        width: 3,
        height: 2
    },
    fileName: "manifest.json",
    datasetsMapping: [
        {
            dataSetId: "00000000-0000-0000-0000-000000000000", // REPLACE_WITH_YOUR_ACTUAL_DATASET_ID
            alias: "product-alerts",
            fields: [
                {
                    alias: "productId",
                    columnName: "product_id"
                },
                {
                    alias: "productName",
                    columnName: "product_name"
                },
                {
                    alias: "category",
                    columnName: "category"
                },
                {
                    alias: "currentStock",
                    columnName: "current_stock"
                },
                {
                    alias: "minThreshold",
                    columnName: "min_threshold"
                },
                {
                    alias: "lastRestock",
                    columnName: "last_restock"
                },
                {
                    alias: "priority",
                    columnName: "priority"
                },
                {
                    alias: "status",
                    columnName: "status"
                },
                {
                    alias: "alertDate",
                    columnName: "alert_date"
                },
                {
                    alias: "supplier",
                    columnName: "supplier"
                }
            ],
            dql: null
        }
    ],
    collectionsMapping: [
        {
            id: "00000000-0000-0000-0000-000000000001", // REPLACE_WITH_YOUR_APPDB_COLLECTION_ID
            name: "acknowledged-alerts",
            syncEnabled: true,
            schema: {
                columns: [
                    {
                        name: "productId",
                        type: "STRING"
                    },
                    {
                        name: "productName",
                        type: "STRING"
                    },
                    {
                        name: "category",
                        type: "STRING"
                    },
                    {
                        name: "acknowledgedAt",
                        type: "DATETIME"
                    },
                    {
                        name: "acknowledgedBy",
                        type: "STRING"
                    }
                ]
            }
        }
    ],
    fullpage: true,
    packagesMapping: []
};

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = manifestConfig;
}

// Make available globally
if (typeof window !== 'undefined') {
    window.manifestConfig = manifestConfig;
}
