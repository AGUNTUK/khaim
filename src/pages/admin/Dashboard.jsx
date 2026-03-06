import { useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { BarChart3, Calendar, Clock, DollarSign, ShoppingBag, TrendingUp } from 'lucide-react'
import { useAdmin } from '../../context/AdminContext'
import AdminLayout from '../../components/admin/AdminLayout'
import './Admin.css'

export default function AdminDashboard() {
  const navigate = useNavigate()
  const { isAuthenticated, getStats, getAnalytics, orders, reservations } = useAdmin()
  const stats = getStats()
  const analytics = getAnalytics()

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/admin')
    }
  }, [isAuthenticated, navigate])

  if (!isAuthenticated) return null

  const recentOrders = orders.slice(0, 5)
  const upcomingReservations = reservations
    .filter(reservation => reservation.status === 'confirmed')
    .slice(0, 5)
  const safeMaxRevenue = Math.max(analytics.maxDailyRevenue || 0, 1)

  return (
    <AdminLayout
      title="Dashboard"
      subtitle="Welcome back! Here's what's happening today."
    >
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

      <div className="analytics-grid">
        <article className="analytics-card">
          <div className="analytics-card-head">
            <span>Total Revenue</span>
            <DollarSign size={18} />
          </div>
          <strong className="analytics-card-value">BDT {analytics.totalRevenue.toLocaleString()}</strong>
          <p className="analytics-card-note">All-time completed + active orders</p>
        </article>

        <article className="analytics-card">
          <div className="analytics-card-head">
            <span>This Month</span>
            <TrendingUp size={18} />
          </div>
          <strong className="analytics-card-value">BDT {analytics.monthlyRevenue.toLocaleString()}</strong>
          <p className="analytics-card-note">Revenue in current month</p>
        </article>

        <article className="analytics-card">
          <div className="analytics-card-head">
            <span>Average Order</span>
            <BarChart3 size={18} />
          </div>
          <strong className="analytics-card-value">BDT {Math.round(analytics.averageOrderValue).toLocaleString()}</strong>
          <p className="analytics-card-note">Across {analytics.totalOrders} total orders</p>
        </article>

        <article className="analytics-card">
          <div className="analytics-card-head">
            <span>Completion Rate</span>
            <Clock size={18} />
          </div>
          <strong className="analytics-card-value">{analytics.completionRate.toFixed(1)}%</strong>
          <p className="analytics-card-note">{analytics.deliveredOrders} delivered orders</p>
        </article>
      </div>

      <section className="admin-analytics-panels">
        <article className="analytics-panel">
          <div className="analytics-panel-head">
            <h2>Sales Last 7 Days</h2>
            <span>Revenue trend</span>
          </div>

          <div className="sales-bars">
            {analytics.dailySales.map(day => {
              const width = Math.max(8, (day.revenue / safeMaxRevenue) * 100)

              return (
                <div key={day.key} className="sales-bar-item">
                  <div className="sales-bar-meta">
                    <strong>{day.label}</strong>
                    <span>{day.count} orders</span>
                  </div>
                  <div className="sales-bar-track">
                    <div className="sales-bar-fill" style={{ width: `${width}%` }} />
                  </div>
                  <strong className="sales-bar-value">BDT {day.revenue.toLocaleString()}</strong>
                </div>
              )
            })}
          </div>
        </article>

        <article className="analytics-panel">
          <div className="analytics-panel-head">
            <h2>Top Categories</h2>
            <span>By revenue contribution</span>
          </div>

          {analytics.topCategories.length > 0 ? (
            <div className="category-revenue-list">
              {analytics.topCategories.map(entry => (
                <div key={entry.category} className="category-revenue-item">
                  <span className="category-revenue-name">{entry.category}</span>
                  <strong className="category-revenue-value">BDT {entry.revenue.toLocaleString()}</strong>
                </div>
              ))}
            </div>
          ) : (
            <p className="category-revenue-empty">No category analytics yet. Place a few orders to populate data.</p>
          )}
        </article>
      </section>

      <div className="admin-table-container">
        <div className="admin-table-header">
          <h2>Recent Orders</h2>
          <Link to="/admin/orders" className="clay-btn clay-btn-secondary clay-btn-small">
            View All
          </Link>
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
                <td>
                  <strong>{order.id}</strong>
                </td>
                <td>{order.customerName}</td>
                <td>BDT {order.total}</td>
                <td>
                  <span className={`status-badge status-${order.status}`}>{order.status}</span>
                </td>
                <td>{order.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="admin-table-container mt-4">
        <div className="admin-table-header">
          <h2>Upcoming Reservations</h2>
          <Link to="/admin/reservations" className="clay-btn clay-btn-secondary clay-btn-small">
            View All
          </Link>
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
              upcomingReservations.map(reservation => (
                <tr key={reservation.id}>
                  <td>{reservation.name}</td>
                  <td>{reservation.phone}</td>
                  <td>{reservation.date}</td>
                  <td>{reservation.time}</td>
                  <td>{reservation.partySize}</td>
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
    </AdminLayout>
  )
}
