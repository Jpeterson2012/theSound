var express = require('express');
var router = express.Router();
const { con } = require('../sql.js')

router.get('/', async (req, res) => {
  sql = 'CREATE TABLE IF NOT EXISTS local (id INT AUTO_INCREMENT PRIMARY KEY, title VARCHAR(50), artist VARCHAR(60), album VARCHAR(100), track_number VARCHAR(10), image MEDIUMTEXT, uri VARCHAR(50))'
  con.query(sql, function(err) {
    if (err) throw err;
  })

  sql = 'select exists (select 1 from local) AS Output'
  con.query(sql, function(err, result) {
      if (err) throw err;
      var empty = result[0].Output
      //If table already has data read relevent data and send to front end
      if (empty == 1) {
        sql = 'SELECT title, artist, album, track_number, image, uri from local'
        con.query(sql, function (err, result) {
          if (err) throw err;
          var records = {}
          var items = []
          for (let i = 0; i < result.length; i++) {
            let temp = {}
            temp.title = result[i].title
            temp.artist = result[i].artist
            temp.album = result[i].album
            temp.track_number = result[i].track_number
            result[i].picture === undefined ? temp.image = 'null' : temp.image = JSON.parse(result[i].picture)
            temp.uri = result[i].uri
            items.push(temp)  
          }
          records.items = items
          res.send(records)
        })
      }
      else{


        var jsmediatags = require("jsmediatags");
        // const testFolder = 'ori/'
        const testFolder = '../../../../../../mnt/c/Users/fuelr/Music/ori/'
        let fs = require('fs')
        let files = fs.readdirSync(testFolder)
        console.log(files)
        
        const get_song = async (song_path) => new Promise((resolve, reject) => {
          jsmediatags.read(testFolder + song_path, {
              onSuccess: resolve,
              onError: reject
          });
        });
        let b = 0
        
        // async function run() {
        //   files.map(async (a,i) =>  {
        //     await get_song(a).then(tag => { return {id: b, title: tag?.tags?.title, artist: tag?.tags?.artist, album: tag?.tags?.album, track_number: tag?.tags?.track}}).then(data => (console.log(data), b++))
        //     // arr.push({title: tag?.tags?.title, artist: tag?.tags?.artist, album: tag?.tags?.album, track_number: tag?.tags?.track}),console.log(arr[i])
            
        //   })
        // }
        // await run()

        let apiRequestLoop = function(){
          let promiseArray = []
          files.map(a => promiseArray.push(get_song(a).then(tag => { return {id: b++, title: tag?.tags?.title, artist: tag?.tags?.artist, album: tag?.tags?.album, track_number: tag?.tags?.track, image: tag?.tags?.picture, uri: a}}))
          )
          return Promise.all(promiseArray);
          }
        // 
        apiRequestLoop().then(a => a.map((b,i,arr) => {
          var values = []
          values.push([b.title, b.artist, b.album, b.track_number, JSON.stringify(b.picture), b.uri])
          var sql = "INSERT INTO local (title, artist, album, track_number, image, uri) VALUES ?"
          con.query(sql, [values], function(err, result) {
              if (err) throw err;
              console.log("Number of tracks inserted: " + result.affectedRows);
          })
          arr.length - 1 === i ? (
            sql = 'SELECT title, artist, album, track_number, image, uri from local',
            con.query(sql, function (err, result) {
              if (err) throw err;
              var records = {}
              var items = []
              for (let i = 0; i < result.length; i++) {
                let temp = {}
                temp.title = result[i].title
                temp.artist = result[i].artist
                temp.album = result[i].album
                temp.track_number = result[i].track_number
                result[i].picture === undefined ? temp.image = 'null' : temp.image = JSON.parse(result[i].picture)
                temp.uri = result[i].uri
                items.push(temp)  
              }
              records.items = items
              res.send(records)
            })
              ) : null
        }))
        
        // let temp2 ={}
        // let temp3 = []
        // apiRequestLoop().then(a => a.map((b,i,arr) => {
        //   temp3.push(b)
        //   arr.length - 1 === i ? (
        //     temp2.items = temp3,
        //     res.send(temp2)
        //   ) : null
        //   // console.log(b)
        // }))
      }
  })

  // for (let i = 0; i < files.length; i++){
  //   jsmediatags.read(testFolder + files[i], {
  //     onSuccess: function(tag) {
        
  //       // console.log(tag.tags.title);
  //       arr.push({title: tag.tags.title, artist: tag.tags.artist, album: tag.tags.album, track_number: tag.tags.track})
  //       console.log(arr[i])
  //     },
  //     onError: function(error) {
  //       console.log(':(', error.type, error.info);
  //     }
  //   });
  // }
    // console.log(arr[0])
    // info.items = arr
    // res.send(info)
})

module.exports = router;





// var jsmediatags = require("jsmediatags");
// const testFolder = 'ori/'
// let fs = require('fs')
// let files = fs.readdirSync(testFolder)
// console.log(files)
// let arr = []
// fs.readdir(testFolder, (err, files) => {
//   files.forEach(file => {
//     console.log(file);
//   });
// });
// for (let i = 0; i < files.length; i++){
//   jsmediatags.read(testFolder + files[i], {
//     onSuccess: function(tag) {
//       console.log(tag.tags.title);
//     },
//     onError: function(error) {
//       console.log(':(', error.type, error.info);
//     }
//   });
// }

// jsmediatags.read('34-LumaPools.mp3', {
//   onSuccess: function(tag) {
//     console.log(tag.tags.title);
//   },
//   onError: function(error) {
//     console.log(':(', error.type, error.info);
//   }
// });
// module.exports = {jsmediatags}

// var jsmediatags = require("jsmediatags");

// new jsmediatags.Reader(content)
//       .setTagsToRead(["title", "artist","picture","lyrics"]).read({
//        onSuccess: function(tag) {

// var tags = tag.tags;

// var base64String = "";

// for (var i = 0; i < tags.picture.data.length; i++) {
//   base64String += String.fromCharCode(tags.picture.data[i]);
// }
// var dataUrl = "data:" + tags.picture.format + ";base64," +window.btoa(base64String);

// document.getElementById('cover').setAttribute('src',dataUrl);
//   },
//   onError: function(error) {
//     console.log(':(', error.type, error.info);
//   }
// });