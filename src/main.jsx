import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App'
import { AdminProvider } from './context/AdminContext'
import { CartProvider } from './context/CartContext'
import { ToastProvider } from './context/ToastContext'
import { UserProvider } from './context/UserContext'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <ToastProvider>
        <CartProvider>
          <AdminProvider>
            <UserProvider>
              <App />
            </UserProvider>
          </AdminProvider>
        </CartProvider>
      </ToastProvider>
    </BrowserRouter>
  </React.StrictMode>
)
