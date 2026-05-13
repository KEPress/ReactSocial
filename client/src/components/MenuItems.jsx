import React from 'react'
import { NavLink } from 'react-router-dom'
import { menuItemsData } from '@assets/assets'

export const MenuItems = ({ setOpenSidebar = () => ({}) }) => {
  return (<React.Fragment>
            <div className={'px-6 text-gray-600 space-y-1 font-medium'}>
                { menuItemsData.map(({ to, label, Icon }) => 
                    (<NavLink key={(to)} to={(to)} end={(to === ('/'))} onClick={(() => setOpenSidebar(false))} className={(({ isActive }) => (`px-3.5 py-2 flex items-center gap-3 rounded-xl ${((isActive) ? ('bg-indigo-50 text-indigo-700'):('hover:bg-gray-100 hover:text-gray-900'))}`))}>
                        <Icon className={'w-5 h-5'} />
                        { label }
                    </NavLink>)) 
                }
            </div>
         </React.Fragment>)
}
