const mysql = require('mysql2');

const con = mysql.createConnection({
  host: process.env.HOST,
  user: process.env.DBUSER,
  password: process.env.PASSWORD,
  database: process.env.DB,
});

con.connect((err) => {
  if (err) throw err;
  console.log("Connected!");
});

module.exports = {con};