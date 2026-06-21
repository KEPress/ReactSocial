import { createSlice } from '@reduxjs/toolkit'


export const userInterface = createSlice({
    name: 'interface',
    initialState: {
        // Sidebar
        sidebarOpen: false,
        // Profile - posts | media | likes
        profileActiveTab: ('posts'),
        // Links - Followers | Following | Pending | Connections
        linksActiveTab: ('Followers'),
        // StoryModal - create story
        storyModalOpen: false,
        // ViewStory - holds full story object when viewing, null when closing
        activeStory: (null),
        // Profile Modal - edit profile form
        profileEditOpen: false
    },
    reducers: {
        // Sidebar
        setSidebarOpen: (state, action) => {
            state.sidebarOpen = action.payload
        },
        toggleSidebar: (state) => {
            state.sidebarOpen = (!state.sidebarOpen)
        },
        // Profile tabs
        setProfileActiveTab: (state, action) => {
            state.profileActiveTab = action.payload
        },
        // Links tabs
        setLinksActiveTab: (state, action) => {
            state.linksActiveTab = action.payload
        },
        // Story Modal
        openStoryModal: (state) => {
            state.storyModalOpen = true
        },
        closeStoryModal: (state) => {
            state.storyModalOpen = false
        },
        // Story viewer
        setActiveStory: (state, action) => {
            state.activeStory = action.payload
        },
        clearActiveStory: (state) => {
            state.activeStory = (null)
        },

        // Profile edit modal
        openProfileEdit: (state) => {
            state.profileEditOpen = true
        },
        closeProfileEdit: (state) => {
            state.profileEditOpen = false
        }
    }
})

export const { setSidebarOpen, toggleSidebar, setProfileActiveTab, setLinksActiveTab, openStoryModal, closeStoryModal, setActiveStory, clearActiveStory, openProfileEdit, closeProfileEdit } = userInterface.actions

// Selectors - to access initialState variables
export const selectSidebarOpen = (state) => (state.userInterface.sidebarOpen)
export const selectProfileActiveTab = (state) => (state.userInterface.profileActiveTab)
export const selectLinksActiveTab = (state) => (state.userInterface.linksActiveTab)
export const selectStoryModalOpen = (state) => (state.userInterface.storyModalOpen)
export const selectActiveStory = (state) => (state.userInterface.activeStory)
export const selectProfileEditOpen = (state) => (state.userInterface.profileEditOpen)

export default userInterface