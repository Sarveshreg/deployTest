const express = require("express");
const { PrismaClient } = require("@prisma/client");
const jwt = require("jsonwebtoken");

const prisma = new PrismaClient();
const router = express.Router();

// Authentication middleware
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
    console.log("req.user",req.user)
    next();
  } catch (error) {
    return res.status(401).json({ message: "Unauthorized. Invalid token." });
  }
};

// Route to let a user RSVP to an event
router.post("/:eventId", authMiddleware, async (req, res) => {
  const { eventId } = req.params;
  const userId = req.user.id;
  let {User_fname}=req.body
  try {
    const rsvp = await prisma.RSVP.create({
      data: {
        userID: userId,
        eventID: eventId,
        User_fname
      },
    });
    console.log("rsvp",rsvp)
    res.status(201).json(rsvp);
  } catch (error) {
    console.error("RSVP error:", error);
    res.status(500).json({ message: "Error creating RSVP." });
  }
});

// Route to view all RSVPs for the current user
router.get("/", authMiddleware, async (req, res) => {
  const userId = req.user.id;

  try {
    const rsvps = await prisma.RSVP.findMany({
      where: { userID: userId },
      include: { event: true },
    });
    res.json(rsvps);
  } catch (error) {
    console.error("Fetching RSVPs error:", error);
    res.status(500).json({ message: "Error fetching RSVPs." });
  }
});

// Route to cancel an RSVP
router.delete("/:eventId", authMiddleware, async (req, res) => {
  const { eventId } = req.params;
  const userId = req.user.id;

  try {
    let result=await prisma.RSVP.delete({
      where: {
        userID_eventID: {
          userID: userId,
          eventID: eventId,
        },
      },
    });
    console.log(result)
    res.json(result);
  } catch (error) {
    console.error("Cancel RSVP error:", error);
    res.status(500).json({ message: "Error cancelling RSVP." });
  }
});

module.exports = router;
