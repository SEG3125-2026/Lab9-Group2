import { Heart, MapPin, Star, User, Check, Shield } from 'lucide-react'
import { COLORS } from '../data/listings.js'

const { green, lightGreen } = COLORS

export function Btn({ children, onClick, variant = 'primary', type = 'button', style: s = {} }) {
  return (
    <button
      type={type}
      onClick={onClick}
      style={{
        background: variant === 'primary' ? green : variant === 'outline' ? 'white' : '#f3f4f6',
        color: variant === 'primary' ? 'white' : variant === 'outline' ? green : '#374151',
        border: variant === 'outline' ? `1.5px solid ${green}` : 'none',
        cursor: 'pointer',
        padding: '12px 24px',
        borderRadius: 12,
        fontWeight: 600,
        fontSize: 14,
        display: 'inline-flex',
        alignItems: 'center',
        gap: 6,
        fontFamily: "'Plus Jakarta Sans', sans-serif",
        ...s,
      }}
    >
      {children}
    </button>
  )
}

export function Tag({ children, color = green }) {
  return (
    <span
      style={{
        background: `${color}20`,
        color,
        fontSize: 12,
        fontWeight: 600,
        padding: '3px 10px',
        borderRadius: 20,
      }}
    >
      {children}
    </span>
  )
}

export function ListingCard({ listing, onClick, savedListings, toggleSave }) {
  return (
    <div
      onClick={() => onClick(listing)}
      style={{
        background: 'white',
        border: '1px solid #e5e7eb',
        borderRadius: 16,
        overflow: 'hidden',
        cursor: 'pointer',
        transition: 'box-shadow 0.2s',
      }}
      onMouseEnter={(e) => (e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.12)')}
      onMouseLeave={(e) => (e.currentTarget.style.boxShadow = 'none')}
    >
      <div
        style={{
          position: 'relative',
          height: 180,
          background: 'linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <svg width="56" height="40" viewBox="0 0 56 40" fill="none">
          <rect x="4" y="14" width="48" height="22" rx="4" fill={green} opacity="0.15" />
          <rect x="8" y="16" width="40" height="18" rx="3" fill={green} opacity="0.3" />
          <rect x="12" y="8" width="28" height="16" rx="3" fill={green} opacity="0.5" />
          <circle cx="16" cy="36" r="4" fill={green} />
          <circle cx="40" cy="36" r="4" fill={green} />
        </svg>
        <div
          style={{
            position: 'absolute',
            top: 12,
            left: 12,
            background: green,
            color: 'white',
            fontSize: 11,
            fontWeight: 600,
            padding: '3px 10px',
            borderRadius: 20,
          }}
        >
          {listing.type}
        </div>
        <div
          style={{
            position: 'absolute',
            top: 12,
            right: 12,
            background: 'white',
            color: green,
            fontSize: 12,
            fontWeight: 700,
            padding: '3px 10px',
            borderRadius: 20,
          }}
        >
          ${listing.price}/hr
        </div>
        <button
          onClick={(e) => {
            e.stopPropagation()
            toggleSave(listing.id)
          }}
          style={{
            position: 'absolute',
            bottom: 12,
            right: 12,
            background: 'white',
            border: 'none',
            cursor: 'pointer',
            borderRadius: '50%',
            width: 32,
            height: 32,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Heart
            size={16}
            fill={savedListings.includes(listing.id) ? '#ef4444' : 'none'}
            color={savedListings.includes(listing.id) ? '#ef4444' : '#6b7280'}
          />
        </button>
      </div>
      <div style={{ padding: '14px 16px' }}>
        <p style={{ fontWeight: 700, fontSize: 14, color: '#111', marginBottom: 4 }}>{listing.name}</p>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 12, color: '#6b7280' }}>
            <MapPin size={12} color={green} />
            {listing.walk}
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 12, color: '#6b7280' }}>
            <Star size={12} color="#f59e0b" fill="#f59e0b" />
            {listing.rating} ({listing.reviews})
          </span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div
            style={{
              width: 24,
              height: 24,
              borderRadius: '50%',
              background: lightGreen,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <User size={12} color={green} />
          </div>
          <span style={{ fontSize: 12, color: '#6b7280' }}>Hosted by {listing.host}</span>
        </div>
      </div>
    </div>
  )
}

export function GuaranteeBadge() {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'flex-start',
        gap: 8,
        background: '#f0fdf4',
        border: '1px solid #bbf7d0',
        borderRadius: 10,
        padding: '10px 12px',
        marginTop: 14,
      }}
    >
      <Shield size={14} color={green} style={{ flexShrink: 0, marginTop: 2 }} />
      <p style={{ fontSize: 12, color: '#065f46' }}>
        SpotShare protects every booking with our Host Guarantee.
      </p>
    </div>
  )
}
