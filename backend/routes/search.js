const express = require('express');
const router = express.Router();
const con = require('../database/dbpool.js');
const { asyncHandler, spotifyRequest } = require('../utils.js');

router.get('/:id', asyncHandler(async (req, res) => {
  const arr = req.params.id.split(',');
  
  const url = `search?q=${arr[0]}&offset=${arr[1]}&limit=20&type=track,album,artist,playlist`;

  const data = await spotifyRequest(url, req.token);

  const items = {};

  items.albums = (data?.albums?.items ?? []).reduce((acc, album) => {
    if (album) {
      acc.push({name: album.name, id: album.id, images: album.images, artists: album.artists, url: album.url});
    }    

    return acc;
  }, []);

  items.tracks = (data?.tracks?.items ?? []).reduce((acc, track) => {
    if (track) {
      acc.push({
        name: track.name, album_name: track.album.name, artists: track.artists, images: track.album.images, 
        url: track.album.uri, track_number: track.track_number, duration_ms: track.duration_ms,
      });
    }    

    return acc;
  }, []);

  items.artists = (data?.artists?.items ?? []).reduce((acc, artist) => {
    if (artist) {
      acc.push({name: artist.name, id: artist.id, images: artist.images});
    }    

    return acc;
  }, []);

  items.playlists = (data?.playlists?.items ?? []).reduce((acc, playlist) => {
    if (playlist) {
      acc.push({name: playlist.name, id: playlist.id, images: playlist.images});
    }    

    return acc;
  }, []);

  res.send(items);
}));

module.exports = router;