// 📁 server/controllers/productController.js

import { db } from "../config/connectBD.js"; // Đảm bảo đường dẫn này đúng

// ✅ Lấy danh sách sản phẩm hoặc tìm kiếm sản phẩm
// Hàm dùng chung để xử lý Tìm kiếm và Lọc
export const getAllProducts = (req, res) => {
    const { search, category } = req.query; 

    // Khai báo conditions và params ngay từ đầu
    const conditions = [];
    const params = [];
    let sql = "";
    
    // Xây dựng phần SELECT và JOINs
    // Chúng ta sẽ luôn SELECT các trường cơ bản và JOIN với brands
    sql = `
        SELECT 
            p.*, 
            b.brand_name 
        FROM 
            products p
        LEFT JOIN 
            brands b ON p.brand_id = b.brand_id
    `;

    // --- Xử lý Lọc theo Category Slug ---
    if (category) {
        // Nếu có lọc theo category, thêm JOIN categories
        sql += ` JOIN categories c ON p.category_id = c.category_id `;
        conditions.push(`c.slug = ?`);
        params.push(category);
    }

    // --- Xử lý Tìm kiếm (SEARCH) ---
    // Sử dụng cột 'name' và 'description' để tìm kiếm
    if (search) {
        // Tìm kiếm theo tên hoặc mô tả
        conditions.push(`(p.name LIKE ? OR p.description LIKE ?)`);
        const searchTerm = `%${search}%`;
        params.push(searchTerm, searchTerm);
    }

    // --- Xây dựng WHERE clause ---
    if (conditions.length > 0) {
        sql += ` WHERE ` + conditions.join(' AND ');
    }

    // --- Sắp xếp ---
    sql += ` ORDER BY p.product_id DESC`;

    db.query(sql, params, (err, result) => {
        if (err) {
            console.error('Lỗi khi lấy sản phẩm:', err); 
            // Nếu có lỗi, kiểm tra lại tên cột và bảng (brands, categories)
            return res.status(500).json({ error: "Lỗi máy chủ khi lấy sản phẩm.", details: err.message });
        }
        res.json(result);
    });
};
// ✅ Lấy chi tiết sản phẩm theo ID
export const getProductById = (req, res) => {
  const { id } = req.params; // Lấy ID sản phẩm từ URL (ví dụ: /products/19)

  const sql = "SELECT * FROM products WHERE product_id = ?"; // Truy vấn sản phẩm theo product_id

  db.query(sql, [id], (err, result) => {
    if (err) {
      console.error('Lỗi khi lấy chi tiết sản phẩm:', err); // Log lỗi server
      return res.status(500).json({ error: "Lỗi máy chủ khi lấy chi tiết sản phẩm." });
    }

    if (result.length === 0) {
      // Nếu không tìm thấy sản phẩm với ID này
      return res.status(404).json({ message: "Không tìm thấy sản phẩm này." });
    }

    // Trả về sản phẩm đầu tiên tìm thấy (chắc chắn chỉ có một)
    res.json(result[0]);
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
