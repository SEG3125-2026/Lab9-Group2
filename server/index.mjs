import { createSpotShareApi } from './app.mjs'

const app = createSpotShareApi()
const PORT = Number(process.env.PORT) || 3001

const server = app.listen(PORT, () => {
  console.log(`SpotShare API listening on http://localhost:${PORT}`)
})

server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error(
      `Port ${PORT} is already in use. Stop the other process (e.g. kill $(lsof -ti tcp:${PORT})) or run with PORT=3002.`
    )
    process.exit(1)
  }
  throw err
})
