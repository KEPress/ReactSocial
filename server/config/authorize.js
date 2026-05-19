
exports.protect = async (request, response, next) => {
    try {
        const { userId } = await request.auth()
        if (!userId) return response.json({ success: false, message: ('Unauthenticated') })
        next()
    } catch (error) {
        response.json({ success: false, message: (error.message) })
    } //end try-catch
}
