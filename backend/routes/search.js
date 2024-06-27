var express = require('express');
var router = express.Router();

router.get('/:id', async (req, res) => {
    // console.log(req.params.id)
    const headers = {
      Authorization: 'Bearer ' + process.env.access_token
    }
    var pages = 0
    try{
    while (pages < 25){

    
      url = `https://api.spotify.com/v1/search?q=${req.params.id}&offset=${pages}&limit=5&type=track,album,artist,playlist`
      var resp = await fetch(url, {headers})
      var data = await resp.json()
      let temp = {}
      let temp2 = []
      data.albums.items.map(a => temp2.push({name: a.name, id: a.id, images: a.images, artists: a.artists, url: a.url}))
      temp.albums = temp2
      temp2 = []
    
      data.tracks.items.map(a => temp2.push({name: a.name, album_name: a.album.name, artists: a.artists, images: a.album.images, url: a.album.uri, track_number: a.track_number, duration_ms: a.duration_ms}))      
      temp.tracks = temp2
      temp2 = []
      
      data.artists.items.map(a => temp2.push({name: a.name, id: a.id, images: a.images}))
      temp.artists = temp2
      temp2 = []
      
      data.playlists.items.map(a => temp2.push({name: a.name, id: a.id, images: a.images}))
      temp.playlists = temp2
      temp2 = []
      
      
      res.write(JSON.stringify(temp))
      pages += 5
    }
    res.end()
  }
  catch(e){
    console.error(e)
  }
  
})

module.exports = router;