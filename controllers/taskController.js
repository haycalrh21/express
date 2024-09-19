import asyncHandler from "../middlewares/asyncHandler.js";
import TaskModel from "../models/taskModel.js";

export const createTask = asyncHandler(async (req, res) => {
  try {
    const { title, description, dueDate, status, completed, priority } =
      req.body;

    if (!title || title.trim === "") {
      return res.status(400).json({ message: "Title cannot be empty" });
    }

    if (!description || title.description === "") {
      return res.status(400).json({ message: "Description cannot be empty" });
    }

    const existingTitle = await TaskModel.findOne({ title: title });

    if (existingTitle) {
      return res
        .status(400)
        .json({ message: "Task with the same title already exists" });
    }

    // Create new task
    const task = new TaskModel({
      title,
      description,
      dueDate,
      status,
      completed,
      priority,
      user: req.user._id, // Use user from req.user (authenticated user)
    });

    await task.save();

    res.status(200).json({ message: "Task created successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

export const getTasks = asyncHandler(async (req, res) => {
  try {
    const userId = req.user._id;
    const tasks = await TaskModel.find({ user: userId });
    res.status(200).json(tasks); // Ganti status code dari 201 ke 200
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

export const getTask = asyncHandler(async (req, res) => {
  try {
    const userId = req.user._id;
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ message: "ID not found" });
    }

    const task = await TaskModel.findById(id);
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    if (!task.user.equals(userId)) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    res.status(200).json(task);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

export const updateTask = asyncHandler(async (req, res) => {
  try {
    console.log("Update task endpoint hit");
    const userId = req.user._id;
    const { id } = req.params;
    console.log("Task ID:", id);
    const { title, description, completed, priority } = req.body;

    if (!id) {
      return res.status(400).json({ message: "ID not found" });
    }

    const task = await TaskModel.findById(id);
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    if (!task.user.equals(userId)) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    task.title = title || task.title;
    task.description = description || task.description;
    task.completed = completed || task.completed;
    task.priority = priority || task.priority;

    await task.save();
    res.status(200).json(task);
  } catch (error) {
    console.error("Error in updateTask:", error);
    res.status(500).json({ message: "Server error" });
  }
});

export const deleteTask = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;

    const task = await TaskModel.findById(id);
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    if (!task.user.equals(userId)) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    await TaskModel.findByIdAndDelete(id);
    res.status(200).json({ message: "Task deleted" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});
