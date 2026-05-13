import { BrowserRouter } from 'react-router-dom'
import { createRoot } from 'react-dom/client'
import { ClerkProvider } from '@clerk/react'
import { Application } from '@/Application'
import '@styles/tailwind.css'
import '@/main.scss'
import '@fontsource/poppins'
import '@fontsource-variable/outfit'
import '@fontsource-variable/comfortaa'
import '@fontsource-variable/montserrat'

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY

if (!PUBLISHABLE_KEY) throw new Error('Missing Publishable key')

createRoot(document.getElementById('root'))
.render(<ClerkProvider publishableKey={(PUBLISHABLE_KEY)}>
            <BrowserRouter>
               <Application />
            </BrowserRouter>
          </ClerkProvider>)