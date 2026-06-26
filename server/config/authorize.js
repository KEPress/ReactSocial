const { getAuth } = require('@clerk/express')

exports.protect = async (request, response, next) => {
    try {
        console.log('Authorization header:', request.headers.authorization)
        const { userId } = await getAuth(request)
        if (!userId) return response.json({ success: false, data: userId, message: ('Unauthenticated') })
        next()
    } catch (error) {
        response.json({ success: false, message: (error.message) })
    } //end try-catch
}
