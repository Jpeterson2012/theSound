const { verifyToken } = require('../jwt.js');
const con = require('../database/dbpool.js');

module.exports = async (req, res, next) => {
  const token = req.cookies.jwt;

  if (!token) {
    return res.status(401).json({ error: "No token" });
  }

  const user = verifyToken(token);

  if (!user) {
    return res.status(401).json({ error: "Invalid token" });
  }

  req.user = user;

  req.token = await con.getAccessToken(user.id);

  next();
};