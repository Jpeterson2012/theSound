const jwt = require("jsonwebtoken");
const {Server} = require("socket.io");

function getCookieValue(cookieHeader, name) {
  return cookieHeader
    .split(";")
    .map(c => c.trim())
    .find(c => c.startsWith(name + "="))
    ?.split("=")
    .slice(1)
    .join("=");
}

function initSocket(server, app) {
  const io = new Server(server, {
    cors: {
      origin: process.env.FRONTEND_URL,
      credentials: true,
    },
  });

  io.use((socket, next) => {
    const cookie = socket.handshake.headers.cookie ?? "";

    const token = getCookieValue(cookie, "jwt");

    if (!token) return next(new Error("AUTH_FAILED"));

    const user = jwt.verify(token, process.env.JWT_SECRET);

    socket.user = user;

    next();
  });

  io.on("connection", (socket) => {
    if (socket.user?.id) {
      socket.join(String(socket.user.id));
    }
  });

  io.engine.on("connection_error", (err) => {
    console.log("Socket connection error:", err.message);
  });

  app.set("io", io);

  return io;
}

module.exports = {initSocket};