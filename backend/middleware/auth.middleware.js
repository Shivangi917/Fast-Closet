import User from "../models/User.model.js";
import jwt from "jsonwebtoken";

export const protect = async (req, res, next) => {
  try {
    // Check cookies first (need cookie-parser)
    const tokenFromCookie = req.cookies?.token;

    // Check authorization header
    const authHeader = req.headers.authorization;
    const tokenFromHeader = authHeader?.startsWith("Bearer ") ? authHeader.split(" ")[1] : null;

    const token = tokenFromCookie || tokenFromHeader;

    if (!token) return res.status(401).json({ message: "Not authorized, no token" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id).select("-password");

    next();
  } catch (err) {
    console.error(err);
    res.status(401).json({ message: "Not authorized" });
  }
};
