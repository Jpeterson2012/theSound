const mysql = require('mysql2/promise');

const refreshLocks = new Map();

const con = mysql.createPool({
  host: process.env.HOST,
  user: process.env.DBUSER,
  password: process.env.PASSWORD,
  database: process.env.DB,
  waitForConnections: true,
  connectionLimit: 10
});

const refreshToken = async (token, userId) => {
  try {
    const url = 'https://accounts.spotify.com/api/token';

    const headers = {
      'content-type': 'application/x-www-form-urlencoded',
      'Authorization': 'Basic ' + Buffer.from(process.env.CLIENT_ID + ':' + process.env.CLIENT_SECRET).toString('base64'),
    };

    const body = {
      grant_type: 'refresh_token',
      refresh_token: token,
    };

    const resp = await fetch(url, {
      method: 'POST',
      headers: headers,
      body: new URLSearchParams(body)                        
    });

    const data = await resp.json();

    if (!data.access_token) {
      throw new Error("Spotify refresh failed");
    }

    const expiresAt = new Date(Date.now() + (data.expires_in * 1000 * 0.9));

    await con.query(
      `UPDATE users SET access_token = ?, expires_at = ? WHERE id = ?`,
      [data.access_token, expiresAt, userId]
    );

    return data.access_token;
  } catch (e) {
    db.logError(e);

    throw e;
  }  
};

const db = {
  query: (...args) => con.query(...args),

  getConnection: async () => con.getConnection(),

  getAccessToken: async (userId) => {
    const sql = `SELECT access_token, refresh_token, expires_at FROM users where id = ?`;

    const [row] = await con.query(sql, [userId]);

    if (!row.length) {
      throw new Error("User not found");
    }

    const user = row[0];

    const now = new Date();

    if (user?.expires_at && new Date(user?.expires_at) > now) {
      return user.access_token;
    }

    if (!refreshLocks.has(userId)) {
      const refreshPromise = refreshToken(user.refresh_token, userId)
        .finally(() => {
          refreshLocks.delete(userId);
        });

      refreshLocks.set(userId, refreshPromise);
    }

    return refreshLocks.get(userId);
  },
  
  getLogin: async (userId) => {
    const sql = `SELECT * FROM users where id = ?`;

    const [row] = await con.query(sql, [userId]);

    if (!row.length) {
      throw new Error("User not found");
    }

    return {access_token: row[0]["access_token"], refresh_token: row[0]["refresh_token"], expires_in: row[0]["expires_at"]};
  },

  logError: async (err, req) => {
    try {
      await con.query(
        `INSERT INTO errors (status, message, stack, route, method, user_id)
        VALUES (?, ?, ?, ?, ?, ?)`,
        [
          err.status ?? err.statusCode ?? 500,        
          String(err.message ?? err ?? "Unknown error"),
          err.stack ?? null,
          req?.originalUrl ?? req?.url ?? null,
          req?.method ?? null,
          req?.user?.id ?? null,
        ]
      );
    } catch (e) {    
      console.error("Failed to log error:", e);
    }
  },
};

module.exports = db;