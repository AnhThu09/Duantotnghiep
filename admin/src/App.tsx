import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import CategoryManager from '././pages/CategoryManager'; // Chú ý đường dẫn

function App() {
  return (
    <Router>
      <Layout> {/* Layout bao bọc Routes để cung cấp thanh điều hướng và header chung */}
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/categories" element={<CategoryManager />} />
          {/* Bạn có thể thêm các Route khác ở đây cho các trang khác */}
          {/* <Route path="/products" element={<ProductManager />} /> */}
          {/* <Route path="/users" element={<UserManager />} /> */}
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;