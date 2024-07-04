var express = require('express');
var router = express.Router();


router.get('/', async (req, res) => {
  var jsmediatags = require("jsmediatags");
  const testFolder = 'ori/'
  let fs = require('fs')
  let files = fs.readdirSync(testFolder)
  console.log(files)
  var info = {}
  let arr = []
  // fs.readdir(testFolder, (err, files) => {
  //   files.forEach(file => {
  //     console.log(file);
  //   });
  // });
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
    files.map(a => promiseArray.push(get_song(a).then(tag => { return {id: b++, title: tag?.tags?.title, artist: tag?.tags?.artist, album: tag?.tags?.album, track_number: tag?.tags?.track}}))
    )
    return Promise.all(promiseArray);
    }
  let temp2 ={}
  let temp3 = []
  apiRequestLoop().then(a => a.map((b,i,arr) => {
    temp3.push(b)
    arr.length - 1 === i ? (
      temp2.items = temp3,
      res.send(temp2)
    ) : null
    // console.log(b)
  }))

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