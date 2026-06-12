const { model, Schema } = require('mongoose')

//Using Clerk to handle authorization and authentication hence _id

const userSchema =  new Schema({
    //NOTE: cannot use Schema.Types.ObjectId as this is mongoDB auto _id and in this case using clerk _id setup
    _id: { type: String, required: true },
    email: { type: String, required: true },
    full_name: { type: String, required: true },
    username: { type: String, unique: true },
    bio: { type: String, default: ('Hey there I am on React Social') },
    profile_picture: { type: String, default: new String() },
    cover_photo: { type: String, default: '' },
    location: { type: String, default: '' },
    //NOTE: followers, following & connections all references the clerk _id field setup 
    followers: [{ type: String, ref: 'User' }],
    following: [{ type: String, ref: 'User' }],
    connections: [{ type: String, ref: 'User' }]

}, { timestamps: true, minimize: false })

exports.UserModel = model('User', userSchema)