const { model, Schema } = require('mongoose')

//Using Clerk to handle authorization and authentication hence _id

const userSchema =  new Schema({

    _id: { type: String, required: true },
    email: { type: String, required: true },
    full_name: { type: String, required: true },
    username: { type: String, unique: true },
    bio: { type: String, default: ('Hey there I am on React Social') },
    profile_picture: { type: String, default: '' },
    cover_photo: { type: String, default: '' },
    location: { type: String, default: '' },
    followers: [{ type: String, ref: 'User' }],
    following: [{ type: String, ref: 'User' }],
    connections: [{ type: String, ref: 'User' }]

}, { timestamps: true, minimize: false })


export const UserModel = model('User', userSchema)