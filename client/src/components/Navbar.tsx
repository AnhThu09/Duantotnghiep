import { FaHeart, FaSearch, FaShoppingCart, FaUser } from 'react-icons/fa'
import { Link } from 'react-router-dom'

const NavBar = () => {
  return (
    <div className="container py-2 text-dark font-sans">
      <div className="d-flex justify-content-between align-items-center mb-5">
        <div className="d-flex align-items-center gap-2">
          <Link className="navbar-brand" to="/">
            <img
              src="https://scontent.fdad1-3.fna.fbcdn.net/v/t39.30808-6/505926607_1412352526772619_8330902436027633308_n.jpg?_nc_cat=104&cb=64d46a15-dccda127&ccb=1-7&_nc_sid=127cfc&_nc_ohc=-l6mgAQz0s8Q7kNvwG9Fh-8&_nc_oc=Adl0dW6whGGjteBwQdW75NR1_6FRSJMgMN62pXteKZHSihIWWhuoDG4uy6pFt1yqsMqLJNbqStgW40oRYt9We8wO&_nc_zt=23&_nc_ht=scontent.fdad1-3.fna&_nc_gid=c-Y_3HgMEIa285k3XxIL0A&oh=00_AfOOd_W8Cr_OiCdJ9ERu12xAJFQcypEyjCQ13W-ld2CiLQ&oe=684E5DAC"
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
              <Link className="nav-link" to="/contact">
                Blog làm đẹp
              </Link>
            </li>
            <li className="nav-item mx-2">
              <Link className="nav-link" to="/categories">
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
