import { db } from "../config/connectBD.js";

// ✅ Lấy danh sách sản phẩm
export const getAllProducts = (req, res) => {
  db.query("SELECT * FROM products", (err, result) => {
    if (err) return res.status(500).json({ error: err });
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
    if (err) return res.status(500).json({ error: err });
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
    if (err) return res.status(500).json({ error: err });

    const oldThumbnail = results[0]?.thumbnail;
    const finalThumbnail = newThumbnail || oldThumbnail;

    const sql = `
      UPDATE products 
      SET name = ?, price = ?, quantity = ?, description = ?, category_id = ?, brand_id = ?, thumbnail = ?
      WHERE product_id = ?
    `;
    const params = [name, price, quantity, description, category_id, brand_id, finalThumbnail, id];

    db.query(sql, params, (err) => {
      if (err) return res.status(500).json({ error: err });
      res.json({ message: "✅ Cập nhật sản phẩm thành công" });
    });
  });
};



// ✅ Xoá sản phẩm
export const deleteProduct = (req, res) => {
  const { id } = req.params;
  db.query("DELETE FROM products WHERE product_id = ?", [id], (err) => {
    if (err) return res.status(500).json({ error: err });
    res.json({ message: "🗑️ Xoá sản phẩm thành công" });
  });
};
// ✅ Sửa file controllers/productController.js
export const getProductsByCategorySlug = (req, res) => {
  const { slug } = req.params;

  const sql = `
    SELECT p.* FROM products p
    JOIN categories c ON p.category_id = c.category_id
    WHERE c.slug = ?
  `;

  db.query(sql, [slug], (err, result) => {
    if (err) {
      console.error('Lỗi khi truy vấn:', err);
      return res.status(500).json({ error: 'Lỗi server' });
    }

    if (result.length === 0) {
      return res.status(404).json({ message: 'Không tìm thấy sản phẩm' });
    }

    res.json(result);
  });
};
export const getProductsByBrandSlug = (req, res) => {
  const { slug } = req.params;

  const sql = `
    SELECT p.* FROM products p
    JOIN brands b ON p.brand_id = b.brand_id
    WHERE b.slug = ?
  `;

  db.query(sql, [slug], (err, result) => {
    if (err) return res.status(500).json({ error: err });
    if (result.length === 0) return res.status(404).json({ message: 'Không tìm thấy sản phẩm' });

    res.json(result);
  });
};

