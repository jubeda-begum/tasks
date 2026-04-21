import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
const BASE_URL = "https://task-manager-backend-fzwf.onrender.com";
function App() {
  const [tasks, setTasks] = useState([]);
  const [taskTitle, setTaskTitle] = useState("");
  const [taskStatus, setTaskStatus] = useState("pending");
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(false);
  const loadTasks = useCallback(async () => {
    try {
      setLoading(true);

      let url = `${BASE_URL}/tasks`;

      if (filter !== "all") {
        url += `?status=${filter}`;
      }

      const response = await axios.get(url);
      setTasks(response.data);
    } catch (error) {
      console.error("Error fetching tasks:", error);
    } finally {
      setLoading(false);
    }
  }, [filter]);

  useEffect(() => {
    loadTasks();
  }, [loadTasks]);

   //Add task
  
  const handleAddTask = async () => {
    if (!taskTitle.trim()) return;

    try {
      await axios.post(`${BASE_URL}/tasks`, {
        title: taskTitle,
        status: taskStatus,
      });

      setTaskTitle("");
      loadTasks();
    } catch (error) {
      console.error("Error adding task:", error);
    }
  };

   //Toggle task status

  const handleToggleStatus = async (task) => {
    const updatedStatus =
      task.status === "pending" ? "completed" : "pending";

    try {
      await axios.patch(`${BASE_URL}/tasks/${task.id}`, {
        status: updatedStatus,
      });

      loadTasks();
    } catch (error) {
      console.error("Error updating task:", error);
    }
  };


   // Delete task
   
  const handleDeleteTask = async (taskId) => {
    try {
      await axios.delete(`${BASE_URL}/tasks/${taskId}`);
      loadTasks();
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };

  return (
    <div style={{ padding: "20px", maxWidth: "500px", margin: "auto" }}>
      <h2>Task Manager</h2>

      {/* Add Task */}
      <div style={{ marginBottom: "10px" }}>
        <input
          type="text"
          placeholder="Enter task title"
          value={taskTitle}
          onChange={(e) => setTaskTitle(e.target.value)}
        />

        <select
          value={taskStatus}
          onChange={(e) => setTaskStatus(e.target.value)}
        >
          <option value="pending">Pending</option>
          <option value="completed">Completed</option>
        </select>

        <button onClick={handleAddTask} disabled={!taskTitle.trim()}>
          Add Task
        </button>
      </div>

      {/* Filter */}
      <div style={{ marginBottom: "10px" }}>
        <button onClick={() => setFilter("all")}>All</button>
        <button onClick={() => setFilter("pending")}>Pending</button>
        <button onClick={() => setFilter("completed")}>Completed</button>
      </div>

      {/* Task List */}
      {loading ? (
        <p>Loading...</p>
      ) : tasks.length === 0 ? (
        <p>No tasks found</p>
      ) : (
        <ul>
          {tasks.map((task) => (
            <li key={task.id} style={{ marginBottom: "10px" }}>
              <strong>{task.title}</strong>{" "}
              <span
                style={{
                  color:
                    task.status === "completed" ? "green" : "orange",
                }}
              >
                ({task.status})
              </span>

              <button onClick={() => handleToggleStatus(task)}>
                Toggle
              </button>

              <button onClick={() => handleDeleteTask(task.id)}>
                Delete
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default App;