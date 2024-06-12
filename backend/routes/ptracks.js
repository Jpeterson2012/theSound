var express = require('express');
var router = express.Router();

router.get('/:id', async (req, res) => {
    url = `https://api.spotify.com/v1/playlists/${req.params.id}/tracks`
    
    const headers = {
        Authorization: 'Bearer ' + process.env.access_token
      }

    var pages = 0
    
    while(true) {
        url = `https://api.spotify.com/v1/playlists/${req.params.id}/tracks?offset=${pages}&limit=15`
        var resp = await fetch(url, {headers})
        var data = await resp.json()
        var arr = []
        var a = {}
        var album = {images: [{height: 64, url: 'https://images.inc.com/uploaded_files/image/1920x1080/getty_626660256_2000108620009280158_388846.jpg', width: 64}]}
        data.items.map(a => arr.push({album: (a.track?.album === null ? album : a.track?.album), name: a.track?.name, duration_ms: a.track?.duration_ms}))
        a.items = arr
        res.write(JSON.stringify(a))
        
        pages += 15
    
        if(data.next == null) {
            break
        }
    }
    
    res.end()
})

module.exports = router;