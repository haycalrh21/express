import jwt from "jsonwebtoken";
import User from "../models/userModel.js";
import asyncHandler from "../middlewares/asyncHandler.js";

export const protectMiddleware = asyncHandler(async (req, res, next) => {
  let token;

  // Use req.cookies to extract the token
  token = req.cookies.jwt;
  if (token) {
    try {
      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(decoded.id).select("-password");
      next();
    } catch (error) {
      res.status(401).json({ message: "Not authorized, token failed" });
    }
  } else {
    res.status(401).json({ message: "Not authorized, no token" });
  }
});

export const adminMiddleware = asyncHandler(async (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    next();
  } else {
    res.status(401);
    throw new Error("Not authorized as an admin");
  }
});
