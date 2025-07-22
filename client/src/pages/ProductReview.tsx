// 📁 src/components/ProductReview.tsx
import {
  Box,
  Button,
  Divider,
  Rating,
  TextField,
  Typography,
  Snackbar,
  Alert,
} from '@mui/material';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

interface ProductReviewProps {
  productId: number;
}

interface Review {
  review_id: number;
  user_id: number;
  username: string;
  product_id: number;
  product_name: string;
  rating: number;
  comment: string;
  created_at: string;
}

const API_BASE_URL = 'http://localhost:3000/api';

const ProductReview: React.FC<ProductReviewProps> = ({ productId }) => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [rating, setRating] = useState<number | null>(null);
  const [comment, setComment] = useState('');
  const [hasPurchased, setHasPurchased] = useState(false);
  const [hasReviewed, setHasReviewed] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success' as 'success' | 'error',
  });

  const { currentUser } = useAuth();
  const user_id = currentUser?.user_id;

  // 1. Lấy danh sách đánh giá
  useEffect(() => {
    if (!productId) return;
    axios
      .get(`${API_BASE_URL}/reviews/product/${productId}`)
      .then((res) => setReviews(res.data))
      .catch((err) => console.error('Lỗi lấy đánh giá:', err));
  }, [productId]);

  // 2. Kiểm tra đã mua & đã đánh giá chưa
  useEffect(() => {
    if (!user_id || !productId) return;

    axios
      .get(`${API_BASE_URL}/orders/check-user-purchased/${user_id}/${productId}`)
      .then((res) => setHasPurchased(res.data.purchased))
      .catch((err) => console.error('Lỗi kiểm tra đã mua:', err));

    axios
      .get(`${API_BASE_URL}/reviews/user/${user_id}/product/${productId}`)
      .then((res) => setHasReviewed(res.data.reviewed))
      .catch((err) => console.error('Lỗi kiểm tra đã đánh giá:', err));
  }, [user_id, productId]);

  // 3. Gửi đánh giá
  const handleSubmitReview = async () => {
    if (!user_id || !rating || !comment.trim()) return;

    try {
      const response = await axios.post(`${API_BASE_URL}/reviews`, {
        user_id,
        product_id: productId,
        rating,
        comment,
      });
      setSnackbar({ open: true, message: '✅ Gửi đánh giá thành công!', severity: 'success' });
      setReviews((prev) => [
        {
          review_id: response.data.review_id,
          user_id,
          username: currentUser.full_name,
          product_id: Number(productId),
          product_name: '',
          rating,
          comment,
          created_at: new Date().toISOString(),
        },
        ...prev,
      ]);
      setHasReviewed(true);
      setComment('');
      setRating(null);
    } catch (err) {
      console.error('Gửi đánh giá thất bại:', err);
      setSnackbar({ open: true, message: '❌ Gửi đánh giá thất bại!', severity: 'error' });
    }
  };

  return (
    <Box mt={3}>
      <Typography variant="h5" fontWeight={600} gutterBottom>
        Đánh giá sản phẩm
      </Typography>

      {user_id && hasPurchased && !hasReviewed && (
        <Box mb={4}>
          <Typography variant="subtitle1">Gửi đánh giá của bạn:</Typography>
          <Rating value={rating} onChange={(_e, val) => setRating(val)} />
          <TextField
            fullWidth
            multiline
            rows={3}
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Nhập nhận xét về sản phẩm..."
            sx={{ mt: 2 }}
          />
          <Button
            variant="contained"
            sx={{ mt: 2 }}
            onClick={handleSubmitReview}
            disabled={!rating || !comment.trim()}
          >
            Gửi đánh giá
          </Button>
        </Box>
      )}

      {reviews.length === 0 ? (
        <Typography>Chưa có đánh giá nào.</Typography>
      ) : (
        reviews.map((r) => (
          <Box key={r.review_id} mb={3}>
            <Rating value={r.rating} readOnly />
            <Typography sx={{ whiteSpace: 'pre-line' }}>{r.comment}</Typography>
            <Typography variant="caption" color="text.secondary">
              {r.username} - {new Date(r.created_at).toLocaleString('vi-VN')}
            </Typography>
            <Divider sx={{ my: 2 }} />
          </Box>
        ))
      )}

      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}
      >
        <Alert severity={snackbar.severity}>{snackbar.message}</Alert>
      </Snackbar>
    </Box>
  );
};

export default ProductReview;
