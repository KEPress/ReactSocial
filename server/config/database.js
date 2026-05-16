const { connect, connection } = require('mongoose')

const database_connect = async () => {
    try {
        connection.on('connected', () => console.log('Database connected'))
        await connect(`${process.env.MONGO_URI}/reactsocial`)
    } catch (error) {
        console.error(error.message)
    } //end try-catch
}

module.exports = { database_connect }