import { useState, useEffect } from 'react'
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

const statusFlow = ['pending', 'confirmed', 'preparing', 'delivered']

export default function AdminOrders() {
  const navigate = useNavigate()
  const { isAuthenticated, logout, orders, updateOrderStatus } = useAdmin()
  const { addToast } = useToast()
  const [filter, setFilter] = useState('all')

  useEffect(() => {
    if (!isAuthenticated) navigate('/admin')
  }, [isAuthenticated, navigate])

  if (!isAuthenticated) return null

  const filteredOrders = filter === 'all' ? orders : orders.filter(o => o.status === filter)

  const handleStatusChange = (orderId, newStatus) => {
    updateOrderStatus(orderId, newStatus)
    addToast(`Order status updated to ${newStatus}! 📦`, 'success')
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
          <h1>Orders Management</h1>
        </div>

        <div style={{ marginBottom: '1.5rem', display: 'flex', gap: '0.5rem' }}>
          {['all', 'pending', 'confirmed', 'preparing', 'delivered'].map(status => (
            <button key={status} className={`category-tab ${filter === status ? 'active' : ''}`} onClick={() => setFilter(status)}>
              {status === 'all' ? 'All' : status}
            </button>
          ))}
        </div>

        <div className="admin-table-container">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Customer</th>
                <th>Items</th>
                <th>Total</th>
                <th>Type</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.map(order => (
                <tr key={order.id}>
                  <td><strong>{order.id}</strong></td>
                  <td>
                    <div>{order.customerName}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{order.phone}</div>
                  </td>
                  <td>
                    {order.items.map((item, i) => (
                      <div key={i} style={{ fontSize: '0.875rem' }}>{item.quantity}x {item.name}</div>
                    ))}
                  </td>
                  <td><strong>BDT {order.total}</strong></td>
                  <td style={{ textTransform: 'capitalize' }}>{order.type}</td>
                  <td>
                    <span className={`status-badge status-${order.status}`}>{order.status}</span>
                  </td>
                  <td>
                    <div className="action-btns">
                      {statusFlow.map(status => (
                        order.status !== status && (
                          <button key={status} className="action-btn edit" onClick={() => handleStatusChange(order.id, status)} title={status}>
                            <Check size={14} />
                          </button>
                        )
                      ))}
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
