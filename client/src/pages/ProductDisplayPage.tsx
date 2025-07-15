import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Box, Typography, Paper, useTheme, CircularProgress, IconButton } from '@mui/material';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ShoppingCartOutlinedIcon from '@mui/icons-material/ShoppingCartOutlined';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext'; // Dùng context giỏ hàng
import { toast } from 'sonner'; // Dùng sonner để thông báo

// --- INTERFACES ---
// ✅ CẬP NHẬT: Interface Product trong ProductDisplayPage để khớp với Product trong CartContext
// CartContext có Product { id, name, price, discount_price, image, brand }
interface Product {
  product_id: number; // Đây là ID từ DB
  name: string;
  price: number;
  thumbnail: string; // Tên file ảnh từ DB
  description: string; // Thêm nếu bạn fetch nó
  brand_id?: number; // Thêm nếu bạn fetch nó
  brand?: string; // Tên thương hiệu (sẽ dùng trong CartContext)
  discount_price?: number; // Nếu có giảm giá
  rating?: number; // Để tương thích với hiển thị
  reviews?: number; // Để tương thích với hiển thị

  // ✅ Bổ sung 'id' và 'image' để Product này khớp với CartContext.Product interface
  // Hoặc bạn có thể ánh xạ nó trong handleAddToCart
  id: number; // Sẽ gán bằng product_id
  image: string; // Sẽ gán bằng URL đầy đủ của thumbnail
}

// --- CONFIG ---
const API_BASE_URL = 'http://localhost:3000/api';
const UPLOADS_BASE_URL = 'http://localhost:3000/uploads/';

// --- COMPONENT ProductCard --- (Không thay đổi nhiều, chỉ nhận props)
interface ProductCardProps {
  product: Product;
  onAddToCart: (e: React.MouseEvent) => void;
  onToggleFavorite: (e: React.MouseEvent) => void;
  isFavorite: boolean;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onAddToCart, onToggleFavorite, isFavorite }) => {
  return (
    <Paper
      sx={{
        p: 2, minHeight: '400px', display: 'flex', flexDirection: 'column',
        borderRadius: '8px', boxShadow: 'rgba(0, 0, 0, 0.05) 0px 1px 2px 0px',
        '&:hover': { boxShadow: 'rgba(0, 0, 0, 0.1) 0px 4px 12px' },
      }}
    >
      <Box sx={{ width: '100%', height: '250px', overflow: 'hidden', mb: 1.2}}>
        <img
          src={`${UPLOADS_BASE_URL}${product.thumbnail}`} // Dùng thumbnail trực tiếp
          alt={product.name}
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
      </Box>
      <Typography variant="subtitle1" sx={{ fontWeight: 'bold', textAlign: 'start', mb: 2, minHeight: '2.6em' }}>
        {product.name}
      </Typography>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 'auto' }}>
        <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
          {Number(product.price).toLocaleString('vi-VN')}₫
        </Typography>
        <Box>
          <IconButton onClick={onToggleFavorite}>
            {isFavorite ? <FavoriteIcon sx={{color: 'black'}}/> : <FavoriteBorderIcon />}
          </IconButton>
          <IconButton onClick={onAddToCart}>
            <ShoppingCartOutlinedIcon />
          </IconButton>
        </Box>
      </Box>
    </Paper>
  );
};


// --- MAIN COMPONENT ---
export default function ProductDisplayPage() {
  const theme = useTheme();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const { currentUser } = useAuth();
  const { addItem } = useCart(); // Lấy hàm addItem từ context
  const user_id = currentUser?.user_id;
  const navigate = useNavigate();

  const [userFavorites, setUserFavorites] = useState<Set<number>>(new Set());

  const fetchInitialData = useCallback(async () => {
    setLoading(true);
    try {
      const productPromise = axios.get(`${API_BASE_URL}/products`);
      const favoritePromise = user_id ? axios.get(`${API_BASE_URL}/favorites/${user_id}`) : Promise.resolve({ data: [] });
      
      const [productResponse, favoriteResponse] = await Promise.all([productPromise, favoritePromise]);
      
      // ✅ Ánh xạ dữ liệu sản phẩm từ API để khớp với Product interface mới
      const loadedProducts: Product[] = productResponse.data.map((p: any) => ({
        product_id: p.product_id,
        name: p.name,
        price: Number(p.price), // Đảm bảo price là number
        thumbnail: p.thumbnail || '', // Đảm bảo thumbnail có giá trị
        description: p.description || '',
        brand_id: p.brand_id,
        brand: p.brand_name || '', // Lấy brand_name từ DB nếu bạn JOIN
        rating: p.rating ?? 0,
        reviews: p.reviews ?? 0,
        discount_price: p.discount_price ? Number(p.discount_price) : undefined,
        // ✅ THÊM id và image để khớp với CartContext.Product
        id: p.product_id, // Gán id bằng product_id
        image: `${UPLOADS_BASE_URL}${p.thumbnail}` // Tạo đường dẫn đầy đủ
      }));
      setProducts(loadedProducts);
      setUserFavorites(new Set(favoriteResponse.data.map((fav: { product_id: number }) => fav.product_id)));
    } catch (err) {
      setError('Không thể tải dữ liệu.');
    } finally {
      setLoading(false);
    }
  }, [user_id]);

  useEffect(() => {
    fetchInitialData();
  }, [fetchInitialData]);

  // ✅ CẬP NHẬT: handleAddToCart
  const handleAddToCart = async (product: Product) => { // Product ở đây là Product interface của ProductDisplayPage
    if (!user_id) {
      toast.error('Vui lòng đăng nhập để thêm vào giỏ hàng!');
      setTimeout(() => navigate('/login'), 1000);
      return;
    }
    
    // ✅ TRUYỀN TOÀN BỘ ĐỐI TƯỢNG product VÀO addItem
    // Product ở đây đã được ánh xạ để có id, image, thumbnail, brand, etc.
    await addItem(product); // Product này giờ đã khớp với Product của CartContext
    toast.success(`Đã thêm '${product.name}' vào giỏ hàng!`);
  };

  const handleToggleFavorite = async (product: Product) => {
    if (!user_id) {
      toast.error('Vui lòng đăng nhập!');
      return;
    }
    const isCurrentlyFavorite = userFavorites.has(product.product_id);
    // Optimistic UI update
    setUserFavorites(prev => {
        const newSet = new Set(prev);
        if(isCurrentlyFavorite) newSet.delete(product.product_id);
        else newSet.add(product.product_id);
        return newSet;
    });

    try {
        if(isCurrentlyFavorite) {
            await axios.delete(`${API_BASE_URL}/favorites/${user_id}/${product.product_id}`);
            toast.info(`Đã xóa '${product.name}' khỏi yêu thích.`);
        } else {
            await axios.post(`${API_BASE_URL}/favorites`, { user_id, product_id: product.product_id });
            toast.success(`Đã thêm '${product.name}' vào yêu thích.`);
        }
    } catch(err) {
        toast.error("Có lỗi xảy ra, vui lòng thử lại.");
        // Rollback UI
        setUserFavorites(prev => {
            const newSet = new Set(prev);
            if(isCurrentlyFavorite) newSet.add(product.product_id);
            else newSet.delete(product.product_id);
            return newSet;
        });
    }
  };

  const displayedProducts = useMemo(() => products.slice(0, 8), [products]);

  if (loading) return <Box sx={{ display: 'flex', justifyContent: 'center', py: 5 }}><CircularProgress /></Box>;
  if (error) return <Box sx={{ p: 4, textAlign: 'center', color: 'error.main' }}><Typography>{error}</Typography></Box>;

  return (
    <Box sx={{ p: { xs: 2, md: 4 }, backgroundColor: theme.palette.background.default }}>
      <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 3, textAlign: 'center' }}>
        SẢN PHẨM BÁN CHẠY
      </Typography>
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' }, gap: 3 }}>
        {displayedProducts.map((product) => (
          <Link
            key={product.product_id}
            to={`/products/${product.product_id}`}
            style={{ textDecoration: 'none', color: 'inherit' }}
          >
            <ProductCard
              product={product}
              onAddToCart={(e) => { e.preventDefault(); e.stopPropagation(); handleAddToCart(product); }}
              onToggleFavorite={(e) => { e.preventDefault(); e.stopPropagation(); handleToggleFavorite(product); }}
              isFavorite={userFavorites.has(product.product_id)}
            />
          </Link>
        ))}
      </Box>
    </Box>
  );
}