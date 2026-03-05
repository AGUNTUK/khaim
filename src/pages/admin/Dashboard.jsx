import { useEffect } from 'react'
import { useNavigate, useLocation, Link } from 'react-router-dom'
import { LayoutDashboard, ShoppingBag, Calendar, Users, ChefHat, Settings, LogOut, DollarSign, Clock, TrendingUp } from 'lucide-react'
import { useAdmin } from '../../context/AdminContext'
import './Admin.css'

const navItems = [
  { path: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/admin/menu', label: 'Menu', icon: ChefHat },
  { path: '/admin/orders', label: 'Orders', icon: ShoppingBag },
  { path: '/admin/reservations', label: 'Reservations', icon: Calendar },
  { path: '/admin/customers', label: 'Customers', icon: Users },
  { path: '/admin/offers', label: 'Offers', icon: TrendingUp },
  { path: '/admin/reviews', label: 'Reviews', icon: Users },
  { path: '/admin/settings', label: 'Settings', icon: Settings },
]

export default function AdminDashboard() {
  const navigate = useNavigate()
  const location = useLocation()
  const { isAuthenticated, logout, getStats, orders, reservations } = useAdmin()
  const stats = getStats()

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/admin')
    }
  }, [isAuthenticated, navigate])

  if (!isAuthenticated) return null

  const recentOrders = orders.slice(0, 5)
  const upcomingReservations = reservations.filter(r => r.status === 'confirmed').slice(0, 5)

  const handleLogout = () => {
    logout()
    navigate('/admin')
  }

  return (
    <div className="admin-wrapper">
      {/* Left Sidebar */}
      <aside className="admin-sidebar">
        <div className="admin-logo">
          <img src="/logo.png" alt="KHAIM" style={{ width: 40, height: 40, borderRadius: 8 }} />
        </div>

        <nav className="admin-nav">
          {navItems.map(item => (
            <Link
              key={item.path}
              to={item.path}
              className={`admin-nav-link ${location.pathname === item.path ? 'active' : ''}`}
            >
              <item.icon size={20} />
              {item.label}
            </Link>
          ))}
        </nav>

        <button className="admin-logout-btn" onClick={handleLogout}>
          <LogOut size={20} />
          Logout
        </button>
      </aside>

      {/* Main Content */}
      <main className="admin-main">
        <div className="container">
          <div className="admin-header">
            <h1>Dashboard</h1>
            <p>Welcome back! Here's what's happening today.</p>
          </div>

        {/* Stats */}
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon">
              <ShoppingBag size={24} />
            </div>
            <div className="stat-info">
              <h3>{stats.todayOrders}</h3>
              <p>Today's Orders</p>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">
              <DollarSign size={24} />
            </div>
            <div className="stat-info">
              <h3>BDT {stats.todayRevenue.toLocaleString()}</h3>
              <p>Today's Revenue</p>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">
              <Clock size={24} />
            </div>
            <div className="stat-info">
              <h3>{stats.pendingOrders}</h3>
              <p>Pending Orders</p>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">
              <Calendar size={24} />
            </div>
            <div className="stat-info">
              <h3>{stats.activeReservations}</h3>
              <p>Active Reservations</p>
            </div>
          </div>
        </div>

        {/* Recent Orders */}
        <div className="admin-table-container">
          <div className="admin-table-header">
            <h2>Recent Orders</h2>
            <Link to="/admin/orders" className="clay-btn clay-btn-secondary clay-btn-small">View All</Link>
          </div>
          <table className="admin-table">
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Customer</th>
                <th>Total</th>
                <th>Status</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {recentOrders.map(order => (
                <tr key={order.id}>
                  <td><strong>{order.id}</strong></td>
                  <td>{order.customerName}</td>
                  <td>BDT {order.total}</td>
                  <td>
                    <span className={`status-badge status-${order.status}`}>
                      {order.status}
                    </span>
                  </td>
                  <td>{order.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Upcoming Reservations */}
        <div className="admin-table-container" style={{ marginTop: '2rem' }}>
          <div className="admin-table-header">
            <h2>Upcoming Reservations</h2>
            <Link to="/admin/reservations" className="clay-btn clay-btn-secondary clay-btn-small">View All</Link>
          </div>
          <table className="admin-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Phone</th>
                <th>Date</th>
                <th>Time</th>
                <th>Party Size</th>
              </tr>
            </thead>
            <tbody>
              {upcomingReservations.length > 0 ? (
                upcomingReservations.map(res => (
                  <tr key={res.id}>
                    <td>{res.name}</td>
                    <td>{res.phone}</td>
                    <td>{res.date}</td>
                    <td>{res.time}</td>
                    <td>{res.partySize}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="empty-state">
                    <p>No upcoming reservations</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        </div>
      </main>
    </div>
  )
}
