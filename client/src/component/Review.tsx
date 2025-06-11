import { useState, useEffect } from "react";
import axios from "axios";

type Review = {
  _id?: string;
  user: string;
  rating: number;
  comment: string;
  createdAt?: string;
};

type Props = {
  productId: string;
};

export default function ProductReviews({ productId }: Props) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [newReview, setNewReview] = useState({ user: "", rating: 5, comment: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Lấy danh sách đánh giá từ backend
  useEffect(() => {
    setLoading(true);
    axios
      .get(`http://localhost:3000/api/reviews/product/${productId}`)
      .then((res) => setReviews(res.data))
      .catch(() => setError("Không tải được đánh giá"))
      .finally(() => setLoading(false));
  }, [productId]);

  // Xử lý submit đánh giá mới
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReview.user || !newReview.comment) {
      setError("Vui lòng nhập đầy đủ thông tin");
      return;
    }
    try {
      const res = await axios.post(`http://localhost:3000/api/reviews/product/${productId}`, newReview);
      setReviews((prev) => [res.data, ...prev]);
      setNewReview({ user: "", rating: 5, comment: "" });
      setError("");
    } catch {
      setError("Gửi đánh giá thất bại");
    }
  };

  return (
    <div>
      <h3>Đánh giá sản phẩm</h3>

      {loading && <p>Đang tải đánh giá...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      {/* Form thêm đánh giá */}
      <form onSubmit={handleSubmit} style={{ marginBottom: 20 }}>
        <input
          type="text"
          placeholder="Tên bạn"
          value={newReview.user}
          onChange={(e) => setNewReview({ ...newReview, user: e.target.value })}
          style={{ width: "200px", marginRight: 10 }}
        />
        <select
          value={newReview.rating}
          onChange={(e) => setNewReview({ ...newReview, rating: Number(e.target.value) })}
          style={{ marginRight: 10 }}
        >
          {[5, 4, 3, 2, 1].map((star) => (
            <option key={star} value={star}>{star} sao</option>
          ))}
        </select>
        <input
          type="text"
          placeholder="Viết đánh giá..."
          value={newReview.comment}
          onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
          style={{ width: "300px", marginRight: 10 }}
        />
        <button type="submit">Gửi đánh giá</button>
      </form>

      {/* Hiển thị danh sách đánh giá */}
      {reviews.length === 0 ? (
        <p>Chưa có đánh giá nào.</p>
      ) : (
        <ul style={{ listStyle: "none", paddingLeft: 0 }}>
          {reviews.map((r) => (
            <li key={r._id} style={{ marginBottom: 15, borderBottom: "1px solid #ccc", paddingBottom: 10 }}>
              <strong>{r.user}</strong> - <em>{r.rating} sao</em>
              <p>{r.comment}</p>
              <small>{new Date(r.createdAt || "").toLocaleDateString()}</small>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
