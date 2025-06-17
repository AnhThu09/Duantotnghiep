// routes/cart.js
import express from 'express';
import {
  getCartItems,
  addToCart,
  updateCartItem,
  deleteCartItem,
  clearCart
} from '../controllers/cartController.js';

const Cartrouter = express.Router();

Cartrouter.get('/:userId', getCartItems);
Cartrouter.post('/add', addToCart);
Cartrouter.put('/update/:cartItemId', updateCartItem);
Cartrouter.delete('/delete/:cartItemId', deleteCartItem);
Cartrouter.delete('/clear/:userId', clearCart);

export default Cartrouter;
