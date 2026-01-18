CREATE TABLE IF NOT EXISTS user_liked (
    id INT AUTO_INCREMENT PRIMARY KEY, 
    album_id VARCHAR(30), 
    images JSON, 
    artists JSON, 
    duration VARCHAR(10), 
    track_id VARCHAR(60), 
    name VARCHAR(200), 
    date_added DATETIME,
    user_id INT,
    CONSTRAINT fk_liked_user
        FOREIGN KEY(user_id)
        REFERENCES users(id)
        ON DELETE CASCADE
);