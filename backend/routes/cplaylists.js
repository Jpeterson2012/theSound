var express = require('express');
var router = express.Router();

router.get('/:id', async (req, res) => {
    // console.log(req.params.id)
    // console.log(req.params.id)
    
    
    const headers = {
        Authorization: 'Bearer ' + process.env.access_token
      }
      try{
      var pages = 0
      while (pages < 30){
        url = `https://api.spotify.com/v1/browse/categories/${req.params.id}/playlists?offset=${pages}&limit=5`
        var resp = await fetch(url, {headers})
        var data = await resp.json()
        let temp = {}
        let temp2 = []
        data.playlists.items?.map(a => temp2.push({name: a.name, images: a.images, uri: a.uri, primary_color: a.primary_color, description: a.description}))
        // console.log(temp2)
        temp.playlists = temp2
        res.write(JSON.stringify(temp))
        pages += 5
      }
      res.end()
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