var express = require('express');
var router = express.Router();

router.get('/:id', async (req, res) => {
    var info = {}
    
    const headers = {
        Authorization: 'Bearer ' + process.env.access_token
      }
    try{

    url = `https://api.spotify.com/v1/artists/${req.params.id}/top-tracks`
    var resp = await fetch(url, {headers})
    var data = await resp.json()
    info.tracks = data

    url = `https://api.spotify.com/v1/artists/${req.params.id}/albums?include_groups=single,album,compilation&limit=50`
    resp = await fetch(url, {headers})
    data = await resp.json()
    info.albums = data

    res.send(info)
    }
    catch(e){
      console.error(e)
    }
    
    //   fetch(url, { headers })
    //       .then(response => response.json())
    //       .then(data => {
    //       res.send(data)
    //       })
    //       .catch(error => {
    //       // handle error
    //       });
})

module.exports = router;