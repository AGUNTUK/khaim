import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Edit, Plus, Trash2, X } from 'lucide-react'
import { useAdmin } from '../../context/AdminContext'
import { useToast } from '../../context/ToastContext'
import AdminLayout from '../../components/admin/AdminLayout'
import './Admin.css'

const categories = ['rice', 'burgers', 'grills', 'noodles', 'drinks', 'desserts', 'specials']

export default function AdminMenu() {
  const navigate = useNavigate()
  const { isAuthenticated, menuItems, addMenuItem, updateMenuItem, deleteMenuItem, uploadMenuImage } = useAdmin()
  const { addToast } = useToast()

  const [showModal, setShowModal] = useState(false)
  const [editingItem, setEditingItem] = useState(null)
  const [isImageUploading, setIsImageUploading] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    category: 'rice',
    description: '',
    price: '',
    image: '',
    badges: [],
    available: true,
  })

  useEffect(() => {
    if (!isAuthenticated) navigate('/admin')
  }, [isAuthenticated, navigate])

  if (!isAuthenticated) return null

  const handleOpenModal = (item = null) => {
    if (item) {
      setEditingItem(item)
      setFormData({
        ...item,
        badges: item.badges || [],
      })
    } else {
      setEditingItem(null)
      setFormData({
        name: '',
        category: 'rice',
        description: '',
        price: '',
        image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400',
        badges: [],
        available: true,
      })
    }

    setShowModal(true)
  }

  const handleCloseModal = () => {
    setShowModal(false)
    setEditingItem(null)
    setIsImageUploading(false)
  }

  const handleSubmit = event => {
    event.preventDefault()

    const itemData = {
      ...formData,
      price: Number(formData.price) || 0,
    }

    if (editingItem) {
      updateMenuItem(editingItem.id, itemData)
      addToast('Menu item updated.', 'success')
    } else {
      addMenuItem(itemData)
      addToast('Menu item added.', 'success')
    }

    handleCloseModal()
  }

  const handleImageUpload = async event => {
    const file = event.target.files?.[0]
    if (!file) return

    setIsImageUploading(true)

    try {
      const imageUrl = await uploadMenuImage(file)
      setFormData(prev => ({ ...prev, image: imageUrl }))
      addToast('Image uploaded successfully.', 'success')
    } catch (error) {
      addToast(error.message || 'Image upload failed.', 'error')
    } finally {
      setIsImageUploading(false)
      event.target.value = ''
    }
  }

  const handleDelete = id => {
    if (confirm('Are you sure you want to delete this item?')) {
      deleteMenuItem(id)
      addToast('Menu item deleted.', 'success')
    }
  }

  const toggleBadge = badge => {
    setFormData(prev => ({
      ...prev,
      badges: prev.badges.includes(badge)
        ? prev.badges.filter(existingBadge => existingBadge !== badge)
        : [...prev.badges, badge],
    }))
  }

  return (
    <AdminLayout
      title="Menu Management"
      actions={
        <button className="clay-btn clay-btn-primary" onClick={() => handleOpenModal()}>
          <Plus size={18} /> Add Item
        </button>
      }
    >
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
                  <img
                    src={item.image}
                    alt={item.name}
                    style={{ width: 50, height: 50, borderRadius: 8, objectFit: 'cover' }}
                  />
                </td>
                <td>
                  <strong>{item.name}</strong>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    {item.badges?.map(badge => `${badge}`).join(', ')}
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

      {showModal && (
        <div className="modal-overlay" onClick={handleCloseModal}>
          <div className="modal" onClick={event => event.stopPropagation()}>
            <div className="modal-header">
              <h2>{editingItem ? 'Edit Item' : 'Add New Item'}</h2>
              <button className="action-btn" onClick={handleCloseModal}>
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="modal-body">
                <div className="form-group">
                  <label className="form-label">Item Name</label>
                  <input
                    type="text"
                    className="clay-input"
                    value={formData.name}
                    onChange={event => setFormData({ ...formData, name: event.target.value })}
                    required
                  />
                </div>
                <div className="form-grid">
                  <div className="form-group">
                    <label className="form-label">Category</label>
                    <select
                      className="clay-select"
                      value={formData.category}
                      onChange={event => setFormData({ ...formData, category: event.target.value })}
                    >
                      {categories.map(category => (
                        <option key={category} value={category} style={{ textTransform: 'capitalize' }}>
                          {category}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Price (BDT)</label>
                    <input
                      type="number"
                      className="clay-input"
                      value={formData.price}
                      onChange={event => setFormData({ ...formData, price: event.target.value })}
                      required
                    />
                  </div>
                </div>
                <div className="form-group">
                  <label className="form-label">Description</label>
                  <textarea
                    className="clay-textarea"
                    value={formData.description}
                    onChange={event => setFormData({ ...formData, description: event.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Upload Image</label>
                  <input
                    type="file"
                    accept="image/*"
                    className="clay-input admin-file-input"
                    onChange={handleImageUpload}
                    disabled={isImageUploading}
                  />
                  <p className="form-help-text">
                    Upload directly from your device. If Supabase storage is unavailable, it falls back to local image
                    data.
                  </p>
                  {isImageUploading ? <p className="form-help-text">Uploading image...</p> : null}
                  {formData.image ? (
                    <img
                      src={formData.image}
                      alt="Menu preview"
                      className="admin-image-preview"
                    />
                  ) : null}
                </div>
                <div className="form-group">
                  <label className="form-label">Image URL</label>
                  <input
                    type="url"
                    className="clay-input"
                    value={formData.image}
                    onChange={event => setFormData({ ...formData, image: event.target.value })}
                    placeholder="https://..."
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Badges</label>
                  <div className="checkbox-group">
                    {['veg', 'spicy', 'chef'].map(badge => (
                      <label key={badge} className="checkbox-label">
                        <input
                          type="checkbox"
                          checked={formData.badges.includes(badge)}
                          onChange={() => toggleBadge(badge)}
                        />
                        {badge}
                      </label>
                    ))}
                  </div>
                </div>
                <div className="form-group">
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      checked={formData.available}
                      onChange={event => setFormData({ ...formData, available: event.target.checked })}
                    />
                    Available for ordering
                  </label>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="clay-btn clay-btn-secondary" onClick={handleCloseModal}>
                  Cancel
                </button>
                <button type="submit" className="clay-btn clay-btn-primary" disabled={isImageUploading}>
                  {isImageUploading ? 'Uploading...' : editingItem ? 'Update' : 'Add Item'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminLayout>
  )
}
