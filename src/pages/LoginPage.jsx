import { useState } from 'react'
import Navbar from '../components/Navbar.jsx'
import { Btn } from '../components/UI.jsx'
import { COLORS } from '../data/listings.js'

const { green } = COLORS

export default function LoginPage({
  nav,
  completeLogin,
  locale,
  setLocale,
  t,
  currentUser,
  logout,
}) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    if (!email.trim() || !password.trim()) return
    setSubmitting(true)
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim(), password }),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) {
        setError(data.error || t('loginErrorGeneric'))
        return
      }
      completeLogin({
        userId: data.user?.userId,
        firstName: data.user?.firstName,
        lastName: data.user?.lastName,
        email: data.user?.email,
      })
    } catch {
      setError(t('loginErrorNetwork'))
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div style={{ minHeight: '100vh', background: '#f9fafb' }}>
      <Navbar nav={nav} locale={locale} setLocale={setLocale} t={t} currentUser={currentUser} logout={logout} />
      <div
        style={{
          maxWidth: 420,
          margin: '0 auto',
          padding: '48px 24px',
        }}
      >
        <h1
          style={{
            fontSize: 28,
            fontWeight: 800,
            color: '#111',
            marginBottom: 8,
            textAlign: 'center',
          }}
        >
          {t('loginTitle')}
        </h1>
        <p style={{ color: '#6b7280', textAlign: 'center', marginBottom: 32, fontSize: 15 }}>
          {t('loginSubtitle')}
        </p>

        {error && (
          <p
            style={{
              color: '#b91c1c',
              textAlign: 'center',
              marginBottom: 16,
              fontSize: 14,
            }}
          >
            {error}
          </p>
        )}

        <form
          onSubmit={handleSubmit}
          style={{
            background: 'white',
            border: '1px solid #e5e7eb',
            borderRadius: 20,
            padding: 28,
          }}
        >
          <label style={{ display: 'block', marginBottom: 6, fontSize: 13, fontWeight: 600, color: '#374151' }}>
            {t('emailLabel')}
          </label>
          <input
            type="email"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={{
              width: '100%',
              boxSizing: 'border-box',
              marginBottom: 18,
              padding: '12px 14px',
              borderRadius: 10,
              border: '1px solid #e5e7eb',
              fontSize: 15,
              fontFamily: "'Plus Jakarta Sans', sans-serif",
            }}
          />

          <label style={{ display: 'block', marginBottom: 6, fontSize: 13, fontWeight: 600, color: '#374151' }}>
            {t('passwordLabel')}
          </label>
          <input
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={{
              width: '100%',
              boxSizing: 'border-box',
              marginBottom: 24,
              padding: '12px 14px',
              borderRadius: 10,
              border: '1px solid #e5e7eb',
              fontSize: 15,
              fontFamily: "'Plus Jakarta Sans', sans-serif",
            }}
          />

          <Btn
            type="submit"
            disabled={submitting}
            style={{ width: '100%', justifyContent: 'center', padding: '14px', opacity: submitting ? 0.7 : 1 }}
          >
            {submitting ? '…' : t('submitLogin')}
          </Btn>
        </form>

        <p style={{ textAlign: 'center', marginTop: 24, fontSize: 14, color: '#6b7280' }}>
          {t('needAccount')}{' '}
          <button
            type="button"
            onClick={() => nav('signup')}
            style={{
              background: 'none',
              border: 'none',
              color: green,
              fontWeight: 600,
              cursor: 'pointer',
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              fontSize: 14,
            }}
          >
            {t('signUp')}
          </button>
        </p>
      </div>
    </div>
  )
}
