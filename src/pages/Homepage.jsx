import { useState } from 'react'
import { Search } from 'lucide-react'
import Navbar from '../components/Navbar.jsx'
import { Btn } from '../components/UI.jsx'
import { COLORS } from '../data/listings.js'

const { green, darkGreen, midGreen, lightGreen } = COLORS

export default function HomePage({ nav, locale, setLocale, t, currentUser, logout }) {
  const [searchQuery, setSearchQuery] = useState('State University')

  return (
    <div style={{ minHeight: '100vh', background: '#f9fafb' }}>
      {/* Hero */}
      <div
        style={{
          background: `linear-gradient(160deg, ${darkGreen} 0%, ${midGreen} 50%, #047857 100%)`,
        }}
      >
        <Navbar nav={nav} dark locale={locale} setLocale={setLocale} t={t} currentUser={currentUser} logout={logout} />
        <div
          style={{
            maxWidth: 800,
            margin: '0 auto',
            padding: '80px 24px 120px',
            textAlign: 'center',
          }}
        >
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              background: 'rgba(16,185,129,0.2)',
              border: '1px solid rgba(16,185,129,0.35)',
              borderRadius: 24,
              padding: '6px 16px',
              marginBottom: 24,
            }}
          >
            <div
              style={{ width: 8, height: 8, borderRadius: '50%', background: '#34d399' }}
            />
            <span style={{ color: '#6ee7b7', fontSize: 13, fontWeight: 500 }}>
              {t('nowAvailable')}
            </span>
          </div>

          <h1
            style={{
              color: 'white',
              fontSize: 'clamp(2.5rem, 6vw, 3.75rem)',
              fontWeight: 800,
              lineHeight: 1.1,
              marginBottom: 16,
            }}
          >
            {t('heroTitle1')}
            <br />
            <span style={{ color: '#34d399' }}>{t('heroTitle2')}</span>
          </h1>

          <p
            style={{
              color: '#a7f3d0',
              fontSize: 18,
              maxWidth: 500,
              margin: '0 auto 40px',
              lineHeight: 1.6,
            }}
          >
            {t('heroSub')}
          </p>

          <div
            style={{
              background: 'white',
              borderRadius: 16,
              padding: 8,
              display: 'flex',
              gap: 8,
              maxWidth: 520,
              margin: '0 auto',
              boxShadow: '0 24px 64px rgba(0,0,0,0.3)',
            }}
          >
            <div
              style={{
                flex: 1,
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                padding: '0 12px',
              }}
            >
              <Search size={18} color={green} />
              <input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  flex: 1,
                  fontSize: 14,
                  border: 'none',
                  outline: 'none',
                  color: '#374151',
                  fontFamily: "'Plus Jakarta Sans', sans-serif",
                }}
                placeholder={t('searchPlaceholder')}
              />
            </div>
            <Btn
              onClick={() => nav('search')}
              style={{ padding: '12px 20px', borderRadius: 10 }}
            >
              {t('findParking')}
            </Btn>
          </div>

          <p style={{ color: '#6ee7b7', fontSize: 12, marginTop: 12 }}>
            Popular: State University, City College, Tech Institute
          </p>
        </div>
      </div>

      {/* Stats bar */}
      <div style={{ background: green }}>
        <div
          style={{
            maxWidth: 1000,
            margin: '0 auto',
            padding: '20px 24px',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
            gap: 16,
            textAlign: 'center',
          }}
        >
          {[
            ['12,000+', 'Commuters Served'],
            ['3,400+', 'Spots Listed'],
            ['$70 avg', 'Saved Per Month'],
            ['4.9★', 'Average Rating'],
          ].map(([val, label]) => (
            <div key={label}>
              <div style={{ color: 'white', fontSize: 26, fontWeight: 800 }}>{val}</div>
              <div style={{ color: '#a7f3d0', fontSize: 12, marginTop: 2 }}>{label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* How it works */}
      <div style={{ maxWidth: 1000, margin: '0 auto', padding: '80px 24px' }}>
        <h2
          style={{
            textAlign: 'center',
            fontSize: 32,
            fontWeight: 800,
            color: '#111',
            marginBottom: 8,
          }}
        >
          {t('howItWorksTitle')}
        </h2>
        <p style={{ textAlign: 'center', color: '#6b7280', marginBottom: 60 }}>
          {t('howItWorksSubtitle')}
        </p>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
            gap: 24,
          }}
        >
          {[
            {
              n: '01',
              emoji: '🔍',
              title: t('step1Title'),
              desc: t('step1Desc'),
            },
            {
              n: '02',
              emoji: '📅',
              title: t('step2Title'),
              desc: t('step2Desc'),
            },
            {
              n: '03',
              emoji: '🚗',
              title: t('step3Title'),
              desc: t('step3Desc'),
            },
          ].map((s) => (
            <div
              key={s.n}
              style={{
                background: 'white',
                border: '1px solid #e5e7eb',
                borderRadius: 20,
                padding: '36px 28px',
                textAlign: 'center',
              }}
            >
              <div style={{ fontSize: 40, marginBottom: 16 }}>{s.emoji}</div>
              <div
                style={{
                  background: lightGreen,
                  color: green,
                  fontSize: 12,
                  fontWeight: 700,
                  width: 36,
                  height: 36,
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 12px',
                }}
              >
                {s.n}
              </div>
              <h3 style={{ fontWeight: 700, fontSize: 17, color: '#111', marginBottom: 8 }}>
                {s.title}
              </h3>
              <p style={{ color: '#6b7280', fontSize: 14, lineHeight: 1.6 }}>{s.desc}</p>
            </div>
          ))}
        </div>

        <div style={{ textAlign: 'center', marginTop: 48 }}>
          <Btn
            onClick={() => nav('search')}
            style={{ fontSize: 16, padding: '16px 40px', borderRadius: 50 }}
          >
            {t('findParkingNow')}
          </Btn>
        </div>
      </div>

      {/* Why SpotShare */}
      <div style={{ background: '#f0fdf4', padding: '64px 24px' }}>
        <div style={{ maxWidth: 1000, margin: '0 auto' }}>
          <h2
            style={{
              textAlign: 'center',
              fontSize: 28,
              fontWeight: 800,
              color: '#111',
              marginBottom: 48,
            }}
          >
            Why Students Love SpotShare
          </h2>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: 20,
            }}
          >
            {[
              { e: '💰', t: 'Save Money', d: 'Up to 70% cheaper than campus permits' },
              { e: '⚡', t: 'Instant Booking', d: 'Reserve in under 2 minutes' },
              { e: '🗺️', t: 'Close to Campus', d: 'All spots within 15 min walk' },
              { e: '🔒', t: 'Secure Payments', d: 'Encrypted and protected' },
            ].map((item) => (
              <div
                key={item.t}
                style={{
                  background: 'white',
                  borderRadius: 16,
                  padding: 24,
                  textAlign: 'center',
                  border: '1px solid #e5e7eb',
                }}
              >
                <div style={{ fontSize: 32, marginBottom: 12 }}>{item.e}</div>
                <p style={{ fontWeight: 700, fontSize: 15, color: '#111', marginBottom: 6 }}>
                  {item.t}
                </p>
                <p style={{ fontSize: 13, color: '#6b7280' }}>{item.d}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div
        style={{
          background: darkGreen,
          padding: '48px 24px',
          textAlign: 'center',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            justifyContent: 'center',
            marginBottom: 8,
          }}
        >
          <div
            style={{
              background: green,
              width: 32,
              height: 32,
              borderRadius: 8,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <span style={{ fontSize: 16 }}>📍</span>
          </div>
          <span style={{ fontWeight: 800, fontSize: 20, color: 'white' }}>
            Spot<span style={{ color: '#34d399' }}>Share</span>
          </span>
        </div>
        <p style={{ color: '#6ee7b7', fontSize: 13 }}>
          © 2026 SpotShare. All rights reserved.
        </p>
        <div
          style={{
            display: 'flex',
            gap: 24,
            justifyContent: 'center',
            marginTop: 16,
          }}
        >
          {['Privacy Policy', 'Terms of Service', 'Contact Us'].map((l) => (
            <button
              key={l}
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                color: '#6ee7b7',
                fontSize: 13,
                fontFamily: "'Plus Jakarta Sans', sans-serif",
              }}
            >
              {l}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
