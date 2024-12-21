var mystuff = require("./AuthRoutes.js");
var express = require('express');
var router = express.Router();
const { con } = require('../sql.js')

x = {
  aInternal: 10,
  aListener: function (val) {},
  set a(val) {
    this.aInternal = val;
    this.aListener(val);
  },
  get a() {
    return this.aInternal;
  },
  registerListener: function(listener) {
    this.aListener = listener
  }
}


router.get('/', async (req, res) => {

  const body = {
      grant_type: 'authorization_code',
      code: req.query.code,
      redirect_uri: process.env.REDIRECTURI,
      client_id: process.env.CLIENT_ID,
      client_secret: process.env.CLIENT_SECRET,
    }
  
  await fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      "Accept": "application/json"
    },
    body: mystuff.encodeFormData(body)
  })
  .then(response => response.json())
  .then(data => {
    process.env['access_token'] = data.access_token
    
    var url = 'https://api.spotify.com/v1/me'
    const headers = {
      Authorization: 'Bearer ' + data.access_token
    }
    fetch(url, { headers })
    .then(response => response.json())
    .then(data => {
      var temp = data.display_name
      process.env['username'] = data.display_name
      var sql = `CREATE DATABASE IF NOT EXISTS ${temp}`
      con.query(sql, (err) => {
        if (err) throw err;
        console.log(`Database for user ${data.display_name} created!`)
      })
      sql = `USE ${temp}`
      process.env['DB'] = temp
      con.query(sql, (err) => {
        if (err) throw err;
        // console.log('Database selected!')
      })
      sql = "CREATE TABLE IF NOT EXISTS ualbums (id INT AUTO_INCREMENT PRIMARY KEY, total_tracks SMALLINT(2), album_id VARCHAR(30), images MEDIUMTEXT, name VARCHAR(75), release_date VARCHAR(10), uri VARCHAR(40), artists MEDIUMTEXT, tracks MEDIUMTEXT, label_name VARCHAR(75), popularity SMALLINT(3))"
      con.query(sql, (err) => {
        if (err) throw err;
        // console.log('User Album table created!')
      })
      sql = "CREATE TABLE IF NOT EXISTS uplaylists (id INT AUTO_INCREMENT PRIMARY KEY, playlist_id VARCHAR(70), images LONGTEXT, name VARCHAR(100), public BOOL, uri varCHAR(40), tracks MEDIUMTEXT)"
      con.query(sql, (err) => {
        if (err) throw err;
        // console.log('User Playlist table created!')
      })
      sql = "CREATE TABLE IF NOT EXISTS likedsongs (id INT AUTO_INCREMENT PRIMARY KEY, album_id VARCHAR(30), images MEDIUMTEXT, artists MEDIUMTEXT, duration VARCHAR(10), track_id VARCHAR(30), name VARCHAR(100))"
      con.query(sql, (err) => {
        if (err) throw err;
        // console.log('Liked songs table created!')
      })
      sql = 'CREATE TABLE IF NOT EXISTS categories (id INT AUTO_INCREMENT PRIMARY KEY, href VARCHAR(100), icons MEDIUMTEXT, c_id VARCHAR(30), name VARCHAR(40))'
      con.query(sql, (err) => {
        if (err) throw err;
        // console.log('Category table created!')
      })
      sql = 'select exists (select 1 from ualbums) AS Output'
      con.query(sql, function(err, result) {
          if (err) throw err;
          var empty = result[0].Output
          //If table already has data read relevent data and send to front end
          if (empty != 1) {
            res.redirect('http://localhost:5173/1');
            const getStuff = async() => {
              //Fetch user's saved playlists
              var pages = 0
              while(true) {
                  

                url = `https://api.spotify.com/v1/me/playlists?offset=${pages}&limit=5`
                var resp = await fetch(url, {headers})
                var data = await resp.json()
                
                data.items.map(async a => {
                    // values.push([a.id, JSON.stringify(a.images), a.name, a.public, JSON.stringify(a.tracks)])
                  var values = []
                  var trackInfo = []
                  var trackJSON = {}
                  
                  const resp2 = await fetch(a.tracks.href, {headers})
                  const data2 = await resp2.json()
  
                  data2.items.map(a => {a.track ? trackInfo.push(a.track) : null})
                  trackJSON.items = trackInfo
                  
                  values.push([a.id, JSON.stringify(a.images), a.name, a.public, a.uri, JSON.stringify(trackJSON)])
                  var sql = "INSERT INTO uplaylists (playlist_id, images, name, public, uri, tracks) VALUES ?"
                  con.query(sql, [values], function(err, result) {
                      if (err) throw err;
                      console.log("Number of playlists inserted: " + result.affectedRows);
                  })
                    
                    
                    //Gearsofwar3!
                    
                })
                
                pages += 5
                
                if(data.next == null) {
                    console.log("done")
                    break
                } 
              }

              
              
              var pages = 0

              //fetch user's saved albums
              while(true) {
                  url = `https://api.spotify.com/v1/me/albums?offset=${pages}`
                  var resp = await fetch(url, {headers})
                  var data = await resp.json()
                  var values = []
                  data.items.map(a => values.push([a.album.total_tracks, a.album.id, JSON.stringify(a.album.images), a.album.name, a.album.release_date, a.album.uri, JSON.stringify(a.album.artists), JSON.stringify(a.album.tracks), a.album.label, a.album.popularity]))
                  var sql = "INSERT INTO ualbums (total_tracks,album_id, images, name, release_date, uri, artists, tracks, label_name, popularity) VALUES ?"
                  con.query(sql, [values], function(err, result) {
                      if (err) throw err;
                      console.log("Number of albums inserted: " + result.affectedRows);
                  })
                  pages += 20
                 
                  if(data.next == null) {
                      break
                  } 
              }

              //Fetch user's liked songs
              var pages = 0
              while(true) {
                  url = `https://api.spotify.com/v1/me/tracks?offset=${pages}&limit=30`
                  var resp = await fetch(url, {headers})
                  var data = await resp.json()
                  var values = []
                  data.items.map(a => values.push([a.track.album.id, JSON.stringify(a.track.album.images), JSON.stringify(a.track.album.artists), a.track.duration_ms, a.track.id, a.track.name]))
                  var sql = "INSERT INTO likedsongs (album_id, images, artists, duration, track_id, name) VALUES ?"
                  con.query(sql, [values], function(err, result) {
                      if (err) throw err;
                      console.log("Number of liked songs inserted: " + result.affectedRows);
                  })
                  pages += 30
                 
                  if(data.next == null) {
                    console.log('FINISHED!')
                    x.a = 42
                    
                      break
                  }
              }

            }
            getStuff()
          }
          else res.redirect('http://localhost:5173/app/');

      })
    })
    .catch(error => {
      throw error
    });
    
    
  });



})
router.get('/emit', async (req, res) => {
  x.registerListener(function(val) {
    res.send('hello')
  }) 
})

module.exports = router;
  