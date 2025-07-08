// //Trang dang ki user
// import React, { useState } from 'react';
// import axios from 'axios';
// import { Box, Button, TextField, Typography, Alert } from '@mui/material';

// interface Props {
//   email: string;
//   onSuccess: () => void;
// }

// const RegisterForm: React.FC<Props> = ({ email, onSuccess }) => {
//   const [form, setForm] = useState({
//     full_name: '',
//     phone_number: '',
//     password: '',
//   });

//   const [message, setMessage] = useState<string | null>(null);
//   const [error, setError] = useState<string | null>(null);

//   const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const { name, value } = e.target;
//     setForm({ ...form, [name]: value });
//   };

//   const handleRegister = async () => {
//     try {
//       setMessage(null);
//       setError(null);
//       await axios.post('http://localhost:3000/api/auth/register', {
//         ...form,
//         email,
//         password_hash: form.password,
//       });
//       setMessage('Đăng ký thành công!');
//       onSuccess(); // callback sau khi đăng ký thành công
//     } catch (err: any) {
//       setError(err.response?.data?.message || 'Đăng ký thất bại');
//     }
//   };

//   return (
//     <Box maxWidth={400} mx="auto" mt={8}>
//       <Typography variant="h5" fontWeight="bold" mb={2}>Thông tin đăng ký</Typography>
//       <TextField
//         fullWidth
//         label="Họ và tên"
//         name="full_name"
//         value={form.full_name}
//         onChange={handleChange}
//         sx={{ mb: 2 }}
//       />
//       <TextField
//         fullWidth
//         label="Số điện thoại"
//         name="phone_number"
//         value={form.phone_number}
//         onChange={handleChange}
//         sx={{ mb: 2 }}
//       />
//       <TextField
//         fullWidth
//         label="Mật khẩu"
//         type="password"
//         name="password"
//         value={form.password}
//         onChange={handleChange}
//         sx={{ mb: 2 }}
//       />
//       <Button variant="contained" fullWidth onClick={handleRegister}>
//         Đăng ký
//       </Button>
//       {message && <Alert severity="success" sx={{ mt: 2 }}>{message}</Alert>}
//       {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
//     </Box>
//   );
// };

// export default RegisterForm;
