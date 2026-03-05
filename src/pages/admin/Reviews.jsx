import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { ChefHat, ShoppingBag, Calendar, Users, Settings, LogOut, Star, Check, X } from 'lucide-react'
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

export default function AdminReviews() {
  const navigate = useNavigate()
  const { isAuthenticated, logout, reviews, updateReviewStatus } = useAdmin()
  const { addToast } = useToast()

  useEffect(() => {
    if (!isAuthenticated) navigate('/admin')
  }, [isAuthenticated, navigate])

  if (!isAuthenticated) return null

  const handleApprove = (id) => {
    updateReviewStatus(id, true)
    addToast('Review approved! ✅', 'success')
  }

  const handleHide = (id) => {
    updateReviewStatus(id, false)
    addToast('Review hidden! 🙈', 'success')
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
          <h1>Reviews Management</h1>
        </div>

        <div className="admin-table-container">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Customer</th>
                <th>Rating</th>
                <th>Review</th>
                <th>Date</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {reviews.map(review => (
                <tr key={review.id}>
                  <td><strong>{review.name}</strong></td>
                  <td>
                    <div className="testimonial-stars">
                      {[1,2,3,4,5].map(star => (
                        <Star key={star} size={16} fill={star <= review.rating ? '#F5A623' : 'none'} color="#F5A623" />
                      ))}
                    </div>
                  </td>
                  <td style={{ maxWidth: 300 }}>{review.text}</td>
                  <td>{review.date}</td>
                  <td>
                    <span className={`status-badge ${review.approved ? 'status-delivered' : 'status-cancelled'}`}>
                      {review.approved ? 'Approved' : 'Hidden'}
                    </span>
                  </td>
                  <td>
                    <div className="action-btns">
                      {!review.approved && (
                        <button className="action-btn edit" onClick={() => handleApprove(review.id)} title="Approve">
                          <Check size={16} />
                        </button>
                      )}
                      {review.approved && (
                        <button className="action-btn delete" onClick={() => handleHide(review.id)} title="Hide">
                          <X size={16} />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  )
}
