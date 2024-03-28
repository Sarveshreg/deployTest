const express = require("express");
const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const prisma = new PrismaClient();
const router = express.Router();

// Utility functions
const hashPassword = async (password) => bcrypt.hash(password, 10);
const verifyPassword = async (password, hash) => bcrypt.compare(password, hash);
const generateToken = (user) =>
  jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: "24h" });

// Middleware for authentication
const authMiddleware = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({
      message: "Unauthorized. No token provided or invalid token format.",
    });
  }
  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Unauthorized. Invalid token." });
  }
};

// Da Routes
// Register a new user
router.post("/register", async (req, res) => {
  const { FirstName, LastName, Email, Password, ZipCode } = req.body;
  try {
    const existingUser = await prisma.users.findUnique({ where: { Email } });
    if (existingUser) {
      return res.status(409).json({ message: "Email is already in use." });
    }
    const hashedPassword = await hashPassword(Password);
    const newUser = await prisma.users.create({
      data: { FirstName, LastName, Email, Password: hashedPassword, ZipCode },
    });
    const token = generateToken(newUser);
    res.status(201).json({ token, user: { ...newUser, Password: undefined } });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({ message: "Error during registration." });
  }
});

// Login
router.post("/login", async (req, res) => {
  const { Email, Password } = req.body;
  try {
    const user = await prisma.users.findUnique({
      where: { Email: Email },
    });
    if (!user || !(await verifyPassword(Password, user.Password))) {
      return res.status(401).json({ message: "Authentication failed." });
    }
    const token = generateToken(user);
    res.json({ token });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "An error occurred during login." });
  }
});

// Apply authMiddleware to protected routes
router.use(authMiddleware);

// Get all users - Publicly accessible
router.get("/", async (req, res) => {
  const users = await prisma.users.findMany();
  // Exclude passwords from the response
  res.json(users.map((user) => ({ ...user, Password: undefined })));
});

// Get a single user by ID - Requires authentication
router.get("/:id", authMiddleware, async (req, res) => {
  const { id } = req.params;
  const user = await prisma.users.findUnique({
    where: { id },
  });
  if (user) {
    // Exclude password
    res.json({ ...user, Password: undefined });
  } else {
    res.status(404).json({ message: "User not found." });
  }
});

// GET all events created by a specific user - Requires authentication
router.get("/:userId/events", authMiddleware, async (req, res) => {
  const { userId } = req.params;
  try {
    const events = await prisma.event.findMany({
      where: {
        CreatorId: userId,
      },
    });
    if (events.length > 0) {
      res.json(events);
    } else {
      res.status(404).json({ message: "No events found for this user." });
    }
  } catch (error) {
    console.error("Error fetching events for user:", error);
    res.status(500).json({ message: "Error fetching events." });
  }
});

// Update an existing user - Requires authentication
router.put("/:id", authMiddleware, async (req, res) => {
  const { id } = req.params;
  const { FirstName, LastName, Email, ZipCode } = req.body;
  try {
    const updatedUser = await prisma.users.update({
      where: { id },
      data: { FirstName, LastName, Email, ZipCode },
    });
    // Exclude the password from the response
    res.json({ ...updatedUser, Password: undefined });
  } catch (error) {
    console.error("Update error:", error);
    res.status(500).json({ message: "Error updating user information." });
  }
});

// Delete a user - Requires authentication
router.delete("/:id", authMiddleware, async (req, res) => {
  const { id } = req.params;
  try {
    await prisma.users.delete({
      where: { id },
    });
    res.status(204).send("User deleted successfully.");
  } catch (error) {
    console.error("Deletion error:", error);
    res.status(500).json({ message: "Error deleting user." });
  }
});

module.exports = router;
