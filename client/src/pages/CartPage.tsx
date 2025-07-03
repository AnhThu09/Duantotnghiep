import React from 'react';
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  Grid,
  IconButton,
  Button,
  Divider,
  Avatar,
  Chip,
  Badge,
  useTheme,
} from '@mui/material';
import { Add, Remove, Delete, ShoppingBag, ArrowForward, LocalShipping, Redeem } from '@mui/icons-material';
import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { motion } from 'framer-motion';

const CartPage: React.FC = () => {
  const { state, updateQuantity, removeItem } = useCart();
  const navigate = useNavigate();
  const theme = useTheme();

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  };

  const handleQuantityChange = (id: number, newQuantity: number) => {
    if (newQuantity < 1) {
      removeItem(id);
      toast.success('Đã xóa sản phẩm khỏi giỏ hàng');
    } else {
      updateQuantity(id, newQuantity);
    }
  };

  const handleRemoveItem = (id: number, name: string) => {
    removeItem(id);
    toast.success(`Đã xóa "${name}" khỏi giỏ hàng`);
  };

  if (state.items.length === 0) {
    return (
      <Container maxWidth="md" sx={{ py: 8, textAlign: 'center' }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 3
            }}
          >
            <Badge
              badgeContent={0}
              color="error"
              overlap="circular"
              sx={{
                '& .MuiBadge-badge': {
                  fontSize: '1rem',
                  height: 30,
                  minWidth: 30,
                  borderRadius: '50%',
                }
              }}
            >
              <ShoppingBag sx={{
                fontSize: 80,
                color: 'text.secondary',
                filter: 'drop-shadow(0 4px 12px rgba(255, 154, 158, 0.3))'
              }} />
            </Badge>
            <Typography variant="h4" sx={{
              fontWeight: 'bold',
              color: 'text.secondary',
              background: 'linear-gradient(135deg, #ff9a9e 0%, #a18cd1 100%)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}>
              Giỏ hàng trống
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Hãy khám phá và thêm sản phẩm vào giỏ hàng của bạn
            </Typography>
            <motion.div
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
            >
              <Button
                variant="contained"
                size="large"
                onClick={() => navigate('/products')}
                sx={{
                  background: 'linear-gradient(135deg, #ff9a9e 0%, #a18cd1 100%)',
                  borderRadius: 3,
                  px: 4,
                  py: 1.5,
                  fontWeight: 'bold',
                  textTransform: 'none',
                  fontSize: '1rem',
                  boxShadow: '0 8px 20px rgba(161, 140, 209, 0.3)',
                  '&:hover': {
                    boxShadow: '0 12px 24px rgba(161, 140, 209, 0.4)',
                  }
                }}
              >
                Khám phá sản phẩm
              </Button>
            </motion.div>
          </Box>
        </motion.div>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <Typography
          variant="h3"
          component="h1"
          sx={{
            fontWeight: 'bold',
            mb: 4,
            textAlign: 'center',
            background: 'linear-gradient(135deg, #ff9a9e 0%, #a18cd1 100%)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            textShadow: '0 2px 4px rgba(0,0,0,0.05)',
            fontSize: { xs: '2rem', md: '2.5rem' }
          }}
        >
          Giỏ hàng của bạn
        </Typography>

        <Grid container spacing={4}>
          <Grid item xs={12} md={8}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              {state.items.map((item) => (
                <motion.div
                  key={item.id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <Card
                    sx={{
                      borderRadius: 3,
                      boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
                      transition: 'all 0.3s ease',
                      border: '1px solid rgba(0, 0, 0, 0.05)',
                      '&:hover': {
                        boxShadow: '0 8px 30px rgba(255, 154, 158, 0.25)',
                        transform: 'translateY(-2px)',
                      },
                      background: 'rgba(255, 255, 255, 0.7)',
                      backdropFilter: 'blur(10px)',
                    }}
                  >
                    <CardContent sx={{ p: 3 }}>
                      <Grid container spacing={3} alignItems="center">
                        <Grid item xs={12} sm={3}>
                          <Avatar
                            src={item.image}
                            alt={item.name}
                            variant="rounded"
                            sx={{
                              width: 100,
                              height: 100,
                              borderRadius: 2,
                              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                              background: 'linear-gradient(135deg, #f5f7fa 0%, #f8f9fd 100%)'
                            }}
                          />
                        </Grid>

                        <Grid item xs={12} sm={5}>
                          <Typography variant="h6" sx={{
                            fontWeight: 'bold',
                            mb: 1,
                            color: theme.palette.text.primary
                          }}>
                            {item.name}
                          </Typography>
                          <Chip
                            label={item.brand}
                            size="small"
                            sx={{
                              mb: 1,
                              backgroundColor: 'rgba(161, 140, 209, 0.1)',
                              color: '#a18cd1',
                              fontWeight: 'bold',
                              border: '1px solid rgba(161, 140, 209, 0.3)'
                            }}
                          />
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            {item.discount_price ? (
                              <>
                                <Typography variant="h6" sx={{
                                  color: '#e74c3c',
                                  fontWeight: 'bold',
                                  fontSize: '1.1rem'
                                }}>
                                  {formatPrice(item.discount_price)}
                                </Typography>
                                <Typography
                                  variant="body2"
                                  sx={{
                                    textDecoration: 'line-through',
                                    color: 'text.secondary'
                                  }}
                                >
                                  {formatPrice(item.price)}
                                </Typography>
                                <Chip
                                  label={`Tiết kiệm ${formatPrice(item.price - item.discount_price)}`}
                                  size="small"
                                  sx={{
                                    backgroundColor: 'rgba(231, 76, 60, 0.1)',
                                    color: '#e74c3c',
                                    fontWeight: 'bold',
                                    ml: 1
                                  }}
                                />
                              </>
                            ) : (
                              <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                                {formatPrice(item.price)}
                              </Typography>
                            )}
                          </Box>
                        </Grid>

                        <Grid item xs={12} sm={3}>
                          <Box sx={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 1,
                            mb: 2
                          }}>
                            <IconButton
                              onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                              size="small"
                              sx={{
                                backgroundColor: 'rgba(0, 0, 0, 0.03)',
                                border: '1px solid rgba(0, 0, 0, 0.08)',
                                '&:hover': {
                                  backgroundColor: 'rgba(0, 0, 0, 0.05)',
                                  color: '#ff9a9e'
                                }
                              }}
                            >
                              <Remove fontSize="small" />
                            </IconButton>

                            <Typography
                              sx={{
                                mx: 2,
                                minWidth: 40,
                                textAlign: 'center',
                                fontWeight: 'bold',
                                fontSize: '1.1rem'
                              }}
                            >
                              {item.quantity}
                            </Typography>

                            <IconButton
                              onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                              size="small"
                              sx={{
                                backgroundColor: 'rgba(0, 0, 0, 0.03)',
                                border: '1px solid rgba(0, 0, 0, 0.08)',
                                '&:hover': {
                                  backgroundColor: 'rgba(0, 0, 0, 0.05)',
                                  color: '#a18cd1'
                                }
                              }}
                            >
                              <Add fontSize="small" />
                            </IconButton>
                          </Box>

                          <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                            <IconButton
                              onClick={() => handleRemoveItem(item.id, item.name)}
                              color="error"
                              sx={{
                                backgroundColor: 'rgba(255, 107, 107, 0.1)',
                                border: '1px solid rgba(255, 107, 107, 0.3)',
                                '&:hover': {
                                  backgroundColor: 'rgba(255, 107, 107, 0.2)',
                                }
                              }}
                            >
                              <Delete />
                            </IconButton>
                          </motion.div>
                        </Grid>

                        <Grid item xs={12} sm={1}>
                          <Typography variant="h6" sx={{
                            fontWeight: 'bold',
                            textAlign: 'right',
                            color: '#ff9a9e',
                            fontSize: '1.2rem'
                          }}>
                            {formatPrice((item.discount_price || item.price) * item.quantity)}
                          </Typography>
                        </Grid>
                      </Grid>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </Box>
          </Grid>

          <Grid item xs={12} md={4}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
            >
              <Card
                sx={{
                  borderRadius: 3,
                  boxShadow: '0 8px 30px rgba(255, 154, 158, 0.2)',
                  position: 'sticky',
                  top: 20,
                  border: 'none',
                  background: 'linear-gradient(135deg, #f5f7fa 0%, #f8f9fd 100%)',
                  backdropFilter: 'blur(10px)',
                  overflow: 'hidden',
                  '&:before': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    height: 6,
                    background: 'linear-gradient(90deg, #ff9a9e 0%, #a18cd1 100%)',
                  }
                }}
              >
                <CardContent sx={{ p: 4 }}>
                  <Typography variant="h5" sx={{
                    fontWeight: 'bold',
                    mb: 3,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1
                  }}>
                    <Redeem sx={{ color: '#a18cd1' }} />
                    Tóm tắt đơn hàng
                  </Typography>

                  <Box sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    mb: 2,
                    p: 1.5,
                    borderRadius: 1,
                    backgroundColor: 'rgba(161, 140, 209, 0.05)'
                  }}>
                    <Typography>Số lượng sản phẩm:</Typography>
                    <Typography sx={{ fontWeight: 'bold' }}>
                      {state.items.reduce((sum, item) => sum + item.quantity, 0)}
                    </Typography>
                  </Box>

                  <Box sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    mb: 2,
                    p: 1.5,
                    borderRadius: 1,
                    backgroundColor: 'rgba(255, 154, 158, 0.05)'
                  }}>
                    <Typography>Phí vận chuyển:</Typography>
                    <Typography sx={{ fontWeight: 'bold', color: '#00b894' }}>
                      Miễn phí
                    </Typography>
                  </Box>

                  <Divider sx={{
                    my: 2,
                    borderColor: 'rgba(0, 0, 0, 0.05)',
                    borderBottomWidth: 2
                  }} />

                  <Box sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    mb: 3,
                    p: 2,
                    borderRadius: 2,
                    backgroundColor: 'rgba(255, 154, 158, 0.08)'
                  }}>
                    <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                      Tổng cộng:
                    </Typography>
                    <Typography
                      variant="h5"
                      sx={{
                        fontWeight: 'bold',
                        color: '#ff9a9e',
                        fontSize: '1.5rem'
                      }}
                    >
                      {formatPrice(state.total)}
                    </Typography>
                  </Box>

                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Button
                      variant="contained"
                      fullWidth
                      size="large"
                      endIcon={<ArrowForward />}
                      onClick={() => navigate('/checkout')}
                      sx={{
                        background: 'linear-gradient(135deg, #ff9a9e 0%, #a18cd1 100%)',
                        borderRadius: 3,
                        py: 1.5,
                        fontWeight: 'bold',
                        textTransform: 'none',
                        fontSize: '1rem',
                        boxShadow: '0 8px 20px rgba(161, 140, 209, 0.3)',
                        '&:hover': {
                          boxShadow: '0 12px 24px rgba(161, 140, 209, 0.4)',
                        }
                      }}
                    >
                      Tiến hành thanh toán
                    </Button>
                  </motion.div>

                  <Box sx={{
                    mt: 3,
                    p: 2,
                    borderRadius: 2,
                    backgroundColor: 'rgba(0, 184, 148, 0.05)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1.5
                  }}>
                    <LocalShipping sx={{ color: '#00b894' }} />
                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                      Miễn phí vận chuyển cho đơn hàng từ 500.000đ
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </motion.div>
          </Grid>
        </Grid>
      </motion.div>
    </Container>
  );
};

export default CartPage;
