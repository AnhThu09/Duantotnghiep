import { FaHeart, FaSearch, FaShoppingCart, FaUser } from 'react-icons/fa'; // Giữ FaUser nếu muốn dùng icon
import { Link, useNavigate } from 'react-router-dom'; // Thêm useNavigate
import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext'; // ✅ Import useAuth

// Thêm các component MUI cần thiết nếu muốn dùng (ví dụ: Box, Button, Menu, MenuItem)
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
  const { isAuthenticated, currentUser, logout, loadingAuth } = useAuth(); // ✅ Lấy trạng thái từ AuthContext
  const navigate = useNavigate(); // ✅ Khởi tạo useNavigate

  const [categories, setCategories] = useState<Category[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);

  const [isProductHovered, setIsProductHovered] = useState(false);
  const [isBrandHovered, setIsBrandHovered] = useState(false);

  // State cho Menu tài khoản
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null); // Anchor element cho menu
  const openAccountMenu = Boolean(anchorEl); // Trạng thái mở/đóng menu

  // Xử lý mở Menu tài khoản
  const handleOpenAccountMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  // Xử lý đóng Menu tài khoản
  const handleCloseAccountMenu = () => {
    setAnchorEl(null);
  };

  // Xử lý đăng xuất
  const handleLogout = () => {
    logout(); // Gọi hàm logout từ AuthContext
    handleCloseAccountMenu(); // Đóng menu
    navigate('/login'); // Chuyển hướng về trang đăng nhập
  };

  // Xử lý đi đến trang tài khoản
  const handleGoToAccount = () => {
    handleCloseAccountMenu(); // Đóng menu
    navigate('/account'); // Chuyển hướng đến trang tài khoản
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
  position: 'fixed', // ✅ Cố định khi cuộn
  top: 0,
  left: 0,
  right: 0,
  zIndex: 999, // ✅ Đè lên phần khác
  backgroundColor: '#fffefb', // ✅ Có màu nền để che
  fontFamily: 'Raleway, sans-serif',
  fontWeight: 500,
  textTransform: 'uppercase',
  letterSpacing: '1px',
  fontSize: '16px',
}}>

      <div className="d-flex justify-content-between align-items-center">
        <div className="d-flex align-items-center gap-2">
          <Link className="navbar-brand" to="/">
            <img src="./public/img/Night owls.jpg" alt="logo" width="120" height="120" />
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
            />
          </div>

          <Link to="/favorites" className="text-dark"><FaHeart size={20} /></Link>
          <span className="text-dark" onClick={onCartIconClick} style={{ cursor: 'pointer' }}>
            <FaShoppingCart size={20} />
          </span>
          
          {/* ✅ PHẦN TÀI KHOẢN NGƯỜI DÙNG */}
          {loadingAuth ? ( // Hiển thị loading spinner khi đang kiểm tra auth
            <CircularProgress size={20} color="inherit" sx={{ color: '#333' }} /> 
          ) : isAuthenticated ? (
            // Nếu đã đăng nhập: Hiển thị tên người dùng và menu dropdown

<Box
  sx={{ cursor: 'pointer', display: 'flex', alignItems: 'center', position: 'relative' }}
  onMouseEnter={(e) => setAnchorEl(e.currentTarget)} // Hover vào sẽ mở menu
  onMouseLeave={() => setAnchorEl(null)} // Rời chuột sẽ ẩn menu
>
  <FaUser size={20} className="me-1" />
  {/* <Typography
    variant="body2"
    sx={{
      fontSize: '16px',
      textTransform: 'uppercase',
      color: '#333',
      '&:hover': { color: '#5EAB5A' },
    }}
  >
    {currentUser?.full_name || currentUser?.email?.split('@')[0] || "Tài khoản"}
  </Typography> */}

  {/* MENU Dropdown */}
  <Menu
    anchorEl={anchorEl}
    open={Boolean(anchorEl)}
    onClose={() => setAnchorEl(null)}
    MenuListProps={{
      onMouseEnter: () => {}, // Giữ mở khi di chuột qua menu
      onMouseLeave: () => setAnchorEl(null), // Rời chuột khỏi menu thì ẩn
    }}
    anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
    transformOrigin={{ vertical: 'top', horizontal: 'right' }}
  >
    <MenuItem
      onClick={() => {
        setAnchorEl(null);
        navigate('/account');
      }}
    >
      Quản lý tài khoản
    </MenuItem>
    <MenuItem
      onClick={() => {
        setAnchorEl(null);
        logout();
        navigate('/login');
      }}
    >
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