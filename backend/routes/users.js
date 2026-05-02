const express = require('express');
const router = express.Router();
const con = require('../database/dbpool.js');
const { asyncHandler } = require('../utils.js');

/* GET users listing. */
router.get('/', asyncHandler(async (req, res) => {    
  const {id, name} = req.user;
  
  res.send({id, name});
}));

router.post('/:playlist', asyncHandler(async (req, res) => {    
  const name = req.body.name.replace(/\W/g,' ');

  if (req.body.public === undefined) {
    let sql = `select playlist_id, name from user_playlists where playlist_id = "${req.body.id}" and name = "temp_playlist" and user_id = ${req.user.id}`;

    const [result] = await con.query(sql);

    console.log(result);

    if (result.length === 1) {            
      await con.query(
        `insert into user_playlists (user_id, playlist_id, images, name, public, uri, tracks) select user_id, playlist_id, ?, ?, public, uri, tracks from user_playlists where name = "temp_playlist" and user_id = ?`,
        [JSON.stringify(req.body.images), name, req.user.id]
      );

      console.log('New Playlist Added');
    }
  } else {
    await con.query(
      `INSERT INTO user_playlists (user_id, playlist_id, name, public, uri) VALUES (?, ?, ?, ?, ?)`,
      [req.user.id, req.body.id, req.body.name, req.body.public, `spotify:playlist:${req.body.id}`]
    );

    console.log('New Playlist Added');
  }
  
  res.status(200).json({success: true}); 
}));

module.exports = router;