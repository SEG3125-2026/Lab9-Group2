import { useState } from 'react'
import { Search, ChevronDown, ChevronUp, Mail, Phone } from 'lucide-react'
import Navbar from '../components/Navbar.jsx'
import { Btn } from '../components/UI.jsx'
import { FAQ_ITEMS, FAQ_ITEMS_FR, COLORS } from '../data/listings.js'

const { green, darkGreen } = COLORS

const CATEGORY_KEYS = [
  'faqCatGettingStarted',
  'faqCatParking',
  'faqCatPayments',
  'faqCatSafety',
  'faqCatHosting',
]

const CATEGORY_EMOJI = ['📘', '🚗', '💳', '🛡️', '🏠']

export default function FAQPage({ nav, locale, setLocale, t, currentUser, logout }) {
  const [expanded, setExpanded] = useState(null)
  const [categoryKey, setCategoryKey] = useState('faqCatGettingStarted')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [issue, setIssue] = useState('')
  const [submitted, setSubmitted] = useState(false)

  const faqItems = locale === 'fr' ? FAQ_ITEMS_FR : FAQ_ITEMS

  const handleSubmit = () => {
    if (!name || !email) return
    setSubmitted(true)
  }

  return (
    <div style={{ minHeight: '100vh', background: '#f9fafb' }}>
      <Navbar nav={nav} locale={locale} setLocale={setLocale} t={t} currentUser={currentUser} logout={logout} />

      <div
        style={{
          background: darkGreen,
          padding: '60px 24px 80px',
          textAlign: 'center',
        }}
      >
        <h1
          style={{
            fontSize: 36,
            fontWeight: 800,
            color: 'white',
            marginBottom: 8,
          }}
        >
          {t('faqTitle')}
        </h1>
        <p style={{ color: '#a7f3d0', marginBottom: 28 }}>{t('faqSubtitle')}</p>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            background: 'white',
            borderRadius: 12,
            padding: '0 16px',
            maxWidth: 480,
            margin: '0 auto',
            height: 48,
          }}
        >
          <Search size={16} color="#9ca3af" />
          <input
            placeholder={t('faqSearchPlaceholder')}
            style={{
              flex: 1,
              border: 'none',
              outline: 'none',
              fontSize: 14,
              color: '#374151',
              fontFamily: "'Plus Jakarta Sans', sans-serif",
            }}
          />
        </div>
      </div>

      <div
        style={{
          maxWidth: 900,
          margin: '-20px auto 0',
          padding: '0 24px',
          position: 'relative',
          zIndex: 1,
        }}
      >
        <div
          style={{
            display: 'flex',
            gap: 12,
            overflowX: 'auto',
            paddingBottom: 8,
            marginBottom: 32,
          }}
        >
          {CATEGORY_KEYS.map((key, idx) => (
            <button
              key={key}
              type="button"
              onClick={() => setCategoryKey(key)}
              style={{
                display: 'flex',
                gap: 8,
                alignItems: 'center',
                background: categoryKey === key ? green : 'white',
                color: categoryKey === key ? 'white' : '#374151',
                border: categoryKey === key ? 'none' : '1px solid #e5e7eb',
                cursor: 'pointer',
                padding: '12px 20px',
                borderRadius: 12,
                fontWeight: 600,
                fontSize: 14,
                whiteSpace: 'nowrap',
                fontFamily: "'Plus Jakarta Sans', sans-serif",
              }}
            >
              {CATEGORY_EMOJI[idx]} {t(key)}
            </button>
          ))}
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'minmax(0,1fr) min(320px, 100%)',
            gap: 24,
            alignItems: 'start',
          }}
        >
          <div>
            <h3
              style={{
                fontWeight: 700,
                fontSize: 18,
                color: '#111',
                marginBottom: 4,
              }}
            >
              {t(categoryKey)}
            </h3>
            <p style={{ fontSize: 13, color: '#6b7280', marginBottom: 20 }}>
              {t('faqArticlesInCategory', { count: faqItems.length })}
            </p>

            {faqItems.map((item, i) => (
              <div
                key={i}
                style={{
                  border: '1px solid #e5e7eb',
                  borderRadius: 12,
                  marginBottom: 10,
                  overflow: 'hidden',
                  background: 'white',
                }}
              >
                <button
                  type="button"
                  onClick={() => setExpanded(expanded === i ? null : i)}
                  style={{
                    width: '100%',
                    padding: '16px 20px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    background: expanded === i ? '#f9fafb' : 'none',
                    border: 'none',
                    cursor: 'pointer',
                    textAlign: 'left',
                    fontFamily: "'Plus Jakarta Sans', sans-serif",
                  }}
                >
                  <span
                    style={{
                      fontSize: 14,
                      fontWeight: 500,
                      color: '#111',
                      paddingRight: 16,
                    }}
                  >
                    {item.q}
                  </span>
                  {expanded === i ? (
                    <ChevronUp size={16} color="#9ca3af" style={{ flexShrink: 0 }} />
                  ) : (
                    <ChevronDown size={16} color="#9ca3af" style={{ flexShrink: 0 }} />
                  )}
                </button>
                {expanded === i && (
                  <div
                    style={{
                      padding: '0 20px 16px',
                      fontSize: 14,
                      color: '#6b7280',
                      lineHeight: 1.7,
                    }}
                  >
                    {item.a}
                  </div>
                )}
              </div>
            ))}
          </div>

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
            <h3
              style={{
                fontWeight: 700,
                fontSize: 16,
                color: '#111',
                marginBottom: 20,
              }}
            >
              {t('faqContactSupport')}
            </h3>

            {submitted ? (
              <div style={{ textAlign: 'center', padding: '24px 0' }}>
                <div
                  style={{
                    width: 48,
                    height: 48,
                    borderRadius: '50%',
                    background: '#d1fae5',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 12px',
                    fontSize: 24,
                  }}
                >
                  ✓
                </div>
                <p style={{ fontWeight: 600, color: '#111', marginBottom: 4 }}>{t('faqMessageSent')}</p>
                <p style={{ fontSize: 13, color: '#6b7280' }}>{t('faqMessageSentSub')}</p>
                <button
                  type="button"
                  onClick={() => setSubmitted(false)}
                  style={{
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    color: green,
                    fontSize: 13,
                    marginTop: 12,
                    fontFamily: "'Plus Jakarta Sans', sans-serif",
                  }}
                >
                  {t('faqSendAnother')}
                </button>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                <input
                  placeholder={t('faqPlaceholderName')}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  style={{
                    width: '100%',
                    border: '1px solid #e5e7eb',
                    borderRadius: 10,
                    padding: '11px 14px',
                    fontSize: 14,
                    outline: 'none',
                    fontFamily: "'Plus Jakarta Sans', sans-serif",
                  }}
                />
                <input
                  placeholder={t('faqPlaceholderEmail')}
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  style={{
                    width: '100%',
                    border: '1px solid #e5e7eb',
                    borderRadius: 10,
                    padding: '11px 14px',
                    fontSize: 14,
                    outline: 'none',
                    fontFamily: "'Plus Jakarta Sans', sans-serif",
                  }}
                />
                <textarea
                  placeholder={t('faqPlaceholderIssue')}
                  rows={4}
                  value={issue}
                  onChange={(e) => setIssue(e.target.value)}
                  style={{
                    width: '100%',
                    border: '1px solid #e5e7eb',
                    borderRadius: 10,
                    padding: '11px 14px',
                    fontSize: 14,
                    outline: 'none',
                    resize: 'vertical',
                    fontFamily: "'Plus Jakarta Sans', sans-serif",
                  }}
                />
                <Btn
                  onClick={handleSubmit}
                  style={{
                    width: '100%',
                    justifyContent: 'center',
                    padding: '13px',
                    borderRadius: 10,
                  }}
                >
                  {t('faqSendMessage')}
                </Btn>
              </div>
            )}

            <hr
              style={{
                border: 'none',
                borderTop: '1px solid #e5e7eb',
                margin: '20px 0',
              }}
            />
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                <Mail size={16} color={green} />
                <span style={{ fontSize: 13, color: '#374151' }}>support@spotshare.com</span>
              </div>
              <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                <Phone size={16} color={green} />
                <span style={{ fontSize: 13, color: '#374151' }}>1-800-SPOT-SHARE</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div style={{ height: 60 }} />
    </div>
  )
}
