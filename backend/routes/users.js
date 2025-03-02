var express = require('express');
var router = express.Router();
const { con } = require('../sql.js')

function generatePassword() {
  var length = 22,
      charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789",
      retVal = "";
  for (var i = 0, n = charset.length; i < length; ++i) {
      retVal += charset.charAt(Math.floor(Math.random() * n));
  }
  return retVal;
}
function removeCat(){
  const vars = ["hip hop", "country", "pop", "latin", "rock", "dance", "indie","r&b","gospel","workout", "mexican traditional", "k-pop", "chill groove", 
    "sleep", "metal", "jazz", "broadway", "classical","folk","soul","anime","punk","ambient","blues","afrobeat","singer-songwriter","disco"]
  let arr = {}
  vars.map(a => arr[a.replaceAll(' ','').replace('&','and').replace('-','')] = 1)
  let sql = 'SELECT name FROM categories'
  con.query(sql, function(err,result) {
  if (err) throw err

    let temp = result.filter(b => arr[b.name.toLowerCase().replace(' ','').replace('&','and').replace('-','')] === undefined)
    let temp2 = []
    console.log(vars.length)
    console.log(temp.length)
    result.filter(b => arr[b.name.toLowerCase().replace(' ','').replace('&','and').replace('-','')] === undefined).map(a => temp2.push(`"${a.name}"`))
    // console.log(temp2.length)
    // console.log(temp2.toString())
    // sql = `delete from categories where name in (${temp2.toString()})`
    // con.query(sql, function(err) {
    //   if (err) throw err
    //   console.log('Categories filtered')
    // })
  })
}
async function makePlaylists(){
  const headers = {
    Authorization: 'Bearer ' + process.env.access_token
  }        
  const vars = ["hip hop", "country", "pop", "latin", "rock", "dance", "indie","r&b","gospel","workout", "mexican traditional", "k-pop", "chill groove", 
    "sleep", "metal", "jazz", "broadway", "classical","folk","soul","anime","punk","ambient","blues","afrobeat","singer-songwriter","disco","house","drum and bass", "video game music"]
  const vars2 = ["afrobeat","singer-songwriter","disco"]
  const vars3 = ["house","drum and bass", "video game music"]
  const vars4 = ["drum and bass"]

  let images = []
  images.push({"uri": "https://t.scdn.co/images/728ed47fc1674feb95f7ac20236eb6d7.jpeg","height": 274, "width": 274})
  images.push({"uri": "https://t.scdn.co/media/derived/icon-274x274_5ce6e0f681f0a76f9dcf9270dfd18489_0_0_274_274.jpg","height": 274, "width": 274})
  images.push({"uri": "https://t.scdn.co/media/original/mood-274x274_976986a31ac8c49794cbdc7246fd5ad7_274x274.jpg","height": 274, "width": 274})
  images.push({"uri": "https://t.scdn.co/images/7ee6530d5b3c4acc9a0957046bf11d63","height": 274, "width": 274})
  images.push({"uri": "https://t.scdn.co/images/cad629fb65a14de4beddb38510e27cb1","height": 274, "width": 274})
  images.push({"uri": "https://t.scdn.co/images/c5495b9f0f694ffcb39c9217d4ed4375","height": 274, "width": 274})
  images.push({"uri": "https://t.scdn.co/images/0d39395309ba47838ef12ce987f19d16.jpeg","height": 274, "width": 274})
  images.push({"uri": "https://t.scdn.co/images/384c2b595a1648aa801837ff99961188","height": 274, "width": 274})
  try{
    for(let i = 0; i < vars.length; i++){
      var pages = 0
      var pName = 1
      let sql = `CREATE TABLE IF NOT EXISTS ${vars[i].replaceAll(' ','').replace('&','and').replace('-','')} (id INT AUTO_INCREMENT PRIMARY KEY, playlist_id VARCHAR(70), images LONGTEXT, name VARCHAR(100), public BOOL, uri varCHAR(40), tracks JSON)`
      con.query(sql, function(err) {
        if (err) throw err
        console.log('Table Created')
      })
      while (pages < 1000){
        url = `https://api.spotify.com/v1/search?q=genre:"${vars[i]}"&type=track&offset=${pages}&limit=50`
        var resp = await fetch(url, {headers})
        var data = await resp.json()
        let values = []
        let temp = {}
        let temp2 = []
        let pID = generatePassword()
        let index = Math.floor(Math.random() * 8)                
        // data.tracks.items.map(a => a ? temp2.push({name: a.name, album_name: a.album.name, artists: a.artists, images: a.album.images, uri: a.album.uri, track_number: a.track_number, duration_ms: a.duration_ms}) : null)
        data.tracks.items.map(a => a && temp2.push(a))      
        temp.items = temp2
        values.push([pID, JSON.stringify([images[index]]), `Playlist${pName}`, true, 'spotify:playlist:' + pID, JSON.stringify(temp)])           
        sql = `INSERT INTO ${vars[i].replaceAll(' ','').replace('&','and').replace('-','')} (playlist_id, images, name, public, uri, tracks) VALUES ?`
            con.query(sql, [values], function(err, result) {
                if (err) throw err;
                console.log("Number of playlists inserted: " + result.affectedRows);
            })
    
        pName += 1
        pages += 50
      }
    }                
  }
  catch(e){
    console.error(e)
  }
}

/* GET users listing. */
router.get('/', async function(req, res, next) {  
  
  let temp = {items: req.session.username}
  // console.log(temp)
  res.send(temp)     

  // removeCat()
  // makePlaylists()
});

router.post('/:playlist', async (req,res) => {    
  let name = req.body.name
  name = name.replace(/\W/g,' ')
  console.log(name)
  try{
      if(req.body.public === undefined){
         
        // sql = `select playlist_id, name from uplaylists where playlist_id="${req.body.id}" and name = "temp_playlist"`
        sql = `select playlist_id, name from ${req.session.username}playlists where playlist_id="${req.body.id}" and name = "temp_playlist"`
        con.query(sql, function(err,result){ 
          console.log(result)
          if (result.length === 1){            
            // sql = `insert into uplaylists (playlist_id, images, name, public, uri, tracks) select '${req.body.id}','${JSON.stringify(req.body.images)}', '${name}', public, 'spotify:playlist:${req.body.id}',tracks from uplaylists where name = "temp_playlist"`
            sql = `insert into ${req.session.username}playlists (playlist_id, images, name, public, uri, tracks) select '${req.body.id}','${JSON.stringify(req.body.images)}', '${name}', public, 'spotify:playlist:${req.body.id}',tracks from ${req.session.username}playlists where name = "temp_playlist"`
            con.query(sql, (err) => {
              if (err) throw err;
              console.log('New Playlist Added')
            })
          }             
        })
    }
    else{
        // sql = `INSERT INTO uplaylists (playlist_id, name, public, uri) VALUES ('${req.body.id}', '${req.body.name}', ${req.body.public}, 'spotify:playlist:${req.body.id}')`
        sql = `INSERT INTO ${req.session.username}playlists (playlist_id, name, public, uri) VALUES ('${req.body.id}', '${req.body.name}', ${req.body.public}, 'spotify:playlist:${req.body.id}')`
        con.query(sql, (err) => {
          if (err) throw err;
          console.log('New Playlist Added')
        })
      }
      res.send("204")

      }
      catch(e){
        console.log(e)
  }
                  
    
    
})

module.exports = router;
