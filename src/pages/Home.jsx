import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ArrowRight, Star, MapPin, Clock, Phone, ChefHat, Truck, Heart, Users, Plus, ChevronRight } from 'lucide-react'
import { useAdmin } from '../context/AdminContext'
import { useCart } from '../context/CartContext'
import { useToast } from '../context/ToastContext'
import './Home.css'

// Category icons
const categoryIcons = {
  rice: '🍛',
  burgers: '🍔',
  grills: '🔥',
  noodles: '🍜',
  drinks: '🥤',
  desserts: '🍰'
}

const features = [
  { icon: ChefHat, title: 'Fresh Cooked Daily', desc: 'Made fresh every day' },
  { icon: Truck, title: 'Fast Delivery', desc: 'Quick to your door' },
  { icon: Heart, title: 'Affordable Prices', desc: 'Great value for money' },
  { icon: Users, title: 'Family Friendly', desc: 'Perfect for everyone' }
]

export default function Home() {
  const { heroDishes, menuItems, offers, reviews, settings } = useAdmin()
  const { addToCart } = useCart()
  const { addToast } = useToast()
  const navigate = useNavigate()
  const [activeDishIndex, setActiveDishIndex] = useState(0)
  const [activeSlide, setActiveSlide] = useState(0)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })

  // Cinematic carousel slides
  const heroSlides = [
    {
      id: 1,
      image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=800',
      title: 'Chicken Biryani',
      description: 'Aromatic basmati rice with tender chicken',
      price: 'BDT 250',
      tag: '🔥 Hot Offer'
    },
    {
      id: 2,
      image: 'https://images.unsplash.com/photo-1589302168068-964664d93dc0?w=800',
      title: 'Mutton Kacchi',
      description: 'Premium kacchi biryani with mutton',
      price: 'BDT 400',
      tag: '✨ New Arrival'
    },
    {
      id: 3,
      image: 'https://images.unsplash.com/photo-1529193591184-b1d58069ecdd?w=800',
      title: 'Beef BBQ Grill',
      description: 'Smoky grilled beef kebabs',
      price: 'BDT 350',
      tag: '🔥 Buy 1 Get 1'
    },
    {
      id: 4,
      image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800',
      title: 'Special Burger Combo',
      description: 'Juicy burger with fries & drink',
      price: 'BDT 299',
      tag: '🎉 Campaign'
    },
  ]

  const visibleDishes = heroDishes.filter(d => d.visible)
  const popularItems = menuItems.filter(item => item.available).slice(0, 6)
  const activeOffer = offers.find(o => o.active)

  // Auto-rotate carousel
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveSlide(prev => (prev + 1) % heroSlides.length)
    }, 4000)
    return () => clearInterval(interval)
  }, [heroSlides.length])

  // Auto-rotate dish index
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveDishIndex(prev => (prev + 1) % visibleDishes.length)
    }, 2500)
    return () => clearInterval(interval)
  }, [visibleDishes.length])

  // Mouse parallax
  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth - 0.5) * 20,
        y: (e.clientY / window.innerHeight - 0.5) * 20
      })
    }
    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  const handleAddToCart = (item) => {
    addToCart(item)
    addToast(`Added ${item.name} to cart! 🛒`, 'success')
  }

  return (
    <div className="home">
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-container">
          {/* Left Side - Text */}
          <div className="hero-content">
            <div className="hero-badge">
              🔥 Now Open · 10AM–11PM
            </div>
            
            <h1 className="hero-title">
              Taste the Soul<br />
              of <span className="highlight">Rangpur</span> 🍽️
            </h1>
            
            <p className="hero-subtitle">
              Fresh, flavourful & made with love — order now or reserve your table at Shapla Chattar.
            </p>
            
            <div className="hero-buttons">
              <Link to="/order" className="clay-btn clay-btn-primary">
                <span>🛒</span> Order Now
              </Link>
              <Link to="/menu" className="clay-btn clay-btn-ghost">
                <span>📋</span> Explore Menu
              </Link>
            </div>
            
            <div className="hero-social">
              <div className="stars">⭐⭐⭐⭐</div>
              <span>500+ happy customers</span>
              <span className="divider">·</span>
              <span><MapPin size={14} /> Shapla Chattar, Rangpur</span>
            </div>
          </div>

          {/* Right Side - Cinematic Carousel */}
          <div className="hero-carousel">
            <div className="carousel-wrapper">
              {heroSlides.map((slide, index) => (
                <div 
                  key={slide.id}
                  className={`carousel-slide ${index === activeSlide ? 'active' : ''}`}
                >
                  <img src={slide.image} alt={slide.title} />
                  <div className="carousel-overlay">
                    <span className="carousel-tag">{slide.tag}</span>
                    <h3>{slide.title}</h3>
                    <p>{slide.description}</p>
                    <span className="carousel-price">{slide.price}</span>
                  </div>
                </div>
              ))}
              
              {/* Carousel Controls */}
              <div className="carousel-indicators">
                {heroSlides.map((_, index) => (
                  <button
                    key={index}
                    className={`carousel-dot ${index === activeSlide ? 'active' : ''}`}
                    onClick={() => setActiveSlide(index)}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Marquee */}
      <div className="marquee">
        <div className="marquee-content">
          🔥 Fresh & Hot Daily · 📍 Shapla Chattar, Rangpur · ⏰ Open 10AM–11PM · 📞 {settings.phone} · 🍽️ Mixed Cuisine · ⭐⭐⭐⭐ Rated
          🔥 Fresh & Hot Daily · 📍 Shapla Chattar, Rangpur · ⏰ Open 10AM–11PM · 📞 {settings.phone} · 🍽️ Mixed Cuisine · ⭐⭐⭐⭐ Rated
        </div>
      </div>

      {/* Featured Categories */}
      <section className="section">
        <div className="container">
          <div className="section-header">
            <h2>Our Categories</h2>
            <p>Explore our diverse menu options</p>
          </div>
          
          <div className="categories-grid">
            {Object.entries(categoryIcons).map(([key, icon]) => (
              <Link to={`/menu?category=${key}`} key={key} className="category-card clay-card">
                <span className="category-icon">{icon}</span>
                <span className="category-name">
                  {key === 'rice' && 'Rice & Curry'}
                  {key === 'burgers' && 'Burgers'}
                  {key === 'grills' && 'Grills & BBQ'}
                  {key === 'noodles' && 'Noodles'}
                  {key === 'drinks' && 'Drinks'}
                  {key === 'desserts' && 'Desserts'}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Why KHAIM */}
      <section className="section section-alt">
        <div className="container">
          <div className="section-header">
            <h2>Why KHAIM?</h2>
            <p>What makes us special</p>
          </div>
          
          <div className="features-grid">
            {features.map((feature, index) => (
              <div key={index} className="feature-card clay-card">
                <div className="feature-icon">
                  <feature.icon size={28} />
                </div>
                <h4>{feature.title}</h4>
                <p>{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Popular Items */}
      <section className="section">
        <div className="container">
          <div className="section-header">
            <h2>Fan Favourites</h2>
            <p>Most loved dishes by our customers</p>
          </div>
          
          <div className="popular-grid">
            {popularItems.map(item => (
              <div key={item.id} className="menu-card clay-card" onClick={() => navigate(`/product/${item.id}`)}>
                <div className="menu-card-image">
                  <img src={item.image} alt={item.name} />
                  <div className="menu-badges">
                    {item.badges?.includes('spicy') && <span className="badge-spicy">🌶️ Spicy</span>}
                    {item.badges?.includes('chef') && <span className="badge-chef">⭐ Chef's Pick</span>}
                  </div>
                </div>
                <div className="menu-card-content">
                  <h4>{item.name}</h4>
                  <p>{item.description}</p>
                  <div className="menu-card-footer">
                    <span className="price">BDT {item.price}</span>
                    <button 
                      className="clay-btn clay-btn-primary clay-btn-small"
                      onClick={(e) => {
                        e.stopPropagation()
                        handleAddToCart(item)
                      }}
                    >
                      <Plus size={16} /> Add
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="view-all">
            <Link to="/menu" className="clay-btn clay-btn-secondary">
              View Full Menu <ChevronRight size={18} />
            </Link>
          </div>
        </div>
      </section>

      {/* Special Offer Banner */}
      {activeOffer && (
        <section className="offer-banner">
          <div className="container">
            <div className="offer-content clay-card">
              <div className="offer-text">
                <span className="offer-tag">Special Offer</span>
                <h2>{activeOffer.name}</h2>
                <p>{activeOffer.description}</p>
              </div>
              <Link to="/order" className="clay-btn clay-btn-primary">
                Order Now <ArrowRight size={18} />
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Testimonials */}
      <section className="section section-alt">
        <div className="container">
          <div className="section-header">
            <h2>What Our Customers Say</h2>
            <p>Reviews from happy diners</p>
          </div>
          
          <div className="testimonials-grid">
            {reviews.filter(r => r.approved).slice(0, 3).map((review, index) => (
              <div key={review.id} className="testimonial-card clay-card">
                <div className="testimonial-header">
                  <div className="testimonial-avatar">
                    {review.name.charAt(0)}
                  </div>
                  <div>
                    <h4>{review.name}</h4>
                    <div className="testimonial-stars">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star key={i} size={14} fill={i < review.rating ? '#F5A623' : 'none'} color="#F5A623" />
                      ))}
                    </div>
                  </div>
                </div>
                <p className="testimonial-text">"{review.text}"</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Location & Hours */}
      <section className="section">
        <div className="container">
          <div className="location-card clay-card">
            <div className="location-info">
              <h2>Visit Us</h2>
              <div className="location-details">
                <div className="location-item">
                  <MapPin size={22} />
                  <div>
                    <h4>Location</h4>
                    <p>{settings.address}</p>
                  </div>
                </div>
                <div className="location-item">
                  <Clock size={22} />
                  <div>
                    <h4>Opening Hours</h4>
                    <p>{settings.hours}</p>
                  </div>
                </div>
                <div className="location-item">
                  <Phone size={22} />
                  <div>
                    <h4>Phone</h4>
                    <p>{settings.phone}</p>
                  </div>
                </div>
              </div>
              <a 
                href="https://maps.google.com/?q=Shapla+Chattar+Rangpur" 
                target="_blank" 
                rel="noopener noreferrer"
                className="clay-btn clay-btn-primary"
              >
                Get Directions
              </a>
            </div>
            <div className="location-map">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3573.78923456789!2d89.237!3d25.7439!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39e32dde6b1e1e1f%3A0x1!2sShapla%20Chattar%2C%20Rangpur!5e0!3m2!1sen!2sbd!4v1234567890"
                width="100%"
                height="100%"
                style={{ border: 0, borderRadius: '16px' }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="KHAIM Location"
              ></iframe>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
