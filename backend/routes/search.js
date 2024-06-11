var express = require('express');
var router = express.Router();

router.get('/:id', async (req, res) => {
    // console.log(req.params.id)
    const headers = {
      Authorization: 'Bearer ' + process.env.access_token
    }
    var i = 0
    for (var i = 0; i < 3; i++){
      url = `https://api.spotify.com/v1/search?q=${req.params.id}&offest=${i}&limit=1&type=track,artist,album,playlist`
      var resp = await fetch(url, {headers})
      var data = await resp.json()
      res.write(data.albums.total.toString())
    }
    res.end()
    
    // url = `https://api.spotify.com/v1/search?q=${req.params.id}&type=track,artist,album,playlist`
    // const headers = {
    //     Authorization: 'Bearer ' + process.env.access_token
    //   }

    // var resp = await fetch(url, {headers})
    // var data = await resp.json()
    

    // res.send(data)
    
    
})

module.exports = router;