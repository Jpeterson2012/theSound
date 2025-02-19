var express = require('express');
var router = express.Router();
const { con } = require('../sql.js')

// router.get('/:id', async (req, res) => {
//     // console.log(req.params.id)
//     const headers = {
//       Authorization: 'Bearer ' + process.env.access_token
//     }
//     var pages = 0
//     try{
//     while (pages < 25){

    
//       url = `https://api.spotify.com/v1/search?q=${req.params.id}&offset=${pages}&limit=5&type=track,album,artist,playlist`
//       var resp = await fetch(url, {headers})
//       var data = await resp.json()
//       let temp = {}
//       let temp2 = []
//       data.albums.items.map(a => a ? temp2.push({name: a.name, id: a.id, images: a.images, artists: a.artists, url: a.url}) : null)
//       temp.albums = temp2
//       temp2 = []
    
//       data.tracks.items.map(a => a ? temp2.push({name: a.name, album_name: a.album.name, artists: a.artists, images: a.album.images, url: a.album.uri, track_number: a.track_number, duration_ms: a.duration_ms}) : null)      
//       temp.tracks = temp2
//       temp2 = []
      
//       data.artists.items.map(a => a ?temp2.push({name: a.name, id: a.id, images: a.images}) : null)
//       temp.artists = temp2
//       temp2 = []
      
//       data.playlists.items.map(a => a ? temp2.push({name: a.name, id: a.id, images: a.images}) : null)
//       temp.playlists = temp2
//       temp2 = []
      
      
//       res.write(JSON.stringify(temp))
//       pages += 5
//     }
//     res.end()
//   }
//   catch(e){
//     console.error(e)
//   }
  
// })

router.get('/:id', async (req, res) => {
  let arr = req.params.id
  arr = arr.split(',')
  // console.log(req.params.id)
  const headers = {
    Authorization: 'Bearer ' + process.env.access_token
  }
  var pages = 0
  try{
  

  
    url = `https://api.spotify.com/v1/search?q=${arr[0]}&offset=${arr[1]}&limit=10&type=track,album,artist,playlist`
    var resp = await fetch(url, {headers})
    var data = await resp.json()
    let temp = {}
    let temp2 = []
    data.albums?.items?.map(a => a ? temp2.push({name: a.name, id: a.id, images: a.images, artists: a.artists, url: a.url}) : null)
    temp.albums = temp2
    temp2 = []
  
    data.tracks?.items?.map(a => a ? temp2.push({name: a.name, album_name: a.album.name, artists: a.artists, images: a.album.images, url: a.album.uri, track_number: a.track_number, duration_ms: a.duration_ms}) : null)      
    temp.tracks = temp2
    temp2 = []
    
    data.artists?.items?.map(a => a ? temp2.push({name: a.name, id: a.id, images: a.images}) : null)
    temp.artists = temp2
    temp2 = []
    
    data.playlists?.items?.map(a => a ? temp2.push({name: a.name, id: a.id, images: a.images}) : null)
    temp.playlists = temp2
    temp2 = []
    
    
    res.send(temp)
  
  
}
catch(e){
  console.error(e)
}

})

function generatePassword() {
  var length = 22,
      charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789",
      retVal = "";
  for (var i = 0, n = charset.length; i < length; ++i) {
      retVal += charset.charAt(Math.floor(Math.random() * n));
  }
  return retVal;
}


// router.get('/cplaylist', async (req,res) => {
//   console.log('hello')
//   const headers = {
//           Authorization: 'Bearer ' + process.env.access_token
//         }        
//         const vars = ["hip hop", "country", "pop", "latin", "rock", "dance", "indie","r&b","gospel","workout", "mexican traditional", "k-pop", "chill groove", 
//                       "sleep", "metal", "jazz", "broadway", "classical","folk","soul","anime","punk","ambient","blues"]
//         console.log(vars[0])
//         let images = []
//         images.push({"uri": "https://t.scdn.co/images/728ed47fc1674feb95f7ac20236eb6d7.jpeg","height": 274, "width": 274})
//         images.push({"uri": "https://t.scdn.co/media/derived/icon-274x274_5ce6e0f681f0a76f9dcf9270dfd18489_0_0_274_274.jpg","height": 274, "width": 274})
//         images.push({"uri": "https://t.scdn.co/media/original/mood-274x274_976986a31ac8c49794cbdc7246fd5ad7_274x274.jpg","height": 274, "width": 274})
//         images.push({"uri": "https://t.scdn.co/images/7ee6530d5b3c4acc9a0957046bf11d63","height": 274, "width": 274})
//         images.push({"uri": "https://t.scdn.co/images/cad629fb65a14de4beddb38510e27cb1","height": 274, "width": 274})
//         images.push({"uri": "https://t.scdn.co/images/c5495b9f0f694ffcb39c9217d4ed4375","height": 274, "width": 274})
//         images.push({"uri": "https://t.scdn.co/images/0d39395309ba47838ef12ce987f19d16.jpeg","height": 274, "width": 274})
//         images.push({"uri": "https://t.scdn.co/images/384c2b595a1648aa801837ff99961188","height": 274, "width": 274})
//         try{
//           for(let i = 0; i < vars.length; i++){
//             var pages = 0
//             var pName = 1
//             let sql = `CREATE TABLE IF NOT EXISTS ${vars[i].replace(' ','')} (id INT AUTO_INCREMENT PRIMARY KEY, playlist_id VARCHAR(70), images LONGTEXT, name VARCHAR(100), public BOOL, uri varCHAR(40), tracks JSON)`
//             con.query(sql, function(err) {
//               if (err) throw err
//               console.log('Table Created')
//             })

//             while (pages < 1000){
    
        
//               url = `https://api.spotify.com/v1/search?offset=${pages}&limit=50&genre=${vars[i]}&type=track`
//               var resp = await fetch(url, {headers})
//               var data = await resp.json()
//               let values = []
//               let temp = {}
//               let temp2 = []
//               let pID = generatePassword()
//               let index = Math.floor(Math.random() * 8)
             
            
//               // data.tracks.items.map(a => a ? temp2.push({name: a.name, album_name: a.album.name, artists: a.artists, images: a.album.images, uri: a.album.uri, track_number: a.track_number, duration_ms: a.duration_ms}) : null)
//               data.tracks.items.map(a => a && temp2.push(a))      
//               temp.items = temp2

//               values.push([pID, JSON.stringify([images[index]]), `Playlist${pName}`, true, 'spotify:playlist:' + pID, JSON.stringify(temp)])           
//               sql = `INSERT INTO ${vars[i].replace(' ','')} (playlist_id, images, name, public, uri, tracks) VALUES ?`
//                   con.query(sql, [values], function(err, result) {
//                       if (err) throw err;
//                       console.log("Number of playlists inserted: " + result.affectedRows);
//                   })
                            
//               pName += 1
//               pages += 50
//             }
//           }                
//         }
//       catch(e){
//         console.error(e)
//       }
//       // res.send("200")

// })

module.exports = router;