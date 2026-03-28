import { useState, useEffect, useCallback } from 'react'
import { Plus, DollarSign, Calendar, Star, Car, MessageCircle, X } from 'lucide-react'
import Navbar from '../components/Navbar.jsx'
import { Btn, Tag } from '../components/UI.jsx'
import { COLORS } from '../data/listings.js'
import {
  fetchHostListingsRaw,
  fetchHostBookingsRaw,
  normalizeListingFromApi,
  createListing,
} from '../utils/listingApi.js'

const { green, lightGreen } = COLORS

function studentDisplayName(b, t) {
  const f = String(b.student_first_name ?? '').trim()
  const l = String(b.student_last_name ?? '').trim()
  return [f, l].filter(Boolean).join(' ') || t('studentFallbackName')
}

function bookingDateInCurrentMonth(bookingDate) {
  if (!bookingDate) return false
  const s = String(bookingDate).trim()
  const d = new Date(/^\d{4}-\d{2}-\d{2}$/.test(s) ? `${s}T12:00:00` : s)
  if (Number.isNaN(d.getTime())) return false
  const ref = new Date()
  return d.getMonth() === ref.getMonth() && d.getFullYear() === ref.getFullYear()
}

function inferParkingType(title, tr) {
  const s = (title || '').toLowerCase()
  if (s.includes('garage')) return tr('parkingTypeGarage')
  if (s.includes('carport')) return tr('parkingTypeCarport')
  return tr('parkingTypeDriveway')
}

export default function HostDashboard({ nav, locale, setLocale, t, currentUser, logout }) {
  const [hostTab, setHostTab] = useState('overview')
  const [myListings, setMyListings] = useState([])
  const [listingsLoad, setListingsLoad] = useState('idle')
  const [hostBookings, setHostBookings] = useState([])
  const [bookingsLoad, setBookingsLoad] = useState('idle')
  const [addOpen, setAddOpen] = useState(false)
  const [formError, setFormError] = useState('')
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState({
    title: '',
    description: '',
    address: '',
    city: '',
    postal_code: '',
    price_per_hour: '',
    walking_distance_min: '',
    rules: '',
  })

  const hostId = currentUser?.userId

  const loadMyListings = useCallback(async () => {
    if (!hostId) {
      setMyListings([])
      setListingsLoad('idle')
      return
    }
    setListingsLoad('loading')
    try {
      const rows = await fetchHostListingsRaw(hostId)
      setMyListings(rows)
      setListingsLoad('ok')
    } catch {
      setMyListings([])
      setListingsLoad('error')
    }
  }, [hostId])

  const loadHostBookings = useCallback(async () => {
    if (!hostId) {
      setHostBookings([])
      setBookingsLoad('idle')
      return
    }
    setBookingsLoad('loading')
    try {
      const rows = await fetchHostBookingsRaw(hostId)
      setHostBookings(rows)
      setBookingsLoad('ok')
    } catch {
      setHostBookings([])
      setBookingsLoad('error')
    }
  }, [hostId])

  useEffect(() => {
    loadMyListings()
    loadHostBookings()
  }, [loadMyListings, loadHostBookings])

  useEffect(() => {
    const reload = () => {
      if (hostId) loadHostBookings()
    }
    window.addEventListener('focus', reload)
    return () => window.removeEventListener('focus', reload)
  }, [hostId, loadHostBookings])

  useEffect(() => {
    if (!hostId) return
    if (hostTab === 'overview' || hostTab === 'bookings') {
      loadHostBookings()
    }
  }, [hostId, hostTab, loadHostBookings])

  const openAddListing = () => {
    if (!hostId) {
      nav('login')
      return
    }
    setFormError('')
    setForm({
      title: '',
      description: '',
      address: '',
      city: '',
      postal_code: '',
      price_per_hour: '',
      walking_distance_min: '',
      rules: '',
    })
    setAddOpen(true)
  }

  const submitListing = async (e) => {
    e.preventDefault()
    const formEl = e.currentTarget
    if (formEl instanceof HTMLFormElement && !formEl.checkValidity()) {
      formEl.reportValidity()
      return
    }
    setFormError('')
    if (!hostId) {
      setFormError(t('hostLoginPublishError'))
      return
    }
    setSaving(true)
    try {
      await createListing({
        hostId,
        title: form.title,
        description: form.description,
        address: form.address,
        city: form.city,
        postal_code: form.postal_code,
        price_per_hour: Number(form.price_per_hour),
        walking_distance_min: form.walking_distance_min,
        rules: form.rules,
      })
      setAddOpen(false)
      await loadMyListings()
      setHostTab('my listings')
    } catch (err) {
      setFormError(err.message || t('hostCouldNotSaveListing'))
    } finally {
      setSaving(false)
    }
  }

  const activeCount = myListings.filter((l) => l.status === 'active').length
  const confirmedHostBookings = hostBookings.filter((b) => b.booking_status === 'Confirmed')
  const totalBookingCount = confirmedHostBookings.length
  const monthlyEarnings = confirmedHostBookings
    .filter((b) => bookingDateInCurrentMonth(b.booking_date))
    .reduce((sum, b) => sum + (Number(b.total_price) || 0), 0)
  const hostInitials = currentUser
    ? `${(currentUser.firstName || '?')[0] || ''}${(currentUser.lastName || '?')[0] || ''}`.toUpperCase()
    : 'H'
  const hostGreeting = currentUser
    ? `${t('helloHost')?.split(',')[0] || 'Hello'}, ${currentUser.firstName} 👋`
    : t('helloHost') || 'Host dashboard'

  const firstListingTitle = myListings[0]?.title || null

  return (
    <div style={{ minHeight: '100vh', background: '#f9fafb' }}>
      <Navbar nav={nav} locale={locale} setLocale={setLocale} t={t} currentUser={currentUser} logout={logout} />
      <div style={{ maxWidth: 1000, margin: '0 auto', padding: '24px' }}>
        {/* Header */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 24,
            flexWrap: 'wrap',
            gap: 16,
          }}
        >
          <div style={{ display: 'flex', gap: 14, alignItems: 'center' }}>
            <div
              style={{
                width: 52,
                height: 52,
                borderRadius: '50%',
                background: lightGreen,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 18,
                fontWeight: 700,
                color: green,
              }}
            >
              {hostInitials}
            </div>
            <div>
              <p style={{ fontSize: 12, color: '#6b7280' }}>{t('hostDashboardTitle')}</p>
              <p style={{ fontWeight: 800, fontSize: 20, color: '#111' }}>{hostGreeting}</p>
            </div>
          </div>
          <Btn style={{ padding: '10px 20px' }} onClick={openAddListing}>
            <Plus size={16} />
            {t('addListing')}
          </Btn>
        </div>

        {/* Stats */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
            gap: 16,
            marginBottom: 28,
          }}
        >
          {[
            [`$${monthlyEarnings.toFixed(2)}`, t('hostStatMonthlyEarnings'), DollarSign],
            [String(activeCount), t('hostStatActiveListings'), Car],
            [String(totalBookingCount), t('hostStatTotalBookings'), Calendar],
            ['—', t('hostStatOverallRating'), Star],
          ].map(([val, label, Icon]) => (
            <div
              key={String(label)}
              style={{
                background: 'white',
                border: '1px solid #e5e7eb',
                borderRadius: 16,
                padding: '20px 16px',
              }}
            >
              <div
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: '50%',
                  background: lightGreen,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: 8,
                }}
              >
                <Icon size={16} color={green} />
              </div>
              <p style={{ fontWeight: 800, fontSize: 22, color: '#111' }}>{val}</p>
              <p style={{ fontSize: 12, color: '#6b7280', marginTop: 2 }}>{label}</p>
            </div>
          ))}
        </div>

        {/* Tab nav */}
        <div style={{ display: 'flex', borderBottom: '1px solid #e5e7eb', marginBottom: 24, flexWrap: 'wrap' }}>
          {[
            ['overview', t('overview')],
            ['my listings', t('myListings')],
            ['bookings', t('bookings')],
            ['messages', t('messagesText')],
          ].map(([tab, label]) => (
            <button
              key={tab}
              type="button"
              onClick={() => setHostTab(tab)}
              style={{
                padding: '12px 20px',
                border: 'none',
                cursor: 'pointer',
                background: 'none',
                fontWeight: hostTab === tab ? 600 : 400,
                fontSize: 14,
                color: hostTab === tab ? green : '#6b7280',
                borderBottom: hostTab === tab ? `2px solid ${green}` : '2px solid transparent',
                fontFamily: "'Plus Jakarta Sans', sans-serif",
              }}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Overview tab */}
        {hostTab === 'overview' && (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'minmax(0,1fr) min(340px, 100%)',
              gap: 24,
            }}
          >
            <div>
              <h3
                style={{
                  fontWeight: 700,
                  fontSize: 16,
                  color: '#111',
                  marginBottom: 16,
                }}
              >
                {t('hostUpcomingBookings')}
              </h3>
              {!hostId ? (
                <div style={{ textAlign: 'center', padding: 24, color: '#6b7280', fontSize: 14 }}>
                  {t('hostLogInToSeeBookings')}
                </div>
              ) : bookingsLoad === 'loading' ? (
                <p style={{ color: '#6b7280', fontSize: 14 }}>{t('hostLoadingBookings')}</p>
              ) : bookingsLoad === 'error' ? (
                <p style={{ color: '#b91c1c', fontSize: 14 }}>{t('hostCouldNotLoadBookings')}</p>
              ) : hostBookings.length === 0 ? (
                <div
                  style={{
                    border: '1px dashed #e5e7eb',
                    borderRadius: 16,
                    padding: 32,
                    textAlign: 'center',
                    color: '#6b7280',
                    fontSize: 14,
                  }}
                >
                  {t('hostNoRequestsOverview')}
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  {hostBookings.slice(0, 8).map((b) => (
                    <div
                      key={b.booking_id}
                      style={{
                        border: '1px solid #e5e7eb',
                        borderRadius: 14,
                        padding: 16,
                        background: 'white',
                        display: 'flex',
                        flexWrap: 'wrap',
                        gap: 12,
                        justifyContent: 'space-between',
                        alignItems: 'flex-start',
                      }}
                    >
                      <div>
                        <p style={{ fontWeight: 700, fontSize: 14, color: '#111', marginBottom: 4 }}>
                          {studentDisplayName(b, t)}
                        </p>
                        <p style={{ fontSize: 13, color: '#6b7280', marginBottom: 4 }}>
                          {b.listing_title}
                          {b.listing_city ? ` · ${b.listing_city}` : ''}
                        </p>
                        <p style={{ fontSize: 12, color: '#9ca3af' }}>
                          {b.booking_date} · {b.start_time} – {b.end_time}
                        </p>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <p style={{ fontWeight: 800, fontSize: 16, color: '#111' }}>
                          ${Number(b.total_price).toFixed(2)}
                        </p>
                        <Tag color={b.booking_status === 'Confirmed' ? '#16a34a' : '#6b7280'}>
                          {b.booking_status === 'Confirmed'
                            ? t('confirmed')
                            : b.booking_status === 'Pending'
                              ? t('pending')
                              : b.booking_status}
                        </Tag>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div
              style={{
                background: 'white',
                border: '1px solid #e5e7eb',
                borderRadius: 20,
                padding: 24,
              }}
            >
              <h3 style={{ fontWeight: 700, fontSize: 15, color: '#111', marginBottom: 4 }}>
                {t('hostManageAvailability')}
              </h3>
              <p style={{ fontSize: 13, color: '#6b7280', marginBottom: 16 }}>
                {firstListingTitle || t('hostAddListingAvailHint')}
              </p>

              {firstListingTitle ? (
                <>
                  <p style={{ fontWeight: 600, fontSize: 14, color: '#111', marginBottom: 12, textAlign: 'center' }}>
                    {t('hostMarch2026')}
                  </p>
                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(7, 1fr)',
                      gap: 4,
                      textAlign: 'center',
                    }}
                  >
                    {[
                      t('calSu'),
                      t('calMo'),
                      t('calTu'),
                      t('calWe'),
                      t('calTh'),
                      t('calFr'),
                      t('calSa'),
                    ].map((d, di) => (
                      <div
                        key={di}
                        style={{
                          fontSize: 11,
                          color: '#9ca3af',
                          fontWeight: 600,
                          paddingBottom: 6,
                        }}
                      >
                        {d}
                      </div>
                    ))}
                    {Array.from({ length: 31 }, (_, idx) => idx + 1).map((d) => (
                      <button
                        key={d}
                        type="button"
                        style={{
                          borderRadius: '50%',
                          width: 32,
                          height: 32,
                          border: 'none',
                          cursor: 'pointer',
                          margin: '2px auto',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: 12,
                          background: 'transparent',
                          color: '#374151',
                          fontWeight: 400,
                          fontFamily: "'Plus Jakarta Sans', sans-serif",
                        }}
                      >
                        {d}
                      </button>
                    ))}
                  </div>
                  <p style={{ fontSize: 11, color: '#9ca3af', marginTop: 12 }}>
                    {t('hostCalendarPreviewFooter')}
                  </p>
                </>
              ) : (
                <Btn variant="outline" onClick={openAddListing} style={{ width: '100%', justifyContent: 'center' }}>
                  <Plus size={16} />
                  {t('hostAddFirstListing')}
                </Btn>
              )}
            </div>
          </div>
        )}

        {/* My Listings tab */}
        {hostTab === 'my listings' && (
          <div>
            {!hostId && (
              <div style={{ textAlign: 'center', padding: '48px 24px', color: '#6b7280' }}>
                <p style={{ marginBottom: 16 }}>{t('hostLogInSeeListings')}</p>
                <Btn onClick={() => nav('login')}>{t('hostLogIn')}</Btn>
              </div>
            )}
            {hostId && listingsLoad === 'loading' && (
              <p style={{ color: '#6b7280', textAlign: 'center', padding: 24 }}>{t('hostLoadingListings')}</p>
            )}
            {hostId && listingsLoad === 'error' && (
              <p style={{ color: '#b91c1c', textAlign: 'center', padding: 24 }}>{t('hostCouldNotLoadListings')}</p>
            )}
            {hostId && listingsLoad === 'ok' && myListings.length === 0 && (
              <div
                style={{
                  textAlign: 'center',
                  padding: '48px 24px',
                  background: 'white',
                  border: '1px solid #e5e7eb',
                  borderRadius: 16,
                }}
              >
                <Car size={40} color="#d1d5db" style={{ margin: '0 auto 12px' }} />
                <p style={{ fontWeight: 600, color: '#111', marginBottom: 8 }}>{t('hostNoListingsTitle')}</p>
                <p style={{ color: '#6b7280', fontSize: 14, marginBottom: 20 }}>{t('hostNoListingsBody')}</p>
                <Btn onClick={openAddListing}>
                  <Plus size={16} />
                  {t('addListing')}
                </Btn>
              </div>
            )}
            {hostId &&
              myListings.map((row) => {
                const ui = normalizeListingFromApi(row)
                return (
                  <div
                    key={row.listing_id}
                    style={{
                      border: '1px solid #e5e7eb',
                      borderRadius: 16,
                      padding: 20,
                      display: 'flex',
                      gap: 16,
                      alignItems: 'center',
                      flexWrap: 'wrap',
                      background: 'white',
                      marginBottom: 16,
                    }}
                  >
                    <div
                      style={{
                        width: 64,
                        height: 52,
                        background: lightGreen,
                        borderRadius: 10,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <Car size={24} color={green} />
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', gap: 8, marginBottom: 4, flexWrap: 'wrap' }}>
                        <Tag>{inferParkingType(row.title, t)}</Tag>
                        <Tag color={row.status === 'active' ? '#16a34a' : '#6b7280'}>
                          {row.status === 'active'
                            ? t('hostActive')
                            : row.status === 'inactive'
                              ? t('listingStatusInactive')
                              : row.status}
                        </Tag>
                      </div>
                      <p style={{ fontWeight: 700, fontSize: 15, color: '#111' }}>{row.title}</p>
                      <p style={{ fontSize: 13, color: '#6b7280' }}>
                        ${Number(row.price_per_hour).toFixed(2)}
                        {t('perHour')} · {row.city}
                        {row.walking_distance_min != null
                          ? ` · ${row.walking_distance_min} ${t('minWalkSuffix')}`
                          : ''}
                      </p>
                    </div>
                    <div style={{ display: 'flex', gap: 10 }}>
                      <Btn
                        variant="outline"
                        style={{ padding: '8px 16px', fontSize: 13, borderRadius: 8 }}
                        onClick={() => nav('listing', ui)}
                      >
                        {t('hostView')}
                      </Btn>
                    </div>
                  </div>
                )
              })}
          </div>
        )}

        {hostTab === 'bookings' && (
          <div>
            {!hostId && (
              <div style={{ textAlign: 'center', padding: '48px 24px', color: '#6b7280' }}>
                <p style={{ marginBottom: 16 }}>{t('hostLogInBookings')}</p>
                <Btn onClick={() => nav('login')}>{t('hostLogIn')}</Btn>
              </div>
            )}
            {hostId && bookingsLoad === 'loading' && (
              <p style={{ color: '#6b7280', textAlign: 'center', padding: 24 }}>{t('hostLoadingBookings')}</p>
            )}
            {hostId && bookingsLoad === 'error' && (
              <p style={{ color: '#b91c1c', textAlign: 'center', padding: 24 }}>{t('hostCouldNotLoadBookings')}</p>
            )}
            {hostId && bookingsLoad === 'ok' && hostBookings.length === 0 && (
              <div style={{ textAlign: 'center', padding: '60px 24px', color: '#6b7280' }}>
                <Calendar size={40} color="#d1d5db" style={{ margin: '0 auto 12px' }} />
                <p style={{ fontWeight: 600, color: '#111', marginBottom: 8 }}>{t('hostBookingsTabEmptyTitle')}</p>
                <p style={{ fontSize: 14 }}>{t('hostBookingsTabEmptyBody')}</p>
              </div>
            )}
            {hostId &&
              bookingsLoad === 'ok' &&
              hostBookings.map((b) => (
                <div
                  key={b.booking_id}
                  style={{
                    border: '1px solid #e5e7eb',
                    borderRadius: 16,
                    padding: 20,
                    background: 'white',
                    marginBottom: 14,
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: 16,
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}
                >
                  <div>
                    <p style={{ fontWeight: 700, fontSize: 15, color: '#111' }}>{studentDisplayName(b, t)}</p>
                    <p style={{ fontSize: 13, color: '#6b7280', marginTop: 4 }}>
                      {b.listing_title}
                      {b.listing_city ? ` · ${b.listing_city}` : ''}
                    </p>
                    <p style={{ fontSize: 12, color: '#9ca3af', marginTop: 6 }}>
                      {b.booking_date} · {b.start_time} – {b.end_time}
                    </p>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <p style={{ fontWeight: 800, fontSize: 18, color: '#111' }}>
                      ${Number(b.total_price).toFixed(2)}
                    </p>
                    <div style={{ marginTop: 8 }}>
                      <Tag color={b.booking_status === 'Confirmed' ? '#16a34a' : '#6b7280'}>
                        {b.booking_status === 'Confirmed'
                          ? t('confirmed')
                          : b.booking_status === 'Pending'
                            ? t('pending')
                            : b.booking_status}
                      </Tag>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        )}

        {hostTab === 'messages' && (
          <div style={{ textAlign: 'center', padding: '60px 24px' }}>
            <div
              style={{
                width: 64,
                height: 64,
                borderRadius: '50%',
                background: lightGreen,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 16px',
              }}
            >
              <MessageCircle size={28} color={green} />
            </div>
            <p style={{ fontWeight: 600, color: '#374151', marginBottom: 4 }}>{t('hostMessagesTitle')}</p>
            <p style={{ fontSize: 13, color: '#9ca3af' }}>{t('hostMessagesComing')}</p>
          </div>
        )}
      </div>

      {/* Add listing modal */}
      {addOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.45)',
            zIndex: 100,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 24,
          }}
          onClick={(ev) => ev.target === ev.currentTarget && !saving && setAddOpen(false)}
          onKeyDown={(e) => e.key === 'Escape' && !saving && setAddOpen(false)}
          role="presentation"
        >
          <div
            style={{
              background: 'white',
              borderRadius: 20,
              maxWidth: 480,
              width: '100%',
              maxHeight: '90vh',
              overflow: 'auto',
              padding: 28,
              boxShadow: '0 24px 48px rgba(0,0,0,0.2)',
            }}
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <h2 style={{ fontSize: 20, fontWeight: 800, color: '#111', margin: 0 }}>{t('hostNewListingTitle')}</h2>
              <button
                type="button"
                onClick={() => !saving && setAddOpen(false)}
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: saving ? 'default' : 'pointer',
                  padding: 4,
                }}
                aria-label={t('closeAria')}
              >
                <X size={22} color="#6b7280" />
              </button>
            </div>
            {formError && (
              <p style={{ color: '#b91c1c', fontSize: 14, marginBottom: 12 }}>{formError}</p>
            )}
            <form noValidate onSubmit={submitListing}>
              {[
                ['title', 'hostFormTitleLabel', 'text', true],
                ['description', 'hostFormDescLabel', 'textarea', false],
                ['address', 'hostFormAddressLabel', 'text', true],
                ['city', 'hostFormCityLabel', 'text', true],
                ['postal_code', 'hostFormPostalLabel', 'text', true],
                ['price_per_hour', 'hostFormPriceLabel', 'number', true],
                ['walking_distance_min', 'hostFormWalkLabel', 'number', false],
                ['rules', 'hostFormRulesLabel', 'textarea', false],
              ].map(([name, labelKey, kind, required]) => (
                <label key={name} style={{ display: 'block', marginBottom: 14 }}>
                  <span style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#374151', marginBottom: 6 }}>
                    {t(labelKey)}
                  </span>
                  {kind === 'textarea' ? (
                    <textarea
                      value={form[name]}
                      onChange={(e) => setForm((f) => ({ ...f, [name]: e.target.value }))}
                      required={required}
                      rows={name === 'description' ? 3 : 2}
                      style={{
                        width: '100%',
                        boxSizing: 'border-box',
                        padding: '10px 12px',
                        borderRadius: 10,
                        border: '1px solid #e5e7eb',
                        fontSize: 14,
                        fontFamily: "'Plus Jakarta Sans', sans-serif",
                      }}
                    />
                  ) : (
                    <input
                      type={kind}
                      step={name === 'price_per_hour' ? 'any' : undefined}
                      min={kind === 'number' ? '0' : undefined}
                      value={form[name]}
                      onChange={(e) => setForm((f) => ({ ...f, [name]: e.target.value }))}
                      required={required}
                      style={{
                        width: '100%',
                        boxSizing: 'border-box',
                        padding: '10px 12px',
                        borderRadius: 10,
                        border: '1px solid #e5e7eb',
                        fontSize: 14,
                        fontFamily: "'Plus Jakarta Sans', sans-serif",
                      }}
                    />
                  )}
                </label>
              ))}
              <div style={{ display: 'flex', gap: 12, marginTop: 20, justifyContent: 'flex-end' }}>
                <Btn type="button" variant="outline" onClick={() => setAddOpen(false)} disabled={saving}>
                  {t('hostCancel')}
                </Btn>
                <Btn type="submit" disabled={saving}>
                  {saving ? t('hostSaving') : t('hostPublishListing')}
                </Btn>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
