import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import WhatsAppButton from './components/WhatsAppButton'
import MobileNav from './components/MobileNav'
import ThemeToggle from './components/ThemeToggle'
import Toast from './components/Toast'
import Page404 from './pages/Page404'

// Public Pages
import Home from './pages/Home'
import Menu from './pages/Menu'
import Order from './pages/Order'
import Reservation from './pages/Reservation'
import About from './pages/About'
import Contact from './pages/Contact'
import ProductDetails from './pages/ProductDetails'

// Admin Pages
import AdminLogin from './pages/admin/Login'
import AdminDashboard from './pages/admin/Dashboard'
import AdminMenu from './pages/admin/Menu'
import AdminOrders from './pages/admin/Orders'
import AdminReservations from './pages/admin/Reservations'
import AdminCustomers from './pages/admin/Customers'
import AdminOffers from './pages/admin/Offers'
import AdminReviews from './pages/admin/Reviews'
import AdminSettings from './pages/admin/Settings'

import { useLocation } from 'react-router-dom'
import { useEffect } from 'react'

function App() {
  const location = useLocation()
  const isAdminRoute = location.pathname.startsWith('/admin')

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [location.pathname])

  return (
    <div className="app">
      {!isAdminRoute && <Navbar />}
      
      <main className={isAdminRoute ? 'admin-main' : ''}>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/menu" element={<Menu />} />
          <Route path="/product/:id" element={<ProductDetails />} />
          <Route path="/order" element={<Order />} />
          <Route path="/reservation" element={<Reservation />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          
          {/* Admin Routes */}
          <Route path="/admin" element={<AdminLogin />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/menu" element={<AdminMenu />} />
          <Route path="/admin/orders" element={<AdminOrders />} />
          <Route path="/admin/reservations" element={<AdminReservations />} />
          <Route path="/admin/customers" element={<AdminCustomers />} />
          <Route path="/admin/offers" element={<AdminOffers />} />
          <Route path="/admin/reviews" element={<AdminReviews />} />
          <Route path="/admin/settings" element={<AdminSettings />} />
          
          {/* 404 */}
          <Route path="*" element={<Page404 />} />
        </Routes>
      </main>

      {!isAdminRoute && <Footer />}
      {!isAdminRoute && <MobileNav />}
      {!isAdminRoute && <WhatsAppButton />}
      {!isAdminRoute && <ThemeToggle />}
      <Toast />
    </div>
  )
}

export default App
