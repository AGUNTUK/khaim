import { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ArrowRight, Star, MapPin, Clock, Phone, ChefHat, Truck, Heart, Users, Plus, ChevronRight } from 'lucide-react'
import { useAdmin } from '../context/AdminContext'
import { useCart } from '../context/CartContext'
import { useToast } from '../context/ToastContext'
import './Home.css'

const categoryTags = {
  rice: { code: 'RC', name: 'Rice & Curry' },
  burgers: { code: 'BG', name: 'Burgers' },
  grills: { code: 'BBQ', name: 'Grills & BBQ' },
  noodles: { code: 'NDL', name: 'Noodles' },
  drinks: { code: 'DRK', name: 'Drinks' },
  desserts: { code: 'DST', name: 'Desserts' },
  specials: { code: 'SP', name: 'Specials' },
}

const features = [
  { icon: ChefHat, title: 'Fresh Cooked Daily', desc: 'Made fresh every day' },
  { icon: Truck, title: 'Fast Delivery', desc: 'Quick to your door' },
  { icon: Heart, title: 'Affordable Prices', desc: 'Great value for money' },
  { icon: Users, title: 'Family Friendly', desc: 'Perfect for everyone' },
]

const fallbackSlides = [
  {
    id: 'fallback-1',
    image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=800',
    title: 'Chicken Biryani',
    description: 'Aromatic basmati rice with tender chicken',
    price: 'BDT 250',
    tag: 'Hot Offer',
  },
  {
    id: 'fallback-2',
    image: 'https://images.unsplash.com/photo-1589302168068-964664d93dc0?w=800',
    title: 'Mutton Kacchi',
    description: 'Premium kacchi biryani with mutton',
    price: 'BDT 400',
    tag: 'New Arrival',
  },
]

export default function Home() {
  const { heroDishes, menuItems, offers, reviews, settings } = useAdmin()
  const { addToCart } = useCart()
  const { addToast } = useToast()
  const navigate = useNavigate()
  const [activeSlide, setActiveSlide] = useState(0)

  const heroSlides = useMemo(() => {
    const slides = heroDishes
      .filter(dish => dish.visible !== false)
      .sort((first, second) => Number(first.order || 0) - Number(second.order || 0))
      .map(dish => ({
        id: dish.id,
        image: dish.image || fallbackSlides[0].image,
        title: dish.name || 'Featured Dish',
        description: dish.description || 'Freshly prepared by KHAIM kitchen',
        price: `BDT ${Number(dish.price || 0).toLocaleString()}`,
        tag: dish.tag || 'Featured',
      }))

    return slides.length > 0 ? slides : fallbackSlides
  }, [heroDishes])

  const popularItems = useMemo(() => menuItems.filter(item => item.available).slice(0, 6), [menuItems])
  const activeOffer = offers.find(offer => offer.active)

  useEffect(() => {
    if (heroSlides.length <= 1) {
      return undefined
    }

    const interval = setInterval(() => {
      setActiveSlide(previous => (previous + 1) % heroSlides.length)
    }, 4000)

    return () => clearInterval(interval)
  }, [heroSlides.length])

  useEffect(() => {
    if (activeSlide > heroSlides.length - 1) {
      setActiveSlide(0)
    }
  }, [activeSlide, heroSlides.length])

  const handleAddToCart = item => {
    addToCart(item)
    addToast(`Added ${item.name} to cart.`, 'success')
  }

  return (
    <div className="home">
      <section className="hero">
        <div className="hero-container">
          <div className="hero-content">
            <div className="hero-badge">Now Open - 10AM to 11PM</div>

            <h1 className="hero-title">
              Taste the Soul
              <br />
              of <span className="highlight">Rangpur</span>
            </h1>

            <p className="hero-subtitle">
              Fresh, flavorful food made with care. Order now or reserve your table at Shapla Chattar.
            </p>

            <div className="hero-buttons">
              <Link to="/order" className="clay-btn clay-btn-primary">
                Order Now
              </Link>
              <Link to="/menu" className="clay-btn clay-btn-ghost">
                Explore Menu
              </Link>
            </div>

            <div className="hero-social">
              <div className="stars">Rated 4.8</div>
              <span>500+ happy customers</span>
              <span className="divider">|</span>
              <span>
                <MapPin size={14} /> Shapla Chattar, Rangpur
              </span>
            </div>
          </div>

          <div className="hero-carousel">
            <div className="carousel-wrapper">
              {heroSlides.map((slide, index) => (
                <div key={slide.id} className={`carousel-slide ${index === activeSlide ? 'active' : ''}`}>
                  <img src={slide.image} alt={slide.title} />
                  <div className="carousel-overlay">
                    <span className="carousel-tag">{slide.tag}</span>
                    <h3>{slide.title}</h3>
                    <p>{slide.description}</p>
                    <span className="carousel-price">{slide.price}</span>
                  </div>
                </div>
              ))}

              <div className="carousel-indicators">
                {heroSlides.map((slide, index) => (
                  <button
                    key={slide.id}
                    className={`carousel-dot ${index === activeSlide ? 'active' : ''}`}
                    onClick={() => setActiveSlide(index)}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="marquee">
        <div className="marquee-content">
          Fresh & Hot Daily | Shapla Chattar, Rangpur | Open 10AM to 11PM | Phone: {settings.phone} | Mixed Cuisine |
          Fresh & Hot Daily | Shapla Chattar, Rangpur | Open 10AM to 11PM | Phone: {settings.phone} | Mixed Cuisine |
        </div>
      </div>

      <section className="section">
        <div className="container">
          <div className="section-header">
            <h2>Our Categories</h2>
            <p>Explore our diverse menu options</p>
          </div>

          <div className="categories-tags">
            {Object.entries(categoryTags).map(([key, category]) => (
              <Link to={`/menu?category=${key}`} key={key} className="category-tag">
                <span className="category-icon">{category.code}</span>
                <span className="category-name">{category.name}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

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
                    {item.badges?.includes('spicy') ? <span className="badge-spicy">Spicy</span> : null}
                    {item.badges?.includes('chef') ? <span className="badge-chef">Chef Pick</span> : null}
                  </div>
                </div>
                <div className="menu-card-content">
                  <h4>{item.name}</h4>
                  <p>{item.description}</p>
                  <div className="menu-card-footer">
                    <span className="price">BDT {item.price}</span>
                    <button
                      className="clay-btn clay-btn-primary clay-btn-small"
                      onClick={event => {
                        event.stopPropagation()
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

      <section className="section section-alt">
        <div className="container">
          <div className="section-header">
            <h2>Why KHAIM?</h2>
            <p>What makes us special</p>
          </div>

          <div className="features-grid">
            {features.map(feature => (
              <div key={feature.title} className="feature-card clay-card">
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

      {activeOffer ? (
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
      ) : null}

      <section className="section section-alt">
        <div className="container">
          <div className="section-header">
            <h2>What Our Customers Say</h2>
            <p>Reviews from happy diners</p>
          </div>

          <div className="testimonials-grid">
            {reviews
              .filter(review => review.approved)
              .slice(0, 3)
              .map(review => (
                <div key={review.id} className="testimonial-card clay-card">
                  <div className="testimonial-header">
                    <div className="testimonial-avatar">{review.name.charAt(0)}</div>
                    <div>
                      <h4>{review.name}</h4>
                      <div className="testimonial-stars">
                        {Array.from({ length: 5 }).map((_, index) => (
                          <Star key={`${review.id}-${index}`} size={14} fill={index < review.rating ? '#F5A623' : 'none'} color="#F5A623" />
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
