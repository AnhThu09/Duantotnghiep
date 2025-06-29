import { FaHeart, FaSearch, FaShoppingCart, FaUser } from 'react-icons/fa'
import { Link } from 'react-router-dom'
import { useEffect, useState } from 'react'

interface Category {
  category_id: number
  category_name: string
  slug: string
}

interface Brand {
  brand_id: number
  brand_name: string
  slug: string
}
interface NavBarProps {
  onCartIconClick: () => void; // Khai báo một prop là hàm không trả về gì
}
const NavBar = ({ onCartIconClick }: NavBarProps) => {
  const [categories, setCategories] = useState<Category[]>([])
  const [brands, setBrands] = useState<Brand[]>([])

  const [isProductHovered, setIsProductHovered] = useState(false)
  const [isBrandHovered, setIsBrandHovered] = useState(false)

  useEffect(() => {
    fetch('http://localhost:3000/api/categories')
      .then((res) => res.json())
      .then((data) => setCategories(data))
      .catch((err) => console.error('❌ Lỗi fetch categories:', err))

    fetch('http://localhost:3000/api/brands')
      .then((res) => res.json())
      .then((data) => setBrands(data))
      .catch((err) => console.error('❌ Lỗi fetch brands:', err))
  }, [])

  return (
    <div className="px-4 text-dark font-sans" style={{
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
              <Link className="nav-link" to="#">Sản phẩm</Link>
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
          
          <Link to="/account" className="text-dark"><FaUser size={20} /></Link>
        </div>
      </div>
    </div>
  )
}

export default NavBar
