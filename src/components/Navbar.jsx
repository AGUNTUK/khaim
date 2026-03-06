import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Menu, X, ShoppingCart } from 'lucide-react'
import { useCart } from '../context/CartContext'
import { useUser } from '../context/UserContext'
import './Navbar.css'

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()
  const { cartCount } = useCart()
  const { isAuthenticated, currentUser } = useUser()

  const handleCartClick = () => {
    navigate('/order')
  }

  const navLinks = [
    { path: '/', label: 'Home' },
    { path: '/menu', label: 'Menu' },
    { path: '/order', label: 'Order' },
    { path: '/reservation', label: 'Reservation' },
    { path: '/profile', label: isAuthenticated ? currentUser?.name?.split(' ')[0] || 'Profile' : 'Profile' },
    { path: '/about', label: 'About' },
    { path: '/contact', label: 'Contact' },
  ]

  return (
    <nav className="navbar">
      <div className="container">
        <div className="navbar-content">
          <Link to="/" className="navbar-logo">
            <img src="/logo.png" alt="KHAIM" className="navbar-logo-img" />
          </Link>

          <div className="navbar-links hide-mobile">
            {navLinks.map(link => (
              <Link
                key={link.path}
                to={link.path}
                className={`nav-link ${location.pathname === link.path ? 'active' : ''}`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          <div className="navbar-actions">
            <button className="cart-btn" onClick={handleCartClick}>
              <ShoppingCart size={22} />
              {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
            </button>

            <button
              className="menu-toggle hide-desktop"
              onClick={() => setMenuOpen(!menuOpen)}
            >
              {menuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <div className={`mobile-menu ${menuOpen ? 'open' : ''}`}>
          {navLinks.map(link => (
            <Link
              key={link.path}
              to={link.path}
              className={`mobile-nav-link ${location.pathname === link.path ? 'active' : ''}`}
              onClick={() => setMenuOpen(false)}
            >
              {link.label}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  )
}
