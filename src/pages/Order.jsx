import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { CheckCircle, Minus, Plus, Search, ShoppingBag, X } from 'lucide-react'
import { useAdmin } from '../context/AdminContext'
import { useCart } from '../context/CartContext'
import { useToast } from '../context/ToastContext'
import { useUser } from '../context/UserContext'
import './Order.css'

const categories = [
  { id: 'all', name: 'All' },
  { id: 'rice', name: 'Rice & Curry' },
  { id: 'burgers', name: 'Burgers' },
  { id: 'grills', name: 'Grills' },
  { id: 'noodles', name: 'Noodles' },
  { id: 'drinks', name: 'Drinks' },
  { id: 'desserts', name: 'Desserts' },
  { id: 'specials', name: 'Specials' },
]

export default function Order() {
  const { menuItems, createOrder } = useAdmin()
  const { cart, addToCart, removeFromCart, updateQuantity, clearCart, cartTotal, cartCount } = useCart()
  const { addToast } = useToast()
  const {
    isAuthenticated: isUserAuthenticated,
    currentUser,
    getDefaultAddress,
  } = useUser()

  const [activeCategory, setActiveCategory] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [orderType, setOrderType] = useState('delivery')
  const [step, setStep] = useState(1)

  const [orderDetails, setOrderDetails] = useState({
    name: '',
    phone: '',
    address: '',
    instructions: '',
    payment: 'cod',
  })

  const [orderId, setOrderId] = useState('')

  useEffect(() => {
    if (!isUserAuthenticated || !currentUser) {
      return
    }

    const defaultAddress = getDefaultAddress()

    setOrderDetails(prev => ({
      ...prev,
      name: prev.name || currentUser.name || '',
      phone: prev.phone || currentUser.phone || '',
      address: prev.address || defaultAddress?.line1 || '',
    }))
  }, [currentUser, getDefaultAddress, isUserAuthenticated])

  const filteredItems = menuItems.filter(item => {
    const matchesCategory = activeCategory === 'all' || item.category === activeCategory
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesCategory && matchesSearch && item.available
  })

  const handleAddToCart = item => {
    addToCart(item)
    addToast(`Added ${item.name} to cart.`, 'success')
  }

  const handlePlaceOrder = event => {
    event.preventDefault()

    if (cart.length === 0) {
      addToast('Your cart is empty.', 'error')
      return
    }

    const placedOrder = createOrder({
      customerName: orderDetails.name,
      phone: orderDetails.phone,
      address: orderType === 'delivery' ? orderDetails.address : '',
      instructions: orderDetails.instructions,
      payment: orderDetails.payment,
      type: orderType,
      total,
      items: cart.map(item => ({
        id: item.id,
        name: item.name,
        quantity: item.quantity,
        price: item.price,
      })),
      userId: currentUser?.id || null,
    })

    setOrderId(placedOrder.id)
    clearCart()
    setStep(3)
    addToast('Order placed successfully.', 'success')
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
            <h2>Order Placed Successfully</h2>
            <p>Thank you for ordering with KHAIM.</p>

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
              <div className="confirmation-row">
                <span>Status:</span>
                <strong>Pending</strong>
              </div>
            </div>

            <p className="confirmation-note">
              We will contact you at {orderDetails.phone} to confirm your order.
            </p>

            <div className="confirmation-actions">
              {isUserAuthenticated ? (
                <Link to="/profile?tab=orders" className="clay-btn clay-btn-secondary">
                  Track My Orders
                </Link>
              ) : (
                <Link to="/profile" className="clay-btn clay-btn-secondary">
                  Sign In to Track
                </Link>
              )}
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
          <div className="order-menu">
            <div className="order-header">
              <h1>Order Online</h1>
              <p>Fresh, flavourful and made with love.</p>
            </div>

            <div className="order-controls">
              <div className="search-box">
                <Search size={20} />
                <input
                  type="text"
                  placeholder="Search dishes..."
                  value={searchQuery}
                  onChange={event => setSearchQuery(event.target.value)}
                  className="clay-input"
                />
              </div>

              <div className="category-tabs">
                {categories.map(category => (
                  <button
                    key={category.id}
                    className={`category-tab ${activeCategory === category.id ? 'active' : ''}`}
                    onClick={() => setActiveCategory(category.id)}
                  >
                    {category.name}
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

          <div className="cart-sidebar clay-card">
            <div className="cart-header">
              <h3>
                <ShoppingBag size={20} /> Your Cart
              </h3>
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

                <div className="order-type-toggle">
                  <button
                    className={orderType === 'delivery' ? 'active' : ''}
                    onClick={() => setOrderType('delivery')}
                  >
                    Delivery
                  </button>
                  <button
                    className={orderType === 'pickup' ? 'active' : ''}
                    onClick={() => setOrderType('pickup')}
                  >
                    Pickup
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
                        onChange={event =>
                          setOrderDetails({
                            ...orderDetails,
                            name: event.target.value,
                          })
                        }
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Phone Number</label>
                      <input
                        type="tel"
                        className="clay-input"
                        value={orderDetails.phone}
                        onChange={event =>
                          setOrderDetails({
                            ...orderDetails,
                            phone: event.target.value,
                          })
                        }
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
                          onChange={event =>
                            setOrderDetails({
                              ...orderDetails,
                              address: event.target.value,
                            })
                          }
                          required
                        />
                      </div>
                    )}
                    <div className="form-group">
                      <label className="form-label">Special Instructions</label>
                      <textarea
                        className="clay-textarea"
                        value={orderDetails.instructions}
                        onChange={event =>
                          setOrderDetails({
                            ...orderDetails,
                            instructions: event.target.value,
                          })
                        }
                        placeholder="Any notes for delivery or kitchen (optional)"
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Payment Method</label>
                      <select
                        className="clay-select"
                        value={orderDetails.payment}
                        onChange={event =>
                          setOrderDetails({
                            ...orderDetails,
                            payment: event.target.value,
                          })
                        }
                      >
                        <option value="cod">Cash on Delivery</option>
                        <option value="bkash">bKash</option>
                        <option value="nagad">Nagad</option>
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
