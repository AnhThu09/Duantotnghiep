import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import VoucherPage from "./components/VoucherPage/VoucherPage"; 
import UserManager from './pages/UserManager'; 
import VoucherManager from './pages/VoucherManager'; 
import ProductManager from './pages/ProductManager';
import FavoriteProductsManager from './pages/FavoriteProductsManager';
import SettingsPage from "./pages/SettingsPage";
import Layout from "./components/Layout";
import Dashboard from "./pages/Dashboard";
import CategoryManager from "./pages/CategoryManager";
import BrandManager from "./pages/BrandManager";

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/categories" element={<CategoryManager />} />
          <Route path="/brands" element={<BrandManager />} />
          <Route path="/vouchers" element={<VoucherManager />} />
          <Route path="/vouchers/:id" element={<VoucherPage />} />
          <Route path="/users" element={<UserManager />} /> 
          <Route path="/products" element={<ProductManager />} />
          <Route path="/favorite-products" element={<FavoriteProductsManager />} />
          <Route path="/settings" element={<SettingsPage />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
