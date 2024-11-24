// routes/commentRoutes.js
const express = require('express');
const router = express.Router();
const { createComment } = require('../controllers/commentController');
const { protect } = require('../middleware/auth');

router.post('/', protect, createComment);

module.exports = router;