var express = require('express');
var router = express.Router();

router.get('/', async (req, res) => {
    // console.log(req.params.id)
    var info = {}
    url = 'https://api.spotify.com/v1/browse/new-releases'
    const headers = {
        Authorization: 'Bearer ' + process.env.access_token
      }
    
    var resp = await fetch(url, {headers})
    var data = await resp.json()
    info.releases = data  

    url = 'https://api.spotify.com/v1/browse/featured-playlists'
    resp = await fetch(url, {headers})
    data = await resp.json()
    info.fplaylists = data

    res.send(info)
})

module.exports = router;