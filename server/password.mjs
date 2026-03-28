import { randomBytes, scryptSync, timingSafeEqual } from 'node:crypto'

const KEYLEN = 32

export function hashPassword(password) {
  const salt = randomBytes(16)
  const hash = scryptSync(password, salt, KEYLEN)
  return `${salt.toString('hex')}:${hash.toString('hex')}`
}

export function verifyPassword(password, stored) {
  if (typeof stored !== 'string' || !stored.includes(':')) return false
  const [saltHex, hashHex] = stored.split(':')
  if (!saltHex || !hashHex) return false
  try {
    const salt = Buffer.from(saltHex, 'hex')
    const expected = Buffer.from(hashHex, 'hex')
    const actual = scryptSync(password, salt, KEYLEN)
    if (actual.length !== expected.length) return false
    return timingSafeEqual(actual, expected)
  } catch {
    return false
  }
}
