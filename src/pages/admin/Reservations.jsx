import { useEffect } from 'react'
import { Check, X } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useAdmin } from '../../context/AdminContext'
import { useToast } from '../../context/ToastContext'
import AdminLayout from '../../components/admin/AdminLayout'
import './Admin.css'

export default function AdminReservations() {
  const navigate = useNavigate()
  const { isAuthenticated, reservations, updateReservationStatus } = useAdmin()
  const { addToast } = useToast()

  useEffect(() => {
    if (!isAuthenticated) navigate('/admin')
  }, [isAuthenticated, navigate])

  if (!isAuthenticated) return null

  const handleStatusChange = (id, status) => {
    updateReservationStatus(id, status)
    addToast(`Reservation ${status}.`, 'success')
  }

  return (
    <AdminLayout title="Reservations Management">
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
            {reservations.map(reservation => (
              <tr key={reservation.id}>
                <td>
                  <strong>{reservation.name}</strong>
                </td>
                <td>{reservation.phone}</td>
                <td>{reservation.date}</td>
                <td>{reservation.time}</td>
                <td>{reservation.partySize}</td>
                <td style={{ maxWidth: 200 }}>{reservation.specialRequests || '-'}</td>
                <td>
                  <span
                    className={`status-badge status-${
                      reservation.status === 'confirmed'
                        ? 'confirmed'
                        : reservation.status === 'cancelled'
                          ? 'cancelled'
                          : 'pending'
                    }`}
                  >
                    {reservation.status}
                  </span>
                </td>
                <td>
                  <div className="action-btns">
                    {reservation.status === 'pending' ? (
                      <>
                        <button
                          className="action-btn edit"
                          onClick={() => handleStatusChange(reservation.id, 'confirmed')}
                        >
                          <Check size={16} />
                        </button>
                        <button
                          className="action-btn delete"
                          onClick={() => handleStatusChange(reservation.id, 'cancelled')}
                        >
                          <X size={16} />
                        </button>
                      </>
                    ) : null}
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
