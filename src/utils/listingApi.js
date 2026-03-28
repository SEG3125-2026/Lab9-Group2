function hostLabelAndInitials(row) {
  const first = String(row.host_first_name ?? '').trim()
  const last = String(row.host_last_name ?? '').trim()
  const name = [first, last].filter(Boolean).join(' ') || 'Host'
  const a = (first[0] || '?').toUpperCase()
  const b = (last[0] || '').toUpperCase()
  const hostAvatar = name === 'Host' ? 'H' : b ? `${a}${b}` : a
  return { host: name, hostAvatar }
}

/** Maps SQLite /api/listings rows to the UI listing shape used across pages. */
export function normalizeListingFromApi(row) {
  const rules = row.rules
    ? row.rules
        .split(/[;\n]/)
        .map((s) => s.trim())
        .filter(Boolean)
    : []
  const title = row.title || 'Parking spot'
  const { host, hostAvatar } = hostLabelAndInitials(row)
  return {
    id: row.listing_id,
    listing_id: row.listing_id,
    type: inferParkingType(title),
    name: title,
    host,
    hostAvatar,
    price: Number(row.price_per_hour) || 0,
    rating: 0,
    reviews: 0,
    walk:
      row.walking_distance_min != null && row.walking_distance_min !== ''
        ? `${row.walking_distance_min} min walk`
        : '—',
    area: row.city || '',
    address: row.address || '',
    rules,
    description: row.description || '',
  }
}

function inferParkingType(title) {
  const t = (title || '').toLowerCase()
  if (t.includes('garage')) return 'Garage'
  if (t.includes('carport')) return 'Carport'
  return 'Driveway'
}

export async function fetchListings() {
  const res = await fetch('/api/listings')
  if (!res.ok) throw new Error('Failed to load listings')
  const rows = await res.json()
  return rows.map(normalizeListingFromApi)
}

export async function fetchListingRaw(listingId) {
  const res = await fetch(`/api/listings/${listingId}`)
  if (!res.ok) throw new Error('Failed to load listing')
  return res.json()
}

export async function fetchHostListingsRaw(hostId) {
  const res = await fetch(`/api/listings/host/${hostId}`)
  if (!res.ok) throw new Error('Failed to load your listings')
  return res.json()
}

export async function createListing(payload) {
  let res
  try {
    res = await fetch('/api/listings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
  } catch {
    throw new Error('Could not reach the server. Run npm run dev (API + Vite) or check your connection.')
  }
  const text = await res.text()
  let data = {}
  try {
    data = text ? JSON.parse(text) : {}
  } catch {
    /* non-JSON body — handled when !res.ok */
  }
  if (!res.ok) {
    if (typeof data.error === 'string' && data.error) throw new Error(data.error)
    if (/^\s*</.test(text)) {
      throw new Error(
        `Request failed (${res.status}). The response was HTML, not JSON — the API is probably not running or /api is not proxied. Use npm run dev.`
      )
    }
    throw new Error(
      text.trim()
        ? `Request failed (${res.status}).`
        : `Request failed (${res.status}) with an empty response.`
    )
  }
  if (!data.listing) throw new Error('Server did not return the new listing.')
  return data.listing
}

export async function createBooking(payload) {
  let res
  try {
    res = await fetch('/api/bookings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
  } catch {
    throw new Error('Could not reach the server.')
  }
  const text = await res.text()
  let data = {}
  try {
    data = text ? JSON.parse(text) : {}
  } catch {
    /* ignore */
  }
  if (!res.ok) {
    if (typeof data.error === 'string' && data.error) throw new Error(data.error)
    throw new Error('Failed to create booking.')
  }
  return data.booking
}

export async function fetchHostBookingsRaw(hostId) {
  const res = await fetch(`/api/bookings/host/${hostId}`)
  if (!res.ok) throw new Error('Failed to load bookings')
  return res.json()
}
