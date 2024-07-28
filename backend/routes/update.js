var express = require('express');
var router = express.Router();
const { con } = require('../sql.js')

router.post('/', async (req, res) => {
    
    try{
        var sql = `INSERT INTO likedsongs (album_id, images, artists, duration, track_id, name) VALUES ('${req.body.album_id}','${req.body.images}','${req.body.artists}','${req.body.duration}','${req.body.track_id}','${req.body.name}')`
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
    sql = `SELECT tracks FROM uplaylists WHERE playlist_id = '${req.params.id}'`
    con.query(sql, (err,result) => {
      if (err) throw err;
      let temp = JSON.parse(result[0].tracks)
      console.log(temp.items[0]?.name)
    })
  }
  catch(e){
    console.log(e)
  }
})

router.delete('/', async (req, res) => {

    try{
        sql = `DELETE FROM likedsongs WHERE track_id = '${req.body.track_id}'`
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