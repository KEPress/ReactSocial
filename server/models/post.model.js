const { model, Schema } = require('mongoose')

const postSchema = new Schema({
    user: { type: String, ref: 'User', required: true },
    content: { type: String, default: '' },
    image_urls: [{ type: String }],
    post_type: { type: String, enum: ['text', 'image', 'text_with_image'], required: true },
    //NOTE: cannot use Schema.Types.ObjectId as this is mongoDB auto _id and in this case using clerk _id setup (see UserModel Schema code)
    likes_count: [{ type: String, ref: 'User' }]

}, { timestamps: true })

exports.PostModel = model('Posts', postSchema)