const { model, Schema } = require('mongoose')

const connectSchema =  new Schema({
    from_user_id: { type: String, ref: 'User', required: true },
    to_user_id: { type: String, ref: 'User', required: true },
    status: { type: String, enum: ['pending', 'accepted'], default: 'pending' }

}, { timestamps: true, minimize: false })

exports.ConnectModel = model('Connection', connectSchema)
