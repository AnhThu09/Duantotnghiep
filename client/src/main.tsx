import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap/dist/js/bootstrap.bundle.min.js'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { CartProvider } from './context/CartContext.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <CartProvider>
      <App />
    </CartProvider>
  </StrictMode>
)
