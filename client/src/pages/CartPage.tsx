"use client";

import { useState, useEffect } from "react";

import axios from "axios";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import CartSummary from "../components/CartSummary";
import CustomerForm from "../components/CustomerForm"; // ✅ Import
import { toast } from "sonner";
import { Box, Grid } from "@mui/material";
import { Button } from "@mui/material";

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
  const [customerInfo, setCustomerInfo] = useState<CustomerFormData | null>(
    null
  );

  // ✅ Hàm mới để nhận dữ liệu từ CustomerForm
  const handleFormChange = (data: CustomerFormData) => {
    setCustomerInfo(data);
  };

  const handleCheckout = async () => {
    if (!customerInfo) {
      toast.error("Vui lòng nhập đầy đủ thông tin khách hàng.");
      return;
    }
    if (cartState.items.length === 0) {
      toast.error("Giỏ hàng trống.");
      return;
    }

    // Thêm log kiểm tra dữ liệu gửi đi
    console.log("Dữ liệu gửi đi để tạo đơn hàng:", {
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
      items: cartState.items.map((item) => ({
        product_id: item.product_id,
        quantity: item.quantity,
        price: item.discount_price ?? item.price, // Sử dụng giá khuyến mãi nếu có
      })),
      total_amount: total,
      shipping_fee: shippingFee, // Thêm phí vận chuyển
      discount_amount: discount, // Thêm giảm giá
      note: customerInfo.notes || "",
    });

    try {
      const response = await axios.post("http://localhost:3000/api/orders", {
        user_id: currentUser?.user_id || null,
        order_code: null,
        recipient: {
          name: customerInfo.name,
          phone: customerInfo.phone_number,
          address: customerInfo.address,
          ward: customerInfo.ward,
          district: customerInfo.district,
          province: customerInfo.province,
        },
        items: cartState.items.map((item) => ({
          product_id: item.product_id,
          quantity: item.quantity,
          price: item.discount_price ?? item.price,
        })),
        total_amount: total,
        shipping_fee: shippingFee, // Gửi phí vận chuyển
        discount_amount: discount, // Gửi giảm giá
        note: customerInfo.notes || "",
      });

      toast.success(
        "Đặt hàng thành công! Mã đơn hàng: " + response.data.data.order_code
      );
      clearCart();
      navigate(`/checkout-success?order_code=${response.data.data.order_code}`);
    } catch (error: any) {
      console.error("Lỗi khi đặt hàng:", error.response?.data || error.message);
      toast.error(error.response?.data?.message || "Có lỗi khi đặt hàng.");
    }
  };

  // Logic áp dụng coupon giữ nguyên
  const handleApplyCoupon = async (couponCode: string) => {
    if (!couponCode) {
      toast.error("Vui lòng nhập mã giảm giá.");
      return;
    }
    try {
      const response = await axios.post(
        "http://localhost:3000/api/discounts/apply",
        {
          code: couponCode,
          order_value: cartState.total,
        }
      );
      setDiscount(response.data.discounted_by);
      toast.success(response.data.message);
    } catch (error: any) {
      setDiscount(0);
      toast.error(error.response?.data?.error || "Có lỗi xảy ra.");
    }
  };

  // ✅ useEffect tính phí ship, giờ đây phụ thuộc vào customerInfo
  useEffect(() => {
    if (customerInfo && customerInfo.province) {
      const getShippingFee = async () => {
        try {
          const response = await axios.post(
            "http://localhost:3000/api/shipping/calculate-fee",
            {
              province_name: customerInfo.province,
            }
          );
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
  }, [customerInfo]); // Updated dependency array

  // useEffect tính tổng tiền giữ nguyên
  useEffect(() => {
    const finalTotal = cartState.total + shippingFee - discount;
    setTotal(finalTotal > 0 ? finalTotal : 0);
  }, [cartState.total, shippingFee, discount]);

  return (
    <Box sx={{ p: { xs: 2, md: 4 }, bgcolor: "#fffefb" }}>
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
