var express = require('express');
var router = express.Router();

router.get('/', async (req,res) => {
    url = 'https://api.spotify.com/v1/me/player/devices'
    try{
        const headers = {
            Authorization: 'Bearer ' + process.env.access_token
          }
    
        var resp = await fetch(url, {headers})
        var data = await resp.json()
        res.send(data.devices)
    }
    catch (e){
        console.log(e)
    }
})

router.post('/:id', async(req,res) => {
    url = 'https://api.spotify.com/v1/me/player'
    try{
        const headers = {
            Authorization: 'Bearer ' + process.env.access_token            
          }
    
        await fetch(url, {
            method: 'PUT',
            headers: headers,
            body: `{"device_ids": ["${req.params.id}"]}`
        }).then(res => console.log(`Status Text: ${res.statusText}, Status: ${res.status}`))
    
        
    }
    catch (e){
        console.log(e)
    }
})

module.exports = router;