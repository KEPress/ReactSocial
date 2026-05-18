const { Inngest } = require('inngest')
const { UserModel } = require('../models/user.model')

const inngest = new Inngest({ id: 'reactsocial' })

//Sync User Creation
const syncUserCreation = inngest.createFunction(
    { id: 'sync-user-from-clerk', triggers: [{ event: 'clerk/user.created' }] },
    async ({ event }) => {
        const { id, first_name, last_name, email_addresses, image_url } = event.data
        let username = email_addresses[0].email_address.split('@')[0]

        //Check availability of username
        const user = await UserModel.findOne({ username: username })
        if (user) username = username + Math.floor(Math.random() * 10000)
        const userData = ({
            _id: id, email: email_addresses[0].email_address,
            full_name: (first_name + (" ") + last_name),
            profile_picture: image_url,
            username 
        })
        
        await UserModel.create(userData)
    } //end function
)

//Sync User Update
const syncUserUpdate = inngest.createFunction(
    { id: 'update-user-from-clerk', triggers: [{ event: 'clerk/user.updated' }] },
    async ({ event }) => {
        const { id, first_name, last_name, email_addresses, image_url } = event.data

        const updateUserData = ({
            email: email_addresses[0].email_address,
            full_name: (first_name + (" ") + last_name),
            profile_picture: image_url,
            username
        })

        await UserModel.findByIdAndUpdate(id, updateUserData)
    }
)

//Sync User Deletion
const syncUserDeletion = inngest.createFunction(
    { id: 'delete-user-with-clerk', triggers: [{ event: 'clerk/user.deleted' }] },
    async ({ event }) => {
        const { id } = event.data
        await UserModel.findByIdAndDelete(id)
    }
)

const functions = [syncUserCreation, syncUserUpdate, syncUserDeletion]


module.exports = { inngest, functions }