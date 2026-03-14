// src/hooks/useTasks.js
import { useState, useEffect, useCallback } from "react";
import { tasksApi } from "../api/tasks";

export function useTasks() {
  const [tasks, setTasks] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchAll = useCallback(async () => {
    try {
      setLoading(true);
      const [taskData, statsData] = await Promise.all([
        tasksApi.getAll(),
        tasksApi.getStats(),
      ]);
      setTasks(taskData);
      setStats(statsData);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchAll(); }, [fetchAll]);

  const createTask = async (payload) => {
    const task = await tasksApi.create(payload);
    setTasks((prev) => [task, ...prev]);
    await fetchAll();
    return task;
  };

  const updateTask = async (id, payload) => {
    const task = await tasksApi.update(id, payload);
    setTasks((prev) => prev.map((t) => (t.id === id ? task : t)));
    await fetchAll();
    return task;
  };

  const deleteTask = async (id) => {
    await tasksApi.delete(id);
    setTasks((prev) => prev.filter((t) => t.id !== id));
    await fetchAll();
  };

  const toggleComplete = async (id, completed) => {
    const task = await tasksApi.toggleComplete(id, completed);
    setTasks((prev) => prev.map((t) => (t.id === id ? task : t)));
    await fetchAll();
  };

  return { tasks, stats, loading, error, createTask, updateTask, deleteTask, toggleComplete, refetch: fetchAll };
}
