import React, { useState } from 'react';
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  Grid,
  TextField,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  Button,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Chip,
  useTheme,
  IconButton,
} from '@mui/material';
import {
  CreditCard,
  AccountBalance,
  Phone,
  ArrowBack,
  LocalShipping,
  CheckCircle,
  Favorite
} from '@mui/icons-material';
import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { motion } from 'framer-motion';

interface CheckoutForm {
  fullName: string;
  phone: string;
  address: string;
  paymentMethod: 'cod' | 'momo' | 'bank';
}

const CheckoutPage: React.FC = () => {
  const { state, clearCart } = useCart();
  const navigate = useNavigate();
  const theme = useTheme();

  const [form, setForm] = useState<CheckoutForm>({
    fullName: '',
    phone: '',
    address: '',
    paymentMethod: 'cod'
  });

  const [errors, setErrors] = useState<Partial<CheckoutForm>>({});

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<CheckoutForm> = {};

    if (!form.fullName.trim()) {
      newErrors.fullName = 'Vui lòng nhập họ tên';
    }

    if (!form.phone.trim()) {
      newErrors.phone = 'Vui lòng nhập số điện thoại';
    } else if (!/^[0-9]{10,11}$/.test(form.phone.replace(/\s/g, ''))) {
      newErrors.phone = 'Số điện thoại không hợp lệ';
    }

    if (!form.address.trim()) {
      newErrors.address = 'Vui lòng nhập địa chỉ giao hàng';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field: keyof CheckoutForm, value: string) => {
    setForm(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error('Vui lòng kiểm tra thông tin và thử lại');
      return;
    }

    if (state.items.length === 0) {
      toast.error('Giỏ hàng trống');
      return;
    }

    // Simulate order processing
    toast.loading('Đang xử lý đơn hàng...', { id: 'checkout' });

    setTimeout(() => {
      // Save order to localStorage (in real app, send to backend)
      const order = {
        id: Date.now(),
        items: state.items,
        total: state.total,
        customerInfo: form,
        orderDate: new Date().toISOString(),
        status: 'pending'
      };

      const orders = JSON.parse(localStorage.getItem('orders') || '[]');
      orders.push(order);
      localStorage.setItem('orders', JSON.stringify(orders));

      clearCart();
      toast.success('Đặt hàng thành công!', { id: 'checkout' });
      navigate('/thank-you');
    }, 2000);
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
            <Typography
              variant="h4"
              sx={{
                mb: 2,
                fontWeight: 'bold',
                background: 'linear-gradient(135deg, #ff9a9e 0%, #a18cd1 100%)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              Giỏ hàng trống
            </Typography>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                variant="contained"
                onClick={() => navigate('/products')}
                sx={{
                  background: 'linear-gradient(135deg, #ff9a9e 0%, #a18cd1 100%)',
                  borderRadius: 3,
                  px: 4,
                  py: 1.5,
                  fontWeight: 'bold',
                  textTransform: 'none',
                  boxShadow: '0 4px 14px rgba(161, 140, 209, 0.3)',
                  '&:hover': {
                    boxShadow: '0 6px 20px rgba(161, 140, 209, 0.4)',
                  }
                }}
              >
                Tiếp tục mua sắm
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
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
          <IconButton onClick={() => navigate(-1)} sx={{ mr: 2 }}>
            <ArrowBack />
          </IconButton>
          <Typography
            variant="h4"
            component="h1"
            sx={{
              fontWeight: 'bold',
              background: 'linear-gradient(135deg, #ff9a9e 0%, #a18cd1 100%)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              textShadow: '0 2px 4px rgba(0,0,0,0.05)',
            }}
          >
            Thanh toán
          </Typography>
        </Box>

        <form onSubmit={handleSubmit}>
          <Grid container spacing={4}>
            <Grid item xs={12} md={7}>
              <motion.div whileHover={{ y: -2 }}>
                <Card
                  sx={{
                    borderRadius: 3,
                    mb: 3,
                    background: 'rgba(255, 255, 255, 0.7)',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(0, 0, 0, 0.05)',
                    boxShadow: '0 8px 32px rgba(31, 38, 135, 0.05)',
                    '&:hover': {
                      boxShadow: '0 12px 40px rgba(161, 140, 209, 0.15)',
                    }
                  }}
                >
                  <CardContent sx={{ p: 4 }}>
                    <Typography
                      variant="h6"
                      sx={{
                        fontWeight: 'bold',
                        mb: 3,
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1.5
                      }}
                    >
                      <LocalShipping sx={{ color: '#a18cd1' }} />
                      Thông tin giao hàng
                    </Typography>

                    <Grid container spacing={3}>
                      <Grid item xs={12}>
                        <TextField
                          fullWidth
                          label="Họ và tên"
                          value={form.fullName}
                          onChange={(e) => handleInputChange('fullName', e.target.value)}
                          error={!!errors.fullName}
                          helperText={errors.fullName}
                          sx={{ mb: 2 }}
                          InputProps={{
                            sx: {
                              borderRadius: 2,
                              backgroundColor: 'rgba(0, 0, 0, 0.02)',
                            }
                          }}
                        />
                      </Grid>

                      <Grid item xs={12}>
                        <TextField
                          fullWidth
                          label="Số điện thoại"
                          value={form.phone}
                          onChange={(e) => handleInputChange('phone', e.target.value)}
                          error={!!errors.phone}
                          helperText={errors.phone}
                          sx={{ mb: 2 }}
                          InputProps={{
                            sx: {
                              borderRadius: 2,
                              backgroundColor: 'rgba(0, 0, 0, 0.02)',
                            }
                          }}
                        />
                      </Grid>

                      <Grid item xs={12}>
                        <TextField
                          fullWidth
                          label="Địa chỉ giao hàng"
                          multiline
                          rows={3}
                          value={form.address}
                          onChange={(e) => handleInputChange('address', e.target.value)}
                          error={!!errors.address}
                          helperText={errors.address}
                          InputProps={{
                            sx: {
                              borderRadius: 2,
                              backgroundColor: 'rgba(0, 0, 0, 0.02)',
                            }
                          }}
                        />
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div whileHover={{ y: -2 }}>
                <Card
                  sx={{
                    borderRadius: 3,
                    background: 'rgba(255, 255, 255, 0.7)',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(0, 0, 0, 0.05)',
                    boxShadow: '0 8px 32px rgba(31, 38, 135, 0.05)',
                    '&:hover': {
                      boxShadow: '0 12px 40px rgba(161, 140, 209, 0.15)',
                    }
                  }}
                >
                  <CardContent sx={{ p: 4 }}>
                    <Typography
                      variant="h6"
                      sx={{
                        fontWeight: 'bold',
                        mb: 3,
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1.5
                      }}
                    >
                      <CreditCard sx={{ color: '#a18cd1' }} />
                      Phương thức thanh toán
                    </Typography>

                    <FormControl component="fieldset" fullWidth>
                      <RadioGroup
                        value={form.paymentMethod}
                        onChange={(e) => handleInputChange('paymentMethod', e.target.value)}
                      >
                        <motion.div whileHover={{ scale: 1.01 }}>
                          <FormControlLabel
                            value="cod"
                            control={<Radio color="primary" />}
                            label={
                              <Box sx={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: 2,
                                p: 2,
                              }}>
                                <Box sx={{
                                  p: 1.5,
                                  borderRadius: '50%',
                                  bgcolor: 'rgba(161, 140, 209, 0.1)',
                                  color: '#a18cd1',
                                }}>
                                  <CreditCard />
                                </Box>
                                <Box>
                                  <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                                    Thanh toán khi nhận hàng (COD)
                                  </Typography>
                                  <Typography variant="body2" color="text.secondary">
                                    Thanh toán bằng tiền mặt khi nhận hàng
                                  </Typography>
                                </Box>
                              </Box>
                            }
                            sx={{
                              mb: 2,
                              p: 1,
                              borderRadius: 2,
                              border: '1px solid rgba(161, 140, 209, 0.2)',
                              bgcolor: form.paymentMethod === 'cod' ? 'rgba(161, 140, 209, 0.05)' : 'transparent',
                            }}
                          />
                        </motion.div>

                        <motion.div whileHover={{ scale: 1.01 }}>
                          <FormControlLabel
                            value="momo"
                            control={<Radio color="primary" />}
                            label={
                              <Box sx={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: 2,
                                p: 2,
                              }}>
                                <Box sx={{
                                  p: 1.5,
                                  borderRadius: '50%',
                                  bgcolor: 'rgba(255, 154, 158, 0.1)',
                                  color: '#ff9a9e',
                                }}>
                                  <Phone />
                                </Box>
                                <Box>
                                  <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                                    Ví điện tử MoMo
                                  </Typography>
                                  <Typography variant="body2" color="text.secondary">
                                    Thanh toán qua ví MoMo
                                  </Typography>
                                </Box>
                              </Box>
                            }
                            sx={{
                              mb: 2,
                              p: 1,
                              borderRadius: 2,
                              border: '1px solid rgba(255, 154, 158, 0.2)',
                              bgcolor: form.paymentMethod === 'momo' ? 'rgba(255, 154, 158, 0.05)' : 'transparent',
                            }}
                          />
                        </motion.div>

                        <motion.div whileHover={{ scale: 1.01 }}>
                          <FormControlLabel
                            value="bank"
                            control={<Radio color="primary" />}
                            label={
                              <Box sx={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: 2,
                                p: 2,
                              }}>
                                <Box sx={{
                                  p: 1.5,
                                  borderRadius: '50%',
                                  bgcolor: 'rgba(0, 184, 148, 0.1)',
                                  color: '#00b894',
                                }}>
                                  <AccountBalance />
                                </Box>
                                <Box>
                                  <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                                    Chuyển khoản ngân hàng
                                  </Typography>
                                  <Typography variant="body2" color="text.secondary">
                                    Chuyển khoản qua ngân hàng hoặc internet banking
                                  </Typography>
                                </Box>
                              </Box>
                            }
                            sx={{
                              p: 1,
                              borderRadius: 2,
                              border: '1px solid rgba(0, 184, 148, 0.2)',
                              bgcolor: form.paymentMethod === 'bank' ? 'rgba(0, 184, 148, 0.05)' : 'transparent',
                            }}
                          />
                        </motion.div>
                      </RadioGroup>
                    </FormControl>
                  </CardContent>
                </Card>
              </motion.div>
            </Grid>

            <Grid item xs={12} md={5}>
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
                    background: 'linear-gradient(135deg, #f5f7fa 0%, #f8f9fd 100%)',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(0, 0, 0, 0.05)',
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
                    <Typography
                      variant="h6"
                      sx={{
                        fontWeight: 'bold',
                        mb: 3,
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1.5
                      }}
                    >
                      <CheckCircle sx={{ color: '#00b894' }} />
                      Đơn hàng của bạn
                    </Typography>

                    <List sx={{ mb: 2 }}>
                      {state.items.map((item) => (
                        <motion.div
                          key={item.id}
                          whileHover={{ x: 4 }}
                          transition={{ type: 'spring', stiffness: 300 }}
                        >
                          <ListItem sx={{
                            px: 0,
                            py: 1.5,
                            borderRadius: 2,
                            '&:hover': {
                              bgcolor: 'rgba(0, 0, 0, 0.02)',
                            }
                          }}>
                            <ListItemAvatar>
                              <Avatar
                                src={item.image}
                                alt={item.name}
                                sx={{
                                  width: 60,
                                  height: 60,
                                  borderRadius: 1.5,
                                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                                }}
                              />
                            </ListItemAvatar>
                            <ListItemText
                              primary={
                                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                  <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                                    {item.name}
                                  </Typography>
                                  <Chip
                                    label={`x${item.quantity}`}
                                    size="small"
                                    sx={{
                                      bgcolor: 'rgba(161, 140, 209, 0.1)',
                                      color: '#a18cd1',
                                      fontWeight: 'bold',
                                    }}
                                  />
                                </Box>
                              }
                              secondary={
                                <Typography
                                  variant="body2"
                                  sx={{
                                    fontWeight: 'bold',
                                    color: '#ff9a9e',
                                    mt: 0.5
                                  }}
                                >
                                  {formatPrice((item.discount_price || item.price) * item.quantity)}
                                </Typography>
                              }
                            />
                          </ListItem>
                        </motion.div>
                      ))}
                    </List>

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
                      bgcolor: 'rgba(255, 154, 158, 0.05)',
                      border: '1px dashed rgba(255, 154, 158, 0.3)',
                    }}>
                      <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                        Tổng cộng:
                      </Typography>
                      <Typography
                        variant="h5"
                        sx={{
                          fontWeight: 'bold',
                          color: '#ff9a9e',
                          display: 'flex',
                          alignItems: 'center',
                          gap: 1
                        }}
                      >
                        {formatPrice(state.total)}
                        <Favorite sx={{ color: 'rgba(255, 154, 158, 0.6)' }} />
                      </Typography>
                    </Box>

                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Button
                        type="submit"
                        variant="contained"
                        fullWidth
                        size="large"
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
                        Xác nhận đặt hàng
                      </Button>
                    </motion.div>

                    <Box sx={{
                      mt: 3,
                      p: 2,
                      borderRadius: 2,
                      bgcolor: 'rgba(0, 184, 148, 0.05)',
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
        </form>
      </motion.div>
    </Container>
  );
};

export default CheckoutPage;
