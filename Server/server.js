require("dotenv").config();
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const apiRouter = require("./api");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

// Simple request logger for demonstration purposes
app.use((req, res, next) => {
  console.log("<____Body Logger START____>");
  console.log(req.body);
  console.log("<_____Body Logger END_____>");
  next();
});

// API router
app.use("/api", apiRouter);

// Root route - Can be used for basic API information or health checks
app.get("/", (req, res) => {
  res.json({ message: "API is running" });
});

// Centralized error handling middleware
app.use((error, req, res, next) => {
  console.error("Error:", error);
  const status = error.status || 500;
  const message = error.message || "Internal server error";
  res.status(status).json({ error: message });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
