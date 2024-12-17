const { con } = require('../sql.js')
// const {jsmediatags} = require('../local.js')
var express = require('express');
var router = express.Router();
var inDB = false
router.get('/albums', async (req, res) => {
    var url = ''
    const headers = {
        Authorization: 'Bearer ' + process.env.access_token
    }
    // function getAlbums(con){
    //     sql = 'SELECT album_id, images, name, release_date, uri, artists, label_name from ualbums'
    //     con.query(sql, function (err, result) {
    //         if (err) throw err;
    //         var records = {}
    //         var items = []
    //         for (let i = 0; i < result.length; i++) {
    //             var temp = {}
    //             temp.album_id = result[i].album_id
    //             temp.images = JSON.parse(result[i].images)
    //             temp.name = result[i].name
    //             temp.release_date = result[i].release_date
    //             temp.uri = result[i].uri
    //             temp.artists = JSON.parse(result[i].artists)
    //             temp.label_name = result[i].label_name
    //             items.push(temp)
    //         }
    //         records.token = process.env.access_token
    //         records.items = items
    //         res.send(records)
    //     })
    // }

    //Check if album data already exits
    sql = 'select exists (select 1 from ualbums) AS Output'
    con.query(sql, function(err, result) {
        if (err) throw err;
        var empty = result[0].Output
        //If table already has data read relevent data and send to front end
        if (empty == 1) {
            inDB = true
            sql = 'SELECT album_id, images, name, artists from ualbums where id = 1'
            
            sql = 'SELECT album_id, images, name, release_date, uri, artists, label_name from ualbums'
            con.query(sql, function (err, result) {
                if (err) throw err;
                var records = {}
                var items = []
                for (let i = 0; i < result.length; i++) {
                    var temp = {}
                    temp.album_id = result[i].album_id
                    temp.images = JSON.parse(result[i].images)
                    temp.name = result[i].name
                    temp.release_date = result[i].release_date
                    temp.uri = result[i].uri
                    temp.artists = JSON.parse(result[i].artists)
                    temp.label_name = result[i].label_name
                    items.push(temp)
                }
                records.token = process.env.access_token
                records.items = items
                res.send(records)
                
            })
            // getAlbums(con)
        }
        else{
            const getStuff = async() => {
                var pages = 0

                //fetch user's saved albums
                while(true) {
                    url = `https://api.spotify.com/v1/me/albums?offset=${pages}`
                    var resp = await fetch(url, {headers})
                    var data = await resp.json()
                    var values = []
                    data.items.map(a => values.push([a.album.total_tracks, a.album.id, JSON.stringify(a.album.images), a.album.name, a.album.release_date, a.album.uri, JSON.stringify(a.album.artists), JSON.stringify(a.album.tracks), a.album.label, a.album.popularity]))
                    var sql = "INSERT INTO ualbums (total_tracks,album_id, images, name, release_date, uri, artists, tracks, label_name, popularity) VALUES ?"
                    con.query(sql, [values], function(err, result) {
                        if (err) throw err;
                        console.log("Number of albums inserted: " + result.affectedRows);
                    })
                    pages += 20
                
                    if(data.next == null) {
                        break
                    } 
                }
                getAlbums()
            }
            getStuff()
        }
    })
})

router.get('/playlists', async (req, res) => {
    var url = ''
    const headers = {
        Authorization: 'Bearer ' + process.env.access_token
    }
    function getPlaylists(){
        var sql = 'SELECT playlist_id, images, name, public, uri, tracks from uplaylists'
        con.query(sql, function (err,result) {
            if (err) throw err;
            var records = {}
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
            records.items = items
            res.send(records)
        })
    }

    if (inDB){
        // var sql = 'SELECT playlist_id, images, name, public, uri, tracks from uplaylists'
        // con.query(sql, function (err,result) {
        //     if (err) throw err;
        //     var records = {}
        //     var items = []
        //     for (let i = 0; i < result.length; i++){
        //         var temp ={}
        //         var tracks = {}
        //         temp.playlist_id = result[i].playlist_id
        //         temp.images = JSON.parse(result[i].images)
        //         temp.name = result[i].name
        //         temp.public = result[i].public
        //         temp.uri = result[i].uri
        //         var temp2 = JSON.parse(result[i].tracks)
                
        //         var temp3 = []
        //         temp2.items?.map(a => {
        //             temp3.push({images:( a.album?.images ? a.album?.images : null), uri: a.uri, name: a.name, track_number: a.track_number, duration_ms: a.duration_ms, artists: a.artists})
        //         })
        //         temp.tracks = temp3
        //         items.push(temp)
        //         }
        //     records.items = items
        // })
        getPlaylists()
    }
    else{
        const getStuff = async() => {
            //Fetch user's saved playlists
            var pages = 0
            while(true) {
                

                url = `https://api.spotify.com/v1/me/playlists?offset=${pages}&limit=5`
                var resp = await fetch(url, {headers})
                var data = await resp.json()
                
                data.items.map(async a => {
                    // values.push([a.id, JSON.stringify(a.images), a.name, a.public, JSON.stringify(a.tracks)])
                        var values = []
                        var trackInfo = []
                        var trackJSON = {}
                        
                        const resp2 = await fetch(a.tracks.href, {headers})
                        const data2 = await resp2.json()
        
                        data2.items.map(a => {a.track ? trackInfo.push(a.track) : null})
                        trackJSON.items = trackInfo
                        
                        values.push([a.id, JSON.stringify(a.images), a.name, a.public, a.uri, JSON.stringify(trackJSON)])
                        var sql = "INSERT INTO uplaylists (playlist_id, images, name, public, uri, tracks) VALUES ?"
                        con.query(sql, [values], function(err, result) {
                            if (err) throw err;
                            console.log("Number of playlists inserted: " + result.affectedRows);
                        })
                    
                    
                    //Gearsofwar3!
                    
                })
                
                pages += 5
               
                if(data.next == null) {
                    console.log("done")
                    break
                } 
            }
            getPlaylists()
        }
        getStuff()
    }
})

router.get('/liked', async (req, res) => {
    var url = ''
    const headers = {
        Authorization: 'Bearer ' + process.env.access_token
    }
    function getLiked(){
        var sql = 'select images, duration, track_id, name, artists from likedsongs'
        con.query(sql, function (err, result) {
            if (err) throw e

            var records = {}
            var items = []
            for (let i = 0; i < result.length; i++){
                var temp ={}
                var tracks = {}
                temp.images = JSON.parse(result[i].images)
                temp.duration_ms = result[i].duration
                temp.uri = "spotify:track:" + result[i].track_id
                temp.name = result[i].name
                temp.artists = JSON.parse(result[i].artists)
                
                items.push(temp)
            }
            tracks.tracks = items
            records.items = tracks
            res.send(records)
        })
    }

    if (inDB) {
        // var sql = 'select images, duration, track_id, name, artists from likedsongs'
        // con.query(sql, function (err, result) {
        //     if (err) throw e

        //     var records = {}
        //     var items = []
        //     for (let i = 0; i < result.length; i++){
        //         var temp ={}
        //         var tracks = {}
        //         temp.images = JSON.parse(result[i].images)
        //         temp.duration_ms = result[i].duration
        //         temp.uri = "spotify:track:" + result[i].track_id
        //         temp.name = result[i].name
        //         temp.artists = JSON.parse(result[i].artists)
                
        //         items.push(temp)
        //     }
        //     tracks.tracks = items
        //     records.items = tracks
        //     res.send(records)
        // })
        getLiked()
    }
    else{
        const getStuff = async() => {
            var pages = 0
            while(true) {
                url = `https://api.spotify.com/v1/me/tracks?offset=${pages}&limit=30`
                var resp = await fetch(url, {headers})
                var data = await resp.json()
                var values = []
                data.items.map(a => values.push([a.track.album.id, JSON.stringify(a.track.album.images), JSON.stringify(a.track.album.artists), a.track.duration_ms, a.track.id, a.track.name]))
                var sql = "INSERT INTO likedsongs (album_id, images, artists, duration, track_id, name) VALUES ?"
                con.query(sql, [values], function(err, result) {
                    if (err) throw err;
                    console.log("Number of liked songs inserted: " + result.affectedRows);
                })
                pages += 30
            
                if(data.next == null) {
                    break
                }
            }
            getLiked()
        }
        getStuff()
    }
})
module.exports = router;