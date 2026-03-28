import cors from 'cors'
import express from 'express'
import { openDatabase } from '../db/initDb.mjs'
import { hashPassword, verifyPassword } from './password.mjs'

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

  const listingWithHostSql = `
    SELECT pl.listing_id, pl.host_id, pl.title, pl.description, pl.address, pl.city, pl.postal_code,
           pl.price_per_hour, pl.walking_distance_min, pl.rules, pl.photo_url, pl.status, pl.created_at,
           u.first_name AS host_first_name, u.last_name AS host_last_name
    FROM parking_listings pl
    LEFT JOIN users u ON u.user_id = pl.host_id
  `

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
    const rows = db.prepare(`${listingWithHostSql} ORDER BY pl.created_at DESC`).all()
    res.json(rows)
  })

  router.get('/listings/host/:hostId', (req, res) => {
    const hostId = Number(req.params.hostId)
    if (!Number.isFinite(hostId) || hostId < 1) {
      return res.status(400).json({ error: 'Invalid host id.' })
    }
    try {
      const exists = db.prepare('SELECT user_id FROM users WHERE user_id = ?').get(hostId)
      if (!exists) return res.status(404).json({ error: 'User not found.' })
      const rows = db
        .prepare(`${listingWithHostSql} WHERE pl.host_id = ? ORDER BY pl.created_at DESC`)
        .all(hostId)
      res.json(rows)
    } catch (e) {
      console.error(e)
      res.status(500).json({ error: 'Could not load listings.' })
    }
  })

  router.get('/listings/:listingId', (req, res) => {
    const id = Number(req.params.listingId)
    if (!Number.isFinite(id) || id < 1) {
      return res.status(400).json({ error: 'Invalid listing id.' })
    }
    try {
      const row = db.prepare(`${listingWithHostSql} WHERE pl.listing_id = ?`).get(id)
      if (!row) return res.status(404).json({ error: 'Listing not found.' })
      res.json(row)
    } catch (e) {
      console.error(e)
      res.status(500).json({ error: 'Could not load listing.' })
    }
  })

  router.post('/listings', (req, res) => {
    const {
      hostId,
      title,
      description,
      address,
      city,
      postal_code,
      price_per_hour,
      walking_distance_min,
      rules,
    } = req.body || {}
    let hid = null
    if (hostId !== undefined && hostId !== null && String(hostId).trim() !== '') {
      const n = Number(hostId)
      if (!Number.isFinite(n) || n < 1) {
        return res.status(400).json({ error: 'Invalid hostId.' })
      }
      const user = db.prepare('SELECT user_id FROM users WHERE user_id = ?').get(n)
      if (!user) return res.status(404).json({ error: 'User not found.' })
      hid = n
    }
    if (!title?.trim() || !address?.trim() || !city?.trim() || !postal_code?.trim()) {
      return res.status(400).json({ error: 'Title, address, city, and postal code are required.' })
    }
    const price = Number(price_per_hour)
    if (!Number.isFinite(price) || price < 0) {
      return res.status(400).json({ error: 'Valid price per hour is required.' })
    }
    let walk = null
    if (walking_distance_min !== undefined && walking_distance_min !== '' && walking_distance_min != null) {
      const w = Number(walking_distance_min)
      if (Number.isFinite(w) && w >= 0) walk = Math.round(w)
    }
    try {
      const r = db
        .prepare(
          `INSERT INTO parking_listings (
            host_id, title, description, address, city, postal_code,
            price_per_hour, walking_distance_min, rules, photo_url, status
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, NULL, 'active')`
        )
        .run(
          hid,
          title.trim(),
          (description && String(description).trim()) || null,
          address.trim(),
          city.trim(),
          postal_code.trim(),
          price,
          walk,
          (rules && String(rules).trim()) || null
        )
      const listing_id = Number(r.lastInsertRowid)
      const row = db.prepare(`${listingWithHostSql} WHERE pl.listing_id = ?`).get(listing_id)
      res.status(201).json({ listing: row })
    } catch (e) {
      console.error(e)
      res.status(500).json({ error: 'Could not create listing.' })
    }
  })

  router.post('/bookings', (req, res) => {
    const {
      studentId,
      listingId,
      bookingDate,
      startTime,
      endTime,
      totalPrice,
      bookingStatus,
    } = req.body || {}
    const sid = Number(studentId)
    const lid = Number(listingId)
    if (!Number.isFinite(sid) || sid < 1) {
      return res.status(400).json({ error: 'studentId is required.' })
    }
    if (!Number.isFinite(lid) || lid < 1) {
      return res.status(400).json({ error: 'listingId is required.' })
    }
    const price = Number(totalPrice)
    if (!Number.isFinite(price) || price < 0) {
      return res.status(400).json({ error: 'totalPrice is required.' })
    }
    const dateStr = bookingDate != null ? String(bookingDate).trim() : ''
    if (!dateStr) return res.status(400).json({ error: 'bookingDate is required.' })
    const start = startTime != null ? String(startTime).trim() : ''
    const end = endTime != null ? String(endTime).trim() : ''
    if (!start || !end) {
      return res.status(400).json({ error: 'startTime and endTime are required.' })
    }
    try {
      const listing = db.prepare('SELECT listing_id FROM parking_listings WHERE listing_id = ?').get(lid)
      if (!listing) return res.status(404).json({ error: 'Listing not found.' })
      const student = db.prepare('SELECT user_id FROM users WHERE user_id = ?').get(sid)
      if (!student) return res.status(404).json({ error: 'Student not found.' })
      const status = (bookingStatus && String(bookingStatus).trim()) || 'Confirmed'
      const r = db
        .prepare(
          `INSERT INTO bookings (student_id, listing_id, booking_date, start_time, end_time, total_price, booking_status)
           VALUES (?, ?, ?, ?, ?, ?, ?)`
        )
        .run(sid, lid, dateStr, start, end, price, status)
      const booking_id = Number(r.lastInsertRowid)
      const row = db.prepare(`SELECT * FROM bookings WHERE booking_id = ?`).get(booking_id)
      res.status(201).json({ booking: row })
    } catch (e) {
      console.error(e)
      res.status(500).json({ error: 'Could not create booking.' })
    }
  })

  router.get('/bookings/host/:hostId', (req, res) => {
    const hostId = Number(req.params.hostId)
    if (!Number.isFinite(hostId) || hostId < 1) {
      return res.status(400).json({ error: 'Invalid host id.' })
    }
    try {
      const exists = db.prepare('SELECT user_id FROM users WHERE user_id = ?').get(hostId)
      if (!exists) return res.status(404).json({ error: 'User not found.' })
      const rows = db
        .prepare(
          `SELECT b.booking_id, b.student_id, b.listing_id, b.booking_date, b.start_time, b.end_time,
                  b.total_price, b.booking_status, b.created_at,
                  pl.title AS listing_title, pl.city AS listing_city,
                  u.first_name AS student_first_name, u.last_name AS student_last_name
           FROM bookings b
           JOIN parking_listings pl ON pl.listing_id = b.listing_id
           JOIN users u ON u.user_id = b.student_id
           WHERE pl.host_id = ?
           ORDER BY datetime(b.created_at) DESC`
        )
        .all(hostId)
      res.json(rows)
    } catch (e) {
      console.error(e)
      res.status(500).json({ error: 'Could not load bookings.' })
    }
  })

  router.post('/auth/signup', (req, res) => {
    const { firstName, lastName, email, password } = req.body || {}
    if (!firstName?.trim() || !lastName?.trim() || !email?.trim() || !password) {
      return res.status(400).json({ error: 'All fields are required.' })
    }
    const normEmail = email.trim().toLowerCase()
    try {
      const existing = db.prepare('SELECT user_id FROM users WHERE lower(email) = ?').get(normEmail)
      if (existing) {
        return res.status(409).json({ error: 'That email is already registered.' })
      }
      const password_hash = hashPassword(password)
      const r = db
        .prepare(
          `INSERT INTO users (first_name, last_name, email, password_hash, phone_number, role, profile_photo)
           VALUES (?, ?, ?, ?, NULL, 'student', NULL)`
        )
        .run(firstName.trim(), lastName.trim(), normEmail, password_hash)
      res.status(201).json({
        user: {
          userId: Number(r.lastInsertRowid),
          firstName: firstName.trim(),
          lastName: lastName.trim(),
          email: normEmail,
        },
      })
    } catch (e) {
      console.error(e)
      res.status(500).json({ error: 'Could not create account.' })
    }
  })

  router.post('/auth/login', (req, res) => {
    const { email, password } = req.body || {}
    if (!email?.trim() || !password) {
      return res.status(400).json({ error: 'Email and password are required.' })
    }
    const normEmail = email.trim().toLowerCase()
    try {
      const row = db
        .prepare(
          `SELECT user_id, first_name, last_name, email, password_hash FROM users WHERE lower(email) = ?`
        )
        .get(normEmail)
      if (!row || !verifyPassword(password, row.password_hash)) {
        return res.status(401).json({ error: 'Invalid email or password.' })
      }
      res.json({
        user: {
          userId: row.user_id,
          firstName: row.first_name,
          lastName: row.last_name,
          email: row.email,
        },
      })
    } catch (e) {
      console.error(e)
      res.status(500).json({ error: 'Could not log in.' })
    }
  })

  app.use('/api', router)
  return app
}
