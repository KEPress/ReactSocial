require('module-alias/register')
const express = require('express')
const cors = require('cors')
const { setServers } = require('dns')
const { serve } = require('inngest/express')
const { database_connect } = require('config/database')
const { inngest, functions } = require('middleware/injest')

setServers(Array('8.8.8.8', '8.8.4.4'))

const application = express()

application.use(express.json())
application.use(cors())

application.get(`/`, (request, response) => response.send('Server is online'))
application.use(`/api/inngest`, serve({ client: inngest, functions }))

const PORT = (process.env.PORT || (5000))

const startServer = async () => {
    try {
        await database_connect()
        application.listen(PORT, () => console.log(`Server is running on port ${PORT}`))
    } catch (error) {
        console.error(error.message)
    } //end try-catch
}

startServer()

 
