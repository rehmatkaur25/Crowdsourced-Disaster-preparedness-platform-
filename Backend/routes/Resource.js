const express = require('express');
const router = express.Router();
const Resource = require('../models/Resource');
const axios = require("axios");

router.get('/', async (req, res) => {
  try {
    const resources = await Resource.findAll(req.query);
    res.json(resources);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

router.post('/', async (req, res) => {
  try {
    const { name, type, status, location_name, description, contact_number } = req.body;

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

    const newResource = await Resource.create({
      name,
      type,
      status,
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
