const { readFileSync } = require('fs')
const { getAuth } = require('@clerk/express')
const { imagekit } = require('../middleware/imagekit')
const { inngest } = require('../middleware/injest')
const { UserModel } = require('../models/user.model')
const { PostModel } = require('../models/post.model')
const { ConnectModel } = require('../models/connect.model')

//Get User Data using User Id
exports.getUserData = async (request, response, next) => {

    try {
        const { userId } = getAuth(request)
        const user = await UserModel.findById(userId)
        if (!user) return response.json({ success: false,  message: ('User not found') })
        response.json({ success: true, user })    
    } catch (error) {
        console.error(error)
        response.json({ success: false, message: (error.message) })
    } //end try-catch
} //end function


//Update User Data
exports.updateUserData = async (request, response, next) => {

    try {
        const { userId } = getAuth(request)
        let { username, bio, location, full_name } = request.body
        
        const userData = await UserModel.findById(userId)
       
        if (!userData) return response.status(404).json({ success: false, message: ('User not found')})
            
        if (userData.username !== (username)) {
            const existingUser = await UserModel.findOne({ username })
            //will not change username if username already in use
            if (existingUser) username = userData.username
        } //end if

        const updateData = { username, bio, location, full_name }
        const profile = (request.files.profile && (request.files.profile[0]))
        const cover = (request.files.cover && (request.files.cover[0]))
        
        if (profile) {
            const buffer = readFileSync(profile.path)
            const upload = await imagekit.upload({
                file: buffer, fileName: profile.originalname,
            })

            const imageURL = imagekit.url({
                path: upload.filePath,
                transformation: [
                    ({ quality: 'auto' }),
                    ({ format: 'webp' }),
                    ({ width: 512 })
                ]
            })

            updateData.profile_picture = imageURL

        } //end if

        if (cover) {
            const buffer = readFileSync(cover.path)
            const upload = await imagekit.upload({
                file: buffer, fileName: cover.originalname,
            })

            const imageURL = imagekit.url({
                path: upload.filePath,
                transformation: [
                    ({ quality: 'auto' }),
                    ({ format: 'webp' }),
                    ({ width: 1280 })
                ]
            })

            updateData.cover_photo = imageURL

        } //end if
        
        const updateUser = await UserModel.findByIdAndUpdate(userId, updateData, ({ new: true })) 
        response.json({ success: true, user: updateUser, message: ('User profile updated') })
    } catch (error) {
        console.error(error)
        response.json({ success: false, message: (error.message) })
    } //end try-catch
} //end function


//Find User Information
exports.locateUsers = async (request, response, next) => {

    try {
        const { userId } = getAuth(request)
        const { input } = request.body

        const users = await UserModel.find({
            $or: [ { username: new RegExp(input, 'i') }, 
                   { email: new RegExp(input, 'i') },
                   { full_name: new RegExp(input, 'i') },
                   { location: new RegExp(input, 'i') } 
                ]
        })

        const filtered = users.filter((user) => (user._id !== (userId)))
        response.json({ success: true, users: filtered })
    } catch (error) {
        console.error(error)
        response.json({ success: false, message: (error.message) })
    } //end try-catch
}

//Follow User
exports.followUser = async (request, response, next) => {

    try {
        const { userId } = getAuth(request)
        const { id } = request.body
        const user = await UserModel.findById(userId)

        if (user.following.includes(id)) {
            return response.json({ success: false, message: ('Already following user') })
        } //end if

        user.following.push(id)
        await user.save()

        const toUser = await UserModel.findById(id)
        toUser.followers.push(userId)
        await toUser.save()

        response.json({ success: true, message: ('Following user')})

    } catch (error) {
        console.error(error)
        response.json({ success: false, message: (error.message) })
    } //end try-catch
}


//UnFollow User
exports.unfollowUser = async (request, response, next) => {

    try {
        const { userId } = getAuth(request)
        const { id } = request.body

        const user = await UserModel.findById(userId)
        user.following = user.following.filter((user) => (user !== (id)))
        await user.save()
        
        const toUser = await UserModel.findById(id)
        toUser.followers = toUser.followers.filter((user) => (user !== (userId)))
        await toUser.save()

        response.json({ success: true, message: ('User unfollowed') })
    } catch (error) {
        console.error(error)
        response.json({ success: false, message: (error.message) })
    } //end try-catch
}


exports.sendConnectRequest = async (request, response, next) => {

    try {
        const { userId } = getAuth(request)
        const { id } = request.body

        //Check if user has sent more than 20 connection requests in the last 24hrs
        const last24Hours = new Date(Date.now() - 24 * 60 * 60 * 1000)
        const connectRequest = await ConnectModel.find({ from_user_id: userId, createdAt: { $gt: last24Hours } })
        if (connectRequest.length >= (20)) return response.json({ success: false, message: ('You have sent more than 20 requests in last 24 hours') })
        const connection = await ConnectModel.findOne({
            $or: [{ from_user_id: userId, to_user_id: id }, 
                  { from_user_id: id, to_user_id: userId }]
        })    

        if (!connection) {
            const newConnection = await ConnectModel.create({ from_user_id: userId, to_user_id: id })
            await inngest.send({ name: 'app/connection-request', data: { connectionId: newConnection._id } })
            response.json({ success: true, message: ('Connection request sent successfully') })
        } else if (connection && (connection.status === ('accepted'))) {
            response.json({ success: false, message: ('You are already connected') })
        } else {
            response.json({ success: false, message: ('Connection request pending') })
        } //end if-else

    } catch (error) {
        console.error(error)   
        response.json({ success: false, message: (error.message) }) 
    } //end try-catch
}


//Get user connections
exports.getUserConnections = async (request, response, next) => {

    try {
        const { userId } = getAuth(request)
        const user = await UserModel.findById(userId).populate('connections followers following')
        const connections = user.connections
        const followers = user.followers
        const following = user.following

        const pending = (await ConnectModel.find({ to_user_id: userId, status: 'pending' }).populate('from_user_id')).map((connection) => (connection.from_user_id))
        response.json({ success: true, connections, followers, following, pending })
    } catch (error) {
        console.error(error)   
        response.json({ success: false, message: (error.message) }) 
    } //end try-catch
}


// Accept Connection Request
exports.acceptConnectRequests = async (request, response, next) => {

    try {
        const { userId } = getAuth(request)
        const { id } = request.body

        const connection = await ConnectModel.findOne({ from_user_id: id, to_user_id: userId })
        if (!connection) return response.json({ success: false, message: ('Connection not found') })

        const user = await UserModel.findById(userId)
        user.connections.push(id)
        await user.save()

        const toUser = await UserModel.findById(id)
        toUser.connections.push(userId)
        await toUser.save()

        connection.status = ('accepted')
        await connection.save()

        response.json({ success: true, message: ('Connection accepted successfully') })
    
    } catch (error) {
        console.error(error)
        response.json({ success: false, message: error.message })
    } //end try-catch

}



exports.getUserProfiles = async (request, response, next) => {

    try { 
        const { profileId } = request.body
        const profile = await UserModel.findById(profileId)
        if (!profile) {
            response.json({ success: false, message: ('User profile not found') })
        } else {
            const posts = await PostModel.find({ user: profileId }).sort({ createdAt: (-1) })
            response.json({ success: true, profile, posts })
        } //end if-else 
    } catch (error) {
        console.error(error)
        response.json({ success: false, message: (error.message) })
    } //end try-catch
}