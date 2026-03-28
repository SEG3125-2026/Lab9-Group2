/**
 * Optional demo users only (no listings — hosts add spots via the app later).
 * Run: npm run db:seed
 */
import { openDatabase } from './initDb.mjs'

const db = openDatabase()

if (db.prepare('SELECT COUNT(*) AS n FROM users').get().n > 0) {
  console.log('Database already has users; skip seed (delete data/spotshare.db to re-seed).')
  db.close()
  process.exit(0)
}

const insertUser = db.prepare(`
  INSERT INTO users (first_name, last_name, email, password_hash, phone_number, role, profile_photo)
  VALUES (?, ?, ?, ?, ?, ?, ?)
`)

const tx = db.transaction(() => {
  insertUser.run(
    'Sarah',
    'M.',
    'sarah@example.com',
    'demo_hash',
    '613-555-0100',
    'host',
    null
  )
  insertUser.run(
    'Alex',
    'Student',
    'alex@example.com',
    'demo_hash',
    '613-555-0200',
    'student',
    null
  )
})

tx()
console.log('Seed complete (users only).')
db.close()
