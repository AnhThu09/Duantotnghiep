// 📁 server/controllers/favoriteController.js

import { db } from "../config/connectBD.js";

// ✅ Lấy danh sách sản phẩm yêu thích của một người dùng
export const getFavoriteProducts = (req, res) => {
  const { userId } = req.params;

  if (!userId) {
    return res.status(400).json({ message: "Vui lòng cung cấp ID người dùng." });
  }

  const sql = `
    SELECT
      p.product_id,
      p.name,
      p.price,
      p.thumbnail,
      p.description,
      p.quantity,
      p.category_id,
      p.brand_id
    FROM
      favorites fp  -- ✅ ĐÃ SỬA: từ favorite_products thành favorites
    JOIN
      products p ON fp.product_id = p.product_id
    WHERE
      fp.user_id = ?
    ORDER BY fp.created_at DESC -- ✅ ĐÃ SỬA: Tên cột bạn có trong ảnh là created_at, không phải added_at
  `;

  db.query(sql, [userId], (err, result) => {
    if (err) {
      console.error('Lỗi khi lấy sản phẩm yêu thích:', err);
      return res.status(500).json({ message: "Lỗi máy chủ khi lấy danh sách yêu thích." });
    }
    res.json(result);
  });
};

// ✅ Thêm sản phẩm vào danh sách yêu thích
export const addFavoriteProduct = (req, res) => {
  const { user_id, product_id } = req.body;

  if (!user_id || !product_id) {
    return res.status(400).json({ message: "Vui lòng cung cấp user_id và product_id." });
  }

  // Kiểm tra xem sản phẩm đã có trong danh sách yêu thích chưa
  const checkSql = "SELECT * FROM favorites WHERE user_id = ? AND product_id = ?"; // ✅ ĐÃ SỬA
  db.query(checkSql, [user_id, product_id], (err, result) => {
    if (err) {
      console.error('Lỗi khi kiểm tra sản phẩm yêu thích:', err);
      return res.status(500).json({ message: "Lỗi máy chủ." });
    }

    if (result.length > 0) {
      return res.status(409).json({ message: "Sản phẩm đã có trong danh sách yêu thích của bạn." });
    }

    // Thêm sản phẩm vào danh sách yêu thích
    const insertSql = "INSERT INTO favorites (user_id, product_id) VALUES (?, ?)"; // ✅ ĐÃ SỬA
    db.query(insertSql, [user_id, product_id], (err, insertResult) => {
      if (err) {
        console.error('Lỗi khi thêm sản phẩm vào yêu thích:', err);
        return res.status(500).json({ message: "Lỗi máy chủ khi thêm sản phẩm vào danh sách yêu thích." });
      }
      res.status(201).json({ message: "✅ Đã thêm sản phẩm vào danh sách yêu thích!" });
    });
  });
};

// ✅ Xóa sản phẩm khỏi danh sách yêu thích
export const removeFavoriteProduct = (req, res) => {
  const { userId, productId } = req.params;

  if (!userId || !productId) {
    return res.status(400).json({ message: "Vui lòng cung cấp user_id và product_id để xóa." });
  }

  const sql = "DELETE FROM favorites WHERE user_id = ? AND product_id = ?"; // ✅ ĐÃ SỬA
  db.query(sql, [userId, productId], (err, dbResult) => { // Thay result bằng dbResult để có access affectedRows
    if (err) {
      console.error('Lỗi khi xóa sản phẩm yêu thích:', err);
      return res.status(500).json({ message: "Lỗi máy chủ khi xóa sản phẩm yêu thích." });
    }
    // Kiểm tra xem có bản ghi nào bị ảnh hưởng không
    // Lưu ý: Cần kiểm tra cách driver DB của bạn trả về affectedRows.
    // Đối với 'mysql2' hoặc 'mysql', nó thường là dbResult.affectedRows
    if (dbResult && dbResult.affectedRows === 0) {
      return res.status(404).json({ message: "Không tìm thấy sản phẩm trong danh sách yêu thích để xóa." });
    }
    res.json({ message: "🗑️ Đã xóa sản phẩm khỏi danh sách yêu thích!" });
  });
};