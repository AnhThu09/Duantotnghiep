// routes/cart.js
import express from 'express';
import {
  getCartItems,
  addToCart,
  updateCartItem,
  deleteCartItem,
  clearCart
} from '../controllers/cartController.js';

const cartRoutes = express.Router();

cartRoutes.get('/:userId', getCartItems);
cartRoutes.post('/add', addToCart);
cartRoutes.put('/update/:cartItemId', updateCartItem);
cartRoutes.delete('/delete/:cartItemId', deleteCartItem);
cartRoutes.delete('/clear/:userId', clearCart);

export default cartRoutes;
