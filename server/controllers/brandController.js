import { db } from "../config/connectBD.js";

// ✅ Lấy danh sách thương hiệu
export const getAllBrands = (req, res) => {
  db.query("SELECT * FROM brands", (err, result) => {
    if (err) return res.status(500).json({ error: err });
    res.json(result);
  });
};


// ✅ Thêm thương hiệu (upload ảnh)
export const createBrand = (req, res) => {
  const { brand_name, description } = req.body;
  const logo = req.file?.filename;

  if (!logo) return res.status(400).json({ error: 'Logo không được để trống' });

  const sql = "INSERT INTO brands (brand_name, logo, description) VALUES (?, ?, ?)";
  db.query(sql, [brand_name, logo, description], (err, result) => {
    if (err) return res.status(500).json({ error: err });
    res.json({ message: "Thêm thương hiệu thành công", id: result.insertId });
  });
};

// ✅ Cập nhật thương hiệu (có thể đổi ảnh)
export const updateBrand = (req, res) => {
  const { id } = req.params;
  const { brand_name, description } = req.body;
  const logo = req.file?.filename;

  const sql = "UPDATE brands SET brand_name = ?, logo = ?, description = ? WHERE brand_id = ?";
  db.query(sql, [brand_name, logo, description, id], (err) => {
    if (err) return res.status(500).json({ error: err });
    res.json({ message: "Cập nhật thương hiệu thành công" });
  });
};
// ✅ Xoá thương hiệu
export const deleteBrand = (req, res) => {
  const { id } = req.params;
  db.query("DELETE FROM brands WHERE brand_id = ?", [id], (err) => {
    if (err) return res.status(500).json({ error: err });
    res.json({ message: "Xóa thương hiệu thành công" });
  });
};

