const { con } = require('../sql.js')
var mystuff = require("./AuthRoutes.js");
var express = require('express');
var router = express.Router();

const EventEmitter = require('events');
const myEmitter = new EventEmitter()

router.get('/', async (req, res) => {

  const body = {
      grant_type: 'authorization_code',
      code: req.query.code,
      redirect_uri: process.env.REDIRECTURI,                  
    }
  
  await fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      "Accept": "application/json",
      'Authorization': 'Basic ' + (new Buffer.from(process.env.CLIENT_ID + ':' + process.env.CLIENT_SECRET).toString('base64'))
    },
    body: mystuff.encodeFormData(body)
  })
  .then(response => response.json())
  .then(data => {
    req.session.access_token = data.access_token
    req.session.refresh_token = data.refresh_token
    req.session.expires_in = data.expires_in
    
    var url = 'https://api.spotify.com/v1/me'
    const headers = {
      Authorization: 'Bearer ' + data.access_token
    }
    fetch(url, { headers })
    .then(response => response.json())
    .then(data => {
      // var temp = data.display_name.replace(/\W/g,'')
       
      process.env['username'] = data.display_name.replace(/\W/g,'')
      req.session.username = data.display_name.replace(/\W/g,'')      
      
      // sql = "CREATE TABLE IF NOT EXISTS ualbums (id INT AUTO_INCREMENT PRIMARY KEY, album_type VARCHAR(30), total_tracks SMALLINT(2), album_id VARCHAR(30), images MEDIUMTEXT, name VARCHAR(75), release_date VARCHAR(10), uri VARCHAR(40), artists MEDIUMTEXT, tracks MEDIUMTEXT, copyrights MEDIUMTEXT, label_name VARCHAR(75))"
      sql = `CREATE TABLE IF NOT EXISTS ${req.session.username}albums (id INT AUTO_INCREMENT PRIMARY KEY, album_type VARCHAR(30), total_tracks SMALLINT(2), album_id VARCHAR(30), images MEDIUMTEXT, name VARCHAR(75), release_date VARCHAR(10), uri VARCHAR(40), artists MEDIUMTEXT, tracks MEDIUMTEXT, copyrights MEDIUMTEXT, label_name VARCHAR(75))`
      con.query(sql, (err) => {
        if (err) throw err;
        // console.log('User Album table created!')
      })
      // sql = "CREATE TABLE IF NOT EXISTS uplaylists (id INT AUTO_INCREMENT PRIMARY KEY, playlist_id VARCHAR(70), images LONGTEXT, name VARCHAR(100), public BOOL, uri varCHAR(40), tracks MEDIUMTEXT)"
      // sql = "CREATE TABLE IF NOT EXISTS uplaylists (id INT AUTO_INCREMENT PRIMARY KEY, playlist_id VARCHAR(70), images LONGTEXT, name VARCHAR(100), public BOOL, uri varCHAR(40), tracks JSON)"
      sql = `CREATE TABLE IF NOT EXISTS ${req.session.username}playlists (id INT AUTO_INCREMENT PRIMARY KEY, playlist_id VARCHAR(70), images LONGTEXT, name VARCHAR(100), public BOOL, uri varCHAR(40), tracks JSON)`
      con.query(sql, (err) => {
        if (err) throw err;
        // console.log('User Playlist table created!')
      })
      // sql = "CREATE TABLE IF NOT EXISTS likedsongs (id INT AUTO_INCREMENT PRIMARY KEY, album_id VARCHAR(30), images MEDIUMTEXT, artists MEDIUMTEXT, duration VARCHAR(10), track_id VARCHAR(60), name VARCHAR(200))"
      sql = `CREATE TABLE IF NOT EXISTS ${req.session.username}liked (id INT AUTO_INCREMENT PRIMARY KEY, album_id VARCHAR(30), images MEDIUMTEXT, artists MEDIUMTEXT, duration VARCHAR(10), track_id VARCHAR(60), name VARCHAR(200))`
      con.query(sql, (err) => {
        if (err) throw err;
        // console.log('Liked songs table created!')
      })
      sql = 'CREATE TABLE IF NOT EXISTS categories (id INT AUTO_INCREMENT PRIMARY KEY, href VARCHAR(100), icons MEDIUMTEXT, c_id VARCHAR(30), name VARCHAR(40))'
      con.query(sql, (err) => {
        if (err) throw err;
        // console.log('Category table created!')
      })
      
      sql = `select exists (select 1 from ${req.session.username}albums) AS Output`
      con.query(sql, function(err, result) {
          if (err) throw err;
          var empty = result[0].Output
          //If table already has data read relevent data and send to front end
          if (empty !== 1) {
            res.redirect('http://localhost:5173/loading');            
            sql = `INSERT INTO users (username) values ("${req.session.username}")`
            con.query(sql, (err) => {
              if (err) throw err;
              // console.log('User Album table created!')
            })

            const getStuff = async () => {
              //Fetch user's saved playlists
              var pages = 0
              while(true) {
                  
                url = `https://api.spotify.com/v1/me/playlists?offset=${pages}&limit=5`
                var resp = await fetch(url, {headers})
                var data = await resp.json()
                
                data?.items?.map(async a => {
                    // values.push([a.id, JSON.stringify(a.images), a.name, a.public, JSON.stringify(a.tracks)])
                  var values = []
                  var trackInfo = []
                  var trackJSON = {}
                  
                  const resp2 = await fetch(a.tracks.href, {headers})
                  const data2 = await resp2.json()
  
                  data2.items.map(a => {a.track ? trackInfo.push(a.track) : null})
                  trackJSON.items = trackInfo
                  
                  values.push([a.id, JSON.stringify(a.images), a.name.replace(/\W/g,' '), a.public, a.uri, JSON.stringify(trackJSON)])
                  // var sql = "INSERT INTO uplaylists (playlist_id, images, name, public, uri, tracks) VALUES ?"
                  var sql = `INSERT INTO ${req.session.username}playlists (playlist_id, images, name, public, uri, tracks) VALUES ?`
                  con.query(sql, [values], function(err, result) {
                      if (err) throw err;
                      console.log("Number of playlists inserted: " + result.affectedRows);
                  })
                                                                                
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
                  data.items.map(a => values.push([a.album.album_type, a.album.total_tracks, a.album.id, JSON.stringify(a.album.images), a.album.name, a.album.release_date, a.album.uri, JSON.stringify(a.album.artists), JSON.stringify(a.album.tracks), JSON.stringify(a.album.copyrights), a.album.label]))
                  // var sql = "INSERT INTO ualbums (album_type,total_tracks,album_id, images, name, release_date, uri, artists, tracks, copyrights, label_name) VALUES ?"
                  var sql = `INSERT INTO ${req.session.username}albums (album_type,total_tracks,album_id, images, name, release_date, uri, artists, tracks, copyrights, label_name) VALUES ?`
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
                  data.items.map(a => values.push([a.track.album.id, JSON.stringify(a.track.album.images), JSON.stringify(a.track.album.artists), a.track.duration_ms, `spotify:track:${a.track.id}`, a.track.name]))
                  // var sql = "INSERT INTO likedsongs (album_id, images, artists, duration, track_id, name) VALUES ?"
                  var sql = `INSERT INTO ${req.session.username}liked (album_id, images, artists, duration, track_id, name) VALUES ?`
                  con.query(sql, [values], function(err, result) {
                      if (err) throw err;
                      console.log("Number of liked songs inserted: " + result.affectedRows);
                  })
                  pages += 30
                 
                  if(data.next == null) {
                    console.log('FINISHED!')                                        
                    break
                  }
              }

            }
            getStuff().then(() => {                            
              myEmitter.emit('loaded')
            })                        
          }
          else {                                                
            res.redirect('http://localhost:5173/app');
          }

      })
    })
    .catch(error => {
      throw error
    });    
    
  });
})

router.get('/emit', (req,res) => {
  myEmitter.on('loaded', () => {    
    res.send({"status": "done"})
  })
})


module.exports = router
  