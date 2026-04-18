CREATE TABLE IF NOT EXISTS errors (
    id INT AUTO_INCREMENT PRIMARY KEY, 
    status INT, 
    message TEXT, 
    stack TEXT,
    route VARCHAR(255),
    method VARCHAR(10),
    user_id INT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP     
);