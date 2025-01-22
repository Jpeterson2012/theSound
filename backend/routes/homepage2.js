const { con } = require('../sql.js')
var express = require('express');
var router = express.Router();

router.get('/albums', async (req, res) => {
    
    function getAlbums(){
        sql = 'SELECT album_type, total_tracks, album_id, images, name, release_date, uri, artists, tracks, copyrights, label_name from ualbums'
        con.query(sql, function (err, result) {
            if (err) throw err;
            var items = []
            for (let i = 0; i < result.length; i++) {
                var temp = {}
                temp.album_type = result[i].album_type
                temp.total_tracks = result[i].total_tracks
                temp.album_id = result[i].album_id
                temp.images = JSON.parse(result[i].images)
                temp.name = result[i].name
                temp.release_date = result[i].release_date
                temp.uri = result[i].uri
                temp.artists = JSON.parse(result[i].artists)
                temp.tracks = JSON.parse(result[i].tracks)
                temp.copyrights = JSON.parse(result[i].copyrights)
                temp.label_name = result[i].label_name                
                items.push(temp)
            }
            res.send(items)
        })
    }

    getAlbums()
})

router.get('/playlists', async (req, res) => {

    function getPlaylists(){
        var sql = 'SELECT playlist_id, images, name, public, uri, tracks from uplaylists'
        con.query(sql, function (err,result) {
            if (err) throw err;
            var items = []
            for (let i = 0; i < result.length; i++){
                var temp ={}
                temp.playlist_id = result[i].playlist_id
                temp.images = JSON.parse(result[i].images)
                temp.name = result[i].name
                temp.public = result[i].public
                temp.uri = result[i].uri
                var temp2 = JSON.parse(result[i].tracks)
                
                var temp3 = []
                temp2.items?.map(a => {
                    temp3.push({images:( a.album?.images ? a.album?.images : null), uri: a.uri, name: a.name, track_number: a.track_number, duration_ms: a.duration_ms, artists: a.artists})
                })
                temp.tracks = temp3
                items.push(temp)
                }
            res.send(items)
        })
    }

    getPlaylists()
})

router.get('/playlists/:id', async (req, res) => {
    function getPlaylist(){
        var sql = `SELECT playlist_id, images, name, public, uri, tracks from uplaylists WHERE playlist_id = '${req.params.id}'`
        con.query(sql, function(err,result) {
            console.log(result[0].name)
            if (err) throw err
            // var items = []
            var temp ={}
                temp.playlist_id = result[0].playlist_id
                temp.images = JSON.parse(result[0].images)
                temp.name = result[0].name
                temp.public = result[0].public
                temp.uri = result[0].uri
                var temp2 = JSON.parse(result[0].tracks)
                
                var temp3 = []
                temp2.items?.map(a => {
                    temp3.push({images:( a.album?.images ? a.album?.images : null), uri: a.uri, name: a.name, track_number: a.track_number, duration_ms: a.duration_ms, artists: a.artists})
                })
                temp.tracks = temp3
                // items.push(temp)

                res.send(temp)
        })
    }
    getPlaylist()
})

router.get('/liked', async (req, res) => {
    
    function getLiked(){
        var sql = 'select images, duration, track_id, name, artists from likedsongs'
        con.query(sql, function (err, result) {
            if (err) throw e

            var items = []
            for (let i = 0; i < result.length; i++){
                var temp ={}
                var tracks = {}
                //temp.album_id = result[i].album_id
                temp.images = JSON.parse(result[i].images)
                temp.duration_ms = result[i].duration
                temp.uri = result[i].track_id
                temp.name = result[i].name
                temp.artists = JSON.parse(result[i].artists)
                
                items.push(temp)
            }
            // tracks.tracks = items        
            // records.items = tracks
            // res.send(records)
            tracks.tracks = items
            res.send(tracks)
        })
    }

     getLiked()
})
module.exports = router;