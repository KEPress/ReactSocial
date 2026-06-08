const router = require('express').Router()
const { addPost, getFeedPosts, likePost } = require('../controllers/post.controller')
const { protect } = require('../config/authorize')
const { upload } = require('../middleware/multer')

router.post('/add', (request, response) => {
    console.log('DIRECT TEST')
    response.json({ success: true })
})

router.get(`/feed`, protect, getFeedPosts)

router.post(`/like`, protect, likePost)

exports.postRoute = router