import { useEffect, useState } from 'react'
import { ArrowLeft, Share2, Heart, MapPin, Navigation, Star, Check } from 'lucide-react'
import Navbar from '../components/Navbar.jsx'
import { Btn, Tag, GuaranteeBadge } from '../components/UI.jsx'
import { COLORS } from '../data/listings.js'
import { fetchListingRaw, normalizeListingFromApi } from '../utils/listingApi.js'

const { green, lightGreen } = COLORS

export default function ListingPage({
  nav,
  selectedListing,
  setSelectedListing,
  savedListings,
  toggleSave,
  locale,
  setLocale,
  t,
  currentUser,
  logout,
}) {
  const [displayListing, setDisplayListing] = useState(null)

  useEffect(() => {
    if (!selectedListing) nav('search')
  }, [selectedListing, nav])

  useEffect(() => {
    const id = selectedListing?.id ?? selectedListing?.listing_id
    if (!id) {
      setDisplayListing(null)
      return
    }
    setDisplayListing(selectedListing)
    let cancelled = false
    fetchListingRaw(id)
      .then((row) => {
        if (cancelled) return
        const next = normalizeListingFromApi(row)
        setDisplayListing(next)
        setSelectedListing(next)
      })
      .catch(() => {})
    return () => {
      cancelled = true
    }
  }, [selectedListing?.id, selectedListing?.listing_id, setSelectedListing])

  if (!selectedListing) {
    return (
      <div style={{ minHeight: '100vh', background: '#f9fafb' }}>
        <Navbar nav={nav} locale={locale} setLocale={setLocale} t={t} currentUser={currentUser} logout={logout} />
      </div>
    )
  }

  const l = displayListing || selectedListing
  const hours = 9
  const subtotal = l.price * hours
  const fee = +(subtotal * 0.1).toFixed(2)
  const total = +(subtotal + fee).toFixed(2)

  return (
    <div style={{ minHeight: '100vh', background: '#f9fafb' }}>
      <Navbar nav={nav} locale={locale} setLocale={setLocale} t={t} currentUser={currentUser} logout={logout} />
      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '24px' }}>
        {/* Top actions */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            marginBottom: 20,
            flexWrap: 'wrap',
            gap: 12,
          }}
        >
          <button
            onClick={() => nav('search')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: '#374151',
              fontSize: 14,
              fontWeight: 500,
              fontFamily: "'Plus Jakarta Sans', sans-serif",
            }}
          >
            <ArrowLeft size={16} />
            {t('backToSearch')}
          </button>
          <div style={{ display: 'flex', gap: 12 }}>
            <button
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                color: '#374151',
                fontSize: 14,
                fontFamily: "'Plus Jakarta Sans', sans-serif",
              }}
            >
              <Share2 size={15} />
              {t('share')}
            </button>
            <button
              onClick={() => toggleSave(l.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                color: savedListings.includes(l.id) ? '#ef4444' : '#374151',
                fontSize: 14,
                fontFamily: "'Plus Jakarta Sans', sans-serif",
              }}
            >
              <Heart size={15} fill={savedListings.includes(l.id) ? '#ef4444' : 'none'} />
              {t('save')}
            </button>
          </div>
        </div>

        {/* Two-column layout */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'minmax(0, 1fr) min(340px, 100%)',
            gap: 32,
            alignItems: 'start',
          }}
        >
          {/* Left: details */}
          <div>
            {/* Photo */}
            <div
              style={{
                background: 'linear-gradient(135deg, #d1fae5, #a7f3d0)',
                borderRadius: 20,
                height: 340,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: 16,
              }}
            >
              <svg width="120" height="80" viewBox="0 0 120 80" fill="none">
                <rect x="8" y="28" width="104" height="44" rx="8" fill={green} opacity="0.15" />
                <rect x="16" y="32" width="88" height="36" rx="6" fill={green} opacity="0.3" />
                <rect x="24" y="16" width="64" height="32" rx="6" fill={green} opacity="0.5" />
                <circle cx="34" cy="72" r="8" fill={green} />
                <circle cx="86" cy="72" r="8" fill={green} />
              </svg>
            </div>

            {/* Thumbnails */}
            <div style={{ display: 'flex', gap: 10, marginBottom: 28 }}>
              {[1, 2].map((i) => (
                <div
                  key={i}
                  style={{
                    width: 80,
                    height: 60,
                    background: '#e8f5e9',
                    borderRadius: 10,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    border: `1.5px solid ${i === 1 ? green : '#e5e7eb'}`,
                  }}
                >
                  <svg width="32" height="24" viewBox="0 0 32 24" fill="none">
                    <rect x="2" y="8" width="28" height="12" rx="3" fill={green} opacity="0.4" />
                    <rect x="6" y="4" width="18" height="10" rx="2" fill={green} opacity="0.6" />
                    <circle cx="9" cy="20" r="3" fill={green} />
                    <circle cx="23" cy="20" r="3" fill={green} />
                  </svg>
                </div>
              ))}
            </div>

            {/* Title & badges */}
            <div
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: 12,
                marginBottom: 12,
              }}
            >
              <div>
                <div style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
                  <Tag>{l.type}</Tag>
                  <span
                    style={{ fontSize: 12, color: '#6b7280', alignSelf: 'center' }}
                  >
                    {t('spotAvailable')}
                  </span>
                </div>
                <h1
                  style={{
                    fontSize: 24,
                    fontWeight: 800,
                    color: '#111',
                    marginBottom: 6,
                  }}
                >
                  {l.name}
                </h1>
                <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
                  <span
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 4,
                      fontSize: 13,
                      color: '#6b7280',
                    }}
                  >
                    <MapPin size={13} color={green} />
                    {l.area}
                  </span>
                  <span
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 4,
                      fontSize: 13,
                      color: '#6b7280',
                    }}
                  >
                    <Navigation size={13} color={green} />
                    {l.walk} {t('walkToCampusSuffix')}
                  </span>
                  <span
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 4,
                      fontSize: 13,
                      color: '#f59e0b',
                    }}
                  >
                    <Star size={13} fill="#f59e0b" />
                    {l.rating} · {l.reviews} {t('reviewsWord')}
                  </span>
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <span style={{ fontSize: 28, fontWeight: 800, color: '#111' }}>
                  ${l.price}
                </span>
                <span style={{ color: '#6b7280', fontSize: 14 }}>{t('perHour')}</span>
              </div>
            </div>

            <hr
              style={{ border: 'none', borderTop: '1px solid #e5e7eb', margin: '24px 0' }}
            />

            {/* Host */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                marginBottom: 24,
              }}
            >
              <div
                style={{
                  width: 48,
                  height: 48,
                  borderRadius: '50%',
                  background: lightGreen,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 16,
                  fontWeight: 700,
                  color: green,
                }}
              >
                {l.hostAvatar}
              </div>
              <div>
                <p style={{ fontWeight: 600, fontSize: 15, color: '#111' }}>
                  {t('hostedByPrefix')} {l.host}
                </p>
                <p style={{ fontSize: 13, color: '#6b7280' }}>{t('memberSinceSuperhost')}</p>
              </div>
            </div>

            {/* Rules */}
            <h3
              style={{
                fontWeight: 700,
                fontSize: 16,
                color: '#111',
                marginBottom: 12,
              }}
            >
              {t('parkingRules')}
            </h3>
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: 8,
                marginBottom: 24,
              }}
            >
              {l.rules.map((r, i) => (
                <div
                  key={i}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 10,
                    fontSize: 14,
                    color: '#374151',
                  }}
                >
                  <div
                    style={{
                      width: 20,
                      height: 20,
                      borderRadius: '50%',
                      background: lightGreen,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                    }}
                  >
                    <Check size={11} color={green} />
                  </div>
                  {r}
                </div>
              ))}
            </div>

            {/* Description */}
            <h3
              style={{
                fontWeight: 700,
                fontSize: 16,
                color: '#111',
                marginBottom: 12,
              }}
            >
              {t('aboutThisSpot')}
            </h3>
            <p style={{ fontSize: 14, color: '#6b7280', lineHeight: 1.7 }}>
              {l.description}
            </p>
          </div>

          {/* Right: booking widget */}
          <div
            style={{
              background: 'white',
              border: '1px solid #e5e7eb',
              borderRadius: 20,
              padding: 24,
              position: 'sticky',
              top: 80,
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'baseline',
                gap: 4,
                marginBottom: 4,
              }}
            >
              <span style={{ fontSize: 26, fontWeight: 800, color: '#111' }}>
                ${l.price}
              </span>
              <span style={{ color: '#6b7280', fontSize: 14 }}>{t('perHour')}</span>
            </div>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 4,
                marginBottom: 20,
              }}
            >
              <Star size={13} fill="#f59e0b" color="#f59e0b" />
              <span style={{ fontSize: 13, fontWeight: 600, color: '#111' }}>
                {l.rating}
              </span>
              <span style={{ fontSize: 13, color: '#6b7280' }}>
                · {l.reviews} {t('reviewsWord')}
              </span>
            </div>

            {/* Date/time inputs */}
            <div
              style={{
                border: '1px solid #e5e7eb',
                borderRadius: 10,
                marginBottom: 16,
              }}
            >
              <div
                style={{
                  padding: '10px 14px',
                  borderBottom: '1px solid #e5e7eb',
                }}
              >
                <p
                  style={{
                    fontSize: 11,
                    color: '#6b7280',
                    marginBottom: 2,
                    fontWeight: 600,
                    textTransform: 'uppercase',
                  }}
                >
                  {t('dateLabel')}
                </p>
                <p style={{ fontSize: 14, fontWeight: 600, color: '#111' }}>
                  {t('demoBookingDate')}
                </p>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr' }}>
                {[
                  [t('startLabel'), '08:00', true],
                  [t('endLabel'), '17:00', false],
                ].map(([label, val, isStart]) => (
                  <div
                    key={String(label)}
                    style={{
                      padding: '10px 14px',
                      borderRight: isStart ? '1px solid #e5e7eb' : 'none',
                    }}
                  >
                    <p
                      style={{
                        fontSize: 11,
                        color: '#6b7280',
                        marginBottom: 2,
                        fontWeight: 600,
                        textTransform: 'uppercase',
                      }}
                    >
                      {label}
                    </p>
                    <select
                      style={{
                        fontSize: 14,
                        fontWeight: 600,
                        color: '#111',
                        border: 'none',
                        outline: 'none',
                        background: 'none',
                        cursor: 'pointer',
                        width: '100%',
                        fontFamily: "'Plus Jakarta Sans', sans-serif",
                      }}
                    >
                      <option>{val}</option>
                      <option>{isStart ? '09:00' : '18:00'}</option>
                    </select>
                  </div>
                ))}
              </div>
            </div>

            {/* Price breakdown */}
            <div style={{ marginBottom: 16 }}>
              {[
                [
                  t('priceTimesHours', { price: `$${l.price}`, hours, hrs: t('hrsShort') }),
                  `$${subtotal.toFixed(2)}`,
                ],
                [t('serviceFeePct'), `$${fee}`],
              ].map(([label, val]) => (
                <div
                  key={label}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    fontSize: 14,
                    color: '#374151',
                    marginBottom: 8,
                  }}
                >
                  <span>{label}</span>
                  <span>{val}</span>
                </div>
              ))}
              <hr style={{ border: 'none', borderTop: '1px solid #e5e7eb', margin: '10px 0' }} />
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  fontSize: 15,
                  fontWeight: 700,
                  color: '#111',
                }}
              >
                <span>{t('totalLabel')}</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </div>

            <Btn
              onClick={() => nav('booking')}
              style={{ width: '100%', justifyContent: 'center', padding: '14px', borderRadius: 12, fontSize: 15 }}
            >
              {t('reserveThisSpot')}
            </Btn>
            <p
              style={{
                textAlign: 'center',
                fontSize: 12,
                color: '#6b7280',
                marginTop: 8,
              }}
            >
              {t('wontChargeYet')}
            </p>
            <GuaranteeBadge t={t} />
          </div>
        </div>
      </div>
    </div>
  )
}
