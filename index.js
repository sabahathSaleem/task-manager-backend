const express = require("express");
const cors = require("cors");
const { PrismaClient } = require("@prisma/client");

const app = express();
const prisma = new PrismaClient();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// GET all tasks
app.get("/tasks", async (req, res) => {
  const tasks = await prisma.task.findMany({
    orderBy: { createdAt: "desc" }
  });
  res.json(tasks);
});

// ADD a task
app.post("/tasks", async (req, res) => {
  const { task } = req.body;

  if (!task) {
    return res.status(400).json({ error: "Task is required" });
  }

  const newTask = await prisma.task.create({
    data: { title: task }
  });

  res.status(201).json(newTask);
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
