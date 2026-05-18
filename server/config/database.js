const { connect, connection } = require('mongoose')

let isConnected = false

const database_connect = async () => {
    
    if (isConnected) return

    try {
        connection.on('connected', () => console.log('Database connected'))
        await connect(`${process.env.MONGO_URI}/reactsocial`)
        isConnected = true
    } catch (error) {
        console.error(error.message)
    } //end try-catch
}

module.exports = { database_connect }