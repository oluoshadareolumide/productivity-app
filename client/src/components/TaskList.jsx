// src/components/TaskList.jsx - Task list and card rendering (View layer)
import { useState } from "react";

function daysUntil(deadline) {
  const today = new Date(); today.setHours(0,0,0,0);
  const dl = new Date(deadline); dl.setHours(0,0,0,0);
  return Math.ceil((dl - today) / 86400000);
}

function DeadlineBadge({ deadline }) {
  const days = daysUntil(deadline);
  let label, cls;
  if (days < 0) { label = `${Math.abs(days)}d overdue`; cls = "overdue"; }
  else if (days === 0) { label = "Due today"; cls = "today"; }
  else if (days === 1) { label = "Due tomorrow"; cls = "soon"; }
  else { label = `${days}d left`; cls = "ok"; }
  return <span className={`deadline-badge deadline-${cls}`}>{label}</span>;
}

function TaskCard({ task, onToggle, onEdit, onDelete }) {
  const [confirming, setConfirming] = useState(false);

  const handleDelete = () => {
    if (confirming) { onDelete(task.id); }
    else { setConfirming(true); setTimeout(() => setConfirming(false), 2500); }
  };

  return (
    <div className={`task-card priority-card-${task.priority.toLowerCase()} ${task.completed ? "task-done" : ""}`}>
      <div className="task-check-col">
        <button
          className={`check-btn ${task.completed ? "checked" : ""}`}
          onClick={() => onToggle(task.id, !task.completed)}
          aria-label={task.completed ? "Mark incomplete" : "Mark complete"}
        >
          {task.completed && <span className="check-mark">✓</span>}
        </button>
      </div>

      <div className="task-content">
        <div className="task-top">
          <h3 className="task-title">{task.title}</h3>
          <span className={`priority-badge priority-badge-${task.priority.toLowerCase()}`}>{task.priority}</span>
        </div>
        {task.description && <p className="task-desc">{task.description}</p>}
        <div className="task-meta">
          <span className="task-date">📅 {new Date(task.deadline).toLocaleDateString("en-GB", { day:"numeric", month:"short", year:"numeric" })}</span>
          {!task.completed && <DeadlineBadge deadline={task.deadline} />}
          {task.completed && <span className="completed-tag">Completed</span>}
        </div>
      </div>

      <div className="task-actions">
        {!task.completed && (
          <button className="action-btn edit-btn" onClick={() => onEdit(task)} title="Edit">✎</button>
        )}
        <button
          className={`action-btn delete-btn ${confirming ? "confirming" : ""}`}
          onClick={handleDelete}
          title={confirming ? "Click again to confirm" : "Delete"}
        >
          {confirming ? "Sure?" : "✕"}
        </button>
      </div>
    </div>
  );
}

export default function TaskList({ tasks, onToggle, onEdit, onDelete }) {
  if (tasks.length === 0) {
    return (
      <div className="empty-state">
        <div className="empty-icon">◈</div>
        <h3>No tasks here</h3>
        <p>Create a new task to get started.</p>
      </div>
    );
  }

  return (
    <div className="task-list">
      {tasks.map((task) => (
        <TaskCard key={task.id} task={task} onToggle={onToggle} onEdit={onEdit} onDelete={onDelete} />
      ))}
    </div>
  );
}
