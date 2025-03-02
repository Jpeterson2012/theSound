var express = require('express');
var router = express.Router();

router.get('/:id', async (req, res) => {
    // var info = {}
    
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
      
      let pages = 0
      while(true) {
        url = `https://api.spotify.com/v1/artists/${req.params.id}/albums?include_groups=single,album,appears_on,compilation&offset=${pages}&limit=5`
        let info = {}
        let temp = []
        let resp = await fetch(url, {headers})
        let data = await resp.json()
        data.items.map(a => delete a['available_markets'])
        temp.push(...data.items)
        
        info.albums = {}
        info.albums.items = temp
        let b = JSON.stringify(info,null, 0)
                
        res.write(b)
        
        pages += 5
    
        if(data.next == null) {
            break
        }
      }                
      res.end()











    }
    catch(e){
      console.error(e)
    }   
})

module.exports = router;