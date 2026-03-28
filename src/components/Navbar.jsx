import { useState } from 'react'
import { MapPin, Menu, X } from 'lucide-react'
import { COLORS } from '../data/listings.js'

const { green, darkGreen, midGreen, lightGreen } = COLORS

export default function Navbar({
  nav,
  dark = false,
  locale = 'en',
  setLocale = () => {},
  t = (k) => k,
  currentUser = null,
  logout = () => {},
}) {
  const [mobileMenu, setMobileMenu] = useState(false)

  const navbarLinks = [
    [t('findParking'), 'search'],
    [t('howItWorks'), 'home'],
    [t('help'), 'faq'],
  ]

  const mobileLinksLoggedOut = [
    [t('findParking'), 'search'],
    [t('listYourSpace'), 'host-dashboard'],
    [t('logIn'), 'login'],
    [t('signUp'), 'signup'],
    [t('help'), 'faq'],
  ]

  const mobileLinksLoggedIn = [
    [t('findParking'), 'search'],
    [t('dashboard'), 'student-dashboard'],
    [t('listYourSpace'), 'host-dashboard'],
    [t('logOut'), '__logout__'],
    [t('help'), 'faq'],
  ]

  const mobileLinks = currentUser ? mobileLinksLoggedIn : mobileLinksLoggedOut

  const initials = currentUser
    ? `${(currentUser.firstName || '?')[0] || ''}${(currentUser.lastName || '?')[0] || ''}`.toUpperCase()
    : ''

  const languageContext = locale === 'en' ? 'fr' : 'en'

  const goMobile = (target) => {
    if (target === '__logout__') logout()
    else nav(target)
    setMobileMenu(false)
  }

  return (
    <nav
      style={{
        background: dark ? darkGreen : 'white',
        borderBottom: dark ? 'none' : '1px solid #e5e7eb',
        position: 'sticky',
        top: 0,
        zIndex: 50,
      }}
    >
      <div
        style={{
          maxWidth: 1100,
          margin: '0 auto',
          padding: '0 1.5rem',
          height: 60,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        {/* Logo */}
        <div
          style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}
          onClick={() => nav('home')}
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
            <MapPin size={16} color="white" />
          </div>
          <span style={{ fontWeight: 700, fontSize: 18, color: dark ? 'white' : '#111' }}>
            Spot<span style={{ color: green }}>Share</span>
          </span>
        </div>

        {/* Desktop links */}
        <div
          style={{ display: 'flex', alignItems: 'center', gap: 24 }}
          className="desktop-nav"
        >
          {navbarLinks.map(([label, target]) => (
            <button
              key={label}
              onClick={() => nav(target)}
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                fontSize: 14,
                color: dark ? 'rgba(255,255,255,0.85)' : '#4b5563',
                fontFamily: "'Plus Jakarta Sans', sans-serif",
              }}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Desktop actions */}
        <div
          style={{ display: 'flex', alignItems: 'center', gap: 12 }}
          className="desktop-nav"
        >
          <button
            onClick={() => setLocale(languageContext)}
            style={{
              background: 'none',
              border: '1px solid rgba(107,114,128,0.3)',
              cursor: 'pointer',
              fontSize: 13,
              color: dark ? 'rgba(255,255,255,0.85)' : '#374151',
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              padding: '6px 10px',
              borderRadius: 10,
            }}
          >
            {locale === 'en' ? 'FR' : 'EN'}
          </button>

          <button
            onClick={() => nav('host-dashboard')}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              fontSize: 14,
              color: dark ? 'rgba(255,255,255,0.8)' : '#374151',
              fontFamily: "'Plus Jakarta Sans', sans-serif",
            }}
          >
            {t('listYourSpace')}
          </button>

          {!currentUser ? (
            <>
              <button
                onClick={() => nav('login')}
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: 14,
                  color: dark ? 'rgba(255,255,255,0.8)' : '#374151',
                  fontFamily: "'Plus Jakarta Sans', sans-serif",
                }}
              >
                {t('logIn')}
              </button>
              <button
                onClick={() => nav('signup')}
                style={{
                  background: green,
                  color: 'white',
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: 14,
                  fontWeight: 600,
                  padding: '8px 20px',
                  borderRadius: 24,
                  fontFamily: "'Plus Jakarta Sans', sans-serif",
                }}
              >
                {t('signUp')}
              </button>
            </>
          ) : (
            <>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  paddingRight: 4,
                }}
                title={currentUser.email}
              >
                <span
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: '50%',
                    background: dark ? 'rgba(255,255,255,0.15)' : lightGreen,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 12,
                    fontWeight: 700,
                    color: dark ? 'white' : green,
                  }}
                >
                  {initials}
                </span>
                <span
                  style={{
                    fontSize: 13,
                    fontWeight: 600,
                    color: dark ? 'rgba(255,255,255,0.95)' : '#111',
                    maxWidth: 120,
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {currentUser.firstName}
                </span>
              </div>
              <button
                onClick={() => nav('student-dashboard')}
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: 14,
                  fontWeight: 600,
                  color: dark ? 'rgba(255,255,255,0.9)' : green,
                  fontFamily: "'Plus Jakarta Sans', sans-serif",
                }}
              >
                {t('dashboard')}
              </button>
              <button
                onClick={logout}
                style={{
                  background: dark ? 'rgba(255,255,255,0.1)' : 'white',
                  color: dark ? 'rgba(255,255,255,0.9)' : '#374151',
                  border: dark ? '1px solid rgba(255,255,255,0.25)' : '1px solid #e5e7eb',
                  cursor: 'pointer',
                  fontSize: 14,
                  fontWeight: 500,
                  padding: '8px 16px',
                  borderRadius: 24,
                  fontFamily: "'Plus Jakarta Sans', sans-serif",
                }}
              >
                {t('logOut')}
              </button>
            </>
          )}
        </div>

        {/* Mobile burger */}
        <button
          onClick={() => setMobileMenu(!mobileMenu)}
          style={{ background: 'none', border: 'none', cursor: 'pointer' }}
          className="mobile-nav"
        >
          {mobileMenu ? (
            <X size={24} color={dark ? 'white' : '#111'} />
          ) : (
            <Menu size={24} color={dark ? 'white' : '#111'} />
          )}
        </button>
      </div>

      {/* Mobile dropdown */}
      {mobileMenu && (
        <div
          style={{
            background: dark ? midGreen : 'white',
            borderTop: '1px solid #e5e7eb',
            padding: '1rem 1.5rem',
            display: 'flex',
            flexDirection: 'column',
            gap: 16,
          }}
        >
          {mobileLinks.map(([l, target]) => (
            <button
              key={`${l}-${target}`}
              onClick={() => goMobile(target)}
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                textAlign: 'left',
                fontSize: 15,
                color: dark ? 'white' : '#374151',
                fontFamily: "'Plus Jakarta Sans', sans-serif",
              }}
            >
              {l}
            </button>
          ))}
        </div>
      )}

      <style>{`
        @media (max-width: 768px) {
          .desktop-nav { display: none !important; }
          .mobile-nav { display: flex !important; }
        }
        @media (min-width: 769px) {
          .mobile-nav { display: none !important; }
        }
      `}</style>
    </nav>
  )
}
