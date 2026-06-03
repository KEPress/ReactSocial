const { Inngest } = require('inngest')
const { UserModel } = require('../models/user.model')
const { database_connect } = require('../config/database')
const { ConnectModel } = require('../models/connect.model')
const { sendEmail } = require('../middleware/nodemailer') 

const inngest = new Inngest({ id: 'reactsocial' })

//Sync User Creation
const syncUserCreation = inngest.createFunction(
    { id: 'sync-user-from-clerk', triggers: [{ event: 'clerk/user.created' }] },
    async ({ event }) => {
        await database_connect()
        const { id, first_name, last_name, email_addresses, image_url } = event.data
        let username = email_addresses[0].email_address.split('@')[0]

        //Check availability of username
        const user = await UserModel.findOne({ username: username })
        if (user) username = username + Math.floor(Math.random() * 10000)
        const userData = await UserModel.create({
            _id: id, email: email_addresses[0].email_address,
            full_name: (first_name + (" ") + last_name),
            profile_picture: image_url
        })

        return(userData)
    } //end function
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

// Inngest function to send Reminder when a new connection request is added
const sendConnectionRequestReminder = inngest.createFunction(
    { id: 'send-new-connection-request-reminder', triggers: [{ event: 'app/connection-request' }] },
    async ({ event, step }) => {
        const { connectionId } = event.data
        await step.run('send-connection-request-email', async () => {
            const connection = await ConnectModel.findById(connectionId).populate('from_user_id to_user_find')
            const subject = (`👋 New Connection Request`)
            const body = (`<div style="font-family: Arial, sans-serif; padding: 20px;">
                                <h2>Hi ${connection.to_user_id.full_name},</h2>
                                <p>You have a new connection request from ${connection.from_user_id.full_name} - @${connection.from_user_id.username}</p>
                                <p>Click <a href="${process.env.FRONTEND_URL}/connections" style="color: #10b981;">here</a> to accept or reject the request</p>
                                <br/>
                                <p>Thanks,<br/>PingUp - Stay Connected</p>
                            </div>`)
            
            await sendEmail({ to: connection.to_user_id.email, subject, body })
        })

        const dailyCheck = new Date(Date.now() + 24 * 60 * 60 * 1000)
        await step.sleepUntil('wait-for-24-hours', dailyCheck)
        await step.run('send-connection-request-reminder', async () => {
            const connection = await ConnectModel.findById(connectionId).populate('from_user_id to_user_id')
            if (connection.status === ('accepted')) return ({ message: ('Already accepted') })
            
            const subject = (`👋 New Connection Request`)
            const body = (`<div style="font-family: Arial, sans-serif; padding: 20px;">
                            <h2>Hi ${connection.to_user_id.full_name},</h2>
                            <p>You have a new connection request from ${connection.from_user_id.full_name} - @${connection.from_user_id.username}</p>
                            <p>Click <a href="${process.env.FRONTEND_URL}/connections" style="color: #10b981;">here</a> to accept or reject the request</p>
                            <br/>
                            <p>Thanks,<br/>PingUp - Stay Connected</p>
                        </div>`)

            await sendEmail({ to: connection.to_user_id.email, subject, body })
            
            return ({ message: ('Reminder sent') })
        })

    } //end function
)


const functions = [syncUserCreation, syncUserUpdate, syncUserDeletion, sendConnectionRequestReminder]


module.exports = { inngest, functions }