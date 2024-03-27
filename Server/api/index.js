require("dotenv").config();
console.log(process.env.DATABASE_URL);
const express = require("express");
const jwt = require("jsonwebtoken");
const { getUserById } = require("./utilities");
const JWT_SECRET = process.env.JWT_SECRET;
const usersRouter = require("./users");
const eventsRouter = require("./events");

const apiRouter = express.Router();
const app = express();

// Your other routes and middleware here
apiRouter.use("/users", usersRouter);
apiRouter.use("/events", eventsRouter);

// Error handling middleware
apiRouter.use((error, req, res, next) => {
  const status = error.status || 500;
  const message = error.message || "Internal server error";
  res.status(status).json({ error: message });
});

module.exports = apiRouter;
