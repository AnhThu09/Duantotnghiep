import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import { IconButton, Button } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import DeleteIcon from '@mui/icons-material/Delete';
import { useNavigate } from 'react-router-dom';
import '../css/CartSidebar.css';

interface CartItem {
  product_id: number;
  name: string;
  price: number;
  quantity: number;
  thumbnail: string;
}

interface CartSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const BASE_URL = 'http://localhost:3000/api';
const UPLOADS_BASE_URL = 'http://localhost:3000/uploads/';
const DUMMY_USER_ID = 1;

export default function CartSidebar({ isOpen, onClose }: CartSidebarProps) {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const navigate = useNavigate(); // ✅

  const fetchCartItems = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/cart/${DUMMY_USER_ID}`);
      setCartItems(res.data);
      console.log('✅ Đã lấy dữ liệu giỏ hàng:', res.data);
    } catch (err) {
      console.error('❌ Lỗi khi fetch giỏ hàng:', err);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchCartItems();
    }
  }, [isOpen]);

  const handleUpdateQuantity = async (productId: number, newQuantity: number) => {
    if (newQuantity < 1) return;
    try {
      await axios.put(`${BASE_URL}/cart/${DUMMY_USER_ID}/${productId}`, { quantity: newQuantity });
      setCartItems(prevItems =>
        prevItems.map(item =>
          item.product_id === productId ? { ...item, quantity: newQuantity } : item
        )
      );
    } catch (err) {
      console.error('Lỗi khi cập nhật số lượng:', err);
    }
  };

  const handleRemoveItem = async (productId: number) => {
    if (window.confirm('Bạn có chắc muốn xoá sản phẩm này khỏi giỏ hàng?')) {
      try {
        await axios.delete(`${BASE_URL}/cart/${DUMMY_USER_ID}/${productId}`);
        setCartItems(prevItems => prevItems.filter(item => item.product_id !== productId));
      } catch (err) {
        console.error('Lỗi khi xoá sản phẩm:', err);
      }
    }
  };

  const subtotal = useMemo(() => {
    return cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
  }, [cartItems]);

  return (
    <>
      <div className={`cart-overlay ${isOpen ? 'open' : ''}`} onClick={onClose}></div>

      <div className={`cart-sidebar ${isOpen ? 'open' : ''}`}>
        <div className="cart-header">
          <h3>Giỏ hàng ({cartItems.length})</h3>
          <IconButton onClick={onClose}><CloseIcon /></IconButton>
        </div>

        <div className="cart-items">
          {cartItems.length === 0 ? (
            <p className="empty-cart-message">Giỏ hàng của bạn đang trống.</p>
          ) : (
            cartItems.map(item => (
              <div key={item.product_id} className="cart-item">
                <img src={`${UPLOADS_BASE_URL}${item.thumbnail}`} alt={item.name} className="item-image" />
                <div className="item-details">
                  <div className="item-name">{item.name}</div>
                  <div className="item-price">{item.price.toLocaleString('vi-VN')} đ</div>
                  <div className="quantity-controls">
                    <IconButton onClick={() => handleUpdateQuantity(item.product_id, item.quantity - 1)}><RemoveIcon fontSize="small" /></IconButton>
                    <span className="quantity-value">{item.quantity}</span>
                    <IconButton onClick={() => handleUpdateQuantity(item.product_id, item.quantity + 1)}><AddIcon fontSize="small" /></IconButton>
                  </div>
                </div>
                <div className="item-actions">
                  <IconButton onClick={() => handleRemoveItem(item.product_id)}><DeleteIcon fontSize="small" /></IconButton>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="cart-footer">
          <div className="subtotal">
            <span>Tạm tính</span>
            <span className="subtotal-price">{subtotal.toLocaleString('vi-VN')} đ</span>
          </div>
          <Button
            variant="contained"
            className="checkout-button"
            onClick={() => {
              onClose();
              navigate('/checkout');
            }}
          >
            Thanh toán
          </Button>
        </div>
      </div>
    </>
  );
}
