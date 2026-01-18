CREATE TABLE IF NOT EXISTS user_playlists (
    id INT AUTO_INCREMENT PRIMARY KEY, 
    playlist_id VARCHAR(70), 
    images JSON, name VARCHAR(100), 
    public BOOL, 
    uri varCHAR(40),
    tracks JSON,        
    user_id INT,
    CONSTRAINT fk_playlists_user
        FOREIGN KEY(user_id)
        REFERENCES users(id)
        ON DELETE CASCADE
);