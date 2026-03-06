import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowDown, ArrowUp, Edit, Eye, EyeOff, Plus, Trash2, X } from 'lucide-react'
import { useAdmin } from '../../context/AdminContext'
import { useToast } from '../../context/ToastContext'
import AdminLayout from '../../components/admin/AdminLayout'
import './Admin.css'

const defaultImage = 'https://images.unsplash.com/photo-1544025162-d76694265947?w=900'

export default function AdminHeroCarousel() {
  const navigate = useNavigate()
  const {
    isAuthenticated,
    heroDishes,
    addHeroDish,
    updateHeroDish,
    deleteHeroDish,
    reorderHeroDishes,
    uploadHeroImage,
  } = useAdmin()
  const { addToast } = useToast()

  const [showModal, setShowModal] = useState(false)
  const [editingDish, setEditingDish] = useState(null)
  const [isImageUploading, setIsImageUploading] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    tag: '',
    price: '',
    image: defaultImage,
    visible: true,
    order: 1,
  })

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/admin')
    }
  }, [isAuthenticated, navigate])

  const orderedDishes = useMemo(
    () => [...heroDishes].sort((first, second) => Number(first.order || 0) - Number(second.order || 0)),
    [heroDishes]
  )

  if (!isAuthenticated) return null

  const handleOpenModal = dish => {
    if (dish) {
      setEditingDish(dish)
      setFormData({
        name: dish.name || '',
        description: dish.description || '',
        tag: dish.tag || '',
        price: String(dish.price || ''),
        image: dish.image || defaultImage,
        visible: Boolean(dish.visible),
        order: Number(dish.order || 1),
      })
    } else {
      setEditingDish(null)
      setFormData({
        name: '',
        description: '',
        tag: '',
        price: '',
        image: defaultImage,
        visible: true,
        order: orderedDishes.length + 1,
      })
    }

    setShowModal(true)
  }

  const handleCloseModal = () => {
    setShowModal(false)
    setEditingDish(null)
    setIsImageUploading(false)
  }

  const handleSubmit = event => {
    event.preventDefault()

    const payload = {
      name: formData.name.trim(),
      description: formData.description.trim(),
      tag: formData.tag.trim(),
      price: Number(formData.price) || 0,
      image: formData.image.trim() || defaultImage,
      visible: formData.visible,
      order: Number(formData.order) || orderedDishes.length + 1,
    }

    if (editingDish) {
      updateHeroDish(editingDish.id, payload)
      addToast('Hero slide updated.', 'success')
    } else {
      addHeroDish(payload)
      addToast('Hero slide added.', 'success')
    }

    handleCloseModal()
  }

  const handleDelete = dishId => {
    if (!confirm('Delete this hero slide?')) return

    deleteHeroDish(dishId)
    addToast('Hero slide deleted.', 'success')
  }

  const handleVisibility = dish => {
    updateHeroDish(dish.id, { visible: !dish.visible })
    addToast(`Slide ${dish.visible ? 'hidden' : 'shown'} on homepage.`, 'success')
  }

  const handleMove = (dishId, direction) => {
    const currentIndex = orderedDishes.findIndex(item => item.id === dishId)
    const targetIndex = currentIndex + direction

    if (currentIndex < 0 || targetIndex < 0 || targetIndex >= orderedDishes.length) return

    const reordered = [...orderedDishes]
    ;[reordered[currentIndex], reordered[targetIndex]] = [reordered[targetIndex], reordered[currentIndex]]
    reorderHeroDishes(reordered)
  }

  const handleImageUpload = async event => {
    const file = event.target.files?.[0]
    if (!file) return

    setIsImageUploading(true)

    try {
      const imageUrl = await uploadHeroImage(file)
      setFormData(prev => ({ ...prev, image: imageUrl }))
      addToast('Hero image uploaded.', 'success')
    } catch (error) {
      addToast(error.message || 'Image upload failed.', 'error')
    } finally {
      setIsImageUploading(false)
      event.target.value = ''
    }
  }

  return (
    <AdminLayout
      title="Hero Carousel"
      subtitle="Edit homepage hero slides, images, and text from one place."
      actions={
        <button type="button" className="clay-btn clay-btn-primary" onClick={() => handleOpenModal()}>
          <Plus size={18} /> Add Slide
        </button>
      }
    >
      <div className="admin-table-container">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Preview</th>
              <th>Title</th>
              <th>Tag</th>
              <th>Price</th>
              <th>Order</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {orderedDishes.map((dish, index) => (
              <tr key={dish.id}>
                <td>
                  <img
                    src={dish.image || defaultImage}
                    alt={dish.name}
                    style={{ width: 72, height: 54, objectFit: 'cover', borderRadius: 10 }}
                  />
                </td>
                <td>
                  <strong>{dish.name}</strong>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{dish.description || 'No description'}</div>
                </td>
                <td>{dish.tag || '-'}</td>
                <td>BDT {Number(dish.price || 0).toLocaleString()}</td>
                <td>{dish.order || index + 1}</td>
                <td>
                  <span className={`status-badge ${dish.visible ? 'status-delivered' : 'status-cancelled'}`}>
                    {dish.visible ? 'Visible' : 'Hidden'}
                  </span>
                </td>
                <td>
                  <div className="action-btns">
                    <button
                      type="button"
                      className="action-btn edit"
                      onClick={() => handleMove(dish.id, -1)}
                      disabled={index === 0}
                      title="Move up"
                    >
                      <ArrowUp size={14} />
                    </button>
                    <button
                      type="button"
                      className="action-btn edit"
                      onClick={() => handleMove(dish.id, 1)}
                      disabled={index === orderedDishes.length - 1}
                      title="Move down"
                    >
                      <ArrowDown size={14} />
                    </button>
                    <button
                      type="button"
                      className="action-btn edit"
                      onClick={() => handleVisibility(dish)}
                      title={dish.visible ? 'Hide slide' : 'Show slide'}
                    >
                      {dish.visible ? <EyeOff size={14} /> : <Eye size={14} />}
                    </button>
                    <button type="button" className="action-btn edit" onClick={() => handleOpenModal(dish)} title="Edit slide">
                      <Edit size={14} />
                    </button>
                    <button type="button" className="action-btn delete" onClick={() => handleDelete(dish.id)} title="Delete slide">
                      <Trash2 size={14} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal ? (
        <div className="modal-overlay" onClick={handleCloseModal}>
          <div className="modal" onClick={event => event.stopPropagation()}>
            <div className="modal-header">
              <h2>{editingDish ? 'Edit Hero Slide' : 'Add Hero Slide'}</h2>
              <button type="button" className="action-btn" onClick={handleCloseModal}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="modal-body">
                <div className="form-group">
                  <label className="form-label">Title</label>
                  <input
                    type="text"
                    className="clay-input"
                    value={formData.name}
                    onChange={event => setFormData(prev => ({ ...prev, name: event.target.value }))}
                    required
                  />
                </div>

                <div className="form-grid">
                  <div className="form-group">
                    <label className="form-label">Tag</label>
                    <input
                      type="text"
                      className="clay-input"
                      value={formData.tag}
                      onChange={event => setFormData(prev => ({ ...prev, tag: event.target.value }))}
                      placeholder="Hot Offer"
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Price (BDT)</label>
                    <input
                      type="number"
                      className="clay-input"
                      value={formData.price}
                      onChange={event => setFormData(prev => ({ ...prev, price: event.target.value }))}
                      min="0"
                      required
                    />
                  </div>
                </div>

                <div className="form-grid">
                  <div className="form-group">
                    <label className="form-label">Display Order</label>
                    <input
                      type="number"
                      className="clay-input"
                      value={formData.order}
                      onChange={event => setFormData(prev => ({ ...prev, order: event.target.value }))}
                      min="1"
                    />
                  </div>
                  <div className="form-group">
                    <label className="checkbox-label" style={{ marginTop: '2rem' }}>
                      <input
                        type="checkbox"
                        checked={formData.visible}
                        onChange={event => setFormData(prev => ({ ...prev, visible: event.target.checked }))}
                      />
                      Visible on homepage
                    </label>
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Description</label>
                  <textarea
                    className="clay-textarea"
                    value={formData.description}
                    onChange={event => setFormData(prev => ({ ...prev, description: event.target.value }))}
                    placeholder="Describe this featured dish"
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
                  <p className="form-help-text">Upload a hero image from your device.</p>
                  {isImageUploading ? <p className="form-help-text">Uploading image...</p> : null}
                </div>

                <div className="form-group">
                  <label className="form-label">Image URL</label>
                  <input
                    type="url"
                    className="clay-input"
                    value={formData.image}
                    onChange={event => setFormData(prev => ({ ...prev, image: event.target.value }))}
                    placeholder="https://..."
                  />
                </div>

                {formData.image ? (
                  <img
                    src={formData.image}
                    alt="Hero preview"
                    className="admin-image-preview"
                  />
                ) : null}
              </div>

              <div className="modal-footer">
                <button type="button" className="clay-btn clay-btn-secondary" onClick={handleCloseModal}>
                  Cancel
                </button>
                <button type="submit" className="clay-btn clay-btn-primary" disabled={isImageUploading}>
                  {isImageUploading ? 'Uploading...' : editingDish ? 'Update Slide' : 'Add Slide'}
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : null}
    </AdminLayout>
  )
}
