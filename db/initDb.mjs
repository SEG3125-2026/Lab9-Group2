import Database from 'better-sqlite3'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const projectRoot = path.join(__dirname, '..')
const dataDir = path.join(projectRoot, 'data')
export const dbPath = path.join(dataDir, 'spotshare.db')
const schemaPath = path.join(__dirname, 'schema.sql')

/**
 * Opens (or creates) the SQLite file at data/spotshare.db and applies schema.sql.
 * Safe to call on every server start — uses IF NOT EXISTS.
 */
export function openDatabase() {
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true })
  }
  const db = new Database(dbPath)
  db.pragma('foreign_keys = ON')
  const schema = fs.readFileSync(schemaPath, 'utf8')
  db.exec(schema)
  return db
}
