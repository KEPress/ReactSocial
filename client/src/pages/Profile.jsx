import React, { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { selectToken } from '@store/slices/authorize'
import { useGetUserQuery, useGetUserProfileMutation } from '@store/api/api'
import { Loading } from '@components/Loading'
import { UserInfo } from '@components/UserInfo'
import { Post } from '@components/Post'
import { ProfileModal } from '@components/Modal'
import moment from 'moment';

export const Profile = () => {

   const { userId } = useParams()

   const [active, setActive] = useState('posts')

   const [edit, setEdit] = useState(false)

   const token = useSelector(selectToken)

   // Own profile data — used when no userId param (viewing own profile)
   const { data: userData, isLoading: userLoading } = useGetUserQuery(undefined, { skip: (!token || (!!userId)) })
    
   // Other user's profile data — used when userId param is present (viewing another user's profile)
   const [getUserProfile, { data: profileData, isLoading: profileLoading }] = useGetUserProfileMutation()

   useEffect(() => {
      if (userId && (token)) getUserProfile({ token, profileId: userId })
   }, [userId, token, getUserProfile])

   const isLoading = (userId ? (profileLoading) : (userLoading))
   const user = (userId ? (profileData?.profile) : (userData?.user))
   const posts = (userId ? (profileData?.posts || (Array())) : (userData?.posts || (Array())))
   
   return ((!user || (isLoading)) ? (<Loading />):(<React.Fragment>
                     <div className={'relative h-full overflow-y-scroll bg-gray-50 p-6'}>
                        <div className={'max-w-3xl mx-auto'}>
                           {/* Profile Card */}
                           <div className={'bg-white rounded-2xl shadow overflow-hidden'}>
                              {/* Cover Photo */}
                              <div className={'h-40 md:h-56 bg-gradient-to-r from-indigo-200 via-purple-200 to-pink-200'}>
                                 {(user.cover_photo && (<img src={(user.cover_photo)} alt={''} className={'w-full h-full object-cover'} />))}
                              </div>    
                              {/* User Info */}
                              <UserInfo user={(user)} posts={(posts)} userId={(userId)} setEdit={(setEdit)} />  
                           </div>
                           {/* Tabs */}
                           <div className={'mt-6'}>
                              <div className={'bg-white rounded-xl shadow p-1 flex max-w-md mx-auto'}>
                                 {['posts', 'media', 'likes'].map((tab) => 
                                    (<button type={'button'} key={(tab)} onClick={(() => setActive(tab))} className={(`flex-1 px-4 py-2 text-sm font-medium rounded-lg transition-colors cursor-pointer ${((active === (tab)) ? ('bg-indigo-600 text-white'):('text-gray-600 hover:text-gray-900'))}`)}>
                                       {(tab.charAt(0).toUpperCase() + tab.slice(1))}
                                    </button>))}
                              </div>
                              {/* Posts */}
                              {((active === ('posts')) && (<div className={'mt-6 flex flex-col items-center gap-6'}>{(posts.map((post) => <Post key={(post._id)} post={(post)} />))}</div>))}
                              {/* Media */}
                              {((active === ('media')) && 
                                 (<div className={'flex flex-wrap mt-6 max-w-6xl'}>
                                    {(posts.filter((post) => 
                                       (post.image_urls.length > (0))).map((post) => 
                                          (<React.Fragment>
                                             {(post.image_urls.map((image, index) =>
                                                 (<Link target={'_blank'} to={(image)} key={(index)} className={'relative group'}><img src={(image)} key={(index)} alt={''} className={'w-64 aspect-video object-cover'} /><p className={'absolute bottom-0 right-0 text-xs p-1 px-3 backdrop-blur-xl text-white opactity-0 group-hover:opacity-100 transition duration-300'}>Posted {(moment(post.createdAt).fromNow())}</p></Link>)))}
                                          </React.Fragment>)))}
                                 </div>))}
                           </div>
                        </div>
                       
                        {(edit && (<ProfileModal setEdit={(setEdit)} />))}
                     </div>
                  </React.Fragment>)) 
}
