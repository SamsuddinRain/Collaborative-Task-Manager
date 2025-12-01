const express = require("express");
const router = express.Router();
const { Task, User, ActivityLog } = require("../models");
const { protect } = require("../middleware/authMiddleware");
const { authorizeRoles } = require("../middleware/roleMiddleware");

// Log Activity
const logActivity = async ({ taskId, userId, action, details }) => {
  await ActivityLog.create({ taskId, userId, action, details });
};

// GET tasks assigned to logged in user
router.get("/assigned", protect, async (req, res) => {
  try {
    const tasks = await Task.findAll({
      where: { assignedTo: req.user.id },
      include: [
        { model: User, as: "creatorUser", attributes: ["id", "name", "email"] },
      ],
    });

    res.json(tasks);
  } catch (err) {
    res.status(500).json({ message: "Error fetching tasks", error: err.message });
  }
});

// GET tasks created by manager
router.get("/created", protect, authorizeRoles("manager"), async (req, res) => {
  try {
    const tasks = await Task.findAll({
      where: { createdBy: req.user.id },
      include: [
        { model: User, as: "assignedUser", attributes: ["id", "name", "email"] },
      ],
    });

    res.json(tasks);
  } catch (err) {
    res.status(500).json({ message: "Error fetching tasks", error: err.message });
  }
});

// CREATE task (manager only)
router.post("/", protect, authorizeRoles("manager"), async (req, res) => {
  try {
    const {
      title,
      description,
      priority,
      status,
      dueDate,
      assignedTo,
    } = req.body;

    const task = await Task.create({
      title,
      description,
      priority,
      status,
      dueDate,
      assignedTo,
      createdBy: req.user.id,
    });

    await logActivity({
      taskId: task.id,
      userId: req.user.id,
      action: "created",
      details: `Created task: ${task.title}`,
    });

    res.json(task);
  } catch (err) {
    res.status(500).json({ message: "Error creating task", error: err.message });
  }
});

// UPDATE task
router.put("/:id", protect, async (req, res) => {
  try {
    const task = await Task.findByPk(req.params.id);

    if (!task) return res.status(404).json({ message: "Task not found" });

    const isManager = req.user.role === "manager";
    const isAssigned = task.assignedTo === req.user.id;

    if (!isManager && !isAssigned) {
      return res.status(403).json({ message: "Not allowed" });
    }

    if (!isManager) {
      if (!req.body.status) {
        return res
          .status(403)
          .json({ message: "Only task status can be updated by user" });
      }
      task.status = req.body.status;
    } else {
      Object.assign(task, req.body);
    }

    await task.save();

    res.json(task);
  } catch (err) {
    res.status(500).json({ message: "Error updating task", error: err.message });
  }
});

// DELETE task (manager only)
router.delete("/:id", protect, authorizeRoles("manager"), async (req, res) => {
  try {
    await Task.destroy({ where: { id: req.params.id } });

    res.json({ message: "Task deleted" });
  } catch (err) {
    res.status(500).json({ message: "Error deleting task", error: err.message });
  }
});

module.exports = router;
