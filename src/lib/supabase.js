import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || ''
const supabaseAnonKey =
  import.meta.env.VITE_SUPABASE_ANON_KEY ||
  import.meta.env.VITE_SUPABASE_PUBLISHABLE_DEFAULT_KEY ||
  import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY ||
  ''

export const isSupabaseConfigured =
  Boolean(supabaseUrl) &&
  Boolean(supabaseAnonKey) &&
  !supabaseUrl.includes('your-supabase-url') &&
  !supabaseAnonKey.includes('your-supabase-anon-key')

export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: false,
      },
    })
  : null

// Database tables expected:
// - menu_items (id, name, description, price, category, image, badges, available)
// - hero_dishes (id, name, price, image, visible, order)
// - orders (id, customer_name, phone, items, total, status, type, address, date, payment)
// - reservations (id, name, phone, date, time, party_size, special_requests, status)
// - customers (id, name, phone, orders_count, total_spent)
// - offers (id, name, description, discount, type, applicable, valid_until, active)
// - reviews (id, name, rating, text, date, approved)
// - settings (id, restaurant_name, tagline, address, phone, hours, etc.)
