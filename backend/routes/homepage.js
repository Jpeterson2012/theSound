const con = require('../database/dbpool.js');
const express = require('express');
const router = express.Router();
const { asyncHandler, spotifyRequest } = require('../utils.js');

router.get('/albums', asyncHandler(async (req, res) => {   
    sql = `SELECT album_type, total_tracks, album_id, images, name, release_date, uri, artists, 
        tracks, copyrights, label_name, date_added from user_albums WHERE user_id = ${req.user.id}`;

    const [result] = await con.query(sql);    

    const items = result.reduce((acc, album) => {
        acc.push({
            album_type: album.album_type,
            total_tracks: album.total_tracks,
            album_id: album.album_id,
            images: album.images,
            name: album.name,
            release_date: album.release_date,
            uri: album.uri,
            artists: album.artists,
            tracks: album.tracks,
            copyrights: album.copyrights,
            label_name: album.label_name,
            date_added: album.date_added,
        });

        return acc;
    }, []);

    res.send(items);
}));

router.get('/playlists', asyncHandler(async (req, res) => {
    const sql = `SELECT playlist_id, images, name, public, uri, tracks from user_playlists where user_id = ${req.user.id} and not name="temp_playlist"`;

    const [result] = await con.query(sql);

    const items = result.reduce((acc, playlist) => {
        acc.push({
            playlist_id: playlist.playlist_id,
            images: playlist.images ?? [],
            name: playlist.name,
            public: playlist.public,
            uri: playlist.uri,
            tracks: (playlist?.tracks?.items ?? []).map(track => {
                return {
                    album_id: track.album?.id, 
                    images: track.album?.images ? track.album?.images : (track.images ?? null), 
                    uri: track.uri, 
                    name: track.name, 
                    track_number: track.track_number, 
                    duration_ms: track.duration_ms, 
                    artists: track.artists, 
                    date_added: track.date_added,
                };
            }),
        });

        return acc;
    }, []);

    res.send(items);
}));

router.get('/playlists/:id', asyncHandler(async (req, res) => {
    const sql = `SELECT playlist_id, images, name, public, uri, tracks from user_playlists WHERE user_id = ${req.user.id} AND playlist_id = '${req.params.id}'`;

    const [result] = await con.query(sql);

    const playlist = {
        playlist_id: result[0].playlist_id,
        images: result[0].images,
        name: result[0].name,
        public: result[0].public,
        uri: result[0].uri,
        tracks: (result[0].tracks?.items ?? []).map(track => {
            return {
                images: track.album?.images ?? null, 
                uri: track.uri, 
                name: track.name, 
                track_number: track.track_number, 
                duration_ms: track.duration_ms, 
                artists: track.artists, 
                date_added: track.date_added,
            };
        }),
    };

    res.send(playlist);
}));

router.get('/liked', asyncHandler(async (req, res) => {
    const sql = `select album_id, images, duration, track_id, name, artists, date_added from user_liked WHERE user_id = ${req.user.id}`;

        const [result] = await con.query(sql);

        const items = result.reduce((acc, track) => {
            acc.push({
                album_id: track.album_id,
                images: track.images,
                duration_ms: track.duration,
                uri: track.track_id,
                name: track.name,
                artists: track.artists,
                date_added: track.date_added,
            });

            return acc;
        }, []);

        res.send({tracks: items});
}));

router.get('/podcasts', asyncHandler(async (req,res) => {   
    const data = await spotifyRequest("me/shows", req.token);
    
    res.send(data);
}));

router.get('/audiobooks', asyncHandler(async (req,res) => {
    const data = await spotifyRequest("me/audiobooks", req.token);
    
    res.send(data);
}));

module.exports = router;