var express = require('express');
var router = express.Router();

router.get('/devices', async (req,res) => {
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

router.get('/', async(req,res) => {
    url = 'https://api.spotify.com/v1/me/player'
    try{
        const headers = {
            Authorization: 'Bearer ' + process.env.access_token
          }
    
        var resp = await fetch(url, {headers})
        var data = await resp.json()
        res.send({device: data.device, progress_ms: data.progress_ms, is_playing: data.is_playing, item: data.item})
    
        
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

router.post('/volume/:id', async(req,res) => {
    let arr = req.params.id    
    arr = arr.split(',')
    console.log(arr[0])
    
    url = `https://api.spotify.com/v1/me/player/volume?volume_percent=${+arr[1]}&device_id=${arr[0]}`    
    try{        
        const headers = {
            Authorization: 'Bearer ' + process.env.access_token
          }
    
          await fetch(url, {
            method: 'PUT',
            headers: headers                        
        }).then(res.send("201"))
    }
    catch (e){
        console.log(e)
    }
})

router.post('/seek/:id', async(req,res) => {
    let arr = req.params.id    
    arr = arr.split(',')    
    
    url = `https://api.spotify.com/v1/me/player/seek?position_ms=${+arr[1]}&device_id=${arr[0]}`    
    try{        
        const headers = {
            Authorization: 'Bearer ' + process.env.access_token
          }
    
          await fetch(url, {
            method: 'PUT',
            headers: headers                        
        }).then(res.send("201"))
    }
    catch (e){
        console.log(e)
    }
})

module.exports = router;