var express = require('express');
var router = express.Router();
const { con } = require('../sql.js')

// router.get('/:id', async (req, res) => {
//     // console.log(req.params.id)
//     // console.log(req.params.id)
//     console.log(`PlaylistID:${req.params.id}`)
    
//     const headers = {
//         Authorization: 'Bearer ' + process.env.access_token
//       }
//       try{
//       var pages = 0
//       while (pages < 30){
//         url = `https://api.spotify.com/v1/browse/categories/${req.params.id}/playlists?offset=${pages}&limit=5`
//         var resp = await fetch(url, {headers})
//         var data = await resp.json()
//         console.log(data)
//         let temp = {}
//         let temp2 = []
//         data.playlists.items?.map(a => temp2.push({name: a.name, images: a.images, uri: a.uri, primary_color: a.primary_color, description: a.description}))
//         // console.log(temp2)
//         temp.playlists = temp2
//         res.write(JSON.stringify(temp))
//         pages += 5
//       }
//       res.end()
//     }
//     catch(e){
//       console.error(e)
//     }
    
//     //   fetch(url, { headers })
//     //       .then(response => response.json())
//     //       .then(data => {
//     //       res.send(data)
//     //       })
//     //       .catch(error => {
//     //       // handle error
//     //       });
// })

router.get('/:id', async (req,res) => {
  
  var sql = `SELECT * from ${req.params.id}`
  con.query(sql, function (err,result) {
    console.log(result.length)
    if (err) throw err;
    var items = []
    for (let i = 0; i < result.length; i++){
        var temp ={}
        temp.playlist_id = result[i].playlist_id
        temp.images = JSON.parse(result[i].images) === null ? [] : JSON.parse(result[i].images)
        temp.name = result[i].name
        temp.public = result[i].public
        temp.uri = result[i].uri
        var temp2 = JSON.parse(result[i].tracks)                
        
        var temp3 = []
        temp2 === null ? null : temp2.items?.map(a => {
            temp3.push({album_id: a.album?.id, images: a.album?.images ? a.album?.images : (a.images ?  a.images : null), uri: a.uri, name: a.name, track_number: a.track_number, duration_ms: a.duration_ms, artists: a.artists})
        }) 
        temp.tracks = temp3
        items.push(temp)                
        }
    res.send(items)
})
})

module.exports = router;