import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Edit, Plus, Trash2, X } from 'lucide-react'
import { useAdmin } from '../../context/AdminContext'
import { useToast } from '../../context/ToastContext'
import AdminLayout from '../../components/admin/AdminLayout'
import './Admin.css'

export default function AdminOffers() {
  const navigate = useNavigate()
  const { isAuthenticated, offers, addOffer, updateOffer, deleteOffer } = useAdmin()
  const { addToast } = useToast()
  const [showModal, setShowModal] = useState(false)
  const [editingOffer, setEditingOffer] = useState(null)
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    discount: '',
    type: 'percent',
    applicable: 'all',
    validUntil: '',
    active: true,
  })

  useEffect(() => {
    if (!isAuthenticated) navigate('/admin')
  }, [isAuthenticated, navigate])

  if (!isAuthenticated) return null

  const handleOpenModal = (offer = null) => {
    if (offer) {
      setEditingOffer(offer)
      setFormData(offer)
    } else {
      setEditingOffer(null)
      setFormData({
        name: '',
        description: '',
        discount: '',
        type: 'percent',
        applicable: 'all',
        validUntil: '',
        active: true,
      })
    }
    setShowModal(true)
  }

  const handleCloseModal = () => {
    setShowModal(false)
    setEditingOffer(null)
  }

  const handleSubmit = event => {
    event.preventDefault()

    const offerData = {
      ...formData,
      discount: Number.parseInt(formData.discount, 10),
    }

    if (editingOffer) {
      updateOffer(editingOffer.id, offerData)
      addToast('Offer updated.', 'success')
    } else {
      addOffer(offerData)
      addToast('Offer created.', 'success')
    }

    handleCloseModal()
  }

  const handleDelete = id => {
    if (confirm('Delete this offer?')) {
      deleteOffer(id)
      addToast('Offer deleted.', 'success')
    }
  }

  const handleToggle = offer => {
    updateOffer(offer.id, { active: !offer.active })
    addToast(`Offer ${offer.active ? 'disabled' : 'enabled'}.`, 'success')
  }

  return (
    <AdminLayout
      title="Offers & Promotions"
      actions={
        <button className="clay-btn clay-btn-primary" onClick={() => handleOpenModal()}>
          <Plus size={18} /> Add Offer
        </button>
      }
    >
      <div className="admin-table-container">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Description</th>
              <th>Discount</th>
              <th>Valid Until</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {offers.map(offer => (
              <tr key={offer.id}>
                <td>
                  <strong>{offer.name}</strong>
                </td>
                <td>{offer.description}</td>
                <td>
                  {offer.type === 'percent'
                    ? `${offer.discount}%`
                    : offer.type === 'delivery'
                      ? 'Free Delivery'
                      : `BDT ${offer.discount}`}
                </td>
                <td>{offer.validUntil}</td>
                <td>
                  <button
                    onClick={() => handleToggle(offer)}
                    className={`status-badge ${offer.active ? 'status-delivered' : 'status-cancelled'}`}
                    style={{ border: 'none', cursor: 'pointer' }}
                  >
                    {offer.active ? 'Active' : 'Inactive'}
                  </button>
                </td>
                <td>
                  <div className="action-btns">
                    <button className="action-btn edit" onClick={() => handleOpenModal(offer)}>
                      <Edit size={16} />
                    </button>
                    <button className="action-btn delete" onClick={() => handleDelete(offer.id)}>
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={handleCloseModal}>
          <div className="modal" onClick={event => event.stopPropagation()}>
            <div className="modal-header">
              <h2>{editingOffer ? 'Edit Offer' : 'Add New Offer'}</h2>
              <button className="action-btn" onClick={handleCloseModal}>
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="modal-body">
                <div className="form-group">
                  <label className="form-label">Offer Name</label>
                  <input
                    type="text"
                    className="clay-input"
                    value={formData.name}
                    onChange={event => setFormData({ ...formData, name: event.target.value })}
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Description</label>
                  <textarea
                    className="clay-textarea"
                    value={formData.description}
                    onChange={event => setFormData({ ...formData, description: event.target.value })}
                  />
                </div>
                <div className="form-grid">
                  <div className="form-group">
                    <label className="form-label">Discount</label>
                    <input
                      type="number"
                      className="clay-input"
                      value={formData.discount}
                      onChange={event => setFormData({ ...formData, discount: event.target.value })}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Type</label>
                    <select
                      className="clay-select"
                      value={formData.type}
                      onChange={event => setFormData({ ...formData, type: event.target.value })}
                    >
                      <option value="percent">Percentage</option>
                      <option value="fixed">Fixed Amount</option>
                      <option value="delivery">Free Delivery</option>
                    </select>
                  </div>
                </div>
                <div className="form-group">
                  <label className="form-label">Valid Until</label>
                  <input
                    type="date"
                    className="clay-input"
                    value={formData.validUntil}
                    onChange={event => setFormData({ ...formData, validUntil: event.target.value })}
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      checked={formData.active}
                      onChange={event => setFormData({ ...formData, active: event.target.checked })}
                    />
                    Active
                  </label>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="clay-btn clay-btn-secondary" onClick={handleCloseModal}>
                  Cancel
                </button>
                <button type="submit" className="clay-btn clay-btn-primary">
                  {editingOffer ? 'Update' : 'Add Offer'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminLayout>
  )
}
