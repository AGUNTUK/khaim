import { useState } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { Search, Plus } from 'lucide-react'
import { useAdmin } from '../context/AdminContext'
import { useCart } from '../context/CartContext'
import { useToast } from '../context/ToastContext'
import './Menu.css'

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

export default function Menu() {
  const [searchParams] = useSearchParams()
  const categoryParam = searchParams.get('category')
  
  const { menuItems } = useAdmin()
  const { addToCart } = useCart()
  const { addToast } = useToast()
  
  const [activeCategory, setActiveCategory] = useState(categoryParam || 'all')
  const [searchQuery, setSearchQuery] = useState('')
  const navigate = useNavigate()

  const filteredItems = menuItems.filter(item => {
    const matchesCategory = activeCategory === 'all' || item.category === activeCategory
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         item.description.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesCategory && matchesSearch && item.available
  })

  const handleAddToCart = (item) => {
    addToCart(item)
    addToast(`Added ${item.name} to cart! 🛒`, 'success')
  }

  return (
    <div className="menu-page">
      <div className="container">
        {/* Header */}
        <div className="menu-header">
          <div className="menu-title">
            <span>🔥</span>
            <h1>Our Menu</h1>
          </div>
          <p>Fresh, flavourful & made with love</p>
        </div>

        {/* Search & Filter */}
        <div className="menu-controls">
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

        {/* Menu Grid */}
        <div className="menu-grid">
          {filteredItems.length > 0 ? (
            filteredItems.map(item => (
              <div key={item.id} className="menu-card clay-card" onClick={() => navigate(`/product/${item.id}`)}>
                <div className="menu-card-image">
                  <img src={item.image} alt={item.name} />
                  <div className="menu-badges">
                    {item.badges?.includes('veg') && <span className="badge-veg">🥬 Veg</span>}
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
            ))
          ) : (
            <div className="no-items">
              <p>No dishes found matching your criteria.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
