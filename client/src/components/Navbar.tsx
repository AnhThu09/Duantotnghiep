import { FaHeart, FaSearch, FaShoppingCart, FaUser } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import { useEffect, useState, useCallback } from 'react';
import { useAuth } from '../context/AuthContext'; 

// Thêm các component MUI cần thiết nếu muốn dùng
import { Box, Button, Menu, MenuItem, Typography, CircularProgress } from '@mui/material';

interface Category {
  category_id: number;
  category_name: string;
  slug: string;
}

interface Brand {
  brand_id: number;
  brand_name: string;
  slug: string;
}

interface NavBarProps {
  onCartIconClick: () => void;
}

const NavBar = ({ onCartIconClick }: NavBarProps) => {
  const { isAuthenticated, currentUser, logout, loadingAuth } = useAuth();
  const navigate = useNavigate();

  const [categories, setCategories] = useState<Category[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);

  const [isProductHovered, setIsProductHovered] = useState(false);
  const [isBrandHovered, setIsBrandHovered] = useState(false);

  // State cho tìm kiếm
  const [searchTerm, setSearchTerm] = useState(''); 

  // State cho Menu tài khoản
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null); 
  const openAccountMenu = Boolean(anchorEl);

  // --- XỬ LÝ TÌM KIẾM ---
  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const handleSearchSubmit = useCallback((event: React.KeyboardEvent<HTMLInputElement>) => {
    // Kiểm tra nếu người dùng nhấn phím 'Enter'
    if (event.key === 'Enter' && searchTerm.trim() !== '') {
      // Chuyển hướng đến trang sản phẩm và truyền tham số tìm kiếm qua URL
      navigate(`/products?search=${encodeURIComponent(searchTerm.trim())}`);
      // Xóa từ khóa tìm kiếm trong ô input sau khi tìm kiếm
      setSearchTerm('');
    }
  }, [searchTerm, navigate]);

  // --- XỬ LÝ MENU TÀI KHOẢN ---
  const handleOpenAccountMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseAccountMenu = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    logout();
    handleCloseAccountMenu();
    navigate('/login');
  };

  const handleGoToAccount = () => {
    handleCloseAccountMenu();
    navigate('/account');
  };

 

  useEffect(() => {
    fetch('http://localhost:3000/api/categories')
      .then((res) => res.json())
      .then((data) => setCategories(data))
      .catch((err) => console.error('❌ Lỗi fetch categories:', err));

    fetch('http://localhost:3000/api/brands')
      .then((res) => res.json())
      .then((data) => setBrands(data))
      .catch((err) => console.error('❌ Lỗi fetch brands:', err));
  }, []);

  return (
<div className="px-4 text-dark font-sans" style={{
  position: 'fixed',
  top: 0,
  left: 0,
  right: 0,
  zIndex: 999,
  backgroundColor: '#fffefb',
  fontFamily: 'Raleway, sans-serif',
  fontWeight: 500,
  textTransform: 'uppercase',
  letterSpacing: '1px',
  fontSize: '16px',
}}>

      <div className="d-flex justify-content-between align-items-center">
        <div className="d-flex align-items-center gap-2">
          <Link className="navbar-brand" to="/">
            <img src="/img/Night owls.jpg" alt="logo" width="120" height="120" />
          </Link>
        </div>

        <div className="d-flex gap-4 small nav-links">
          <ul className="navbar-nav d-flex flex-row">
            <li className="nav-item mx-2">
              <Link className="nav-link" to="/">Trang chủ</Link>
            </li>

            {/* Dropdown Sản phẩm */}
            <li
              className="nav-item mx-2"
              onMouseEnter={() => setIsProductHovered(true)}
              onMouseLeave={() => setIsProductHovered(false)}
              style={{ position: 'relative' }}
            >
              <Link className="nav-link" to="/products">Sản phẩm</Link>
              {isProductHovered && (
                <div className="shadow-sm rounded" style={{
                  position: 'absolute',
                  top: '100%',
                  left: 0,
                  backgroundColor: '#fffefb',
                  border: '1px solid #eee',
                  zIndex: 999,
                  width: '240px',
                  padding: '12px 16px',
                }}>
                  <ul className="list-unstyled mb-0">
                    {categories.map((cat) => (
                      <li key={cat.category_id} className="mb-2">
                        <Link
                          to={`/danh-muc/${cat.slug}`}
                          className="d-block text-dark"
                          style={{ fontSize: '15px', fontWeight: 500, textDecoration: 'none' }}
                          onMouseEnter={(e) => ((e.target as HTMLElement).style.color = '#5EAB5A')}
                          onMouseLeave={(e) => ((e.target as HTMLElement).style.color = '#000')}
                        >
                          {cat.category_name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </li>

            {/* Dropdown Thương hiệu */}
            <li
              className="nav-item mx-2"
              onMouseEnter={() => setIsBrandHovered(true)}
              onMouseLeave={() => setIsBrandHovered(false)}
              style={{ position: 'relative' }}
            >
              <Link className="nav-link" to="#">Thương hiệu</Link>
              {isBrandHovered && (
                <div className="shadow-sm rounded" style={{
                  position: 'absolute',
                  top: '100%',
                  left: 0,
                  backgroundColor: '#fffefb',
                  border: '1px solid #eee',
                  zIndex: 999,
                  width: '240px',
                  padding: '12px 16px',
                }}>
                  <ul className="list-unstyled mb-0">
                    {brands.map((brand) => (
                      <li key={brand.brand_id} className="mb-2">
                        <Link
                          to={`/thuong-hieu/${brand.slug}`}
                          className="d-block text-dark"
                          style={{ fontSize: '15px', fontWeight: 500, textDecoration: 'none' }}
                          onMouseEnter={(e) => ((e.target as HTMLElement).style.color = '#5EAB5A')}
                          onMouseLeave={(e) => ((e.target as HTMLElement).style.color = '#000')}
                        >
                          {brand.brand_name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </li>

            <li className="nav-item mx-2">
              <Link className="nav-link" to="/km">Khuyến mãi</Link>
            </li>
            <li className="nav-item mx-2">
              <Link className="nav-link" to="/">Blog làm đẹp</Link>
            </li>
            <li className="nav-item mx-2">
              <Link className="nav-link" to="/contact">Liên hệ</Link>
            </li>
          </ul>
        </div>

        {/* Search & Icons */}
        <div className="d-flex align-items-center gap-4">
          <div className="d-flex align-items-center px-3 py-2 bg-light rounded-pill border">
            <FaSearch className="me-2 text-muted" />
            <input
              type="text"
              className="form-control border-0 bg-light shadow-none"
              placeholder="Tìm kiếm sản phẩm..."
              style={{ width: '200px' }}
              value={searchTerm} // ✅ Gán giá trị từ state
              onChange={handleSearchChange} // ✅ Xử lý thay đổi input
              onKeyDown={handleSearchSubmit} // ✅ Xử lý Enter
            />
          </div>

          <Link to="/favorites" className="text-dark"><FaHeart size={20} /></Link>
          <span className="text-dark" onClick={onCartIconClick} style={{ cursor: 'pointer' }}>
            <FaShoppingCart size={20} />
          </span>
          
          {/* ✅ PHẦN TÀI KHOẢN NGƯỜI DÙNG */}
          {loadingAuth ? ( 
            <CircularProgress size={20} color="inherit" sx={{ color: '#333' }} /> 
          ) : isAuthenticated ? (
            // Nếu đã đăng nhập: Hiển thị tên người dùng và menu dropdown
            <Box
              sx={{ cursor: 'pointer', display: 'flex', alignItems: 'center', position: 'relative' }}
              // Sử dụng onMouseEnter/onMouseLeave trên Box để quản lý menu
              onMouseEnter={handleOpenAccountMenu}
              onMouseLeave={handleCloseAccountMenu}
            >
              <FaUser size={20} className="me-1" />
              {/* Menu Dropdown Tài khoản */}
              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleCloseAccountMenu}
                // Giữ menu mở khi di chuột qua menu (dùng onMouseEnter/onMouseLeave trên MenuListProps)
                MenuListProps={{
                  onMouseEnter: (e) => setAnchorEl(e.currentTarget),
                  onMouseLeave: handleCloseAccountMenu,
                }}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                transformOrigin={{ vertical: 'top', horizontal: 'right' }}
              >
                <MenuItem onClick={handleGoToAccount}>
                  Quản lý tài khoản
                </MenuItem>
                <MenuItem onClick={handleLogout}>
                  Đăng xuất
                </MenuItem>
              </Menu>
            </Box>

          ) : (
            // Nếu chưa đăng nhập: Link đến trang đăng nhập
            <Link to="/login" className="text-dark"><FaUser size={20} /></Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default NavBar;