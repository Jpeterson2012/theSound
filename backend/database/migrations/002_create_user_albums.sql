CREATE TABLE IF NOT EXISTS user_albums (
    id INT AUTO_INCREMENT PRIMARY KEY, 
    album_type VARCHAR(30), 
    total_tracks SMALLINT(2), 
    album_id VARCHAR(30), 
    images JSON, 
    name VARCHAR(75), 
    release_date VARCHAR(10), 
    uri VARCHAR(40), 
    artists JSON, 
    tracks JSON, 
    copyrights JSON, 
    label_name VARCHAR(75), 
    date_added DATETIME,
    user_id INT,
    CONSTRAINT fk_albums_user
        FOREIGN KEY(user_id)
        REFERENCES users(id)
        ON DELETE CASCADE
);