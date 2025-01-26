var express = require('express');
var router = express.Router();
const { con } = require('../sql.js')

router.get('/:id', async (req, res) => {
    url = `https://api.spotify.com/v1/playlists/${req.params.id}/tracks`
    
    const headers = {
        Authorization: 'Bearer ' + process.env.access_token
      }

    var pages = 0
    let temp = []
    let temp2 = {}
    // var a = {}
    // var arr = []
    
    while(true) {
        url = `https://api.spotify.com/v1/playlists/${req.params.id}/tracks?offset=${pages}&limit=10`
        var resp = await fetch(url, {headers})
        var data = await resp.json()
        var arr = []
        var a = {}
        var album = {images: [{height: 64, url: 'https://images.inc.com/uploaded_files/image/1920x1080/getty_626660256_2000108620009280158_388846.jpg', width: 64}]}
        data.items?.map(a => a ? (arr.push({album_id: a.track?.album.id, images: (a.track?.album === null ? album : a.track?.album.images), name: a.track?.name, duration_ms: a.track?.duration_ms, artists: a.track?.artists, uri: a.track?.uri}),
           temp.push({ images: (a.track?.album === null ? album : a.track?.album.images),name: a.track?.name, duration_ms: a.track?.duration_ms,artists: a.track?.artists, uri: a.track?.uri, track_number: a.track?.track_number }) )
        : null)
        a.items = arr
        a.total = data.total
        let b = `${JSON.stringify(a)}`
        res.write(b)
        
        pages += 10
    
        if(data.next == null) {
            break
        }
    }    
    temp2.items = temp
    a.items = arr
    // res.send(a)
    res.end()
    try{        
        sql = 'select playlist_id from uplaylists where name = "temp_playlist"'
        con.query(sql, function(err,result) {
        if (err) throw err;
        var empty = result.length
        console.log(empty)
        if (empty === 0){
            let temp3 = []
            sql = `INSERT INTO uplaylists (playlist_id, images, name, public, uri, tracks) VALUES ('${req.params.id}', '${JSON.stringify(temp3)}', 'temp_playlist', true, 'spotify:playlist:${req.params.id}', ${con.escape(JSON.stringify(temp2))} )`
          con.query(sql, (err) => {
            if (err) throw err;
            console.log('Temp Playlist Added')
          })
        }
        else{
        if (result[0].playlist_id === req.params.id){
          console.log('playlist already exists')
        }
        else{
          sql = `UPDATE uplaylists SET playlist_id='${req.params.id}',uri='spotify:playlist:${req.params.id}',tracks=${con.escape(JSON.stringify(temp2))}  WHERE name = "temp_playlist"`
          con.query(sql, (err) => {
            if (err) throw err;
            console.log('Temp Playlist Updated')
          })
        }   
        }
        })     
    }
    catch(e){
    console.log(e)
    }



    
})

module.exports = router;