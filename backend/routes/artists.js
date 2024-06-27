var express = require('express');
var router = express.Router();

router.get('/:id', async (req, res) => {
    // console.log(req.params.id)
    try{
    var info = {}
    url = `https://api.spotify.com/v1/artists/${req.params.id}`
    const headers = {
        Authorization: 'Bearer ' + process.env.access_token
      }

    var resp = await fetch(url, {headers})
    var data = await resp.json()
    info.artists = data

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