// server/index.js (hoặc server.js) - ĐÃ SỬA CHỮA HOÀN TOÀN cho ES Modules
import express from "express";
import dotenv from "dotenv"; // THAY ĐỔI: import dotenv từ "dotenv"
import cors from 'cors';
import mysql from 'mysql2/promise'; 

// Import các routes của bạn (đảm bảo đường dẫn chính xác và có .js)
import categoryRoutes from "./routes/categoryRoutes.js"; // NHỚ THÊM .js
import brandsRouter from "./routes/brands.js";         // NHỚ THÊM .js
import ContactRoutes from "./routes/contact.js";       // NHỚ THÊM .js
import cartRoutes from "./routes/cart.js";             // NHỚ THÊM .js

// Routes của Authentication và User Management (đảm bảo đúng đường dẫn và có .js)
import authRoutes from "./routes/auth.js";
import userRoutes from "./routes/users.js";

// Load biến môi trường từ .env
dotenv.config(); // THAY ĐỔI: chỉ cần gọi .config() sau khi import

const app = express();
const PORT = process.env.PORT || 3000;

// Cấu hình kết nối MySQL (Được lặp lại trong mỗi route để đảm bảo độc lập, có thể tối ưu bằng cách tạo module DB riêng)
const dbConfig = {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT,
};

// Test kết nối DB khi server khởi động
const testDbConnection = async () => {
    try {
        const connection = await mysql.createConnection(dbConfig);
        console.log('✅ Kết nối MySQL thành công!');
        connection.end();
    } catch (err) {
        console.error('❌ Lỗi kết nối MySQL:', err.message);
        process.exit(1); // Thoát ứng dụng nếu không kết nối được DB
    }
};
testDbConnection();


// Middleware
// app.use(express.static("public")); // Nếu bạn có thư mục public cho frontend tĩnh
app.use('/uploads', express.static('uploads')); // Cho phép phục vụ file tĩnh từ thư mục uploads
app.use(express.json()); // Middleware để đọc JSON từ body request
app.use(cors()); // Cho phép Cross-Origin Requests

// --- Định nghĩa các Routes API ---

// Các routes của hệ thống bạn
app.use("/api/categories", categoryRoutes);
app.use('/api/brands', brandsRouter);
app.use('/api/cart', cartRoutes);
app.use('/api', ContactRoutes); 

// Các routes Authentication và User Management
app.use('/api/auth', authRoutes); 
app.use('/api/users', userRoutes); 

// --- Xử lý các route không tồn tại (404) ---
// Middleware này phải nằm SAU TẤT CẢ các định nghĩa route khác
app.use((req, res, next) => {
    res.status(404).json({ message: 'Endpoint không tìm thấy.' });
});

// --- Xử lý lỗi tập trung (500 Internal Server Error) ---
// Middleware này phải nằm CUỐI CÙNG trong chuỗi middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Lỗi server nội bộ.', error: err.message });
});

// Khởi động server
app.listen(PORT, () => {
  console.log(`ExpressJS server đang chạy trên cổng ${PORT}!!!`);
  console.log(`API đăng nhập: http://localhost:${PORT}/api/auth/login`);
  console.log(`API quản lý người dùng: http://localhost:${PORT}/api/users`);
});