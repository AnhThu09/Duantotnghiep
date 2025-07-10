import { Add, Close, Info, LocalOffer, Remove } from '@mui/icons-material';
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Divider,
  IconButton,
  TextField,
  Typography,
} from '@mui/material';
import React, { useState } from 'react';

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

interface CartSummaryProps {
  items?: CartItem[];
  promoCodes?: PromoCode[];
  subtotal?: number;
  shippingFee?: number;
  discount?: number;
  total?: number;
}

const CartSummary: React.FC<CartSummaryProps> = ({
  items = [
    {
      id: '1',
      name: 'Bột Uống Dâu Tằm - Biotin Ngừa Rụng Tóc',
      price: 960000,
      quantity: 3,
      image:
        'https://images.pexels.com/photos/4110404/pexels-photo-4110404.jpeg?auto=compress&cs=tinysrgb&w=200',
    },
    {
      id: '2',
      name: 'Sữa rửa mặt tạo bọt Tà Tằm',
      price: 95000,
      quantity: 1,
      image:
        'https://images.pexels.com/photos/4465124/pexels-photo-4465124.jpeg?auto=compress&cs=tinysrgb&w=200',
    },
  ],
  promoCodes = [
    {
      code: 'MUA2TANG1',
      description: 'Mua 2 sản phẩm bất kỳ tặng 1 bột uống vitamin C cho mọi đơn hàng trên website',
    },
    {
      code: 'TANGTAYTRANG',
      description: 'Khi Mua Serum Tơ Tằm Tặng 1 Tẩy Trang Tơ Tằm',
    },
  ],
  subtotal = 960000,
  shippingFee = 25000,
  discount = 0,
  total = 985000,
}) => {
  const [selectedPromo, setSelectedPromo] = useState<string>('');
  const [couponCode, setCouponCode] = useState<string>('');
  const [itemQuantities, setItemQuantities] = useState<{ [key: string]: number }>(
    Object.fromEntries(items.map(item => [item.id, item.quantity]))
  );

  const handleQuantityChange = (itemId: string, newQuantity: number) => {
    if (newQuantity >= 1) {
      setItemQuantities(prev => ({ ...prev, [itemId]: newQuantity }));
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN').format(price) + 'đ';
  };

  return (
    <Card className="h-100" sx={{ borderRadius: 2, boxShadow: 3 }}>
      <CardContent sx={{ p: 3 }}>
        <Typography variant="h5" gutterBottom fontWeight="bold">
          Giỏ hàng của bạn
        </Typography>

        {/* Info Alert */}
        <Alert severity="info" sx={{ mb: 3 }}>
          <Box display="flex" alignItems="center" gap={1}>
            <Info fontSize="small" />
            <Typography variant="body2">
              Có {items.reduce((acc, item) => acc + itemQuantities[item.id], 0)} người đang thêm
              cùng sản phẩm giống bạn vào giỏ hàng. Mua ngay trước khi các sản phẩm này hết hàng
              nhé!
            </Typography>
          </Box>
        </Alert>

        <Alert severity="success" sx={{ mb: 3 }}>
          <Typography variant="body2">
            Nếu bạn muốn mua hàng với số lượng lớn, xin vui lòng liên hệ Hotline:{' '}
            <strong>1800644890</strong> hoặc Zalo: <strong>0968625511</strong>. Cảm ơn bạn!
          </Typography>
        </Alert>

        {/* Cart Items */}
        <Box sx={{ mb: 3 }}>
          {items.map(item => (
            <Card key={item.id} variant="outlined" sx={{ mb: 2, borderRadius: 2 }}>
              <CardContent sx={{ p: 2 }}>
                <div className="row align-items-center">
                  <div className="col-auto">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="rounded"
                      style={{ width: '60px', height: '60px', objectFit: 'cover' }}
                    />
                  </div>
                  <div className="col">
                    <div className="d-flex justify-content-between align-items-start">
                      <Typography variant="body2" fontWeight="medium">
                        {item.name}
                      </Typography>
                      <IconButton size="small" color="error">
                        <Close />
                      </IconButton>
                    </div>
                    <div className="d-flex justify-content-between align-items-center mt-2">
                      <Box display="flex" alignItems="center">
                        <IconButton
                          size="small"
                          onClick={() => handleQuantityChange(item.id, itemQuantities[item.id] - 1)}
                        >
                          <Remove />
                        </IconButton>
                        <Typography sx={{ mx: 2 }}>{itemQuantities[item.id]}</Typography>
                        <IconButton
                          size="small"
                          onClick={() => handleQuantityChange(item.id, itemQuantities[item.id] + 1)}
                        >
                          <Add />
                        </IconButton>
                      </Box>
                      <Typography color="primary" fontWeight="bold">
                        {formatPrice(item.price)}
                      </Typography>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </Box>

        {/* Hot Deals */}
        <Box sx={{ mb: 3 }}>
          <div className="d-flex justify-content-between align-items-center mb-3">
            <Chip label="Hot Deal" color="error" size="small" />
            <Typography variant="body2" fontWeight="medium">
              Mua kèm sản phẩm với giá ưu đãi
            </Typography>
          </div>

          <Card variant="outlined" sx={{ borderRadius: 2 }}>
            <CardContent sx={{ p: 2 }}>
              <div className="row align-items-center">
                <div className="col-auto">
                  <img
                    src="https://images.pexels.com/photos/4465124/pexels-photo-4465124.jpeg?auto=compress&cs=tinysrgb&w=200"
                    alt="Product"
                    className="rounded"
                    style={{ width: '50px', height: '50px', objectFit: 'cover' }}
                  />
                </div>
                <div className="col">
                  <Typography variant="body2" fontWeight="medium">
                    Sữa rửa mặt tạo bọt Tà Tằm
                  </Typography>
                  <Box display="flex" alignItems="center" gap={1} mt={1}>
                    <Typography
                      variant="body2"
                      sx={{ textDecoration: 'line-through' }}
                      color="text.secondary"
                    >
                      96.000đ
                    </Typography>
                    <Typography variant="body2" color="primary" fontWeight="bold">
                      95.000đ
                    </Typography>
                    <Chip label="-1%" color="error" size="small" />
                  </Box>
                </div>
                <div className="col-auto">
                  <Button variant="outlined" size="small">
                    Mua kèm
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </Box>

        {/* Promo Codes */}
        <Box sx={{ mb: 3 }}>
          <Box display="flex" alignItems="center" gap={1} mb={2}>
            <LocalOffer color="success" />
            <Typography variant="body2" fontWeight="medium">
              CHƯƠNG TRÌNH KHUYẾN MÃI
            </Typography>
            <Typography variant="caption" color="text.secondary">
              *Chọn 01 voucher
            </Typography>
          </Box>

          <div className="row g-2 mb-3">
            {promoCodes.map((promo, index) => (
              <div key={index} className="col-12 col-md-6">
                <Card
                  variant="outlined"
                  sx={{
                    cursor: 'pointer',
                    borderColor: selectedPromo === promo.code ? 'primary.main' : 'grey.300',
                    '&:hover': { borderColor: 'primary.main' },
                  }}
                  onClick={() => setSelectedPromo(promo.code)}
                >
                  <CardContent sx={{ p: 2 }}>
                    <Typography variant="body2" fontWeight="bold">
                      {promo.code}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {promo.description}
                    </Typography>
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>

          <div className="row g-2">
            <div className="col-8">
              <TextField
                fullWidth
                size="small"
                placeholder="Mã giảm giá"
                value={couponCode}
                onChange={e => setCouponCode(e.target.value)}
              />
            </div>
            <div className="col-4">
              <Button fullWidth variant="outlined" size="medium">
                Áp dụng
              </Button>
            </div>
          </div>
        </Box>

        {/* Order Summary */}
        <Box>
          <Divider sx={{ mb: 2 }} />
          <Box display="flex" justifyContent="space-between" mb={1}>
            <Typography variant="body2">Tổng giá trị đơn:</Typography>
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
            <Typography variant="body2" fontWeight="medium">
              {formatPrice(discount)}
            </Typography>
          </Box>
          <Divider sx={{ mb: 2 }} />
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Typography variant="h6" fontWeight="bold">
              Tổng thanh toán:
            </Typography>
            <Box textAlign="right">
              <Typography variant="h5" fontWeight="bold" color="primary">
                {formatPrice(total)}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Tiết kiệm
              </Typography>
            </Box>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};

export default CartSummary;
