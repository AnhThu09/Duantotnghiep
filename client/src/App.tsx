import { useState } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Footer from './components/Footer';
import NavBar from './components/Navbar';
import Account from './pages/Account';
import ContactForm from './pages/ContactForm';
// import HeroSection from './pages/HeroSection'
import CartSidebar from './components/CartSidebar';
import PrivateRoute from './components/PrivateRoute';
import { AuthProvider } from './context/AuthContext';
import BlogPostDetail from './pages/BlogPostDetail';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import FavoriteProductsPage from './pages/FavoriteProductsPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import Home from './pages/Home';
import LoginPage from './pages/Login';
import NotFound from './pages/NotFound';
import ProductByBrand from './pages/ProductByBrand';
import ProductByCategory from './pages/ProductByCategory';
import ProductDetailPage from './pages/ProductDetailPage';
import ProductListWithFilters from './pages/ProductListWithFilters';
import RegisterPage from './pages/RegisterPage';
import ResetPasswordPage from './pages/ResetPasswordPage';
import ThankYouPage from './pages/ThankYouPage';
import VoucherListPage from './pages/VoucherListPage';
import ScrollToTop from './components/ScrollToTop';
import { CartProvider } from './context/CartContext';

function App() {
  const [isCartOpen, setIsCartOpen] = useState(false);
  
  return (
    <>
      <AuthProvider>
       <CartProvider>
        <BrowserRouter>
          <ScrollToTop /> {/* 👉 thêm dòng này ở đây */}
          <NavBar onCartIconClick={() => setIsCartOpen(true)} />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/products" element={<ProductListWithFilters />} />
            {/* <Route path="/brand" element={<ThuongHieu />} /> */}
            <Route path="/km" element={<VoucherListPage />} />
            {/* <Route path="/contact" element={<Blog />} /> */}
            {/* <Route path="/categories" element={<Contact />} /> */}
            {/* <Route path="/favorites" element={<Favorites />} /> */}
            {/* <Route path="/category" element={<CategoryGallery />} /> */}
            <Route path="/danh-muc/:slug" element={<ProductByCategory />} />
            <Route path="/products/danh-muc/:categorySlug" element={<ProductListWithFilters />} />
            <Route path="/thuong-hieu/:slug" element={<ProductByBrand />} />
            <Route path="/products/:productId" element={<ProductDetailPage />} />
            <Route
              path="/favorites"
              element={
                <PrivateRoute>
                  <FavoriteProductsPage />
                </PrivateRoute>
              }
            />
            <Route path="/contact" element={<ContactForm />} />
            <Route
              path="/cart"
              element={
                <PrivateRoute>
                  <CartPage />
                </PrivateRoute>
              }
            />
            
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/checkout" element={<CheckoutPage />} />
            <Route path="/thank-you" element={<ThankYouPage />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />
            <Route path="/reset-password" element={<ResetPasswordPage />} />
            <Route
              path="/account"
              element={
                <PrivateRoute>
                  <Account />
                </PrivateRoute>
              }
            />
            <Route path="/posts/:slug" element={<BlogPostDetail />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
          <CartSidebar isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
          <Footer />
        </BrowserRouter>
        </CartProvider>
      </AuthProvider>
    </>
  );
}

export default App;