// src/App.tsx
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import VoucherPage from "./components/VoucherPage/VoucherPage"; 
import UserManager from './pages/UserManager'; 
import VoucherManager from './pages/VoucherManager'; 
import ProductManager from './pages/ProductManager';
import FavoriteProductsManager from './pages/FavoriteProductsManager'; // Giữ lại hoặc thêm vào nếu cần
import SettingsPage from "./pages/SettingsPage";
import Layout from "./components/Layout";
import Dashboard from "./pages/Dashboard";
import CategoryManager from "././pages/CategoryManager"; // Chú ý đường dẫn
import BrandManager from "./pages/BrandManager";
import ContactList from './pages/ContactList';
import PostManager from './pages/PostManager';

interface LayoutProps {
  children: React.ReactNode;
  authorized: boolean;
}
function App() {
  return (
    <Router>
      <Layout authorized={true}>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/categories" element={<CategoryManager />} />
          <Route path="/brands" element={<BrandManager />} />
          <Route path="/vouchers" element={<VoucherManager />} />
          {/* <Route path="vouchers" element={<DiscountCodesManager />} /> */}
          <Route path="/users" element={<UserManager />} /> 
          <Route path="/vouchers/:id" element={<VoucherPage />} />
          <Route path="/products" element={<ProductManager />} />
          <Route path="/favorites" element={<FavoriteProductsManager />} /> {/* Đã được thêm vào */}
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="/posts" element={<PostManager />} />
           <Route path="/settings" element={<SettingsPage />} />
          <Route path="/favorites" element={<FavoriteProductsManager />} />
          <Route path="/contact" element={<ContactList />} />
          
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;