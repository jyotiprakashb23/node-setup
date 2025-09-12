import jwt from "jsonwebtoken";
import client from "../config/redis.js";

export const verifyAdmin = async (req, res, next) => {
  try {

    // 1. Get token
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res.status(401).json({ success: false, message: "Token Unavailable." });
    }    
    // 2. Verify token signature
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "yourSecretKey");

    // Check role
    if (decoded.role !== "admin") {
      return res.status(403).json({ success: false, message: "Access denied. Admins only." });
    }

    // 3. Check Redis session
    const session = await client.get(`admin:${decoded.id}:session`);
    if (!session) {
      return res.status(401).json({ success: false, message: "Session expired. Please log in again." });
    }
    // console.log("Session from Redis: ", session);
    
    const parsedSession = JSON.parse(session);
    
    if (parsedSession.accessToken !== token) {
      return res.status(401).json({ success: false, message: "Invalid session token." });
    }
    
    // ✅ Attach user info to request (so controllers can use it)
    req.admin = parsedSession; 

    next(); // pass control to the controller
  } catch (error) {
    res.status(401).json({ success: false, message: "Unauthorized", error: error.message });
  }
};
