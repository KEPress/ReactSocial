import React from 'react'
import { CirclePlus, LogOut } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { useClerk, UserButton } from '@clerk/react'
import { assets } from '@assets/assets'
import { MenuItems } from '@components/MenuItems'
import { useGetUserQuery } from '@store/api/api'
import { selectSidebarOpen, setSidebarOpen } from '@store/slices/interface'

export const Sidebar = () => {

  const { signOut } = useClerk()

  const { data } = useGetUserQuery()

  const user = data?.user

  const openSidebar = useSelector(selectSidebarOpen)

  const navigate = useNavigate(), dispatch = useDispatch()
  
  return (<React.Fragment>
            <div className={(`w-60 xl:w-72 bg-white border-r border-gray-200 flex flex-col justify-between items-start max-sm:absolute top-0 bottom-0 max-sm:z-40 transition-all duration-300 ease-in-out ${((openSidebar) ? ('translate-x-0'):('max-sm:-translate-x-full'))}`)}>
              <div className={'w-full'}>
                 <img onClick={(() => navigate('/'))} src={(assets.logo)} className={'w-8 h-8 ml-7 my-2 cursor-pointer'} alt={''} />
                <hr className={'border-gray-300 mb-8'} />
                <MenuItems setOpenSidebar={((value) => (dispatch(setSidebarOpen(value))))} />
                <Link to={('/create')} className={'flex items-center justify-center gap-2 py-2.5 mt-6 mx-6 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-700 hover:to-purple-800 active:scale-95 transition text-white cursor-pointer'}>
                  <CirclePlus className={'w-5 h-5'} />
                   Create Post
                </Link>
              </div>
              <div className={'w-full border-t border-gray-200 p-4 px-7 flex items-center justify-between'}>
                <div className={'flex gap-2 items-center cursor-pointer'}>
                  <UserButton />
                  <div>
                    <h1 className={'text-sm font-medium'}>{user?.full_name}</h1>
                    <p className={'text-xs text-gray-500'}>@{user?.username}</p>
                  </div>
                </div>
                <LogOut onClick={(signOut)} className={'w-4.5 text-gray-400 hover:text-gray-700 transition cursor-pointer'} />
              </div>
            </div>
          </React.Fragment>)
}
