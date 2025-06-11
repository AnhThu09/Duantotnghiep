import { db } from "../config/connectBD.js";

export const getAllBrands = (req, res) => {
  const query = "SELECT * FROM brands";
  db.query(query, (err, results) => {
    if (err) return res.status(500).json({ message: "Lỗi server" });
    res.json(results);
  });
};

export const getBrandById = (req, res) => {
  const query = "SELECT * FROM brands WHERE id = ?";
  db.query(query, [req.params.id], (err, results) => {
    if (err) return res.status(500).json({ message: "Lỗi server" });
    if (results.length === 0) return res.status(404).json({ message: "Không tìm thấy thương hiệu" });
    res.json(results[0]);
  });
};

export const createBrand = (req, res) => {
  const { name, description } = req.body;
  if (!name) return res.status(400).json({ message: "Tên thương hiệu là bắt buộc" });

  const query = "INSERT INTO brands (name, description) VALUES (?, ?)";
  db.query(query, [name, description], (err, results) => {
    if (err) return res.status(500).json({ message: "Lỗi server" });
    res.status(201).json({ message: "Thêm thương hiệu thành công", id: results.insertId });
  });
};

export const updateBrand = (req, res) => {
  const { name, description } = req.body;
  const { id } = req.params;
  if (!name) return res.status(400).json({ message: "Tên thương hiệu là bắt buộc" });

  const query = "UPDATE brands SET name = ?, description = ? WHERE id = ?";
  db.query(query, [name, description, id], (err, results) => {
    if (err) return res.status(500).json({ message: "Lỗi server" });
    if (results.affectedRows === 0) return res.status(404).json({ message: "Không tìm thấy thương hiệu" });
    res.json({ message: "Cập nhật thương hiệu thành công" });
  });
};

export const deleteBrand = (req, res) => {
  const query = "DELETE FROM brands WHERE id = ?";
  db.query(query, [req.params.id], (err, results) => {
    if (err) return res.status(500).json({ message: "Lỗi server" });
    if (results.affectedRows === 0) return res.status(404).json({ message: "Không tìm thấy thương hiệu" });
    res.json({ message: "Xóa thương hiệu thành công" });
  });
};
