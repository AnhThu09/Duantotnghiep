// 📁 routes/productRoutes.js
import express from 'express';
import {
  getAllProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  getProductsByCategorySlug,
  getProductsByBrandSlug
} from '../controllers/productController.js';
import upload from '../middlewares/upload.js';

const router = express.Router();

// Thống nhất sử dụng route gốc: /api/products
router.get('/category/:slug', getProductsByCategorySlug);
router.get('/brand/:slug', getProductsByBrandSlug);
router.get('/', getAllProducts);
router.post('/', upload.single('thumbnail'), createProduct);
router.put('/:id', upload.single('thumbnail'), updateProduct);
router.delete('/:id', deleteProduct);

export default router;
