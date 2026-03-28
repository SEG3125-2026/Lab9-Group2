-- SpotShare embedded SQLite schema (matches lab PDF entities)
-- Run via db/initDb.mjs on server start

PRAGMA foreign_keys = ON;

CREATE TABLE IF NOT EXISTS users (
  user_id INTEGER PRIMARY KEY AUTOINCREMENT,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  phone_number TEXT,
  role TEXT NOT NULL,
  profile_photo TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS parking_listings (
  listing_id INTEGER PRIMARY KEY AUTOINCREMENT,
  host_id INTEGER REFERENCES users (user_id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  description TEXT,
  address TEXT NOT NULL,
  city TEXT NOT NULL,
  postal_code TEXT NOT NULL,
  price_per_hour REAL NOT NULL,
  walking_distance_min INTEGER,
  rules TEXT,
  photo_url TEXT,
  status TEXT NOT NULL DEFAULT 'active',
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_parking_listings_host ON parking_listings (host_id);
CREATE INDEX IF NOT EXISTS idx_parking_listings_city ON parking_listings (city);

CREATE TABLE IF NOT EXISTS availability (
  availability_id INTEGER PRIMARY KEY AUTOINCREMENT,
  listing_id INTEGER NOT NULL REFERENCES parking_listings (listing_id) ON DELETE CASCADE,
  available_date TEXT NOT NULL,
  start_time TEXT NOT NULL,
  end_time TEXT NOT NULL,
  is_available INTEGER NOT NULL DEFAULT 1 CHECK (is_available IN (0, 1))
);

CREATE INDEX IF NOT EXISTS idx_availability_listing_date ON availability (listing_id, available_date);

CREATE TABLE IF NOT EXISTS bookings (
  booking_id INTEGER PRIMARY KEY AUTOINCREMENT,
  student_id INTEGER NOT NULL REFERENCES users (user_id) ON DELETE CASCADE,
  listing_id INTEGER NOT NULL REFERENCES parking_listings (listing_id) ON DELETE CASCADE,
  booking_date TEXT NOT NULL,
  start_time TEXT NOT NULL,
  end_time TEXT NOT NULL,
  total_price REAL NOT NULL,
  booking_status TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_bookings_student ON bookings (student_id);
CREATE INDEX IF NOT EXISTS idx_bookings_listing ON bookings (listing_id);

CREATE TABLE IF NOT EXISTS payments (
  payment_id INTEGER PRIMARY KEY AUTOINCREMENT,
  booking_id INTEGER NOT NULL REFERENCES bookings (booking_id) ON DELETE CASCADE,
  amount REAL NOT NULL,
  payment_method TEXT NOT NULL,
  payment_status TEXT NOT NULL,
  payment_date TEXT NOT NULL,
  transaction_reference TEXT
);

CREATE INDEX IF NOT EXISTS idx_payments_booking ON payments (booking_id);

CREATE TABLE IF NOT EXISTS messages (
  message_id INTEGER PRIMARY KEY AUTOINCREMENT,
  sender_id INTEGER NOT NULL REFERENCES users (user_id) ON DELETE CASCADE,
  receiver_id INTEGER NOT NULL REFERENCES users (user_id) ON DELETE CASCADE,
  booking_id INTEGER REFERENCES bookings (booking_id) ON DELETE SET NULL,
  message_text TEXT NOT NULL,
  sent_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_messages_booking ON messages (booking_id);

CREATE TABLE IF NOT EXISTS saved_listings (
  saved_id INTEGER PRIMARY KEY AUTOINCREMENT,
  student_id INTEGER NOT NULL REFERENCES users (user_id) ON DELETE CASCADE,
  listing_id INTEGER NOT NULL REFERENCES parking_listings (listing_id) ON DELETE CASCADE,
  saved_at TEXT NOT NULL DEFAULT (datetime('now')),
  UNIQUE (student_id, listing_id)
);

CREATE INDEX IF NOT EXISTS idx_saved_listings_student ON saved_listings (student_id);

CREATE TABLE IF NOT EXISTS reviews (
  review_id INTEGER PRIMARY KEY AUTOINCREMENT,
  booking_id INTEGER NOT NULL REFERENCES bookings (booking_id) ON DELETE CASCADE,
  student_id INTEGER NOT NULL REFERENCES users (user_id) ON DELETE CASCADE,
  listing_id INTEGER NOT NULL REFERENCES parking_listings (listing_id) ON DELETE CASCADE,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_reviews_listing ON reviews (listing_id);
