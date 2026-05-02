const express = require('express');
const router = express.Router();
const con = require('../database/dbpool.js');
const { asyncHandler, spotifyRequest } = require('../utils.js');

router.get('/:id', asyncHandler(async (req, res) => {
  const arr = req.params.id.split(',');
  
  const url = `search?q=${arr[0]}&offset=${arr[1]}&limit=20&type=track,album,artist,playlist`;

  const data = await spotifyRequest(url, req.token);

  let items = {};

  let tempArray = [];

  data.albums?.items?.map(a => a && tempArray.push({name: a.name, id: a.id, images: a.images, artists: a.artists, url: a.url}));
  items.albums = tempArray;
  tempArray = [];

  data.tracks?.items?.map(a => a && tempArray.push({name: a.name, album_name: a.album.name, artists: a.artists, images: a.album.images, url: a.album.uri, track_number: a.track_number, duration_ms: a.duration_ms}));      
  items.tracks = tempArray;
  tempArray = [];
  
  data.artists?.items?.map(a => a && tempArray.push({name: a.name, id: a.id, images: a.images}));
  items.artists = tempArray;
  tempArray = [];
  
  data.playlists?.items?.map(a => a && tempArray.push({name: a.name, id: a.id, images: a.images}));
  items.playlists = tempArray;
  tempArray = [];    
  
  res.send(items);
}));

module.exports = router;