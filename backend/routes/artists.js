var express = require('express');
var router = express.Router();

router.get('/:id', async (req, res) => {    
  try{
    const info = {};

    let url = `https://api.spotify.com/v1/artists/${req.params.id}`;

    const headers = {
      Authorization: 'Bearer ' + req.session.access_token
    };

    const resp = await fetch(url, {headers});
    const data = await resp.json();
    info.artists = data;

    url = `https://api.spotify.com/v1/artists/${req.params.id}/top-tracks`;
    const resp2 = await fetch(url, {headers});
    const data2 = await resp2.json();
    info.tracks = data2;

    res.send(info);
  }
  catch(e) {
    console.error(e);
  };        
});

module.exports = router;