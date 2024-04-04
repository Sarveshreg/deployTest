// api/geocode.js
const express = require("express");
const axios = require("axios");
const router = express.Router();

router.get("/geocode", async (req, res) => {
  const { address } = req.query;

  try {
    const response = await axios.get(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
        address
      )}`
    );
    const [result] = response.data;

    if (!result) {
      return res.status(404).json({ message: "Address not found" });
    }

    const { lat, lon } = result;
    res.json({ latitude: lat, longitude: lon });
  } catch (error) {
    console.error("Geocoding error:", error);
    res.status(500).json({ message: "Error geocoding address" });
  }
});

module.exports = router;
