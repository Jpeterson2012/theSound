var mystuff = require("./AuthRoutes.js");
var express = require('express');
var router = express.Router();

router.get('/:id', async (req, res) => {
    console.log(req.params.id)
    url = `https://api.spotify.com/v1/me/player/play?device_id=${req.params.id}`
    const headers = {
        "Content-Type": "application/json",
        Authorization: 'Bearer ' + process.env.access_token
      }
    const body = {
        context_url: "spotify:album:5ht7ItJgpBH7W6vJ5BqpPr",
        offset: {position: 5},
        // uris: [req.params.id],
        position_ms: 0
    }
    await fetch(url, {
        method: 'PUT',
        headers: headers,
        body: JSON.stringify({uris: ["spotify:track:7xGfFoTpQ2E7fRF5lN10tr"]})
    })
    .then(response => response.json())
    .then(data => console.log(data))
    
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