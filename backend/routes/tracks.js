const express = require('express');
const router = express.Router();
const con = require('../sql.js');

router.get('/:id', async (req, res) => {
    const token = await con.getAccessToken(req.cookies.jwt);
        
    const url = `https://api.spotify.com/v1/albums/${req.params.id}`;    

    const headers = {
        Authorization: 'Bearer ' + token
    };

    try{
        const resp = await fetch(url,{headers});
        const data = await resp.json();
        
        const apiRequestLoop = async () => {
            const promiseArray = [];

            for (let i = 0; i < data.artists.length; i++) {
                promiseArray.push(
                    await fetch(`https://api.spotify.com/v1/artists/${data.artists[i].id}`,{headers}).then(response => response.json())
                );
            }

            return Promise.all(promiseArray);
        };

        let temp2 = {};
        let images = [];

        await apiRequestLoop().then(artists => artists.map((a,i,arr) => {            
            images.push(a.images);

            if (arr.length - 1 === i) {
                temp2.albums = data;
                temp2.images = images;
                res.send(temp2);
            }
        }));

    } catch(e) {
        console.error(e);
    }
});

router.post('/artists', async (req, res) => {
    const token = await con.getAccessToken(req.cookies.jwt);

    const headers = {
        Authorization: 'Bearer ' + token
    };    

    let apiRequestLoop = async () => {
        const promiseArray = [];

        for (let i = 0; i < req.body.length; i++) {
            promiseArray.push(await fetch(`https://api.spotify.com/v1/artists/${req.body[i]}`,{headers}).then(response => response.json()))
        }

        return Promise.all(promiseArray);
    };

    let images = [];
    let temp2 = {};

    await apiRequestLoop().then(artists => artists.map((a,i,arr) => {
        images.push(a.images);

        if (arr.length - 1 === i) {
            temp2.images = images;
            
            res.send(temp2);
        }
    }));
});

module.exports = router;