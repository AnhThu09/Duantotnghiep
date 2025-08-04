'use client';

import { useEffect, useState } from 'react';

import { Box, Button, Grid } from '@mui/material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import CartSummary from '../components/CartSummary';
import CustomerForm from '../components/CustomerForm'; // ✅ Import
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

// Định nghĩa interface cho CustomerFormData để sử dụng trong CartPage
interface CustomerFormData {
  name: string;
  phone_number: string;
  email: string;
  address: string;
  province: string;
  district: string;
  ward: string;
  notes: string;
  save_info_for_next_time: boolean;
}

export default function CartPage() {
  const navigate = useNavigate();
  const { state: cartState, updateQuantity, removeItem, clearCart } = useCart();
  const { currentUser } = useAuth();

  // State cho việc tính toán
  const [shippingFee, setShippingFee] = useState(0);
  const [discount, setDiscount] = useState(0);
  const [total, setTotal] = useState(0);

  // ✅ State mới để lưu dữ liệu từ CustomerForm
  const [customerInfo, setCustomerInfo] = useState<CustomerFormData | null>(null);
  
  // ✅ State cho phương thức thanh toán
  const [paymentMethod, setPaymentMethod] = useState<string>('cod');

  // ✅ Hàm mới để nhận dữ liệu từ CustomerForm
  const handleFormChange = (data: CustomerFormData) => {
    setCustomerInfo(data);
  };
  
  // ✅ Hàm xử lý thay đổi phương thức thanh toán
  const handlePaymentMethodChange = (method: string) => {
    setPaymentMethod(method);
  };

  const handleCheckout = async () => {
    if (!customerInfo) {
      toast.error('Vui lòng nhập đầy đủ thông tin khách hàng.');
      return;
    }
    if (cartState.items.length === 0) {
      toast.error('Giỏ hàng trống.');
      return;
    }

    console.log('Phương thức thanh toán được chọn:', paymentMethod);

    // Chuẩn bị dữ liệu đơn hàng
    const orderData = {
      user_id: currentUser?.user_id || null,
      order_code: null, // Backend sẽ tự tạo nếu null
      recipient: {
        name: customerInfo.name,
        phone: customerInfo.phone_number,
        address: customerInfo.address,
        ward: customerInfo.ward,
        district: customerInfo.district,
        province: customerInfo.province,
      },
      items: cartState.items.map(item => ({
        product_id: item.product_id,
        quantity: item.quantity,
        price: item.discount_price ?? item.price,
      })),
      total_amount: total,
      shipping_fee: shippingFee,
      discount_amount: discount,
      note: customerInfo.notes || '',
      payment_method: paymentMethod, // Thêm phương thức thanh toán
    };

    try {
      // Xử lý theo phương thức thanh toán
      switch (paymentMethod) {
        case 'cod':
          await handleCODPayment(orderData);
          break;
        case 'bank':
          await handleVNPayPayment(orderData);
          break;
        case 'momo':
        case 'zalopay':
          toast.info(`Phương thức thanh toán ${paymentMethod} đang được phát triển.`);
          break;
        default:
          await handleCODPayment(orderData); // Mặc định là COD
      }
    } catch (error: any) {
      console.error('Lỗi khi xử lý thanh toán:', error);
      toast.error(error.response?.data?.message || 'Có lỗi khi xử lý thanh toán.');
    }
  };

  // Xử lý thanh toán COD
  const handleCODPayment = async (orderData: any) => {
    const response = await axios.post('http://localhost:3000/api/orders', orderData);
    toast.success('Đặt hàng thành công! Mã đơn hàng: ' + response.data.data.order_code);
    clearCart();
    navigate(`/checkout-success?order_code=${response.data.data.order_code}`);
  };

  // Xử lý thanh toán VNPay
  const handleVNPayPayment = async (orderData: any) => {
    // Không tạo đơn hàng trước, chỉ tạo payment URL
    // Lưu orderData vào localStorage để sử dụng khi VNPay return thành công
    const tempOrderId = `ORD${Date.now()}`;
    localStorage.setItem(`vnpay_order_${tempOrderId}`, JSON.stringify(orderData));
    
    // Tạo yêu cầu thanh toán VNPay
    const paymentResponse = await axios.post('http://localhost:3000/api/payments/vnpay/create', {
      orderId: tempOrderId,
      amount: total,
      orderInfo: `Thanh toán đơn hàng ${tempOrderId}`,
      bankCode: '', // Có thể để trống hoặc chọn ngân hàng cụ thể
    });
    
    if (paymentResponse.data.paymentUrl) {
      // Clear cart before redirect để tránh user quay lại và checkout lại
      clearCart();
      // Chuyển hướng đến trang thanh toán VNPay
      window.location.href = paymentResponse.data.paymentUrl;
    } else {
      throw new Error('Không thể tạo liên kết thanh toán VNPay');
    }
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
          toast.error('Không thể tính phí vận chuyển.');
          setShippingFee(0);
        }
      };
      getShippingFee();
    } else {
      setShippingFee(0);
    }
  }, [customerInfo]); // Updated dependency array

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
          <CustomerForm 
            onFormChange={handleFormChange} 
            onPaymentMethodChange={handlePaymentMethodChange}
          />
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
          <Button
            variant="contained"
            color="primary"
            fullWidth
            sx={{ mt: 2 }}
            onClick={handleCheckout}
            disabled={cartState.items.length === 0 || !customerInfo}
          >
            Thanh toán
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
}
