var express = require('express');
var router = express.Router();
const { con } = require('../sql.js')

router.post('/', async (req, res) => {
    
    try{
      console.log(req.body.name)
        var sql = `INSERT INTO likedsongs (album_id, images, artists, duration, track_id, name) VALUES ('${req.body.album_id}','${JSON.stringify(req.body.images)}','${JSON.stringify(req.body.artists)}','${req.body.duration_ms}','${req.body.uri}',"${req.body.name}")`
      con.query(sql, (err) => {
        if (err) throw err;
        console.log('Song added!')
      })
    }
    catch(e){
      console.log(e)
    }
})
router.post('/:id', async (req, res) => {
  try{
    console.log(req.params.id)
    // sql = `SELECT tracks FROM uplaylists WHERE playlist_id = '${req.params.id}'`
    // con.query(sql, (err,result) => {
    //   if (err) throw err;
    //   let temp = JSON.parse(result[0].tracks)
    //   console.log(temp.items[0]?.name)
    // })
  }
  catch(e){
    console.log(e)
  }
})

router.delete('/', async (req, res) => {

    try{
        sql = `DELETE FROM likedsongs WHERE name = "${req.body.name}"`
      con.query(sql, (err) => {
        if (err) throw err;
        console.log('Song deleted!')
      })
    }
    catch(e){
      console.log(e)
    }

})

module.exports = router;