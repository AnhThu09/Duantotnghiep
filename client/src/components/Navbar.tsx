import { FaHeart, FaSearch, FaShoppingCart, FaUser } from 'react-icons/fa'
import { Link } from 'react-router-dom'
import { useEffect, useState } from 'react'
interface Category {
  category_id: number
  category_name: string
  slug: string
}
const NavBar = () => {
  const [categories, setCategories] = useState<Category[]>([])
const [isHovered, setIsHovered] = useState(false)

useEffect(() => {
  fetch('http://localhost:3000/api/categories')
    .then((res) => res.json())
    .then((data) => setCategories(data))
    .catch((err) => console.error('❌ Lỗi fetch:', err))
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
            <img
              src="/img/Night owls.jpg"
              alt="ad"
              width="120"
              height="120"
            />
          </Link>
        </div>

        <div className="d-flex gap-4 small nav-links">
          <ul className="navbar-nav d-flex flex-row">
            <li className="nav-item mx-2">
              <Link className="nav-link" to="/">
                Trang chủ
              </Link>
            </li>
            <li className="nav-item mx-2">
              <Link className="nav-link" to="/about">
                Sản phẩm
              </Link>
            </li>
            <li
              className="nav-item mx-2"
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
              style={{ position: 'relative' }}
            >
              <Link className="nav-link text-uppercase fw-semibold text-dark" to="/about"
              >
                Sản phẩm
              </Link>

              {/* Dropdown menu */}
              {isHovered && (
                <div
                  className="shadow-sm rounded"
                  style={{
                    position: 'absolute',
                    top: '100%',
                    left: 0,
                    backgroundColor: '#fffefb',
                    border: '1px solid #eee',
                    zIndex: 999,
                    width: '240px',
                    padding: '12px 16px',
                  }}
                >
                  <ul className="list-unstyled mb-0">
                    {categories.map((cat) => (
                      <li key={cat.category_id} className="mb-2">
                        <Link
                          to={`/danh-muc/${cat.slug}`}
                          className="d-block text-dark"
                          style={{
                            fontSize: '15px',
                            fontWeight: 500,
                            textDecoration: 'none',
                          }}
                          onMouseEnter={(e) =>
                            ((e.target as HTMLElement).style.color = '#5EAB5A')
                          }
                          onMouseLeave={(e) =>
                            ((e.target as HTMLElement).style.color = '#000')
                          }
                        >
                          {cat.category_name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </li>

            <li className="nav-item mx-2">
              <Link className="nav-link" to="/brand">
                Thương hiệu
              </Link>
            </li>
            <li className="nav-item mx-2">
              <Link className="nav-link" to="/km">
                Khuyến mãi
              </Link>
            </li>
            <li className="nav-item mx-2">
              <Link className="nav-link" to="/">
                Blog làm đẹp
              </Link>
            </li>
            <li className="nav-item mx-2">
              <Link className="nav-link" to="/contact">
                Liên hệ
              </Link>
            </li>
          </ul>
        </div>

        {/* Search and Icons */}
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

          {/* Icon links */}
          <Link to="/favorites" className="text-dark">
            <FaHeart size={20} className="cursor-pointer" />
          </Link>
          <Link to="/cart" className="text-dark">
            <FaShoppingCart size={20} className="cursor-pointer" />
          </Link>
          <Link to="/account" className="text-dark">
            <FaUser size={20} className="cursor-pointer" />
          </Link>
        </div>
      </div>
    </div>
  )
}

export default NavBar
