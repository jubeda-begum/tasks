const express = require("express");
const cors = require("cors");
const { v4: uuidv4 } = require("uuid");
const app = express();
// Middleware
app.use(cors({ origin: "*" }));
app.use(express.json());

// In-memory storage
let tasks = [];
 //CREATE TASK
app.post("/tasks", (req, res) => {
  const { title, status } = req.body;

  if (!title || title.trim() === "") {
    return res.status(400).json({ error: "Title is required" });
  }

  // Prevent duplicate tasks (optional improvement)
  if (tasks.some((t) => t.title === title.trim())) {
    return res.status(400).json({ error: "Task already exists" });
  }

  const newTask = {
    id: uuidv4(),
    title: title.trim(),
    status: status || "pending",
  };

  tasks.push(newTask);
  res.status(201).json(newTask);
});

//GET TASKS (with filter)
 
app.get("/tasks", (req, res) => {
  const { status } = req.query;

  if (status) {
    return res.json(tasks.filter((t) => t.status === status));
  }

  res.json(tasks);
});

 //UPDATE TASK
app.patch("/tasks/:id", (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  const task = tasks.find((t) => t.id === id);

  if (!task) {
    return res.status(404).json({ error: "Task not found" });
  }

  if (!status) {
    return res.status(400).json({ error: "Status is required" });
  }

  task.status = status;
  res.json(task);
});

//DELETE TASK
 
app.delete("/tasks/:id", (req, res) => {
  const { id } = req.params;

  const exists = tasks.some((t) => t.id === id);

  if (!exists) {
    return res.status(404).json({ error: "Task not found" });
  }

  tasks = tasks.filter((t) => t.id !== id);

  res.json({ message: "Task deleted successfully" });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
