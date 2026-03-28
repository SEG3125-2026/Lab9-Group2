import { useState, useEffect } from 'react'
import { ArrowLeft, Check, Calendar, MapPin, CheckCircle, Shield, Info } from 'lucide-react'
import Navbar from '../components/Navbar.jsx'
import { Btn, Tag } from '../components/UI.jsx'
import { COLORS } from '../data/listings.js'

const { green, lightGreen } = COLORS

export default function BookingPage({ nav, selectedListing, locale, setLocale, t, currentUser, logout, completeBooking }) {
  const [step, setStep] = useState(1)
  const [agreed, setAgreed] = useState(false)
  const [paymentMethod, setPaymentMethod] = useState('card')

  useEffect(() => {
    if (!selectedListing) nav('search')
  }, [selectedListing, nav])

  if (!selectedListing) {
    return (
      <div style={{ minHeight: '100vh', background: '#f9fafb' }}>
        <Navbar nav={nav} locale={locale} setLocale={setLocale} t={t} currentUser={currentUser} logout={logout} />
      </div>
    )
  }

  const l = selectedListing
  const hours = 9
  const subtotal = l.price * hours
  const fee = +(subtotal * 0.1).toFixed(2)
  const total = +(subtotal + fee).toFixed(2)

  return (
    <div style={{ minHeight: '100vh', background: '#f9fafb' }}>
      <Navbar nav={nav} locale={locale} setLocale={setLocale} t={t} currentUser={currentUser} logout={logout} />
      <div style={{ maxWidth: 900, margin: '0 auto', padding: '24px' }}>
        {/* Back */}
        <button
          onClick={() => nav('listing')}
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
            marginBottom: 24,
            fontFamily: "'Plus Jakarta Sans', sans-serif",
          }}
        >
          <ArrowLeft size={16} />
          {t('back')}
        </button>

        {/* Progress steps */}
        <div style={{ display: 'flex', gap: 8, marginBottom: 32, alignItems: 'center' }}>
          {[t('bookingStepDetails'), t('bookingStepPayment'), t('bookingStepConfirm')].map((s, i) => (
            <div key={s} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <div
                  style={{
                    width: 28,
                    height: 28,
                    borderRadius: '50%',
                    background: step > i + 1 ? green : step === i + 1 ? green : '#e5e7eb',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  {step > i + 1 ? (
                    <Check size={14} color="white" />
                  ) : (
                    <span
                      style={{
                        fontSize: 12,
                        fontWeight: 700,
                        color: step === i + 1 ? 'white' : '#9ca3af',
                      }}
                    >
                      {i + 1}
                    </span>
                  )}
                </div>
                <span
                  style={{
                    fontSize: 13,
                    fontWeight: step === i + 1 ? 600 : 400,
                    color: step === i + 1 ? '#111' : '#9ca3af',
                  }}
                >
                  {s}
                </span>
              </div>
              {i < 2 && (
                <div
                  style={{
                    width: 32,
                    height: 1,
                    background: step > i + 1 ? green : '#e5e7eb',
                  }}
                />
              )}
            </div>
          ))}
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'minmax(0, 1fr) min(300px, 100%)',
            gap: 28,
            alignItems: 'start',
          }}
        >
          {/* Main panel */}
          <div>
            {/* Step 1: Booking Details */}
            {step === 1 && (
              <div
                style={{
                  background: 'white',
                  border: '1px solid #e5e7eb',
                  borderRadius: 20,
                  padding: 28,
                }}
              >
                <h2
                  style={{
                    fontWeight: 700,
                    fontSize: 20,
                    color: '#111',
                    marginBottom: 24,
                  }}
                >
                  {t('yourBooking')}
                </h2>
                {[
                  {
                    icon: <Calendar size={18} color={green} />,
                    title: t('demoBookingDate'),
                    sub: t('demoBookingTimeRange', { hours, hrs: t('hrsShort') }),
                  },
                  {
                    icon: <MapPin size={18} color={green} />,
                    title: l.address,
                    sub: `${l.walk} ${t('walkToCampusSuffix')} · ${l.area}`,
                  },
                  {
                    icon: <CheckCircle size={18} color={green} />,
                    title: t('freeCancellationTitle'),
                    sub: t('freeCancellationSub'),
                  },
                ].map((item, i) => (
                  <div
                    key={i}
                    style={{ display: 'flex', gap: 14, marginBottom: 20 }}
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
                      <p style={{ fontWeight: 600, fontSize: 14, color: '#111' }}>
                        {item.title}
                      </p>
                      <p style={{ fontSize: 13, color: '#6b7280', marginTop: 2 }}>
                        {item.sub}
                      </p>
                    </div>
                  </div>
                ))}

                <hr
                  style={{
                    border: 'none',
                    borderTop: '1px solid #e5e7eb',
                    margin: '20px 0',
                  }}
                />
                <h3
                  style={{
                    fontWeight: 700,
                    fontSize: 16,
                    color: '#111',
                    marginBottom: 14,
                  }}
                >
                  {t('parkingRules')}
                </h3>
                <p
                  style={{
                    fontSize: 13,
                    color: '#6b7280',
                    marginBottom: 12,
                  }}
                >
                  {t('pleaseAgree')}
                </p>
                {l.rules.map((r, i) => (
                  <div
                    key={i}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 10,
                      fontSize: 14,
                      color: '#374151',
                      marginBottom: 8,
                    }}
                  >
                    <div
                      style={{
                        width: 8,
                        height: 8,
                        borderRadius: '50%',
                        background: green,
                        flexShrink: 0,
                      }}
                    />
                    {r}
                  </div>
                ))}

                <label
                  style={{
                    display: 'flex',
                    gap: 10,
                    alignItems: 'flex-start',
                    marginTop: 20,
                    cursor: 'pointer',
                  }}
                >
                  <input
                    type="checkbox"
                    checked={agreed}
                    onChange={(e) => setAgreed(e.target.checked)}
                    style={{ marginTop: 3 }}
                  />
                  <span style={{ fontSize: 13, color: '#374151' }}>
                    {t('agreeRulesCheckbox')}{' '}
                    <span style={{ color: green }}>{t('termsOfService')}</span>
                  </span>
                </label>
              </div>
            )}

            {/* Step 2: Payment */}
            {step === 2 && (
              <div
                style={{
                  background: 'white',
                  border: '1px solid #e5e7eb',
                  borderRadius: 20,
                  padding: 28,
                }}
              >
                <h2
                  style={{
                    fontWeight: 700,
                    fontSize: 20,
                    color: '#111',
                    marginBottom: 24,
                  }}
                >
                  {t('paymentMethodTitle')}
                </h2>
                <div style={{ display: 'flex', gap: 12, marginBottom: 24 }}>
                  {[
                    ['card', t('payCard')],
                    ['apple', t('payApple')],
                  ].map(([v, label]) => (
                    <button
                      key={v}
                      onClick={() => setPaymentMethod(v)}
                      style={{
                        flex: 1,
                        padding: '12px',
                        border: `2px solid ${paymentMethod === v ? green : '#e5e7eb'}`,
                        borderRadius: 10,
                        cursor: 'pointer',
                        background: paymentMethod === v ? '#f0fdf4' : 'white',
                        fontWeight: paymentMethod === v ? 600 : 400,
                        fontSize: 14,
                        color: paymentMethod === v ? '#064e3b' : '#374151',
                        fontFamily: "'Plus Jakarta Sans', sans-serif",
                      }}
                    >
                      {label}
                    </button>
                  ))}
                </div>
                {paymentMethod === 'card' && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                    {[
                      [t('cardholderName'), t('fullNameOnCard')],
                      [t('cardNumber'), t('cardNumberPlaceholder')],
                    ].map(([label, placeholder]) => (
                        <div key={label}>
                          <label
                            style={{
                              fontSize: 13,
                              fontWeight: 600,
                              color: '#374151',
                              marginBottom: 6,
                              display: 'block',
                            }}
                          >
                            {label}
                          </label>
                          <input
                            placeholder={placeholder}
                            style={{
                              width: '100%',
                              border: '1px solid #e5e7eb',
                              borderRadius: 10,
                              padding: '12px 14px',
                              fontSize: 14,
                              outline: 'none',
                              fontFamily: "'Plus Jakarta Sans', sans-serif",
                            }}
                          />
                        </div>
                      )
                    )}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                      {[
                        [t('expiryDate'), t('expiryPlaceholder')],
                        [t('cvv'), '•••'],
                      ].map(([label, placeholder]) => (
                        <div key={label}>
                          <label
                            style={{
                              fontSize: 13,
                              fontWeight: 600,
                              color: '#374151',
                              marginBottom: 6,
                              display: 'block',
                            }}
                          >
                            {label}
                          </label>
                          <input
                            placeholder={placeholder}
                            style={{
                              width: '100%',
                              border: '1px solid #e5e7eb',
                              borderRadius: 10,
                              padding: '12px 14px',
                              fontSize: 14,
                              outline: 'none',
                              fontFamily: "'Plus Jakarta Sans', sans-serif",
                            }}
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                {paymentMethod === 'apple' && (
                  <div
                    style={{
                      background: '#f3f4f6',
                      borderRadius: 12,
                      padding: 24,
                      textAlign: 'center',
                    }}
                  >
                    <p style={{ fontSize: 14, color: '#6b7280' }}>{t('applePayPrompt')}</p>
                  </div>
                )}
              </div>
            )}

            {/* Step 3: Confirm */}
            {step === 3 && (
              <div
                style={{
                  background: 'white',
                  border: '1px solid #e5e7eb',
                  borderRadius: 20,
                  padding: 28,
                }}
              >
                <h2
                  style={{
                    fontWeight: 700,
                    fontSize: 20,
                    color: '#111',
                    marginBottom: 24,
                  }}
                >
                  {t('confirmYourBooking')}
                </h2>
                <div
                  style={{
                    background: '#f9fafb',
                    borderRadius: 12,
                    padding: 20,
                    marginBottom: 20,
                  }}
                >
                  {[
                    [t('confirmLocationLabel'), l.address],
                    [t('dateLabel'), t('demoBookingDate')],
                    [
                      t('confirmTimeLabel'),
                      `${t('demoBookingTimeSlot')} (${t('confirmHoursSub', { hours })})`,
                    ],
                    [t('confirmHostLabel'), l.host],
                    [t('totalLabel'), `$${total.toFixed(2)}`],
                  ].map(([label, value]) => (
                    <div
                      key={label}
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        fontSize: 14,
                        padding: '8px 0',
                        borderBottom: '1px solid #e5e7eb',
                      }}
                    >
                      <span style={{ color: '#6b7280' }}>{label}</span>
                      <span
                        style={{
                          fontWeight: label === t('totalLabel') ? 700 : 500,
                          color: '#111',
                        }}
                      >
                        {value}
                      </span>
                    </div>
                  ))}
                </div>
                <div
                  style={{
                    display: 'flex',
                    gap: 8,
                    alignItems: 'flex-start',
                    background: '#fffbeb',
                    border: '1px solid #fde68a',
                    borderRadius: 10,
                    padding: 14,
                  }}
                >
                  <Info size={16} color="#d97706" style={{ flexShrink: 0, marginTop: 1 }} />
                  <p style={{ fontSize: 13, color: '#92400e' }}>
                    {t('bookingChargeNotice', { amt: total.toFixed(2) })}
                  </p>
                </div>
              </div>
            )}

            {/* Navigation */}
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                marginTop: 24,
              }}
            >
              {step > 1 ? (
                <Btn onClick={() => setStep((s) => s - 1)} variant="outline">
                  ← {t('back')}
                </Btn>
              ) : (
                <div />
              )}
              {step < 3 ? (
                <Btn
                  onClick={() => {
                    if (step === 1 && !agreed) {
                      alert(t('alertAgreeRules'))
                      return
                    }
                    setStep((s) => s + 1)
                  }}
                >
                  {t('continueArrow')}
                </Btn>
              ) : (
                <Btn
                  onClick={async () => {
                    if (!currentUser?.email) {
                      nav('login')
                      return
                    }
                    try {
                      await completeBooking({
                        email: currentUser.email,
                        listingId: l.id ?? l.listing_id,
                        listing: l,
                        date: t('demoBookingDate'),
                        dateIso: '2026-03-16',
                        start: '8:00 AM',
                        end: '5:00 PM',
                        hours,
                        total,
                      })
                      nav('confirmation')
                    } catch (e) {
                      alert(e.message || t('bookingFailedApi'))
                    }
                  }}
                  style={{ background: '#16a34a' }}
                >
                  <Check size={16} />
                  {t('bookingConfirmPay', { amt: total.toFixed(2) })}
                </Btn>
              )}
            </div>
          </div>

          {/* Price sidebar */}
          <div
            style={{
              background: 'white',
              border: '1px solid #e5e7eb',
              borderRadius: 20,
              padding: 20,
              position: 'sticky',
              top: 80,
            }}
          >
            <div
              style={{
                display: 'flex',
                gap: 12,
                alignItems: 'center',
                marginBottom: 16,
                paddingBottom: 16,
                borderBottom: '1px solid #e5e7eb',
              }}
            >
              <div
                style={{
                  width: 60,
                  height: 50,
                  borderRadius: 10,
                  background: lightGreen,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                <svg width="32" height="24" viewBox="0 0 32 24" fill="none">
                  <rect x="2" y="8" width="28" height="12" rx="3" fill={green} opacity="0.4" />
                  <rect x="6" y="4" width="18" height="10" rx="2" fill={green} opacity="0.6" />
                  <circle cx="9" cy="20" r="3" fill={green} />
                  <circle cx="23" cy="20" r="3" fill={green} />
                </svg>
              </div>
              <div>
                <Tag>{l.type}</Tag>
                <p
                  style={{
                    fontWeight: 700,
                    fontSize: 14,
                    color: '#111',
                    marginTop: 4,
                  }}
                >
                  {l.name}
                </p>
                <p style={{ fontSize: 12, color: '#6b7280' }}>
                  {t('hostedByPrefix')} {l.host}
                </p>
              </div>
            </div>

            <h4
              style={{
                fontWeight: 700,
                fontSize: 14,
                color: '#111',
                marginBottom: 12,
              }}
            >
              {t('priceDetails')}
            </h4>
            {[
              [
                t('priceTimesHoursLong', { price: `$${l.price}`, hours }),
                `$${subtotal.toFixed(2)}`,
              ],
              [t('serviceFeePct'), `$${fee}`],
            ].map(([label, value]) => (
              <div
                key={label}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  fontSize: 13,
                  color: '#374151',
                  marginBottom: 8,
                }}
              >
                <span>{label}</span>
                <span>{value}</span>
              </div>
            ))}
            <hr
              style={{ border: 'none', borderTop: '1px solid #e5e7eb', margin: '10px 0' }}
            />
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                fontSize: 14,
                fontWeight: 700,
                color: '#111',
              }}
            >
              <span>{t('totalUsd')}</span>
              <span>${total.toFixed(2)}</span>
            </div>

            <div
              style={{
                display: 'flex',
                gap: 8,
                alignItems: 'flex-start',
                background: '#f0fdf4',
                border: '1px solid #bbf7d0',
                borderRadius: 10,
                padding: '10px 12px',
                marginTop: 14,
              }}
            >
              <Shield size={13} color={green} style={{ flexShrink: 0, marginTop: 1 }} />
              <p style={{ fontSize: 12, color: '#065f46' }}>{t('guaranteeRefundShort')}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
