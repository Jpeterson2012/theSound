var express = require('express');
var router = express.Router();
const { con } = require('../sql.js')

/* GET users listing. */
router.get('/', function(req, res, next) {  
  
  let temp = {items: process.env.username}
  // console.log(temp)
  res.send(temp)
 
});

router.post('/:id', async (req,res) => {
  url = `https://api.spotify.com/v1/users/${req.params.id}/playlists`
  
    try{
        const headers = {
            Authorization: 'Bearer ' + process.env.access_token            
          }
    
        await fetch(url, {
            method: 'POST',
            headers: headers,
            body: `{"name": "${req.body.name}", "description": "${req.body.description}","public": ${req.body.public}}`            
        }).then(data => {return data.json()}).then(data => {
            console.log(data.name)
            try{
              sql = `INSERT INTO uplaylists (playlist_id, name, public, uri) VALUES ('${data.id}', '${data.name}', ${data.public}, '${data.uri}')`
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
    }
    catch (e){
        console.log(e)
    }
    
})

module.exports = router;
