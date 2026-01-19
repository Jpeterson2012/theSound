CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    spotify_id VARCHAR(50) UNIQUE, 
    username VARCHAR(50) UNIQUE, 
    access_token VARCHAR(500),
    refresh_token VARCHAR(500),
    expires_in INT
);