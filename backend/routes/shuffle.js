var express = require('express');
var router = express.Router();

router.get('/', async (req, res) => {
    url = `https://api.spotify.com/v1/me/player/shuffle?state=true`
    const headers = {
        Authorization: 'Bearer ' + process.env.access_token
      }
      await fetch(url, {
        method: 'PUT',
        headers: headers,
      }).then(console.log("Shuffled"))
})

module.exports = router;