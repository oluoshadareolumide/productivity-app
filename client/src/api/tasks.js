// src/api/tasks.js - API communication layer (View → Controller bridge)
const BASE = "/api/tasks";

async function request(url, options = {}) {
  const res = await fetch(url, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });
  const data = await res.json();
  if (!res.ok || !data.success) throw new Error(data.error || "Request failed");
  return data.data;
}

export const tasksApi = {
  getAll: () => request(BASE),
  getStats: () => request(`${BASE}/stats`),
  create: (payload) => request(BASE, { method: "POST", body: JSON.stringify(payload) }),
  update: (id, payload) => request(`${BASE}/${id}`, { method: "PUT", body: JSON.stringify(payload) }),
  delete: (id) => request(`${BASE}/${id}`, { method: "DELETE" }),
  toggleComplete: (id, completed) => request(`${BASE}/${id}`, { method: "PUT", body: JSON.stringify({ completed }) }),
};
