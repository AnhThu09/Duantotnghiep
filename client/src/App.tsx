import { BrowserRouter, Route, Routes } from 'react-router-dom'
import React, { useState } from 'react'
import ContactForm from './pages/ContactForm'
import Footer from './components/Footer'
import NavBar from './components/Navbar'
import About from './pages/About'
import Account from './pages/Account'
// import HeroSection from './pages/HeroSection'
import ProductByCategory from './pages/ProductByCategory'
import Home from './pages/Home'
import ProductByBrand from './pages/ProductByBrand'
import CartSidebar from './components/CartSidebar'
import CartPage from './pages/CartPage'
import CheckoutPage from './pages/CheckoutPage'
import ThankYouPage from './pages/ThankYouPage'
import NotFound from './pages/NotFound'
import RegisterPage from './pages/RegisterPage'
import LoginPage from './pages/Login'
import ForgotPasswordPage from './pages/ForgotPasswordPage'
import ResetPasswordPage from './pages/ResetPasswordPage'
import { AuthProvider } from './context/AuthContext';
import PrivateRoute from './components/PrivateRoute';
import ProductDetailPage from './pages/ProductDetailPage'
import FavoriteProductsPage from './pages/FavoriteProductsPage'
import BlogPostDetail from './pages/BlogPostDetail'


function App() {
   const [isCartOpen, setIsCartOpen] = useState(false)
  return (
    <>
      <AuthProvider>
      <BrowserRouter>
        <NavBar onCartIconClick={() => setIsCartOpen(true)} />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          {/* <Route path="/brand" element={<ThuongHieu />} /> */}
          {/* <Route path="/km" element={<KhuyenMai />} /> */}
          {/* <Route path="/contact" element={<Blog />} /> */}
          {/* <Route path="/categories" element={<Contact />} /> */}
          {/* <Route path="/favorites" element={<Favorites />} /> */}
          {/* <Route path="/category" element={<CategoryGallery />} /> */}
          <Route path="/danh-muc/:slug" element={<ProductByCategory />} />
          <Route path="/thuong-hieu/:slug" element={<ProductByBrand />} />
          <Route path="/products/:productId" element={<ProductDetailPage />} />
          <Route path="/favorites" element={<FavoriteProductsPage />} />
          <Route path="/contact" element={<ContactForm />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/thank-you" element={<ThankYouPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/reset-password" element={<ResetPasswordPage />} />
          <Route path="/account" element={<PrivateRoute><Account /></PrivateRoute>} />
          <Route path="/posts/:slug" element={<BlogPostDetail />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
         <CartSidebar isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
        <Footer />
      </BrowserRouter>
      </AuthProvider>
    </>
  )
}

export default App
