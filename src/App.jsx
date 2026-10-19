import { Route, Routes } from 'react-router-dom'
import './App.css'

import PublicLayout from './components/layout/PublicLayout'

import Auth from './pages/Auth'
import Home from './pages/Home'
import Pnf from './pages/Pnf'
import About from './pages/About'
import Contact from './pages/Contact'
import TurfDetails from './pages/TurfDetails'
import Turflist from './pages/Turflist'
import Account from './pages/Account'
import BookingCheckout from './pages/BookingCheckout'
import MyBookings from './pages/MyBookings'
import PaymentSuccess from './pages/PaymentSuccess'
import PaymentCancelled from './pages/PaymentCancelled'
import Dashboard from './pages/Dashboard'
import Teams from './pages/Teams'
import TeamDetails from './pages/TeamDetails'
import MatchHistory from './pages/MatchHistory'
import MyTurfs from './pages/MyTurfs'
import AddTurf from './pages/AddTurf'
import EditTurf from './pages/EditTurf'
import OwnerBookings from './pages/OwnerBookings'
import Admin from './pages/Admin'
import ProtectedRoute from './components/ProtectedRoute'

function App() {
  return (
    <PublicLayout>
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/login' element={<Auth />} />
        <Route path='/about' element={<About />} />
        <Route path='/contact' element={<Contact />} />
        <Route path='/turfs' element={<Turflist />} />
        <Route path='/turfs/:id' element={<TurfDetails />} />

        <Route path='/account' element={<ProtectedRoute><Account /></ProtectedRoute>} />
        <Route path='/dashboard' element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path='/my-bookings' element={<ProtectedRoute><MyBookings /></ProtectedRoute>} />
        <Route path='/booking/:id' element={<ProtectedRoute><BookingCheckout /></ProtectedRoute>} />
        <Route path='/payment-success' element={<ProtectedRoute><PaymentSuccess /></ProtectedRoute>} />
        <Route path='/payment-cancelled' element={<ProtectedRoute><PaymentCancelled /></ProtectedRoute>} />
        <Route path='/teams' element={<ProtectedRoute><Teams /></ProtectedRoute>} />
        <Route path='/teams/:id' element={<ProtectedRoute><TeamDetails /></ProtectedRoute>} />
        <Route path='/matches' element={<ProtectedRoute><MatchHistory /></ProtectedRoute>} />

        <Route path='/my-turfs' element={<ProtectedRoute><MyTurfs /></ProtectedRoute>} />
        <Route path='/add-turf' element={<ProtectedRoute><AddTurf /></ProtectedRoute>} />
        <Route path='/edit-turf/:id' element={<ProtectedRoute><EditTurf /></ProtectedRoute>} />
        <Route path='/owner-bookings' element={<ProtectedRoute><OwnerBookings /></ProtectedRoute>} />

        <Route path='/admin' element={<ProtectedRoute allowedRoles={['admin']}><Admin /></ProtectedRoute>} />

        <Route path='/*' element={<Pnf />} />
      </Routes>
    </PublicLayout>
  )
}

export default App