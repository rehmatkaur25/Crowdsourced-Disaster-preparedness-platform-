const express = require('express');
const router = express.Router();
const Resource = require('../models/Resource');
const axios = require("axios");

// ROUTE 1: Get everything for the Map
// GET http://localhost:5000/api/resources?type=hospital&search=city
router.get('/', async (req, res) => {
  try {
    // req.query holds the URL data: { type: 'hospital', search: 'city' }
    const resources = await Resource.findAll(req.query);
    res.json(resources);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

// ROUTE 2: Add a new Pin
// Frontend calls: POST http://localhost:5000/api/resources
router.post('/', async (req, res) => {
  try {
    const { name, type, location_name, description, contact_number } = req.body;

    // 🌍 convert place name → coordinates
    const geoRes = await axios.get(
      "https://nominatim.openstreetmap.org/search",
      {
        params: {
          q: location_name,
          format: "json",
          limit: 1
        },
        headers: {
          "User-Agent": "disaster-map-app"
        }
      }
    );

    if (!geoRes.data.length) {
      return res.status(400).json({ error: "Location not found" });
    }

    const latitude = parseFloat(geoRes.data[0].lat);
    const longitude = parseFloat(geoRes.data[0].lon);

    // 💾 send coordinates to model
    const newResource = await Resource.create({
      name,
      type,
      location: { latitude, longitude },
      description,
      contact_number
    });

    res.status(201).json(newResource);

  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});



module.exports = router;