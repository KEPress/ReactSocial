const router = require('express').Router()
const { addPost, getFeedPosts, likePost } = require('../controllers/post.controller')
const { protect } = require('../config/authorize')
const { upload } = require('../middleware/multer')

router.post(`/add`, upload.array('images', 4), protect, addPost)

router.get(`/feed`, protect, getFeedPosts)

router.post(`/like`, protect, likePost)

router.get(`/test`, (request, response) => {
    response.json({ success: true, message: ('Post router online & operational') })
})

exports.postRoute = router