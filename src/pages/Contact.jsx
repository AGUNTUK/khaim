import { useState } from 'react'
import { MapPin, Phone, Clock, Send, CheckCircle } from 'lucide-react'
import { useAdmin } from '../context/AdminContext'
import { useToast } from '../context/ToastContext'
import './Contact.css'

export default function Contact() {
  const { settings } = useAdmin()
  const { addToast } = useToast()
  const [submitted, setSubmitted] = useState(false)
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    setSubmitted(true)
    addToast('Message sent successfully! 📧', 'success')
  }

  return (
    <div className="contact-page">
      <div className="container">
        <div className="contact-header">
          <h1>📞 Contact Us</h1>
          <p>We'd love to hear from you</p>
        </div>

        <div className="contact-layout">
          <div className="contact-info-section">
            <div className="contact-card clay-card">
              <div className="contact-icon">
                <MapPin size={24} />
              </div>
              <div>
                <h3>Location</h3>
                <p>{settings.address}</p>
              </div>
            </div>

            <div className="contact-card clay-card">
              <div className="contact-icon">
                <Phone size={24} />
              </div>
              <div>
                <h3>Phone</h3>
                <p>{settings.phone}</p>
              </div>
            </div>

            <div className="contact-card clay-card">
              <div className="contact-icon">
                <Clock size={24} />
              </div>
              <div>
                <h3>Opening Hours</h3>
                <p>{settings.hours}</p>
                <p className="hours-note">Open Daily</p>
              </div>
            </div>

            <div className="whatsapp-card clay-card">
              <h3>Quick Chat</h3>
              <p>Have questions? Chat with us on WhatsApp!</p>
              <a 
                href={`https://wa.me/8801744750870`}
                target="_blank"
                rel="noopener noreferrer"
                className="clay-btn clay-btn-primary"
              >
                💬 Chat on WhatsApp
              </a>
            </div>
          </div>

          <div className="contact-form-section">
            <div className="contact-form clay-card">
              <h2>Send us a Message</h2>
              
              {submitted ? (
                <div className="form-success">
                  <CheckCircle size={48} />
                  <h3>Message Sent!</h3>
                  <p>Thank you for reaching out. We'll get back to you soon.</p>
                  <button 
                    className="clay-btn clay-btn-secondary"
                    onClick={() => setSubmitted(false)}
                  >
                    Send Another Message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit}>
                  <div className="form-group">
                    <label className="form-label">Your Name</label>
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
                    <label className="form-label">Email or Phone</label>
                    <input
                      type="text"
                      className="clay-input"
                      placeholder="Enter your email or phone"
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Message</label>
                    <textarea
                      className="clay-textarea"
                      placeholder="Write your message here..."
                      value={formData.message}
                      onChange={(e) => setFormData({...formData, message: e.target.value})}
                      required
                    ></textarea>
                  </div>

                  <button type="submit" className="clay-btn clay-btn-primary w-full">
                    <Send size={18} /> Send Message
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>

        {/* Map */}
        <div className="contact-map clay-card">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3573.78923456789!2d89.237!3d25.7439!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39e32dde6b1e1e1f%3A0x1!2sShapla%20Chattar%2C%20Rangpur!5e0!3m2!1sen!2sbd!4v1234567890"
            width="100%"
            height="400"
            style={{ border: 0, borderRadius: '16px' }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="KHAIM Location"
          ></iframe>
        </div>
      </div>
    </div>
  )
}
