# Productivity & Time Management App

A full-stack MVC application for task management with automatic priority calculation. Built with **Node.js + Express** (server) and **React + Vite** (client), using **SQLite** for zero-config persistence.

---

## Architecture (MVC)

```
User → React (View) → Express API (Controller) → SQLite via Task model (Model)
```

| Layer | Technology | Location |
|---|---|---|
| Model | `better-sqlite3` + Task class | `server/models/Task.js` |
| Controller | Express route handlers | `server/controllers/TaskController.js` |
| View | React + Vite SPA | `client/src/` |
| Routing | Express REST + React hooks | `server/routes/tasks.js` |

---

## Features

- ✅ Create, edit, delete tasks
- ✅ Automatic priority calculation (High / Medium / Low) based on deadline
- ✅ Mark tasks complete / incomplete
- ✅ Filter by status and priority
- ✅ Live stats dashboard (total, pending, done, priority breakdown, % complete)
- ✅ Deadline countdown badges (overdue, today, tomorrow, days left)
- ✅ Full REST API
- ✅ Docker-ready for deployment

### Priority Rules (from original spec)

| Days until deadline | Priority |
|---|---|
| ≤ 1 day | **High** |
| ≤ 3 days | **Medium** |
| > 3 days | **Low** |

---

## Quick Start

### Option A — Local Development

**Prerequisites:** Node.js 18+

```bash
# 1. Install all dependencies
npm run install:all

# 2. Start dev servers (API on :3001, client on :5173 with proxy)
npm run dev
```

Open **http://localhost:5173**

### Option B — Production Build (single server)

```bash
npm run install:all
npm run build          # builds React into client/dist/
npm start              # serves API + static files on :3001
```

Open **http://localhost:3001**

### Option C — Docker

```bash
docker compose up --build
```

Open **http://localhost:3001**

Data is persisted in a named Docker volume (`app_data`).

---

## Environment Variables

Copy `.env.example` to `.env` and adjust as needed:

```env
PORT=3001
NODE_ENV=production
DB_PATH=./data/productivity.db
CLIENT_URL=http://localhost:5173   # dev only
```

---

## REST API Reference

Base URL: `/api/tasks`

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/tasks` | List all tasks |
| `GET` | `/api/tasks/stats` | Summary statistics |
| `GET` | `/api/tasks/:id` | Get single task |
| `POST` | `/api/tasks` | Create task |
| `PUT` | `/api/tasks/:id` | Update task |
| `DELETE` | `/api/tasks/:id` | Delete task |

**POST / PUT body:**
```json
{
  "title": "Write report",
  "description": "Optional details",
  "deadline": "2025-03-20",
  "completed": false
}
```

Priority is **always auto-calculated** from the deadline — you don't need to send it.

---

## Project Structure

```
productivity-app/
├── server/
│   ├── config/
│   │   └── database.js          # SQLite connection + schema
│   ├── models/
│   │   └── Task.js              # Model: data + business logic
│   ├── controllers/
│   │   └── TaskController.js    # Controller: request handling
│   ├── routes/
│   │   └── tasks.js             # Route definitions
│   └── index.js                 # Express app entry point
├── client/
│   ├── src/
│   │   ├── api/tasks.js         # API client layer
│   │   ├── hooks/useTasks.js    # State management hook
│   │   ├── components/
│   │   │   ├── StatsBar.jsx
│   │   │   ├── TaskForm.jsx
│   │   │   └── TaskList.jsx
│   │   ├── App.jsx              # Root view component
│   │   └── App.css
│   ├── index.html
│   └── vite.config.js
├── Dockerfile
├── docker-compose.yml
├── .env.example
└── package.json
```

---

## Deployment

### Railway / Render / Fly.io

1. Push to GitHub
2. Connect repo to your platform
3. Set build command: `npm run setup`
4. Set start command: `npm start`
5. Set environment variable `NODE_ENV=production`

### VPS / Self-hosted

```bash
git clone <your-repo>
cd productivity-app
npm run setup
NODE_ENV=production npm start
```

Use **PM2** to keep it running:

```bash
npm install -g pm2
pm2 start server/index.js --name productivity-app
pm2 save
```
