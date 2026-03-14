// models/Task.js - Handles data and business logic (Model layer)
const db = require("../config/database");

class Task {
  /**
   * Calculate priority based on days remaining until deadline.
   * Mirrors the original PHP calculatePriority() logic.
   */
  static calculatePriority(deadline) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const deadlineDate = new Date(deadline);
    deadlineDate.setHours(0, 0, 0, 0);
    const daysLeft = Math.ceil((deadlineDate - today) / (1000 * 60 * 60 * 24));

    if (daysLeft <= 1) return "High";
    if (daysLeft <= 3) return "Medium";
    return "Low";
  }

  /**
   * Retrieve all tasks ordered by deadline ascending.
   */
  static getAll() {
    return db
      .prepare(
        `SELECT id, title, description, deadline, priority, completed, created_at
         FROM tasks
         ORDER BY completed ASC, deadline ASC`
      )
      .all();
  }

  /**
   * Retrieve a single task by id.
   */
  static getById(id) {
    return db
      .prepare(`SELECT * FROM tasks WHERE id = ?`)
      .get(id);
  }

  /**
   * Create a new task, auto-calculating priority.
   */
  static create({ title, description = "", deadline }) {
    const priority = Task.calculatePriority(deadline);
    const result = db
      .prepare(
        `INSERT INTO tasks (title, description, deadline, priority)
         VALUES (?, ?, ?, ?)`
      )
      .run(title, description, deadline, priority);
    return Task.getById(result.lastInsertRowid);
  }

  /**
   * Update a task. Re-calculates priority if deadline changes.
   */
  static update(id, { title, description, deadline, completed }) {
    const existing = Task.getById(id);
    if (!existing) return null;

    const newDeadline = deadline ?? existing.deadline;
    const newTitle = title ?? existing.title;
    const newDesc = description ?? existing.description;
    const newCompleted = completed !== undefined ? (completed ? 1 : 0) : existing.completed;
    const newPriority = deadline ? Task.calculatePriority(newDeadline) : existing.priority;

    db.prepare(
      `UPDATE tasks
       SET title = ?, description = ?, deadline = ?, priority = ?, completed = ?
       WHERE id = ?`
    ).run(newTitle, newDesc, newDeadline, newPriority, newCompleted, id);

    return Task.getById(id);
  }

  /**
   * Delete a task by id.
   */
  static delete(id) {
    const result = db.prepare(`DELETE FROM tasks WHERE id = ?`).run(id);
    return result.changes > 0;
  }

  /**
   * Get summary statistics.
   */
  static getStats() {
    return db.prepare(`
      SELECT
        COUNT(*) AS total,
        SUM(CASE WHEN completed = 0 THEN 1 ELSE 0 END) AS pending,
        SUM(CASE WHEN completed = 1 THEN 1 ELSE 0 END) AS completed,
        SUM(CASE WHEN priority = 'High'   AND completed = 0 THEN 1 ELSE 0 END) AS high,
        SUM(CASE WHEN priority = 'Medium' AND completed = 0 THEN 1 ELSE 0 END) AS medium,
        SUM(CASE WHEN priority = 'Low'    AND completed = 0 THEN 1 ELSE 0 END) AS low
      FROM tasks
    `).get();
  }
}

module.exports = Task;
