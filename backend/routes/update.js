const express = require('express');
const router = express.Router();
const con = require('../database/dbpool.js');
const { asyncHandler, spotifyRequest } = require('../utils.js');

router.post('/album', asyncHandler(async (req, res) => {
  const sql = `INSERT INTO user_albums (user_id, album_type, total_tracks, album_id, images, 
    name, release_date, uri, artists, tracks, copyrights, label_name, date_added) VALUES ?`;
  
  values = [[
    req.user.id, req.body.album_type, req.body.total_tracks, req.body.album_id, JSON.stringify(req.body.images),
    req.body.name, req.body.release_date, req.body.uri, JSON.stringify(req.body.artists),
    JSON.stringify(req.body.tracks), JSON.stringify(req.body.copyrights), req.body.label_name, new Date(req.body.date_added),
  ]];

  await con.query(sql, [values]);
  
  console.log('Album added!');

  res.status(200).json({success: true});
}));

router.delete('/album', asyncHandler(async (req, res) => {
  const sql = `DELETE FROM user_albums WHERE album_id = "${req.body.aID}" AND user_id = ${req.user.id}`;

  await con.query(sql);

  console.log('Album deleted!');

  res.status(200).json({success: true});
}));

router.post('/liked', asyncHandler(async (req, res) => {
  const sql = `INSERT INTO user_liked (user_id, album_id, images, artists, duration, track_id, name, date_added) VALUES ?`;

  const values = [[
    req.user.id, req.body.album_id, JSON.stringify(req.body.images), JSON.stringify(req.body.artists),
    req.body.duration_ms, req.body.uri, req.body.name, new Date(req.body.date_added),
  ]];

  await con.query(sql, [values]);

  console.log('Song added!');

  res.status(200).json({success: true});
}));

router.delete('/liked', asyncHandler(async (req, res) => {
  const sql = `DELETE FROM user_liked WHERE name = "${req.body.name}" AND user_id = ${req.user.id}`;

  await con.query(sql);

  console.log('Song deleted!');

  res.status(200).json({success: true});
}));

router.post('/playlist/bulk', asyncHandler(async (req, res) => {  
  const conn = await con.getConnection();

  try {
    await conn.beginTransaction();

    for (const update of req.body.pUpdates.updates) {
      const [result] = await conn.query(
        `SELECT tracks FROM user_playlists WHERE playlist_id = ? AND user_id = ?`, 
        [update.pID, req.user.id],
      );      

      let tracks = result?.[0]?.tracks ?? {items: []};      

      if (update.status === "add") {
        const {images, ...rest} = update.initialP;

        tracks.items.push({...rest, album: {images}});
      } else {
        tracks.items = tracks.items.filter(a => a.uri !== req.body.pUpdates.trackUri);
      }

      await conn.query(
        'UPDATE user_playlists SET tracks = ? WHERE playlist_id = ? AND user_id = ?',
        [JSON.stringify(tracks), update.pID, req.user.id]
      );
    };

    await conn.commit();

    console.log('Transaction committed successfully');

    res.status(200).json({success: true});
  } catch (e) {
    await conn.rollback();

    throw e;
  } finally {
    conn.release();
  }
}));

router.post('/playlist/:id', asyncHandler(async (req, res) => {
  const [result] = await con.query(
    `SELECT tracks FROM user_playlists WHERE playlist_id = ? AND user_id = ?`,
    [req.params.id, req.user.id],
  );

  let tracks = result?.[0]?.tracks ?? {items: []};    

  const {images, ...rest} = req.body;

  tracks.items.push({...rest, album: {images}});
  
  await con.query(
    'UPDATE user_playlists SET tracks = ? WHERE playlist_id = ? AND user_id = ?',
    [JSON.stringify(tracks), req.params.id, req.user.id]
  );

  console.log("Track added!");

  res.status(200).json({success: true});
}));

router.delete('/playlist/:id', asyncHandler(async (req, res) => {
  const [result] = await con.query(
    `SELECT tracks FROM user_playlists WHERE playlist_id = ? AND user_id = ?`,
    [req.params.id, req.user.id],
  );

  let tracks = result[0].tracks;

  tracks.items = tracks.items.filter(a => a.name !== req.body.name);

  await con.query(
    `UPDATE user_playlists SET tracks = ? WHERE playlist_id = ? AND user_id = ?`,
    [JSON.stringify(tracks), req.params.id, req.user.id]
  );

  console.log("Track removed!");

  res.status(200).json({success: true});
}));

router.delete('/playlist', asyncHandler(async (req, res) => {
  await con.query(
    `DELETE FROM user_playlists WHERE playlist_id = ? AND user_id = ? AND not name="temp_playlist"`,
    [req.body.pID, req.user.id],
  );

  console.log('Playlist deleted!');

  res.status(200).json({success: true});
}));

module.exports = router;