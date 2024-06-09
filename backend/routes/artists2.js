var express = require('express');
var router = express.Router();

router.get('/:id', async (req, res) => {
    var info = {}
    
    const headers = {
        Authorization: 'Bearer ' + process.env.access_token
      }

    url = `https://api.spotify.com/v1/artists/${req.params.id}/top-tracks`
    resp = await fetch(url, {headers})
    data = await resp.json()
    info.tracks = data

    url = `https://api.spotify.com/v1/artists/${req.params.id}/albums`
    resp = await fetch(url, {headers})
    data = await resp.json()
    info.albums = data

    res.send(info)
    
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