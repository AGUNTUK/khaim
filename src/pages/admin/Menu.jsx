import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Plus, Edit, Trash2, X, ChefHat, ShoppingBag, Calendar, Users, Settings, LogOut, Image } from 'lucide-react'
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

const categories = ['rice', 'burgers', 'grills', 'noodles', 'drinks', 'desserts', 'specials']

export default function AdminMenu() {
  const navigate = useNavigate()
  const { isAuthenticated, logout, menuItems, addMenuItem, updateMenuItem, deleteMenuItem } = useAdmin()
  const { addToast } = useToast()
  
  const [showModal, setShowModal] = useState(false)
  const [editingItem, setEditingItem] = useState(null)
  const [formData, setFormData] = useState({
    name: '',
    category: 'rice',
    description: '',
    price: '',
    image: '',
    badges: [],
    available: true
  })

  useEffect(() => {
    if (!isAuthenticated) navigate('/admin')
  }, [isAuthenticated, navigate])

  if (!isAuthenticated) return null

  const handleOpenModal = (item = null) => {
    if (item) {
      setEditingItem(item)
      setFormData(item)
    } else {
      setEditingItem(null)
      setFormData({
        name: '',
        category: 'rice',
        description: '',
        price: '',
        image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400',
        badges: [],
        available: true
      })
    }
    setShowModal(true)
  }

  const handleCloseModal = () => {
    setShowModal(false)
    setEditingItem(null)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const itemData = {
      ...formData,
      price: parseInt(formData.price)
    }
    
    if (editingItem) {
      updateMenuItem(editingItem.id, itemData)
      addToast('Menu item updated! ✏️', 'success')
    } else {
      addMenuItem(itemData)
      addToast('Menu item added! ✨', 'success')
    }
    handleCloseModal()
  }

  const handleDelete = (id) => {
    if (confirm('Are you sure you want to delete this item?')) {
      deleteMenuItem(id)
      addToast('Menu item deleted! 🗑️', 'success')
    }
  }

  const toggleBadge = (badge) => {
    setFormData(prev => ({
      ...prev,
      badges: prev.badges.includes(badge)
        ? prev.badges.filter(b => b !== badge)
        : [...prev.badges, badge]
    }))
  }

  const handleLogout = () => {
    logout()
    navigate('/admin')
  }

  return (
    <div className="admin-wrapper">
      <aside className="admin-sidebar">
        <div className="admin-logo">
          <div className="logo-icon"><span>🔥</span></div>
          <h2>KHAIM</h2>
        </div>
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
          <h1>Menu Management</h1>
          <button className="clay-btn clay-btn-primary" onClick={() => handleOpenModal()}>
            <Plus size={18} /> Add Item
          </button>
        </div>

        <div className="admin-table-container">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Image</th>
                <th>Name</th>
                <th>Category</th>
                <th>Price</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {menuItems.map(item => (
                <tr key={item.id}>
                  <td>
                    <img src={item.image} alt={item.name} style={{ width: 50, height: 50, borderRadius: 8, objectFit: 'cover' }} />
                  </td>
                  <td>
                    <strong>{item.name}</strong>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                      {item.badges?.map(b => `${b}`).join(', ')}
                    </div>
                  </td>
                  <td style={{ textTransform: 'capitalize' }}>{item.category}</td>
                  <td>BDT {item.price}</td>
                  <td>
                    <span className={`status-badge ${item.available ? 'status-delivered' : 'status-cancelled'}`}>
                      {item.available ? 'Available' : 'Unavailable'}
                    </span>
                  </td>
                  <td>
                    <div className="action-btns">
                      <button className="action-btn edit" onClick={() => handleOpenModal(item)}>
                        <Edit size={16} />
                      </button>
                      <button className="action-btn delete" onClick={() => handleDelete(item.id)}>
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Modal */}
        {showModal && (
          <div className="modal-overlay" onClick={handleCloseModal}>
            <div className="modal" onClick={e => e.stopPropagation()}>
              <div className="modal-header">
                <h2>{editingItem ? 'Edit Item' : 'Add New Item'}</h2>
                <button className="action-btn" onClick={handleCloseModal}><X size={20} /></button>
              </div>
              <form onSubmit={handleSubmit}>
                <div className="modal-body">
                  <div className="form-group">
                    <label className="form-label">Item Name</label>
                    <input type="text" className="clay-input" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} required />
                  </div>
                  <div className="form-grid">
                    <div className="form-group">
                      <label className="form-label">Category</label>
                      <select className="clay-select" value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})}>
                        {categories.map(cat => (
                          <option key={cat} value={cat} style={{ textTransform: 'capitalize' }}>{cat}</option>
                        ))}
                      </select>
                    </div>
                    <div className="form-group">
                      <label className="form-label">Price (BDT)</label>
                      <input type="number" className="clay-input" value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} required />
                    </div>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Description</label>
                    <textarea className="clay-textarea" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})}></textarea>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Image URL</label>
                    <input type="url" className="clay-input" value={formData.image} onChange={e => setFormData({...formData, image: e.target.value})} placeholder="https://..." />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Badges</label>
                    <div className="checkbox-group">
                      {['veg', 'spicy', 'chef'].map(badge => (
                        <label key={badge} className="checkbox-label">
                          <input type="checkbox" checked={formData.badges.includes(badge)} onChange={() => toggleBadge(badge)} />
                          {badge}
                        </label>
                      ))}
                    </div>
                  </div>
                  <div className="form-group">
                    <label className="checkbox-label">
                      <input type="checkbox" checked={formData.available} onChange={e => setFormData({...formData, available: e.target.checked})} />
                      Available for ordering
                    </label>
                  </div>
                </div>
                <div className="modal-footer">
                  <button type="button" className="clay-btn clay-btn-secondary" onClick={handleCloseModal}>Cancel</button>
                  <button type="submit" className="clay-btn clay-btn-primary">{editingItem ? 'Update' : 'Add Item'}</button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
