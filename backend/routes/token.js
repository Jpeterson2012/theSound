const express = require('express');
const router = express.Router();
const mystuff = require("./AuthRoutes.js");
const con = require('../sql.js');

router.get('/', async (req, res) => {
    try{        
        const token = await con.getLogin(req.cookies.jwt);

        res.send(token);
    } catch(e) {
        console.error(e);
    }
})
//Handle refresh token
router.post('/refresh_token', async (req, res) => {   
    const url = 'https://accounts.spotify.com/api/token';

    try{
        const headers = {
            'content-type': 'application/x-www-form-urlencoded',
            'Authorization': 'Basic ' + (new Buffer.from(process.env.CLIENT_ID + ':' + process.env.CLIENT_SECRET).toString('base64'))
          }
        const body = {
            grant_type: 'refresh_token',
            refresh_token: req.body.refresh_token
        }
          await fetch('https://accounts.spotify.com/api/token', {
            method: 'POST',
            headers: headers,
            body: mystuff.encodeFormData(body)                        
          })
          .then(response => response.json())
          .then(data => {             
            console.log(data)                                   
            req.session.access_token = data.access_token;            
            req.session.expires_in = data.expires_in;
            
            res.send({
                access_token: req.session.access_token,                
                expires_in: req.session.expires_in,
            });
        })
    }
    catch(e){
        console.log(e)
    }
});

module.exports = router;