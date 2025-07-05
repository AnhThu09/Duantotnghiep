// 📁 server/routes/favoriteRoutes.js

import express from 'express';
import {
  getFavoriteProducts,
  addFavoriteProduct,
  removeFavoriteProduct
} from '../controllers/favoriteController.js';

const favoriteRoutes = express.Router();

// Lấy danh sách yêu thích của một người dùng cụ thể
favoriteRoutes.get('/:userId', getFavoriteProducts);

// Thêm sản phẩm vào danh sách yêu thích
favoriteRoutes.post('/', addFavoriteProduct); // Body: { user_id, product_id }

// Xóa sản phẩm khỏi danh sách yêu thích
favoriteRoutes.delete('/:userId/:productId', removeFavoriteProduct);

export default favoriteRoutes;