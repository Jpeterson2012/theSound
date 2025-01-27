var express = require('express');
const { con } = require('../sql');
var router = express.Router();

router.get('/', async (req, res) => {
    // console.log(req.params.id)
    var info = {}
    url = 'https://api.spotify.com/v1/browse/new-releases?limit=50'
    const headers = {
        Authorization: 'Bearer ' + process.env.access_token
      }
    try{
    
    var resp = await fetch(url, {headers})
    var data = await resp.json()
    info.releases = data  

    url = 'https://api.spotify.com/v1/browse/featured-playlists'
    resp = await fetch(url, {headers})
    data = await resp.json()
    info.fplaylists = data

    res.send(info)
    }
    catch(e){
      console.error(e)
    }
})

module.exports = router;