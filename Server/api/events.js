const express = require("express");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const router = express.Router();
const jwt = require("jsonwebtoken");
const axios = require("axios");
const sendMail=require("./email");
const multer  = require('multer');
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    return cb(null, 'pictures/')
  },
  filename: function (req, file, cb) {
    return cb(null, `${req.user.id}.png`);
  }
});
const upload = multer({ storage: storage });

const authMiddleware = require("./authMiddleware");

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
        category:true
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

router.post("/event-pic/:id", authMiddleware,upload.single('picture'), async (req, res) => {
  console.log("req.body.data is",req.id);
  res.send(req.body);
});

// Create a new event - this route requires authentication
router.post("/", authMiddleware,upload.single('picture'), async (req, res) => {

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
    // Picture,
    CreatorName,
    CreatorEmail
  } = req.body;
  const DateTime = Date + "T" + Time + ":00.000z";

  // Combine address components
  const address = `${Street}, ${City}, ${State}, ${ZipCode}`;

  try {
    // Use the geocoding API to get latitude and longitude for the address
    const geoResponse = await axios.get(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
        address
      )}`
    );
    const [geoData] = geoResponse.data;

    if (!geoData) {
      return res
        .status(404)
        .json({ message: "Address not found for geocoding." });
    }

    // Extract latitude and longitude
    const latitude = parseFloat(geoData.lat);
    const longitude = parseFloat(geoData.lon);

    const event = await prisma.event.create({
      data: {
        Date: DateTime,
        Street,
        City,
        State,
        ZipCode: parseInt(ZipCode),
        EventTitle,
        Details,
        Picture:"demo",
        CreatorEmail,
        CreatorName,
        MaximumAttendies: parseInt(MaximumAttendies),
        CreatorId: req.user.id,
        category: {
          create: {
            Category: category,
          },
        },
        RSVPUsers:{
          create:{
            User_fname: CreatorName,
            UserEmail:CreatorEmail,
            userID:req.user.id,
          }
        },
        Latitude: latitude,
        Longitude: longitude,
        // Use a more detailed address from geoData
        LocationDisplay: address,
      },
    });
    sendMail(event,"New Event");    
    res.status(201).json(event);
  } catch (error) {
    console.error("Error creating event with geocoding:", error);
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
  const {Date,Street,City,State,ZipCode,EventTitle,Details,MaximumAttendies,Picture,Time,category} = req.body.updates;
  const DateTime = Date + "T" + Time + ":00.000z";

  const address = `${Street}, ${City}, ${State}, ${ZipCode}`;
 
  try {
    // Use the geocoding API to get latitude and longitude for the address
    const geoResponse = await axios.get(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
        address
      )}`
    );
    const [geoData] = geoResponse.data;

    if (!geoData) {
      return res
        .status(404)
        .json({ message: "Address not found for geocoding." });
    }

    // Extract latitude and longitude
    const latitude = parseFloat(geoData.lat);
    const longitude = parseFloat(geoData.lon);

    //update the database
    const event = await prisma.event.update({
      where: { id },
      data: {
        Street,City,State,EventTitle,Details,Picture,
        Latitude:latitude,Longitude:longitude,
        Date:DateTime,
        ZipCode:parseInt(ZipCode),
        MaximumAttendies:parseInt(MaximumAttendies),
        LocationDisplay:address,        
        category: {
          update: {
            data:{
              Category: category,
            }
          },
        },
      }
    });
    console.log("event",event);

    //get emailid of users thas have RSVP'ed for this event 
    let rsvpUserEmail=await prisma.RSVP.findMany({ 
      where: { eventID:id }, 
        select:{
          UserEmail:true,
      }, });
    let email=rsvpUserEmail.map((a)=>a.UserEmail);
    sendMail({...event,email},"Update Event");

    res.json(event);
  } catch (error) {
    console.error("Error updating event:", error);
    res.status(500).json({ message: "Error updating event." });
  }
});

// Delete an event - this route requires authentication
router.delete("/:id", authMiddleware, async (req, res) => {
  const { id } = req.params;
  console.log("id", id);
  try {
    let rsvpUserEmail=await prisma.RSVP.findMany({ 
      where: { eventID:id }, 
        select:{
          UserEmail:true,
      }, });
    let email=rsvpUserEmail.map((a)=>a.UserEmail);
    let event = await prisma.event.delete({ where: { id } });
    sendMail({...event,email},"Delete Event");
    return res.status(201).json({ result: "true" });
  } catch (error) {
    console.error("Error deleting event:", error);
    res.status(500).json({ message: "Error deleting event." });
  }
});

module.exports = router;
