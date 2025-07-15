// CartSummary.tsx
import { Add, Close, LocalOffer, Remove } from '@mui/icons-material';
import {
  Box,
  Button,
  Card,
  CardContent,
  Divider,
  IconButton,
  TextField,
  Typography,
} from '@mui/material';
import React, { useState } from 'react';

// Giữ nguyên các interface
interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

interface PromoCode {
  code: string;
  description: string;
}

// ✨ Cập nhật props interface để component linh hoạt hơn
interface CartSummaryProps {
  items: CartItem[];
  promoCodes?: PromoCode[];
  subtotal: number;
  shippingFee: number;
  discount: number;
  total: number;
  onUpdateQuantity: (itemId: string, newQuantity: number) => void;
  onRemoveItem: (itemId: string) => void;
  onApplyCoupon: (couponCode: string) => void;
}

const CartSummary: React.FC<CartSummaryProps> = ({
  items, // Không dùng giá trị mặc định nữa
  promoCodes = [],
  subtotal,
  shippingFee,
  discount,
  total,
  onUpdateQuantity,
  onRemoveItem,
  onApplyCoupon,
}) => {
  const [selectedPromo, setSelectedPromo] = useState<string>('');
  const [couponCode, setCouponCode] = useState<string>('');

  const handleQuantityChange = (itemId: string, newQuantity: number) => {
    if (newQuantity >= 0) { // Cho phép giảm về 0 để xóa
      onUpdateQuantity(itemId, newQuantity);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN').format(price) + 'đ';
  };
  
  // ✨ Xử lý khi giỏ hàng trống
  if (!items || items.length === 0) {
    return (
      <Card sx={{ borderRadius: 2, boxShadow: 3, p: 2 }}>
        <CardContent>
          <Typography variant="h5" gutterBottom fontWeight="bold">
            Giỏ hàng của bạn
          </Typography>
          <Typography sx={{ mt: 4, textAlign: 'center', color: 'text.secondary' }}>
            Giỏ hàng của bạn đang trống.
          </Typography>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card sx={{ mt: 10, borderRadius: 2, boxShadow: 3 }}>
      <CardContent sx={{ p: { xs: 2, md: 3 } }}>
        <Typography variant="h5" gutterBottom fontWeight="bold">
          Giỏ hàng của bạn ({items.reduce((acc, item) => acc + item.quantity, 0)})
        </Typography>
        <Divider sx={{ my: 2 }} />

        {/* Danh sách sản phẩm trong giỏ hàng */}
        <Box sx={{ mb: 3, maxHeight: '400px', overflowY: 'auto', pr: 1 }}>
          {items.map(item => (
            <Card key={item.id} variant="outlined" sx={{ mb: 2, borderRadius: 2 }}>
              <CardContent sx={{ p: 2, display: 'flex', alignItems: 'center', gap: 2 }}>
                <img
                  src={item.image}
                  alt={item.name}
                  style={{ width: '60px', height: '60px', objectFit: 'cover', borderRadius: '8px' }}
                />
                <Box sx={{ flexGrow: 1 }}>
                  <Typography variant="body2" fontWeight="medium" sx={{ mb: 1 }}>
                    {item.name}
                  </Typography>
                  <Box display="flex" justifyContent="space-between" alignItems="center">
                    <Box display="flex" alignItems="center" border={1} borderColor="grey.300" borderRadius={1}>
                      <IconButton
                        size="small"
                        onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                      >
                        <Remove fontSize="small" />
                      </IconButton>
                      <Typography sx={{ mx: 1.5, fontSize: '14px' }}>{item.quantity}</Typography>
                      <IconButton
                        size="small"
                        onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                      >
                        <Add fontSize="small" />
                      </IconButton>
                    </Box>
                    <Typography color="primary" fontWeight="bold">
                      {formatPrice(item.price * item.quantity)}
                    </Typography>
                  </Box>
                </Box>
                 <IconButton size="small" onClick={() => onRemoveItem(item.id)} sx={{ alignSelf: 'flex-start' }}>
                    <Close />
                </IconButton>
              </CardContent>
            </Card>
          ))}
        </Box>

        {/* Mã giảm giá */}
        <Box sx={{ mb: 3 }}>
          <Box display="flex" alignItems="center" gap={1} mb={2}>
            <LocalOffer color="success" />
            <Typography variant="body2" fontWeight="medium">
              Mã giảm giá
            </Typography>
          </Box>
          <Box display="flex" gap={2}>
            <TextField
              fullWidth
              size="small"
              placeholder="Nhập mã giảm giá"
              value={couponCode}
              onChange={e => setCouponCode(e.target.value)}
            />
            <Button 
              variant="contained" 
              onClick={() => onApplyCoupon(couponCode)}
              sx={{ whiteSpace: 'nowrap' }}
            >
              Áp dụng
            </Button>
          </Box>
        </Box>

        {/* Tóm tắt đơn hàng */}
        <Box>
          <Divider sx={{ mb: 2 }} />
          <Box display="flex" justifyContent="space-between" mb={1}>
            <Typography variant="body2">Tạm tính:</Typography>
            <Typography variant="body2" fontWeight="medium">
              {formatPrice(subtotal)}
            </Typography>
          </Box>
          <Box display="flex" justifyContent="space-between" mb={1}>
            <Typography variant="body2">Phí giao hàng:</Typography>
            <Typography variant="body2" fontWeight="medium">
              {formatPrice(shippingFee)}
            </Typography>
          </Box>
          <Box display="flex" justifyContent="space-between" mb={2}>
            <Typography variant="body2">Giảm giá:</Typography>
            <Typography variant="body2" fontWeight="medium" color="error">
              -{formatPrice(discount)}
            </Typography>
          </Box>
          <Divider sx={{ mb: 2 }} />
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Typography variant="h6" fontWeight="bold">
              Tổng cộng:
            </Typography>
            <Typography variant="h5" fontWeight="bold" color="primary">
              {formatPrice(total)}
            </Typography>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};

export default CartSummary;