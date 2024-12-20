const { con } = require('../sql.js')
var express = require('express');
var router = express.Router();


// con.connect(function(err) {
//   if (err) throw err;
//   console.log("Connected!");
//   var sql = "CREATE TABLE users (id INT AUTO_INCREMENT PRIMARY KEY, name VARCHAR(20), sID VARCHAR(20))";
//   con.query(sql, function(err, result) {
//     if (err) throw err;
//     console.log("Table Created")
//   })
// })

/* GET users listing. */
router.get('/', function(req, res, next) {  
  const url = 'https://api.spotify.com/v1/me'
  const headers = {
    Authorization: 'Bearer ' + process.env.access_token
  }

  fetch(url, { headers })
      .then(response => response.json())
      .then(data => {
        var temp = data.display_name
        // temp = temp.replace(/_|-/g, "")
        console.log(process.env.access_token)
        console.log(temp)
        //Checks if user is already in db. Adds if not
      var sql = `CREATE DATABASE IF NOT EXISTS ${temp}`
      con.query(sql, (err) => {
        if (err) throw err;
        console.log(`Database for user ${data.display_name} created!`)
      })

      sql = `USE ${temp}`
      process.env['DB'] = temp
      con.query(sql, (err) => {
        if (err) throw err;
        // console.log('Database selected!')
      })

      sql = "CREATE TABLE IF NOT EXISTS ualbums (id INT AUTO_INCREMENT PRIMARY KEY, total_tracks SMALLINT(2), album_id VARCHAR(30), images MEDIUMTEXT, name VARCHAR(75), release_date VARCHAR(10), uri VARCHAR(40), artists MEDIUMTEXT, tracks MEDIUMTEXT, label_name VARCHAR(75), popularity SMALLINT(3))"
      con.query(sql, (err) => {
        if (err) throw err;
        // console.log('User Album table created!')
      })

      sql = "CREATE TABLE IF NOT EXISTS uplaylists (id INT AUTO_INCREMENT PRIMARY KEY, playlist_id VARCHAR(70), images LONGTEXT, name VARCHAR(100), public BOOL, uri varCHAR(40), tracks MEDIUMTEXT)"
      con.query(sql, (err) => {
        if (err) throw err;
        // console.log('User Playlist table created!')
      })

      sql = "CREATE TABLE IF NOT EXISTS likedsongs (id INT AUTO_INCREMENT PRIMARY KEY, album_id VARCHAR(30), images MEDIUMTEXT, artists MEDIUMTEXT, duration VARCHAR(10), track_id VARCHAR(30), name VARCHAR(75))"
      con.query(sql, (err) => {
        if (err) throw err;
        // console.log('Liked songs table created!')
      })

      sql = 'CREATE TABLE IF NOT EXISTS categories (id INT AUTO_INCREMENT PRIMARY KEY, href VARCHAR(100), icons MEDIUMTEXT, c_id VARCHAR(30), name VARCHAR(40))'
      con.query(sql, (err) => {
        if (err) throw err;
        // console.log('Category table created!')
      })

      res.send(data)
      })
      .catch(error => {
        throw error
      });

  });
module.exports = router;
