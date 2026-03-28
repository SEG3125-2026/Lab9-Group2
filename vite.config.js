import fs from 'node:fs'
import http from 'node:http'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const portFile = path.join(__dirname, '.spotshare-api-port')

function readApiPort() {
  try {
    const raw = fs.readFileSync(portFile, 'utf8').trim().replace(/^\uFEFF/, '')
    if (/^\d+$/.test(raw)) return raw
  } catch {
    /* no file — e.g. API not started yet */
  }
  return '3001'
}

/** Forwards /api to the Express app; re-reads the port file on every request (avoids stale proxy target). */
function spotshareApiProxy() {
  const handler = (req, res, next) => {
    const url = req.url || ''
    if (!url.startsWith('/api')) return next()
    const port = readApiPort()
    const headers = { ...req.headers, host: `127.0.0.1:${port}` }
    delete headers.connection
    delete headers['proxy-connection']
    const proxyReq = http.request(
      {
        hostname: '127.0.0.1',
        port,
        path: url,
        method: req.method,
        headers,
      },
      (proxyRes) => {
        res.statusCode = proxyRes.statusCode || 502
        for (const [k, v] of Object.entries(proxyRes.headers)) {
          if (v === undefined) continue
          if (Array.isArray(v)) res.setHeader(k, v)
          else res.setHeader(k, v)
        }
        proxyRes.pipe(res)
      }
    )
    proxyReq.on('error', (err) => {
      if (!res.headersSent) {
        res.statusCode = 502
        res.setHeader('Content-Type', 'application/json; charset=utf-8')
        res.end(
          JSON.stringify({
            error: `API unreachable (${err.code || err.message}). From spotshare/, run npm run dev (starts API + Vite).`,
          })
        )
      }
    })
    req.pipe(proxyReq)
  }
  return {
    name: 'spotshare-api-proxy',
    enforce: 'pre',
    configureServer(server) {
      server.middlewares.use(handler)
    },
    configurePreviewServer(server) {
      server.middlewares.use(handler)
    },
  }
}

export default defineConfig({
  plugins: [spotshareApiProxy(), react()],
  server: {
    // Port 5173 is often taken by another Vite app — use the URL Vite prints (e.g. http://localhost:5174/).
    strictPort: false,
  },
  preview: {
    strictPort: false,
  },
})
