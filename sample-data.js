// Sample data for Domo Out-of-Stock Alerts App
// This data simulates what would come from a Domo dataset in production

const SAMPLE_DATA = [
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

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = SAMPLE_DATA;
}
