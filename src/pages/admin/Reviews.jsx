import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Check, Star, X } from 'lucide-react'
import { useAdmin } from '../../context/AdminContext'
import { useToast } from '../../context/ToastContext'
import AdminLayout from '../../components/admin/AdminLayout'
import './Admin.css'

export default function AdminReviews() {
  const navigate = useNavigate()
  const { isAuthenticated, reviews, updateReviewStatus } = useAdmin()
  const { addToast } = useToast()

  useEffect(() => {
    if (!isAuthenticated) navigate('/admin')
  }, [isAuthenticated, navigate])

  if (!isAuthenticated) return null

  const handleApprove = id => {
    updateReviewStatus(id, true)
    addToast('Review approved.', 'success')
  }

  const handleHide = id => {
    updateReviewStatus(id, false)
    addToast('Review hidden.', 'success')
  }

  return (
    <AdminLayout title="Reviews Management">
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
                <td>
                  <strong>{review.name}</strong>
                </td>
                <td>
                  <div className="testimonial-stars">
                    {[1, 2, 3, 4, 5].map(star => (
                      <Star
                        key={star}
                        size={16}
                        fill={star <= review.rating ? '#F5A623' : 'none'}
                        color="#F5A623"
                      />
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
                    {!review.approved ? (
                      <button className="action-btn edit" onClick={() => handleApprove(review.id)} title="Approve">
                        <Check size={16} />
                      </button>
                    ) : (
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
    </AdminLayout>
  )
}
