import { db } from "../config/connectBD.js"; 

// Lấy danh sách sản phẩm trong giỏ hàng của 1 user
export const getCartItems = (req, res) => {
  const { userId } = req.params;
  const sql = `
    SELECT c.cart_item_id, c.product_id, p.name, p.price, p.image, c.quantity
    FROM cart_items c
    JOIN products p ON c.product_id = p.product_id
    WHERE c.user_id = ?
  `;
  db.query(sql, [userId], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
};

// Thêm sản phẩm vào giỏ hàng
export const addToCart = (req, res) => {
  const { user_id, product_id, quantity } = req.body;

  const checkSql = `SELECT * FROM cart_items WHERE user_id = ? AND product_id = ?`;
  db.query(checkSql, [user_id, product_id], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });

    if (rows.length > 0) {
      // Nếu sản phẩm đã có, cập nhật số lượng
      const updateSql = `UPDATE cart_items SET quantity = quantity + ? WHERE user_id = ? AND product_id = ?`;
      db.query(updateSql, [quantity, user_id, product_id], (err2) => {
        if (err2) return res.status(500).json({ error: err2.message });
        res.json({ message: 'Cập nhật số lượng thành công' });
      });
    } else {
      // Nếu chưa có, thêm mới
      const insertSql = `INSERT INTO cart_items (user_id, product_id, quantity) VALUES (?, ?, ?)`;
      db.query(insertSql, [user_id, product_id, quantity], (err3) => {
        if (err3) return res.status(500).json({ error: err3.message });
        res.json({ message: 'Thêm vào giỏ hàng thành công' });
      });
    }
  });
};

// Cập nhật số lượng sản phẩm
export const updateCartItem = (req, res) => {
  const { cartItemId } = req.params;
  const { quantity } = req.body;

  const sql = `UPDATE cart_items SET quantity = ? WHERE cart_item_id = ?`;
  db.query(sql, [quantity, cartItemId], (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: 'Cập nhật giỏ hàng thành công' });
  });
};

// Xóa 1 sản phẩm khỏi giỏ hàng
export const deleteCartItem = (req, res) => {
  const { cartItemId } = req.params;

  const sql = `DELETE FROM cart_items WHERE cart_item_id = ?`;
  db.query(sql, [cartItemId], (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: 'Xóa sản phẩm khỏi giỏ hàng thành công' });
  });
};

// Xóa toàn bộ giỏ hàng sau khi đặt hàng (tuỳ chọn)
export const clearCart = (req, res) => {
  const { userId } = req.params;

  const sql = `DELETE FROM cart_items WHERE user_id = ?`;
  db.query(sql, [userId], (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: 'Đã xoá toàn bộ giỏ hàng' });
  });
};
