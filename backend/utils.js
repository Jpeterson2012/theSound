const con = require('./database/dbpool.js');

const asyncHandler = fn => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);

const logError = async (err, req) => {
  try {
    await con.query(
      `INSERT INTO errors (status, message, stack, route, method, user_id)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [
        err.status || err.statusCode || 500,        
        String(err.message || err || "Unknown error"),
        err.stack || null,
        req?.originalUrl || req?.url || null,
        req?.method || null,
        req?.user?.id || null,
      ]
    );
  } catch (e) {    
    console.error("Failed to log error:", e);
  }
};

module.exports = {
  asyncHandler,
  logError,
};