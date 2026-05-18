const { connect, connection } = require('mongoose')



const database_connect = async () => {
    if (connection.readyState === (1)) return

    // Wait for connection to complete if currently connecting
    if (connection.readyState === (2)) {
        await new Promise((resolve) => connection.once('connected', resolve))
        return
    } //end if

    try {
        await connect(process.env.MONGO_URI, {
            serverSelectionTimeoutMS: 30000,
            socketTimeoutMS: 45000,
        })
        console.log('Database connected')
    } catch (error) {
        console.error('Database connection error:', error.message)
        throw error
    } //end try-catch
}

module.exports = { database_connect }