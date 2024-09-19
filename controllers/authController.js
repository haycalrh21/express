import User from "../models/userModel.js";
import jwt from "jsonwebtoken";
import asyncHandler from "../middlewares/asyncHandler.js";
import { serialize } from "cookie";

const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "6d",
  });
};

const createSendToken = (user, statusCode, res) => {
  const token = signToken(user._id);
  // Set cookie with token
  res.cookie("jwt", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production", // Atur ke false jika dalam pengembangan
    sameSite: "Strict", // Atur ke "Lax" jika Anda mengalami masalah
    maxAge: 6 * 24 * 60 * 60 * 1000, // 6 hari
    path: "/", // Set path ke root
  });

  res.status(statusCode).json({
    data: {
      name: user.name,
      email: user.email,
      role: user.role,
    },
  });
};

export const register = asyncHandler(async (req, res) => {
  const Admin = (await User.countDocuments()) === 0;
  const role = Admin ? "admin" : "user";

  const createUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    role,
  });
  createSendToken(createUser, 201, res);
});
export const login = asyncHandler(async (req, res) => {
  try {
    if (!req.body.email || !req.body.password) {
      res.status(400).json({ message: "Invalid email or password" });
      return;
    }

    const user = await User.findOne({ email: req.body.email });

    if (user && (await user.comparePassword(req.body.password))) {
      createSendToken(user, 200, res);
    } else {
      res.status(401).json({ message: "Invalid email or password" });
    }
  } catch (error) {
    console.error("Login Error:", error); // Tambahkan log untuk menangkap kesalahan
    res.status(500).json({ message: "Server error" });
  }
});

export const getUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).select("-password");
  if (user) {
    res.status(200).json({
      data: user,
    });
  } else {
    res.status(404).json({ message: "User not found" });
  }
});

export const logout = asyncHandler(async (req, res) => {
  const cookie = serialize("jwt", "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: -1,
    path: "/",
  });

  res.setHeader("Set-Cookie", cookie);
  res.status(200).json({ message: "Logged out successfully" });
});
