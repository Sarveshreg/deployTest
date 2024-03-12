const express = require("express");
const router = express.Router();
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// Middleware
router.use((req, res, next) => {
  console.log("Request to Event API received at ", Date.now());
  next();
});

// Get all events
router.get("/", async (req, res) => {
  try {
    const events = await prisma.event.findMany();
    res.json(events);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// Get an event by ID
router.get("/:id", async (req, res) => {
  try {
    const event = await prisma.event.findUnique({
      where: { id: req.params.id },
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

// Create a new event
router.post("/", async (req, res) => {
  const {
    categoryId, // I am assuming this is the ID of the existing Category?
    date,
    street,
    city,
    state,
    zipCode,
    eventTitle,
    details,
    maximumAttendies,
    creatorId,
  } = req.body;
  try {
    const event = await prisma.event.create({
      data: {
        category: {
          connect: { id: categoryId },
        },
        Date: new Date(date),
        Street: street,
        City: city,
        State: state,
        ZipCode: zipCode,
        EventTitle: eventTitle,
        Details: details,
        MaximumAttendies: maximumAttendies,
        CreatorId: creatorId,
      },
    });
    res.status(201).json(event);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// Update an event
router.put("/:id", async (req, res) => {
  const {
    category,
    date,
    street,
    city,
    state,
    zipCode,
    eventTitle,
    details,
    maximumAttendies,
  } = req.body;
  try {
    const event = await prisma.event.update({
      where: { id: req.params.id },
      data: {
        category,
        Date: date ? new Date(date) : undefined,
        Street: street,
        City: city,
        State: state,
        ZipCode: zipCode,
        EventTitle: eventTitle,
        Details: details,
        MaximumAttendies: maximumAttendies,
      },
    });
    res.json(event);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// Delete an event
router.delete("/:id", async (req, res) => {
  try {
    await prisma.event.delete({
      where: { id: req.params.id },
    });
    res.status(204).send("Event deleted successfully");
  } catch (error) {
    // This checks if the error is related to foreign key constraint which prevents deletion
    if (error.code === "P2003") {
      res
        .status(400)
        .send(
          "Cannot delete this event because it is referenced by other records."
        );
    } else {
      res.status(500).send(error.message);
    }
  }
});

module.exports = router;
