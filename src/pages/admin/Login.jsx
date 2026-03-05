import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { LogIn } from 'lucide-react'
import { useAdmin } from '../../context/AdminContext'
import { useToast } from '../../context/ToastContext'
import './Admin.css'

export default function AdminLogin() {
  const navigate = useNavigate()
  const { login } = useAdmin()
  const { addToast } = useToast()
  
  const [email, setEmail] = useState('admin@khaim.com')
  const [password, setPassword] = useState('khaim123')
  const [loading, setLoading] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    setLoading(true)
    
    setTimeout(() => {
      const result = login(email, password)
      if (result.success) {
        addToast('Welcome back! 🎉', 'success')
        navigate('/admin/dashboard')
      } else {
        addToast(result.message, 'error')
      }
      setLoading(false)
    }, 500)
  }

  return (
    <div className="admin-login">
      <div className="login-container clay-card">
        <div className="login-logo">
          <img src="/logo.png" alt="KHAIM" style={{ width: 60, height: 60, borderRadius: 12 }} />
        </div>
        
        <p className="login-subtitle">Sign in to manage your restaurant</p>
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Email</label>
            <input
              type="email"
              className="clay-input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          
          <div className="form-group">
            <label className="form-label">Password</label>
            <input
              type="password"
              className="clay-input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          
          <button 
            type="submit" 
            className="clay-btn clay-btn-primary w-full"
            disabled={loading}
          >
            {loading ? 'Signing in...' : <><LogIn size={18} /> Sign In</>}
          </button>
        </form>
        
        <div className="login-hint">
          <p>Demo credentials:</p>
          <code>admin@khaim.com / khaim123</code>
        </div>
      </div>
    </div>
  )
}
