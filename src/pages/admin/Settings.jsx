import { useEffect, useState } from 'react'
import { Save } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useAdmin } from '../../context/AdminContext'
import { useToast } from '../../context/ToastContext'
import AdminLayout from '../../components/admin/AdminLayout'
import './Admin.css'

export default function AdminSettings() {
  const navigate = useNavigate()
  const { isAuthenticated, settings, updateSettings } = useAdmin()
  const { addToast } = useToast()
  const [formData, setFormData] = useState(settings)

  useEffect(() => {
    if (!isAuthenticated) navigate('/admin')
  }, [isAuthenticated, navigate])

  useEffect(() => {
    setFormData(settings)
  }, [settings])

  if (!isAuthenticated) return null

  const handleSubmit = event => {
    event.preventDefault()
    updateSettings(formData)
    addToast('Settings saved.', 'success')
  }

  return (
    <AdminLayout title="Settings">
      <form onSubmit={handleSubmit} className="admin-form">
        <h2>Restaurant Information</h2>

        <div className="form-grid">
          <div className="form-group">
            <label className="form-label">Restaurant Name</label>
            <input
              type="text"
              className="clay-input"
              value={formData.restaurantName}
              onChange={event => setFormData({ ...formData, restaurantName: event.target.value })}
            />
          </div>
          <div className="form-group">
            <label className="form-label">Tagline</label>
            <input
              type="text"
              className="clay-input"
              value={formData.tagline}
              onChange={event => setFormData({ ...formData, tagline: event.target.value })}
            />
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">Address</label>
          <input
            type="text"
            className="clay-input"
            value={formData.address}
            onChange={event => setFormData({ ...formData, address: event.target.value })}
          />
        </div>

        <div className="form-grid">
          <div className="form-group">
            <label className="form-label">Phone</label>
            <input
              type="text"
              className="clay-input"
              value={formData.phone}
              onChange={event => setFormData({ ...formData, phone: event.target.value })}
            />
          </div>
          <div className="form-group">
            <label className="form-label">Opening Hours</label>
            <input
              type="text"
              className="clay-input"
              value={formData.hours}
              onChange={event => setFormData({ ...formData, hours: event.target.value })}
            />
          </div>
        </div>

        <h2 className="mt-4">Delivery Settings</h2>

        <div className="form-grid">
          <div className="form-group">
            <label className="form-label">Delivery Radius (km)</label>
            <input
              type="number"
              className="clay-input"
              value={formData.deliveryRadius}
              onChange={event =>
                setFormData({ ...formData, deliveryRadius: Number.parseInt(event.target.value, 10) })
              }
            />
          </div>
          <div className="form-group">
            <label className="form-label">Minimum Order (BDT)</label>
            <input
              type="number"
              className="clay-input"
              value={formData.minOrder}
              onChange={event => setFormData({ ...formData, minOrder: Number.parseInt(event.target.value, 10) })}
            />
          </div>
        </div>

        <h2 className="mt-4">Payment Methods</h2>

        <div className="checkbox-group mb-3">
          <label className="checkbox-label">
            <input
              type="checkbox"
              checked={formData.paymentMethods.cod}
              onChange={event =>
                setFormData({
                  ...formData,
                  paymentMethods: {
                    ...formData.paymentMethods,
                    cod: event.target.checked,
                  },
                })
              }
            />
            Cash on Delivery
          </label>
          <label className="checkbox-label">
            <input
              type="checkbox"
              checked={formData.paymentMethods.bkash}
              onChange={event =>
                setFormData({
                  ...formData,
                  paymentMethods: {
                    ...formData.paymentMethods,
                    bkash: event.target.checked,
                  },
                })
              }
            />
            bKash
          </label>
          <label className="checkbox-label">
            <input
              type="checkbox"
              checked={formData.paymentMethods.nagad}
              onChange={event =>
                setFormData({
                  ...formData,
                  paymentMethods: {
                    ...formData.paymentMethods,
                    nagad: event.target.checked,
                  },
                })
              }
            />
            Nagad
          </label>
        </div>

        <h2 className="mt-4">Social Media Links</h2>

        <div className="form-grid">
          <div className="form-group">
            <label className="form-label">Facebook</label>
            <input
              type="url"
              className="clay-input"
              value={formData.social.facebook}
              onChange={event =>
                setFormData({
                  ...formData,
                  social: {
                    ...formData.social,
                    facebook: event.target.value,
                  },
                })
              }
            />
          </div>
          <div className="form-group">
            <label className="form-label">Instagram</label>
            <input
              type="url"
              className="clay-input"
              value={formData.social.instagram}
              onChange={event =>
                setFormData({
                  ...formData,
                  social: {
                    ...formData.social,
                    instagram: event.target.value,
                  },
                })
              }
            />
          </div>
        </div>

        <button type="submit" className="clay-btn clay-btn-primary mt-4">
          <Save size={18} /> Save Settings
        </button>
      </form>
    </AdminLayout>
  )
}
