import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'


export const refreshClerkToken = createAsyncThunk(`auth/refreshToken`, async (getToken, { rejectWithValue }) => {
     try {
        const token = await getToken()
        if (!token) return rejectWithValue('No token returned from Clerk')
        return (token)
    } catch (error) {
        return rejectWithValue(error.message)
    } //end try-catch
}) 
   


export const authorize = createSlice({
    name: 'authorize',
    initialState: {
        userId: null,
        token: null,
        isAuthenticated: false,
        // idle | loading | succeeded | failed
        status: 'idle', 
        error: null
    },
    reducers: {
        setAuth: (state, action) => {
            state.userId = action.payload.userId
            state.token = action.payload.token
            state.isAuthenticated = true
            state.status = ('succeeded')
            state.error = (null)
        },
        clearAuth: (state) => {
            state.userId = (null)
            state.token = (null)
            state.isAuthenticated = false
            state.status = ('idle')
            state.error = (null)
        },
        updateToken: (state, action) => {
            state.token = action.payload
        }
    },
    extraReducers: (builder) => {
        builder.addCase(refreshClerkToken.pending, (state) => state.status = ('Loading'))
        
        builder.addCase(refreshClerkToken.fulfilled, (state, action) => {
            state.token = action.payload
            state.status = ('succeeded')
            state.error = (null)
        })

        builder.addCase(refreshClerkToken.rejected, (state, action) => {
            state.status = ('failed')
            state.error = action.payload
        })
    }
})


export const { setAuth, clearAuth, updateToken } = authorize.actions

// Selectors - to access initialState variables
export const selectUserId = (state) => (state.authorize.userId)
export const selectToken = (state) => (state.authorize.token)
export const selectIsAuthenticated = (state) => (state.authorize.isAuthenticated)
export const selectAuthorizeStatus = (state) => (state.authorize.status)
export const selectAuthorizeError = (state) => (state.authorize.error)


export default authorize