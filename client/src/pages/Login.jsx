import React from 'react'
import { BsStar } from 'react-icons/bs'
import { SignIn } from '@clerk/react'
import { assets } from '@/assets/assets'

export const Login = () => {
  
    return (<React.Fragment>
                <div className={'min-h-screen flex flex-col md:flex-row'}>
                    {/* Background image */}
                    <img src={(assets.backdrop)} alt={'backdrop'} className={'absolute top-0 left-0 -z-1 w-full h-full object-cover'} />
                    {/* Left panel */}
                    <div className={'flex-1 flex flex-col items-start justify-between p-6 md:p-10 lg:pl-40'}>
                        <img src={(assets.logo)} alt={'logo'} className={'h-12 object-contain'} />
                        <div>
                            <div className={'flex items-center gap-3 mb-4 max-md:mt-10'}>
                                <img src={assets.group} alt={'group-photo'} className={'h-8 md:h-10'} />
                                <div>
                                    <div className={'flex'}>
                                        {(Array(5).fill(0).map((_, index) => (<BsStar key={(index)} className={'size-4 md:size-4.5 text-transparent fill-amber-500'} />)))}
                                    </div>
                                    <p> Used by over 12,000 people</p>
                                </div>
                            </div>
                            <h1 className={'text-3xl md:text-6xl md:pb-2 font-bold bg-gradient-to-r from-indigo-950 to-indigo-800 bg-clip-text text-transparent'}>More than just friends truly connect</h1>
                            <p className={'text-xl md:text-3xl text-indigo-900 max-w-72 md:max-w-md'}>connect to a global community online</p>
                        </div>
                        <span className={'md:h-10'}></span>
                    </div>
                    {/* Right Side Login Form */}
                    <div className={'flex-1 flex items-center justify-center p-6 sm:p-10'}>
                        <SignIn />
                    </div>
                </div>
           </React.Fragment>)

}

