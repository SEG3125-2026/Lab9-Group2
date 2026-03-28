import { useState, useEffect } from 'react'
import {
  Calendar, Clock, MapPin, Navigation, MessageCircle,
  Heart, DollarSign, Plus, Star, Car
} from 'lucide-react'
import Navbar from '../components/Navbar.jsx'
import { Btn, Tag } from '../components/UI.jsx'
import { COLORS } from '../data/listings.js'
import { fetchListings } from '../utils/listingApi.js'

const { green, lightGreen } = COLORS

function parseBookingDate(dateStr) {
  if (!dateStr) return null
  const d = new Date(dateStr)
  return Number.isNaN(d.getTime()) ? null : d
}

function isSameCalendarMonth(date, ref) {
  return date.getMonth() === ref.getMonth() && date.getFullYear() === ref.getFullYear()
}

/** e.g. "3 min walk" -> 3 */
function parseWalkMinutes(walk) {
  const m = String(walk || '').match(/(\d+)/)
  return m ? Number(m[1]) : null
}

export default function StudentDashboard({ nav, savedListings, toggleSave, messages, setMessages, locale, setLocale, t, currentUser, logout, studentBookings }) {
  const [activeTab, setActiveTab] = useState('upcoming')
  const [msgText, setMsgText] = useState('')
  const [catalog, setCatalog] = useState([])

  useEffect(() => {
    fetchListings()
      .then(setCatalog)
      .catch(() => setCatalog([]))
  }, [])

  const sendMsg = () => {
    if (!msgText.trim()) return
    setMessages((prev) => [...prev, { from: 'student', text: msgText, time: t('now') }])
    setMsgText('')
  }

  const allBookings = studentBookings || []
  const upcomingBookings = allBookings.filter((b) => b.status === 'Confirmed')
  const pastBookings = allBookings.filter((b) => b.status === 'Completed')
  const hasBookedBefore = allBookings.length > 0
  const saved = catalog.filter((l) => savedListings.includes(l.id))

  const now = new Date()
  const bookingsThisMonth = allBookings.filter((b) => {
    const d = parseBookingDate(b.date)
    return d && isSameCalendarMonth(d, now)
  })
  const countThisMonth = bookingsThisMonth.length
  const hoursThisMonth = bookingsThisMonth.reduce((s, b) => s + (Number(b.hours) || 0), 0)
  const spentThisMonth = bookingsThisMonth.reduce((s, b) => s + (Number(b.total) || 0), 0)
  const walkMinutesThisMonth = bookingsThisMonth
    .map((b) => parseWalkMinutes(b.listing?.walk))
    .filter((n) => n != null && !Number.isNaN(n))
  const avgWalkN =
    walkMinutesThisMonth.length > 0
      ? Math.round(walkMinutesThisMonth.reduce((a, x) => a + x, 0) / walkMinutesThisMonth.length)
      : null
  const avgWalkDisplay =
    avgWalkN != null ? t('avgWalkMinutes', { n: avgWalkN }) : '—'

  const statRows = [
    [String(countThisMonth), t('studentStatBookingsMonth'), Car],
    [
      Number.isInteger(hoursThisMonth) ? String(hoursThisMonth) : hoursThisMonth.toFixed(1),
      t('studentStatHoursMonth'),
      Clock,
    ],
    [`$${spentThisMonth.toFixed(2)}`, t('studentStatSpentMonth'), DollarSign],
    [avgWalkDisplay, t('studentStatAvgWalk'), MapPin],
  ]

  return (
    <div style={{ minHeight: '100vh', background: '#f9fafb' }}>
      <Navbar nav={nav} locale={locale} setLocale={setLocale} t={t} currentUser={currentUser} logout={logout} />
      <div style={{ maxWidth: 900, margin: '0 auto', padding: '24px' }}>
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
              {currentUser
                ? `${(currentUser.firstName || '')[0] || ''}${(currentUser.lastName || '')[0] || ''}`.toUpperCase()
                : 'AC'}
            </div>
            <div>
              <p style={{ fontSize: 12, color: '#6b7280' }}>{t('welcomeBack')}</p>
              <p style={{ fontWeight: 800, fontSize: 20, color: '#111' }}>
                {currentUser ? `${currentUser.firstName} ${currentUser.lastName}` : 'Alex Chen'}
              </p>
            </div>
          </div>
          <Btn onClick={() => nav('search')} style={{ padding: '10px 20px' }}>
            <Plus size={16} />
            {t('bookSpot')}
          </Btn>
        </div>

        {/* Stats — only after the user has at least one booking */}
        {hasBookedBefore && (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
              gap: 16,
              marginBottom: 28,
            }}
          >
            {statRows.map(([val, label, Icon]) => (
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
                    width: 28,
                    height: 28,
                    borderRadius: '50%',
                    background: lightGreen,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: 8,
                  }}
                >
                  <Icon size={14} color={green} />
                </div>
                <p style={{ fontWeight: 800, fontSize: 22, color: '#111' }}>{val}</p>
                <p style={{ fontSize: 12, color: '#6b7280', marginTop: 2 }}>{label}</p>
              </div>
            ))}
          </div>
        )}

        {/* Tabs */}
        <div
          style={{
            background: 'white',
            border: '1px solid #e5e7eb',
            borderRadius: 20,
            overflow: 'hidden',
          }}
        >
          <div style={{ display: 'flex', borderBottom: '1px solid #e5e7eb' }}>
            {[
              ['upcoming', t('upcoming')],
              ['past', t('past')],
              ['saved', t('saved')],
              ['messages', t('messagesText')],
            ].map(([tab, label]) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                style={{
                  flex: 1,
                  padding: '14px 8px',
                  border: 'none',
                  cursor: 'pointer',
                  background: 'none',
                  fontWeight: activeTab === tab ? 600 : 400,
                  fontSize: 14,
                  color: activeTab === tab ? green : '#6b7280',
                  borderBottom: activeTab === tab ? `2px solid ${green}` : '2px solid transparent',
                  fontFamily: "'Plus Jakarta Sans', sans-serif",
                }}
              >
                {label}
              </button>
            ))}
          </div>

          <div style={{ padding: 24 }}>
            {/* Upcoming */}
            {activeTab === 'upcoming' &&
              (upcomingBookings.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '40px 0' }}>
                  <Car size={40} color="#d1d5db" style={{ margin: '0 auto 12px' }} />
                  <p style={{ color: '#6b7280', marginBottom: 8 }}>{t('studentNoUpcomingTitle')}</p>
                  <p style={{ color: '#9ca3af', fontSize: 14, maxWidth: 360, margin: '0 auto 16px' }}>
                    {t('studentNoUpcomingBody')}
                  </p>
                  <Btn onClick={() => nav('search')} style={{ marginTop: 8 }}>
                    {t('findParking')}
                  </Btn>
                </div>
              ) : (
                upcomingBookings.map((b) => (
                <div
                  key={b.id}
                  style={{
                    border: '1px solid #e5e7eb',
                    borderRadius: 16,
                    padding: 20,
                    marginBottom: 16,
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      gap: 16,
                      marginBottom: 16,
                      flexWrap: 'wrap',
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
                        flexShrink: 0,
                      }}
                    >
                      <Car size={24} color={green} />
                    </div>
                    <div style={{ flex: 1 }}>
                      <div
                        style={{
                          display: 'flex',
                          gap: 8,
                          alignItems: 'center',
                          flexWrap: 'wrap',
                          marginBottom: 4,
                        }}
                      >
                        <Tag color={green}>
                          {b.status === 'Confirmed'
                            ? t('confirmed')
                            : b.status === 'Completed'
                              ? t('bookingStatusCompleted')
                              : b.status}
                        </Tag>
                        <span style={{ fontSize: 12, color: '#9ca3af' }}>#{b.id}</span>
                      </div>
                      <p
                        style={{
                          fontWeight: 700,
                          fontSize: 15,
                          color: '#111',
                          marginBottom: 4,
                        }}
                      >
                        {b.listing.name}
                      </p>
                      <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
                        <span
                          style={{
                            fontSize: 12,
                            color: '#6b7280',
                            display: 'flex',
                            gap: 4,
                            alignItems: 'center',
                          }}
                        >
                          <Calendar size={11} />
                          {b.date}
                        </span>
                        <span
                          style={{
                            fontSize: 12,
                            color: '#6b7280',
                            display: 'flex',
                            gap: 4,
                            alignItems: 'center',
                          }}
                        >
                          <Clock size={11} />
                          {b.start} – {b.end}
                        </span>
                        <span
                          style={{
                            fontSize: 12,
                            color: '#6b7280',
                            display: 'flex',
                            gap: 4,
                            alignItems: 'center',
                          }}
                        >
                          <Navigation size={11} />
                          {b.listing.walk}
                        </span>
                      </div>
                    </div>
                    <div style={{ fontWeight: 800, fontSize: 18, color: '#111' }}>
                      ${b.total.toFixed(2)}
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                    <Btn
                      onClick={() => setActiveTab('messages')}
                      variant="outline"
                      style={{ padding: '8px 16px', fontSize: 13, borderRadius: 8 }}
                    >
                      <MessageCircle size={13} />
                      {t('studentMessageHost')}
                    </Btn>
                    <Btn
                      variant="outline"
                      style={{ padding: '8px 16px', fontSize: 13, borderRadius: 8 }}
                    >
                      <Navigation size={13} />
                      {t('studentDirections')}
                    </Btn>
                    <button
                      style={{
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        fontSize: 13,
                        color: '#ef4444',
                        fontWeight: 500,
                        padding: '8px 16px',
                        fontFamily: "'Plus Jakarta Sans', sans-serif",
                      }}
                    >
                      {t('studentCancelBooking')}
                    </button>
                  </div>
                </div>
              ))
              )
            )}

            {/* Past */}
            {activeTab === 'past' &&
              (pastBookings.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '40px 0' }}>
                  <Car size={40} color="#d1d5db" style={{ margin: '0 auto 12px' }} />
                  <p style={{ color: '#6b7280' }}>{t('studentNoPastTitle')}</p>
                </div>
              ) : (
                pastBookings.map((b) => (
                <div
                  key={b.id}
                  style={{
                    border: '1px solid #e5e7eb',
                    borderRadius: 16,
                    padding: 20,
                    marginBottom: 16,
                    opacity: 0.85,
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      gap: 16,
                      flexWrap: 'wrap',
                      alignItems: 'center',
                    }}
                  >
                    <div
                      style={{
                        width: 64,
                        height: 52,
                        background: '#f3f4f6',
                        borderRadius: 10,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                      }}
                    >
                      <Car size={24} color="#9ca3af" />
                    </div>
                    <div style={{ flex: 1 }}>
                      <Tag color="#6b7280">
                        {b.status === 'Confirmed'
                          ? t('confirmed')
                          : b.status === 'Completed'
                            ? t('bookingStatusCompleted')
                            : b.status}
                      </Tag>
                      <p
                        style={{
                          fontWeight: 700,
                          fontSize: 15,
                          color: '#111',
                          marginTop: 4,
                        }}
                      >
                        {b.listing.name}
                      </p>
                      <span style={{ fontSize: 12, color: '#6b7280' }}>
                        {b.date} · {b.start} – {b.end}
                      </span>
                    </div>
                    <div>
                      <div
                        style={{
                          fontWeight: 700,
                          fontSize: 16,
                          color: '#111',
                          textAlign: 'right',
                        }}
                      >
                        ${b.total.toFixed(2)}
                      </div>
                      <button
                        style={{
                          background: 'none',
                          border: 'none',
                          cursor: 'pointer',
                          fontSize: 12,
                          color: green,
                          fontWeight: 500,
                          fontFamily: "'Plus Jakarta Sans', sans-serif",
                        }}
                      >
                        {t('studentLeaveReview')}
                      </button>
                    </div>
                  </div>
                </div>
              ))
              )
            )}

            {/* Saved */}
            {activeTab === 'saved' &&
              (saved.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '40px 0' }}>
                  <Heart size={40} color="#d1d5db" style={{ margin: '0 auto 12px' }} />
                  <p style={{ color: '#6b7280' }}>{t('studentNoSavedTitle')}</p>
                  <Btn onClick={() => nav('search')} style={{ marginTop: 16 }}>
                    {t('studentBrowseSpots')}
                  </Btn>
                </div>
              ) : (
                saved.map((l) => (
                  <div
                    key={l.id}
                    style={{
                      border: '1px solid #e5e7eb',
                      borderRadius: 16,
                      padding: 20,
                      marginBottom: 16,
                      display: 'flex',
                      gap: 16,
                      alignItems: 'center',
                      flexWrap: 'wrap',
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
                      <p style={{ fontWeight: 700, fontSize: 15, color: '#111' }}>
                        {l.name}
                      </p>
                      <span style={{ fontSize: 12, color: '#6b7280' }}>
                        ${l.price}
                        {t('perHour')} · {l.walk}
                      </span>
                    </div>
                    <Btn
                      onClick={() => nav('listing', l)}
                      style={{ padding: '8px 16px', fontSize: 13, borderRadius: 8 }}
                    >
                      {t('bookNow')}
                    </Btn>
                    <button
                      onClick={() => toggleSave(l.id)}
                      style={{ background: 'none', border: 'none', cursor: 'pointer' }}
                    >
                      <Heart size={18} fill="#ef4444" color="#ef4444" />
                    </button>
                  </div>
                ))
              ))}

            {/* Messages */}
            {activeTab === 'messages' && (
              <div>
                <div
                  style={{
                    display: 'flex',
                    gap: 12,
                    alignItems: 'center',
                    marginBottom: 20,
                    padding: 16,
                    background: '#f9fafb',
                    borderRadius: 12,
                  }}
                >
                  <div
                    style={{
                      width: 40,
                      height: 40,
                      borderRadius: '50%',
                      background: lightGreen,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: 14,
                      fontWeight: 700,
                      color: green,
                    }}
                  >
                    SM
                  </div>
                  <div>
                    <p style={{ fontWeight: 600, fontSize: 14, color: '#111' }}>
                      {t('studentChatPreviewTitle')}
                    </p>
                    <p style={{ fontSize: 12, color: green }}>{t('studentOnline')}</p>
                  </div>
                </div>

                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 12,
                    marginBottom: 20,
                    maxHeight: 240,
                    overflowY: 'auto',
                  }}
                >
                  {messages.map((m, i) => (
                    <div
                      key={i}
                      style={{
                        display: 'flex',
                        justifyContent: m.from === 'student' ? 'flex-end' : 'flex-start',
                      }}
                    >
                      <div
                        style={{
                          background: m.from === 'student' ? green : '#f3f4f6',
                          color: m.from === 'student' ? 'white' : '#111',
                          borderRadius:
                            m.from === 'student'
                              ? '16px 16px 4px 16px'
                              : '16px 16px 16px 4px',
                          padding: '10px 14px',
                          maxWidth: '75%',
                          fontSize: 14,
                        }}
                      >
                        <p>{m.text}</p>
                        <p
                          style={{
                            fontSize: 11,
                            color:
                              m.from === 'student' ? 'rgba(255,255,255,0.7)' : '#9ca3af',
                            marginTop: 4,
                            textAlign: 'right',
                          }}
                        >
                          {m.time}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                <div style={{ display: 'flex', gap: 10 }}>
                  <input
                    value={msgText}
                    onChange={(e) => setMsgText(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') sendMsg()
                    }}
                    placeholder={t('studentTypeMessage')}
                    style={{
                      flex: 1,
                      border: '1px solid #e5e7eb',
                      borderRadius: 10,
                      padding: '10px 14px',
                      fontSize: 14,
                      outline: 'none',
                      fontFamily: "'Plus Jakarta Sans', sans-serif",
                    }}
                  />
                  <Btn onClick={sendMsg} style={{ borderRadius: 10, padding: '10px 18px' }}>
                    {t('studentSend')}
                  </Btn>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
