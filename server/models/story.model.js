const { model, Schema } = require('mongoose')

const storySchema = new Schema({
    user: { type: String, ref: 'User', required: true },
    content: { type: String, default: new String() },
    media_url: { type: String, default: new String() },
    media_type: { type: String, enum: ['text', 'image', 'video'] },
    //NOTE: cannot use Schema.Types.ObjectId as this is mongoDB auto _id and in this case using clerk _id setup (see UserModel Schema code)
    viewers: [{ type: String, ref: 'User' }],
    background_color: { type: String, default: ('#000000') },

}, { timestamps: true, minimize: false })

exports.StoryModel = model('Story', storySchema)