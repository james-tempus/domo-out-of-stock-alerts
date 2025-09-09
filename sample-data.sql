-- Sample data for Domo Out-of-Stock Alerts App
-- This SQL creates a table and inserts sample product data
-- In production, this would be replaced by a Domo dataset query

CREATE TABLE IF NOT EXISTS product_alerts (
    id INTEGER PRIMARY KEY,
    product_id VARCHAR(50) NOT NULL,
    product_name VARCHAR(255) NOT NULL,
    category VARCHAR(100) NOT NULL,
    current_stock INTEGER NOT NULL,
    min_threshold INTEGER NOT NULL,
    last_restock DATE,
    priority VARCHAR(20) NOT NULL,
    status VARCHAR(50) NOT NULL,
    alert_date DATE NOT NULL,
    supplier VARCHAR(255) NOT NULL,
    acknowledged BOOLEAN DEFAULT FALSE
);

-- Insert sample data
INSERT INTO product_alerts (id, product_id, product_name, category, current_stock, min_threshold, last_restock, priority, status, alert_date, supplier, acknowledged) VALUES
(1, 'PROD-001', 'Wireless Bluetooth Headphones', 'Electronics', 0, 10, '2024-01-15', 'high', 'out-of-stock', '2024-01-20', 'TechSupply Co.', FALSE),
(2, 'PROD-002', 'Organic Coffee Beans (1lb)', 'Food & Beverage', 2, 15, '2024-01-18', 'high', 'low-stock', '2024-01-21', 'Green Bean Co.', FALSE),
(3, 'PROD-003', 'Stainless Steel Water Bottle', 'Home & Kitchen', 0, 25, '2024-01-10', 'medium', 'out-of-stock', '2024-01-19', 'Kitchen Essentials', FALSE),
(4, 'PROD-004', 'Yoga Mat (Premium)', 'Sports & Fitness', 1, 8, '2024-01-16', 'medium', 'low-stock', '2024-01-22', 'Fitness Pro', FALSE),
(5, 'PROD-005', 'LED Desk Lamp', 'Office Supplies', 0, 12, '2024-01-12', 'high', 'out-of-stock', '2024-01-18', 'Office Solutions', FALSE),
(6, 'PROD-006', 'Cotton T-Shirt (Black)', 'Clothing', 3, 20, '2024-01-14', 'low', 'low-stock', '2024-01-23', 'Fashion Forward', FALSE),
(7, 'PROD-007', 'Smartphone Case (Clear)', 'Electronics', 0, 30, '2024-01-08', 'medium', 'out-of-stock', '2024-01-17', 'TechSupply Co.', FALSE),
(8, 'PROD-008', 'Protein Powder (Vanilla)', 'Health & Wellness', 1, 5, '2024-01-19', 'high', 'low-stock', '2024-01-24', 'Health Plus', FALSE);

-- Query to get all alerts (this would be used in production)
-- SELECT * FROM product_alerts ORDER BY alert_date DESC;
