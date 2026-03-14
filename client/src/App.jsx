// src/App.jsx - Main application view (View layer)
import { useState } from "react";
import { useTasks } from "./hooks/useTasks";
import TaskForm from "./components/TaskForm";
import TaskList from "./components/TaskList";
import StatsBar from "./components/StatsBar";
import "./App.css";

export default function App() {
  const { tasks, stats, loading, error, createTask, updateTask, deleteTask, toggleComplete } = useTasks();
  const [showForm, setShowForm] = useState(false);
  const [editTask, setEditTask] = useState(null);
  const [filter, setFilter] = useState("all"); // all | pending | completed
  const [priorityFilter, setPriorityFilter] = useState("all");

  const handleCreate = async (data) => {
    await createTask(data);
    setShowForm(false);
  };

  const handleEdit = async (data) => {
    await updateTask(editTask.id, data);
    setEditTask(null);
  };

  const handleEditOpen = (task) => {
    setEditTask(task);
    setShowForm(false);
  };

  const filteredTasks = tasks.filter((t) => {
    const statusOk =
      filter === "all" ? true : filter === "completed" ? t.completed : !t.completed;
    const priorityOk = priorityFilter === "all" ? true : t.priority === priorityFilter;
    return statusOk && priorityOk;
  });

  return (
    <div className="app">
      <header className="app-header">
        <div className="header-inner">
          <div className="header-brand">
            <span className="brand-icon">◈</span>
            <div>
              <h1 className="brand-title">Productivity</h1>
              <p className="brand-sub">Time Management System</p>
            </div>
          </div>
          <button className="btn-add" onClick={() => { setShowForm(true); setEditTask(null); }}>
            <span>+</span> New Task
          </button>
        </div>
      </header>

      <main className="app-main">
        {stats && <StatsBar stats={stats} />}

        {error && (
          <div className="error-banner">
            <strong>Error:</strong> {error}
          </div>
        )}

        <div className="filters-row">
          <div className="filter-group">
            {["all", "pending", "completed"].map((f) => (
              <button
                key={f}
                className={`filter-btn ${filter === f ? "active" : ""}`}
                onClick={() => setFilter(f)}
              >
                {f.charAt(0).toUpperCase() + f.slice(1)}
              </button>
            ))}
          </div>
          <div className="filter-group">
            {["all", "High", "Medium", "Low"].map((p) => (
              <button
                key={p}
                className={`filter-btn priority-filter priority-${p.toLowerCase()} ${priorityFilter === p ? "active" : ""}`}
                onClick={() => setPriorityFilter(p)}
              >
                {p === "all" ? "All Priorities" : p}
              </button>
            ))}
          </div>
        </div>

        {(showForm || editTask) && (
          <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && (setShowForm(false), setEditTask(null))}>
            <div className="modal">
              <div className="modal-header">
                <h2>{editTask ? "Edit Task" : "New Task"}</h2>
                <button className="modal-close" onClick={() => { setShowForm(false); setEditTask(null); }}>✕</button>
              </div>
              <TaskForm
                initialData={editTask}
                onSubmit={editTask ? handleEdit : handleCreate}
                onCancel={() => { setShowForm(false); setEditTask(null); }}
              />
            </div>
          </div>
        )}

        {loading ? (
          <div className="loading">
            <div className="loading-spinner" />
            <p>Loading tasks…</p>
          </div>
        ) : (
          <TaskList
            tasks={filteredTasks}
            onToggle={toggleComplete}
            onEdit={handleEditOpen}
            onDelete={deleteTask}
          />
        )}
      </main>

      <footer className="app-footer">
        <p>Productivity App · MVC Architecture · Built with Node.js + React</p>
      </footer>
    </div>
  );
}
