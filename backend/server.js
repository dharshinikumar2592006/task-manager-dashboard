
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Task Schema
const Task = mongoose.model(
  "Task",
  new mongoose.Schema(
    {
      title: {
        type: String,
        required: true,
        trim: true,
      },
      status: {
        type: String,
        enum: ["Pending", "Ongoing", "Completed"],
        default: "Pending",
      },
    },
    { timestamps: true }
  )
);

// Check database connection
function checkDB(req, res, next) {
  if (mongoose.connection.readyState !== 1) {
    return res.status(503).json({
      message: "Database is not connected. Please try again later.",
    });
  }
  next();
}

// Home route
app.get("/", (req, res) => {
  res.send("Task Manager Backend is running!");
});

// Health check
app.get("/health", (req, res) => {
  res.json({ status: "Backend is running" });
});

// Get all tasks
app.get("/api/tasks", checkDB, async (req, res) => {
  try {
    const tasks = await Task.find();
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Add task
app.post("/api/tasks", checkDB, async (req, res) => {
  try {
    const task = await Task.create({
      title: req.body.title,
      status: req.body.status || "Pending",
    });
    res.status(201).json(task);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update task
app.put("/api/tasks/:id", checkDB, async (req, res) => {
  try {
    const task = await Task.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true, runValidators: true }
    );

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    res.json(task);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete task
app.delete("/api/tasks/:id", checkDB, async (req, res) => {
  try {
    const task = await Task.findByIdAndDelete(req.params.id);

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    res.json({ message: "Task deleted successfully" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Start server FIRST
app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);
});

// Connect MongoDB separately
const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error("MONGODB_URI is missing. Add it in Render Environment Variables.");
} else {
  mongoose
    .connect(MONGODB_URI, { serverSelectionTimeoutMS: 10000 })
    .then(() => {
      console.log("MongoDB connected successfully!");
    })
    .catch((error) => {
      console.error("MongoDB connection failed:", error.message);
    });
}
