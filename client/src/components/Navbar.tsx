import { FaHeart, FaSearch, FaShoppingCart, FaUser } from 'react-icons/fa'
import { Link } from 'react-router-dom'

const NavBar = () => {
  return (
    <div className="py-2 px-5 text-dark font-sans">
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
