const express = require('express');
const router = express.Router();
const con = require('../sql.js');

router.get('/:id', async (req, res) => {
  const token = await con.getAccessToken(req.cookies.jwt);

  try{
    const info = {};

    let url = `https://api.spotify.com/v1/artists/${req.params.id}`;

    const headers = {
      Authorization: 'Bearer ' + token
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