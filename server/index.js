import cors from "cors";
import express from "express";
import { db } from "./config/connectBD.js";
import authRoutes from "./routes/auth.js";
import brandsRouter from "./routes/brands.js";
import categoryRoutes from "./routes/categoryRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import ContactRoutes from "./routes/contact.js";
import orderRoutes from "./routes/order.js";
import userRoutes from "./routes/user.js";
import cartRouter from "./routes/cart.js";
import paymentRoutes from "./routes/paymentRoutes.js";
import dotenv from "dotenv";
import postRoutes from './routes/postRoutes.js';
import favoriteProductsRoutes from "./routes/favoriteProductsRoutes.js";
import discountCodeRoutes from "./routes/discountCodeRoutes.js";
import reviewRoutes from "./routes/reviewRoutes.js";
import shippingRoutes from "./routes/shipping.js";

dotenv.config(); // ⬅️ THÊM DÒNG NÀY Ở TRÊN CÙNG
console.log('EMAIL_USER from .env:', process.env.EMAIL_USER);
console.log('EMAIL_PASS from .env:', process.env.EMAIL_PASS ? '********' : 'NOT_SET'); // KHÔNG IN MẬT KHẨU TRỰC TIẾP
// ... các dòng code khác
const app = express();

// Kết nối MySQL
db.connect((err) => {
  if (err) {
    console.error("❌ Không thể kết nối MySQL:", err);
  } else {
    console.log("✅ Kết nối MySQL thành công!");
  }
});
// Cấu hình middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/uploads", express.static("uploads"));

// Router
app.use("/api/products", productRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/brands", brandsRouter);
app.use("/api/cart", cartRouter);
app.use("/api/contact", ContactRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/users", userRoutes);
app.use("/api/payments", paymentRoutes);
app.use('/api/posts', postRoutes); 
app.use('/api/favorites', favoriteProductsRoutes);
<<<<<<< HEAD
// === THÊM API ENDPOINT CHO MÃ GIẢM GIÁ VÀO ĐÂY ===
app.get('/api/codes', (req, res) => {
    const query = 'SELECT code_id, code, description, discount_percent, discount_amount, start_date, end_date FROM codes ORDER BY end_date ASC';

    db.query(query, (err, results) => {
        if (err) {
            console.error('Lỗi khi lấy mã giảm giá từ DB:', err);
            return res.status(500).json({
                success: false,
                message: 'Đã xảy ra lỗi khi lấy mã giảm giá. Vui lòng thử lại sau.',
                error: err.message
            });
        }
        res.json({
            success: true,
            message: 'Lấy danh sách mã giảm giá thành công!',
            codes: results
        });
    });
});
// =================================================
=======
app.use('/api/discounts', discountCodeRoutes);
app.use('/api/reviews', reviewRoutes); 
app.use('/api/shipping', shippingRoutes);
>>>>>>> 819baa1be52293ee901395dc501f5b91f799b09e
// Xử lý lỗi
app.use((req, res) => {
  res.status(404).json({ message: "Không tìm thấy tài nguyên!" });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Đã xảy ra lỗi máy chủ!" });
});

// --- API Endpoint: Tìm kiếm sản phẩm (Client-side filtering thì không cần endpoint này) ---
// Nếu bạn muốn tìm kiếm server-side, bạn sẽ cần endpoint này
app.get('/api/products/search', async (req, res) => {
    const searchTerm = req.query.q; // Lấy từ khóa tìm kiếm từ query parameter 'q'

    if (!searchTerm) {
        return res.status(400).json({ error: 'Search term is required' });
    }

    const searchKeyword = `%${searchTerm}%`;

    try {
        const [rows] = await pool.execute(
            `SELECT * FROM \`products\` 
             WHERE \`name\` LIKE ? OR \`short_description\` LIKE ? OR \`description\` LIKE ? 
             ORDER BY product_id DESC`,
            [searchKeyword, searchKeyword, searchKeyword]
        );
        res.json(rows);
    } catch (error) {
        console.error('Error searching products:', error);
        res.status(500).json({ error: 'Failed to search products' });
    }
});



// Khởi động server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 ExpressJS server started on http://localhost:${PORT}`);
});
