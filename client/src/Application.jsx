import React from 'react'
import { Toaster } from 'react-hot-toast'
import { Routes, Route } from 'react-router-dom'
import { useUser } from '@clerk/react'
import { Layout } from '@pages/Layout'
import { Login } from '@pages/Login'
import { Feed } from '@pages/Feed'
import { Messages } from '@pages/Messages'
import { ChatBox } from '@pages/ChatBox'
import { Links } from '@pages/Links'
import { Connect } from '@pages/Connect'
import { Profile } from '@pages/Profile'
import { CreatePost } from '@pages/CreatePost'


export const Application = () => {

  const { user } = useUser()

  return (<React.Fragment>
            <Toaster />
            <Routes>
              <Route path={('/')} element={((!user) ? (<Login />):(<Layout />))}>
                <Route index element={(<Feed />)} />
                <Route path={('messages')} element={(<Messages />)} />
                <Route path={('messages/:userId')} element={(<ChatBox />)} />
                <Route path={('links')} element={(<Links />)} />
                <Route path={('connect')} element={(<Connect />)} />
                <Route path={('profile')} element={(<Profile />)} />
                <Route path={('profile/:profileId')} element={(<Profile />)} />
                <Route path={('create')} element={(<CreatePost />)} />
              </Route>
            </Routes>
         </React.Fragment>)
}