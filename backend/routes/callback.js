//Potential future option: 1 table instead of 3 with a column for type and just include all columns across the 3 tables in the one
const con = require('../sql.js');
const mystuff = require("./AuthRoutes.js");
const express = require('express');
const router = express.Router();
const {generateToken} = require('../jwt.js');

const EventEmitter = require('events');
const myEmitter = new EventEmitter();

const sqlQuery = (sql, uname = null) => {
  const query = `CREATE TABLE IF NOT EXISTS ${uname ?? ""}` + sql;

  //con.query(query, (err) => {
  //  if (err) throw err;        
  //});
};

const fetchPlaylists = async (uname, headers) => {
  let pages = 0;

  while(true) {
    let url = `https://api.spotify.com/v1/me/playlists?offset=${pages}&limit=25`;
    const resp = await fetch(url, {headers});
    const data = await resp.json();
    
    data?.items?.map(async a => {        
      const values = [];
      const trackInfo = [];
      const trackJSON = {};
      
      const resp2 = await fetch(a.tracks.href, {headers});
      const data2 = await resp2.json();

      data2.items.map(a => {a.track && trackInfo.push({...a.track, date_added: new Date(a.added_at ?? Date.now())})});
      trackJSON.items = trackInfo;
      
      //values.push([a.id, JSON.stringify(a.images), a.name.replace(/\W/g,' '), a.public, a.uri, JSON.stringify(trackJSON)])
      values.push([uname, a.id, JSON.stringify(a.images), a.name.replace(/&/g, 'n').replace(/[^\w]/g, ' '), a.public, a.uri, JSON.stringify(trackJSON)])
      
      let sql = 'INSERT INTO user_playlists (user_id, playlist_id, images, name, public, uri, tracks) VALUES ?';

      const [result] = await con.query(sql, [values]);

      console.log("Number of playlists inserted: " + result.affectedRows);
    });
    
    pages += 25;
    
    if(!data.next) {
      console.log("done");

      break;
    } 
  };
};

const fetchAlbums = async (uname, headers) => {
  let pages = 0;
  
  while(true) {
    let url = `https://api.spotify.com/v1/me/albums?offset=${pages}&limit=50`;
    const resp = await fetch(url, {headers});
    const data = await resp.json();
    const values = [];

    data.items.map(a => 
      values.push([
        uname, a.album.album_type, a.album.total_tracks, a.album.id, JSON.stringify(a.album.images), a.album.name, 
        a.album.release_date, a.album.uri, JSON.stringify(a.album.artists), JSON.stringify(a.album.tracks), 
        JSON.stringify(a.album.copyrights), a.album.label, new Date(a.added_at ?? Date.now())
      ])
    );

    let sql = `INSERT INTO user_albums (user_id, album_type,total_tracks,album_id, images, 
      name, release_date, uri, artists, tracks, copyrights, label_name, date_added) VALUES ?`;

    const [result] = await con.query(sql, [values]);

    console.log("Number of albums inserted: " + result.affectedRows);

    pages += 50;
    
    if(!data.next) {
      break;
    } 
  };
};

const fetchLikedSongs = async (uname, headers) => {
  let pages = 0;

  while(true) {
    let url = `https://api.spotify.com/v1/me/tracks?offset=${pages}&limit=50`;
    var resp = await fetch(url, {headers});
    var data = await resp.json();
    var values = [];

    data.items.map(a => 
      values.push([
        uname, a.track.album.id, JSON.stringify(a.track.album.images), JSON.stringify(a.track.album.artists), 
        a.track.duration_ms, `spotify:track:${a.track.id}`, a.track.name, new Date(a.added_at ?? Date.now()),
      ])
    );
    
    let sql = `INSERT INTO user_liked (user_id, album_id, images, artists, duration, track_id, name, date_added) VALUES ?`;
    const [result] = await con.query(sql, [values]);

    console.log("Number of liked songs inserted: " + result.affectedRows);

    pages += 50;
    
    if(!data.next) {
      console.log('FINISHED!');

      break;
    }
  };
};

router.get('/', async (req, res) => {
  const body = {
    grant_type: 'authorization_code',
    code: req.query.code,
    code_verifier: req.query.state,
    redirect_uri: process.env.REDIRECTURI,                  
  };

  try {
    const resp = await fetch('https://accounts.spotify.com/api/token', {
      method: 'POST',
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        "Accept": "application/json",
        'Authorization': 'Basic ' + (new Buffer.from(process.env.CLIENT_ID + ':' + process.env.CLIENT_SECRET).toString('base64'))
      },
      body: mystuff.encodeFormData(body),
    });

    const data = await resp.json();    
    
    //req.session.access_token = data.access_token;
    //req.session.refresh_token = data.refresh_token;
    //req.session.expires_in = data.expires_in;
    
    let url = 'https://api.spotify.com/v1/me';

    const headers = {
      Authorization: 'Bearer ' + data.access_token
    };

    const resp2 = await fetch(url, { headers });
    const data2 = await resp2.json();

    //process.env['username'] = data2.display_name.replace(/\W/g,'');
    //req.session.username = data2.display_name.replace(/\W/g,'');
    
    const username = data2.display_name.replace(/\W/g,'');
          
    let sql = `albums (id INT AUTO_INCREMENT PRIMARY KEY, album_type VARCHAR(30), total_tracks SMALLINT(2), 
    album_id VARCHAR(30), images JSON, name VARCHAR(75), release_date VARCHAR(10), 
    uri VARCHAR(40), artists JSON, tracks JSON, copyrights JSON, label_name VARCHAR(75), date_added DATETIME)`;

    //sqlQuery(sql, req.session.username);
    
    sql = `playlists (id INT AUTO_INCREMENT PRIMARY KEY, playlist_id VARCHAR(70), images JSON, name VARCHAR(100), public BOOL, uri varCHAR(40), tracks JSON)`;

    //sqlQuery(sql, req.session.username);
    
    sql = `liked (id INT AUTO_INCREMENT PRIMARY KEY, album_id VARCHAR(30), images JSON, artists JSON, duration VARCHAR(10), track_id VARCHAR(60), name VARCHAR(200), date_added DATETIME)`;

    //sqlQuery(sql, req.session.username);
    
    sql = `categories (id INT AUTO_INCREMENT PRIMARY KEY, href VARCHAR(100), icons JSON, c_id VARCHAR(30), name VARCHAR(40))`;

    await con.query('CREATE TABLE IF NOT EXISTS categories (id INT AUTO_INCREMENT PRIMARY KEY, href VARCHAR(100), icons JSON, c_id VARCHAR(30), name VARCHAR(40))');

    //sqlQuery(sql);
    
    //sql = `select exists (select 1 from ${req.session.username}albums) AS Output`;

    sql = `INSERT INTO users (username, access_token, refresh_token, expires_in)`

    const [result] = await con.query(
      `INSERT INTO users (username, access_token, refresh_token, expires_in)
      VALUES (?, ?, ?, ?)
      ON DUPLICATE KEY UPDATE
      access_token = VALUES(access_token),
      refresh_token = VALUES(refresh_token),
      expires_in = VALUES(expires_in)`,
      [username, data.access_token, data.refresh_token, data.expires_in]
    );    

    const token = generateToken({id: result.insertId, name: username});    

    if (result.affectedRows === 1) {
      res
      .cookie('jwt', token, {
        httpOnly: true,
        secure: false,
        sameSite: 'lax',
        maxAge: 3600000
      })
      .redirect(`${process.env.FRONTEND_URL}/loading`);

        const fetchLibrary = async () => {
          //Fetch user's saved playlists
          await fetchPlaylists(result.insertId, headers);                                      

          //fetch user's saved albums
          await fetchAlbums(result.insertId, headers);

          //Fetch user's liked songs
          await fetchLikedSongs(result.insertId, headers);
        };

        await fetchLibrary().then(() => {                            
          myEmitter.emit('loaded');
        });
    } else {
      res
        .cookie('jwt', token, {
          httpOnly: true,
          secure: false,
          maxAge: 3600000
        })
        .redirect(`${process.env.FRONTEND_URL}/app`);
    }

    //con.query(sql, async (err, result) => {
    //  if (err) throw err;
//
    //  const empty = result[0].Output
    //  //If table already has data read relevent data and send to front end
    //  if (!empty) {
    //    res.redirect(`${process.env.FRONTEND_URL}/loading`);      
//
    //    sql = `INSERT INTO users (username) values ("${req.session.username}")`;
//
    //    con.query(sql, (err) => {
    //      if (err) throw err;              
    //    });
//
    //    const fetchLibrary = async () => {
    //      //Fetch user's saved playlists
    //      await fetchPlaylists(req.session.username, headers);                                      
//
    //      //fetch user's saved albums
    //      await fetchAlbums(req.session.username, headers);
//
    //      //Fetch user's liked songs
    //      await fetchLikedSongs(req.session.username, headers);
    //    };
//
    //    await fetchLibrary().then(() => {                            
    //      myEmitter.emit('loaded');
    //    });                        
    //  }
    //  else {         
    //    res.redirect(`${process.env.FRONTEND_URL}/app`);                                               
    //  }
    //})    
  } catch (e) {
    console.error(e);
  }
});

router.get('/emit', (req, res) => {
  myEmitter.on('loaded', () => {    
    res.send({"status": "done"})
  });
});

module.exports = router;