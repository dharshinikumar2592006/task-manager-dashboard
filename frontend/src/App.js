
import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";

const API = `${process.env.REACT_APP_API_URL}/api/tasks`;
function App() {
  const [title, setTitle] = useState("");
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const statuses = ["Pending", "Ongoing", "Completed"];

  // Load tasks from backend
  async function loadTasks() {
    try {
      setLoading(true);
      const response = await fetch(API);

      if (!response.ok) throw new Error("Unable to load tasks");

      const data = await response.json();
      setTasks(data);
      setError("");
    } catch (err) {
      setError("Backend connection failed. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadTasks();
  }, []);

  // Add task
  async function addTask(e) {
    e.preventDefault();
    if (!title.trim()) return;

    try {
      const response = await fetch(API, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: title.trim(),
          status: "Pending",
        }),
      });

      if (!response.ok) throw new Error("Could not add task");

      setTitle("");
      loadTasks();
    } catch (err) {
      setError("Unable to add task.");
    }
  }

  // Update task status
  async function updateStatus(id, status) {
    try {
      const response = await fetch(`${API}/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });

      if (!response.ok) throw new Error("Could not update task");

      loadTasks();
    } catch (err) {
      setError("Unable to update task.");
    }
  }

  // Delete task
  async function deleteTask(id) {
    try {
      const response = await fetch(`${API}/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Could not delete task");

      loadTasks();
    } catch (err) {
      setError("Unable to delete task.");
    }
  }

  return (
    <div className="container mt-5">
      <h1 className="text-center mb-4">
        Task Manager Dashboard
      </h1>

      <form className="input-group mb-4" onSubmit={addTask}>
        <input
          className="form-control"
          placeholder="Enter task title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <button className="btn btn-primary" type="submit">
          Add Task
        </button>
      </form>

      {error && <p className="text-danger">{error}</p>}

      {loading ? (
        <p>Loading tasks...</p>
      ) : (
        <div className="row">
          {statuses.map((status) => (
            <div className="col-md-4 mb-4" key={status}>
              <div className="card h-100">
                <div className="card-header bg-primary text-white">
                  {status} Tasks
                </div>

                <div className="card-body">
                  {tasks.filter((task) => task.status === status).length === 0 ? (
                    <p className="text-muted">No tasks in this category.</p>
                  ) : (
                    tasks
                      .filter((task) => task.status === status)
                      .map((task) => (
                        <div className="task-item mb-4" key={task._id}>
                          <strong>{task.title}</strong>
                          <p className="text-muted mb-2">
                            Status: {task.status}
                          </p>

                          {status !== "Ongoing" && (
                            <button
                              className="btn btn-info btn-sm me-2 mb-2"
                              onClick={() => updateStatus(task._id, "Ongoing")}
                            >
                              Mark as Ongoing
                            </button>
                          )}

                          {status !== "Completed" && (
                            <button
                              className="btn btn-success btn-sm me-2 mb-2"
                              onClick={() => updateStatus(task._id, "Completed")}
                            >
                              Mark as Completed
                            </button>
                          )}

                          <button
                            className="btn btn-danger btn-sm mb-2"
                            onClick={() => deleteTask(task._id)}
                          >
                            Delete Task
                          </button>
                        </div>
                      ))
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default App;
