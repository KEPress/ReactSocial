const router = require('express').Router()
const { getUserData, updateUserData, locateUsers, followUser, unfollowUser } = require('../controllers/user.controller')
const { upload } = require('../middleware/multer')
const { protect } = require('../config/authorize')

router.get(`/data`, protect, getUserData)

router.post(`/update`, upload.fields([{ name: 'profile', maxCount: 1}, { name: 'cover', maxCount: 1}]), protect, updateUserData)

router.post(`/discover`, protect, locateUsers)

router.post(`/follow`, protect, followUser)

router.post(`/unfollow`, protect, unfollowUser)

exports.userRoute= router