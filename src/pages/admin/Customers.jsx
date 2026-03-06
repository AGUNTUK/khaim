import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAdmin } from '../../context/AdminContext'
import AdminLayout from '../../components/admin/AdminLayout'
import './Admin.css'

export default function AdminCustomers() {
  const navigate = useNavigate()
  const { isAuthenticated, customers } = useAdmin()

  useEffect(() => {
    if (!isAuthenticated) navigate('/admin')
  }, [isAuthenticated, navigate])

  if (!isAuthenticated) return null

  return (
    <AdminLayout title="Customer Management">
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
                <td>
                  <strong>{customer.name}</strong>
                </td>
                <td>{customer.phone}</td>
                <td>{customer.orders}</td>
                <td>BDT {customer.totalSpent.toLocaleString()}</td>
                <td>
                  <a
                    href={`https://wa.me/88${customer.phone}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="clay-btn clay-btn-secondary clay-btn-small"
                  >
                    Contact
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AdminLayout>
  )
}
