
import { useState, useEffect } from 'react'; // Xóa 'React,' khỏi đây
import axios from 'axios';
import { useParams } from 'react-router-dom';
import '../css/ProductsWeLove.css';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';

// ✅ KHAI BÁO INTERFACE
interface Category {
  category_id: number;
  category_name: string;
  slug: string;
}

interface Product {
  product_id: number;
  name: string;
  thumbnail: string;
  price: number;
  short_description: string;
  rating?: number;
}

const BASE_URL = 'http://localhost:3000/api';
const UPLOADS_BASE_URL = 'http://localhost:3000/uploads/';
const TABS_TO_DISPLAY = ['serum', 'kem-duong-am', 'cham-soc-da'];

export default function ProductByCategory() {
  const { slug: urlSlug } = useParams();
  const [categories, setCategories] = useState<Category[]>([]); 
  const [products, setProducts] = useState<Product[]>([]);
  const [activeCategorySlug, setActiveCategorySlug] = useState<string | undefined>(urlSlug);
  const [alert, setAlert] = useState({ open: false, message: '', severity: 'success' });

  // ✅ Giả sử bạn có user_id từ state hoặc context. Thay đổi giá trị này bằng user_id thật
  const user_id = 1; // <--- HÃY THAY THẾ ID NÀY BẰNG ID CỦA NGƯỜI DÙNG ĐĂNG NHẬP

  // Fetch categories
  useEffect(() => {
    axios.get(`${BASE_URL}/categories`)
      .then(res => {
        const filteredCategories = res.data.filter((cat: Category) =>
          TABS_TO_DISPLAY.includes(cat.slug)
        );
        setCategories(filteredCategories);
      })
      .catch(err => console.error('Lỗi khi lấy danh sách danh mục:', err));
  }, []);

  // Fetch products based on slug
  useEffect(() => {
    setActiveCategorySlug(urlSlug);
    if (urlSlug) {
      axios.get(`${BASE_URL}/products/category/${urlSlug}`)
        .then(res => {
          console.log(`✅ Đã lấy sản phẩm cho slug: ${urlSlug}`, res.data);
          setProducts(res.data);
        })
        .catch(err => {
          console.error(`❌ Lỗi khi lấy sản phẩm cho slug: ${urlSlug}`, err);
          setProducts([]);
        });
    }
  }, [urlSlug]);

  // Handle tab click
  const fetchProductsByTab = (tabSlug: string) => {
    setActiveCategorySlug(tabSlug);
    axios.get(`${BASE_URL}/products/category/${tabSlug}`)
      .then(res => {
        console.log(`✅ Đã lấy sản phẩm cho tab: ${tabSlug}`, res.data);
        setProducts(res.data);
      })
      .catch(err => {
        console.error(`❌ Lỗi khi lấy sản phẩm cho tab: ${tabSlug}`, err);
        setProducts([]);
      });
  };

  // ✅ HÀM XỬ LÝ THÊM VÀO GIỎ HÀNG
  const handleAddToCart = async (product: Product) => {
    if (!user_id) {
        setAlert({ open: true, message: '❌ Vui lòng đăng nhập để thêm sản phẩm vào giỏ hàng!', severity: 'warning' });
        return;
    }
    try {
        const response = await axios.post(`${BASE_URL}/cart`, {
            user_id: user_id,
            product_id: product.product_id,
            quantity: 1 // Thêm 1 sản phẩm vào giỏ
        });
        setAlert({ open: true, message: response.data.message, severity: 'success' });
        console.log('Phản hồi từ server:', response.data);
    } catch (error) {
        console.error('Lỗi khi thêm vào giỏ hàng:', error);
        setAlert({ open: true, message: '❌ Thêm vào giỏ hàng thất bại. Vui lòng thử lại.', severity: 'error' });
    }
  };
  
  // ✅ HÀM XỬ LÝ THÊM VÀO YÊU THÍCH (Ví dụ)
  const handleAddToFavorites = (product: Product) => {
      setAlert({ open: true, message: `✅ Đã thêm '${product.name}' vào danh sách yêu thích!`, severity: 'info' });
      // Thêm logic API để lưu vào database tại đây
  };

  const handleCloseAlert = () => setAlert({ ...alert, open: false });

  return (
    <div className="products-we-love-container">
      <h2 className="section-title">CHĂM SÓC DA HIỆU QUẢ</h2>
      
      <div className="tab-navigation">
        {categories.map((cat) => (
          <button
            key={cat.slug}
            className={`tab-button ${cat.slug === activeCategorySlug ? 'active' : ''}`}
            onClick={() => fetchProductsByTab(cat.slug)}
          >
            {cat.category_name}
          </button>
        ))}
      </div>

      <div className="product-grid">
        {products.length === 0 ? (
          <p>Không có sản phẩm nào thuộc danh mục này.</p>
        ) : (
          products.map(product => (
            <div key={product.product_id} className="product-card">
              {product.rating && product.rating >= 4.5 && (
                <span className="product-badge">BESTSELLER</span>
              )}
              
              <div className="product-image-container">
                <img src={`${UPLOADS_BASE_URL}${product.thumbnail}`} alt={product.name} className="product-image" />
              </div>

              <div className="product-info">
                <h3 className="product-name">{product.name}</h3>
                
                {product.rating && (
                  <div className="product-rating">
                    <span className="stars">
                      {'★'.repeat(Math.floor(product.rating))}
                      {'☆'.repeat(5 - Math.floor(product.rating))}
                    </span>
                    <span className="rating-value">{product.rating}</span>
                  </div>
                )}
                
                {/* GIÁ VÀ ICON BUTTONS */}
                <div className="product-actions">
                  <span className="product-price">
                    {Number(product.price).toLocaleString('vi-VN')} đ
                  </span>
                  <div className="icon-buttons">
                    <FavoriteBorderIcon
                      onClick={() => handleAddToFavorites(product)}
                      sx={{ cursor: 'pointer', color: '#888', '&:hover': { color: '#ff4081' } }}
                    />
                    <AddShoppingCartIcon
                      onClick={() => handleAddToCart(product)}
                      sx={{ cursor: 'pointer', color: '#888', '&:hover': { color: '#5eab5a' } }}
                    />
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Snackbar Alert */}
      <Snackbar open={alert.open} autoHideDuration={3000} onClose={handleCloseAlert}>
        <Alert onClose={handleCloseAlert} severity={alert.severity as any} sx={{ width: '100%' }}>
          {alert.message}
        </Alert>
      </Snackbar>
    </div>
  );
}