import React, { useEffect, useState, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FaHeart,
  FaSearch,
  FaShoppingCart,
  FaUser,
  FaChevronDown,
} from "react-icons/fa";
import { useAuth } from "../context/AuthContext";
import ProductAndBrandDropdowns from "./ProductAndBrandDropdowns";

// Types
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

interface DropdownState {
  products: boolean;
  brands: boolean;
  account: boolean;
}

// Constants
const DROPDOWN_DELAY = 200;
const NAV_LINKS = [
  { to: "/", label: "Trang chủ" },
  { to: "/km", label: "Khuyến mãi" },
  { to: "/blog", label: "Blog làm đẹp" },
  { to: "/contact", label: "Liên hệ" },
];

const NAVBAR_STYLES = {
  navbar: {
    position: "fixed" as const,
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1050,
    backgroundColor: "rgba(255, 254, 251, 0.95)",
    backdropFilter: "blur(10px)",
    fontFamily: "Raleway, sans-serif",
    fontWeight: 500,
    textTransform: "uppercase" as const,
    letterSpacing: "1px",
    fontSize: "14px",
    borderBottom: "1px solid rgba(0,0,0,0.1)",
  },
  logo: {
    width: "50px",
    height: "50px",
    objectFit: "cover" as const,
  },
  searchContainer: {
    backgroundColor: "#f8f9fa",
    borderRadius: "25px",
    border: "1px solid #e9ecef",
    overflow: "hidden",
    transition: "all 0.3s ease",
    width: "200px",
  },
  iconButton: {
    width: "40px",
    height: "40px",
    borderRadius: "50%",
    transition: "all 0.3s ease",
  },
  dropdown: {
    position: "absolute" as const,
    backgroundColor: "white",
    borderRadius: "8px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
    border: "1px solid #e9ecef",
    padding: "15px 0",
    marginTop: "8px",
    zIndex: 1000,
    transition: "all 0.3s ease",
  },
};

// Custom hooks
const useDropdown = () => {
  const [isOpen, setIsOpen] = useState<DropdownState>({
    products: false,
    brands: false,
    account: false,
  });
  const [timeouts, setTimeouts] = useState<{
    products: NodeJS.Timeout | null;
    brands: NodeJS.Timeout | null;
    account: NodeJS.Timeout | null;
  }>({
    products: null,
    brands: null,
    account: null,
  });

  const handleMouseEnter = useCallback(
    (dropdown: keyof DropdownState) => {
      if (timeouts[dropdown]) {
        clearTimeout(timeouts[dropdown]);
      }
      setIsOpen((prev) => ({ ...prev, [dropdown]: true }));
    },
    [timeouts]
  );

  const handleMouseLeave = useCallback((dropdown: keyof DropdownState) => {
    const timeout = setTimeout(() => {
      setIsOpen((prev) => ({ ...prev, [dropdown]: false }));
    }, DROPDOWN_DELAY);

    setTimeouts((prev) => ({ ...prev, [dropdown]: timeout }));
  }, []);

  const closeDropdown = useCallback((dropdown: keyof DropdownState) => {
    setIsOpen((prev) => ({ ...prev, [dropdown]: false }));
  }, []);

  // Cleanup timeouts on unmount
  useEffect(() => {
    return () => {
      Object.values(timeouts).forEach((timeout) => {
        if (timeout) clearTimeout(timeout);
      });
    };
  }, [timeouts]);

  return {
    isOpen,
    handleMouseEnter,
    handleMouseLeave,
    closeDropdown,
  };
};

const useApiData = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [categoriesRes, brandsRes] = await Promise.all([
          fetch("http://localhost:3000/api/categories"),
          fetch("http://localhost:3000/api/brands"),
        ]);

        if (!categoriesRes.ok || !brandsRes.ok) {
          throw new Error("Failed to fetch data");
        }

        const [categoriesData, brandsData] = await Promise.all([
          categoriesRes.json(),
          brandsRes.json(),
        ]);

        setCategories(categoriesData);
        setBrands(brandsData);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
        console.error("❌ Error fetching data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return { categories, brands, loading, error };
};

// Components
const Logo: React.FC = () => (
  <div className="d-flex align-items-center">
    <Link className="navbar-brand d-flex align-items-center" to="/">
      <img
        src="/img/Night owls.jpg"
        alt="Night Owls"
        className="rounded-circle me-2"
        style={NAVBAR_STYLES.logo}
      />
      <span
        className="fw-bold text-dark"
        style={{
          fontSize: "20px",
          letterSpacing: "0.5px",
          textTransform: "none",
        }}
      >
        Night Owls
      </span>
    </Link>
  </div>
);

const SearchBar: React.FC<{
  searchTerm: string;
  onSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSearchSubmit: (e: React.KeyboardEvent<HTMLInputElement>) => void;
}> = ({ searchTerm, onSearchChange, onSearchSubmit }) => (
  <div className="me-4 d-none d-md-block">
    <div className="input-group" style={NAVBAR_STYLES.searchContainer}>
      <span className="input-group-text bg-transparent border-0">
        <FaSearch className="text-muted" style={{ fontSize: "14px" }} />
      </span>
      <input
        type="text"
        className="form-control border-0 bg-transparent shadow-none"
        placeholder="Tìm kiếm sản phẩm..."
        style={{ fontSize: "14px" }}
        value={searchTerm}
        onChange={onSearchChange}
        onKeyDown={onSearchSubmit}
      />
    </div>
  </div>
);

const NavLink: React.FC<{ to: string; children: React.ReactNode }> = ({
  to,
  children,
}) => (
  <li className="nav-item mx-3">
    <Link
      className="nav-link text-dark position-relative"
      to={to}
      style={{
        transition: "all 0.3s ease",
        textDecoration: "none",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.color = "#007bff";
        e.currentTarget.style.transform = "translateY(-1px)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.color = "#000";
        e.currentTarget.style.transform = "translateY(0)";
      }}
    >
      {children}
    </Link>
  </li>
);

// DropdownMenu is now a local component to ProductAndBrandDropdowns, but if it needs to be reused elsewhere,
// it should be extracted to its own file. For now, it's kept here for demonstration.
interface DropdownMenuProps {
  items: Array<{ id: number; name: string; slug: string }>;
  isVisible: boolean;
  linkPrefix: string;
  width?: string;
  position?: "left" | "right";
}

const DropdownMenu: React.FC<DropdownMenuProps> = ({
  items,
  isVisible,
  linkPrefix,
  width = "280px",
  position = "left",
}) => (
  <div
    className="position-absolute bg-white rounded shadow-lg border"
    style={{
      ...NAVBAR_STYLES.dropdown,
      top: "100%",
      [position]: "0",
      width,
      opacity: isVisible ? 1 : 0,
      visibility: isVisible ? "visible" : "hidden",
      transform: isVisible ? "translateY(0)" : "translateY(-10px)",
    }}
  >
    {items.map((item) => (
      <Link
        key={item.id}
        to={`${linkPrefix}${item.slug}`}
        className="d-block px-4 py-2 text-dark text-decoration-none"
        style={{
          fontSize: "13px",
          fontWeight: 500,
          transition: "all 0.2s ease",
          textTransform: "none",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = "#f8f9fa";
          e.currentTarget.style.color = "#007bff";
          e.currentTarget.style.paddingLeft = "20px";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = "transparent";
          e.currentTarget.style.color = "#000";
          e.currentTarget.style.paddingLeft = "16px";
        }}
      >
        {item.name}
      </Link>
    ))}
  </div>
);

const ActionIcons: React.FC<{
  onCartClick: () => void;
  isAuthenticated: boolean;
  currentUser: any;
  loadingAuth: boolean;
  onLogout: () => void;
  onGoToAccount: () => void;
  isAccountHovered: boolean;
  onAccountMouseEnter: () => void;
  onAccountMouseLeave: () => void;
}> = ({
  onCartClick,
  isAuthenticated,
  currentUser,
  loadingAuth,
  onLogout,
  onGoToAccount,
  isAccountHovered,
  onAccountMouseEnter,
  onAccountMouseLeave,
}) => (
  <div className="d-flex align-items-center">
    {/* Favorites */}
    <Link
      to="/favorites"
      className="text-dark me-3 d-flex align-items-center justify-content-center"
      style={NAVBAR_STYLES.iconButton}
      onMouseEnter={(e) => {
        e.currentTarget.style.backgroundColor = "#ffe6e6";
        e.currentTarget.style.color = "#dc3545";
        e.currentTarget.style.transform = "scale(1.1)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.backgroundColor = "transparent";
        e.currentTarget.style.color = "#000";
        e.currentTarget.style.transform = "scale(1)";
      }}
    >
      <FaHeart size={18} />
    </Link>

    {/* Cart */}
    <button
      onClick={onCartClick}
      className="btn text-dark me-3 d-flex align-items-center justify-content-center p-0"
      style={{
        ...NAVBAR_STYLES.iconButton,
        border: "none",
        backgroundColor: "transparent",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.backgroundColor = "#e6f3ff";
        e.currentTarget.style.color = "#007bff";
        e.currentTarget.style.transform = "scale(1.1)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.backgroundColor = "transparent";
        e.currentTarget.style.color = "#000";
        e.currentTarget.style.transform = "scale(1)";
      }}
    >
      <FaShoppingCart size={18} />
    </button>

    {/* User Account */}
    {loadingAuth ? (
      <div
        className="d-flex align-items-center justify-content-center"
        style={{ width: "40px", height: "40px" }}
      >
        <div
          className="spinner-border spinner-border-sm text-primary"
          role="status"
          style={{ width: "20px", height: "20px" }}
        >
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    ) : isAuthenticated ? (
      <div
        className="position-relative"
        onMouseEnter={onAccountMouseEnter}
        onMouseLeave={onAccountMouseLeave}
      >
        <button
          className="btn text-dark d-flex align-items-center p-2"
          style={{
            borderRadius: "25px",
            transition: "all 0.3s ease",
            border: "none",
            backgroundColor: "transparent",
            fontSize: "13px",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = "#f8f9fa";
            e.currentTarget.style.color = "#007bff";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = "transparent";
            e.currentTarget.style.color = "#000";
          }}
        >
          <FaUser size={16} className="me-2" />
          <span className="d-none d-sm-inline">
            {currentUser?.name || "Tài khoản"}
          </span>
        </button>

        {/* Account Dropdown */}
        <div
          className="position-absolute bg-white rounded shadow-lg border"
          style={{
            ...NAVBAR_STYLES.dropdown,
            top: "100%",
            right: "0",
            width: "200px",
            padding: "10px 0",
            opacity: isAccountHovered ? 1 : 0,
            visibility: isAccountHovered ? "visible" : "hidden",
            transform: isAccountHovered ? "translateY(0)" : "translateY(-10px)",
          }}
        >
          <button
            onClick={onGoToAccount}
            className="btn btn-link text-dark text-decoration-none w-100 text-start px-4 py-2"
            style={{
              fontSize: "13px",
              fontWeight: 500,
              transition: "all 0.2s ease",
              border: "none",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = "#f8f9fa";
              e.currentTarget.style.color = "#007bff";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "transparent";
              e.currentTarget.style.color = "#000";
            }}
          >
            Quản lý tài khoản
          </button>
          <button
            onClick={onLogout}
            className="btn btn-link text-dark text-decoration-none w-100 text-start px-4 py-2"
            style={{
              fontSize: "13px",
              fontWeight: 500,
              transition: "all 0.2s ease",
              border: "none",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = "#f8f9fa";
              e.currentTarget.style.color = "#dc3545";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "transparent";
              e.currentTarget.style.color = "#000";
            }}
          >
            Đăng xuất
          </button>
        </div>
      </div>
    ) : (
      <Link
        to="/login"
        className="btn btn-primary d-flex align-items-center px-3 py-2"
        style={{
          borderRadius: "25px",
          fontSize: "13px",
          fontWeight: 500,
          transition: "all 0.3s ease",
          textDecoration: "none",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = "translateY(-1px)";
          e.currentTarget.style.boxShadow = "0 4px 8px rgba(0,123,255,0.3)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = "translateY(0)";
          e.currentTarget.style.boxShadow = "none";
        }}
      >
        <FaUser size={14} className="me-2" />
        Đăng nhập
      </Link>
    )}
  </div>
);

// Main Component
const NavBar: React.FC<NavBarProps> = ({ onCartIconClick }) => {
  const { isAuthenticated, currentUser, logout, loadingAuth } = useAuth();
  const navigate = useNavigate();

  const { categories, brands, loading: dataLoading } = useApiData();
  const { isOpen, handleMouseEnter, handleMouseLeave, closeDropdown } =
    useDropdown();

  const [searchTerm, setSearchTerm] = useState("");

  // Search handlers
  const handleSearchChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setSearchTerm(e.target.value);
    },
    []
  );

  const handleSearchSubmit = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter" && searchTerm.trim()) {
        navigate(`/products?search=${encodeURIComponent(searchTerm.trim())}`);
        setSearchTerm("");
      }
    },
    [searchTerm, navigate]
  );

  // Account handlers
  const handleLogout = useCallback(() => {
    logout();
    closeDropdown("account");
    navigate("/login");
  }, [logout, closeDropdown, navigate]);

  const handleGoToAccount = useCallback(() => {
    closeDropdown("account");
    navigate("/account");
  }, [closeDropdown, navigate]);

  return (
    <nav
      className="navbar navbar-expand-lg shadow-sm"
      style={NAVBAR_STYLES.navbar}
    >
      <div className="container-fluid px-4">
        <div className="d-flex justify-content-between align-items-center w-100">
          <Logo />

          {/* Navigation Links */}
          <div className="d-none d-lg-flex">
            <ul className="navbar-nav d-flex flex-row align-items-center">
              <NavLink to="/">Trang chủ</NavLink>

              <ProductAndBrandDropdowns
                categories={categories}
                brands={brands}
                isOpen={isOpen}
                handleMouseEnter={handleMouseEnter}
                handleMouseLeave={handleMouseLeave}
              />

              {NAV_LINKS.slice(1).map((link) => (
                <NavLink key={link.to} to={link.to}>
                  {link.label}
                </NavLink>
              ))}
            </ul>
          </div>

          {/* Right Section */}
          <div className="d-flex align-items-center">
            <SearchBar
              searchTerm={searchTerm}
              onSearchChange={handleSearchChange}
              onSearchSubmit={handleSearchSubmit}
            />

            <ActionIcons
              onCartClick={onCartIconClick}
              isAuthenticated={isAuthenticated}
              currentUser={currentUser}
              loadingAuth={loadingAuth}
              onLogout={handleLogout}
              onGoToAccount={handleGoToAccount}
              isAccountHovered={isOpen.account}
              onAccountMouseEnter={() => handleMouseEnter("account")}
              onAccountMouseLeave={() => handleMouseLeave("account")}
            />
          </div>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
