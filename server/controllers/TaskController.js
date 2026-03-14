// controllers/TaskController.js - Processes requests (Controller layer)
const Task = require("../models/Task");

class TaskController {
  /** GET /api/tasks - List all tasks */
  static index(req, res) {
    try {
      const tasks = Task.getAll();
      res.json({ success: true, data: tasks });
    } catch (err) {
      res.status(500).json({ success: false, error: err.message });
    }
  }

  /** GET /api/tasks/stats - Summary statistics */
  static stats(req, res) {
    try {
      const stats = Task.getStats();
      res.json({ success: true, data: stats });
    } catch (err) {
      res.status(500).json({ success: false, error: err.message });
    }
  }

  /** GET /api/tasks/:id - Get a single task */
  static show(req, res) {
    try {
      const task = Task.getById(Number(req.params.id));
      if (!task) return res.status(404).json({ success: false, error: "Task not found" });
      res.json({ success: true, data: task });
    } catch (err) {
      res.status(500).json({ success: false, error: err.message });
    }
  }

  /** POST /api/tasks - Create a new task */
  static store(req, res) {
    try {
      const { title, description, deadline } = req.body;
      if (!title || !deadline) {
        return res.status(400).json({ success: false, error: "Title and deadline are required." });
      }
      const task = Task.create({ title, description, deadline });
      res.status(201).json({ success: true, data: task });
    } catch (err) {
      res.status(500).json({ success: false, error: err.message });
    }
  }

  /** PUT /api/tasks/:id - Update a task */
  static update(req, res) {
    try {
      const task = Task.update(Number(req.params.id), req.body);
      if (!task) return res.status(404).json({ success: false, error: "Task not found" });
      res.json({ success: true, data: task });
    } catch (err) {
      res.status(500).json({ success: false, error: err.message });
    }
  }

  /** DELETE /api/tasks/:id - Delete a task */
  static destroy(req, res) {
    try {
      const deleted = Task.delete(Number(req.params.id));
      if (!deleted) return res.status(404).json({ success: false, error: "Task not found" });
      res.json({ success: true, message: "Task deleted." });
    } catch (err) {
      res.status(500).json({ success: false, error: err.message });
    }
  }
}

module.exports = TaskController;
