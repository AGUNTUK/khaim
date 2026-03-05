import { useState } from 'react'
import { Calendar, Clock, Users, Phone, CheckCircle } from 'lucide-react'
import { useToast } from '../context/ToastContext'
import './Reservation.css'

const partySizes = [
  { value: '1-2', label: '1-2 People' },
  { value: '3-5', label: '3-5 People' },
  { value: '6-10', label: '6-10 People' },
  { value: '10+', label: '10+ People' },
]

const timeSlots = []
for (let hour = 10; hour <= 21; hour++) {
  timeSlots.push(`${hour > 12 ? hour - 12 : hour}:00 ${hour >= 12 ? 'PM' : 'AM'}`)
  if (hour < 21) {
    timeSlots.push(`${hour > 12 ? hour - 12 : hour}:30 ${hour >= 12 ? 'PM' : 'AM'}`)
  }
}

export default function Reservation() {
  const { addToast } = useToast()
  const [submitted, setSubmitted] = useState(false)
  
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    date: '',
    time: '',
    partySize: '',
    requests: ''
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    setSubmitted(true)
    addToast('Reservation request submitted! 📅', 'success')
  }

  if (submitted) {
    return (
      <div className="reservation-page">
        <div className="container">
          <div className="reservation-success clay-card">
            <div className="success-icon">
              <CheckCircle size={64} />
            </div>
            <h2>Reservation Requested! 🎉</h2>
            <p>Thank you for your reservation request.</p>
            
            <div className="success-details">
              <p><strong>Name:</strong> {formData.name}</p>
              <p><strong>Party Size:</strong> {formData.partySize} People</p>
              <p><strong>Date:</strong> {formData.date}</p>
              <p><strong>Time:</strong> {formData.time}</p>
            </div>
            
            <div className="success-note">
              <p>📞 We will call you at <strong>{formData.phone}</strong> within 30 minutes to confirm your reservation.</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="reservation-page">
      <div className="container">
        <div className="reservation-header">
          <h1>📅 Table Reservation</h1>
          <p>Reserve your table at Shapla Chattar, Rangpur</p>
        </div>

        <div className="reservation-layout">
          <div className="reservation-form-section">
            <form className="reservation-form clay-card" onSubmit={handleSubmit}>
              <h3>Reservation Details</h3>
              
              <div className="form-group">
                <label className="form-label">
                  <Users size={18} /> Full Name
                </label>
                <input
                  type="text"
                  className="clay-input"
                  placeholder="Enter your name"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">
                  <Phone size={18} /> Phone Number
                </label>
                <input
                  type="tel"
                  className="clay-input"
                  placeholder="017XXXXXXXX"
                  value={formData.phone}
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  required
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">
                    <Calendar size={18} /> Date
                  </label>
                  <input
                    type="date"
                    className="clay-input"
                    value={formData.date}
                    onChange={(e) => setFormData({...formData, date: e.target.value})}
                    min={new Date().toISOString().split('T')[0]}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">
                    <Clock size={18} /> Time
                  </label>
                  <select
                    className="clay-select"
                    value={formData.time}
                    onChange={(e) => setFormData({...formData, time: e.target.value})}
                    required
                  >
                    <option value="">Select time</option>
                    {timeSlots.map(slot => (
                      <option key={slot} value={slot}>{slot}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">
                  <Users size={18} /> Party Size
                </label>
                <div className="party-size-options">
                  {partySizes.map(size => (
                    <button
                      key={size.value}
                      type="button"
                      className={`party-size-btn ${formData.partySize === size.value ? 'active' : ''}`}
                      onClick={() => setFormData({...formData, partySize: size.value})}
                    >
                      {size.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Special Requests (Optional)</label>
                <textarea
                  className="clay-textarea"
                  placeholder="Birthday celebration, dietary requirements, etc."
                  value={formData.requests}
                  onChange={(e) => setFormData({...formData, requests: e.target.value})}
                ></textarea>
              </div>

              <button type="submit" className="clay-btn clay-btn-primary w-full">
                Confirm Reservation
              </button>
            </form>
          </div>

          <div className="reservation-info">
            <div className="info-card clay-card">
              <h3>Opening Hours</h3>
              <div className="hours-list">
                <div className="hours-item">
                  <span>Monday - Sunday</span>
                  <span>10:00 AM - 11:00 PM</span>
                </div>
              </div>
            </div>

            <div className="info-card clay-card">
              <h3>Reservation Policy</h3>
              <ul>
                <li>📞 Confirmation via phone call within 30 minutes</li>
                <li>⏰ Table reserved for 2 hours after booking time</li>
                <li>👨‍👩‍👧 Suitable for families, couples & groups</li>
                <li>🎂 Special arrangements for celebrations</li>
              </ul>
            </div>

            <div className="info-card clay-card">
              <h3>Contact Us</h3>
              <p>📍 Shapla Chattar, Rangpur</p>
              <p>📞 01744-750870</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
