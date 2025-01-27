var express = require('express');
var router = express.Router();
const { con } = require('../sql.js')

/* GET users listing. */
router.get('/', function(req, res, next) {  
  
  let temp = {items: process.env.username}
  // console.log(temp)
  res.send(temp)
 
});

router.post('/:playlist', async (req,res) => {    
  let name = req.body.name
  name = name.replace(/\W/g,' ')
  console.log(name)
  try{
      if(req.body.public === undefined){
         
        sql = `select playlist_id, name from uplaylists where playlist_id="${req.body.id}" and name = "temp_playlist"`
        con.query(sql, function(err,result){ 
          console.log(result)
          if (result.length === 1){            
            sql = `insert into uplaylists (playlist_id, images, name, public, uri, tracks) select '${req.body.id}','${JSON.stringify(req.body.images)}', '${name}', public, 'spotify:playlist:${req.body.id}',tracks from uplaylists where name = "temp_playlist"`
            con.query(sql, (err) => {
              if (err) throw err;
              console.log('New Playlist Added')
            })
          }             
        })
    }
    else{
        sql = `INSERT INTO uplaylists (playlist_id, name, public, uri) VALUES ('${req.body.id}', '${req.body.name}', ${req.body.public}, 'spotify:playlist:${req.body.id}')`
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
