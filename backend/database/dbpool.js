const mysql = require('mysql2/promise');
const {verifyToken} = require('../jwt.js')

const con = mysql.createPool({
  host: process.env.HOST,
  user: process.env.DBUSER,
  password: process.env.PASSWORD,
  database: process.env.DB,
  waitForConnections: true,
  connectionLimit: 10
});

const db = {
  query: (...args) => con.query(...args),

  getConnection: async () => con.getConnection(),

  getAccessToken: async (cookie) => {
    const {id} = verifyToken(cookie);

    const sql = `SELECT access_token FROM users where id = ${id}`;

    const [row] = await con.query(sql);

    return row[0]["access_token"];
  },
  
  getLogin: async (cookie) => {
    const {id} = verifyToken(cookie);

    const sql = `SELECT * FROM users where id = ${id}`;

    const [row] = await con.query(sql);

    return {access_token: row[0]["access_token"], refresh_token: row[0]["refresh_token"], expires_in: row[0]["expires_in"]};
  },
};

module.exports = db;