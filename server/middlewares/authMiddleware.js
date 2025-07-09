// server/middleware/authMiddleware.js
import jwt from "jsonwebtoken";
import { db } from "../config/connectBD.js";
import dotenv from "dotenv";

dotenv.config(); 
// const SECRET_KEY = process.env.JWT_SECRET || "a-string-secret-at-least-256-bits-long";
const SECRET_KEY = process.env.JWT_SECRET || "fallback_secret_if_env_fails"; // ✅ Đảm bảo đọc từ process.env
console.log('authController SECRET_KEY (tạo token - FROM ENV):', SECRET_KEY);
export const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) {
    return res.status(401).json({ message: "Không có token, vui lòng đăng nhập!" }); // 401 Unauthorized
  }

  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    req.user = decoded; 
    next();
  } catch (error) {
    console.error("Lỗi xác thực JWT:", error); 
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({ message: "Phiên đăng nhập đã hết hạn, vui lòng đăng nhập lại." }); // 401 Unauthorized
    }
    // Đối với các lỗi khác (JsonWebTokenError - token invalid/malformed)
    return res.status(403).json({ message: "Token không hợp lệ!" }); // 403 Forbidden
  }
};

export const checkRole = (roles) => async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res.status(401).json({ message: "Không tìm thấy token!" });
    }

    const decoded = jwt.verify(token, SECRET_KEY);
    
    const [users] = await db.promise().query(
      "SELECT role FROM users WHERE user_id = ?",
      [decoded.id]
    );

    if (users.length === 0) {
      return res.status(404).json({ message: "Không tìm thấy người dùng." });
    }

    if (!roles.includes(users[0].role)) {
      return res.status(403).json({ message: "Bạn không có quyền truy cập vào tài nguyên này!" });
    }

    req.user = decoded; 
    next();
  } catch (error) {
    console.error("Lỗi kiểm tra vai trò:", error); 
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({ message: "Phiên đăng nhập đã hết hạn, vui lòng đăng nhập lại." });
    }
    return res.status(403).json({ message: "Token không hợp lệ hoặc không có quyền!" });
  }
};

