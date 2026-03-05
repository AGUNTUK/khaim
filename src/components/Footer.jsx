import { Link } from 'react-router-dom'
import { MapPin, Phone, Clock, Facebook, Instagram } from 'lucide-react'
import { useAdmin } from '../context/AdminContext'
import './Footer.css'

export default function Footer() {
  const { settings } = useAdmin()

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          <div className="footer-brand">
            <Link to="/" className="footer-logo">
              <div className="logo-icon">
                <span>🔥</span>
              </div>
              <span className="logo-text">KHAIM</span>
            </Link>
            <p className="footer-tagline">{settings.tagline}</p>
            <p className="footer-desc">
              Fresh, flavourful & made with love — bringing the authentic 
              flavors of Rangpur to your table.
            </p>
          </div>

          <div className="footer-links">
            <h4>Quick Links</h4>
            <ul>
              <li><Link to="/">Home</Link></li>
              <li><Link to="/menu">Our Menu</Link></li>
              <li><Link to="/order">Order Online</Link></li>
              <li><Link to="/reservation">Reserve Table</Link></li>
              <li><Link to="/about">About Us</Link></li>
              <li><Link to="/contact">Contact</Link></li>
            </ul>
          </div>

          <div className="footer-contact">
            <h4>Contact Info</h4>
            <ul>
              <li>
                <MapPin size={18} />
                <span>{settings.address}</span>
              </li>
              <li>
                <Phone size={18} />
                <span>{settings.phone}</span>
              </li>
              <li>
                <Clock size={18} />
                <span>{settings.hours}</span>
              </li>
            </ul>
          </div>

          <div className="footer-social">
            <h4>Follow Us</h4>
            <div className="social-links">
              <a href={settings.social.facebook} target="_blank" rel="noopener noreferrer" className="social-link">
                <Facebook size={20} />
              </a>
              <a href={settings.social.instagram} target="_blank" rel="noopener noreferrer" className="social-link">
                <Instagram size={20} />
              </a>
              <a href={`https://${settings.social.whatsapp}`} target="_blank" rel="noopener noreferrer" className="social-link">
                <span>💬</span>
              </a>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <p>© 2025 KHAIM — {settings.tagline}</p>
          <Link to="/admin" className="admin-link">Admin Panel</Link>
        </div>
      </div>
    </footer>
  )
}
