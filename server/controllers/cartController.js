// 📁 controllers/cartController.js
import { db } from "../config/connectBD.js";

// ✅ Lấy tất cả sản phẩm trong giỏ hàng của người dùng
export const getCartItems = (req, res) => {
  const { user_id } = req.params;

  const sql = `
    SELECT
      c.quantity,
      p.product_id,
      p.name,
      p.price,
      p.thumbnail
    FROM cart c
    JOIN products p ON c.product_id = p.product_id
    WHERE c.user_id = ?
  `;

  db.query(sql, [user_id], (err, result) => {
    if (err) {
      console.error('Lỗi khi lấy giỏ hàng:', err);
      return res.status(500).json({ error: 'Lỗi server' });
    }
    res.json(result);
  });
};

// ✅ Cập nhật số lượng sản phẩm trong giỏ
export const updateCartItemQuantity = (req, res) => {
  const { user_id, product_id } = req.params;
  const { quantity } = req.body;

  const sql = "UPDATE cart SET quantity = ? WHERE user_id = ? AND product_id = ?";
  db.query(sql, [quantity, user_id, product_id], (err) => {
    if (err) return res.status(500).json({ error: err });
    res.json({ message: "✅ Cập nhật số lượng thành công" });
  });
};

// ✅ Xoá sản phẩm khỏi giỏ hàng
export const removeCartItem = (req, res) => {
  const { user_id, product_id } = req.params;

  const sql = "DELETE FROM cart WHERE user_id = ? AND product_id = ?";
  db.query(sql, [user_id, product_id], (err) => {
    if (err) return res.status(500).json({ error: err });
    res.json({ message: "✅ Xoá sản phẩm khỏi giỏ hàng thành công" });
  });
};

// ✅ Thêm sản phẩm vào giỏ hàng (code cũ của bạn)
export const addToCart = (req, res) => {
  const { user_id, product_id, quantity } = req.body;
  if (!user_id || !product_id || !quantity) {
    return res.status(400).json({ error: 'Vui lòng cung cấp đầy đủ thông tin' });
  }
  const checkSql = "SELECT * FROM cart WHERE user_id = ? AND product_id = ?";
  db.query(checkSql, [user_id, product_id], (err, result) => {
    if (err) return res.status(500).json({ error: err });
    if (result.length > 0) {
      const updateSql = "UPDATE cart SET quantity = quantity + ? WHERE user_id = ? AND product_id = ?";
      db.query(updateSql, [quantity, user_id, product_id], (err) => {
        if (err) return res.status(500).json({ error: err });
        return res.json({ message: "✅ Cập nhật số lượng sản phẩm trong giỏ hàng thành công" });
      });
    } else {
      const insertSql = "INSERT INTO cart (user_id, product_id, quantity) VALUES (?, ?, ?)";
      db.query(insertSql, [user_id, product_id, quantity], (err) => {
        if (err) return res.status(500).json({ error: err });
        return res.json({ message: "✅ Thêm sản phẩm vào giỏ hàng thành công" });
      });
    }
  });
};