const { model, Schema } = require('mongoose')

const messageSchema = new Schema({
    from_user_id: { type: String, ref: 'User', required: true },
    to_user_id: { type: String, ref: 'User', required: true },
    text: { type: String, trim: true, default: new String() },
    message_type: { type: String, enum: ['text', 'image'] }, 
    media_url: { type: String, default: new String() },
    seen: { type: Boolean, default: false }  
    
}, { timestamps: true, minimize: false })

exports.MessageModel = model('Message', messageSchema)