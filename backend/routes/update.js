var express = require('express');
var router = express.Router();
const { con } = require('../sql.js')

router.post('/liked', async (req, res) => {
    
    try{
      // console.log(req.body)
      // console.log(req.body.name)
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
router.post('/playlist/:id', async (req, res) => {
  try{
    // console.log(req.params.id)
    // console.log(req.body)
    sql = `SELECT tracks FROM uplaylists WHERE playlist_id = '${req.params.id}'`
    con.query(sql, (err,result) => {
      if (err) throw err;
      let temp = JSON.parse(result[0].tracks)
      let temp2 = req.body
      temp2.album = {}
      temp2.album.images = temp2.images        
      delete temp2.images
      
      temp.items.push(temp2)
      // console.log(temp.items)
      sql = `UPDATE uplaylists SET tracks = '${JSON.stringify(temp)}' WHERE playlist_id = '${req.params.id}' `
      con.query(sql, (err,result) => {
        if (err) throw err;
        console.log("Track added!")
      })
    })
  }
  catch(e){
    console.log(e)
  }
})

router.delete('/liked', async (req, res) => {

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

router.delete('/playlist/:id', async (req, res) => {

  try{
    // console.log(req.params.id)
    // console.log(req.body.name)
    sql = `SELECT tracks FROM uplaylists WHERE playlist_id = '${req.params.id}'`
    con.query(sql, (err,result) => {
      if (err) throw err;
      let temp = JSON.parse(result[0].tracks)
      temp.items = temp.items.filter(a => a.name !== req.body.name)
      sql = `UPDATE uplaylists SET tracks = '${JSON.stringify(temp)}' WHERE playlist_id = '${req.params.id}' `
      con.query(sql, (err,result) => {
        if (err) throw err;
        console.log("Track removed!")
      })
    })
  }
  catch(e){
    console.log(e)
  }

})

module.exports = router;