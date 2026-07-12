import React, { useRef, useMemo, useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { ImageIcon, SendHorizonal } from 'lucide-react'
import { selectToken, selectUserId } from '@store/slices/authorize'
import { useGetMessagesQuery, useSendMessageMutation, useGetUserProfileMutation } from '@store/api/api'
import { Loading } from '@components/Loading'
import toast from 'react-hot-toast'

export const ChatBox = () => {

    const messageRefer = useRef(null)

    const { userId: to_user_id } = useParams()

    const token = useSelector(selectToken)

    const currentUserId = useSelector(selectUserId)

    const { data: messageData, isLoading: messageLoading } = useGetMessagesQuery(to_user_id, { skip: (!token || (!to_user_id)) }) 

    const [getUserProfile, { data: profileData }] = useGetUserProfileMutation()
  
    const [sendMessage] = useSendMessageMutation()

    const [text, setText] = useState(String)

    const [image, setImage] = useState(null)

    const chatUser = (profileData?.profile)

    const messages = useMemo(() => messageData?.messages || new Array(), [messageData])

    useEffect(() => {
      if (to_user_id && (token)) getUserProfile(to_user_id).unwrap().catch((error) => (console.error(error)))
    }, [to_user_id, token, getUserProfile])
    
    // Auto scroll to latest message
    useEffect(() => {
       messageRefer.current?.scrollIntoView({ behavior: 'smooth' })
    }, [messages])

    const transmitMessage = async () => {
      if (!text.trim() && (!image)) return
      const formData = new FormData()
      formData.append('to_user_id', to_user_id)
      formData.append('text', text)
      if (image) formData.append('image', image)
      await toast.promise(sendMessage(formData).unwrap(), ({
          loading: 'Sending message...',
          success: 'Message sent successfully!',
          error: (error) => (error.message)
      }))
      setText(String)
      setImage(null)
    }

    if (messageLoading) return (<Loading />)

    return ((chatUser) && (<React.Fragment>
                        <div className={'flex flex-col h-screen'}>
                          <div className={'flex items-center gap-2 p-2 md:px-10 xl:pl-42 bg-gradient-to-r from-indigo-50 to-purple-50 border-b border-gray-300'}>
                            <img src={(chatUser.profile_picture)} alt={''} className={'size-8 rounded-full'} />
                            <div className={''}>
                              <p className={'font-medium'}>{(chatUser.full_name)}</p>
                              <p className={'text-sm text-gray-500 -mt-1.5'}>@{(chatUser.username)}</p>
                            </div>
                          </div>
                          <div className={'p-5 md:px-10 h-full overflow-y-scroll'}>
                            <div className={'space-y-4 max-w-4xl mx-auto'}>
                              {(messages.toSorted((a, b) => 
                                  (new Date(a.createdAt) - new Date(b.createdAt))).map((message, index) =>
                                     (<div key={(index)} className={(`flex flex-col ${((message.to_user_id !== (currentUserId)) ? ('items-start'):('items-end'))}`)}>
                                        <div className={(`p-2 text-sm max-w-sm bg-white text-slate-700 rounded-lg shadow ${((message.to_user_id !== (currentUserId)) ? ('rounded-bl-none'):('rounded-br-none'))}`)}>
                                          {((message.message_type === ('image')) && (<img src={(message.media_url)} alt={''} className={'w-full max-x-sm rounded-lg mb-1'} />))}
                                          <p>{(message.text)}</p>
                                        </div>
                                     </div>)))}
                              <div ref={(messageRefer)} />
                            </div>
                          </div>
                          <div className={'px-4'}>
                            <div className={'flex items-center gap-3 pl-5 p-1.5 bg-white w-full max-w-xl mx-auto border border-gray-200 shadow rounded-full mb-5'}>
                              <input type={'text'} value={(text)} onKeyDown={((event) => ((event.key === ('Enter')) && (transmitMessage())))} onChange={((event) => (setText(event.target.value)))} className={'flex-1 outline-none text-slate-700'} placeholder={'Type a message...'} />
                              <label htmlFor={'image'}>
                                {(image ? (<img src={(URL.createObjectURL(image))} alt={''} className={'h-8 rounded'} />):(<ImageIcon className={'size-7 text-gray-400 cursor-pointer'} />))}
                                <input type={'file'} id={'image'} accept={'image/*'} onChange={((event) => (setImage(event.target.files[0])))} hidden />
                              </label>
                              <button type={'submit'} onClick={(transmitMessage)} className={'bg-gradient-to-br from-indigo-500 to-purple-600 hover:from-indigo-700 hover:to-purple-800 active:scale-95 cursor-pointer text-white p-2 rounded-full'}>
                                <SendHorizonal size={18} />
                              </button>
                            </div>
                          </div>
                        </div>
                      </React.Fragment>))
}

