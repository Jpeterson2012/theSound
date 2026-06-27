const express = require('express');
const router = express.Router();
const { asyncHandler, spotifyRequest } = require('../utils.js');

router.get('/:id', asyncHandler(async (req, res) => {
  const state = {pages: 0, next: "next", payload: {music: []}};
  
  do {
    const data = await spotifyRequest(`artists/${req.params.id}/albums?include_groups=single,album,compilation&offset=${state.pages}&limit=35`, req.token);

    state.payload.music.push(
      ...data.items.map(item => {
        const {available_markets, ...rest} = item;
        
        return rest;
      })
    );
    
    res.write(JSON.stringify(state.payload) + "\n");

    state.next = data.next;

    state.pages += 35;
  } while (state.next);  

  res.end();   
}));

router.get('/albums/:id', asyncHandler(async (req, res) => {
  const artistIds = req.params.id.split(',');

  const discogs = await Promise.all(
    artistIds.map(id => spotifyRequest(`artists/${id}/albums?limit=15`, req.token)),
  );

  const payload = discogs.reduce((acc, discog, index) => {
    const artistId = artistIds[index];

    acc[artistId] = discog.items;

    return acc;
  }, {});

  res.send(payload);
}));

module.exports = router;