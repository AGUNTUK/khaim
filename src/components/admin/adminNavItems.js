import {
  Calendar,
  ChefHat,
  Image,
  LayoutDashboard,
  Settings,
  ShoppingBag,
  Star,
  TrendingUp,
  Users,
} from 'lucide-react'

export const adminNavItems = [
  { path: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/admin/hero', label: 'Hero Carousel', icon: Image },
  { path: '/admin/menu', label: 'Menu', icon: ChefHat },
  { path: '/admin/orders', label: 'Orders', icon: ShoppingBag },
  { path: '/admin/reservations', label: 'Reservations', icon: Calendar },
  { path: '/admin/customers', label: 'Customers', icon: Users },
  { path: '/admin/offers', label: 'Offers', icon: TrendingUp },
  { path: '/admin/reviews', label: 'Reviews', icon: Star },
  { path: '/admin/settings', label: 'Settings', icon: Settings },
]
