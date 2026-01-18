CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY, 
    username VARCHAR(50), 
    access_token VARCHAR(500),
    refresh_token VARCHAR(500),
    expires_in INT
);