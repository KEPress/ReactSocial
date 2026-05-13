import { resolve, dirname } from 'path' 
import { fileURLToPath } from 'url'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: ({
      alias: ({
          '@': resolve(__dirname, ('src')),
          '@styles': resolve(__dirname, ('src/styles')),
          '@components': resolve(__dirname, ('src/components')),
          '@hooks': resolve(__dirname, ('src/hooks')),
          '@utils': resolve(__dirname, ('src/utils')),
          '@pages': resolve(__dirname, ('src/pages')),
          '@assets': resolve(__dirname, ('src/assets'))
      })
  })
})
