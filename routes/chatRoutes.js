const express = require('express')
const router = express.Router()
const {getChatHistory} = require('../controllers/chatController')
const { protect } = require('../middleware/auth')


router.get('/:room', protect, getChatHistory);

module.exports = router;