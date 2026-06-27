const express = require('express');
const router = express.Router();
const con = require('../database/dbpool.js');
const { asyncHandler, spotifyRequest } = require('../utils.js');

router.get('/:id', asyncHandler(async (req, res) => {  
  const state = {pages: 0, next: "next", sqlPayload: {items: []}};

  const defaultAlbum = {images: [{height: 64, url: 'https://images.inc.com/uploaded_files/image/1920x1080/getty_626660256_2000108620009280158_388846.jpg', width: 64}]};

  do {
    const data = await spotifyRequest(`playlists/${req.params.id}/tracks?offset=${state.pages}&limit=35`, req.token);    

    const payload = data.items?.map(item => {
      state.sqlPayload.items.push({
        images: item.track?.album ? item.track?.album.images : defaultAlbum,
        name: item.track?.name, 
        duration_ms: item.track?.duration_ms,
        artists: item.track?.artists, 
        uri: item.track?.uri, 
        track_number: item.track?.track_number,
        date_added: new Date(item.added_at ?? Date.now())
      });

      return {
        album_id: item.track?.album.id, 
        images: item.track?.album ? item.track?.album.images : defaultAlbum, 
        name: item.track?.name, 
        duration_ms: item.track?.duration_ms, 
        artists: item.track?.artists, 
        uri: item.track?.uri,
        date_added: new Date(item.added_at ?? Date.now())
      };
    });    

    res.write(JSON.stringify({items: payload, total: data.total}) + "\n");
    
    state.next = data.next;
    
    state.pages += 35;
  } while (state.next);    
  
  res.end();

  try{            
    let sql = `select playlist_id from user_playlists where name = "temp_playlist" AND user_id = ${req.user.id}`;

    const [result] = await con.query(sql);    

    if (!result.length) {        
      sql = `INSERT INTO user_playlists (user_id, playlist_id, images, name, public, uri, tracks) VALUES ?`;

      const values = [[
        req.user.id, req.params.id, null, 'temp_playlist', true, `spotify:playlist:${req.params.id}`, JSON.stringify(state.sqlPayload)
      ]];

      await con.query(sql, [values]);

      console.log('Temp Playlist Added');
    } else {
      if (result[0].playlist_id === req.params.id){
        console.log('playlist already exists');
      } else {        
        sql = 'UPDATE user_playlists SET playlist_id = ?, uri = ?, tracks = ? WHERE name = "temp_playlist" AND user_id = ?';

        await con.query(
          sql, 
          [req.params.id, `spotify:playlist:${req.params.id}`, JSON.stringify(state.sqlPayload), req.user.id]);

        console.log('Temp Playlist Updated');
      }   
    }     
  } catch(e) {
    console.log(e);
  }    
}));

module.exports = router;