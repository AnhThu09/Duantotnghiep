<<<<<<< HEAD
// src/App.tsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';

import Dashboard from './pages/Dashboard';
import CategoryManager from './pages/CategoryManager';
import BrandManager from './pages/BrandManager';
import VoucherPage from "./components/VoucherPage/VoucherPage"; 
import UserManager from './pages/UserManager'; 
import VoucherManager from './pages/VoucherManager'; 
import ProductManager from './pages/ProductManager';
// import FavoriteProductsManager from './pages/FavoriteProductsManager';
import SettingsPage from "./pages/SettingsPage";
=======
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Dashboard from "./pages/Dashboard";
import CategoryManager from "././pages/CategoryManager"; // Chú ý đường dẫn
import BrandManager from "./pages/BrandManager";
import ProductManager from "./pages/ProductManager";
import FavoriteProductsManager from "./pages/FavoriteProductsManager";

>>>>>>> a87fa716c740314f879e638477deb1ca452fc757
function App() {
  return (
    <Router>
      <Layout>
<<<<<<< HEAD
=======
        {" "}
        {/* Layout bao bọc Routes để cung cấp thanh điều hướng và header chung */}
>>>>>>> a87fa716c740314f879e638477deb1ca452fc757
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/categories" element={<CategoryManager />} />
          <Route path="/brands" element={<BrandManager />} />
          <Route path="/vouchers" element={<VoucherManager />} />
          <Route path="/users" element={<UserManager />} /> 
          <Route path="/vouchers/:id" element={<VoucherPage />} />
          <Route path="/products" element={<ProductManager />} />
<<<<<<< HEAD
          {/* <Route path="/favorites" element={<FavoritesPage />} /> */}
           <Route path="/settings" element={<SettingsPage />} />
=======
          <Route path="/favorites" element={<FavoriteProductsManager />} />
          {/* <Route path="/users" element={<UserManager />} /> */}
>>>>>>> a87fa716c740314f879e638477deb1ca452fc757
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
