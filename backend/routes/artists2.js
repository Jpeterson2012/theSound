var express = require('express');
var router = express.Router();

router.get('/:id', async (req, res) => {
  const headers = {
    Authorization: 'Bearer ' + req.session.access_token,        
    }
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
  
      if(data.next == null) {
        break;
      }
    }  

    res.end();
  }
  catch(e){
    console.error(e);
  }   
})

router.get('/albums/:id', async (req, res) => {
  const headers = {
    Authorization: 'Bearer ' + req.session.access_token,        
  }

  const url = `https://api.spotify.com/v1/artists/${req.params.id}/albums?limit=20`;

  let resp = await fetch(url, {headers});
  let data = await resp.json();

  res.send(data.items);
});

module.exports = router;