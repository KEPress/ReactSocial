const { connect, connection } = require('mongoose')



const database_connect = async () => {
    
    if (connection.readyState === (1)) return

    try {
        connection.on('connected', () => console.log('Database connected'))
        await connect(process.env.MONGO_URI, {
            serverSelectionTimeoutMS: 30000,
            socketTimeoutMS: 45000,
            bufferCommands: false
         })
    } catch (error) {
        console.error(error.message)
    } //end try-catch
}

module.exports = { database_connect }