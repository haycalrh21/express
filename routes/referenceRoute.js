import express from "express";
import {
  createReference,
  getReference,
} from "../controllers/referenceController.js";
import { protectMiddleware } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/create-reference", protectMiddleware, createReference);
router.get("/references", protectMiddleware, getReference);
export default router;
