// server/index.js - Application entry point
const express = require("express");
const cors = require("cors");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors({ origin: process.env.CLIENT_URL || "http://localhost:5173" }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API Routes (Controller layer)
const taskRoutes = require("./routes/tasks");
app.use("/api/tasks", taskRoutes);

// Serve built React client in production
const clientBuild = path.join(__dirname, "../client/dist");
const fs = require("fs");
if (fs.existsSync(clientBuild)) {
  app.use(express.static(clientBuild));
  app.get("*", (req, res) => {
    res.sendFile(path.join(clientBuild, "index.html"));
  });
}

app.listen(PORT, () => {
  console.log(`\n🚀 Productivity App server running on http://localhost:${PORT}`);
  console.log(`   API: http://localhost:${PORT}/api/tasks`);
  console.log(`   Mode: ${process.env.NODE_ENV || "development"}\n`);
});

module.exports = app;
