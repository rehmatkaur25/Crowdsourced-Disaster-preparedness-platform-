const express = require('express');
const router = express.Router();

const Comment = require('../models/Comment');

// GET All Comments (for the live feed)
// GET http://localhost:5000/api/comments
router.get('/', async (req, res) => {
  try {
    const comments = await Comment.findRecent();
    res.json(comments);
  } catch (err) {
    console.error("GET All Comments Error:", err);
    res.status(500).json({ message: "Server Error" });
  }
});


// POST Comment
// POST http://localhost:5000/api/comments
// Body:
// {
//   "user_id": 1,
//   "resource_id": 5,
//   "text": "This shelter is clean."
// }
router.post('/', async (req, res) => {
  try {
    const { user_id, resource_id, text } = req.body;

    // Basic validation
    if (!user_id || !resource_id || !text) {
      return res.status(400).json({
        message: "user_id, resource_id and text are required"
      });
    }

    const newComment = await Comment.create({
      user_id,
      resource_id,
      text
    });

    res.status(201).json(newComment);

  } catch (err) {
    console.error("POST Comment Error:", err);
    res.status(500).json({
      message: "Server Error"
    });
  }
});


// GET Comments by Resource ID
// GET http://localhost:5000/api/comments/resource/5
router.get('/resource/:id', async (req, res) => {
  try {
    const resource_id = req.params.id;

    const comments = await Comment.findByResourceId(resource_id);

    res.json(comments);

  } catch (err) {
    console.error("GET Comments Error:", err);
    res.status(500).json({
      message: "Server Error"
    });
  }
});

module.exports = router;