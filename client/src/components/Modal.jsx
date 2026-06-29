import React, { useRef, useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { X, ArrowLeft, Pencil, TextIcon, Upload, Sparkle, BadgeCheck } from 'lucide-react'
import { useAddStoryMutation, useGetUserQuery, useUpdateUserMutation } from '@store/api/api'
import { selectToken } from '@store/slices/authorize'
import toast from 'react-hot-toast'

export const StoryModal = ({ setShowModal = () => ({}) }) => {


    const [addStory] = useAddStoryMutation()

    const bgColors = ['#4f46e5', '#7c3aed', '#db2777', '#e11d48', '#ca8a04', '#0d9488']

    const [mode, setMode] = useState("text")

    const [text, setText] = useState(String)

    const [media, setMedia] = useState(null)

    const [preview, setPreview] = useState(null)

    const [backdrop, setBackdrop] = useState(bgColors[0])

    const handleMediaUpload = (event) => {
        const file = event.target.files?.[0]
        if (file) {
            setMedia(file)
            setPreview(URL.createObjectURL(file))
        } //end if
    }

    const handleCreateStory = async () => {
        const formData = new FormData()
        formData.append('content', text)
        formData.append('background_color', backdrop)
        formData.append('media_type', ((mode === ('media')) ? ((media?.type.startsWith('video')) ? ('video'):('image')):('text')))
        if (media) formData.append('media', media)
        await addStory(formData).unwrap()
        // RTK Query automatically refetches useGetStoriesQuery via invalidateTags: ['Story'] - no fetchStories function needed
        setShowModal(false)
    }   

    return (<React.Fragment>
                <div className={'fixed inset-0 z-110 min-h-screen bg-black/80 backdrop-blur text-white flex items-center justify-center p-4'}>
                    <div className={'w-full max-w-md'}>
                        <div className={'text-center mb-4 flex items-center justify-between'}>
                            <button onClick={(() => setShowModal(false))} className={'text-white p-2 cursor-pointer'}>
                                <ArrowLeft />
                            </button>
                            <h2 className={'text-lg font-semibold'}>Create Story</h2>
                            <span className={'w-10'}></span>
                        </div>
                        <div className={'rounded-lg h-96 flex items-center justify-center relative'} style={({ backgroundColor: backdrop })}>
                            {((mode === ('text')) && (<textarea value={(text)} onChange={((event) => (setText(event.target.value)))} className={'bg-transparent text-white w-full h-full p-6 text-lg resize-none focus:outline-none'} placeholder={("What's on your mind")} />))}
                            {((mode === ('media')) && (preview && (media?.type.startsWith('image') ? (<img src={(preview)} className={'object-contain max-h-full'} alt={''} />):(<video src={(preview)} className={'object-contain max-h-full'} />))))}
                        </div>
                        <div className={'flex mt-4 gap-2'}>
                            {(bgColors.map((color) => (<button key={(color)} onClick={(() => setBackdrop(color))} className={'w-6 h-6 rounded-full ring cursor-pointer'} style={({ backgroundColor: color })} />)))}
                        </div>
                        <div className={'flex gap-2 mt-4'}>
                            <button type={'button'} onClick={(() => { setMode('text'); setMedia(null); setPreview(null); } )} className={(`flex-1 flex items-center justify-center gap-2 p-2 rounded ${((mode === ('text')) ? ('bg-white text-black'):('bg-zinc-800'))}`)}>
                                <TextIcon size={18} /> Text
                            </button>
                            <label className={(`flex-1 flex items-center justify-center gap-2 p-2 rounded cursor-pointer ${((mode === ('media')) ? ('bg-white text-black'):('bg-zinc-800'))}`)}>
                                <input type={'file'} accept={('image/*, video/*')} onChange={((event) => { handleMediaUpload(event); setMode('media'); } )} className={'hidden'} />
                                <Upload size={18} /> Photo/Video
                            </label>
                        </div>
                        <button type={'submit'} onClick={(() => toast.promise(handleCreateStory(), { loading: ('Saving...'), success: (<p>Story Added</p>), error: ((error) => (<p>{error.message}</p>)) }))} className={'flex items-center justify-center gap-2 text-white py-3 mt-4 w-full rounded bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 active:scale-95 transition cursor-pointer'}>
                            <Sparkle size={18} /> Create a Story
                        </button>
                    </div>
                </div>
            </React.Fragment>)
}


export const ViewStory = ({ view = (null), setView = () => ({}) }) => {

    const progressRef = useRef(null)

    const handleClose = () => setView(null)

    const contentDisplay = () => {
        switch (view.media_type) {
            case ('image'): return (<img src={(view.media_url)} alt={''} className={'max-w-full max-h-screen object-contain'} />)
            case ('video'): return (<video src={(view.media_url)} onEnded={(() => setView(null))} controls autoPlay className={'max-h-screen'} />)              
            case ('text'): return (<div className={'w-full h-full flex items-center justify-center p-8 text-white text-2x1 text-center'}>{(view.content)}</div>)
            default: return (null);
        } //end switch
    }

    useEffect(() => {
        let timer, interval
        if (view && (view.media_type !== ('video'))) {
            const duration = 10000
            const tick = 100
            let elapsed = 0

            // Reset progress bar directly via DOM ref - no useState needed
            if (progressRef.current) progressRef.current.style.width = ('0%')

            interval = setInterval(() => {
                elapsed += tick
                const percent = (elapsed / duration) * 100
                // Update DOM directly - bypasses state entirely
                if (progressRef.current) progressRef.current.style.width = (`${percent}%`)
                if (elapsed >= (duration)) clearInterval(interval)
            }, tick)

            timer = setTimeout(() => setView(), duration)
        } //end if

        return (() => {
            clearTimeout(timer)
            clearInterval(interval)
        })
    }, [view, setView])

    if (!view) return (null)

    return (<React.Fragment>
                <div className={'fixed inset-0 h-screen bg-black bg-opacity-90 z-110 flex items-center justify-center'} style={({ backgroundColor: (view.media_type === ('text')) ? (view.background_color):('#000000') })}>
                    {/* Progress Bar */}
                    <div className={'absolute top-0 left-0 w-full h-1 bg-gray-700'}>
                        <div ref={(progressRef)} className={'h-full bg-white transition-all duration-100 linear'} style={({ width: ('0%') })}></div>
                    </div>
                    {/* User Info - Top Left */}
                    <div className={'absolute top-4 left-4 flex items-center space-x-3 p-2 px-4 sm:p-4 sm:px-8 backdrop-blur-2xl rounded bg-black/50'}>
                        <img src={(view.user?.profile_picture)} className={'sm:size-8 rounded-full object-cover border border-white'} alt={''} />
                        <div className={'text-white font-medium flex items-center gap-1.5'}>
                            <span>{(view.user?.full_name)}</span>
                            <BadgeCheck size={18} />
                        </div>
                    </div>
                    {/* Close off */}
                    <button type={'submit'} onClick={(handleClose)} className={'absolute top-4 right-4 text-white text-3xl font-bold focus:outline-none'}>
                        <X className={'w-8 h-8 hover:scale-110 transition cursor-pointer'} />
                    </button>
                    {/* Story Content Wrapper */}
                    <div className={'max-w-[90vw] max-h-[90vh] flex items-center justify-center'}>{(contentDisplay())}</div>
                </div>
            </React.Fragment>)

}



export const ProfileModal = ({ setEdit = () => ({}) }) => {

    const token = useSelector(selectToken)

    const [updateUser] = useUpdateUserMutation()

    const { data } = useGetUserQuery(undefined, { skip: !token })

    const user = data?.user

    const [editForm, setEditForm] = useState({
        username: (user?.username || (new String())),
        full_name: (user?.full_name || (new String())),
        bio: (user?.bio || (new String())),
        location: (user?.location || (new String())),
        profile_picture: null,
        cover_photo: null
    })

    const updateProfile = async (event) => {
        event.preventDefault()
        
        const formData = new FormData()
        formData.append('username', editForm.username)
        formData.append('full_name', editForm.full_name)
        formData.append('bio', editForm.bio)
        formData.append('location', editForm.location)
        // Only append files if user selected new ones
        if (editForm.profile_picture) formData.append('profile', editForm.profile_picture)
        if (editForm.cover_photo) formData.append('cover', editForm.cover_photo)
        await updateUser(formData).unwrap()
        // invalidatesTags: ['User'] auto-refetches useGetUserQuery
        setEdit(false)
    }

    return (<React.Fragment>
              <div className={'fixed top-0 bottom-0 left-0 right-0 z-110 h-screen overflow-y-scroll bg-black/50'}>
                <div className={'max-w-2xl sm:py-6 mx-auto'}>
                    <div className={'bg-white rounded-lg shadow p-6'}>
                        <h1 className={'text-2xl font-bold text-gray-900 mb-6'}>Edit Profile</h1>
                        <form onSubmit={(updateProfile)} className={'space-y-4'}>
                            {/* Profile Picture */}
                            <div className={'flex flex-col items-start gap-3'}>
                                <label htmlFor={'profile_picture'} className={'block text-sm font-medium text-gray-700 mb-1'}>
                                    Profile Picture
                                    <input type={'file'} id={'profile_picture'} accept={'image/*'} onChange={((event) => (setEditForm({...editForm, profile_picture: event.target.files[0] })))} className={'w-full p-3 border border-gray-200 rounded-lg'} hidden />
                                    <div className={'group/profile relative'}>
                                        <img src={((editForm.profile_picture) ? (URL.createObjectURL(editForm.profile_picture)):(user.profile_picture))} alt={''} className={'w-24 h-24 rounded-full object-cover mt-2'} />
                                        <div className={'absolute hidden group-hover/profile:flex top-0 left-0 right-0 bottom-0 bg-black/20 rounded-full items-center justify-center'}>
                                            <Pencil className={'w-5 h-5 text-white'} />
                                        </div>
                                    </div>
                                </label>
                            </div>
                            {/* Cover Photo */}
                            <div className={'flex flex-col items-start gap-3'}>
                                <label htmlFor={'cover_photo'} className={'block text-sm font-medium text-gray-700 mb-1'}>
                                    Cover Photo
                                    <input type={'file'} id={'cover_photo'} accept={'image/*'} onChange={((event) => (setEditForm({...editForm, cover_photo: event.target.files[0] })))} className={'w-full p-3 border border-gray-200 rounded-lg'} hidden />
                                    <div className={'group/cover relative'}>
                                        <img src={((editForm.cover_photo) ? (URL.createObjectURL(editForm.cover_photo)):(user.cover_photo))} alt={''} className={'w-80 h-40 rounded-lg bg-gradient-to-r from-indigo-200 via-purple-200 to-pink-200 object-cover mt-2'} />
                                        <div className={'absolute hidden group-hover/cover:flex top-0 left-0 right-0 bottom-0 bg-black/20 rounded-lg items-center justify-center'}>
                                            <Pencil className={'w-5 h-5 text-white'} />
                                        </div>
                                    </div>
                                </label>
                            </div>

                            <div>
                                <label className={'block text-sm font-medium text-gray-700 mb-1'}>Name</label>
                                <input type={'text'} value={(editForm.full_name)} onChange={((event) => (setEditForm({...editForm, full_name: event.target.value })))} placeholder={'Please enter full name'} className={'w-full p-3 border border-gray-200 rounded-lg'} />
                            </div>

                            <div>
                                <label className={'block text-sm font-medium text-gray-700 mb-1'}>Username</label>
                                <input type={'text'} value={(editForm.username)} onChange={((event) => (setEditForm({...editForm, username: event.target.value })))} placeholder={'Please enter a username'} className={'w-full p-3 border border-gray-200 rounded-lg'} />
                            </div>

                            <div>
                                <label className={'block text-sm font-medium text-gray-700 mb-1'}>Bio</label>
                                <textarea rows={3} value={(editForm.bio)} onChange={((event) => (setEditForm({...editForm, bio: event.target.value })))} placeholder={'Please enter bio'} className={'w-full p-3 border border-gray-200 rounded-lg'} />
                            </div>

                            <div>
                                <label className={'block text-sm font-medium text-gray-700 mb-1'}>Location</label>
                                <input type={'text'} value={(editForm.location)} onChange={((event) => (setEditForm({...editForm, location: event.target.value })))} placeholder={'Please enter your location'} className={'w-full p-3 border border-gray-200 rounded-lg'} />
                            </div>

                            <div className={'flex justify-end space-x-3 pt-6'}>
                                <button type={'button'} onClick={(() => (setEdit(false)))} className={'px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors'}>Cancel</button>
                                <button type={'submit'} className={'px-4 py-2 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-lg hover:from-indigo-600 hover:to-purple-700 transition cursor-pointer'}>Save Changes</button>
                            </div>
                        </form>
                    </div>
                </div>
              </div>
           </React.Fragment>)
}