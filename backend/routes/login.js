const express = require('express');
const router = express.Router();
const auth = require("./AuthRoutes.js");
const crypto = require('crypto');

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
};

const sha256 = async (plain) => {
  const encoder = new TextEncoder();

  const data = encoder.encode(plain);

  return crypto.subtle.digest('SHA-256', data);
};

const base64encode = (input) => {
  return btoa(String.fromCharCode(...new Uint8Array(input)))
    .replace(/=/g, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_');
};

router.get('/', async (req, res) => {

  //Old flow
  const state = generateRandomString(16);
  const scope =
  `user-modify-playback-state
  user-read-playback-state
  user-read-currently-playing
  user-read-recently-played
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
  auth.querystring.stringify({
    response_type: 'code',
    client_id: process.env.CLIENT_ID,
    scope: scope,
    redirect_uri: process.env.REDIRECTURI,
    state: state,
    //show_dialog: true,
  }));

  //New flow
  //const state = generateRandomString(64);
//
  //const hashed = await sha256(state);
//
  //const codeChallenge = base64encode(hashed);
//
  //res.redirect('https://accounts.spotify.com/authorize?' +
  //  auth.querystring.stringify({
  //    response_type: 'code',
  //    client_id: process.env.CLIENT_ID,
  //    scope,
  //    redirect_uri: process.env.REDIRECTURI,
  //    state: state,
  //    code_challenge_method: 'S256',
  //    code_challenge: codeChallenge,
  //    show_dialog: true,
  //  }));
});

module.exports = router;
