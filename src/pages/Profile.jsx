import { useEffect, useMemo, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { Lock, LogOut, MapPin, Package, Plus, Save, User } from 'lucide-react'
import { useAdmin } from '../context/AdminContext'
import { useToast } from '../context/ToastContext'
import { useUser } from '../context/UserContext'
import './Profile.css'

const TRACKED_TABS = ['overview', 'addresses', 'orders']

const getOrderProgress = status => {
  switch (status) {
    case 'pending':
      return 25
    case 'confirmed':
      return 50
    case 'preparing':
      return 75
    case 'delivered':
      return 100
    case 'cancelled':
      return 100
    default:
      return 0
  }
}

export default function Profile() {
  const location = useLocation()
  const { orders } = useAdmin()
  const { addToast } = useToast()
  const {
    currentUser,
    isAuthenticated,
    register,
    login,
    logout,
    updateProfile,
    changePassword,
    addAddress,
    removeAddress,
    setDefaultAddress,
    getUserOrders,
  } = useUser()

  const [activeTab, setActiveTab] = useState('overview')
  const [authMode, setAuthMode] = useState('login')

  const [loginForm, setLoginForm] = useState({ email: '', password: '' })
  const [registerForm, setRegisterForm] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  })

  const [profileForm, setProfileForm] = useState({
    name: '',
    email: '',
    phone: '',
  })

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  })

  const [addressForm, setAddressForm] = useState({
    label: 'Home',
    line1: '',
    instructions: '',
    isDefault: true,
  })

  const [orderSearch, setOrderSearch] = useState('')

  useEffect(() => {
    const params = new URLSearchParams(location.search)
    const tab = params.get('tab')

    if (tab && TRACKED_TABS.includes(tab)) {
      setActiveTab(tab)
    }
  }, [location.search])

  useEffect(() => {
    if (!currentUser) return

    setProfileForm({
      name: currentUser.name || '',
      email: currentUser.email || '',
      phone: currentUser.phone || '',
    })
  }, [currentUser])

  const userOrders = useMemo(() => {
    if (!isAuthenticated) return []
    return getUserOrders(orders)
  }, [getUserOrders, isAuthenticated, orders])

  const filteredOrders = useMemo(() => {
    return userOrders.filter(order =>
      order.id.toLowerCase().includes(orderSearch.trim().toLowerCase())
    )
  }, [orderSearch, userOrders])

  const savedAddresses = currentUser?.addresses || []

  const handleLogin = event => {
    event.preventDefault()
    const result = login(loginForm.email, loginForm.password)

    if (!result.success) {
      addToast(result.message, 'error')
      return
    }

    addToast('Signed in successfully.', 'success')
    setLoginForm({ email: '', password: '' })
  }

  const handleRegister = event => {
    event.preventDefault()

    if (registerForm.password !== registerForm.confirmPassword) {
      addToast('Passwords do not match.', 'error')
      return
    }

    if (registerForm.password.length < 6) {
      addToast('Password must be at least 6 characters.', 'error')
      return
    }

    const result = register({
      name: registerForm.name,
      email: registerForm.email,
      phone: registerForm.phone,
      password: registerForm.password,
    })

    if (!result.success) {
      addToast(result.message, 'error')
      return
    }

    addToast('Account created successfully.', 'success')
    setRegisterForm({
      name: '',
      email: '',
      phone: '',
      password: '',
      confirmPassword: '',
    })
  }

  const handleProfileUpdate = event => {
    event.preventDefault()

    const result = updateProfile(profileForm)

    if (!result.success) {
      addToast(result.message, 'error')
      return
    }

    addToast('Profile updated.', 'success')
  }

  const handlePasswordUpdate = event => {
    event.preventDefault()

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      addToast('New passwords do not match.', 'error')
      return
    }

    if (passwordForm.newPassword.length < 6) {
      addToast('New password must be at least 6 characters.', 'error')
      return
    }

    const result = changePassword(passwordForm.currentPassword, passwordForm.newPassword)

    if (!result.success) {
      addToast(result.message, 'error')
      return
    }

    addToast('Password changed.', 'success')
    setPasswordForm({
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    })
  }

  const handleAddAddress = event => {
    event.preventDefault()

    if (!addressForm.label.trim() || !addressForm.line1.trim()) {
      addToast('Address label and line are required.', 'error')
      return
    }

    addAddress(addressForm)
    addToast('Address added.', 'success')

    setAddressForm({
      label: 'Home',
      line1: '',
      instructions: '',
      isDefault: false,
    })
  }

  const handleLogout = () => {
    logout()
    addToast('Signed out.', 'success')
  }

  if (!isAuthenticated) {
    return (
      <div className="profile-page section">
        <div className="container">
          <div className="profile-auth clay-card">
            <div className="profile-auth-head">
              <h1>Profile</h1>
              <p>Sign in to manage your account and track orders.</p>
            </div>

            <div className="profile-auth-tabs">
              <button
                className={authMode === 'login' ? 'active' : ''}
                onClick={() => setAuthMode('login')}
              >
                Sign In
              </button>
              <button
                className={authMode === 'register' ? 'active' : ''}
                onClick={() => setAuthMode('register')}
              >
                Create Account
              </button>
            </div>

            {authMode === 'login' ? (
              <form className="profile-auth-form" onSubmit={handleLogin}>
                <div className="form-group">
                  <label className="form-label">Email</label>
                  <input
                    type="email"
                    className="clay-input"
                    value={loginForm.email}
                    onChange={event => setLoginForm({ ...loginForm, email: event.target.value })}
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Password</label>
                  <input
                    type="password"
                    className="clay-input"
                    value={loginForm.password}
                    onChange={event => setLoginForm({ ...loginForm, password: event.target.value })}
                    required
                  />
                </div>
                <button type="submit" className="clay-btn clay-btn-primary w-full">
                  Sign In
                </button>
              </form>
            ) : (
              <form className="profile-auth-form" onSubmit={handleRegister}>
                <div className="form-group">
                  <label className="form-label">Full Name</label>
                  <input
                    type="text"
                    className="clay-input"
                    value={registerForm.name}
                    onChange={event => setRegisterForm({ ...registerForm, name: event.target.value })}
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Email</label>
                  <input
                    type="email"
                    className="clay-input"
                    value={registerForm.email}
                    onChange={event => setRegisterForm({ ...registerForm, email: event.target.value })}
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Phone</label>
                  <input
                    type="tel"
                    className="clay-input"
                    value={registerForm.phone}
                    onChange={event => setRegisterForm({ ...registerForm, phone: event.target.value })}
                    required
                  />
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Password</label>
                    <input
                      type="password"
                      className="clay-input"
                      value={registerForm.password}
                      onChange={event => setRegisterForm({ ...registerForm, password: event.target.value })}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Confirm Password</label>
                    <input
                      type="password"
                      className="clay-input"
                      value={registerForm.confirmPassword}
                      onChange={event =>
                        setRegisterForm({ ...registerForm, confirmPassword: event.target.value })
                      }
                      required
                    />
                  </div>
                </div>
                <button type="submit" className="clay-btn clay-btn-primary w-full">
                  Create Account
                </button>
              </form>
            )}

            <p className="profile-auth-hint">Demo login: rahim@khaim.com / khaim123</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="profile-page section">
      <div className="container">
        <div className="profile-header clay-card">
          <div className="profile-user-meta">
            <div className="profile-avatar">
              <User size={22} />
            </div>
            <div>
              <h1>{currentUser.name}</h1>
              <p>{currentUser.email}</p>
            </div>
          </div>

          <button className="clay-btn clay-btn-secondary" onClick={handleLogout}>
            <LogOut size={16} /> Sign Out
          </button>
        </div>

        <div className="profile-tabs">
          <button
            className={activeTab === 'overview' ? 'active' : ''}
            onClick={() => setActiveTab('overview')}
          >
            Profile
          </button>
          <button
            className={activeTab === 'addresses' ? 'active' : ''}
            onClick={() => setActiveTab('addresses')}
          >
            Addresses
          </button>
          <button
            className={activeTab === 'orders' ? 'active' : ''}
            onClick={() => setActiveTab('orders')}
          >
            Track Orders
          </button>
        </div>

        {activeTab === 'overview' && (
          <div className="profile-grid">
            <form className="profile-card clay-card" onSubmit={handleProfileUpdate}>
              <h2>
                <User size={18} /> Account Details
              </h2>
              <div className="form-group">
                <label className="form-label">Full Name</label>
                <input
                  type="text"
                  className="clay-input"
                  value={profileForm.name}
                  onChange={event => setProfileForm({ ...profileForm, name: event.target.value })}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Email</label>
                <input
                  type="email"
                  className="clay-input"
                  value={profileForm.email}
                  onChange={event => setProfileForm({ ...profileForm, email: event.target.value })}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Phone</label>
                <input
                  type="tel"
                  className="clay-input"
                  value={profileForm.phone}
                  onChange={event => setProfileForm({ ...profileForm, phone: event.target.value })}
                />
              </div>
              <button type="submit" className="clay-btn clay-btn-primary">
                <Save size={16} /> Save Profile
              </button>
            </form>

            <form className="profile-card clay-card" onSubmit={handlePasswordUpdate}>
              <h2>
                <Lock size={18} /> Security
              </h2>
              <div className="form-group">
                <label className="form-label">Current Password</label>
                <input
                  type="password"
                  className="clay-input"
                  value={passwordForm.currentPassword}
                  onChange={event =>
                    setPasswordForm({ ...passwordForm, currentPassword: event.target.value })
                  }
                />
              </div>
              <div className="form-group">
                <label className="form-label">New Password</label>
                <input
                  type="password"
                  className="clay-input"
                  value={passwordForm.newPassword}
                  onChange={event =>
                    setPasswordForm({ ...passwordForm, newPassword: event.target.value })
                  }
                />
              </div>
              <div className="form-group">
                <label className="form-label">Confirm New Password</label>
                <input
                  type="password"
                  className="clay-input"
                  value={passwordForm.confirmPassword}
                  onChange={event =>
                    setPasswordForm({ ...passwordForm, confirmPassword: event.target.value })
                  }
                />
              </div>
              <button type="submit" className="clay-btn clay-btn-secondary">
                Update Password
              </button>
            </form>
          </div>
        )}

        {activeTab === 'addresses' && (
          <div className="profile-grid addresses-grid">
            <div className="profile-card clay-card">
              <h2>
                <MapPin size={18} /> Saved Addresses
              </h2>

              {savedAddresses.length === 0 ? (
                <p className="text-muted">No saved addresses yet.</p>
              ) : (
                <div className="address-list">
                  {savedAddresses.map(address => (
                    <div key={address.id} className="address-item">
                      <div>
                        <strong>{address.label}</strong>
                        {address.isDefault && <span className="default-badge">Default</span>}
                        <p>{address.line1}</p>
                        {address.instructions ? <p>{address.instructions}</p> : null}
                      </div>
                      <div className="address-actions">
                        {!address.isDefault && (
                          <button
                            className="clay-btn clay-btn-secondary clay-btn-small"
                            onClick={() => {
                              setDefaultAddress(address.id)
                              addToast('Default address updated.', 'success')
                            }}
                          >
                            Make Default
                          </button>
                        )}
                        <button
                          className="clay-btn clay-btn-secondary clay-btn-small"
                          onClick={() => {
                            removeAddress(address.id)
                            addToast('Address removed.', 'success')
                          }}
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <form className="profile-card clay-card" onSubmit={handleAddAddress}>
              <h2>
                <Plus size={18} /> Add Address
              </h2>
              <div className="form-group">
                <label className="form-label">Label</label>
                <input
                  type="text"
                  className="clay-input"
                  value={addressForm.label}
                  onChange={event => setAddressForm({ ...addressForm, label: event.target.value })}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Address</label>
                <input
                  type="text"
                  className="clay-input"
                  value={addressForm.line1}
                  onChange={event => setAddressForm({ ...addressForm, line1: event.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label">Instructions</label>
                <textarea
                  className="clay-textarea"
                  value={addressForm.instructions}
                  onChange={event =>
                    setAddressForm({ ...addressForm, instructions: event.target.value })
                  }
                />
              </div>
              <label className="checkbox-label mb-3">
                <input
                  type="checkbox"
                  checked={addressForm.isDefault}
                  onChange={event =>
                    setAddressForm({ ...addressForm, isDefault: event.target.checked })
                  }
                />
                Set as default address
              </label>
              <button type="submit" className="clay-btn clay-btn-primary">
                Save Address
              </button>
            </form>
          </div>
        )}

        {activeTab === 'orders' && (
          <div className="profile-card clay-card">
            <div className="orders-head">
              <h2>
                <Package size={18} /> Track Orders
              </h2>
              <input
                type="text"
                className="clay-input"
                placeholder="Search by Order ID"
                value={orderSearch}
                onChange={event => setOrderSearch(event.target.value)}
              />
            </div>

            {filteredOrders.length === 0 ? (
              <p className="text-muted">No orders found for this account yet.</p>
            ) : (
              <div className="orders-list">
                {filteredOrders.map(order => {
                  const progress = getOrderProgress(order.status)

                  return (
                    <article key={order.id} className="order-item">
                      <div className="order-row">
                        <strong>{order.id}</strong>
                        <span className={`order-status status-${order.status}`}>{order.status}</span>
                      </div>

                      <div className="order-progress">
                        <div
                          className={`order-progress-fill ${order.status === 'cancelled' ? 'is-cancelled' : ''}`}
                          style={{ width: `${progress}%` }}
                        />
                      </div>

                      <div className="order-meta-grid">
                        <p>
                          <strong>Total:</strong> BDT {order.total}
                        </p>
                        <p>
                          <strong>Type:</strong> {order.type}
                        </p>
                        <p>
                          <strong>Date:</strong> {order.date}
                        </p>
                        <p>
                          <strong>Payment:</strong> {order.payment}
                        </p>
                      </div>

                      {order.type === 'delivery' ? (
                        <p className="order-address">
                          <strong>Delivery Location:</strong> {order.address || 'Address pending'}
                        </p>
                      ) : (
                        <p className="order-address">
                          <strong>Pickup:</strong> Collect from restaurant counter
                        </p>
                      )}

                      <div className="order-items">
                        {order.items.map((item, index) => (
                          <p key={`${order.id}-${index}`}>
                            {item.quantity}x {item.name}
                          </p>
                        ))}
                      </div>
                    </article>
                  )
                })}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
