const { readFileSync } = require('fs')
const { getAuth } = require('@clerk/express')
const { imagekit } = require('../middleware/imagekit')
const { MessageModel } = require('../models/message.model')

// Create an empty object to store server side event connections
const connections = new Object()

// Controller function for the SSE connection
exports.sseController = (request, response, next) => {

    const { userId } = request.params
    console.log('New client connected for userId:', userId)

    // Set headers for SSE
    response.setHeader('Content-Type', 'text/event-stream')
    response.setHeader('Cache-Control', 'no-cache')
    response.setHeader('Connection', 'keep-alive')
    response.setHeader('Access-Control-Allow-Origin', '*')

    // Add client response object to connections object
    connections[userId] = response

    // Send an initial event to the client to confirm connection
    response.write(`data: ${JSON.stringify({ message: 'SSE connection established' })}\n\n`)

    // Handle client disconnect
    request.on('close', () => {
        // Remove client response object from connections object
        console.log('Client disconnected for userId:', userId)
        delete connections[userId]
    })
}

exports.sendMessage = async (request, response, next) => {

    try {
        const { userId } = getAuth(request)
        const { to_user_id, text } = request.body
        const image = request.file

        let media_url = ('')
        let message_type = (image ? ('image'):('text'))

        if (message_type === ('image')) {
            const fileBuffer = readFileSync(image.path)
            const uploadResult = await imagekit.upload({
                file: fileBuffer,
                fileName: image.originalname,
                folder: ('messages'),
            })

            media_url = imagekit.url({
                path: uploadResult.filePath,
                transformation: [
                    ({ quality: 'auto' }),
                    ({ format: 'webp' }),
                    ({ width: 512 })
                ]
            })
        } //end if
        const message = await MessageModel.create({ from_user_id: userId, to_user_id, text, message_type, media_url })
        response.json({ success: true, message })

        // Send message to to_user_id using SSE (Server side event)
        const messageData = await MessageModel.findById(message._id).populate('from_user_id')
        if (connections[to_user_id]) connections[to_user_id].write(`data: ${JSON.stringify(messageData)}\n\n`)
    
    } catch (error) {
        console.error(error)
        response.json({ success: false, message: (error.message) })
    } //end try-catch
}


exports.getMessages = async (request, response, next) => {

    try {
        const { userId } = getAuth(request)
        const { to_user_id } = request.body
        const messages = await MessageModel.find({
            $or: [
                ({ from_user_id: userId, to_user_id: to_user_id }),
                ({ from_user_id: to_user_id, to_user_id: userId })
            ]
        }).sort({ createdAt: (-1) })
        await MessageModel.updateMany({ from_user_id: to_user_id, to_user_id: userId }, { seen: true })
        response.json({ success: true, messages })
    } catch (error) {
        console.error(error)
        response.json({ success: false, message: (error.message) })
    } //end try-catch
}


exports.getRecentMessages = async (request, response, next) => {

    try {
        const { userId } = getAuth(request)
        const messages = await MessageModel.aggregate([
            { $match: { $or: [ { from_user_id: userId }, { to_user_id: userId } ] } },
            { $sort: { createdAt: (-1) } },
        ])
        response.json({ success: true, messages })
    } catch (error) {
        console.error(error)
        response.json({ success: false, message: (error.message) })
    } //end try-catch
}


exports.getRecentChats = async (request, response, next) => {

    try {
        const { userId } = getAuth(request)
        const messages = await MessageModel.find({ to_user_id: userId }).populate('from_user_id to_user_id').sort({ createdAt: (-1) })
        response.json({ success: true, messages })
    } catch (error) {
        console.error(error)
        response.json({ success: false, message: (error.message) })
    } //end try-catch
}