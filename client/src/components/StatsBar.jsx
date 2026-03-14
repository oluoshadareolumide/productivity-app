// src/components/StatsBar.jsx
export default function StatsBar({ stats }) {
  const completion = stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0;

  return (
    <div className="stats-bar">
      <div className="stat-card">
        <span className="stat-value">{stats.total}</span>
        <span className="stat-label">Total</span>
      </div>
      <div className="stat-card">
        <span className="stat-value stat-pending">{stats.pending}</span>
        <span className="stat-label">Pending</span>
      </div>
      <div className="stat-card">
        <span className="stat-value stat-done">{stats.completed}</span>
        <span className="stat-label">Done</span>
      </div>
      <div className="stat-card stat-priority">
        <div className="priority-dots">
          <span className="dot high">{stats.high}</span>
          <span className="dot medium">{stats.medium}</span>
          <span className="dot low">{stats.low}</span>
        </div>
        <span className="stat-label">H · M · L</span>
      </div>
      <div className="stat-card stat-progress">
        <div className="progress-ring-wrap">
          <svg viewBox="0 0 40 40" className="progress-ring">
            <circle cx="20" cy="20" r="16" fill="none" strokeWidth="4" className="ring-bg" />
            <circle
              cx="20" cy="20" r="16" fill="none" strokeWidth="4"
              className="ring-fill"
              strokeDasharray={`${completion} ${100 - completion}`}
              strokeDashoffset="25"
              pathLength="100"
            />
          </svg>
          <span className="progress-pct">{completion}%</span>
        </div>
        <span className="stat-label">Complete</span>
      </div>
    </div>
  );
}
