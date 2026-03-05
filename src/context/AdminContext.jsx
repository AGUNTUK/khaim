import { createContext, useContext, useState, useEffect } from 'react'

const AdminContext = createContext()

// Sample data for demonstration
const initialMenuItems = [
  { id: 1, name: 'Chicken Biryani', category: 'rice', description: 'Aromatic basmati rice with tender chicken', price: 250, image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=400', badges: ['spicy'], available: true },
  { id: 2, name: 'Beef Curry', category: 'rice', description: 'Rich and flavorful beef curry', price: 300, image: 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=400', badges: ['spicy'], available: true },
  { id: 3, name: 'Chicken Burger', category: 'burgers', description: 'Juicy grilled chicken patty', price: 180, image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400', badges: ['chef'], available: true },
  { id: 4, name: 'Beef BBQ Grill', category: 'grills', description: 'Smoky grilled beef kebabs', price: 350, image: 'https://images.unsplash.com/photo-1529193591184-b1d58069ecdd?w=400', badges: ['spicy', 'chef'], available: true },
  { id: 5, name: 'Chicken Chowmein', category: 'noodles', description: 'Stir-fried noodles with chicken', price: 200, image: 'https://images.unsplash.com/photo-1585032226651-759b368d7246?w=400', badges: [], available: true },
  { id: 6, name: 'Cold Drinks', category: 'drinks', description: 'Refreshing beverages', price: 40, image: 'https://images.unsplash.com/photo-1581006852262-e4307cf6283a?w=400', badges: ['veg'], available: true },
  { id: 7, name: 'Sweet Cottage Cheese', category: 'desserts', description: 'Traditional Bengali sweets', price: 80, image: 'https://images.unsplash.com/photo-1551024601-bec78aea704b?w=400', badges: ['veg'], available: true },
  { id: 8, name: 'Mutton Kacchi', category: 'rice', description: 'Premium kacchi biryani with mutton', price: 400, image: 'https://images.unsplash.com/photo-1589302168068-964664d93dc0?w=400', badges: ['chef', 'spicy'], available: true },
  { id: 9, name: 'Fish Curry', category: 'rice', description: 'Traditional fish curry', price: 220, image: 'https://images.unsplash.com/photo-1606850780554-b55ea4dd0b70?w=400', badges: [], available: true },
  { id: 10, name: 'Vegetable Fried Rice', category: 'rice', description: 'Healthy fried rice with vegetables', price: 150, image: 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=400', badges: ['veg'], available: true },
  { id: 11, name: 'Chicken Wings', category: 'grills', description: 'Crispy spicy chicken wings', price: 250, image: 'https://images.unsplash.com/photo-1527477396000-e27163b481c2?w=400', badges: ['spicy'], available: true },
  { id: 12, name: 'Mango Lassi', category: 'drinks', description: 'Sweet yogurt mango drink', price: 80, image: 'https://images.unsplash.com/photo-1527661591475-527312dd65f5?w=400', badges: ['veg'], available: true },
]

const initialHeroDishes = [
  { id: 1, name: 'Chicken Biryani', price: 250, image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=400', visible: true, order: 1 },
  { id: 2, name: 'Beef BBQ Grill', price: 350, image: 'https://images.unsplash.com/photo-1529193591184-b1d58069ecdd?w=400', visible: true, order: 2 },
  { id: 3, name: 'Mutton Kacchi', price: 400, image: 'https://images.unsplash.com/photo-1589302168068-964664d93dc0?w=400', visible: true, order: 3 },
  { id: 4, name: 'Chicken Burger', price: 180, image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400', visible: true, order: 4 },
  { id: 5, name: 'Fish Curry Set', price: 280, image: 'https://images.unsplash.com/photo-1606850780554-b55ea4dd0b70?w=400', visible: true, order: 5 },
]

const initialOrders = [
  { id: 'ORD-001', customerName: 'Rahim Ahmed', phone: '01712-345678', items: [{ name: 'Chicken Biryani', quantity: 2, price: 250 }], total: 500, status: 'pending', type: 'delivery', address: 'House 12, Road 5, Rangpur', date: '2025-03-05', payment: 'cod' },
  { id: 'ORD-002', customerName: 'Fatema Begum', phone: '01711-234567', items: [{ name: 'Beef BBQ Grill', quantity: 1, price: 350 }], total: 350, status: 'confirmed', type: 'pickup', date: '2025-03-05', payment: 'bkash' },
  { id: 'ORD-003', customerName: 'Kamal Hossain', phone: '01713-456789', items: [{ name: 'Chicken Burger', quantity: 3, price: 180 }], total: 540, status: 'preparing', type: 'delivery', address: 'Flat 3B, Tower Complex', date: '2025-03-04', payment: 'cod' },
]

const initialReservations = [
  { id: 1, name: 'Mr. Karim', phone: '01714-123456', date: '2025-03-06', time: '7:00 PM', partySize: '3-5', specialRequests: 'Birthday celebration', status: 'confirmed' },
  { id: 2, name: 'Mrs. Rahman', phone: '01715-234567', date: '2025-03-07', time: '8:00 PM', partySize: '6-10', specialRequests: 'Anniversary dinner', status: 'pending' },
]

const initialCustomers = [
  { id: 1, name: 'Rahim Ahmed', phone: '01712-345678', orders: 5, totalSpent: 2500 },
  { id: 2, name: 'Fatema Begum', phone: '01711-234567', orders: 3, totalSpent: 1200 },
  { id: 3, name: 'Kamal Hossain', phone: '01713-456789', orders: 8, totalSpent: 4200 },
]

const initialOffers = [
  { id: 1, name: 'Family Meal Deal', description: 'Get 20% off on family meals', discount: 20, type: 'percent', applicable: 'all', validUntil: '2025-03-31', active: true },
  { id: 2, name: 'Free Delivery', description: 'Free delivery on orders above BDT 500', discount: 0, type: 'delivery', applicable: 'all', validUntil: '2025-03-15', active: true },
]

const initialReviews = [
  { id: 1, name: 'Ashraf Ali', rating: 5, text: 'Best biryani in Rangpur! Authentic taste.', date: '2025-03-01', approved: true },
  { id: 2, name: 'Salma Khatun', rating: 4, text: 'Great food and fast delivery. Will order again!', date: '2025-02-28', approved: true },
  { id: 3, name: 'Mahmud Hasan', rating: 5, text: 'Amazing BBQ grill, perfectly cooked!', date: '2025-02-25', approved: false },
]

const initialSettings = {
  restaurantName: 'KHAIM',
  tagline: 'Taste of Rangpurian\'s',
  address: 'Shapla Chattar, Rangpur, Bangladesh',
  phone: '01744-750870',
  hours: '10:00 AM – 11:00 PM',
  deliveryRadius: 5,
  minOrder: 200,
  paymentMethods: { cod: true, bkash: true, nagad: true },
  social: { facebook: 'https://facebook.com/khaim', instagram: 'https://instagram.com/khaim', whatsapp: 'wa.me/8801744750870' }
}

export function AdminProvider({ children }) {
  const [admin, setAdmin] = useState(() => {
    const saved = localStorage.getItem('khaim-admin')
    return saved ? JSON.parse(saved) : null
  })

  const [menuItems, setMenuItems] = useState(() => {
    const saved = localStorage.getItem('khaim-menu')
    return saved ? JSON.parse(saved) : initialMenuItems
  })

  const [heroDishes, setHeroDishes] = useState(() => {
    const saved = localStorage.getItem('khaim-hero')
    return saved ? JSON.parse(saved) : initialHeroDishes
  })

  const [orders, setOrders] = useState(() => {
    const saved = localStorage.getItem('khaim-orders')
    return saved ? JSON.parse(saved) : initialOrders
  })

  const [reservations, setReservations] = useState(() => {
    const saved = localStorage.getItem('khaim-reservations')
    return saved ? JSON.parse(saved) : initialReservations
  })

  const [customers, setCustomers] = useState(() => {
    const saved = localStorage.getItem('khaim-customers')
    return saved ? JSON.parse(saved) : initialCustomers
  })

  const [offers, setOffers] = useState(() => {
    const saved = localStorage.getItem('khaim-offers')
    return saved ? JSON.parse(saved) : initialOffers
  })

  const [reviews, setReviews] = useState(() => {
    const saved = localStorage.getItem('khaim-reviews')
    return saved ? JSON.parse(saved) : initialReviews
  })

  const [settings, setSettings] = useState(() => {
    const saved = localStorage.getItem('khaim-settings')
    return saved ? JSON.parse(saved) : initialSettings
  })

  // Persist to localStorage
  useEffect(() => {
    localStorage.setItem('khaim-menu', JSON.stringify(menuItems))
    localStorage.setItem('khaim-hero', JSON.stringify(heroDishes))
    localStorage.setItem('khaim-orders', JSON.stringify(orders))
    localStorage.setItem('khaim-reservations', JSON.stringify(reservations))
    localStorage.setItem('khaim-customers', JSON.stringify(customers))
    localStorage.setItem('khaim-offers', JSON.stringify(offers))
    localStorage.setItem('khaim-reviews', JSON.stringify(reviews))
    localStorage.setItem('khaim-settings', JSON.stringify(settings))
  }, [menuItems, heroDishes, orders, reservations, customers, offers, reviews, settings])

  const login = (email, password) => {
    // Simple demo authentication
    if (email === 'admin@khaim.com' && password === 'khaim123') {
      const adminData = { email, name: 'Admin', role: 'admin' }
      setAdmin(adminData)
      localStorage.setItem('khaim-admin', JSON.stringify(adminData))
      return { success: true }
    }
    return { success: false, message: 'Invalid credentials' }
  }

  const logout = () => {
    setAdmin(null)
    localStorage.removeItem('khaim-admin')
  }

  const isAuthenticated = !!admin

  // Menu CRUD
  const addMenuItem = (item) => {
    const newItem = { ...item, id: Date.now() }
    setMenuItems(prev => [...prev, newItem])
    return newItem
  }

  const updateMenuItem = (id, updates) => {
    setMenuItems(prev => prev.map(item => item.id === id ? { ...item, ...updates } : item))
  }

  const deleteMenuItem = (id) => {
    setMenuItems(prev => prev.filter(item => item.id !== id))
  }

  // Hero Dishes
  const updateHeroDish = (id, updates) => {
    setHeroDishes(prev => prev.map(dish => dish.id === id ? { ...dish, ...updates } : dish))
  }

  const reorderHeroDishes = (dishes) => {
    setHeroDishes(dishes.map((d, i) => ({ ...d, order: i + 1 })))
  }

  // Orders
  const updateOrderStatus = (id, status) => {
    setOrders(prev => prev.map(order => order.id === id ? { ...order, status } : order))
  }

  // Reservations
  const updateReservationStatus = (id, status) => {
    setReservations(prev => prev.map(res => res.id === id ? { ...res, status } : res))
  }

  // Offers
  const addOffer = (offer) => {
    const newOffer = { ...offer, id: Date.now() }
    setOffers(prev => [...prev, newOffer])
    return newOffer
  }

  const updateOffer = (id, updates) => {
    setOffers(prev => prev.map(offer => offer.id === id ? { ...offer, ...updates } : offer))
  }

  const deleteOffer = (id) => {
    setOffers(prev => prev.filter(offer => offer.id !== id))
  }

  // Reviews
  const updateReviewStatus = (id, approved) => {
    setReviews(prev => prev.map(review => review.id === id ? { ...review, approved } : review))
  }

  // Settings
  const updateSettings = (updates) => {
    setSettings(prev => ({ ...prev, ...updates }))
  }

  // Stats
  const getStats = () => {
    const today = new Date().toISOString().split('T')[0]
    const todayOrders = orders.filter(o => o.date === today)
    const todayRevenue = todayOrders.reduce((sum, o) => sum + o.total, 0)
    const pendingOrders = orders.filter(o => o.status === 'pending').length
    const activeReservations = reservations.filter(r => r.status === 'confirmed').length

    return {
      todayOrders: todayOrders.length,
      todayRevenue,
      pendingOrders,
      activeReservations,
      totalCustomers: customers.length,
      totalReviews: reviews.filter(r => r.approved).length
    }
  }

  return (
    <AdminContext.Provider
      value={{
        admin,
        isAuthenticated,
        login,
        logout,
        menuItems,
        heroDishes,
        orders,
        reservations,
        customers,
        offers,
        reviews,
        settings,
        addMenuItem,
        updateMenuItem,
        deleteMenuItem,
        updateHeroDish,
        reorderHeroDishes,
        updateOrderStatus,
        updateReservationStatus,
        addOffer,
        updateOffer,
        deleteOffer,
        updateReviewStatus,
        updateSettings,
        getStats
      }}
    >
      {children}
    </AdminContext.Provider>
  )
}

export const useAdmin = () => useContext(AdminContext)
