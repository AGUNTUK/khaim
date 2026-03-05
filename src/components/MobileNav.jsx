import { Link, useLocation } from 'react-router-dom'
import { Home, Menu, ShoppingCart, Phone } from 'lucide-react'
import { useCart } from '../context/CartContext'
import './MobileNav.css'

export default function MobileNav() {
  const location = useLocation()
  const { cartCount } = useCart()

  const navItems = [
    { path: '/', label: 'Home', icon: Home },
    { path: '/menu', label: 'Menu', icon: Menu },
    { path: '/order', label: 'Cart', icon: ShoppingCart, badge: cartCount },
    { path: '/contact', label: 'Contact', icon: Phone },
  ]

  return (
    <nav className="mobile-nav">
      <div className="mobile-nav-items">
        {navItems.map(item => {
          const Icon = item.icon
          const isActive = location.pathname === item.path
          
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`mobile-nav-item ${isActive ? 'active' : ''}`}
            >
              <Icon size={22} />
              <span>{item.label}</span>
              {item.badge > 0 && (
                <span className="mobile-cart-badge">{item.badge}</span>
              )}
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
