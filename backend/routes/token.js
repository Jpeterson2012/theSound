var express = require('express');
var router = express.Router();
var mystuff = require("./AuthRoutes.js");


router.get('/', function(req, res) {
    // x.registerListener(function() {
    //     console.log('')
    //     console.log(req.session.access_token)
    //     console.log('')
    //     var token = {items: req.session.access_token}
    //     res.send(token)
    // })
    try{
    var token = {items: req.session.access_token}
    res.send(token)
    }
    catch(e){
        console.error(e)
    }
})
//Handle refresh token
router.get('/refresh_token', async function(req, res) {

    url = 'https://accounts.spotify.com/api/token'
    try{
        const headers = {
            'content-type': 'application/x-www-form-urlencoded',
            'Authorization': 'Basic ' + (new Buffer.from(process.env.CLIENT_ID + ':' + process.env.CLIENT_SECRET).toString('base64'))
          }
        const body = {
            grant_type: 'refresh_token',
            refresh_token: req.session.refresh_token
        }
          await fetch('https://accounts.spotify.com/api/token', {
            method: 'POST',
            headers: headers,
            body: mystuff.encodeFormData(body)                        
          })
          .then(response => response.json())
          .then(data => {            
            req.session.access_token = data.access_token
            res.send({items: req.session.access_token})
        })
    }
    catch(e){
        console.log(e)
    }
    


});

module.exports = router;