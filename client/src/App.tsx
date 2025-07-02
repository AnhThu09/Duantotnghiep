import { BrowserRouter, Route, Routes } from 'react-router-dom'
import ContactForm from './pages/ContactForm'
import Footer from './components/Footer'
import NavBar from './components/Navbar'
import About from './pages/About'
import Account from './pages/Account'
import HeroSection from './pages/HeroSection'
import ProductByCategory from './pages/ProductByCategory'
import Home from './pages/Home'
import ProductByBrand from './pages/ProductByBrand'
import CartSidebar from './components/CartSidebar'
import React, { useState } from 'react'

function App() {
   const [isCartOpen, setIsCartOpen] = useState(false)
  return (
    <>
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
          <Route path="/account" element={<Account />} />
          <Route path="/contact" element={<ContactForm />} />
        </Routes>
         <CartSidebar isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
        <Footer />
      </BrowserRouter>
    </>
  )
}

export default App
