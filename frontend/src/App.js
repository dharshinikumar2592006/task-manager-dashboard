
import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";

function App() {
  const [title, setTitle] = useState("");
  const [tasks, setTasks] = useState([]);
  const statuses = ["Pending", "Ongoing", "Completed"];

  function addTask(e) {
    e.preventDefault();

    if (!title.trim()) return;

    setTasks([
      ...tasks,
      {
        id: Date.now(),
        title: title.trim(),
        status: "Pending",
      },
    ]);

    setTitle("");
  }

  function updateStatus(id, status) {
    setTasks(
      tasks.map((task) =>
        task.id === id ? { ...task, status } : task
      )
    );
  }

  function deleteTask(id) {
    setTasks(tasks.filter((task) => task.id !== id));
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
                      <div className="task-item mb-4" key={task.id}>
                        <strong>{task.title}</strong>
                        <p className="text-muted mb-2">
                          Status: {task.status}
                        </p>

                        {status !== "Ongoing" && (
                          <button
                            className="btn btn-info btn-sm me-2 mb-2"
                            onClick={() => updateStatus(task.id, "Ongoing")}
                          >
                            Mark as Ongoing
                          </button>
                        )}

                        {status !== "Completed" && (
                          <button
                            className="btn btn-success btn-sm me-2 mb-2"
                            onClick={() => updateStatus(task.id, "Completed")}
                          >
                            Mark as Completed
                          </button>
                        )}

                        <button
                          className="btn btn-danger btn-sm mb-2"
                          onClick={() => deleteTask(task.id)}
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
    </div>
  );
}

export default App;
