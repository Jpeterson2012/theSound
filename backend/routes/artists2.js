const express = require('express');
const router = express.Router();
const con = require('../database/dbpool.js');

router.get('/:id', async (req, res) => {
  const token = await con.getAccessToken(req.cookies.jwt);

  const headers = {
    Authorization: 'Bearer ' + token,        
  };

  try{    
  
    // let temp = []

    // const getStuff = async() => {
    //   //Fetch user's saved playlists
    //   var pages = 0
    //   while(true) {
    //       url = `https://api.spotify.com/v1/artists/${req.params.id}/albums?include_groups=single,album,appears_on,compilation&offset=${pages}&limit=50`

    //     resp = await fetch(url, {headers})
    //     data = await resp.json()
    //     temp.push(...data.items)

    //     pages += 50

    //     if(data.next == null) {
    //         console.log("done")
    //         break
    //     } 
    //   }
    //   info.albums = {}
    //   info.albums.items = temp
    //   res.send(info)
    // }

    // getStuff()
    
    let pages = 0;

    while(true) {
      //const url = `https://api.spotify.com/v1/artists/${req.params.id}/albums?include_groups=single,album,appears_on,compilation&offset=${pages}&limit=35`;
      const url = `https://api.spotify.com/v1/artists/${req.params.id}/albums?include_groups=single,album,compilation&offset=${pages}&limit=35`;

      let musicObj = {music: []};        

      let resp = await fetch(url, {headers});
      let data = await resp.json();        

      musicObj.music.push(
        ...data.items.map(item => {
          const {available_markets, ...rest} = item;
          
          return rest;
        })
      );
      
      res.write(JSON.stringify(musicObj) + "\n");
      
      pages += 35;
  
      if(!data.next) {
        break;
      }
    };  

    res.end();
  }
  catch(e){
    console.error(e);
  };   
});

router.get('/albums/:id', async (req, res) => {
  const token = await con.getAccessToken(req.cookies.jwt);

  let arr = req.params.id;

  arr = arr.split(',');

  const headers = {
    Authorization: 'Bearer ' + token,        
  }

  let items = {};

  for (let i = 0; i < arr.length; i++) {
    const url = `https://api.spotify.com/v1/artists/${arr[i]}/albums?limit=15`;

    let resp = await fetch(url, {headers});
    let data = await resp.json();

    items[arr[i]] = data.items;
  }  

  res.send(items);
});

module.exports = router;