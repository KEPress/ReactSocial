const { connect } = require('mongoose')

const connection = async () => {
    try {
        mongoose.connection.on('connected', () => console.log('Database connected'))
        await connect(`${process.env.MONGO_URI}/reactsocial`)
    } catch (error) {
        console.error(error.message)
    } //end try-catch
}

module.exports = { connection }