//Potential future option: 1 table instead of 3 with a column for type and just include all columns across the 3 tables in the one
const con = require('../database/dbpool.js');
const auth = require("./AuthRoutes.js");
const middlewareAuth = require('../middleware/auth');
const express = require('express');
const router = express.Router();
const {generateToken} = require('../jwt.js');
const { asyncHandler, spotifyRequest } = require('../utils.js');

const fetchPlaylists = async (userId, token) => {
  const state = {pages: 0, next: "next"};
  
  do {
    const playlists = await spotifyRequest(`me/playlists?offset=${state.pages}&limit=25`, token);    

    const values = await Promise.all(
      (playlists?.items ?? []).map(async playlist => {
        const tracks = await spotifyRequest(playlist.tracks.href ,token);

        const trackPayload = (tracks?.items ?? [])
          .filter(track => track)
          .map(track => ({
            ...track,
            date_added: new Date(track.added_at ?? Date.now()),
          }));

        return [
          userId,
          playlist.id,
          JSON.stringify(playlist.images),
          playlist.name.replace(/&/g, "n").replace(/[^\w]/g, " "),
          playlist.public,
          playlist.uri,
          JSON.stringify({items: trackPayload}),
        ];
      })
    ); 
    
    if (values.length) {
      const sql = 'INSERT INTO user_playlists (user_id, playlist_id, images, name, public, uri, tracks) VALUES ?';

      const [result] = await con.query(sql, [values]);

      console.log("Number of playlists inserted: " + result.affectedRows);
    }

    state.next = playlists.next;

    state.pages += 25;
  } while (state.next);

  console.log("done");
};

const fetchAlbums = async (userId, token) => {
  const state = {pages: 0, next: "next"};

  do {
    const albums = await spotifyRequest(`me/albums?offset=${state.pages}&limit=50`, token);

    const values = (albums?.items ?? []).map(payload => [
      userId,
      payload.album.album_type,
      payload.album.total_tracks,
      payload.album.id,
      JSON.stringify(payload.album.images),
      payload.album.name,
      payload.album.release_date,
      payload.album.uri,
      JSON.stringify(payload.album.artists),
      JSON.stringify(payload.album.tracks),
      JSON.stringify(payload.album.copyrights),
      payload.album.label,
      new Date(payload.added_at ?? Date.now()),
    ]);

    const sql = `INSERT INTO user_albums (user_id, album_type,total_tracks,album_id, images, 
      name, release_date, uri, artists, tracks, copyrights, label_name, date_added) VALUES ?`;

    const [result] = await con.query(sql, [values]);

    console.log("Number of albums inserted: " + result.affectedRows);

    state.next = albums.next;

    state.pages += 50;
  } while (state.next);
};

const fetchLikedSongs = async (userId, token) => {
  const state = {pages: 0, next: "next"};

  do {
    const likedSongs = await spotifyRequest(`me/tracks?offset=${state.pages}&limit=50`, token);

    const values = (likedSongs?.items ?? [])
      .filter(liked => liked.track)
      .map(liked => [
        userId, 
        liked.track.album.id, 
        JSON.stringify(liked.track.album.images), 
        JSON.stringify(liked.track.album.artists), 
        liked.track.duration_ms,
        `spotify:track:${liked.track.id}`, 
        liked.track.name, 
        new Date(liked.added_at ?? Date.now()),
      ]);

    const sql = `INSERT INTO user_liked (user_id, album_id, images, artists, duration, track_id, name, date_added) VALUES ?`;

    const [result] = await con.query(sql, [values]);

    console.log("Number of liked songs inserted: " + result.affectedRows);

    state.next = likedSongs.next;

    state.pages += 50;
  } while (state.next);

  console.log('FINISHED!');
};

router.get('/', asyncHandler(async (req, res) => {
  const body = {
    grant_type: 'authorization_code',
    code: req.query.code,
    code_verifier: req.query.state,
    redirect_uri: process.env.REDIRECTURI,                  
  };

  const data = await spotifyRequest('https://accounts.spotify.com/api/token', null, {
    method: 'POST',
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      "Accept": "application/json",
      'Authorization': 'Basic ' + (new Buffer.from(process.env.CLIENT_ID + ':' + process.env.CLIENT_SECRET).toString('base64'))
    },
    body: auth.encodeFormData(body),
  });        
  
  const data2 = await spotifyRequest('me', data.access_token);

  const username = data2.display_name.replace(/\W/g,'');            

  const [result] = await con.query(
    `INSERT INTO users (spotify_id, username, access_token, refresh_token, expires_at)
    VALUES (?, ?, ?, ?, ?)
    ON DUPLICATE KEY UPDATE
    username = VALUES(username),
    access_token = VALUES(access_token),
    refresh_token = VALUES(refresh_token),
    expires_at = VALUES(expires_at)`,
    [data2.id, username, data.access_token, data.refresh_token, new Date(Date.now() + (data.expires_in * 1000 * 0.9))]
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
  } else {
    res
      .cookie('jwt', token, {
        httpOnly: true,
        secure: false,
        maxAge: 3600000
      })
      .redirect(`${process.env.FRONTEND_URL}/app`);
  }
}));

router.post('/import', middlewareAuth, asyncHandler(async (req, res) => {  
  res.sendStatus(202);  

  const io = req.app.get("io");

  await fetchPlaylists(req.user.id, req.token);
  await fetchAlbums(req.user.id, req.token);
  await fetchLikedSongs(req.user.id, req.token);

  io.to(String(req.user.id)).emit("loaded");
}));

module.exports = router;