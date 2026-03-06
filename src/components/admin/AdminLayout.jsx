import { useEffect, useState } from 'react'
import { Menu, X, LogOut } from 'lucide-react'
import { NavLink, useLocation, useNavigate } from 'react-router-dom'
import { useAdmin } from '../../context/AdminContext'
import { adminNavItems } from './adminNavItems'
import AdminNotificationBell from './AdminNotificationBell'

export default function AdminLayout({ title, subtitle, actions, children }) {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()
  const { logout } = useAdmin()

  useEffect(() => {
    setIsDrawerOpen(false)
  }, [location.pathname])

  useEffect(() => {
    if (!isDrawerOpen) {
      return undefined
    }

    const handleEscape = event => {
      if (event.key === 'Escape') {
        setIsDrawerOpen(false)
      }
    }

    window.addEventListener('keydown', handleEscape)

    return () => {
      window.removeEventListener('keydown', handleEscape)
    }
  }, [isDrawerOpen])

  useEffect(() => {
    if (!isDrawerOpen) {
      return undefined
    }

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    return () => {
      document.body.style.overflow = previousOverflow
    }
  }, [isDrawerOpen])

  const handleLogout = () => {
    logout()
    navigate('/admin')
  }

  return (
    <div className="admin-shell">
      <header className="admin-topbar">
        <div className="admin-topbar-main">
          <button
            type="button"
            className="admin-menu-button"
            onClick={() => setIsDrawerOpen(prev => !prev)}
            aria-label="Toggle navigation menu"
            aria-expanded={isDrawerOpen}
          >
            {isDrawerOpen ? <X size={20} /> : <Menu size={20} />}
          </button>

          <div className="admin-topbar-brand">
            <img src="/logo.png" alt="KHAIM" />
            <span>Admin Panel</span>
          </div>
        </div>

        <AdminNotificationBell className="admin-notification--topbar" enableToasts={false} />
      </header>

      {isDrawerOpen && (
        <button
          type="button"
          className="admin-drawer-overlay"
          onClick={() => setIsDrawerOpen(false)}
          aria-label="Close navigation menu"
        />
      )}

      <aside className={`admin-sidebar ${isDrawerOpen ? 'open' : ''}`}>
        <div className="admin-logo">
          <img src="/logo.png" alt="KHAIM logo" />
          <h2>KHAIM Admin</h2>
        </div>

        <nav className="admin-nav">
          {adminNavItems.map(item => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) => `admin-nav-link${isActive ? ' active' : ''}`}
            >
              <item.icon size={18} />
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>

        <button type="button" className="admin-logout-btn" onClick={handleLogout}>
          <LogOut size={18} />
          Logout
        </button>
      </aside>

      <main className="admin-content">
        <div className="admin-header">
          <div>
            <h1>{title}</h1>
            {subtitle ? <p>{subtitle}</p> : null}
          </div>
          <div className="admin-header-actions">
            <AdminNotificationBell className="admin-notification--header" />
            {actions ? actions : null}
          </div>
        </div>

        {children}
      </main>
    </div>
  )
}
