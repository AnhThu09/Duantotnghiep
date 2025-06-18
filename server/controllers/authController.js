import { db } from "../config/connectBD.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const SECRET_KEY = "secret"; // Nên dùng biến môi trường .env

// Đăng ký
export const register = (req, res) => {
  const { username, email, password } = req.body;

  const checkUser = "SELECT * FROM users WHERE username = ?";
  db.query(checkUser, [username], (err, data) => {
    if (err) return res.status(500).json(err);
    if (data.length > 0) return res.status(409).json("Tài khoản đã tồn tại!");

    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(password, salt);

    const insert = "INSERT INTO users (username, email, password) VALUES (?, ?, ?)";
    db.query(insert, [username, email, hash], (err2) => {
      if (err2) return res.status(500).json(err2);
      res.status(201).json("Đăng ký thành công!");
    });
  });
};

// Đăng nhập
export const login = (req, res) => {
  const { username, password } = req.body;

  const sql = "SELECT * FROM users WHERE username = ?";
  db.query(sql, [username], (err, data) => {
    if (err) return res.status(500).json(err);
    if (data.length === 0) return res.status(404).json("Không tìm thấy tài khoản!");

    const isPasswordValid = bcrypt.compareSync(password, data[0].password);
    if (!isPasswordValid) return res.status(401).json("Mật khẩu không đúng!");

    const token = jwt.sign({ id: data[0].user_id }, SECRET_KEY, { expiresIn: "1d" });

    res
      .cookie("access_token", token, {
        httpOnly: true,
        secure: false, // true nếu dùng HTTPS
        sameSite: "lax",
      })
      .status(200)
      .json({ message: "Đăng nhập thành công", user: { id: data[0].user_id, username } });
  });
};

// Đăng xuất
export const logout = (req, res) => {
  res
    .clearCookie("access_token")
    .status(200)
    .json("Đăng xuất thành công!");
};
