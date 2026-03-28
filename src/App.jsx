import { useState, useEffect } from 'react'
import { translate } from './i18n/translations.js'
import { createBooking } from './utils/listingApi.js'
import HomePage from './pages/homepage.jsx'
import SearchPage from './pages/SearchPage.jsx'
import ListingPage from './pages/ListingPage.jsx'
import BookingPage from './pages/BookingPage.jsx'
import ConfirmationPage from './pages/ConfirmationPage.jsx'
import StudentDashboard from './pages/StudentDashboard.jsx'
import HostDashboard from './pages/Hostdashboard.jsx'
import FAQPage from './pages/FAQPage.jsx'
import LoginPage from './pages/LoginPage.jsx'
import SignupPage from './pages/SignupPage.jsx'

const bookingsKey = (email) => `spotshare_student_bookings_${email}`
const savedKey = (email) => `spotshare_saved_${email}`

export default function App() {
  const [page, setPage] = useState('home')
  const [locale, setLocale] = useState('en')
  const [currentUser, setCurrentUser] = useState(null)
  const [selectedListing, setSelectedListing] = useState(null)
  const [studentBookings, setStudentBookings] = useState([])
  const [lastBooking, setLastBooking] = useState(null)
  const [savedListings, setSavedListings] = useState([])
  const [messages, setMessages] = useState([])

  const completeLogin = (payload) => {
    setCurrentUser({
      userId: payload.userId,
      firstName: payload.firstName,
      lastName: payload.lastName,
      email: payload.email,
    })
    setPage('student-dashboard')
    window.scrollTo(0, 0)
  }

  const completeSignup = (payload) => {
    setCurrentUser({
      userId: payload.userId,
      firstName: payload.firstName,
      lastName: payload.lastName,
      email: payload.email,
    })
    setPage('search')
    window.scrollTo(0, 0)
  }

  const logout = () => {
    setCurrentUser(null)
    setStudentBookings([])
    setSavedListings([])
    setLastBooking(null)
    setMessages([])
  }

  const completeBooking = async (payload) => {
    const email = payload.email || currentUser?.email
    if (!email) return
    const { email: _e, ...rest } = payload
    const studentId = Number(currentUser?.userId)
    const listingId = Number(payload.listingId ?? rest.listing?.id ?? rest.listing?.listing_id)

    if (!Number.isFinite(studentId) || studentId < 1) {
      throw new Error(translate(locale, 'bookingErrMissingAccountId'))
    }
    if (!Number.isFinite(listingId) || listingId < 1) {
      throw new Error(translate(locale, 'bookingErrListingNotFound'))
    }

    await createBooking({
      studentId,
      listingId,
      bookingDate: rest.dateIso || rest.date,
      startTime: rest.start,
      endTime: rest.end,
      totalPrice: rest.total,
      bookingStatus: 'Confirmed',
    })

    const id = `SP-${Date.now()}`
    const booking = { id, ...rest, status: 'Confirmed' }
    setLastBooking(booking)
    setStudentBookings((prev) => {
      const next = [...prev, booking]
      try {
        localStorage.setItem(bookingsKey(email), JSON.stringify(next))
      } catch {
        /* ignore */
      }
      return next
    })
  }

  useEffect(() => {
    if (!currentUser?.email) {
      setStudentBookings([])
      setSavedListings([])
      return
    }
    try {
      const b = localStorage.getItem(bookingsKey(currentUser.email))
      setStudentBookings(b ? JSON.parse(b) : [])
      const s = localStorage.getItem(savedKey(currentUser.email))
      setSavedListings(s ? JSON.parse(s) : [])
    } catch {
      setStudentBookings([])
      setSavedListings([])
    }
  }, [currentUser?.email])

  const nav = (p, listing = null) => {
    if (listing) setSelectedListing(listing)
    if (p === 'student-dashboard' && !currentUser) {
      setPage('login')
      window.scrollTo(0, 0)
      return
    }
    setPage(p)
    window.scrollTo(0, 0)
  }

  useEffect(() => {
    if (page === 'student-dashboard' && !currentUser) {
      setPage('login')
    }
  }, [page, currentUser])

  const toggleSave = (id) => {
    setSavedListings((prev) => {
      const next = prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
      if (currentUser?.email) {
        try {
          localStorage.setItem(savedKey(currentUser.email), JSON.stringify(next))
        } catch {
          /* ignore */
        }
      }
      return next
    })
  }

  const t = (key, vars) => translate(locale, key, vars)

  const sharedProps = {
    nav,
    selectedListing,
    savedListings,
    toggleSave,
    messages,
    setMessages,
    locale,
    setLocale,
    t,
    currentUser,
    logout,
    studentBookings,
    lastBooking,
    completeBooking,
  }

  return (
    <>
      {page === 'home' && <HomePage {...sharedProps} />}
      {page === 'search' && <SearchPage {...sharedProps} />}
      {page === 'listing' && <ListingPage {...sharedProps} setSelectedListing={setSelectedListing} />}
      {page === 'booking' && <BookingPage {...sharedProps} />}
      {page === 'confirmation' && <ConfirmationPage {...sharedProps} />}
      {page === 'student-dashboard' && currentUser && <StudentDashboard {...sharedProps} />}
      {page === 'host-dashboard' && <HostDashboard {...sharedProps} />}
      {page === 'faq' && <FAQPage {...sharedProps} />}
      {page === 'login' && <LoginPage {...sharedProps} completeLogin={completeLogin} />}
      {page === 'signup' && <SignupPage {...sharedProps} completeSignup={completeSignup} />}
    </>
  )
}
