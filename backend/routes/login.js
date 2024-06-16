// var client_id = 'e592b67b622249c38b5c046ebd663136';
// var redirect_uri = 'http://localhost:3000/callback';

// const querystring = require("querystring");
// var express = require('express');
// var router = express.Router();
var mystuff = require("./AuthRoutes.js");

function generateRandomString(length) {
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    let counter = 0;
    while (counter < length) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
      counter += 1;
    }
    return result;
}

var express = require('express');
var router = express.Router();
router.get('/', async (req, res) => {

  var state = generateRandomString(16);
  const scope =
  `user-modify-playback-state
  user-read-playback-state
  user-read-currently-playing
  streaming
  user-read-email
  user-read-private
  user-library-modify
  user-library-read
  user-top-read
  playlist-read-private
  playlist-read-collaborative
  playlist-modify-private
  playlist-modify-public`;

  res.redirect('https://accounts.spotify.com/authorize?' +
    mystuff.querystring.stringify({
      response_type: 'code',
      client_id: process.env.CLIENT_ID,
      scope: scope,
      redirect_uri: process.env.REDIRECTURI,
      state: state
    }));
});

module.exports = router;
