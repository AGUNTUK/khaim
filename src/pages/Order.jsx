import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Search, Plus, Minus, X, ShoppingBag, MapPin, Clock, CheckCircle } from 'lucide-react'
import { useAdmin } from '../context/AdminContext'
import { useCart } from '../context/CartContext'
import { useToast } from '../context/ToastContext'
import './Order.css'

const categories = [
  { id: 'all', name: 'All' },
  { id: 'rice', name: 'Rice & Curry' },
  { id: 'burgers', name: 'Burgers' },
  { id: 'grills', name: 'Grills' },
  { id: 'noodles', name: 'Noodles' },
  { id: 'drinks', name: 'Drinks' },
  { id: 'desserts', name: 'Desserts' },
]

export default function Order() {
  const { menuItems, settings } = useAdmin()
  const { cart, addToCart, removeFromCart, updateQuantity, clearCart, cartTotal, cartCount } = useCart()
  const { addToast } = useToast()
  const navigate = useNavigate()
  
  const [activeCategory, setActiveCategory] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [orderType, setOrderType] = useState('delivery')
  const [step, setStep] = useState(1) // 1: browse, 2: details, 3: confirmation
  
  const [orderDetails, setOrderDetails] = useState({
    name: '',
    phone: '',
    address: '',
    instructions: '',
    payment: 'cod'
  })
  const [orderId, setOrderId] = useState('')

  const filteredItems = menuItems.filter(item => {
    const matchesCategory = activeCategory === 'all' || item.category === activeCategory
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesCategory && matchesSearch && item.available
  })

  const handleAddToCart = (item) => {
    addToCart(item)
    addToast(`Added ${item.name} to cart! 🛒`, 'success')
  }

  const handlePlaceOrder = (e) => {
    e.preventDefault()
    
    // Generate order ID
    const newOrderId = `ORD-${Date.now().toString().slice(-6)}`
    setOrderId(newOrderId)
    
    // Clear cart and show confirmation
    clearCart()
    setStep(3)
    addToast('Order placed successfully! ✅', 'success')
  }

  const deliveryFee = orderType === 'delivery' && cartTotal < 500 ? 50 : 0
  const total = cartTotal + deliveryFee

  if (step === 3) {
    return (
      <div className="order-page">
        <div className="container">
          <div className="order-confirmation clay-card">
            <div className="confirmation-icon">
              <CheckCircle size={64} />
            </div>
            <h2>Order Placed Successfully! 🎉</h2>
            <p>Thank you for your order</p>
            
            <div className="confirmation-details">
              <div className="confirmation-row">
                <span>Order ID:</span>
                <strong>{orderId}</strong>
              </div>
              <div className="confirmation-row">
                <span>Estimated Time:</span>
                <strong>20-35 minutes</strong>
              </div>
              <div className="confirmation-row">
                <span>Order Type:</span>
                <strong>{orderType === 'delivery' ? 'Delivery' : 'Pickup'}</strong>
              </div>
            </div>
            
            <p className="confirmation-note">
              A confirmation has been sent to your phone. We'll call you at {orderDetails.phone} to confirm your order.
            </p>
            
            <div className="confirmation-actions">
              <a 
                href={`https://wa.me/8801744750870?text=Hello, I just placed order ${orderId}`}
                target="_blank"
                rel="noopener noreferrer"
                className="clay-btn clay-btn-secondary"
              >
                📱 Confirm on WhatsApp
              </a>
              <Link to="/" className="clay-btn clay-btn-primary">
                Back to Home
              </Link>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="order-page">
      <div className="container">
        <div className="order-layout">
          {/* Left - Menu Items */}
          <div className="order-menu">
            <div className="order-header">
              <h1>🛒 Order Online</h1>
              <p>Fresh, flavourful & made with love</p>
            </div>

            <div className="order-controls">
              <div className="search-box">
                <Search size={20} />
                <input
                  type="text"
                  placeholder="Search dishes..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="clay-input"
                />
              </div>

              <div className="category-tabs">
                {categories.map(cat => (
                  <button
                    key={cat.id}
                    className={`category-tab ${activeCategory === cat.id ? 'active' : ''}`}
                    onClick={() => setActiveCategory(cat.id)}
                  >
                    {cat.name}
                  </button>
                ))}
              </div>
            </div>

            <div className="menu-grid">
              {filteredItems.map(item => (
                <div key={item.id} className="menu-card clay-card">
                  <div className="menu-card-image">
                    <img src={item.image} alt={item.name} />
                  </div>
                  <div className="menu-card-content">
                    <h4>{item.name}</h4>
                    <p>{item.description}</p>
                    <div className="menu-card-footer">
                      <span className="price">BDT {item.price}</span>
                      <button 
                        className="clay-btn clay-btn-primary clay-btn-small"
                        onClick={() => handleAddToCart(item)}
                      >
                        <Plus size={16} /> Add
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right - Cart Sidebar */}
          <div className="cart-sidebar clay-card">
            <div className="cart-header">
              <h3><ShoppingBag size={20} /> Your Cart</h3>
              <span className="cart-count">{cartCount} items</span>
            </div>

            {cart.length === 0 ? (
              <div className="cart-empty">
                <p>Your cart is empty</p>
                <Link to="/menu" className="clay-btn clay-btn-secondary clay-btn-small">
                  Browse Menu
                </Link>
              </div>
            ) : (
              <>
                <div className="cart-items">
                  {cart.map(item => (
                    <div key={item.id} className="cart-item">
                      <img src={item.image} alt={item.name} />
                      <div className="cart-item-info">
                        <h5>{item.name}</h5>
                        <span className="cart-item-price">BDT {item.price}</span>
                      </div>
                      <div className="cart-item-actions">
                        <button onClick={() => updateQuantity(item.id, item.quantity - 1)}>
                          <Minus size={14} />
                        </button>
                        <span>{item.quantity}</span>
                        <button onClick={() => updateQuantity(item.id, item.quantity + 1)}>
                          <Plus size={14} />
                        </button>
                        <button className="remove-btn" onClick={() => removeFromCart(item.id)}>
                          <X size={14} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="cart-summary">
                  <div className="cart-row">
                    <span>Subtotal</span>
                    <span>BDT {cartTotal}</span>
                  </div>
                  {orderType === 'delivery' && (
                    <div className="cart-row">
                      <span>Delivery Fee</span>
                      <span>BDT {deliveryFee}</span>
                    </div>
                  )}
                  <div className="cart-row total">
                    <span>Total</span>
                    <span>BDT {total}</span>
                  </div>
                </div>

                {/* Order Type Toggle */}
                <div className="order-type-toggle">
                  <button 
                    className={orderType === 'delivery' ? 'active' : ''}
                    onClick={() => setOrderType('delivery')}
                  >
                    🏠 Delivery
                  </button>
                  <button 
                    className={orderType === 'pickup' ? 'active' : ''}
                    onClick={() => setOrderType('pickup')}
                  >
                    🏃 Pickup
                  </button>
                </div>

                {step === 1 ? (
                  <button 
                    className="clay-btn clay-btn-primary w-full"
                    onClick={() => setStep(2)}
                  >
                    Continue to Details
                  </button>
                ) : (
                  <form onSubmit={handlePlaceOrder} className="order-form">
                    <div className="form-group">
                      <label className="form-label">Full Name</label>
                      <input
                        type="text"
                        className="clay-input"
                        value={orderDetails.name}
                        onChange={(e) => setOrderDetails({...orderDetails, name: e.target.value})}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Phone Number</label>
                      <input
                        type="tel"
                        className="clay-input"
                        value={orderDetails.phone}
                        onChange={(e) => setOrderDetails({...orderDetails, phone: e.target.value})}
                        required
                      />
                    </div>
                    {orderType === 'delivery' && (
                      <div className="form-group">
                        <label className="form-label">Delivery Address</label>
                        <input
                          type="text"
                          className="clay-input"
                          value={orderDetails.address}
                          onChange={(e) => setOrderDetails({...orderDetails, address: e.target.value})}
                          required
                        />
                      </div>
                    )}
                    <div className="form-group">
                      <label className="form-label">Payment Method</label>
                      <select
                        className="clay-select"
                        value={orderDetails.payment}
                        onChange={(e) => setOrderDetails({...orderDetails, payment: e.target.value})}
                      >
                        <option value="cod">💵 Cash on Delivery</option>
                        <option value="bkash">📱 bKash</option>
                        <option value="nagad">💳 Nagad</option>
                      </select>
                    </div>
                    
                    <div className="form-actions">
                      <button 
                        type="button"
                        className="clay-btn clay-btn-secondary"
                        onClick={() => setStep(1)}
                      >
                        Back
                      </button>
                      <button type="submit" className="clay-btn clay-btn-primary">
                        Place Order
                      </button>
                    </div>
                  </form>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
