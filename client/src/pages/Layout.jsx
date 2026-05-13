import React, { useState } from 'react'
import { X, MenuIcon } from 'lucide-react'
import { Outlet } from 'react-router-dom'
import { dummyUserData } from '@assets/assets'
import { Sidebar } from '@components/Sidebar'
import { Loading } from '@components/Loading'

export const Layout = () => {

    const user = dummyUserData

    const [openSideBar, setOpenSidebar] = useState(false)

    return ((user) ? (<React.Fragment>
            <div className={'w-full flex h-screen'}>
                <Sidebar openSideBar={(openSideBar)} setOpenSidebar={(setOpenSidebar)}  />
                <div className={'flex-1 bg-slate-50'}>
                    <Outlet />
                </div>
                {(openSideBar ? (<X onClick={(() => setOpenSidebar(false))} className={'absolute top-3 right-3 p-2 z-100 bg-white rounded-md shadow w-10 h-10 text-gray-600 sm:hidden'} />):(<MenuIcon onClick={(() => setOpenSidebar(true))} className={'absolute top-3 right-3 p-2 z-100 bg-white rounded-md shadow w-10 h-10 text-gray-600 sm:hidden'} />))}
            </div>
          </React.Fragment>):(<Loading />)) 
}

