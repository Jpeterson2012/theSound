const express = require('express');
const router = express.Router();
const { con } = require('../sql.js');

router.post('/album', async (req, res) => {
  try{
    const sql = `INSERT INTO ${req.session.username}albums (album_type, total_tracks, album_id, images, 
      name, release_date, uri, artists, tracks, copyrights, label_name, date_added) VALUES ?`;
    
    values = [[
      req.body.album_type, req.body.total_tracks, req.body.album_id, JSON.stringify(req.body.images),
      req.body.name, req.body.release_date, req.body.uri, JSON.stringify(req.body.artists),
      JSON.stringify(req.body.tracks), JSON.stringify(req.body.copyrights), req.body.label_name, new Date(req.body.date_added)
    ]];
    
    con.query(sql, [values], (err) => {
      if (err) throw err
      console.log('Album added!')
    });

    res.status(200).json({success: true});
  } catch(e) {
    console.error(e);
    res.status(500).json({success: false, message: `Adding album to library failed: ${e}`});
  }
});

router.delete('/album', async (req, res) => {
  try{
    const sql = `DELETE FROM ${req.session.username}albums WHERE album_id = "${req.body.aID}"`;

    con.query(sql, (err) => {
      if (err) throw err;

      console.log('Album deleted!');
    });

    res.status(200).json({success: true});
  } catch(e) {
    console.log(e);
    res.status(500).json({success: false, message: `Deleting album failed: ${e}`});
  }
});

router.post('/liked', async (req, res) => {
  try{
    const sql = `INSERT INTO ${req.session.username}liked (album_id, images, artists, duration, track_id, name, date_added) VALUES ?`;

    const values = [[
      req.body.album_id, JSON.stringify(req.body.images), JSON.stringify(req.body.artists),
      req.body.duration_ms, req.body.uri, req.body.name, new Date(req.body.date_added),
    ]];

    con.query(sql, [values], (err) => {
      if (err) throw err;

      console.log('Song added!')
    });

  res.status(200).json({success: true});
  } catch(e) {
    console.log(e);
    res.status(500).json({success: false, message: `Adding liked song failed: ${e}`});
  }
});

router.delete('/liked', async (req, res) => {
  try{
    const sql = `DELETE FROM ${req.session.username}liked WHERE name = "${req.body.name}"`;

    con.query(sql, (err) => {
      if (err) throw err;

      console.log('Song deleted!');
    });

    res.status(200).json({success: true});
  } catch(e) {
    res.status(500).json({success: false, message: `Deleting liked song failed: ${e}`});
  }
});

router.post('/playlist/:id', async (req, res) => {
  try{
    let sql = `SELECT tracks FROM ${req.session.username}playlists WHERE playlist_id = '${req.params.id}'`;

    con.query(sql, (err,result) => {
      if (err) throw err;
    
      let temp = result[0].tracks;

      if (!temp){
        temp = {};

        temp.items = [];
      }

      let temp2 = req.body;
      temp2.album = {};
      temp2.album.images = temp2.images;        
      delete temp2.images;
      
      temp.items.push(temp2);      
      
      sql = `UPDATE ${req.session.username}playlists SET tracks = ${con.escape(JSON.stringify(temp))} WHERE playlist_id = '${req.params.id}'`;

      con.query(sql, (err) => {
        if (err) throw err;

        console.log("Track added!");
      });
    });

    res.status(200).json({success: true});
  } catch(e) {
    res.status(500).json({success: false, message: `Adding song to playlist failed: ${e}`});
  }
});

router.delete('/playlist/:id', async (req, res) => {
  try{
    let sql = `SELECT tracks FROM ${req.session.username}playlists WHERE playlist_id = '${req.params.id}'`;

    con.query(sql, (err,result) => {
      if (err) throw err;

      let temp = result[0].tracks;

      temp.items = temp.items.filter(a => a.name !== req.body.name);

      sql = `UPDATE ${req.session.username}playlists SET tracks = ${con.escape(JSON.stringify(temp))} WHERE playlist_id = '${req.params.id}'`;

      con.query(sql, (err) => {
        if (err) throw err;

        console.log("Track removed!");
      });
    });

    res.status(200).json({success: true});
  }
  catch(e){
    console.log(e);
    res.status(500).json({success: false, message: `Deleting playlist song failed: ${e}`});
  }
});

router.delete('/playlist', async(req, res) => {
  try{
    const sql = `DELETE FROM ${req.session.username}playlists WHERE playlist_id = "${req.body.pID}" and not name="temp_playlist"`;

    con.query(sql, (err) => {
      if (err) throw err;

      console.log('Playlist deleted!');
    });

    res.status(200).json({success: true});
  } catch(e) {
    console.log(e);
    res.status(500).json({success: false, message: `Deleting playlist failed: ${e}`});
  }
});

module.exports = router;