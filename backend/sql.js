var mysql = require('mysql')
var con = mysql.createConnection({
  host: process.env.HOST,
  user: process.env.DBUSER,
  password: process.env.PASSWORD,
  // database: process.env.DB
  //Once WebPlayback route is finished on frontend above code will work
  //DB name is defined in users.js
  database: 'zerogravity124'

});
con.connect(function(err) {
    if (err) throw err;
    console.log("Connected!");
})
module.exports = {con}