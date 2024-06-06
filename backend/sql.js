var mysql = require('mysql')
var con = mysql.createConnection({
  host: process.env.HOST,
  user: process.env.DBUSER,
  password: process.env.PASSWORD
//   database: process.env.DB

});
con.connect(function(err) {
    if (err) throw err;
    console.log("Connected!");
})
module.exports = {con}