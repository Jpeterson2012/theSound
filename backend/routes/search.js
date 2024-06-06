var express = require('express');
var router = express.Router();

router.get('/:id', async (req, res) => {
    // console.log(req.params.id)
    
    url = `https://api.spotify.com/v1/search?q=${req.params.id}&type=track,artist,album,playlist`
    const headers = {
        Authorization: 'Bearer ' + process.env.access_token
      }

    var resp = await fetch(url, {headers})
    var data = await resp.json()
    

    res.send(data)
    
    
})

module.exports = router;