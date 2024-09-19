import express from "express";
import {
  register,
  login,
  getUser,
  logout,
} from "../controllers/authController.js";
import { protectMiddleware } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/getuser", protectMiddleware, getUser);
router.get("/logout", logout);

export default router;
