CREATE TABLE IF NOT EXISTS categories (
    id INT AUTO_INCREMENT PRIMARY KEY, 
    href VARCHAR(100), 
    icons JSON, 
    c_id VARCHAR(30), 
    name VARCHAR(40)
);