import { db } from "../config/connectBD.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const SECRET_KEY = "a-string-secret-at-least-256-bits-long";

export const register = async (req, res) => {
  const { full_name, email, password_hash, phone_number } = req.body;

  try {
    if (!full_name || !email || !password_hash || !phone_number) {
      return res.status(400).json({
        message: "Vui lòng nhập đầy đủ thông tin",
      });
    }

    const [users] = await db.promise().query(
      "SELECT * FROM users WHERE email = ?",
      [email]
    );
    if (users.length > 0) {
      return res.status(409).json({
        message: "Email đã tồn tại, vui lòng chọn email khác!",
      });
    }

    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(password_hash, salt);

    await db.promise().query(
      "INSERT INTO users (full_name, email, password_hash, phone_number) VALUES (?, ?, ?, ?)",
      [full_name, email, hash, phone_number]
    );

    res.status(201).json({
      message: "Đăng ký thành công",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Đăng ký thất bại" });
  }
};

export const login = async (req, res) => {
  const { email, password_hash } = req.body;

  try {
    if (!email || !password_hash) {
      return res.status(400).json({
        message: "Vui lòng nhập email và mật khẩu",
      });
    }

    const [users] = await db.promise().query(
      "SELECT * FROM users WHERE email = ?",
      [email]
    );

    if (users.length === 0) {
      return res.status(404).json({
        message: "Không tìm thấy tài khoản!",
      });
    }

    const user = users[0];
    const isPasswordValid = bcrypt.compareSync(password_hash, user.password_hash);

    if (!isPasswordValid) {
      return res.status(401).json({
        message: "Mật khẩu không đúng!",
      });
    }

    const token = jwt.sign({ id: user.user_id, role: user.role }, SECRET_KEY, { expiresIn: "1d" });

    res.status(200).json({
      message: "Đăng nhập thành công",
      token,
      user: {
        id: user.user_id,
        full_name: user.full_name,
        email: user.email,
        phone_number: user.phone_number,
        role: user.role,
      },
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Đăng nhập thất bại" });
  }
};

export const logout = async (req, res) => {
  try {
    res.status(200).json({ message: "Đăng xuất thành công" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Đăng xuất thất bại" });
  }
};
