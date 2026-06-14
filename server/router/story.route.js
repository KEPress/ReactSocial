const router = require('express').Router()
const { addStory, getStories } = require('../controllers/story.controller')
const { protect } = require('../config/authorize')
const { upload } = require('../middleware/multer')

router.post(`/add`, upload.single('media'), protect, addStory)

router.get(`/feed`, protect, getStories)

exports.storyRoute = router