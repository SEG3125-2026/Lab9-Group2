import net from 'node:net'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { createSpotShareApi } from './app.mjs'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const portFile = path.join(__dirname, '..', '.spotshare-api-port')

try {
  fs.unlinkSync(portFile)
} catch {
  /* no stale file */
}

function resolvePreferredPort() {
  const fromEnv = Number(process.env.PORT)
  if (Number.isFinite(fromEnv) && fromEnv > 0) return fromEnv
  for (const arg of process.argv.slice(2)) {
    if (arg.startsWith('PORT=')) {
      const n = Number(arg.slice('PORT='.length))
      if (Number.isFinite(n) && n > 0) return n
      continue
    }
    const n = Number(arg)
    if (Number.isFinite(n) && n > 0) return n
  }
  return 3001
}

/** Try preferred, then preferred+1, … until a TCP port can be bound. */
function findFirstAvailablePort(fromPort, span = 10) {
  return new Promise((resolve, reject) => {
    let i = 0
    const tryNext = (port) => {
      if (i >= span) {
        reject(new Error(`No free port in range ${fromPort}–${fromPort + span - 1}`))
        return
      }
      i++
      const s = net.createServer()
      s.once('error', (e) => {
        if (e.code === 'EADDRINUSE') tryNext(port + 1)
        else reject(e)
      })
      s.once('listening', () => {
        s.close(() => resolve(port))
      })
      s.listen(port, '127.0.0.1')
    }
    tryNext(fromPort)
  })
}

function clearPortFile() {
  try {
    fs.unlinkSync(portFile)
  } catch {
    /* ignore */
  }
}

for (const ev of ['SIGINT', 'SIGTERM']) {
  process.on(ev, () => {
    clearPortFile()
    process.exit(0)
  })
}

const preferred = resolvePreferredPort()

let port
try {
  port = await findFirstAvailablePort(preferred, 10)
} catch (err) {
  console.error(err.message)
  process.exit(1)
}

if (port !== preferred) {
  console.warn(`[api] Port ${preferred} is in use; using ${port} instead`)
}

fs.writeFileSync(portFile, String(port))

const app = createSpotShareApi()
const server = app.listen(port, '127.0.0.1', () => {
  console.log(`SpotShare API listening on http://127.0.0.1:${port}`)
})

server.on('error', (err) => {
  clearPortFile()
  console.error(err)
  process.exit(1)
})
