import express from 'express';
import { authMiddleware } from '../middlewares/authMiddleware.js';
import {
    getFavoriteProducts,
    addFavoriteProduct,
    removeFavoriteProduct
} from '../controllers/favoriteProductsController.js';

const favoriteProductsRoutes = express.Router();

// GET: Lấy danh sách sản phẩm yêu thích
favoriteProductsRoutes.get('/', getFavoriteProducts);

// POST: Thêm sản phẩm yêu thích
favoriteProductsRoutes.post('/', addFavoriteProduct);

// DELETE: Xóa sản phẩm yêu thích
favoriteProductsRoutes.delete('/:product_id', removeFavoriteProduct);

export default favoriteProductsRoutes;
