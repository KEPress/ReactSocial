import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'


export const api = createApi({
    reducerPath: 'api',
    baseQuery: fetchBaseQuery({ 
        baseUrl: import.meta.env.VITE_BASE_URL,
        prepareHeaders: async (headers, { getState }) => {
            const token = await getState().authorize.token
            if (token) headers.set('Authorization', (`Bearer ${token}`))
            return (headers)
        } //end prepareHeaders
    }),
    tagTypes: ['User', 'Post', 'Connection', 'Message', 'Story'],
    endpoints: (builder) => ({
        
        // ── USER ─────────────────────────────────────────────────────────────────
        getUser: builder.query({
            //NOTE: no need for method GET inside query() call
            //more specifically query() contains no params
            query: () => (`/api/user/data`),
            providesTags: ['User']
        }),
        updateUser: builder.mutation({
            query: (formData) => ({
                url: (`/api/user/update`),
                method: 'POST',
                body: formData
            }),
            invalidatesTags: ['User']
        }),
        discoverUsers: builder.query({
            query: (input) => ({
                url: (`/api/user/discover`),
                method: 'POST',
                body: ({ input })
            })
        }),
        followUser: builder.mutation({
            query: (id) => ({
                url: (`/api/user/follow`),
                method: 'POST',
                body: ({ id })
             }),
             invalidatesTags: ['User', 'Connection']
        }),
        unfollowUser: builder.mutation({
            query: (id) => ({
                url: (`/api/user/unfollow`),
                method: 'POST',
                body: ({ id })
            }),
            invalidatesTags: ['User', 'Connection']
        }),
        sendConnectRequest: builder.mutation({
            query: (id) => ({
                url: (`/api/user/connect`),
                method: 'POST',
                body: ({ id })
            }),
            invalidatesTags: ['Connection']
        }),
        getUserConnections: builder.query({
            query: () => (`/api/user/connections`),
            providesTags: ['Connection', 'User']
        }),
        acceptConnectRequest: builder.mutation({
            query: (id) => ({
                url: ('/api/user/accept'),
                method: 'POST',
                body: ({ id })
            }),
            invalidatesTags: ['Connection', 'User']
        }),
        getUserProfile: builder.mutation({
            query: (profileId) => ({
                // must match router.post('/profile')
                url: (`/api/user/profile`),
                method: 'POST',
                // must match const { profileId } = request.body
                body: ({ profileId })
            })
        }),
        // ── POSTS ─────────────────────────────────────────────────────────────────
        getFeedPosts: builder.query({
            query: () => (`/api/post/feed`),
            providesTags: ['Post'],
        }),
        addPost: builder.mutation({
            query: (formData) => ({ 
                url: (`/api/post/add`), 
                method: 'POST', 
                body: (formData) 
            }),
            invalidatesTags: ['Post']
        }),
        likePost: builder.mutation({
            query: (postId) => ({
                url: (`/api/post/like`),
                method: 'POST',
                body: ({ postId }) 
            }),
            async onQueryStarted({ postId }, { dispatch, queryFulfilled, getState }) {
                const userId = getState().authorize.userId
                const patch = dispatch(api.util.updateQueryData('getFeedPosts', undefined, (draft) => {
                    const post = draft.posts.find((post) => (post._id === (postId)))
                    if (post) {
                        const index = post.likes_count.indexOf(userId)
                        index === (-1) ? (post.likes_count.push(userId)) : (post.likes_count.splice(index, 1))
                    } //end if
                }))
                try { await queryFulfilled } catch { patch.undo() }
            } //end function
        }),
        // ── MESSAGES ──────────────────────────────────────────────────────────────
        getMessages: builder.query({
            query: (to_user_id) => (`/api/message/get?to_user_id=${to_user_id}`),
            providesTags: (result, error, to_user_id) => ([ 
                ({ type: 'Message', id: to_user_id }) 
            ])
        }),
        getRecentMessages: builder.query({
            query: () => (`/api/message/recent`), 
            providesTags: ['Message'],
        }),
        sendMessage: builder.mutation({ 
            query: (formData) => ({ 
                url: (`/api/message/send`), 
                method: 'POST', 
                body: (formData) 
            }),
            async onQueryStarted(formData, { dispatch, queryFulfilled }) {
                const { data } = await queryFulfilled
                const to_user_id = formData.get('to_user_id')
                dispatch(api.util.updateQueryData('getMessages', to_user_id, (draft) => draft.messages.unshift(data.message) ))
            },
            invalidatesTags: ['Message'],
        }),
        // ── STORIES ───────────────────────────────────────────────────────────────
        getStories: builder.query({
            query: () => (`/api/story/feed`),
            providesTags: ['Story']
        }),
        addStory: builder.mutation({
            query: (formData) => ({
                url: (`/api/story/add`),
                method: 'POST',
                body: (formData)
            }),
            invalidatesTags: ['Story']
        })
    })
})


export const {
  // User
  useGetUserQuery,
  useUpdateUserMutation,
  useDiscoverUsersQuery,
  useFollowUserMutation,
  useUnfollowUserMutation,
  useSendConnectRequestMutation,
  useGetUserConnectionsQuery,
  useAcceptConnectRequestMutation,
  useGetUserProfileMutation,
  // Posts
  useGetFeedPostsQuery,
  useAddPostMutation,
  useLikePostMutation,
  // Messages
  useGetMessagesQuery,
  useGetRecentMessagesQuery,
  useSendMessageMutation,
  // Stories
  useGetStoriesQuery,
  useAddStoryMutation,
} = api


export default api