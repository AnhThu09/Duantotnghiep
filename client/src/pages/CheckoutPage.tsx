import { Home } from "@mui/icons-material";
import {
  Alert,
  Box,
  Breadcrumbs,
  Button,
  Container,
  Link,
  Typography,
} from "@mui/material";
import React, { useState } from "react";
import CartSummary from "../components/CartSummary";
import CustomerForm from "../components/CustomerForm";
import PaymentMethods from "../components/PaymentMethods";

const CheckoutPage: React.FC = () => {
  const [customerData, setCustomerData] = useState({});
  const [paymentMethod, setPaymentMethod] = useState("cod");

  const handleCustomerDataChange = (data: any) => {
    setCustomerData(data);
  };

  const handlePaymentMethodChange = (method: string) => {
    setPaymentMethod(method);
  };

  const handleOrderSubmit = () => {
    console.log("Order submitted:", {
      customerData,
      paymentMethod,
    });
    // Handle order submission here
  };

  return (
    <Box sx={{ minHeight: "100vh", backgroundColor: "#F5F5F5" }}>
      <Container maxWidth="xl" sx={{ py: 4 }}>
        {/* Breadcrumb */}
        <Breadcrumbs aria-label="breadcrumb" sx={{ mb: 2 }}>
          <Link
            underline="hover"
            color="inherit"
            href="/"
            sx={{ display: "flex", alignItems: "center", gap: 0.5 }}
          >
            <Home sx={{ fontSize: 16 }} />
            Trang Chủ
          </Link>
          <Typography color="text.primary">Sản Phẩm</Typography>
        </Breadcrumbs>

        {/* Login notification */}
        <Alert severity="warning" sx={{ mb: 3, textAlign: "center" }}>
          Đăng ký / Đăng nhập để nhận ưu đãi cho thành viên
        </Alert>

        <div className="row g-4">
          {/* Left section - Customer information and Payment */}
          <div className="col-lg-8">
            <Box sx={{ mb: 4 }}>
              <CustomerForm onFormChange={handleCustomerDataChange} />
            </Box>

            <Box sx={{ mb: 4 }}>
              <PaymentMethods
                selectedMethod={paymentMethod}
                onMethodChange={handlePaymentMethodChange}
              />
            </Box>

            <Button
              variant="contained"
              fullWidth
              size="large"
              onClick={handleOrderSubmit}
              sx={{
                py: 2,
                backgroundColor: "#FF6B35",
                "&:hover": { backgroundColor: "#E55A2B" },
                fontWeight: "bold",
                fontSize: "1.1rem",
              }}
            >
              Xác nhận đặt hàng
            </Button>
          </div>

          {/* Right section - Cart summary */}
          <div className="col-lg-4">
            <CartSummary />
          </div>
        </div>
      </Container>
    </Box>
  );
};

export default CheckoutPage;
