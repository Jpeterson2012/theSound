var express = require('express');
var router = express.Router();

router.get('/:id', async (req, res) => {
    // console.log(req.params.id)
    const headers = {
      Authorization: 'Bearer ' + process.env.access_token
    }
    var pages = 0
    while (pages < 20){

    
      url = `https://api.spotify.com/v1/search?q=${req.params.id}&offset=${pages}&limit=5&type=track`
      var resp = await fetch(url, {headers})
      var data = await resp.json()
      
      res.write(JSON.stringify(data))
      pages += 5
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