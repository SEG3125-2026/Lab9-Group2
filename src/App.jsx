import { useState, useEffect } from 'react'
import HomePage from './pages/homepage.jsx'
import SearchPage from './pages/SearchPage.jsx'
import ListingPage from './pages/ListingPage.jsx'
import BookingPage from './pages/BookingPage.jsx'
import ConfirmationPage from './pages/ConfirmationPage.jsx'
import StudentDashboard from './pages/StudentDashboard.jsx'
import HostDashboard from './pages/hostdashboard.jsx'
import FAQPage from './pages/FAQPage.jsx'
import LoginPage from './pages/LoginPage.jsx'
import SignupPage from './pages/SignupPage.jsx'

const bookingsKey = (email) => `spotshare_student_bookings_${email}`
const savedKey = (email) => `spotshare_saved_${email}`

const TRANSLATIONS = {
  en: {
    findParking: 'Find Parking',
    howItWorks: 'How It Works',
    help: 'Help',
    listYourSpace: 'List Your Space',
    logIn: 'Log In',
    signUp: 'Sign Up',
    nowAvailable: 'Now available near 50+ universities',
    heroTitle1: 'Stop Circling the Block.',
    heroTitle2: 'Park Smarter.',
    heroSub: 'SpotShare connects commuter students with homeowners who have unused driveway space near campus.',
    searchPlaceholder: 'Enter your university or campus name...',
    findParkingNow: 'Find Parking Now →',
    viewAllSpots: 'spots available near',
    filters: 'Filters',
    list: 'List',
    map: 'Map',
    all: 'All',
    modalDate: 'Mon, Mar 16 · 8:00 AM – 5:00 PM',
    whyLove: 'Why Students Love SpotShare',
    howItWorksTitle: 'How SpotShare Works',
    howItWorksSubtitle: 'Three simple steps to never worry about campus parking',
    step1Title: 'Search Your Campus',
    step1Desc: 'Enter your university and find available spots nearby. Filter by price, distance, and availability.',
    step2Title: 'Book Instantly',
    step2Desc: 'Reserve your spot in minutes. Pay securely online and receive instant booking confirmation.',
    step3Title: 'Park with Ease',
    step3Desc: 'Get directions and parking instructions from your host. Enjoy stress-free commuting.',
    backToSearch: 'Back to Search',
    back: 'Back',
    bookingDetails: 'Booking Details',
    payment: 'Payment',
    confirm: 'Confirm',
    yourBooking: 'Your Booking',
    parkingRules: 'Parking Rules',
    pleaseAgree: "Please review and agree to the host's rules before booking.",
    viewDashboard: 'View Dashboard',
    bookAnother: 'Book Another Spot',
    yourAllSet: "You're All Set!",
    reservationSuccess: 'Your parking spot has been reserved. Get ready for a stress-free commute.',
    share: 'Share',
    save: 'Save',
    spotAvailable: '1 spot available',
    bookNow: 'Book Now',
    confirmBooking: 'Confirm Booking',
    successMessage: 'Your booking is confirmed!',
    studentDashboardTitle: 'Student Dashboard',
    hostDashboardTitle: 'Host Dashboard',
    faqTitle: 'Frequently Asked Questions',
    welcomeBack: 'Welcome back 👋',
    bookSpot: 'Book a Spot',
    upcoming: 'Upcoming',
    past: 'Past',
    saved: 'Saved',
    messagesText: 'Messages',
    faqTitle: 'How can we help?',
    faqSubtitle: 'Search our help center or browse by topic below.',
    helloHost: 'Hello, Sarah M. 👋',
    addListing: 'Add Listing',
    overview: 'Overview',
    myListings: 'My Listings',
    bookings: 'Bookings',
    pending: 'Pending',
    confirmed: 'Confirmed',
    loginTitle: 'Log in to SpotShare',
    loginSubtitle: 'Enter your email and password to continue.',
    emailLabel: 'Email',
    passwordLabel: 'Password',
    submitLogin: 'Log in',
    needAccount: "Don't have an account?",
    signUpTitle: 'Create your account',
    signUpSubtitle: 'Join SpotShare to book and save parking spots.',
    firstNameLabel: 'First name',
    lastNameLabel: 'Last name',
    submitSignUp: 'Create account',
    alreadyHaveAccount: 'Already have an account?',
    dashboard: 'Dashboard',
    logOut: 'Log out',
  },
  fr: {
    findParking: 'Trouver un parking',
    howItWorks: 'Comment ça marche',
    help: 'Aide',
    listYourSpace: 'Proposez votre place',
    logIn: 'Connexion',
    signUp: 'Inscription',
    nowAvailable: 'Maintenant disponible près de 50+ universités',
    heroTitle1: 'Arrêtez de tourner en rond.',
    heroTitle2: 'Garez plus intelligemment.',
    heroSub: 'SpotShare met en relation des étudiants navetteurs avec des propriétaires disposant d’emplacements de stationnement inutilisés près du campus.',
    searchPlaceholder: 'Entrez votre université ou votre campus...',
    findParkingNow: 'Trouver un parking maintenant →',
    viewAllSpots: 'places disponibles près de',
    filters: 'Filtres',
    list: 'Liste',
    map: 'Carte',
    all: 'Tous',
    modalDate: 'Lun, 16 Mar · 8:00 – 17:00',
    whyLove: 'Pourquoi les étudiants adorent SpotShare',
    howItWorksTitle: 'Comment SpotShare fonctionne',
    howItWorksSubtitle: 'Trois étapes simples pour ne plus vous soucier du stationnement sur le campus',
    step1Title: 'Recherchez votre campus',
    step1Desc: 'Entrez votre université et trouvez des places disponibles à proximité. Filtrez par prix, distance et disponibilité.',
    step2Title: 'Réservez instantanément',
    step2Desc: 'Réservez votre place en minutes. Payez en ligne en toute sécurité et recevez une confirmation instantanée.',
    step3Title: 'Garez-vous sereinement',
    step3Desc: 'Obtenez des directions et des instructions de stationnement de votre hôte. Profitez d’un trajet sans stress.',
    backToSearch: 'Retour à la recherche',
    back: 'Retour',
    welcomeBack: 'Bon retour 👋',
    bookSpot: 'Réserver une place',
    upcoming: 'À venir',
    past: 'Passé',
    saved: 'Enregistré',
    messagesText: 'Messages',
    faqTitle: 'Comment pouvons-nous vous aider ?',
    faqSubtitle: 'Recherchez dans notre centre d’aide ou parcourez les sujets ci-dessous.',
    helloHost: 'Bonjour, Sarah M. 👋',
    addListing: 'Ajouter une annonce',
    overview: 'Aperçu',
    myListings: 'Mes annonces',
    bookings: 'Réservations',
    pending: 'En attente',
    confirmed: 'Confirmé',
    loginTitle: 'Connexion à SpotShare',
    loginSubtitle: 'Entrez votre courriel et votre mot de passe pour continuer.',
    emailLabel: 'Courriel',
    passwordLabel: 'Mot de passe',
    submitLogin: 'Se connecter',
    needAccount: 'Pas encore de compte ?',
    signUpTitle: 'Créer un compte',
    signUpSubtitle: 'Rejoignez SpotShare pour réserver et enregistrer des places.',
    firstNameLabel: 'Prénom',
    lastNameLabel: 'Nom',
    submitSignUp: 'Créer le compte',
    alreadyHaveAccount: 'Déjà un compte ?',
    dashboard: 'Tableau de bord',
    logOut: 'Déconnexion',
    back: 'Retour',
    bookingDetails: 'Détails de la réservation',
    payment: 'Paiement',
    confirm: 'Confirmer',
    yourBooking: 'Votre réservation',
    parkingRules: 'Règles de stationnement',
    pleaseAgree: "Veuillez lire et accepter les règles de l’hôte avant de réserver.",
    viewDashboard: 'Voir le tableau de bord',
    bookAnother: 'Réserver un autre spot',
    yourAllSet: 'C’est tout bon !',
    reservationSuccess: 'Votre place de parking est réservée. Préparez-vous pour un trajet sans stress.',
  }
}

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
      firstName: payload.firstName,
      lastName: payload.lastName,
      email: payload.email,
    })
    setPage('student-dashboard')
    window.scrollTo(0, 0)
  }

  const completeSignup = (payload) => {
    setCurrentUser({
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

  const completeBooking = (payload) => {
    const email = payload.email || currentUser?.email
    if (!email) return
    const { email: _e, ...rest } = payload
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

  const t = (key) => TRANSLATIONS[locale]?.[key] ?? key

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
      {page === 'listing' && <ListingPage {...sharedProps} />}
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
