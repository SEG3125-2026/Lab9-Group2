import cors from 'cors'
import express from 'express'
import { openDatabase } from '../db/initDb.mjs'

/**
 * Express app for `/api/*`. Used by Vite dev middleware (same port as the UI)
 * and by `server/index.mjs` when running the API alone.
 */
export function createSpotShareApi() {
  const app = express()
  const db = openDatabase()

  app.use(cors())
  app.use(express.json())

  const router = express.Router()

  router.get('/health', (_req, res) => {
    res.json({ ok: true })
  })

  router.get('/db/summary', (_req, res) => {
    const tables = [
      'users',
      'parking_listings',
      'availability',
      'bookings',
      'payments',
      'messages',
      'saved_listings',
      'reviews',
    ]
    const counts = {}
    for (const t of tables) {
      const row = db.prepare(`SELECT COUNT(*) AS n FROM ${t}`).get()
      counts[t] = row.n
    }
    res.json({ counts })
  })

  router.get('/listings', (_req, res) => {
    const rows = db
      .prepare(
        `SELECT listing_id, host_id, title, description, address, city, postal_code,
                price_per_hour, walking_distance_min, rules, photo_url, status, created_at
         FROM parking_listings
         ORDER BY created_at DESC`
      )
      .all()
    res.json(rows)
  })

  app.use('/api', router)
  return app
}
