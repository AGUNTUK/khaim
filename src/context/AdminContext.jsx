import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { isSupabaseConfigured, supabase } from '../lib/supabase'

const AdminContext = createContext()

const NOTIFICATIONS_STORAGE_KEY = 'khaim-admin-notifications'

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
  { id: 13, name: 'Beef Cheese Burger', category: 'burgers', description: 'Grilled beef patty with cheddar and caramelized onions', price: 240, image: 'https://images.unsplash.com/photo-1550547660-d9450f859349?w=400', badges: ['chef'], available: true },
  { id: 14, name: 'Smoky Chicken Burger', category: 'burgers', description: 'Smoked chicken burger with house spicy sauce', price: 220, image: 'https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=400', badges: ['spicy'], available: true },
  { id: 15, name: 'Thai Basil Noodles', category: 'noodles', description: 'Wok tossed noodles with basil, garlic and chicken', price: 230, image: 'https://images.unsplash.com/photo-1617622141573-39ebf10f0f65?w=400', badges: [], available: true },
  { id: 16, name: 'Veg Hakka Noodles', category: 'noodles', description: 'Classic vegetable hakka noodles with soy glaze', price: 180, image: 'https://images.unsplash.com/photo-1512058564366-18510be2db19?w=400', badges: ['veg'], available: true },
  { id: 17, name: 'Chocolate Brownie', category: 'desserts', description: 'Warm brownie served with chocolate drizzle', price: 140, image: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=400', badges: ['chef'], available: true },
  { id: 18, name: 'Firni Cup', category: 'desserts', description: 'Traditional creamy firni topped with nuts', price: 110, image: 'https://images.unsplash.com/photo-1470124182917-cc6e71b22ecc?w=400', badges: ['veg'], available: true },
  { id: 19, name: 'Fresh Lime Soda', category: 'drinks', description: 'Chilled lime soda with mint and black salt', price: 70, image: 'https://images.unsplash.com/photo-1581636625402-29b2a704ef13?w=400', badges: ['veg'], available: true },
  { id: 20, name: 'Iced Lemon Tea', category: 'drinks', description: 'Refreshing black tea with lemon and honey', price: 90, image: 'https://images.unsplash.com/photo-1499636136210-6f4ee915583e?w=400', badges: ['veg'], available: true },
  { id: 21, name: 'Chef Signature Platter', category: 'specials', description: 'A premium platter with biryani, grill and dessert', price: 650, image: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=400', badges: ['chef'], available: true },
  { id: 22, name: 'Family Feast Combo', category: 'specials', description: 'Perfect combo meal for 4 with drinks and sides', price: 1200, image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400', badges: ['chef'], available: true },
  { id: 23, name: 'Weekend Khaim Box', category: 'specials', description: 'Limited weekend box with mixed favourites', price: 480, image: 'https://images.unsplash.com/photo-1539136788836-5699e78bfc75?w=400', badges: ['spicy'], available: true },
]

const initialHeroDishes = [
  {
    id: 1,
    name: 'Chicken Biryani',
    description: 'Aromatic basmati rice with tender chicken',
    tag: 'Hot Offer',
    price: 250,
    image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=800',
    visible: true,
    order: 1,
  },
  {
    id: 2,
    name: 'Mutton Kacchi',
    description: 'Premium kacchi biryani with mutton',
    tag: 'New Arrival',
    price: 400,
    image: 'https://images.unsplash.com/photo-1589302168068-964664d93dc0?w=800',
    visible: true,
    order: 2,
  },
  {
    id: 3,
    name: 'Beef BBQ Grill',
    description: 'Smoky grilled beef kebabs',
    tag: 'Buy 1 Get 1',
    price: 350,
    image: 'https://images.unsplash.com/photo-1529193591184-b1d58069ecdd?w=800',
    visible: true,
    order: 3,
  },
]

const initialOrders = [
  {
    id: 'ORD-001',
    customerName: 'Rahim Ahmed',
    phone: '01712-345678',
    items: [{ name: 'Chicken Biryani', quantity: 2, price: 250 }],
    total: 500,
    status: 'pending',
    type: 'delivery',
    address: 'House 12, Road 5, Rangpur',
    date: '2025-03-05',
    payment: 'cod',
  },
  {
    id: 'ORD-002',
    customerName: 'Fatema Begum',
    phone: '01711-234567',
    items: [{ name: 'Beef BBQ Grill', quantity: 1, price: 350 }],
    total: 350,
    status: 'confirmed',
    type: 'pickup',
    date: '2025-03-05',
    payment: 'bkash',
  },
  {
    id: 'ORD-003',
    customerName: 'Kamal Hossain',
    phone: '01713-456789',
    items: [{ name: 'Chicken Burger', quantity: 3, price: 180 }],
    total: 540,
    status: 'preparing',
    type: 'delivery',
    address: 'Flat 3B, Tower Complex',
    date: '2025-03-04',
    payment: 'cod',
  },
]

const initialReservations = [
  {
    id: 1,
    name: 'Mr. Karim',
    phone: '01714-123456',
    date: '2025-03-06',
    time: '7:00 PM',
    partySize: '3-5',
    specialRequests: 'Birthday celebration',
    status: 'confirmed',
  },
  {
    id: 2,
    name: 'Mrs. Rahman',
    phone: '01715-234567',
    date: '2025-03-07',
    time: '8:00 PM',
    partySize: '6-10',
    specialRequests: 'Anniversary dinner',
    status: 'pending',
  },
]

const initialCustomers = [
  { id: 1, name: 'Rahim Ahmed', phone: '01712-345678', orders: 5, totalSpent: 2500 },
  { id: 2, name: 'Fatema Begum', phone: '01711-234567', orders: 3, totalSpent: 1200 },
  { id: 3, name: 'Kamal Hossain', phone: '01713-456789', orders: 8, totalSpent: 4200 },
]

const initialOffers = [
  {
    id: 1,
    name: 'Family Meal Deal',
    description: 'Get 20% off on family meals',
    discount: 20,
    type: 'percent',
    applicable: 'all',
    validUntil: '2025-03-31',
    active: true,
  },
  {
    id: 2,
    name: 'Free Delivery',
    description: 'Free delivery on orders above BDT 500',
    discount: 0,
    type: 'delivery',
    applicable: 'all',
    validUntil: '2025-03-15',
    active: true,
  },
]

const initialReviews = [
  { id: 1, name: 'Ashraf Ali', rating: 5, text: 'Best biryani in Rangpur! Authentic taste.', date: '2025-03-01', approved: true },
  { id: 2, name: 'Salma Khatun', rating: 4, text: 'Great food and fast delivery. Will order again!', date: '2025-02-28', approved: true },
  { id: 3, name: 'Mahmud Hasan', rating: 5, text: 'Amazing BBQ grill, perfectly cooked!', date: '2025-02-25', approved: false },
]

const initialSettings = {
  restaurantName: 'KHAIM',
  tagline: "Taste of Rangpurian's",
  address: 'Shapla Chattar, Rangpur, Bangladesh',
  phone: '01744-750870',
  hours: '10:00 AM - 11:00 PM',
  deliveryRadius: 5,
  minOrder: 200,
  paymentMethods: { cod: true, bkash: true, nagad: true },
  social: {
    facebook: 'https://facebook.com/khaim',
    instagram: 'https://instagram.com/khaim',
    whatsapp: 'wa.me/8801744750870',
  },
}

const formatDateKey = value => {
  if (!value) return new Date().toISOString().split('T')[0]
  if (value.includes('T')) return value.split('T')[0]
  return value
}

const toBase64 = file =>
  new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result)
    reader.onerror = reject
    reader.readAsDataURL(file)
  })

const upsertById = (list, item) => {
  const index = list.findIndex(entry => String(entry.id) === String(item.id))

  if (index === -1) {
    return [item, ...list]
  }

  const next = [...list]
  next[index] = { ...next[index], ...item }
  return next
}

const normalizeOrder = row => ({
  id: row.id,
  customerName: row.customer_name ?? row.customerName ?? 'Guest',
  phone: row.phone ?? '',
  items: row.items ?? [],
  total: Number(row.total ?? 0),
  status: row.status ?? 'pending',
  type: row.type ?? 'delivery',
  address: row.address ?? '',
  date: formatDateKey(row.date ?? row.created_at ?? row.createdAt),
  payment: row.payment ?? 'cod',
  instructions: row.instructions ?? '',
  userId: row.user_id ?? row.userId ?? null,
  createdAt: row.created_at ?? row.createdAt ?? new Date().toISOString(),
})

const normalizeReservation = row => ({
  id: row.id,
  name: row.name,
  phone: row.phone,
  date: formatDateKey(row.date),
  time: row.time,
  partySize: row.party_size ?? row.partySize,
  specialRequests: row.special_requests ?? row.specialRequests ?? '',
  status: row.status ?? 'pending',
})

const normalizeCustomer = row => ({
  id: row.id,
  name: row.name,
  phone: row.phone,
  orders: Number(row.orders_count ?? row.orders ?? 0),
  totalSpent: Number(row.total_spent ?? row.totalSpent ?? 0),
})

const normalizeReview = row => ({
  id: row.id,
  name: row.name,
  rating: Number(row.rating ?? 5),
  text: row.text,
  date: formatDateKey(row.date ?? row.created_at),
  approved: Boolean(row.approved),
})

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

  const [notifications, setNotifications] = useState(() => {
    const saved = localStorage.getItem(NOTIFICATIONS_STORAGE_KEY)
    return saved ? JSON.parse(saved) : []
  })

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

  useEffect(() => {
    localStorage.setItem(NOTIFICATIONS_STORAGE_KEY, JSON.stringify(notifications))
  }, [notifications])

  const pushNotification = useCallback(({ type, title, message, key, payload }) => {
    setNotifications(prev => {
      const now = Date.now()
      const resolvedKey = key || `${type}:${title}:${message}`

      const duplicate = prev.some(item => {
        if (item.key !== resolvedKey) return false
        const createdAt = new Date(item.createdAt).getTime()
        return now - createdAt < 10000
      })

      if (duplicate) {
        return prev
      }

      const entry = {
        id: `NOTIF-${now}`,
        type,
        title,
        message,
        key: resolvedKey,
        payload: payload || null,
        read: false,
        createdAt: new Date().toISOString(),
      }

      return [entry, ...prev].slice(0, 100)
    })
  }, [])

  useEffect(() => {
    if (!isSupabaseConfigured || !supabase) return undefined

    const channel = supabase
      .channel('khaim-admin-realtime')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'orders' }, payload => {
        const order = normalizeOrder(payload.new)
        setOrders(prev => upsertById(prev, order))
        pushNotification({
          type: 'order',
          title: 'New Order',
          message: `${order.id} from ${order.customerName}`,
          key: `orders-insert-${order.id}-${payload.commit_timestamp}`,
        })
      })
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'orders' }, payload => {
        const order = normalizeOrder(payload.new)
        setOrders(prev => upsertById(prev, order))
        pushNotification({
          type: 'order',
          title: 'Order Updated',
          message: `${order.id} moved to ${order.status}`,
          key: `orders-update-${order.id}-${payload.commit_timestamp}`,
        })
      })
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'reservations' }, payload => {
        const reservation = normalizeReservation(payload.new)
        setReservations(prev => upsertById(prev, reservation))
        pushNotification({
          type: 'reservation',
          title: 'New Reservation',
          message: `${reservation.name} for ${reservation.date} ${reservation.time}`,
          key: `reservations-insert-${reservation.id}-${payload.commit_timestamp}`,
        })
      })
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'customers' }, payload => {
        const customer = normalizeCustomer(payload.new)
        setCustomers(prev => upsertById(prev, customer))
        pushNotification({
          type: 'customer',
          title: 'New Customer',
          message: `${customer.name} has been added`,
          key: `customers-insert-${customer.id}-${payload.commit_timestamp}`,
        })
      })
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'reviews' }, payload => {
        const review = normalizeReview(payload.new)
        setReviews(prev => upsertById(prev, review))
        pushNotification({
          type: 'review',
          title: 'New Review',
          message: `${review.name} left a ${review.rating}-star review`,
          key: `reviews-insert-${review.id}-${payload.commit_timestamp}`,
        })
      })

    channel.subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [pushNotification])

  const uploadImageToSupabase = async (file, bucket, folder) => {
    if (!file) throw new Error('No file selected.')

    if (!isSupabaseConfigured || !supabase) {
      return toBase64(file)
    }

    const extension = file.name.split('.').pop()
    const path = `${folder}/${Date.now()}-${Math.random().toString(36).slice(2)}.${extension}`

    const { error: uploadError } = await supabase.storage
      .from(bucket)
      .upload(path, file, {
        upsert: true,
      })

    if (uploadError) {
      return toBase64(file)
    }

    const { data } = supabase.storage.from(bucket).getPublicUrl(path)

    return data.publicUrl
  }

  const login = (email, password) => {
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

  const addMenuItem = item => {
    const newItem = { ...item, id: Date.now() }
    setMenuItems(prev => [...prev, newItem])
    return newItem
  }

  const updateMenuItem = (id, updates) => {
    setMenuItems(prev => prev.map(item => (item.id === id ? { ...item, ...updates } : item)))
  }

  const deleteMenuItem = id => {
    setMenuItems(prev => prev.filter(item => item.id !== id))
  }

  const uploadMenuImage = async file => uploadImageToSupabase(file, 'menu-images', 'menu')

  const addHeroDish = dish => {
    const newDish = {
      id: Date.now(),
      name: dish.name,
      description: dish.description || '',
      tag: dish.tag || '',
      price: Number(dish.price) || 0,
      image: dish.image,
      visible: dish.visible ?? true,
      order: dish.order ?? heroDishes.length + 1,
    }

    setHeroDishes(prev => [...prev, newDish])
    return newDish
  }

  const updateHeroDish = (id, updates) => {
    setHeroDishes(prev => prev.map(dish => (dish.id === id ? { ...dish, ...updates } : dish)))
  }

  const deleteHeroDish = id => {
    setHeroDishes(prev => prev.filter(dish => dish.id !== id))
  }

  const reorderHeroDishes = dishes => {
    setHeroDishes(dishes.map((dish, index) => ({ ...dish, order: index + 1 })))
  }

  const uploadHeroImage = async file => uploadImageToSupabase(file, 'hero-images', 'hero')

  const createOrder = orderData => {
    const now = new Date()
    const date = now.toISOString().split('T')[0]

    const newOrder = {
      id: orderData.id || `ORD-${Date.now().toString().slice(-6)}`,
      customerName: orderData.customerName,
      phone: orderData.phone,
      items: orderData.items || [],
      total: orderData.total || 0,
      status: orderData.status || 'pending',
      type: orderData.type || 'delivery',
      address: orderData.address || '',
      date,
      payment: orderData.payment || 'cod',
      instructions: orderData.instructions || '',
      userId: orderData.userId || null,
      createdAt: now.toISOString(),
    }

    setOrders(prev => [newOrder, ...prev])

    let createdCustomer = false

    setCustomers(prev => {
      const existingCustomer = prev.find(customer => customer.phone === newOrder.phone)

      if (existingCustomer) {
        return prev.map(customer =>
          customer.phone === newOrder.phone
            ? {
                ...customer,
                name: newOrder.customerName || customer.name,
                orders: (customer.orders || 0) + 1,
                totalSpent: (customer.totalSpent || 0) + newOrder.total,
              }
            : customer
        )
      }

      createdCustomer = true

      return [
        ...prev,
        {
          id: Date.now(),
          name: newOrder.customerName,
          phone: newOrder.phone,
          orders: 1,
          totalSpent: newOrder.total,
        },
      ]
    })

    pushNotification({
      type: 'order',
      title: 'New Order',
      message: `${newOrder.id} from ${newOrder.customerName}`,
      key: `order-created-${newOrder.id}`,
      payload: newOrder,
    })

    if (createdCustomer) {
      pushNotification({
        type: 'customer',
        title: 'New Customer',
        message: `${newOrder.customerName} placed a first order`,
        key: `customer-created-${newOrder.phone}`,
      })
    }

    return newOrder
  }

  const updateOrderStatus = (id, status) => {
    setOrders(prev => prev.map(order => (order.id === id ? { ...order, status } : order)))

    pushNotification({
      type: 'order',
      title: 'Order Status Updated',
      message: `${id} moved to ${status}`,
      key: `order-status-${id}-${status}`,
    })
  }

  const createReservation = reservationData => {
    const newReservation = {
      id: Date.now(),
      name: reservationData.name,
      phone: reservationData.phone,
      date: reservationData.date,
      time: reservationData.time,
      partySize: reservationData.partySize,
      specialRequests: reservationData.specialRequests || '',
      status: 'pending',
    }

    setReservations(prev => [newReservation, ...prev])

    pushNotification({
      type: 'reservation',
      title: 'New Reservation',
      message: `${newReservation.name} for ${newReservation.date} ${newReservation.time}`,
      key: `reservation-created-${newReservation.id}`,
    })

    return newReservation
  }

  const updateReservationStatus = (id, status) => {
    setReservations(prev => prev.map(reservation => (reservation.id === id ? { ...reservation, status } : reservation)))

    pushNotification({
      type: 'reservation',
      title: 'Reservation Updated',
      message: `Reservation #${id} moved to ${status}`,
      key: `reservation-status-${id}-${status}`,
    })
  }

  const addOffer = offer => {
    const newOffer = { ...offer, id: Date.now() }
    setOffers(prev => [...prev, newOffer])
    return newOffer
  }

  const updateOffer = (id, updates) => {
    setOffers(prev => prev.map(offer => (offer.id === id ? { ...offer, ...updates } : offer)))
  }

  const deleteOffer = id => {
    setOffers(prev => prev.filter(offer => offer.id !== id))
  }

  const addReview = review => {
    const newReview = {
      id: Date.now(),
      name: review.name,
      rating: Number(review.rating) || 5,
      text: review.text,
      date: new Date().toISOString().split('T')[0],
      approved: false,
    }

    setReviews(prev => [newReview, ...prev])

    pushNotification({
      type: 'review',
      title: 'New Review',
      message: `${newReview.name} submitted a review`,
      key: `review-created-${newReview.id}`,
    })

    return newReview
  }

  const updateReviewStatus = (id, approved) => {
    setReviews(prev => prev.map(review => (review.id === id ? { ...review, approved } : review)))
  }

  const updateSettings = updates => {
    setSettings(prev => ({ ...prev, ...updates }))
  }

  const getStats = () => {
    const today = new Date().toISOString().split('T')[0]
    const todayOrders = orders.filter(order => formatDateKey(order.date) === today)
    const todayRevenue = todayOrders.reduce((sum, order) => sum + Number(order.total || 0), 0)

    return {
      todayOrders: todayOrders.length,
      todayRevenue,
      pendingOrders: orders.filter(order => order.status === 'pending').length,
      activeReservations: reservations.filter(reservation => reservation.status === 'confirmed').length,
      totalCustomers: customers.length,
      totalReviews: reviews.filter(review => review.approved).length,
    }
  }

  const getAnalytics = () => {
    const totalRevenue = orders.reduce((sum, order) => sum + Number(order.total || 0), 0)
    const totalOrders = orders.length
    const deliveredOrders = orders.filter(order => order.status === 'delivered').length

    const now = new Date()
    const thisMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`

    const monthlyRevenue = orders
      .filter(order => formatDateKey(order.date).startsWith(thisMonth))
      .reduce((sum, order) => sum + Number(order.total || 0), 0)

    const dailySales = Array.from({ length: 7 }, (_, index) => {
      const date = new Date()
      date.setDate(date.getDate() - (6 - index))

      const key = formatDateKey(date.toISOString())
      const label = date.toLocaleDateString('en-US', { weekday: 'short' })

      const revenue = orders
        .filter(order => formatDateKey(order.date) === key)
        .reduce((sum, order) => sum + Number(order.total || 0), 0)

      const count = orders.filter(order => formatDateKey(order.date) === key).length

      return {
        key,
        label,
        revenue,
        count,
      }
    })

    const maxDailyRevenue = Math.max(...dailySales.map(day => day.revenue), 1)

    const menuByName = menuItems.reduce((map, item) => {
      map[item.name.toLowerCase()] = item
      return map
    }, {})

    const categoryTotals = {}

    orders.forEach(order => {
      order.items.forEach(item => {
        const menuEntry = menuByName[(item.name || '').toLowerCase()]
        const category = menuEntry?.category || 'others'
        const value = Number(item.price || 0) * Number(item.quantity || 0)

        categoryTotals[category] = (categoryTotals[category] || 0) + value
      })
    })

    const topCategories = Object.entries(categoryTotals)
      .map(([category, revenue]) => ({ category, revenue }))
      .sort((first, second) => second.revenue - first.revenue)
      .slice(0, 5)

    return {
      totalRevenue,
      totalOrders,
      deliveredOrders,
      pendingOrders: orders.filter(order => order.status === 'pending').length,
      monthlyRevenue,
      averageOrderValue: totalOrders > 0 ? totalRevenue / totalOrders : 0,
      completionRate: totalOrders > 0 ? (deliveredOrders / totalOrders) * 100 : 0,
      dailySales,
      maxDailyRevenue,
      topCategories,
    }
  }

  const markNotificationRead = id => {
    setNotifications(prev =>
      prev.map(notification =>
        notification.id === id
          ? {
              ...notification,
              read: true,
            }
          : notification
      )
    )
  }

  const markAllNotificationsRead = () => {
    setNotifications(prev => prev.map(notification => ({ ...notification, read: true })))
  }

  const clearNotifications = () => {
    setNotifications([])
  }

  const unreadNotificationCount = useMemo(
    () => notifications.filter(notification => !notification.read).length,
    [notifications]
  )

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
        notifications,
        unreadNotificationCount,
        addMenuItem,
        updateMenuItem,
        deleteMenuItem,
        uploadMenuImage,
        addHeroDish,
        updateHeroDish,
        deleteHeroDish,
        reorderHeroDishes,
        uploadHeroImage,
        createOrder,
        updateOrderStatus,
        createReservation,
        updateReservationStatus,
        addOffer,
        updateOffer,
        deleteOffer,
        addReview,
        updateReviewStatus,
        updateSettings,
        getStats,
        getAnalytics,
        markNotificationRead,
        markAllNotificationsRead,
        clearNotifications,
      }}
    >
      {children}
    </AdminContext.Provider>
  )
}

export const useAdmin = () => useContext(AdminContext)
