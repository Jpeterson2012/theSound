const express = require('express');
const router = express.Router();
const con = require('../database/dbpool.js');
const { asyncHandler, spotifyRequest } = require('../utils.js');

router.get('/:id', asyncHandler(async (req,res) => {
    const sql = `SELECT * from ${req.params.id}`;

    const [result] = await con.query(sql);

    const items = result.reduce((acc, c_playlist) => {
        acc.push({
            playlist_id: c_playlist.playlist_id,
            images: JSON.parse(c_playlist.images) ?? [],
            name: c_playlist.name,
            public: c_playlist.public,
            uri: c_playlist.uri,
            tracks: (c_playlist?.tracks?.items ?? []).map(track => {
                return {
                    album_id: track.album?.id, 
                    images: track.album?.images ? track.album?.images : (track.images ?? null), 
                    uri: track.uri, 
                    name: track.name, 
                    track_number: track.track_number, 
                    duration_ms: track.duration_ms, 
                    artists: track.artists,                    
                };
            }),
        });

        return acc;
    }, []);

    res.send(items);
}));

module.exports = router;