# KHAIM Restaurant Webapp - Specification Document

## 1. Project Overview

**Project Name:** KHAIM Restaurant Webapp  
**Project Type:** Full-stack Restaurant Website with Admin Panel  
**Core Functionality:** Online food ordering, table reservations, menu display, and restaurant information management  
**Target Users:** Restaurant customers (dine-in, takeout, delivery) and restaurant administrators

---

## 2. UI/UX Specification

### 2.1 Design System - Soft Claymorphism

**Style Characteristics:**
- Rounded puffy cards with soft multi-layered shadows
- Frosted glass overlays
- 3D-like depth with gentle gradients
- Smooth inflated shapes
- Subtle grain/noise texture on backgrounds

### 2.2 Color Palette - Light Theme

| Role | Color | Hex Code |
|------|-------|----------|
| Primary | Warm Amber/Gold | #F5A623 |
| Secondary | Deep Flame Orange | #E8440A |
| Accent | Soft Cream | #FFF3DC |
| Background | Warm Off-White | #FFFAF4 |
| Section Alt BG | Soft Peach-Cream | #FFF0DC |
| Card Surface | White | #FFFFFF |
| Text Primary | Near-Black (Warm) | #1A1009 |
| Text Muted | Warm Brown | #8A6A3A |
| Gold Highlight | Gold | #F5A623 |
| Border | Gold Transparent | rgba(245,166,35,0.2) |

### 2.3 Typography

| Element | Font Family | Weight | Size |
|---------|-------------|--------|------|
| Display Headings | Playfair Display | 700 | 48-72px |
| Section Headings | Playfair Display | 600 | 32-48px |
| Subheadings | Playfair Display | 500 | 24px |
| Body Text | Nunito | 400 | 16px |
| Small Text | Nunito | 400 | 14px |
| Buttons | Nunito | 600 | 16px |

### 2.4 Clay UI Rules

**Cards:**
- border-radius: 24px
- box-shadow: 0 8px 32px rgba(245,166,35,0.15), 0 2px 8px rgba(0,0,0,0.04)

**Buttons:**
- border-radius: 999px (pill-shaped)
- gradient fill: linear-gradient(135deg, #F5A623, #E8440A)
- slight inner glow on hover

**Inputs:**
- border-radius: 16px
- warm border glow on focus: 0 0 0 3px rgba(245,166,35,0.2)

**Images:**
- displayed in puffy clay-rounded frames
- warm glow shadows

**Hover States:**
- cards lift: transform: translateY(-4px)
- deeper shadow on hover

---

## 3. Page Structure

### 3.1 Public Pages

1. **Home Page** (`/`)
   - Hero Section with orbital dish carousel
   - Marquee/Announcement Bar
   - Featured Categories
   - Why KHAIM? Features Strip
   - Popular Items Section
   - Special Offers Banner
   - Testimonials Section
   - Location & Hours Card
   - Footer

2. **Menu Page** (`/menu`)
   - Page header
   - Filter tabs
   - Search bar
   - Menu grid with cards

3. **Online Order Page** (`/order`)
   - Browse & Add items
   - Cart sidebar
   - Order type toggle
   - Delivery details form
   - Payment method selection
   - Order confirmation

4. **Table Reservation Page** (`/reservation`)
   - Reservation form
   - Opening hours reminder

5. **About Page** (`/about`)
   - Brand story
   - Target audience
   - Team/Chef highlight
   - Quality badge

6. **Contact Page** (`/contact`)
   - Contact information
   - Contact form
   - Google Maps embed

### 3.2 Admin Panel (`/admin`)

- **Login Page** - Email/password authentication
- **Dashboard** - Stats, recent orders, revenue chart
- **Menu Management** - CRUD operations, categories
- **Orders Management** - Status updates, order details
- **Reservations Management** - List, confirm/cancel
- **Customer Management** - Customer list, order history
- **Offers & Promotions** - Create/edit discounts
- **Reviews Management** - View, approve, reply
- **Settings** - Restaurant info, delivery, payment

---

## 4. Restaurant Information

| Field | Value |
|-------|-------|
| Name | KHAIM |
| Tagline | Taste of Rangpurian's |
| Location | Shapla Chattar, Rangpur, Bangladesh |
| Phone | 01744-750870 |
| Hours | 10:00 AM – 11:00 PM (Daily) |
| Cuisine | Mixed (Bangladeshi, Fast Food, Grills, Snacks) |
| Rating | ⭐⭐⭐⭐ (4-star) |

---

## 5. Functionality Specification

### 5.1 Hero Carousel (Admin Controllable)
- 5-6 dish images on orbital track
- Auto-rotation every 2.5 seconds
- Center spotlight for featured dish
- Admin can upload/replace images
- Admin can reorder dishes
- Toggle show/hide individual dishes
- Minimum 3 dishes required

### 5.2 Cart System
- Add/remove items
- Quantity adjustment
- Local storage persistence
- Subtotal calculation

### 5.3 Online Ordering
- Order type: Delivery or Pickup
- Customer details collection
- Payment method: COD, bKash, Nagad
- Order confirmation with ID

### 5.4 Table Reservations
- Form with: Name, Phone, Date, Time, Party Size, Special Requests
- Time slots: 10AM-10PM, 30-min intervals
- Confirmation via phone call

### 5.5 Admin Features
- JWT/Session authentication
- Dashboard with statistics
- Full menu CRUD
- Order status management
- Reservation management
- Customer database
- Offers management
- Reviews management
- Settings management

### 5.6 Additional Features
- WhatsApp floating button (wa.me/8801744750870)
- Cart persistence in localStorage
- Clay-style skeleton loaders
- Toast notifications
- SEO meta tags
- Custom 404 page
- Mobile bottom navigation bar

---

## 6. Responsive Breakpoints

| Device | Width | Layout |
|--------|-------|--------|
| Mobile | < 768px | Single column, bottom nav |
| Tablet | 768px - 1024px | Two columns |
| Desktop | > 102 multi-column |

---

## 7.4px | Full Acceptance Criteria

1. ✅ All 6 public pages implemented and functional
2. ✅ Admin panel with all specified features
3. ✅ Claymorphism design consistently applied
4. ✅ Color palette matches specification exactly
5. ✅ Typography uses Playfair Display and Nunito
6. ✅ Hero orbital carousel works with auto-rotation
7. ✅ Cart functionality with localStorage persistence
8. ✅ Online ordering flow complete
9. ✅ Table reservation form functional
10. ✅ Fully responsive on all devices
11. ✅ WhatsApp floating button on all pages
12. ✅ Toast notifications working
13. ✅ Mobile bottom navigation present
14. ✅ All animations smooth and performant
