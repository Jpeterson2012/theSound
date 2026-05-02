const express = require('express');
const router = express.Router();
const { asyncHandler, spotifyRequest } = require('../utils.js');

router.get('/devices', asyncHandler(async (req, res) => {
    const data = await spotifyRequest('me/player/devices', req.token);

    res.send(data.devices);
}));

router.get('/', asyncHandler(async (req, res) => {
    const data = await spotifyRequest('me/player', req.token);

    res.send({device: data.device, progress_ms: data.progress_ms, is_playing: data.is_playing, item: data.item});
}));

router.post('/:id', asyncHandler(async (req, res) => {
    await spotifyRequest('me/player', req.token, {
        method: 'PUT',        
        body: `{"device_ids": "${req.params.id}"}`,                        
    });

    res.sendStatus(204);
}));

router.post('/pause/:id', asyncHandler(async (req,res) => {
    await spotifyRequest('me/player/pause', req.token, {
        method: 'PUT',        
        body: `{"device_ids": "${req.params.id}"}`,                        
    });

    res.sendStatus(204);
}));

router.post('/play/:id', asyncHandler(async (req, res) => {
    await spotifyRequest('me/player/play', req.token, {
        method: 'PUT',        
        body: `{"device_ids": "${req.params.id}"}`,                        
    });

    res.sendStatus(204);
}));

router.post('/previous/:id', asyncHandler(async (req, res) => {
    await spotifyRequest('me/player/previous', req.token, {
        method: 'POST',        
        body: `{"device_ids": "${req.params.id}"}`,                        
    });

    res.sendStatus(204);
}));

router.post('/next/:id', asyncHandler(async (req, res) => {
    await spotifyRequest('me/player/next', req.token, {
        method: 'POST',        
        body: `{"device_ids": "${req.params.id}"}`,                        
    });

    res.sendStatus(204);
}));

router.get('/currently-playing', asyncHandler(async (req, res) => {
    const data = await spotifyRequest('/me/player/currently-playing', req.token);

    res.send(data);
}));

router.post('/volume/:id', asyncHandler(async (req, res) => {
    const arr = req.params.id.split(',');
    
    await spotifyRequest(`me/player/volume?volume_percent=${+arr[1]}&device_id=${arr[0]}`, req.token, {
        method: 'PUT',        
        body: JSON.stringify(req.body),                        
    });

    res.sendStatus(204);
}));

router.post('/seek/:id', asyncHandler(async (req, res) => {
    const arr = req.params.id.split(',');            
    
    await spotifyRequest(`me/player/seek?position_ms=${+arr[1]}&device_id=${arr[0]}`, req.token, {
        method: 'PUT',        
        body: JSON.stringify(req.body),                        
    });

    res.sendStatus(204);
}));

router.post('/playback/:id', asyncHandler(async (req, res) => {      
    await spotifyRequest(`me/player/play?device_id=${req.params.id}`, req.token, {
        method: 'PUT',        
        body: JSON.stringify(req.body),                        
    });

    res.sendStatus(204);    
}));

module.exports = router;