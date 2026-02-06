const express = require("express");
const cors = require("cors");
const { PrismaClient } = require("@prisma/client");

const app = express();
const prisma = new PrismaClient();

/**
 * ======================
 * MIDDLEWARE
 * ======================
 */

// Allow frontend to call backend
app.use(cors());

// 🔑 REQUIRED to read JSON body (this was missing / broken earlier)
app.use(express.json());

/**
 * ======================
 * ROUTES
 * ======================
 */

// Health check (optional but useful)
app.get("/", (req, res) => {
  res.send("Task Manager API is running");
});

// Get all tasks
app.get("/tasks", async (req, res) => {
  try {
    const tasks = await prisma.task.findMany({
      orderBy: { createdAt: "desc" }
    });
    res.json(tasks);
  } catch (err) {
    console.error("GET /tasks error:", err);
    res.status(500).json({ error: "Failed to fetch tasks" });
  }
});

// Add a task
app.post("/tasks", async (req, res) => {
  try {
    const { title } = req.body;

    // Validation
    if (!title || !title.trim()) {
      return res.status(400).json({ error: "Title is required" });
    }

    const task = await prisma.task.create({
      data: {
        title: title.trim()
      }
    });

    res.status(201).json(task);
  } catch (err) {
    console.error("POST /tasks error:", err);
    res.status(500).json({ error: "Failed to create task" });
  }
});

/**
 * ======================
 * SERVER
 * ======================
 */

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
