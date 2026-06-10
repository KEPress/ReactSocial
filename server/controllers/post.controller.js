const { getAuth } = require('@clerk/express')
const { readFileSync } = require('fs')
const { imagekit } = require('../middleware/imagekit')
const { PostModel } = require('../models/post.model')
const { UserModel } = require('../models/user.model')

exports.addPost = async (request, response, next) => {
    
    try {
        const { userId } = getAuth(request)
        const { content, post_type } = request.body
        const images = request.files

        let image_urls = Array()

        if (image_urls.length) {
            image_urls = await Promise.all(images.map(async (image) => {
                const fileBuffer = readFileSync(image.path)
                const response = await imagekit.upload({
                    file: fileBuffer,
                    fileName: image.originalname,
                    folder: ('posts'),
                })

                const url = imagekit.url({
                    path: response.filePath,
                    transformation: [
                        { quality: 'auto' },
                        { format: 'webp' },
                        { width: '1280' }
                    ]
                })
                return (url)
            }))
        } //end if
        await PostModel.create({ user: userId, content, image_urls, post_type })
        response.json({ success: true, message: ('Post created successfully') })
    } catch (error) {
        console.error(error)
        response.json({ success: false, message: (error.message) })
    } //end try-catch
}


exports.getFeedPosts = async (request, response, next) => {

    try {
        const { userId } = getAuth(request)
        const user = await UserModel.findById(userId)

        // user connections and followers
        const userIds = [userId, ...user.connections, ...user.following]
        const posts = await PostModel.find({ user: { $in: userIds } }).populate('user').sort({ createdAt: (-1) })
        response.json({ success: true, posts })
    } catch (error) {
        console.error(error)
        response.json({ success: false, message: (error.message) })
    } //end try-catch
}

exports.likePost = async (request, response, next) => {

    try {
         const { userId } = getAuth(request)
         const { postId } = request.body
         const post = await PostModel.findById(postId)
         if (post.likes_count.includes(userId)) {
            post.likes_count = post.likes_count.filter((user) => (user !== (userId)))
            await post.save()
            response.json({ success: true, message: ('Post unliked') })
         } else {
            post.likes_count.push(userId)
            await post.save()
            response.json({ success: true, message: ('Post liked') })
         } //end if-else
    } catch (error) {   
        console.error(error)
        response.json({ success: false, message: (error.message) })
    } //end try-catch

}