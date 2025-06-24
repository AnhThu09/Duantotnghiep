// backend/routes/auth.js (ĐÃ SỬA CHỮA HOÀN TOÀN cho ES Modules)
import express from 'express';     // THAY ĐỔI: từ const express = require('express');
import mysql from 'mysql2/promise'; // THAY ĐỔI: từ const mysql = require('mysql2/promise');
import bcrypt from 'bcryptjs';     // THAY ĐỔI: từ const bcrypt = require('bcryptjs');
import jwt from 'jsonwebtoken';    // THAY ĐỔI: từ const jwt = require('jsonwebtoken');

const router = express.Router();

// QUAN TRỌNG: dbConfig cần phải truy cập được trong module này.
// Hoặc định nghĩa nó ở đây lại (như ví dụ), hoặc import từ một file cấu hình chung.
// Để đơn giản trong các file route riêng lẻ, việc định nghĩa lại là phổ biến.
const dbConfig = {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT,
};

// POST /api/auth/login
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: 'Vui lòng nhập email và mật khẩu.' });
    }

    try {
        const connection = await mysql.createConnection(dbConfig);
        const [users] = await connection.execute('SELECT user_id, email, password_hash, full_name, role FROM users WHERE email = ?', [email]);
        connection.end();

        if (users.length === 0) {
            return res.status(400).json({ message: 'Email hoặc mật khẩu không đúng.' });
        }

        const user = users[0];

        // So sánh mật khẩu đã mã hóa
        const isMatch = await bcrypt.compare(password, user.password_hash);
        if (!isMatch) {
            return res.status(400).json({ message: 'Email hoặc mật khẩu không đúng.' });
        }

        // Tạo JWT
        const token = jwt.sign(
            { user_id: user.user_id, role: user.role, full_name: user.full_name, email: user.email }, // Payload (thêm full_name, email để context có đủ thông tin)
            process.env.JWT_SECRET, // Secret Key từ .env
            { expiresIn: '1h' } // Token hết hạn sau 1 giờ
        );

        res.json({
            message: 'Đăng nhập thành công!',
            token,
            user: { // Trả về thông tin user cần thiết cho frontend
                user_id: user.user_id,
                full_name: user.full_name,
                email: user.email,
                role: user.role,
            },
        });

    } catch (err) {
        console.error('Lỗi đăng nhập:', err);
        res.status(500).json({ message: 'Lỗi server khi đăng nhập.' });
    }
});

export default router; // THAY ĐỔI: từ module.exports = router;