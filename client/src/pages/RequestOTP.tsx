// //Trang mail xac nhan
// import React, { useState } from 'react';
// import axios from 'axios';
// import { Box, Button, TextField, Typography, Alert } from '@mui/material';

// const RequestOTP = ({ onSuccess }: { onSuccess: (email: string) => void }) => {
//   const [email, setEmail] = useState('');
//   const [message, setMessage] = useState<string | null>(null);
//   const [error, setError] = useState<string | null>(null);

//   const handleSendOTP = async () => {
//     try {
//       setMessage(null);
//       setError(null);
//       const res = await axios.post('http://localhost:3000/api/auth/request-otp', { email });
//       setMessage(res.data.message);
//       onSuccess(email); // gọi callback để chuyển sang bước nhập mã OTP
//     } catch (err: any) {
//       setError(err.response?.data?.message || 'Gửi OTP thất bại');
//     }
//   };

//   return (
//     <Box maxWidth={400} mx="auto" mt={8}>
//       <Typography variant="h5" fontWeight="bold" mb={2}>Xác thực Email</Typography>
//       <TextField
//         fullWidth
//         label="Email của bạn"
//         value={email}
//         onChange={(e) => setEmail(e.target.value)}
//         sx={{ mb: 2 }}
//       />
//       <Button variant="contained" color="primary" fullWidth onClick={handleSendOTP}>
//         Gửi mã OTP
//       </Button>
//       {message && <Alert severity="success" sx={{ mt: 2 }}>{message}</Alert>}
//       {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
//     </Box>
//   );
// };

// export default RequestOTP;
