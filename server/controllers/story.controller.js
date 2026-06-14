const { readFileSync } = require('fs')
const { getAuth } = require('@clerk/express')
const { imagekit } = require('../middleware/imagekit')
const { StoryModel } = require('../models/story.model')
const { UserModel } = require('../models/user.model')

exports.addStory = async (request, response, next) => {
    try {
        const { userId } = getAuth(request)
        const { content, media_type, background_color } = request.body
        const media = request.file
        let media_url = new String()
       
        if (media_type == ('image') || (media_type == ('video'))) {
           const fileBuffer = readFileSync(media.path)
           const uploadResult = await imagekit.upload({
                file: fileBuffer,
                fileName: media.originalname,
                folder: ('stories'),
            })
            media_url = uploadResult.url
        } //end if

        //Create a Story
        const story = await StoryModel.create({ user: userId, content, media_url, media_type, background_color })
        response.json({ success: true, message: ('Story created successfully') })
    } catch (error) {
        console.error(error)
        response.json({ success: false, message: (error.message) })
    } //end try-catch
}


exports.getStories = async (request, response, next) => {

    try {
        const { userId } = getAuth(request)
        const user = await UserModel.findById(userId)

        //Find connections & followings
        const links = Array(userId, ...user.connections, ...user.following)
        const stories = await StoryModel.find({ user: { $in: links } }).populate('user').sort({ createdAt: (-1) })
        response.json({ success: true, stories })
    } catch (error) {
        console.error(error)
        response.json({ success: false, message: (error.message) })
    } //end try-catch

}