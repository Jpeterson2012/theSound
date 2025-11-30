const express = require('express');
const router = express.Router();
const con = require('../sql.js');
const {verifyToken} = require('../jwt.js');

router.post('/album', async (req, res) => {
  const {id} = verifyToken(req.cookies.jwt);

  try{
    const sql = `INSERT INTO user_albums (user_id, album_type, total_tracks, album_id, images, 
      name, release_date, uri, artists, tracks, copyrights, label_name, date_added) VALUES ?`;
    
    values = [[
      id, req.body.album_type, req.body.total_tracks, req.body.album_id, JSON.stringify(req.body.images),
      req.body.name, req.body.release_date, req.body.uri, JSON.stringify(req.body.artists),
      JSON.stringify(req.body.tracks), JSON.stringify(req.body.copyrights), req.body.label_name, new Date(req.body.date_added)
    ]];

    await con.query(sql, [values]);
    
    console.log('Album added!');

    res.status(200).json({success: true});
  } catch(e) {
    console.error(e);
    res.status(500).json({success: false, message: `Adding album to library failed: ${e}`});
  }
});

router.delete('/album', async (req, res) => {
  const {id} = verifyToken(req.cookies.jwt);  

  try{
    const sql = `DELETE FROM user_albums WHERE album_id = "${req.body.aID}" AND user_id = ${id}`;

    await con.query(sql);

    console.log('Album deleted!');

    res.status(200).json({success: true});
  } catch(e) {
    console.log(e);
    res.status(500).json({success: false, message: `Deleting album failed: ${e}`});
  }
});

router.post('/liked', async (req, res) => {
  const {id} = verifyToken(req.cookies.jwt);

  try{
    const sql = `INSERT INTO user_liked (user_id, album_id, images, artists, duration, track_id, name, date_added) VALUES ?`;

    const values = [[
      id, req.body.album_id, JSON.stringify(req.body.images), JSON.stringify(req.body.artists),
      req.body.duration_ms, req.body.uri, req.body.name, new Date(req.body.date_added),
    ]];

    await con.query(sql, [values]);

    console.log('Song added!');

  res.status(200).json({success: true});
  } catch(e) {
    console.log(e);
    res.status(500).json({success: false, message: `Adding liked song failed: ${e}`});
  }
});

router.delete('/liked', async (req, res) => {
  const {id} = verifyToken(req.cookies.jwt);

  try{
    const sql = `DELETE FROM user_liked WHERE name = "${req.body.name}" AND user_id = ${id}`;

    await con.query(sql);

    console.log('Song deleted!');

    res.status(200).json({success: true});
  } catch(e) {
    res.status(500).json({success: false, message: `Deleting liked song failed: ${e}`});
  }
});

router.post('/playlist/bulk', async (req, res) => {  
  const {id} = verifyToken(req.cookies.jwt);

  const conn = await con.getConnection();

  try {
    await conn.beginTransaction();

    for (const update of req.body.pUpdates.updates) {
      let sql = `SELECT tracks FROM user_playlists WHERE playlist_id = '${update.pID}' AND user_id = ${id}`;

      const [result] = await conn.query(sql);

      let temp = result[0].tracks ?? {items: []};

      if (update.status === "add") {
        const {images, ...rest} = update.initialP;

        const newTrack = {...rest, album: {images}}

        temp.items.push(newTrack);
        
        sql = 'UPDATE user_playlists SET tracks = ? WHERE playlist_id = ? AND user_id = ?';

        await conn.query(
          sql,
          [JSON.stringify(temp), update.pID, id]
        );
      } else {
        temp.items = temp.items.filter(a => a.uri !== req.body.pUpdates.trackUri);

        sql = `UPDATE user_playlists SET tracks = ? WHERE playlist_id = ? AND user_id = ?`;

        await conn.query(
          sql,
          [JSON.stringify(temp), update.pID, id]
        );
      }
    };

    await conn.commit();

    console.log('Transaction committed successfully');
  } catch (e) {
    await conn.rollback();

    console.log(`Bulk playlist update failed: ${e}`);

    res.status(500).json({success: false, message: `Bulk playlist update failed: ${e}`});
  } finally {
    conn.release();
  }
});

router.post('/playlist/:id', async (req, res) => {
  const {id} = verifyToken(req.cookies.jwt);

  try{
    let sql = `SELECT tracks FROM user_playlists WHERE playlist_id = '${req.params.id}' AND user_id = ${id}`;

    const [result] = await con.query(sql);

    let temp = result[0].tracks ?? {items: []};    

    const {images, ...rest} = req.body;

    const newTrack = {...rest, album: {images}}

    temp.items.push(newTrack);
    
    sql = 'UPDATE user_playlists SET tracks = ? WHERE playlist_id = ? AND user_id = ?';

    await con.query(
      sql,
      [JSON.stringify(temp), req.params.id, id]
    );

    console.log("Track added!");

    res.status(200).json({success: true});
  } catch(e) {
    console.log(e);
    
    res.status(500).json({success: false, message: `Adding song to playlist failed: ${e}`});
  }
});

router.delete('/playlist/:id', async (req, res) => {
  const {id} = verifyToken(req.cookies.jwt);

  try{
    let sql = `SELECT tracks FROM user_playlists WHERE playlist_id = '${req.params.id}' AND user_id = ${id}`;

    const [result] = await con.query(sql);

    let temp = result[0].tracks;

    temp.items = temp.items.filter(a => a.name !== req.body.name);

    sql = `UPDATE user_playlists SET tracks = ? WHERE playlist_id = ? AND user_id = ?`;

    await con.query(
      sql,
      [JSON.stringify(temp), req.params.id, id]
    );

    console.log("Track removed!");

    res.status(200).json({success: true});
  }
  catch(e){
    console.log(e);
    res.status(500).json({success: false, message: `Deleting playlist song failed: ${e}`});
  }
});

router.delete('/playlist', async (req, res) => {
  const {id} = verifyToken(req.cookies.jwt);

  try{
    const sql = `DELETE FROM user_playlists WHERE playlist_id = "${req.body.pID}" AND user_id = ${id} AND not name="temp_playlist"`;

    await con.query(sql);

    console.log('Playlist deleted!');

    res.status(200).json({success: true});
  } catch(e) {
    console.log(e);
    res.status(500).json({success: false, message: `Deleting playlist failed: ${e}`});
  }
});

module.exports = router;