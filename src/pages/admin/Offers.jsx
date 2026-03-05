import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Plus, Edit, Trash2, X, ChefHat, ShoppingBag, Calendar, Users, Settings, LogOut } from 'lucide-react'
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

export default function AdminOffers() {
  const navigate = useNavigate()
  const { isAuthenticated, logout, offers, addOffer, updateOffer, deleteOffer } = useAdmin()
  const { addToast } = useToast()
  const [showModal, setShowModal] = useState(false)
  const [editingOffer, setEditingOffer] = useState(null)
  const [formData, setFormData] = useState({ name: '', description: '', discount: '', type: 'percent', applicable: 'all', validUntil: '', active: true })

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
      setFormData({ name: '', description: '', discount: '', type: 'percent', applicable: 'all', validUntil: '', active: true })
    }
    setShowModal(true)
  }

  const handleCloseModal = () => {
    setShowModal(false)
    setEditingOffer(null)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const offerData = { ...formData, discount: parseInt(formData.discount) }
    if (editingOffer) {
      updateOffer(editingOffer.id, offerData)
      addToast('Offer updated! ✏️', 'success')
    } else {
      addOffer(offerData)
      addToast('Offer created! 🎉', 'success')
    }
    handleCloseModal()
  }

  const handleDelete = (id) => {
    if (confirm('Delete this offer?')) {
      deleteOffer(id)
      addToast('Offer deleted! 🗑️', 'success')
    }
  }

  const handleToggle = (offer) => {
    updateOffer(offer.id, { active: !offer.active })
    addToast(`Offer ${offer.active ? 'disabled' : 'enabled'}!`, 'success')
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
          <h1>Offers & Promotions</h1>
          <button className="clay-btn clay-btn-primary" onClick={() => handleOpenModal()}>
            <Plus size={18} /> Add Offer
          </button>
        </div>

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
                  <td><strong>{offer.name}</strong></td>
                  <td>{offer.description}</td>
                  <td>{offer.type === 'percent' ? `${offer.discount}%` : offer.type === 'delivery' ? 'Free Delivery' : `BDT ${offer.discount}`}</td>
                  <td>{offer.validUntil}</td>
                  <td>
                    <button onClick={() => handleToggle(offer)} className={`status-badge ${offer.active ? 'status-delivered' : 'status-cancelled'}`} style={{ border: 'none', cursor: 'pointer' }}>
                      {offer.active ? 'Active' : 'Inactive'}
                    </button>
                  </td>
                  <td>
                    <div className="action-btns">
                      <button className="action-btn edit" onClick={() => handleOpenModal(offer)}><Edit size={16} /></button>
                      <button className="action-btn delete" onClick={() => handleDelete(offer.id)}><Trash2 size={16} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {showModal && (
          <div className="modal-overlay" onClick={handleCloseModal}>
            <div className="modal" onClick={e => e.stopPropagation()}>
              <div className="modal-header">
                <h2>{editingOffer ? 'Edit Offer' : 'Add New Offer'}</h2>
                <button className="action-btn" onClick={handleCloseModal}><X size={20} /></button>
              </div>
              <form onSubmit={handleSubmit}>
                <div className="modal-body">
                  <div className="form-group">
                    <label className="form-label">Offer Name</label>
                    <input type="text" className="clay-input" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} required />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Description</label>
                    <textarea className="clay-textarea" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})}></textarea>
                  </div>
                  <div className="form-grid">
                    <div className="form-group">
                      <label className="form-label">Discount</label>
                      <input type="number" className="clay-input" value={formData.discount} onChange={e => setFormData({...formData, discount: e.target.value})} required />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Type</label>
                      <select className="clay-select" value={formData.type} onChange={e => setFormData({...formData, type: e.target.value})}>
                        <option value="percent">Percentage</option>
                        <option value="fixed">Fixed Amount</option>
                        <option value="delivery">Free Delivery</option>
                      </select>
                    </div>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Valid Until</label>
                    <input type="date" className="clay-input" value={formData.validUntil} onChange={e => setFormData({...formData, validUntil: e.target.value})} required />
                  </div>
                  <div className="form-group">
                    <label className="checkbox-label">
                      <input type="checkbox" checked={formData.active} onChange={e => setFormData({...formData, active: e.target.checked})} />
                      Active
                    </label>
                  </div>
                </div>
                <div className="modal-footer">
                  <button type="button" className="clay-btn clay-btn-secondary" onClick={handleCloseModal}>Cancel</button>
                  <button type="submit" className="clay-btn clay-btn-primary">{editingOffer ? 'Update' : 'Add Offer'}</button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
