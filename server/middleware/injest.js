const { Inngest } = require('inngest')
const { UserModel } = require('../models/user.model')
const { database_connect } = require('../config/database')

const inngest = new Inngest({ id: 'reactsocial' })

//Sync User Creation
const syncUserCreation = inngest.createFunction(
    { id: 'sync-user-from-clerk', triggers: [{ event: 'clerk/user.created' }] },
    async ({ event }) => {
        try {
            await database_connect()
            console.log('DB connected, processing user creation...')
            
            const { id, first_name, last_name, email_addresses, image_url } = event.data
            console.log('Event data:', { id, first_name, last_name })
            
            let username = email_addresses[0].email_address.split('@')[0]

            const user = await UserModel.findOne({ username })
            if (user) username = username + Math.floor(Math.random() * 10000)

            console.log('Creating user with data:', {
                _id: id,
                email: email_addresses[0].email_address,
                full_name: first_name + ' ' + last_name,
                username
            })

            const newUser = await UserModel.create({
                _id: id,
                email: email_addresses[0].email_address,
                full_name: first_name + ' ' + last_name,
                profile_picture: image_url,
                username
            })

            console.log('User created:', newUser)
            return newUser

        } catch (error) {
            console.error('syncUserCreation error:', error.message)
            throw error  // ← rethrow so Inngest marks it as failed
        }
    }
)

//Sync User Update
const syncUserUpdate = inngest.createFunction(
    { id: 'update-user-from-clerk', triggers: [{ event: 'clerk/user.updated' }] },
    async ({ event }) => {
        await database_connect()
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
        await database_connect()
        const { id } = event.data
        await UserModel.findByIdAndDelete(id)
    }
)

const functions = [syncUserCreation, syncUserUpdate, syncUserDeletion]


module.exports = { inngest, functions }