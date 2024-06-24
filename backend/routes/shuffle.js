var express = require('express');
var router = express.Router();

router.post('/', async (req, res) => {
    const headers = {
      Authorization: 'Bearer ' + process.env.access_token
    }

    console.log(req.body.state)

    if (req.body.state === 'track' || req.body.state === 'context' || req.body.state === 'off'){
      url = `https://api.spotify.com/v1/me/player/repeat?state=${req.body.state}`
    }
    
    else url = `https://api.spotify.com/v1/me/player/shuffle?state=${req.body.state}`
    
      await fetch(url, {
        method: 'PUT',
        headers: headers,
      }).then(req.body.state === true || req.body.state === false ? console.log(req.body.state === true ? "Shuffled" : "Un-Shuffled") : console.log("Repeat mode: " + req.body.state))
})

module.exports = router;