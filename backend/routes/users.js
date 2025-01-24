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
    
  try{
        
      sql = `INSERT INTO uplaylists (playlist_id, name, public, uri) VALUES ('${req.body.id}', '${req.body.name}', ${req.body.public}, 'spotify:playlist:${req.body.id}')`
      con.query(sql, (err) => {
        if (err) throw err;
        console.log('New Playlist Added')
      })
      res.send("204")
      }
      catch(e){
        console.log(e)
  }
                  
    
    
})

module.exports = router;
