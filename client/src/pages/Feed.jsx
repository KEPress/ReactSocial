import React, { useState, useEffect } from 'react'
import { Loading } from '@components/Loading'
import { Stories } from '@components/Stories'
import { Post } from '@components/Post'
import { assets, dummyPostsData } from '@assets/assets'
import { RecentMessages } from '@components/Messages'


export const Feed = () => {

  const [feeds, setFeeds] = useState(Array)

  const [loading, setLoading] = useState(true)

  const fetchFeeds = async () => {
    setFeeds(dummyPostsData)
    setLoading(false)
  }

  useEffect(() => {
    fetchFeeds()
  }, [])

  return ((!loading) ? 
    (<React.Fragment>
        <div className={'h-full overflow-y-scroll no-scrollbar py-10 xl:pr-5 flex items-start justify-center xl:gap-8'}>
          {/* Stories & Post List */}
          <div>
            <Stories />
            <div className='p-4 space-y-6'>
              {(feeds.map((feed) => (<Post key={(feed._id)} post={(feed)} />)))}
            </div>
          </div>
          {/* Right Sidebar */}
          <div className={'max-xl:hidden sticky top-0'}>
            <div className={'max-w-xs bg-white text-xs p-4 rounded-md inline-flex flex-col gap-2 shadow'}>
               <h3 className={'text-slate-800 font-semibold'}>Sponsored</h3>
               <img src={(assets.sponsored)} alt={''} className={'w-75 h-50 rounded-md'} />
               <p className={'text-slate-600'}>Email Marketing</p>
               <p className={'text-slate-400'}>Supercharge your marketing with a powerful, easy-to-use platform built for results</p>
            </div>
            <RecentMessages />
          </div>
         
        </div>
    </React.Fragment>):(<Loading />))
}
