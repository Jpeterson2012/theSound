const con = require('../database/dbpool.js');
const express = require('express');
const router = express.Router();
const {verifyToken} = require('../jwt.js');

router.get('/albums', async (req, res) => {   
    const {id} = verifyToken(req.cookies.jwt);

    async function getAlbums() {                
        //sql = `SELECT album_type, total_tracks, album_id, images, name, release_date, uri, artists, tracks, copyrights, label_name, date_added from ${req.session.username}albums`;
        sql = `SELECT album_type, total_tracks, album_id, images, name, release_date, uri, artists, 
        tracks, copyrights, label_name, date_added from user_albums WHERE user_id = ${id}`;

        const [result] = await con.query(sql);

        const items = [];

        for (let i = 0; i < result.length; i++) {
            var temp = {};
            temp.album_type = result[i].album_type;
            temp.total_tracks = result[i].total_tracks;
            temp.album_id = result[i].album_id;
            temp.images = result[i].images;
            temp.name = result[i].name;
            temp.release_date = result[i].release_date;
            temp.uri = result[i].uri;
            temp.artists = result[i].artists;
            temp.tracks = result[i].tracks;
            temp.copyrights = result[i].copyrights;
            temp.label_name = result[i].label_name;      
            temp.date_added = result[i].date_added;          
            items.push(temp);
        }

        res.send(items);


        //con.query(sql, (err, result) => {
        //    if (err) throw err;
//
        //    const items = [];
//
        //    for (let i = 0; i < result.length; i++) {
        //        var temp = {};
        //        temp.album_type = result[i].album_type;
        //        temp.total_tracks = result[i].total_tracks;
        //        temp.album_id = result[i].album_id;
        //        temp.images = result[i].images;
        //        temp.name = result[i].name;
        //        temp.release_date = result[i].release_date;
        //        temp.uri = result[i].uri;
        //        temp.artists = result[i].artists;
        //        temp.tracks = result[i].tracks;
        //        temp.copyrights = result[i].copyrights;
        //        temp.label_name = result[i].label_name;      
        //        temp.date_added = result[i].date_added;          
        //        items.push(temp);
        //    }
//
        //    res.send(items);
        //});
    };

    getAlbums();
});

router.get('/playlists', async (req, res) => {
    const {id} = verifyToken(req.cookies.jwt);

    async function getPlaylists() {        
        //const sql = `SELECT playlist_id, images, name, public, uri, tracks from ${req.session.username}playlists where not name="temp_playlist"`;
        const sql = `SELECT playlist_id, images, name, public, uri, tracks from user_playlists where user_id = ${id} and not name="temp_playlist"`;

        const [result] = await con.query(sql);

        const items = [];

        for (let i = 0; i < result.length; i++) {
            const temp = {};
            temp.playlist_id = result[i].playlist_id;
            temp.images = result[i].images ?? [];
            temp.name = result[i].name;
            temp.public = result[i].public;
            temp.uri = result[i].uri;                                
            const temp2 = result[i].tracks;                
            
            const temp3 = [];

            temp2 && temp2.items?.map(a => {
                temp3.push({
                    album_id: a.album?.id, images: a.album?.images ? a.album?.images : (a.images ?? null), 
                    uri: a.uri, name: a.name, track_number: a.track_number, duration_ms: a.duration_ms, 
                    artists: a.artists, date_added: a.date_added,
                });
            });

            temp.tracks = temp3;

            items.push(temp);         
        }

        res.send(items);

        //con.query(sql, (err,result) => {
        //    if (err) throw err;
//
        //    const items = [];
//
        //    for (let i = 0; i < result.length; i++) {
        //        const temp = {};
        //        temp.playlist_id = result[i].playlist_id;
        //        temp.images = result[i].images ?? [];
        //        temp.name = result[i].name;
        //        temp.public = result[i].public;
        //        temp.uri = result[i].uri;                                
        //        const temp2 = result[i].tracks;                
        //        
        //        const temp3 = [];
//
        //        temp2 && temp2.items?.map(a => {
        //            temp3.push({
        //                album_id: a.album?.id, images: a.album?.images ? a.album?.images : (a.images ?? null), 
        //                uri: a.uri, name: a.name, track_number: a.track_number, duration_ms: a.duration_ms, 
        //                artists: a.artists, date_added: a.date_added,
        //            });
        //        });
//
        //        temp.tracks = temp3;
//
        //        items.push(temp);         
        //    }
//
        //    res.send(items);
        //});
    };

    getPlaylists();
});

router.get('/playlists/:id', async (req, res) => {
    const {id} = verifyToken(req.cookies.jwt);

    async function getPlaylist() {        
        //const sql = `SELECT playlist_id, images, name, public, uri, tracks from ${req.session.username}playlists WHERE playlist_id = '${req.params.id}'`;
        const sql = `SELECT playlist_id, images, name, public, uri, tracks from user_playlists WHERE user_id = ${id} AND playlist_id = '${req.params.id}'`;

        const [result] = await con.query(sql);

        const temp = {};
        temp.playlist_id = result[0].playlist_id;
        temp.images = result[0].images;
        temp.name = result[0].name;
        temp.public = result[0].public;
        temp.uri = result[0].uri;
        const temp2 = result[0].tracks;
        
        const temp3 = [];

        temp2.items?.map(a => {
            temp3.push({
                images:( a.album?.images ?? null), uri: a.uri, name: a.name, track_number: a.track_number, 
                duration_ms: a.duration_ms, artists: a.artists, date_added: a.date_added
            });
        });

        temp.tracks = temp3;
        // items.push(temp)

        res.send(temp);

        //con.query(sql, (err,result) => {            
        //    if (err) throw err;
        //    // var items = []
        //    const temp = {};
        //    temp.playlist_id = result[0].playlist_id;
        //    temp.images = result[0].images;
        //    temp.name = result[0].name;
        //    temp.public = result[0].public;
        //    temp.uri = result[0].uri;
        //    const temp2 = result[0].tracks;
        //    
        //    const temp3 = [];
//
        //    temp2.items?.map(a => {
        //        temp3.push({
        //            images:( a.album?.images ?? null), uri: a.uri, name: a.name, track_number: a.track_number, 
        //            duration_ms: a.duration_ms, artists: a.artists, date_added: a.date_added
        //        });
        //    });
//
        //    temp.tracks = temp3;
        //    // items.push(temp)
//
        //    res.send(temp);
        //});
    };

    getPlaylist();
});

router.get('/liked', async (req, res) => {
    const {id} = verifyToken(req.cookies.jwt);

    async function getLiked() {        
        //const sql = `select album_id, images, duration, track_id, name, artists, date_added from ${req.session.username}liked`;
        const sql = `select album_id, images, duration, track_id, name, artists, date_added from user_liked WHERE user_id = ${id}`;

        const [result] = await con.query(sql);

        const items = [];
        const tracks = {};

        for (let i = 0; i < result.length; i++) {                
            const temp = {};                
            temp.album_id = result[i].album_id;
            temp.images = result[i].images;
            temp.duration_ms = result[i].duration;
            temp.uri = result[i].track_id;
            temp.name = result[i].name;
            temp.artists = result[i].artists;
            temp.date_added = result[i].date_added;
            
            items.push(temp);
        }
        // tracks.tracks = items        
        // records.items = tracks
        // res.send(records)
        tracks.tracks = items;

        res.send(tracks);

        //con.query(sql, (err, result) => {
        //    if (err) throw err;
//
        //    const items = [];
        //    const tracks = {};
//
        //    for (let i = 0; i < result.length; i++) {                
        //        const temp = {};                
        //        temp.album_id = result[i].album_id;
        //        temp.images = result[i].images;
        //        temp.duration_ms = result[i].duration;
        //        temp.uri = result[i].track_id;
        //        temp.name = result[i].name;
        //        temp.artists = result[i].artists;
        //        temp.date_added = result[i].date_added;
        //        
        //        items.push(temp);
        //    }
        //    // tracks.tracks = items        
        //    // records.items = tracks
        //    // res.send(records)
        //    tracks.tracks = items;
//
        //    res.send(tracks);
        //});
    };

    getLiked();
});

router.get('/podcasts', async (req,res) => {    
    const token = await con.getAccessToken(req.cookies.jwt);

    const url = 'https://api.spotify.com/v1/me/shows';

    try{
        const headers = {
            Authorization: 'Bearer ' + token
        };
    
        const resp = await fetch(url, {headers});
        const data = await resp.json();
        
        res.send(data);
    } catch (e) {
        console.log(e);
    }
});

router.get('/audiobooks', async (req,res) => {
    const token = await con.getAccessToken(req.cookies.jwt);

    const url = 'https://api.spotify.com/v1/me/audiobooks';

    try{
        const headers = {
            Authorization: 'Bearer ' + token
        };
    
        const resp = await fetch(url, {headers});

        const data = await resp.json();

        res.send(data);
    } catch (e) {
        console.log(e);
    }
});

module.exports = router;