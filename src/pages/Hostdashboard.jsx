import { useState } from 'react'
import { Plus, DollarSign, Calendar, Star, Check, Car, MessageCircle } from 'lucide-react'
import Navbar from '../components/Navbar.jsx'
import { Btn, Tag } from '../components/UI.jsx'
import { COLORS } from '../data/listings.js'

const { green, lightGreen } = COLORS

const HOST_BOOKINGS = [
  {
    name: 'Alex Chen',
    initials: 'AC',
    listing: 'Private Driveway — Oak Street',
    date: 'Mar 16, 2026',
    time: '8:00 AM – 5:00 PM',
    amount: '$40.50',
    status: 'Pending',
  },
  {
    name: 'Priya Singh',
    initials: 'PS',
    listing: 'Private Driveway — Oak Street',
    date: 'Mar 18, 2026',
    time: '9:00 AM – 1:00 PM',
    amount: '$18.00',
    status: 'Confirmed',
  },
]

export default function HostDashboard({ nav, locale, setLocale, t, currentUser, logout }) {
  const [hostTab, setHostTab] = useState('overview')
  const [bookings, setBookings] = useState(HOST_BOOKINGS)

  const accept = (idx) => {
    setBookings((prev) =>
      prev.map((b, i) => (i === idx ? { ...b, status: 'Confirmed' } : b))
    )
  }
  const decline = (idx) => {
    setBookings((prev) => prev.filter((_, i) => i !== idx))
  }

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
              SM
            </div>
            <div>
              <p style={{ fontSize: 12, color: '#6b7280' }}>{t('hostDashboardTitle')}</p>
              <p style={{ fontWeight: 800, fontSize: 20, color: '#111' }}>
                {t('helloHost') || 'Hello, Sarah M. 👋'}
              </p>
            </div>
          </div>
          <Btn style={{ padding: '10px 20px' }}>
            <Plus size={16} />
            {t('addListing') || 'Add Listing'}
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
            ['$410', 'Monthly earnings', DollarSign],
            ['1', 'Active listings', Car],
            ['93', 'Total bookings', Calendar],
            ['4.9★', 'Overall rating', Star],
          ].map(([val, label, Icon]) => (
            <div
              key={label}
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
        <div style={{ display: 'flex', borderBottom: '1px solid #e5e7eb', marginBottom: 24 }}>
          {[
            ['overview', t('overview')],
            ['my listings', t('myListings')],
            ['bookings', t('bookings')],
            ['messages', t('messagesText')],
          ].map(([tab, label]) => (
            <button
              key={t}
              onClick={() => setHostTab(t)}
              style={{
                padding: '12px 20px',
                border: 'none',
                cursor: 'pointer',
                background: 'none',
                fontWeight: hostTab === t ? 600 : 400,
                fontSize: 14,
                color: hostTab === t ? green : '#6b7280',
                borderBottom: hostTab === t ? `2px solid ${green}` : '2px solid transparent',
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
                Upcoming Bookings
              </h3>
              {bookings.map((b, i) => (
                <div
                  key={i}
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
                      gap: 12,
                      alignItems: 'center',
                      marginBottom: 12,
                      flexWrap: 'wrap',
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
                        fontSize: 13,
                        fontWeight: 700,
                        color: green,
                        flexShrink: 0,
                      }}
                    >
                      {b.initials}
                    </div>
                    <div style={{ flex: 1 }}>
                      <p style={{ fontWeight: 600, fontSize: 14, color: '#111' }}>
                        {b.name}
                      </p>
                      <p style={{ fontSize: 12, color: '#6b7280' }}>{b.listing}</p>
                      <p style={{ fontSize: 12, color: '#6b7280' }}>
                        {b.date} · {b.time}
                      </p>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <span style={{ fontWeight: 700, color: '#111', fontSize: 15 }}>
                        {b.amount}
                      </span>
                      <br />
                      <Tag
                        color={b.status === 'Pending' ? '#d97706' : '#10b981'}
                      >
                        {b.status}
                      </Tag>
                    </div>
                  </div>
                  {b.status === 'Pending' && (
                    <div style={{ display: 'flex', gap: 10 }}>
                      <Btn
                        onClick={() => accept(i)}
                        style={{ padding: '8px 20px', fontSize: 13, borderRadius: 8 }}
                      >
                        <Check size={13} />
                        Accept
                      </Btn>
                      <button
                        onClick={() => decline(i)}
                        style={{
                          background: 'none',
                          border: '1px solid #e5e7eb',
                          cursor: 'pointer',
                          padding: '8px 20px',
                          borderRadius: 8,
                          fontSize: 13,
                          color: '#ef4444',
                          fontWeight: 500,
                          fontFamily: "'Plus Jakarta Sans', sans-serif",
                        }}
                      >
                        ✕ Decline
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Availability calendar */}
            <div
              style={{
                background: 'white',
                border: '1px solid #e5e7eb',
                borderRadius: 20,
                padding: 24,
              }}
            >
              <h3 style={{ fontWeight: 700, fontSize: 15, color: '#111', marginBottom: 4 }}>
                Manage Availability
              </h3>
              <p style={{ fontSize: 13, color: '#6b7280', marginBottom: 16 }}>
                Private Driveway — Oak Street
              </p>

              <p style={{ fontWeight: 600, fontSize: 14, color: '#111', marginBottom: 12, textAlign: 'center' }}>
                March 2026
              </p>

              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(7, 1fr)',
                  gap: 4,
                  textAlign: 'center',
                }}
              >
                {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map((d) => (
                  <div
                    key={d}
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
                {/* Offset for Mar 1 = Sunday */}
                {Array.from({ length: 31 }, (_, idx) => idx + 1).map((d) => {
                  const blocked = [23, 24, 25].includes(d)
                  const active = [16, 17, 18, 19, 20].includes(d)
                  return (
                    <button
                      key={d}
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
                        background: blocked
                          ? '#fecaca'
                          : active
                          ? lightGreen
                          : 'transparent',
                        color: blocked ? '#dc2626' : active ? green : '#374151',
                        fontWeight: active || blocked ? 600 : 400,
                        fontFamily: "'Plus Jakarta Sans', sans-serif",
                      }}
                    >
                      {d}
                    </button>
                  )
                })}
              </div>

              <div style={{ display: 'flex', gap: 16, marginTop: 14 }}>
                <span
                  style={{
                    display: 'flex',
                    gap: 6,
                    alignItems: 'center',
                    fontSize: 12,
                    color: '#6b7280',
                  }}
                >
                  <div
                    style={{
                      width: 12,
                      height: 12,
                      borderRadius: 3,
                      background: lightGreen,
                    }}
                  />
                  Available
                </span>
                <span
                  style={{
                    display: 'flex',
                    gap: 6,
                    alignItems: 'center',
                    fontSize: 12,
                    color: '#6b7280',
                  }}
                >
                  <div
                    style={{
                      width: 12,
                      height: 12,
                      borderRadius: 3,
                      background: '#fecaca',
                    }}
                  />
                  Blocked
                </span>
              </div>
              <p style={{ fontSize: 11, color: '#9ca3af', marginTop: 8 }}>
                Click a date to toggle availability
              </p>
            </div>
          </div>
        )}

        {/* My Listings tab */}
        {hostTab === 'my listings' && (
          <div>
            <div
              style={{
                border: '1px solid #e5e7eb',
                borderRadius: 16,
                padding: 20,
                display: 'flex',
                gap: 16,
                alignItems: 'center',
                flexWrap: 'wrap',
                background: 'white',
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
                <div style={{ display: 'flex', gap: 8, marginBottom: 4 }}>
                  <Tag>Driveway</Tag>
                  <Tag color="#16a34a">Active</Tag>
                </div>
                <p style={{ fontWeight: 700, fontSize: 15, color: '#111' }}>
                  Private Driveway — Oak Street
                </p>
                <p style={{ fontSize: 13, color: '#6b7280' }}>
                  $4.50/hr · University District · 3 min walk
                </p>
              </div>
              <div style={{ display: 'flex', gap: 10 }}>
                <Btn
                  variant="outline"
                  style={{ padding: '8px 16px', fontSize: 13, borderRadius: 8 }}
                >
                  Edit
                </Btn>
                <Btn style={{ padding: '8px 16px', fontSize: 13, borderRadius: 8 }}>
                  View
                </Btn>
              </div>
            </div>
          </div>
        )}

        {/* Bookings + Messages placeholder */}
        {(hostTab === 'bookings' || hostTab === 'messages') && (
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
              {hostTab === 'bookings' ? (
                <Calendar size={28} color={green} />
              ) : (
                <MessageCircle size={28} color={green} />
              )}
            </div>
            <p style={{ fontWeight: 600, color: '#374151', marginBottom: 4 }}>
              {hostTab === 'bookings'
                ? 'All 93 bookings are visible here'
                : 'Your messages with students appear here'}
            </p>
            <p style={{ fontSize: 13, color: '#9ca3af' }}>
              Switch to Overview to see pending actions
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
