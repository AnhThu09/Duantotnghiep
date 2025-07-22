// src/components/ProductSearch.tsx

import React, { useState, useEffect, useCallback } from 'react';
import { getAllProduct } from '../api/productAPI.js';
import ProductCard from './ProductCard'; 
import { Product } from '../types'; // Import interface Product

// Import Box và Grid từ Material UI để bố cục sản phẩm tốt hơn
import { Box, TextField, Button, CircularProgress, Typography, Grid } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';

function ProductSearch() {
  const [searchTerm, setSearchTerm] = useState<string>(''); // Từ khóa người dùng nhập
  const [allProducts, setAllProducts] = useState<Product[]>([]); // Tất cả sản phẩm tải về từ API
  const [displayedProducts, setDisplayedProducts] = useState<Product[]>([]); // Sản phẩm hiển thị sau khi lọc
  const [loading, setLoading] = useState<boolean>(false); // Trạng thái tải dữ liệu
  const [error, setError] = useState<string | null>(null); // Thông báo lỗi

  // --- Effect 1: Tải tất cả sản phẩm khi component mount ---
  useEffect(() => {
    const fetchInitialProducts = async () => {
      setLoading(true);
      setError(null); // Reset lỗi trước khi tải
      try {
        const data = await getAllProducts(); // Gọi hàm API để lấy tất cả SP
        setAllProducts(data); // Lưu vào state allProducts
        setDisplayedProducts(data); // Ban đầu, hiển thị tất cả SP
      } catch (err: any) { 
        setError(err.message || "Không thể tải danh sách sản phẩm.");
        console.error("Lỗi khi tải sản phẩm ban đầu:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchInitialProducts();
  }, []); // Mảng rỗng đảm bảo effect chỉ chạy 1 lần khi component mount

  // --- Hàm lọc sản phẩm (chạy phía client) ---
  const filterProducts = useCallback(() => {
    // Nếu từ khóa tìm kiếm rỗng, hiển thị tất cả sản phẩm gốc
    if (!searchTerm.trim()) {
      setDisplayedProducts(allProducts);
      return;
    }

    const lowercasedSearchTerm = searchTerm.trim().toLowerCase();
    
    // Lọc mảng allProducts
    const filtered = allProducts.filter(product => {
      // Đảm bảo các trường tồn tại trước khi gọi .toLowerCase() và .includes()
      const productName = product.name?.toLowerCase() || '';
      const shortDescription = product.short_description?.toLowerCase() || '';
      const description = product.description?.toLowerCase() || '';

      return (
        productName.includes(lowercasedSearchTerm) ||
        shortDescription.includes(lowercasedSearchTerm) ||
        description.includes(lowercasedSearchTerm)
      );
    });
    setDisplayedProducts(filtered); // Cập nhật sản phẩm hiển thị
  }, [searchTerm, allProducts]); // Hàm này sẽ được tạo lại khi searchTerm hoặc allProducts thay đổi

  // --- Effect 2: Chạy hàm lọc mỗi khi searchTerm thay đổi (có debounce) ---
  useEffect(() => {
    const handler = setTimeout(() => {
      filterProducts();
    }, 300); // 300ms độ trễ sau khi người dùng ngừng gõ

    // Cleanup function: hủy timeout nếu component re-render hoặc unmount trước khi timeout hết hạn
    return () => {
      clearTimeout(handler);
    };
  }, [searchTerm, filterProducts]); // Effect chạy khi searchTerm hoặc filterProducts thay đổi

  // --- Hàm xử lý khi người dùng nhấn nút Tìm kiếm hoặc Enter ---
  const handleManualSearch = () => {
    filterProducts(); // Chỉ cần gọi hàm lọc
  };

  // --- Dummy functions for ProductCard props (implement your actual logic later) ---
  const handleAddToCart = (productId: string) => {
    console.log(`Thêm sản phẩm ${productId} vào giỏ hàng`);
    // TODO: Implement your add to cart logic, e.g., dispatching to a Redux store or Context
  };

  const handleToggleFavorite = (productId: string) => {
    console.log(`Chuyển trạng thái yêu thích cho sản phẩm ${productId}`);
    // TODO: Implement your favorite toggle logic
  };

  const checkIsFavorite = (productId: string): boolean => {
    // TODO: Implement your logic to check if a product is a favorite
    // For now, let's return a dummy value (e.g., true for product_id ending in '1')
    return productId.endsWith('1'); 
  };


  return (
    <Box sx={{ p: 3, maxWidth: 1200, margin: '20px auto', bgcolor: '#f9f9f9', borderRadius: '10px', boxShadow: 3 }}>
      <Typography variant="h4" component="h1" align="center" gutterBottom sx={{ mb: 4, color: '#333' }}>
        Tìm kiếm sản phẩm
      </Typography>
      
      <Box sx={{ display: 'flex', justifyContent: 'center', mb: 4 }}>
        <TextField
          id="searchInput"
          label="Tìm kiếm sản phẩm..."
          variant="outlined"
          fullWidth
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyPress={(e) => {
            if (e.key === 'Enter') {
              handleManualSearch(); 
            }
          }}
          sx={{ mr: 2, '& .MuiOutlinedInput-root': { borderRadius: '25px' } }}
        />
        <Button 
          variant="contained"
          size="large"
          startIcon={<SearchIcon />}
          onClick={handleManualSearch} 
          sx={{ borderRadius: '25px', px: 4 }}
        >
          Tìm kiếm
        </Button>
      </Box>

      {/* Hiển thị thông báo trạng thái */}
      {loading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 3 }}>
          <CircularProgress />
          <Typography variant="body1" sx={{ ml: 2, color: '#555' }}>Đang tải sản phẩm...</Typography>
        </Box>
      )}
      {error && (
        <Typography variant="body1" color="error" align="center" sx={{ fontWeight: 'bold', py: 3 }}>
          Lỗi: {error}
        </Typography>
      )}

      {/* Hiển thị kết quả tìm kiếm hoặc thông báo */}
      <Grid container spacing={3} justifyContent="center">
        {!loading && !error && displayedProducts.length > 0 ? (
          displayedProducts.map(product => (
            <Grid item key={product.product_id}>
              <ProductCard 
                product={product} 
                onAddToCart={handleAddToCart} // Truyền hàm xử lý thêm vào giỏ
                onToggleFavorite={handleToggleFavorite} // Truyền hàm xử lý yêu thích
                isFavorite={checkIsFavorite(product.product_id)} // Truyền trạng thái yêu thích
              />
            </Grid>
          ))
        ) : (
          !loading && !error && (
            searchTerm.trim() ? (
              <Grid item xs={12}>
                <Typography variant="body1" align="center" sx={{ color: '#888', py: 3 }}>
                  Không tìm thấy sản phẩm nào phù hợp với từ khóa "<strong>{searchTerm}</strong>".
                </Typography>
              </Grid>
            ) : (
              <Grid item xs={12}>
                <Typography variant="body1" align="center" sx={{ color: '#888', py: 3 }}>
                  Nhập từ khóa để tìm kiếm sản phẩm.
                </Typography>
              </Grid>
            )
          )
        )}
      </Grid>
    </Box>
  );
}

export default ProductSearch;