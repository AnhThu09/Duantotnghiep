// 📁 server/controllers/productController.js

import { db } from "../config/connectBD.js"; // Đảm bảo đường dẫn này đúng

// ✅ Lấy danh sách sản phẩm hoặc tìm kiếm sản phẩm
export const getAllProducts = (req, res) => {
  const { search } = req.query; // Lấy tham số 'search' từ query string

  let sql = "SELECT * FROM products";
  const params = [];

  // Nếu có tham số tìm kiếm, thêm điều kiện WHERE vào câu truy vấn SQL
  if (search) {
    sql += " WHERE name LIKE ?"; // Giả sử bạn muốn tìm kiếm theo trường 'name'
    params.push(`%${search}%`); // Thêm wildcard % để tìm kiếm linh hoạt
  }

  // Thêm ORDER BY nếu cần thiết (tùy chọn)
  sql += " ORDER BY product_id DESC"; // Sắp xếp theo ID mới nhất hoặc theo tên, v.v.

  db.query(sql, params, (err, result) => {
    if (err) {
      console.error('Lỗi khi lấy sản phẩm:', err); // Log lỗi để dễ debug
      return res.status(500).json({ error: "Lỗi máy chủ khi lấy sản phẩm." });
    }
    res.json(result);
  });
};

// ✅ Thêm sản phẩm (bắt buộc ảnh, category_id, brand_id)
export const createProduct = (req, res) => {
  const { name, price, quantity, description, category_id, brand_id } = req.body;
  const thumbnail = req.file?.filename;

  if (!name || !price || !quantity || !thumbnail || !category_id || !brand_id) {
    return res.status(400).json({ error: 'Vui lòng điền đầy đủ thông tin hợp lệ' });
  }

  const sql = `
    INSERT INTO products (name, price, quantity, description, thumbnail, category_id, brand_id)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `;

  db.query(sql, [name, price, quantity, description, thumbnail, category_id, brand_id], (err, result) => {
    if (err) {
      console.error('Lỗi khi thêm sản phẩm:', err);
      return res.status(500).json({ error: "Lỗi máy chủ khi thêm sản phẩm." });
    }
    res.json({ message: "✅ Thêm sản phẩm thành công", id: result.insertId });
  });
};

export const updateProduct = (req, res) => {
  const { id } = req.params;
  const { name, price, quantity, description, category_id, brand_id } = req.body;
  const newThumbnail = req.file?.filename;

  // Nếu không có ảnh mới → lấy ảnh cũ từ DB
  const getOldThumbnailQuery = "SELECT thumbnail FROM products WHERE product_id = ?";
  db.query(getOldThumbnailQuery, [id], (err, results) => {
    if (err) {
      console.error('Lỗi khi lấy ảnh cũ để cập nhật sản phẩm:', err);
      return res.status(500).json({ error: "Lỗi máy chủ khi cập nhật sản phẩm." });
    }

    const oldThumbnail = results[0]?.thumbnail;
    const finalThumbnail = newThumbnail || oldThumbnail;

    const sql = `
      UPDATE products
      SET name = ?, price = ?, quantity = ?, description = ?, category_id = ?, brand_id = ?, thumbnail = ?
      WHERE product_id = ?
    `;
    const params = [name, price, quantity, description, category_id, brand_id, finalThumbnail, id];

    db.query(sql, params, (err) => {
      if (err) {
        console.error('Lỗi khi cập nhật sản phẩm:', err);
        return res.status(500).json({ error: "Lỗi máy chủ khi cập nhật sản phẩm." });
      }
      res.json({ message: "✅ Cập nhật sản phẩm thành công" });
    });
  });
};


// ✅ Xoá sản phẩm
export const deleteProduct = (req, res) => {
  const { id } = req.params;
  db.query("DELETE FROM products WHERE product_id = ?", [id], (err) => {
    if (err) {
      console.error('Lỗi khi xóa sản phẩm:', err);
      return res.status(500).json({ error: "Lỗi máy chủ khi xóa sản phẩm." });
    }
    res.json({ message: "🗑️ Xoá sản phẩm thành công" });
  });
};

// ✅ Lấy sản phẩm theo category slug
export const getProductsByCategorySlug = (req, res) => {
  const { slug } = req.params;

  const sql = `
    SELECT p.* FROM products p
    JOIN categories c ON p.category_id = c.category_id
    WHERE c.slug = ?
  `;

  db.query(sql, [slug], (err, result) => {
    if (err) {
      console.error('Lỗi khi truy vấn sản phẩm theo category slug:', err);
      return res.status(500).json({ error: 'Lỗi server' });
    }

    if (result.length === 0) {
      return res.status(404).json({ message: 'Không tìm thấy sản phẩm thuộc danh mục này.' });
    }

    res.json(result);
  });
};

// ✅ Lấy sản phẩm theo brand slug
export const getProductsByBrandSlug = (req, res) => {
  const { slug } = req.params;

  const sql = `
    SELECT p.* FROM products p
    JOIN brands b ON p.brand_id = b.brand_id
    WHERE b.slug = ?
  `;

  db.query(sql, [slug], (err, result) => {
    if (err) {
      console.error('Lỗi khi truy vấn sản phẩm theo brand slug:', err);
      return res.status(500).json({ error: "Lỗi máy chủ khi lấy sản phẩm theo thương hiệu." });
    }
    if (result.length === 0) return res.status(404).json({ message: 'Không tìm thấy sản phẩm thuộc thương hiệu này.' });

    res.json(result);
  });
};