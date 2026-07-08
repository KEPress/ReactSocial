import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { Plus, MapPin, UserPlus, MessageCircle } from 'lucide-react'
import { selectToken } from '@store/slices/authorize'
import { useGetUserQuery, useFollowUserMutation, useSendConnectRequestMutation } from '@store/api/api'
import toast from 'react-hot-toast'


export const UserCards = ({ user = Object() }) => {

    const navigate = useNavigate()

    const token = useSelector(selectToken)

    const { data } = useGetUserQuery(undefined, { skip: (!token) })

    const currentUser = data?.user

    const [followUser] = useFollowUserMutation()

    const [sendConnectRequest] = useSendConnectRequestMutation()

    const isFollowing = (currentUser?.following.includes(user._id))

    const isConnected = (currentUser?.connections.includes(user._id))

    const followHandle = async () => {
        await toast.promise(followUser(user._id).unwrap(), ({
            loading: 'Following user...',
            success: 'User followed successfully!',
            error: (error) => (error.message)
        }))
    } //end function

    const connectRequest = async () => {
        if (isConnected) {
            // Already connected - navigate to messages
            navigate(`/messages/${user._id}`)
            return
        } //end if
        await toast.promise(sendConnectRequest(user._id).unwrap(), ({
            loading: 'Sending connection request...',
            success: 'Connection request sent successfully!',
            error: (error) => (error.message)
        }))
    } //end function

    return (<React.Fragment>
                <div key={(user)} className={'p-4 pt-6 flex flex-col justify-between w-72 shadow border'}>
                    <div className={'text-center'}>
                        <img src={(user.profile_picture)} alt={''} className={'rounded-full w-16 shadow-md mx-auto'} />
                        <p className={'mt-4 font-semibold'}>{(user.full_name)}</p>
                        {(user.username && (<p className={'text-gray-500 font-light'}>@{user.username}</p>))}
                        {((user.bio && (<p className={'text-gray-600 mt-2 text-center text-sm px-4'}>{(user.bio)}</p>)))}
                    </div>
                    <div className={'flex items-center justify-center gap-2 mt-4 text-xs text-gray-600'}>
                        <div className={'flex items-center gap-1 border border-gray-300 rounded-full px-3 py-1'}>
                            <MapPin className={'w-4 h-4'} />{(user.location)}
                        </div>
                        <div className={'flex items-center gap-1 border border-gray-300 rounded-full px-3 py-1'}>
                            <span>{(user.followers.length)}</span> Followers
                        </div>
                    </div>
                    <div className={'flex mt-4 gap-2'}>
                        {/* Follow Button */}
                        <button type={'button'} onClick={(followHandle)} disabled={(isFollowing)} className={'w-full py-2 rounded-md flex justify-center items-center gap-2 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 active:scale-95 transition text-white cursor-pointer'}>
                            <UserPlus className={'w-4 h-4'} /> 
                            {((isFollowing) ? ('Following'):('Follow'))}
                        </button>

                        {/* Connect Request */}
                        <button type={'button'} onClick={(connectRequest)} className={'flex items-center justify-center w-16 border text-slate-500 group rounded-md cursor-pointer active:scale-95 transition'}>
                            {((isConnected) ? (<MessageCircle className={'w-5 h-5 group-hover:scale-105 transition'} />):(<Plus className={'w-5 h-5 group-hover:scale-105 transition'} />))}
                        </button>
                    </div>
                </div>
           </React.Fragment>)
}
