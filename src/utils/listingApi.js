/** Maps SQLite /api/listings rows to the UI listing shape used across pages. */
export function normalizeListingFromApi(row) {
  const rules = row.rules
    ? row.rules
        .split(/[;\n]/)
        .map((s) => s.trim())
        .filter(Boolean)
    : []
  const title = row.title || 'Parking spot'
  return {
    id: row.listing_id,
    listing_id: row.listing_id,
    type: inferParkingType(title),
    name: title,
    host: 'Host',
    hostAvatar: 'H',
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
