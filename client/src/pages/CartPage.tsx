// src/pages/CartPage.tsx

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useCart } from '../context/CartContext';
import CartSummary from '../components/CartSummary';
import CustomerForm, { type CustomerFormData } from '../components/CustomerForm'; // ✅ Import
import { toast } from 'sonner';
import { Box, Grid } from '@mui/material';

export default function CartPage() {
  const { state: cartState, updateQuantity, removeItem } = useCart();
  
  // State cho việc tính toán
  const [shippingFee, setShippingFee] = useState(0);
  const [discount, setDiscount] = useState(0);
  const [total, setTotal] = useState(0);
  
  // ✅ State mới để lưu dữ liệu từ CustomerForm
  const [customerInfo, setCustomerInfo] = useState<CustomerFormData | null>(null);

  // ✅ Hàm mới để nhận dữ liệu từ CustomerForm
  const handleFormChange = (data: CustomerFormData) => {
    setCustomerInfo(data);
  };
  
  // Logic áp dụng coupon giữ nguyên
  const handleApplyCoupon = async (couponCode: string) => {
    if (!couponCode) {
      toast.error('Vui lòng nhập mã giảm giá.');
      return;
    }
    try {
      const response = await axios.post('http://localhost:3000/api/discounts/apply', {
        code: couponCode,
        order_value: cartState.total,
      });
      setDiscount(response.data.discounted_by);
      toast.success(response.data.message);
    } catch (error: any) {
      setDiscount(0);
      toast.error(error.response?.data?.error || 'Có lỗi xảy ra.');
    }
  };

  // ✅ useEffect tính phí ship, giờ đây phụ thuộc vào customerInfo
  useEffect(() => {
    if (customerInfo && customerInfo.province) {
      const getShippingFee = async () => {
        try {
          const response = await axios.post('http://localhost:3000/api/shipping/calculate-fee', {
            province_name: customerInfo.province,
          });
          setShippingFee(response.data.shippingFee);
        } catch (error) {
          toast.error("Không thể tính phí vận chuyển.");
          setShippingFee(0);
        }
      };
      getShippingFee();
    } else {
      setShippingFee(0);
    }
  }, [customerInfo?.province]);

  // useEffect tính tổng tiền giữ nguyên
  useEffect(() => {
    const finalTotal = cartState.total + shippingFee - discount;
    setTotal(finalTotal > 0 ? finalTotal : 0);
  }, [cartState.total, shippingFee, discount]);
  
  return (
    <Box sx={{ p: { xs: 2, md: 4 }, bgcolor: '#fffefb' }}>
      <Grid container spacing={5}>
        <Grid item xs={12} md={7}>
          {/* ✅ Tích hợp CustomerForm */}
          <CustomerForm onFormChange={handleFormChange} />
        </Grid>
        <Grid item xs={12} md={5}>
          <CartSummary
            items={cartState.items}
            subtotal={cartState.total}
            shippingFee={shippingFee}
            discount={discount}
            total={total}
            onUpdateQuantity={updateQuantity}
            onRemoveItem={removeItem}
            onApplyCoupon={handleApplyCoupon}
          />
        </Grid>
      </Grid>
    </Box>
  );
}