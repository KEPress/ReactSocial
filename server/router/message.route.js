const router = require('express').Router()
const { sseController, sendMessage, getMessages, getRecentMessages } = require('../controllers/message.controller')
const { protect } = require('../config/authorize')
const { upload } = require('../middleware/multer')

router.get(`/:userId`, sseController)
router.post(`/send`, upload.single('image'), protect, sendMessage)
router.get(`/get`, protect, getMessages)
router.get(`/recent`, protect, getRecentMessages)

exports.messageRoute = router