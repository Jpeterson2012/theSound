const express = require('express');
const router = express.Router();
const { con } = require('../sql.js')

router.get('/:id', async (req, res) => {
  const headers = {
    Authorization: 'Bearer ' + req.session.access_token
  };

  var pages = 0;  
  let sqlObj = {items: []};
  // var a = {}
  // var arr = []
  
  while(true) {
    const url = `https://api.spotify.com/v1/playlists/${req.params.id}/tracks?offset=${pages}&limit=35`;
    const resp = await fetch(url, {headers});
    const data = await resp.json();
        
    const album = {images: [{height: 64, url: 'https://images.inc.com/uploaded_files/image/1920x1080/getty_626660256_2000108620009280158_388846.jpg', width: 64}]};

    const arr = data.items?.map(item => {
      sqlObj.items.push({
        images: item.track?.album ? item.track?.album.images : album,
        name: item.track?.name, 
        duration_ms: item.track?.duration_ms,
        artists: item.track?.artists, 
        uri: item.track?.uri, 
        track_number: item.track?.track_number,
        date_added: new Date(item.added_at ?? Date.now())
      });

      return {
        album_id: item.track?.album.id, 
        images: item.track?.album ? item.track?.album.images : album, 
        name: item.track?.name, 
        duration_ms: item.track?.duration_ms, 
        artists: item.track?.artists, 
        uri: item.track?.uri,
        date_added: new Date(item.added_at ?? Date.now())
      };
    });

    console.log(sqlObj.items[0])

    res.write(JSON.stringify({items: arr, total: data.total}) + "\n");
    
    pages += 35;

    if(!data.next) {
      break;
    }
  }    
  //a.items = arr
  // res.send(a)
  res.end();

  try{            
    let sql = `select playlist_id from ${req.session.username}playlists where name = "temp_playlist"`;

    con.query(sql, (err,result) => {
      if (err) throw err;
            
      if (!result.length) {        
        sql = `INSERT INTO ${req.session.username}playlists (playlist_id, images, name, public, uri, tracks) VALUES ?`;

        const values = [[
          req.params.id, null, 'temp_playlist', "true", 'spotify:playlist:${req.params.id}', JSON.stringify(sqlObj)
        ]];

        con.query(sql, [values], (err) => {
          if (err) throw err;

          console.log('Temp Playlist Added')
        });
      }
      else {
        if (result[0].playlist_id === req.params.id){
          console.log('playlist already exists');
        }
        else{        
          sql = `UPDATE ${req.session.username}playlists SET playlist_id='${req.params.id}',uri='spotify:playlist:${req.params.id}',tracks=${con.escape(JSON.stringify(sqlObj))}  WHERE name = "temp_playlist"`;
          con.query(sql, (err) => {
            if (err) throw err;

            console.log('Temp Playlist Updated');
          });
        }   
      }
    });     
  }
  catch(e){
    console.log(e);
  }    
});

module.exports = router;