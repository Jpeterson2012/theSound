const express = require('express');
const con = require('../sql');
const router = express.Router();

router.get('/', async (req, res) => {  
  const token = await con.getAccessToken(req.cookies.jwt);

  const info = [];

  let index = Math.floor(Math.random() * 51)
  //const url = `https://api.spotify.com/v1/browse/new-releases?offset=${index}&limit=50`;  

  const headers = {
    Authorization: 'Bearer ' + token
  };

  try{
    for (let i = 0; i < 2; i++) {
      const url = `https://api.spotify.com/v1/search?q=tag:new&type=album&offset=${40 * i}&limit=40`;

      const resp = await fetch(url, {headers});

      const data = await resp.json();      

      info.push(...data.albums.items);
    }
    
  res.send(info);
  }
  catch(e){
    console.error(e);
  };
})

module.exports = router;