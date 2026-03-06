import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Check } from 'lucide-react'
import { useAdmin } from '../../context/AdminContext'
import { useToast } from '../../context/ToastContext'
import AdminLayout from '../../components/admin/AdminLayout'
import './Admin.css'

const statusFlow = ['pending', 'confirmed', 'preparing', 'delivered']

export default function AdminOrders() {
  const navigate = useNavigate()
  const { isAuthenticated, orders, updateOrderStatus } = useAdmin()
  const { addToast } = useToast()
  const [filter, setFilter] = useState('all')

  useEffect(() => {
    if (!isAuthenticated) navigate('/admin')
  }, [isAuthenticated, navigate])

  if (!isAuthenticated) return null

  const filteredOrders = filter === 'all' ? orders : orders.filter(order => order.status === filter)

  const handleStatusChange = (orderId, newStatus) => {
    updateOrderStatus(orderId, newStatus)
    addToast(`Order status updated to ${newStatus}.`, 'success')
  }

  return (
    <AdminLayout title="Orders Management">
      <div className="admin-filter-row">
        {['all', 'pending', 'confirmed', 'preparing', 'delivered'].map(status => (
          <button
            key={status}
            className={`category-tab ${filter === status ? 'active' : ''}`}
            onClick={() => setFilter(status)}
          >
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
              <th>Location</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredOrders.map(order => (
              <tr key={order.id}>
                <td>
                  <strong>{order.id}</strong>
                </td>
                <td>
                  <div>{order.customerName}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{order.phone}</div>
                </td>
                <td>
                  {order.items.map((item, index) => (
                    <div key={index} style={{ fontSize: '0.875rem' }}>
                      {item.quantity}x {item.name}
                    </div>
                  ))}
                </td>
                <td>
                  <strong>BDT {order.total}</strong>
                </td>
                <td style={{ textTransform: 'capitalize' }}>{order.type}</td>
                <td style={{ maxWidth: 220 }}>
                  {order.type === 'delivery' ? (order.address || 'Address missing') : 'Pickup order'}
                </td>
                <td>
                  <span className={`status-badge status-${order.status}`}>{order.status}</span>
                </td>
                <td>
                  <div className="action-btns">
                    {statusFlow.map(status =>
                      order.status !== status ? (
                        <button
                          key={status}
                          className="action-btn edit"
                          onClick={() => handleStatusChange(order.id, status)}
                          title={status}
                        >
                          <Check size={14} />
                        </button>
                      ) : null
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AdminLayout>
  )
}
