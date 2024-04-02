const express = require("express");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const router = express.Router();
const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).send("Access denied. No token provided.");
  }

  const tokenParts = authHeader.split(" ");
  if (tokenParts.length !== 2 || tokenParts[0] !== "Bearer") {
    return res
      .status(400)
      .send("Invalid token format. Expected 'Bearer <token>'.");
  }

  const token = tokenParts[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    console.log(req.user);
    next();
  } catch (error) {
    console.error(error);
    res.status(401).send("Invalid token.");
  }
};

// This route doesn't require authentication, to list all events publicly
router.get("/", async (req, res) => {
  try {
    const events = await prisma.event.findMany();
    res.json(events);
  } catch (error) {
    console.error("Error fetching events:", error);
    res.status(500).json({ message: "Error fetching events." });
  }
});

// Get an event by ID - Public route
router.get("/:id", async (req, res) => {
  try {
    const event = await prisma.event.findUnique({
      where: { id: req.params.id },
      include: {
        RSVPUsers: true,
        Comment: true,
      },
    });
    if (event) {
      res.json(event);
    } else {
      res.status(404).send("Event not found");
    }
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// Create a new event - this route requires authentication
router.post("/", authMiddleware, async (req, res) => {
  const {
    Date,
    Street,
    City,
    State,
    ZipCode,
    EventTitle,
    Details,
    Time,
    MaximumAttendies,
    category,
    Picture,
  } = req.body;
  DateTime = Date + "T" + Time + ":00.000z";
  try {
    const event = await prisma.event.create({
      data: {
        Date: DateTime, //new Date(date),
        Street: Street,
        City: City,
        State: State,
        ZipCode: parseInt(ZipCode),
        EventTitle: EventTitle,
        Details: Details,
        Picture,
        MaximumAttendies: parseInt(MaximumAttendies),
        CreatorId: req.user.id, //change to be user.id once login is enabled on the frontend,
        category: {
          create: {
            Category: category,
          },
        },
      },
    });
    res.status(201).json(event);
  } catch (error) {
    console.error("Error creating event:", error);
    res.status(500).json({ message: "Error creating event." });
  }
});

// Protected route to add a comment to an event
router.post("/:id/comment", authMiddleware, async (req, res) => {
  const { id } = req.params;
  const { Comment, User_fname } = req.body;

  try {
    const comment = await prisma.comment.create({
      data: {
        Event_id: id,
        User_id: req.user.id,
        Comment,
        User_fname,
      },
    });
    res.status(201).json(comment);
  } catch (error) {
    console.error("Error adding comment:", error);
    res.status(500).send(error.message);
  }
});

// Update an event - this route requires authentication
router.put("/:id", authMiddleware, async (req, res) => {
  const { id } = req.params;
  const updates = req.body;
  try {
    const event = await prisma.event.update({
      where: { id },
      data: updates,
    });
    res.json(event);
  } catch (error) {
    console.error("Error updating event:", error);
    res.status(500).json({ message: "Error updating event." });
  }
});

// Delete an event - this route requires authentication
router.delete("/:id", authMiddleware, async (req, res) => {
  const { id } = req.params;
  try {
    await prisma.event.delete({ where: { id } });
    res.status(204).send();
  } catch (error) {
    console.error("Error deleting event:", error);
    res.status(500).json({ message: "Error deleting event." });
  }
});

module.exports = router;
