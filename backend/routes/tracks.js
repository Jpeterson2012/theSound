const express = require('express');
const router = express.Router();
const con = require('../database/dbpool.js');
const { asyncHandler, spotifyRequest } = require('../utils.js');

router.get('/:id', asyncHandler(async (req, res) => {
    const data = await spotifyRequest(`albums/${req.params.id}`, req.token);
    
    const artists = await Promise.all(
        data.artists.map(artist => spotifyRequest(`artists/${artist.id}`, req.token)),
    );

    res.send({
        albums: data,
        images: artists.map(artist => artist.images),
    });
}));

router.post('/artists', asyncHandler(async (req, res) => {
    const artists = await Promise.all(
        req.body.map(artist => spotifyRequest(`artists/${artist}`, req.token)),
    );

    res.send({images: artists.map(artist => artist.images)});
}));

module.exports = router;