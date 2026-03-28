/**
 * Wipes all app data, recreates parking_listings (nullable host_id), inserts 3 sample listings.
 * No users or host accounts. Run: npm run db:reset-listings-only
 */
import Database from 'better-sqlite3'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const dbPath = path.join(__dirname, '..', 'data', 'spotshare.db')
const schemaPath = path.join(__dirname, 'schema.sql')

const db = new Database(dbPath)
db.pragma('foreign_keys = OFF')
db.exec(`
  DELETE FROM payments;
  DELETE FROM reviews;
  DELETE FROM messages;
  DELETE FROM saved_listings;
  DELETE FROM bookings;
  DELETE FROM availability;
  DELETE FROM parking_listings;
  DELETE FROM users;
`)
db.exec('DROP TABLE IF EXISTS parking_listings')
db.pragma('foreign_keys = ON')

db.exec(fs.readFileSync(schemaPath, 'utf8'))

const insert = db.prepare(`
  INSERT INTO parking_listings (
    host_id, title, description, address, city, postal_code,
    price_per_hour, walking_distance_min, rules, photo_url, status
  ) VALUES (NULL, ?, ?, ?, ?, ?, ?, ?, ?, NULL, 'active')
`)

const listings = [
  {
    title: 'Covered carport — Sandy Hill (uOttawa)',
    description:
      'Private paved driveway with a metal carport. Well lit at night. The street is one-way and usually has open spots for loading in. I work from home most weekdays if you need anything.',
    address: '145 Somerset Street East',
    city: 'Ottawa',
    postal_code: 'K1N 6Z6',
    price_per_hour: 3.5,
    walking_distance_min: 6,
    rules:
      'Compact or midsize vehicles only; no overnight stays without prior message; do not block the neighbour’s rolled curb.',
  },
  {
    title: 'Wide driveway — The Glebe',
    description:
      'Two-car width asphalt driveway on a low-traffic residential block. Easy pull-in from the street. Winter: shovelled within 12 hours of snowfall.',
    address: '42 Powell Avenue',
    city: 'Ottawa',
    postal_code: 'K1S 2A5',
    price_per_hour: 2.75,
    walking_distance_min: 11,
    rules:
      'SUVs and minivans welcome; please do not park closer than 1 m to the mailbox; no oil changes or mechanical work on site.',
  },
  {
    title: 'Single garage bay — Old Ottawa South',
    description:
      'Detached garage with a manual door (ceiling height 2.1 m). Spot is yours for the booked window — I will leave the side path clear. River and paths are two blocks south.',
    address: '308 Echo Drive',
    city: 'Ottawa',
    postal_code: 'K1S 1N5',
    price_per_hour: 4.25,
    walking_distance_min: 9,
    rules:
      'No idling with the garage door closed; electric vehicles OK; code for the side gate is sent in the booking confirmation (demo: use instructions in app).',
  },
]

for (const l of listings) {
  insert.run(
    l.title,
    l.description,
    l.address,
    l.city,
    l.postal_code,
    l.price_per_hour,
    l.walking_distance_min,
    l.rules
  )
}

db.close()
console.log('Database reset: 0 users, 3 parking_listings (host_id NULL).')
