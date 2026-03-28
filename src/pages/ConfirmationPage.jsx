import { Check, MapPin, Calendar, Clock } from 'lucide-react'
import Navbar from '../components/Navbar.jsx'
import { Btn } from '../components/UI.jsx'
import { COLORS } from '../data/listings.js'

const { green, lightGreen } = COLORS

export default function ConfirmationPage({ nav, selectedListing, locale, setLocale, t, currentUser, logout, lastBooking }) {
  const b = lastBooking
  const l = b?.listing || selectedListing

  if (!b || !l) {
    return (
      <div style={{ minHeight: '100vh', background: '#f9fafb' }}>
        <Navbar nav={nav} locale={locale} setLocale={setLocale} t={t} currentUser={currentUser} logout={logout} />
        <div style={{ maxWidth: 600, margin: '0 auto', padding: '48px 24px', textAlign: 'center' }}>
          <p style={{ color: '#6b7280' }}>No booking to show.</p>
          <Btn onClick={() => nav('search')} style={{ marginTop: 16 }}>
            Find parking
          </Btn>
        </div>
      </div>
    )
  }

  return (
    <div style={{ minHeight: '100vh', background: '#f9fafb' }}>
      <Navbar nav={nav} locale={locale} setLocale={setLocale} t={t} currentUser={currentUser} logout={logout} />
      <div
        style={{
          maxWidth: 600,
          margin: '0 auto',
          padding: '48px 24px',
          textAlign: 'center',
        }}
      >
        {/* Success icon */}
        <div
          style={{
            width: 80,
            height: 80,
            borderRadius: '50%',
            background: lightGreen,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 20px',
          }}
        >
          <Check size={36} color={green} strokeWidth={2.5} />
        </div>

        <h1
          style={{
            fontSize: 32,
            fontWeight: 800,
            color: '#111',
            marginBottom: 8,
          }}
        >
          You're All Set!
        </h1>
        <p style={{ color: '#6b7280', marginBottom: 36 }}>
          Your parking spot has been reserved. Get ready for a stress-free commute.
        </p>

        {/* Booking ID card */}
        <div
          style={{
            background: green,
            borderRadius: 20,
            padding: 24,
            marginBottom: 24,
            textAlign: 'left',
          }}
        >
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-start',
              marginBottom: 16,
            }}
          >
            <div>
              <p
                style={{
                  fontSize: 11,
                  color: '#a7f3d0',
                  textTransform: 'uppercase',
                  fontWeight: 600,
                  marginBottom: 4,
                }}
              >
                Booking Confirmed
              </p>
              <p style={{ fontSize: 24, fontWeight: 800, color: 'white' }}>#{b.id}</p>
            </div>
            <div
              style={{
                width: 40,
                height: 40,
                borderRadius: '50%',
                background: 'rgba(255,255,255,0.2)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Check size={20} color="white" />
            </div>
          </div>
          <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
            <div
              style={{
                width: 32,
                height: 32,
                borderRadius: '50%',
                background: 'rgba(255,255,255,0.2)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 12,
                fontWeight: 700,
                color: 'white',
              }}
            >
              {l.hostAvatar}
            </div>
            <div>
              <p style={{ fontSize: 11, color: '#a7f3d0' }}>SpotShare Host</p>
              <p style={{ fontSize: 14, fontWeight: 600, color: 'white' }}>{l.host}</p>
            </div>
          </div>
        </div>

        {/* Booking details */}
        <div
          style={{
            background: 'white',
            border: '1px solid #e5e7eb',
            borderRadius: 20,
            padding: 24,
            textAlign: 'left',
            marginBottom: 24,
          }}
        >
          {[
            {
              icon: <MapPin size={18} color={green} />,
              label: 'Parking Address',
              val: l.address,
              sub: `${l.area} · ${l.walk} to campus`,
            },
            {
              icon: <Calendar size={18} color={green} />,
              label: 'Date',
              val: b.date,
            },
            {
              icon: <Clock size={18} color={green} />,
              label: 'Time',
              val: `${b.start} – ${b.end}`,
              sub: `${b.hours} hours`,
            },
          ].map((item, i) => (
            <div
              key={i}
              style={{
                display: 'flex',
                gap: 14,
                padding: '14px 0',
                borderBottom: i < 2 ? '1px solid #e5e7eb' : 'none',
              }}
            >
              <div
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: '50%',
                  background: lightGreen,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                {item.icon}
              </div>
              <div>
                <p
                  style={{
                    fontSize: 11,
                    color: '#6b7280',
                    fontWeight: 600,
                    textTransform: 'uppercase',
                    marginBottom: 2,
                  }}
                >
                  {item.label}
                </p>
                <p style={{ fontWeight: 700, fontSize: 15, color: '#111' }}>{item.val}</p>
                {item.sub && (
                  <p style={{ fontSize: 13, color: '#6b7280' }}>{item.sub}</p>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Access instructions */}
        <div
          style={{
            background: '#f0fdf4',
            border: '1px solid #bbf7d0',
            borderRadius: 16,
            padding: 20,
            textAlign: 'left',
            marginBottom: 32,
          }}
        >
          <p
            style={{
              fontWeight: 600,
              fontSize: 14,
              color: '#065f46',
              marginBottom: 6,
            }}
          >
            Access Instructions
          </p>
          <p style={{ fontSize: 13, color: '#374151', lineHeight: 1.6 }}>
            The driveway is on the left side of the house. The gate code is{' '}
            <strong>4521</strong>. Please do not block the garage door.
          </p>
        </div>

        {/* Actions */}
        <div
          style={{
            display: 'flex',
            gap: 12,
            justifyContent: 'center',
            flexWrap: 'wrap',
          }}
        >
          <Btn
            onClick={() => nav('student-dashboard')}
            style={{ padding: '12px 28px' }}
          >
            View Dashboard
          </Btn>
          <Btn
            onClick={() => nav('search')}
            variant="outline"
            style={{ padding: '12px 28px' }}
          >
            Book Another Spot
          </Btn>
        </div>
      </div>
    </div>
  )
}
