const express = require('express');
const router = express.Router();
const con = require('../sql.js');

router.post('/', async (req, res) => {
  const token = await con.getAccessToken(req.cookies.jwt);
  
  const headers = {
    Authorization: 'Bearer ' + token
  };

  try{
    console.log(req.body.state);

    const func = ["track", "context", "off"].includes(req.body.state) ? "repeat" : "shuffle";

    const url = `https://api.spotify.com/v1/me/player/${func}?state=${req.body.state}`;
  
    await fetch(url, {
      method: 'PUT',
      headers: headers,
    }).then(res.status(200).json({success: true}));
  }
  catch(e){
    console.log(e);

    res.status(500).json({success: false, message: `Setting shuffle/repeat failed: ${e}`});
  }
})

module.exports = router;