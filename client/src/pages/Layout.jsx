import React from 'react'
import { X, MenuIcon } from 'lucide-react'
import { Outlet } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { Sidebar } from '@components/Sidebar'
import { Loading } from '@components/Loading'
import { useGetUserQuery } from '@store/api/api'
import { toggleSidebar, selectSidebarOpen } from '@store/slices/interface'

export const Layout = () => {


    const dispatch = useDispatch()

    const openSidebar = useSelector(selectSidebarOpen)

    const { isLoading } = useGetUserQuery()
   
    if (isLoading) return (<Loading />)

    return (<React.Fragment>
            <div className={'w-full flex h-screen'}>
                <Sidebar openSideBar={(openSidebar)}  />
                <div className={'flex-1 bg-slate-50'}>
                    <Outlet />
                </div>
                {(openSidebar ? (<X onClick={(() => (dispatch(toggleSidebar())))} className={'absolute top-3 right-3 p-2 z-100 bg-white rounded-md shadow w-10 h-10 text-gray-600 sm:hidden'} />):(<MenuIcon onClick={(() => (dispatch(toggleSidebar())))} className={'absolute top-3 right-3 p-2 z-100 bg-white rounded-md shadow w-10 h-10 text-gray-600 sm:hidden'} />))}
            </div>
          </React.Fragment>)
}

