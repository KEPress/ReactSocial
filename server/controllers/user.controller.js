const { readFileSync } = require('fs')
const { imagekit } = require('../middleware/imagekit')
const { UserModel } = require('../models/user.model');

//Get User Data using User Id
exports.getUserData = async (request, response, next) => {

    try {
        const { userId } = request.auth()
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
        const { userId } = request.auth()
        const { username, bio, location, full_name } = request.body
        
        const userData = await UserModel.findById(userId)
        (!username && (username = userData.username ))

        if (userData.username !== (username)) {
            const user = UserModel.findOne({ username })
            //will not change username if username already in use
            if (user) username = userData.username
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
        
        const user = await UserModel.findByIdAndUpdate(userId, updateData, ({ new: true })) 
        response.json({ success: true, user, message: ('User profile updated') })
    } catch (error) {
        console.error(error)
        response.json({ success: false, message: (error.message) })
    } //end try-catch
} //end function


//Find User Information
exports.locateUsers = async (request, response, next) => {

    try {
        const { userId } = request.auth()
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
        const { userId } = request.auth()
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
        const { userId } = request.auth()
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