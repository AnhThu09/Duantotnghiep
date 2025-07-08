import jwt from "jsonwebtoken";
import { db } from "../config/connectBD.js";

const SECRET_KEY = "a-string-secret-at-least-256-bits-long"; // Nên đưa vào biến môi trường .env

// ✅ Hàm lấy token từ header và kiểm tra hợp lệ
const verifyToken = (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return { error: true, res: res.status(401).json({ message: "Không tìm thấy token!" }) };
  }

  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    return { error: false, decoded };
  } catch (error) {
    console.error(error);
    const message =
      error.name === "TokenExpiredError"
        ? "Token đã hết hạn!"
        : "Token không hợp lệ!";
    return { error: true, res: res.status(401).json({ message }) };
  }
};

// ✅ Middleware xác thực người dùng
export const authMiddleware = (req, res, next) => {
  const { error, decoded, res: errorResponse } = verifyToken(req, res);
  if (error) return errorResponse;

  req.user = decoded;
  next();
};

// ✅ Middleware kiểm tra phân quyền
export const checkRole = (roles) => async (req, res, next) => {
  const { error, decoded, res: errorResponse } = verifyToken(req, res);
  if (error) return errorResponse;

  try {
    const [users] = await db.promise().query(
      "SELECT role FROM users WHERE user_id = ?",
      [decoded.id]
    );

    if (!users.length || !roles.includes(users[0].role)) {
      return res.status(403).json({ message: "Không có quyền truy cập!" });
    }

    req.user = decoded;
    next();
  } catch (error) {
    console.error("Lỗi truy vấn role:", error);
    return res.status(500).json({ message: "Lỗi máy chủ khi kiểm tra vai trò!" });
  }
};
