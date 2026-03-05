# AI Development Rules - KHAIM Restaurant Webapp

## Tech Stack Overview
- **Framework**: React (Vite) for a fast, modern frontend experience.
- **Language**: TypeScript for robust type safety and maintainability.
- **Styling**: Tailwind CSS for utility-first layouts combined with custom CSS for the "Soft Claymorphism" design system.
- **UI Components**: shadcn/ui (Radix UI) for accessible, high-quality interface elements.
- **Icons**: Lucide React for a consistent and lightweight iconography set.
- **Routing**: React Router (v6+) for client-side navigation and protected admin routes.
- **State Management**: React Context API for modular global state (Cart, Admin, Toast, Theme).
- **Backend/Database**: Supabase for authentication, real-time database, and storage.
- **Animations**: Framer Motion for smooth transitions and the "puffy" claymorphism interactions.

## Development Rules & Library Usage

### 1. Styling & Design System
- **Claymorphism**: Always adhere to the "Soft Claymorphism" rules defined in `SPEC.md`. Use the CSS variables defined in `src/index.css` (e.g., `--shadow-clay`, `--radius-card`).
- **Tailwind CSS**: Use Tailwind for layout (flex, grid, spacing) and responsive design. Avoid writing raw CSS for standard positioning.
- **Theming**: Support both Light and Dark modes using the `data-theme` attribute on the root element.

### 2. Component Architecture
- **Atomic Design**: Keep components small and focused. Create a new file in `src/components/` for every new UI element.
- **shadcn/ui**: Prioritize using shadcn/ui components. If a component needs a "clay" look, wrap the shadcn component or extend its classes rather than rebuilding from scratch.
- **Icons**: Exclusively use `lucide-react`. Do not import other icon libraries.

### 3. State & Data Handling
- **Context API**: Use the existing Context providers for global state. Do not introduce Redux or other state management libraries unless the app complexity scales significantly.
- **Supabase**: All persistent data (Menu, Orders, Reservations) must be handled via the Supabase client in `src/lib/supabase.js`.
- **Local Storage**: Use `localStorage` only for non-sensitive persistence like the shopping cart or theme preference.

### 4. Routing & Security
- **Admin Routes**: All routes starting with `/admin` (except `/admin/login`) must be protected by the `isAuthenticated` check from `AdminContext`.
- **Navigation**: Use `react-router-dom` hooks (`useNavigate`, `useLocation`) for all navigation logic.

### 5. Performance & UX
- **Responsiveness**: Every new feature must be fully functional and visually polished on mobile (using the `MobileNav` and bottom-bar patterns).
- **Feedback**: Use the `ToastContext` to provide immediate feedback for user actions (adding to cart, placing orders, etc.).
- **Images**: Use descriptive `alt` tags and prioritize optimized Unsplash URLs or Supabase Storage links.