var express = require('express');
var router = express.Router();
const { con } = require('../sql.js')

router.post('/album', async (req, res) => {
  try{
    // console.log(req.body)
    // var sql = `INSERT INTO ualbums (album_type, total_tracks, album_id, images, name, release_date, uri, artists, tracks, copyrights, label_name) VALUES ('${req.body.album_type}','${req.body.total_tracks}','${req.body.album_id}','${JSON.stringify(req.body.images)}',"${req.body.name}",'${req.body.release_date}','${req.body.uri}',${con.escape(JSON.stringify(req.body.artists))}, ${con.escape(JSON.stringify(req.body.tracks))}, ${con.escape(JSON.stringify(req.body.copyrights))},${con.escape(req.body.label_name)})`
    var sql = `INSERT INTO ${process.env.username}albums (album_type, total_tracks, album_id, images, name, release_date, uri, artists, tracks, copyrights, label_name) VALUES ('${req.body.album_type}','${req.body.total_tracks}','${req.body.album_id}','${JSON.stringify(req.body.images)}',"${req.body.name}",'${req.body.release_date}','${req.body.uri}',${con.escape(JSON.stringify(req.body.artists))}, ${con.escape(JSON.stringify(req.body.tracks))}, ${con.escape(JSON.stringify(req.body.copyrights))},${con.escape(req.body.label_name)})`
    con.query(sql, (err) => {
      if (err) throw err
      console.log('Album added!')
    })
    res.send("201")
  }
  catch(e){
    console.error(e)
  }
})

router.delete('/album', async (req, res) => {
  try{
    // console.log(req.body)
    // sql = `DELETE FROM ualbums WHERE album_id = "${req.body.aID}"`
    sql = `DELETE FROM ${process.env.username}albums WHERE album_id = "${req.body.aID}"`
    con.query(sql, (err) => {
      if (err) throw err;
      console.log('Album deleted!')
    })
    res.send("204")
}
catch(e){
  console.log(e)
}
})

router.post('/liked', async (req, res) => {
    
    try{
      // console.log(req.body)
      // console.log(req.body.name)
        // var sql = `INSERT INTO likedsongs (album_id, images, artists, duration, track_id, name) VALUES ('${req.body.album_id}','${JSON.stringify(req.body.images)}',${con.escape(JSON.stringify(req.body.artists))},'${req.body.duration_ms}','${req.body.uri}',"${req.body.name}")`
        var sql = `INSERT INTO ${process.env.username}liked (album_id, images, artists, duration, track_id, name) VALUES ('${req.body.album_id}','${JSON.stringify(req.body.images)}',${con.escape(JSON.stringify(req.body.artists))},'${req.body.duration_ms}','${req.body.uri}',"${req.body.name}")`
      con.query(sql, (err) => {
        if (err) throw err;
        console.log('Song added!')
      })
    res.send("201")
    }
    catch(e){
      console.log(e)
    }
})

router.delete('/liked', async (req, res) => {

  try{
      // sql = `DELETE FROM likedsongs WHERE name = "${req.body.name}"`
      sql = `DELETE FROM ${process.env.username}liked WHERE name = "${req.body.name}"`
    con.query(sql, (err) => {
      if (err) throw err;
      console.log('Song deleted!')
    })
    res.send("204")
  }
  catch(e){
    console.log(e)
  }

})

router.post('/playlist/:id', async (req, res) => {
  try{
    // console.log(req.params.id)
    // console.log(req.body)
    // sql = `SELECT tracks FROM uplaylists WHERE playlist_id = '${req.params.id}'`
    sql = `SELECT tracks FROM ${process.env.username}playlists WHERE playlist_id = '${req.params.id}'`
    con.query(sql, (err,result) => {
      if (err) throw err;
    
      let temp = JSON.parse(result[0].tracks)
      if (temp === null){
        temp = {}
        temp.items = []
      }
      let temp2 = req.body
      temp2.album = {}
      temp2.album.images = temp2.images        
      delete temp2.images
      
      temp.items.push(temp2)      
      // console.log(temp.items)
      // sql = `UPDATE uplaylists SET tracks = ${con.escape(JSON.stringify(temp))} WHERE playlist_id = '${req.params.id}'`
      sql = `UPDATE ${process.env.username}playlists SET tracks = ${con.escape(JSON.stringify(temp))} WHERE playlist_id = '${req.params.id}'`
      con.query(sql, (err,result) => {
        if (err) throw err;
        console.log("Track added!")
      })
    })
    res.send("201")
  }
  catch(e){
    console.log(e)
  }
})

router.delete('/playlist/:id', async (req, res) => {

  try{
    // console.log(req.params.id)
    // console.log(req.body.name)
    // sql = `SELECT tracks FROM uplaylists WHERE playlist_id = '${req.params.id}'`
    sql = `SELECT tracks FROM ${process.env.username}playlists WHERE playlist_id = '${req.params.id}'`
    con.query(sql, (err,result) => {
      if (err) throw err;
      let temp = JSON.parse(result[0].tracks)
      temp.items = temp.items.filter(a => a.name !== req.body.name)
      sql = `UPDATE uplaylists SET tracks = ${con.escape(JSON.stringify(temp))} WHERE playlist_id = '${req.params.id}' `
      con.query(sql, (err,result) => {
        if (err) throw err;
        console.log("Track removed!")
      })
    })
    res.send("204")
  }
  catch(e){
    console.log(e)
  }

})

router.delete('/playlist', async(req,res) => {
  try{
    // console.log(req.body)
    // sql = `DELETE FROM uplaylists WHERE playlist_id = "${req.body.pID}" and not name="temp_playlist"`
    sql = `DELETE FROM ${process.env.username}playlists WHERE playlist_id = "${req.body.pID}" and not name="temp_playlist"`
    con.query(sql, (err) => {
      if (err) throw err;
      console.log('Playlist deleted!')
    })
    res.send("204")
}
catch(e){
  console.log(e)
}
})

module.exports = router;

