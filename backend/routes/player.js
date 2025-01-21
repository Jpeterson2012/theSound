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
        }).then(res.send("201"))
    
        
    }
    catch (e){
        console.log(e)
    }
})

router.post('/pause/:id', async(req,res) => {
    url = 'https://api.spotify.com/v1/me/player/pause'
    try{
        const headers = {
            Authorization: 'Bearer ' + process.env.access_token            
          }
    
        await fetch(url, {
            method: 'PUT',
            headers: headers,
            body: `{"device_ids": "${req.params.id}"}`            
        }).then(res.send("201"))
    
        
    }
    catch (e){
        console.log(e)
    }
})

router.post('/play/:id', async(req,res) => {
    url = 'https://api.spotify.com/v1/me/player/play'
    try{
        const headers = {
            Authorization: 'Bearer ' + process.env.access_token            
          }
    
        await fetch(url, {
            method: 'PUT',
            headers: headers,
            body: `{"device_ids": "${req.params.id}"}`            
        }).then(res.send("201"))
    
        
    }
    catch (e){
        console.log(e)
    }
})

router.post('/previous/:id', async(req,res) => {
    url = 'https://api.spotify.com/v1/me/player/previous'
    try{
        const headers = {
            Authorization: 'Bearer ' + process.env.access_token            
          }
    
        await fetch(url, {
            method: 'POST',
            headers: headers,
            body: `{"device_ids": "${req.params.id}"}`            
        }).then(res.send("201"))
    
        
    }
    catch (e){
        console.log(e)
    }
})

router.post('/next/:id', async(req,res) => {
    url = 'https://api.spotify.com/v1/me/player/next'
    try{
        const headers = {
            Authorization: 'Bearer ' + process.env.access_token            
          }
    
        await fetch(url, {
            method: 'POST',
            headers: headers,
            body: `{"device_ids": "${req.params.id}"}`            
        }).then(res.send("201"))
    
        
    }
    catch (e){
        console.log(e)
    }
})

router.get('/currently-playing', async(req,res) => {
    url = 'https://api.spotify.com/v1/me/player/currently-playing'
    try{
        const headers = {
            Authorization: 'Bearer ' + process.env.access_token
          }
    
        var resp = await fetch(url, {headers})
        var data = await resp.json()
        res.send(data)
    }
    catch (e){
        console.log(e)
    }

})

module.exports = router;