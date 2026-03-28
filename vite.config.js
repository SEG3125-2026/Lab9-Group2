import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { createSpotShareApi } from './server/app.mjs'

export default defineConfig({
  plugins: [
    react(),
    {
      name: 'spotshare-api',
      configureServer(server) {
        const api = createSpotShareApi()
        server.middlewares.use((req, res, next) => {
          if (req.url.startsWith('/api')) {
            api(req, res, next)
          } else {
            next()
          }
        })
      },
    },
  ],
})
