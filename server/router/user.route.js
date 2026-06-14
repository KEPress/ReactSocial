const router = require('express').Router()
const { getUserData, updateUserData, locateUsers, followUser, unfollowUser, getUserConnections, sendConnectRequest, acceptConnectRequests, getUserProfiles } = require('../controllers/user.controller')
const { protect } = require('../config/authorize')
const { upload } = require('../middleware/multer')

router.get(`/data`, protect, getUserData)

router.get(`/connections`, protect, getUserConnections)

router.post(`/update`, upload.fields([{ name: 'profile', maxCount: 1}, { name: 'cover', maxCount: 1}]), protect, updateUserData)

router.post(`/discover`, protect, locateUsers)

router.post(`/follow`, protect, followUser)

router.post(`/unfollow`, protect, unfollowUser)

router.post(`/connect`, protect, sendConnectRequest)

router.post(`/accept`, protect, acceptConnectRequests)

router.post(`/profiles`, protect, getUserProfiles)

exports.userRoute = router