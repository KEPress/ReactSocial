import { createSlice } from '@reduxjs/toolkit'

export const messaging = createSlice({
    name: 'messaging',
    initialState: {
        // Which user's conversation is open in ChatBox.jsx
        activeConversationId: null,

        // SSE real-time connection status
        sseConnected: false,

        // ChatBox message draft — text input and image filename
        draft: ({
            text: '',
            // filename only — File objects are not Redux serializable
            image: null 
        })
    },
    reducers: {
        setActiveConversation: (state, action) => {
            state.activeConversationId = action.payload
        },
        clearActiveConversation: (state) => {
            state.activeConversationId = (null)
        },
        setSseConnected: (state, action) => {
            state.sseConnected = action.payload
        },
        setDraftText: (state, action) => {
            state.draft.text = action.payload
        },
        setDraftImageName: (state, action) => {
            state.draft.image = action.payload
        },
        clearDraft: (state) => {
            state.draft.text = ''
            state.draft.image = (null)
        }
    }
})

export const { setActiveConversation, clearActiveConversation, setSseConnected, setDraftText, setDraftImageName, clearDraft } = messaging.actions


// Selectors - to access initialState variables
export const selectActiveConversationId = (state) => (state.messaging.activeConversationId)
export const selectSseConnected = (state) => (state.messaging.sseConnected)
export const selectDraft = (state) => (state.messaging.draft)


export default messaging