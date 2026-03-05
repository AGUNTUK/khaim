import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { ChefHat, ShoppingBag, Calendar, Users, Settings, LogOut, Check, X } from 'lucide-react'
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

export default function AdminReservations() {
  const navigate = useNavigate()
  const { isAuthenticated, logout, reservations, updateReservationStatus } = useAdmin()
  const { addToast } = useToast()

  useEffect(() => {
    if (!isAuthenticated) navigate('/admin')
  }, [isAuthenticated, navigate])

  if (!isAuthenticated) return null

  const handleStatusChange = (id, status) => {
    updateReservationStatus(id, status)
    addToast(`Reservation ${status}! 📅`, 'success')
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
          <h1>Reservations Management</h1>
        </div>

        <div className="admin-table-container">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Phone</th>
                <th>Date</th>
                <th>Time</th>
                <th>Party Size</th>
                <th>Special Requests</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {reservations.map(res => (
                <tr key={res.id}>
                  <td><strong>{res.name}</strong></td>
                  <td>{res.phone}</td>
                  <td>{res.date}</td>
                  <td>{res.time}</td>
                  <td>{res.partySize}</td>
                  <td style={{ maxWidth: 200 }}>{res.specialRequests || '-'}</td>
                  <td>
                    <span className={`status-badge status-${res.status === 'confirmed' ? 'confirmed' : res.status === 'cancelled' ? 'cancelled' : 'pending'}`}>
                      {res.status}
                    </span>
                  </td>
                  <td>
                    <div className="action-btns">
                      {res.status === 'pending' && (
                        <>
                          <button className="action-btn edit" onClick={() => handleStatusChange(res.id, 'confirmed')}>
                            <Check size={16} />
                          </button>
                          <button className="action-btn delete" onClick={() => handleStatusChange(res.id, 'cancelled')}>
                            <X size={16} />
                          </button>
                        </>
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
