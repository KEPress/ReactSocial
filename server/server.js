const express = require('express')
const cors = require('cors')
const { setServers } = require('dns')
const { serve } = require('inngest/express')
const { clerkMiddleware } = require('@clerk/express')
const { database_connect } = require('./config/database')
const { userRoute } = require('./router/user.route')
const { postRoute } = require('./router/post.route')
const { storyRoute } = require('./router/story.route')
const { messageRoute } = require('./router/message.route')
const { inngest, functions } = require('./middleware/injest')

setServers(Array('8.8.8.8', '8.8.4.4'))

const application = express()

application.use(express.json())
application.use(cors({
    origin: 'http://localhost:5173',
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization']
}))
application.use(clerkMiddleware())

application.get(`/`, (request, response) => response.send('Server is online'))
application.use(`/api/inngest`, serve({ client: inngest, functions }))
application.use(`/api/user`, userRoute).use(`/api/post`, postRoute)
application.use(`/api/story`, storyRoute).use(`/api/message`, messageRoute)

const PORT = (process.env.PORT || (4000))

database_connect().then(() => {
    application.listen(PORT, () => console.log(`Server is running on: ${PORT}`))
}).catch((error) => console.error(error))

 
module.exports = application