// src/components/TaskForm.jsx - Add/Edit Task view
import { useState } from "react";

export default function TaskForm({ initialData = null, onSubmit, onCancel }) {
  const [title, setTitle] = useState(initialData?.title || "");
  const [description, setDescription] = useState(initialData?.description || "");
  const [deadline, setDeadline] = useState(initialData?.deadline || "");
  const [submitting, setSubmitting] = useState(false);
  const [err, setErr] = useState("");

  const today = new Date().toISOString().split("T")[0];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim() || !deadline) { setErr("Title and deadline are required."); return; }
    setSubmitting(true);
    setErr("");
    try {
      await onSubmit({ title: title.trim(), description: description.trim(), deadline });
    } catch (ex) {
      setErr(ex.message);
    } finally {
      setSubmitting(false);
    }
  };

  // Preview calculated priority
  const previewPriority = () => {
    if (!deadline) return null;
    const today = new Date(); today.setHours(0,0,0,0);
    const dl = new Date(deadline); dl.setHours(0,0,0,0);
    const days = Math.ceil((dl - today) / 86400000);
    if (days <= 1) return "High";
    if (days <= 3) return "Medium";
    return "Low";
  };
  const prio = previewPriority();

  return (
    <form className="task-form" onSubmit={handleSubmit}>
      {err && <div className="form-error">{err}</div>}

      <div className="form-field">
        <label htmlFor="title">Task Title *</label>
        <input
          id="title"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="What needs to be done?"
          required
          autoFocus
        />
      </div>

      <div className="form-field">
        <label htmlFor="description">Description</label>
        <textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Optional details…"
          rows={3}
        />
      </div>

      <div className="form-field">
        <label htmlFor="deadline">Deadline *</label>
        <input
          id="deadline"
          type="date"
          value={deadline}
          min={today}
          onChange={(e) => setDeadline(e.target.value)}
          required
        />
        {prio && (
          <span className={`priority-preview priority-badge-${prio.toLowerCase()}`}>
            Auto-priority: <strong>{prio}</strong>
          </span>
        )}
      </div>

      <div className="form-actions">
        <button type="button" className="btn-cancel" onClick={onCancel}>Cancel</button>
        <button type="submit" className="btn-submit" disabled={submitting}>
          {submitting ? "Saving…" : initialData ? "Update Task" : "Create Task"}
        </button>
      </div>
    </form>
  );
}
