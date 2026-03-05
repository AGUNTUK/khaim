import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { ChefHat, ShoppingBag, Calendar, Users, Settings, LogOut } from 'lucide-react'
import { useAdmin } from '../../context/AdminContext'
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

export default function AdminCustomers() {
  const navigate = useNavigate()
  const { isAuthenticated, logout, customers } = useAdmin()

  useEffect(() => {
    if (!isAuthenticated) navigate('/admin')
  }, [isAuthenticated, navigate])

  if (!isAuthenticated) return null

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
          <h1>Customer Management</h1>
        </div>

        <div className="admin-table-container">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Customer</th>
                <th>Phone</th>
                <th>Total Orders</th>
                <th>Total Spent</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {customers.map(customer => (
                <tr key={customer.id}>
                  <td><strong>{customer.name}</strong></td>
                  <td>{customer.phone}</td>
                  <td>{customer.orders}</td>
                  <td>BDT {customer.totalSpent.toLocaleString()}</td>
                  <td>
                    <a href={`https://wa.me/88${customer.phone}`} target="_blank" rel="noopener noreferrer" className="clay-btn clay-btn-secondary clay-btn-small">
                      💬 Contact
                    </a>
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
