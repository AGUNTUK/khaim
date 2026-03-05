import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { ChefHat, ShoppingBag, Calendar, Users, Settings, LogOut, Save } from 'lucide-react'
import { useAdmin } from '../../context/AdminContext'
import { useToast } from '../../context/ToastContext'
import './Admin.css'

const navItems = [
  { path: '/admin/dashboard', label: 'Dashboard', icon: ChefHat },
  { path: '/admin/menu', label: 'Menu', icon: ChefHat },
  { path: '/admin/orders', label: 'Orders', icon: ShoppingBag },
  { path: '/admin/reservations', label: 'Reservations', icon: Calendar },
  { path: '/admin/customers', label: 'Customers', icon: Users },
  { path: '/admin/offers', label: 'Offers', icon: Settings },
  { path: '/admin/reviews', label: 'Reviews', icon: Users },
  { path: '/admin/settings', label: 'Settings', icon: Settings },
]

export default function AdminSettings() {
  const navigate = useNavigate()
  const { isAuthenticated, logout, settings, updateSettings } = useAdmin()
  const { addToast } = useToast()
  const [formData, setFormData] = useState(settings)

  useEffect(() => {
    if (!isAuthenticated) navigate('/admin')
  }, [isAuthenticated, navigate])

  useEffect(() => {
    setFormData(settings)
  }, [settings])

  if (!isAuthenticated) return null

  const handleSubmit = (e) => {
    e.preventDefault()
    updateSettings(formData)
    addToast('Settings saved! 💾', 'success')
  }

  const handleLogout = () => {
    logout()
    navigate('/admin')
  }

  return (
    <div className="admin-wrapper">
      <aside className="admin-sidebar">
        <div className="admin-logo"><div className="logo-icon"><span>🔥</span></div><h2>KHAIM</h2></div>
        <nav className="admin-nav">
          {navItems.map(item => (
            <a key={item.path} href={item.path} className={`admin-nav-link ${location.pathname === item.path ? 'active' : ''}`}>
              <item.icon size={20} /> {item.label}
            </a>
          ))}
        </nav>
        <button className="admin-nav-link" onClick={handleLogout} style={{ marginTop: 'auto', border: 'none', background: 'none', cursor: 'pointer', width: '100%' }}>
          <LogOut size={20} /> Logout
        </button>
      </aside>

      <main className="admin-main">
        <div className="admin-header">
          <h1>Settings</h1>
        </div>

        <form onSubmit={handleSubmit} className="admin-form">
          <h2>Restaurant Information</h2>
          
          <div className="form-grid">
            <div className="form-group">
              <label className="form-label">Restaurant Name</label>
              <input type="text" className="clay-input" value={formData.restaurantName} onChange={e => setFormData({...formData, restaurantName: e.target.value})} />
            </div>
            <div className="form-group">
              <label className="form-label">Tagline</label>
              <input type="text" className="clay-input" value={formData.tagline} onChange={e => setFormData({...formData, tagline: e.target.value})} />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Address</label>
            <input type="text" className="clay-input" value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})} />
          </div>

          <div className="form-grid">
            <div className="form-group">
              <label className="form-label">Phone</label>
              <input type="text" className="clay-input" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} />
            </div>
            <div className="form-group">
              <label className="form-label">Opening Hours</label>
              <input type="text" className="clay-input" value={formData.hours} onChange={e => setFormData({...formData, hours: e.target.value})} />
            </div>
          </div>

          <h2 style={{ marginTop: '2rem' }}>Delivery Settings</h2>

          <div className="form-grid">
            <div className="form-group">
              <label className="form-label">Delivery Radius (km)</label>
              <input type="number" className="clay-input" value={formData.deliveryRadius} onChange={e => setFormData({...formData, deliveryRadius: parseInt(e.target.value)})} />
            </div>
            <div className="form-group">
              <label className="form-label">Minimum Order (BDT)</label>
              <input type="number" className="clay-input" value={formData.minOrder} onChange={e => setFormData({...formData, minOrder: parseInt(e.target.value)})} />
            </div>
          </div>

          <h2 style={{ marginTop: '2rem' }}>Payment Methods</h2>

          <div className="checkbox-group" style={{ marginBottom: '1.5rem' }}>
            <label className="checkbox-label">
              <input type="checkbox" checked={formData.paymentMethods.cod} onChange={e => setFormData({...formData, paymentMethods: {...formData.paymentMethods, cod: e.target.checked}})} />
              Cash on Delivery
            </label>
            <label className="checkbox-label">
              <input type="checkbox" checked={formData.paymentMethods.bkash} onChange={e => setFormData({...formData, paymentMethods: {...formData.paymentMethods, bkash: e.target.checked}})} />
              bKash
            </label>
            <label className="checkbox-label">
              <input type="checkbox" checked={formData.paymentMethods.nagad} onChange={e => setFormData({...formData, paymentMethods: {...formData.paymentMethods, nagad: e.target.checked}})} />
              Nagad
            </label>
          </div>

          <h2 style={{ marginTop: '2rem' }}>Social Media Links</h2>

          <div className="form-grid">
            <div className="form-group">
              <label className="form-label">Facebook</label>
              <input type="url" className="clay-input" value={formData.social.facebook} onChange={e => setFormData({...formData, social: {...formData.social, facebook: e.target.value}})} />
            </div>
            <div className="form-group">
              <label className="form-label">Instagram</label>
              <input type="url" className="clay-input" value={formData.social.instagram} onChange={e => setFormData({...formData, social: {...formData.social, instagram: e.target.value}})} />
            </div>
          </div>

          <button type="submit" className="clay-btn clay-btn-primary" style={{ marginTop: '2rem' }}>
            <Save size={18} /> Save Settings
          </button>
        </form>
      </main>
    </div>
  )
}
