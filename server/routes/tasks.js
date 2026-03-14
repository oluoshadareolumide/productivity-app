// routes/tasks.js - REST API routing
const express = require("express");
const router = express.Router();
const TaskController = require("../controllers/TaskController");

router.get("/stats", TaskController.stats);
router.get("/", TaskController.index);
router.get("/:id", TaskController.show);
router.post("/", TaskController.store);
router.put("/:id", TaskController.update);
router.delete("/:id", TaskController.destroy);

module.exports = router;
