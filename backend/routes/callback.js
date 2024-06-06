// var client_id = 'e592b67b622249c38b5c046ebd663136';
// var client_secret = '7f75d9416aa441fdb9bdf259688e22c6';
// var redirect_uri = 'http://localhost:3000/callback';

// var express = require('express');
// var router = express.Router();
var mystuff = require("./AuthRoutes.js");
var express = require('express');
var router = express.Router();
const { x } = require('../varListen.js')

router.get('/', async (req, res) => {

    const body = {
        grant_type: 'authorization_code',
        code: req.query.code,
        redirect_uri: process.env.REDIRECTURI,
        client_id: process.env.CLIENT_ID,
        client_secret: process.env.CLIENT_SECRET,
      }
    
      await fetch('https://accounts.spotify.com/api/token', {
        method: 'POST',
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          "Accept": "application/json"
        },
        body: mystuff.encodeFormData(body)
      })
      .then(response => response.json())
      .then(data => {
        process.env['access_token'] = data.access_token
        x.a=2
        // process.env['token_type'] = data.token_type
        // process.env['expires_in'] = data.expires_in
        // process.env['scope'] = data.scope
        // console.log(process.env['expires_in'])
        // console.log('')

        const query = mystuff.querystring.stringify(data);
        res.redirect('http://localhost:5173/app/');
        

        
        


      });



})
module.exports = router;
  