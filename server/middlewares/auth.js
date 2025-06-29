import jwt from "jsonwebtoken";
import { db } from "../config/connectBD.js";

const SECRET_KEY = "a-string-secret-at-least-256-bits-long";

export const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) {
    return res.status(401).json({ message: "Không tìm thấy token!" });
  }

  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    req.user = decoded;
    next();
  } catch (error) {
    console.error(error);
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({ message: "Token đã hết hạn!" });
    }
    return res.status(401).json({ message: "Token không hợp lệ!" });
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

    if (users.length === 0 || !roles.includes(users[0].role)) {
      return res.status(403).json({ message: "Không có quyền truy cập!" });
    }

    req.user = decoded;
    next();
  } catch (error) {
    console.error(error);
    return res.status(401).json({ message: "Token không hợp lệ!" });
  }
};
