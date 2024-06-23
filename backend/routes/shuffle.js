var express = require('express');
var router = express.Router();

router.post('/', async (req, res) => {
    console.log(req.body.state)
    url = `https://api.spotify.com/v1/me/player/shuffle?state=${req.body.state}`
    const headers = {
        Authorization: 'Bearer ' + process.env.access_token
      }
      await fetch(url, {
        method: 'PUT',
        headers: headers,
      }).then(console.log(req.body.state === true ? "Shuffled" : "Un-Shuffled"))
})

module.exports = router;