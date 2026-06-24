import { useRef, useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { useSession } from '@clerk/react'
import { setAuth, clearAuth, updateToken } from '@store/slices/authorize'


// 50 minutes
const REFRESH_INTERVAL = (50 * 60 * 1000)

export const ClerkAuthorizeSync = ({ children }) => {
  
    const dispatch = useDispatch()

    const intervalRef = useRef(null)

    const { session, isLoaded } = useSession()

    useEffect(() => {
        if (!isLoaded) return

        if (session) {
            // Session exists - get token and Sync to Redux
            session.getToken().then((token) => {
                dispatch(setAuth({
                    userId: session.user.id, token
                }))
            })

            // Refresh token every 50 minutes before Clerk's 60 minute expiry
            intervalRef.current = setInterval(async () => {
                const newToken = await session.getToken()
                if (newToken) dispatch(updateToken(newToken))
            }, REFRESH_INTERVAL)
        } else {
            dispatch(clearAuth())
            if (intervalRef.current) clearInterval(intervalRef.current)
        } //end if-else

        return (() => {
            if (intervalRef.current) clearInterval(intervalRef.current)
        })
    }, [dispatch, session, isLoaded])

    return (children)
}
