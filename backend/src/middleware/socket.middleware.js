const jwt = require("jsonwebtoken");
const User = require("../models/user.modle");

const socketAuthMiddleware = async (socket, next) => {
  try {
    // 🍪 Read cookie from handshake headers
    const cookie = socket.handshake.headers.cookie;

    if (!cookie) {
      return next(new Error("Authentication error: No cookies found"));
    }

    // 🔑 Extract token from cookie
    const token = cookie
      .split("; ")
      .find((row) => row.startsWith("token="))
      ?.split("=")[1];

    if (!token) {
      return next(new Error("Authentication error: No token provided"));
    }

    // 🔐 Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (!decoded?.id) {
      return next(new Error("Authentication error: Invalid token"));
    }

    // 👤 Get user from DB
    const user = await User.findById(decoded.id).select("-password");

    if (!user) {
      return next(new Error("Authentication error: User not found"));
    }

    // ✅ Attach user to socket
    socket.user = user;
    socket.userId = user._id.toString();

    console.log(
      `✅ Socket authenticated: ${user.fullName} (${socket.userId})`
    );

    next();
  } catch (error) {
    console.log("❌ Socket auth error:", error.message);
    next(new Error("Authentication error"));
  }
};

module.exports = socketAuthMiddleware;
