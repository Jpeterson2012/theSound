var express = require('express');
var router = express.Router();

router.get('/:id', async (req, res) => {
    // console.log(req.params.id)
    console.log(req.params.id)
    url = `https://api.spotify.com/v1/browse/categories/${req.params.id}/playlists`
    
    const headers = {
        Authorization: 'Bearer ' + process.env.access_token
      }
    
      fetch(url, { headers })
          .then(response => response.json())
          .then(data => {
          res.send(data)
          })
          .catch(error => {
          // handle error
          });
})

module.exports = router;