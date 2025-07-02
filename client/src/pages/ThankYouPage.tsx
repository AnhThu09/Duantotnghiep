import React, { useEffect, useState } from 'react';
import {
  Container,
  Typography,
  Box,
  Button,
  Card,
  CardContent,
  Divider,
  Chip,
  Grid,
  IconButton,
  Slide,
  Fade,
  Avatar,
  useTheme,
} from '@mui/material';
import {
  CheckCircle,
  Home,
  ShoppingBag,
  Facebook,
  Twitter,
  Instagram,
  LocalShipping,
  CreditCard,
  Assignment,
  Favorite,
  Headset,
  Email,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import confetti from 'canvas-confetti';
import { motion } from 'framer-motion';
import '../css/ThankYouPage.css';

const ThankYouPage: React.FC = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const [orderDetails, setOrderDetails] = useState({
    orderId: '#BSU' + Math.floor(Math.random() * 10000),
    date: new Date().toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    }),
    items: [
      { name: 'Son Luxury Matte', price: '250,000đ', qty: 1, image: '/products/lipstick.jpg' },
      { name: 'Kem dưỡng trắng da', price: '350,000đ', qty: 2, image: '/products/cream.jpg' },
    ],
    total: '950,000đ',
    shipping: 'Giao hàng tiêu chuẩn (Miễn phí)',
    estimatedDelivery: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toLocaleDateString('vi-VN'),
  });

  useEffect(() => {
    const count = 300;
    const defaults = {
      origin: { y: 0.6 },
      colors: ['#FF9A9E', '#FAD0C4', '#A18CD1', '#FBC2EB', '#FFECD2', '#FCB69F'],
      shapes: ['circle', 'square'],
      spread: 120,
      startVelocity: 35,
    };

    confetti({ ...defaults, particleCount: count, scalar: 1.2 });
    confetti({ ...defaults, particleCount: Math.floor(count * 0.25), scalar: 0.75, shapes: ['circle'] });
    confetti({ ...defaults, particleCount: Math.floor(count * 0.2), scalar: 1.5, shapes: ['square'] });

    console.log('Order completed:', orderDetails.orderId);
  }, []);

  const renderOrderItems = () => (
    orderDetails.items.map((item, index) => (
      <Box
        key={index}
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 2.5,
          p: 1.5,
          borderRadius: 2,
          bgcolor: 'rgba(0, 0, 0, 0.01)',
          transition: 'all 0.2s',
          '&:hover': {
            bgcolor: 'rgba(161, 140, 209, 0.03)',
            transform: 'translateY(-2px)',
          },
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Avatar src={item.image} variant="rounded" sx={{ width: 48, height: 48, borderRadius: 1.5 }} />
          <Box>
            <Typography fontWeight="medium">{item.name}</Typography>
            <Typography variant="body2" color="text.secondary">
              Số lượng: {item.qty}
            </Typography>
          </Box>
        </Box>
        <Typography fontWeight="bold">{item.price}</Typography>
      </Box>
    ))
  );

  const renderSocialButtons = () => (
    [
      { icon: <Facebook />, name: 'Facebook', color: '#1877F2' },
      { icon: <Twitter />, name: 'Twitter', color: '#1DA1F2' },
      { icon: <Instagram />, name: 'Instagram', color: '#E4405F' },
    ].map((social, index) => (
      <motion.div
        key={index}
        whileHover={{ y: -4, scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        transition={{ type: 'spring', stiffness: 500 }}
      >
        <IconButton
          aria-label={social.name}
          sx={{
            bgcolor: 'rgba(0, 0, 0, 0.02)',
            border: '1px solid rgba(0, 0, 0, 0.08)',
            '&:hover': { bgcolor: `${social.color}10` },
            color: social.color,
            width: 48,
            height: 48,
          }}
        >
          {social.icon}
        </IconButton>
      </motion.div>
    ))
  );

  const renderSupportChips = () => (
    <>
      <motion.div whileHover={{ y: -2 }}>
        <Chip
          icon={<CreditCard sx={{ color: '#a18cd1' }} />}
          label="Theo dõi đơn hàng"
          variant="outlined"
          clickable
          sx={{
            fontWeight: 'bold',
            bgcolor: 'rgba(161, 140, 209, 0.05)',
            borderColor: 'rgba(161, 140, 209, 0.3)',
            '&:hover': { bgcolor: 'rgba(161, 140, 209, 0.1)' },
          }}
        />
      </motion.div>
      <motion.div whileHover={{ y: -2 }}>
        <Chip
          icon={<Email sx={{ color: '#ff9a9e' }} />}
          label="support@bshop.com"
          variant="outlined"
          clickable
          sx={{
            fontWeight: 'bold',
            bgcolor: 'rgba(255, 154, 158, 0.05)',
            borderColor: 'rgba(255, 154, 158, 0.3)',
            '&:hover': { bgcolor: 'rgba(255, 154, 158, 0.1)' },
          }}
        />
      </motion.div>
      <motion.div whileHover={{ y: -2 }}>
        <Chip
          icon={<Headset sx={{ color: '#00b894' }} />}
          label="1900-1234"
          variant="outlined"
          clickable
          sx={{
            fontWeight: 'bold',
            bgcolor: 'rgba(0, 184, 148, 0.05)',
            borderColor: 'rgba(0, 184, 148, 0.3)',
            '&:hover': { bgcolor: 'rgba(0, 184, 148, 0.1)' },
          }}
        />
      </motion.div>
    </>
  );

  return (
    <Fade in={true} timeout={800}>
      <Container maxWidth="md" className="thank-you-container">
        <Slide direction="up" in={true} mountOnEnter unmountOnExit>
          <Card className="thank-you-card">
            <CardContent sx={{ p: { xs: 3, md: 6 } }}>
              <Box sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 3,
                position: 'relative',
              }}>
                <Box className="decorative-circle-top" />
                <Box className="decorative-circle-bottom" />

                <Box className="check-icon-container">
                  <motion.div
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ type: 'spring', damping: 10, stiffness: 100, delay: 0.2 }}
                  >
                    <CheckCircle sx={{
                      fontSize: 120,
                      color: '#00b894',
                      filter: 'drop-shadow(0 8px 16px rgba(0, 184, 148, 0.4))',
                    }} />
                  </motion.div>
                </Box>

                <Typography variant="h3" component="h1" className="gradient-title" sx={{
                  mb: 1,
                  fontSize: { xs: '2rem', md: '3rem' },
                }}>
                  Cảm ơn bạn đã mua sắm!
                </Typography>

                <Typography variant="body1" sx={{
                  color: 'text.secondary',
                  maxWidth: 500,
                  textAlign: 'center',
                  mb: 2,
                  position: 'relative',
                  zIndex: 1,
                }}>
                  Đơn hàng của bạn đã được xác nhận và đang được xử lý. Chúng tôi sẽ gửi thông báo
                  khi đơn hàng được giao.
                </Typography>

                <Chip
                  label={`Mã đơn hàng: ${orderDetails.orderId}`}
                  color="primary"
                  sx={{
                    bgcolor: 'rgba(161, 140, 209, 0.1)',
                    color: '#a18cd1',
                    fontWeight: 'bold',
                    px: 2,
                    py: 1,
                    fontSize: '0.9rem',
                    border: '1px solid rgba(161, 140, 209, 0.3)',
                    backdropFilter: 'blur(5px)',
                    position: 'relative',
                    zIndex: 1,
                  }}
                />

                <Box className="order-summary-container">
                  <Grid container spacing={3}>
                    <Grid item xs={12} md={6}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                        <Assignment sx={{
                          color: '#a18cd1',
                          bgcolor: 'rgba(161, 140, 209, 0.1)',
                          p: 1,
                          borderRadius: '50%',
                        }} />
                        <Typography variant="h6" fontWeight="bold">
                          Chi tiết đơn hàng
                        </Typography>
                      </Box>
                      <Divider sx={{ my: 2, borderColor: 'rgba(0, 0, 0, 0.05)' }} />
                      {renderOrderItems()}
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                        <LocalShipping sx={{
                          color: '#a18cd1',
                          bgcolor: 'rgba(161, 140, 209, 0.1)',
                          p: 1,
                          borderRadius: '50%',
                        }} />
                        <Typography variant="h6" fontWeight="bold">
                          Thông tin vận chuyển
                        </Typography>
                      </Box>
                      <Divider sx={{ my: 2, borderColor: 'rgba(0, 0, 0, 0.05)' }} />
                      <Box sx={{ mb: 2.5 }}>
                        <Typography variant="body2" color="text.secondary">
                          Phương thức vận chuyển
                        </Typography>
                        <Typography fontWeight="medium">
                          {orderDetails.shipping}
                        </Typography>
                      </Box>
                      <Box sx={{ mb: 2.5 }}>
                        <Typography variant="body2" color="text.secondary">
                          Ngày giao hàng dự kiến
                        </Typography>
                        <Typography fontWeight="medium">
                          {orderDetails.estimatedDelivery}
                        </Typography>
                      </Box>
                      <Box sx={{
                        p: 2,
                        bgcolor: 'rgba(255, 154, 158, 0.05)',
                        borderRadius: 2,
                        border: '1px dashed rgba(255, 154, 158, 0.3)',
                      }}>
                        <Typography variant="body2" color="text.secondary">
                          Tổng cộng
                        </Typography>
                        <Typography variant="h5" fontWeight="bold" sx={{
                          color: '#ff9a9e',
                          display: 'flex',
                          alignItems: 'center',
                          gap: 1,
                        }}>
                          {orderDetails.total}
                          <Favorite sx={{ fontSize: 20, color: 'rgba(255, 154, 158, 0.6)' }} />
                        </Typography>
                      </Box>
                    </Grid>
                  </Grid>
                </Box>

                <Box className="action-buttons-container">
                  <motion.div
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.98 }}
                    transition={{ type: 'spring', stiffness: 400, damping: 10 }}
                  >
                    <Button
                      variant="contained"
                      size="large"
                      startIcon={<Home />}
                      onClick={() => navigate('/')}
                      sx={{
                        flex: 1,
                        background: 'linear-gradient(135deg, #ff9a9e 0%, #a18cd1 100%)',
                        borderRadius: 3,
                        py: 1.5,
                        fontWeight: 'bold',
                        textTransform: 'none',
                        fontSize: '16px',
                        boxShadow: '0 4px 20px rgba(161, 140, 209, 0.3)',
                        '&:hover': { boxShadow: '0 6px 24px rgba(161, 140, 209, 0.4)' },
                      }}
                    >
                      Về trang chủ
                    </Button>
                  </motion.div>

                  <motion.div
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.98 }}
                    transition={{ type: 'spring', stiffness: 400, damping: 10 }}
                  >
                    <Button
                      variant="outlined"
                      size="large"
                      startIcon={<ShoppingBag />}
                      onClick={() => navigate('/products')}
                      sx={{
                        flex: 1,
                        borderColor: '#a18cd1',
                        color: '#a18cd1',
                        borderRadius: 3,
                        py: 1.5,
                        fontWeight: 'bold',
                        textTransform: 'none',
                        fontSize: '16px',
                        '&:hover': {
                          borderColor: '#8e7cc3',
                          backgroundColor: 'rgba(161, 140, 209, 0.08)',
                        },
                      }}
                    >
                      Mua thêm
                    </Button>
                  </motion.div>
                </Box>

                <Box sx={{
                  mt: 4,
                  textAlign: 'center',
                  position: 'relative',
                  zIndex: 1,
                }}>
                  <Typography variant="body1" sx={{
                    mb: 2,
                    color: 'text.secondary',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1,
                    justifyContent: 'center',
                  }}>
                    <Favorite sx={{ fontSize: 18, color: '#ff9a9e' }} />
                    Chia sẻ với bạn bè:
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
                    {renderSocialButtons()}
                  </Box>
                </Box>

                <Box className="support-info-container">
                  <Typography variant="h6" sx={{
                    mb: 1,
                    fontWeight: 'bold',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 1,
                  }}>
                    <Headset sx={{ color: '#a18cd1' }} />
                    Cần hỗ trợ?
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Chúng tôi luôn sẵn lòng giúp đỡ bạn!
                  </Typography>
                  <Box sx={{
                    display: 'flex',
                    flexDirection: { xs: 'column', sm: 'row' },
                    justifyContent: 'center',
                    gap: 2,
                    mt: 3,
                  }}>
                    {renderSupportChips()}
                  </Box>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Slide>
      </Container>
    </Fade>
  );
};

export default ThankYouPage;
