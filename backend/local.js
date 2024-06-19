var jsmediatags = require("jsmediatags");
const testFolder = 'ori/'
let fs = require('fs')
let files = fs.readdirSync(testFolder)
console.log(files)
let arr = []
// fs.readdir(testFolder, (err, files) => {
//   files.forEach(file => {
//     console.log(file);
//   });
// });
for (let i = 0; i < files.length; i++){
  jsmediatags.read(testFolder + files[i], {
    onSuccess: function(tag) {
      console.log(tag.tags.title);
    },
    onError: function(error) {
      console.log(':(', error.type, error.info);
    }
  });
}

// jsmediatags.read('34-LumaPools.mp3', {
//   onSuccess: function(tag) {
//     console.log(tag.tags.title);
//   },
//   onError: function(error) {
//     console.log(':(', error.type, error.info);
//   }
// });
module.exports = {jsmediatags}

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