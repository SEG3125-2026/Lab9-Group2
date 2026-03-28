import { useState, useEffect } from 'react'
import { Search, MapPin, Filter, Map, List } from 'lucide-react'
import Navbar from '../components/Navbar.jsx'
import { ListingCard, Btn } from '../components/UI.jsx'
import { COLORS } from '../data/listings.js'
import { fetchListings } from '../utils/listingApi.js'

const { green } = COLORS

const PRICE_FILTERS = [
  { id: 'all', labelKey: 'priceFilterAll' },
  { id: 'under3', labelKey: 'priceFilterUnder3' },
  { id: 'mid', labelKey: 'priceFilter3to5' },
  { id: 'over5', labelKey: 'priceFilterOver5' },
]

export default function SearchPage({ nav, savedListings, toggleSave, locale, setLocale, t, currentUser, logout }) {
  const [searchQuery, setSearchQuery] = useState('State University')
  const [viewMode, setViewMode] = useState('list')
  const [priceFilter, setPriceFilter] = useState('all')
  const [listings, setListings] = useState([])
  const [loadState, setLoadState] = useState('loading')

  useEffect(() => {
    let cancelled = false
    setLoadState('loading')
    fetchListings()
      .then((rows) => {
        if (!cancelled) {
          setListings(rows)
          setLoadState('ok')
        }
      })
      .catch(() => {
        if (!cancelled) setLoadState('error')
      })
    return () => {
      cancelled = true
    }
  }, [])

  const filtered = listings.filter((l) => {
    if (priceFilter === 'all') return true
    if (priceFilter === 'under3') return l.price < 3
    if (priceFilter === 'mid') return l.price >= 3 && l.price <= 5
    if (priceFilter === 'over5') return l.price > 5
    return true
  })

  return (
    <div style={{ minHeight: '100vh', background: '#f9fafb' }}>
      <Navbar nav={nav} locale={locale} setLocale={setLocale} t={t} currentUser={currentUser} logout={logout} />

      {/* Search bar row */}
      <div
        style={{
          background: 'white',
          borderBottom: '1px solid #e5e7eb',
          padding: '12px 24px',
        }}
      >
        <div
          style={{
            maxWidth: 1100,
            margin: '0 auto',
            display: 'flex',
            gap: 12,
            alignItems: 'center',
            flexWrap: 'wrap',
          }}
        >
          <div
            style={{
              flex: 1,
              minWidth: 200,
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              background: '#f3f4f6',
              borderRadius: 10,
              padding: '0 14px',
              height: 40,
            }}
          >
            <MapPin size={14} color={green} />
            <input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t('searchPlaceholder')}
              style={{
                flex: 1,
                fontSize: 14,
                background: 'none',
                border: 'none',
                outline: 'none',
                color: '#374151',
                fontFamily: "'Plus Jakarta Sans', sans-serif",
              }}
            />
          </div>

          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <Btn
              variant="outline"
              style={{ padding: '8px 16px', borderRadius: 8, fontSize: 13 }}
            >
              <Filter size={14} />
              {t('filters')}
            </Btn>
            <div
              style={{
                display: 'flex',
                border: '1.5px solid #e5e7eb',
                borderRadius: 8,
                overflow: 'hidden',
              }}
            >
              {[
                ['list', t('list'), List],
                ['map', t('map'), Map],
              ].map(([v, l, Icon]) => (
                <button
                  key={v}
                  onClick={() => setViewMode(v)}
                  style={{
                    background: viewMode === v ? green : 'white',
                    color: viewMode === v ? 'white' : '#6b7280',
                    border: 'none',
                    cursor: 'pointer',
                    padding: '8px 14px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6,
                    fontSize: 13,
                    fontWeight: 500,
                    fontFamily: "'Plus Jakarta Sans', sans-serif",
                  }}
                >
                  <Icon size={14} />
                  {l}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '24px' }}>
        {loadState === 'loading' && (
          <p style={{ color: '#6b7280', textAlign: 'center', padding: '48px 0' }}>{t('searchLoadingSpots')}</p>
        )}
        {loadState === 'error' && (
          <p style={{ color: '#b91c1c', textAlign: 'center', padding: '48px 0' }}>{t('searchLoadError')}</p>
        )}
        {loadState === 'ok' && (
          <>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: 20,
                flexWrap: 'wrap',
                gap: 12,
              }}
            >
              <div>
                <p style={{ fontWeight: 700, fontSize: 16, color: '#111' }}>
                  {filtered.length} {t('viewAllSpots')} {searchQuery}
                </p>
                <p style={{ fontSize: 13, color: '#6b7280', marginTop: 2 }}>
                  {t('modalDate')}
                </p>
              </div>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                {PRICE_FILTERS.map(({ id, labelKey }) => (
                  <button
                    key={id}
                    type="button"
                    onClick={() => setPriceFilter(id)}
                    style={{
                      background: priceFilter === id ? green : 'white',
                      color: priceFilter === id ? 'white' : '#374151',
                      border: `1px solid ${priceFilter === id ? green : '#e5e7eb'}`,
                      cursor: 'pointer',
                      padding: '6px 14px',
                      borderRadius: 20,
                      fontSize: 12,
                      fontWeight: 500,
                      fontFamily: "'Plus Jakarta Sans', sans-serif",
                    }}
                  >
                    {t(labelKey)}
                  </button>
                ))}
              </div>
            </div>

            {filtered.length === 0 ? (
              <div
                style={{
                  textAlign: 'center',
                  padding: '56px 24px',
                  background: 'white',
                  border: '1px solid #e5e7eb',
                  borderRadius: 16,
                }}
              >
                <p style={{ fontWeight: 600, color: '#111', marginBottom: 8 }}>{t('searchNoSpotsTitle')}</p>
                <p style={{ color: '#6b7280', fontSize: 14, maxWidth: 400, margin: '0 auto' }}>
                  {t('searchNoSpotsBody')}
                </p>
              </div>
            ) : viewMode === 'list' ? (
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
                  gap: 20,
                }}
              >
                {filtered.map((l) => (
                  <ListingCard
                    key={l.id}
                    listing={l}
                    onClick={(listing) => nav('listing', listing)}
                    savedListings={savedListings}
                    toggleSave={toggleSave}
                    t={t}
                  />
                ))}
              </div>
            ) : (
              <div
                style={{
                  background: '#ecfdf5',
                  borderRadius: 16,
                  height: 480,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: '1px solid #a7f3d0',
                }}
              >
                <Map size={48} color={green} style={{ marginBottom: 12 }} />
                <p style={{ color: green, fontWeight: 600, fontSize: 16 }}>{t('mapViewTitle')}</p>
                <p style={{ color: '#6b7280', fontSize: 13, marginTop: 4 }}>
                  {t('mapSpotsPinned', { count: filtered.length })}
                </p>
                <div
                  style={{
                    display: 'flex',
                    gap: 12,
                    marginTop: 24,
                    flexWrap: 'wrap',
                    justifyContent: 'center',
                  }}
                >
                  {filtered.map((l) => (
                    <button
                      key={l.id}
                      onClick={() => nav('listing', l)}
                      style={{
                        background: 'white',
                        border: `1.5px solid ${green}`,
                        borderRadius: 10,
                        padding: '8px 16px',
                        cursor: 'pointer',
                        fontSize: 13,
                        fontWeight: 600,
                        color: '#064e3b',
                        fontFamily: "'Plus Jakarta Sans', sans-serif",
                      }}
                    >
                      📍 ${l.price}/hr · {l.walk}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
