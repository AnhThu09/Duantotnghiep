import { db } from '../config/connectBD.js';

export const createContact = (req, res) => {
  const { name, phone, email, message } = req.body;

  if (!name || !phone || !email || !message) {
    return res.status(400).json({ error: 'Vui lòng điền đầy đủ thông tin' });
  }

  const sql = `INSERT INTO contact_forms (name, phone, email, message) VALUES (?, ?, ?, ?)`;

  db.query(sql, [name, phone, email, message], (err, result) => {
    if (err) {
      console.error('❌ Lỗi khi lưu liên hệ:', err);
      return res.status(500).json({ error: 'Lỗi server' });
    }
    res.json({ message: 'Gửi thành công' });
  });
};