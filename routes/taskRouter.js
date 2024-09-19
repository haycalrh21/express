import express from "express";
import {
  createTask,
  deleteTask,
  getTask,
  getTasks,
  updateTask,
} from "../controllers/taskController.js";
import { protectMiddleware } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/create-task", protectMiddleware, createTask);
router.get("/tasks", protectMiddleware, getTasks);
router.get("/task/:id", protectMiddleware, getTask);
router.patch("/edit/:id", protectMiddleware, updateTask); // Pastikan rute ini ada
router.delete("/task/:id", protectMiddleware, deleteTask);

export default router;
