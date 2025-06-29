import { db } from "../config/connectBD.js";
import bcrypt from "bcryptjs";

const getUserProfile = async (req, res) => {
  try {
    const [users] = await db
      .promise()
      .query(
        "SELECT user_id, full_name, email, phone_number, gender, date_of_birth, address, ward, district, province, role, status, created_at, updated_at FROM users WHERE user_id = ?",
        [req.user.id]
      );
    if (users.length === 0) {
      return res.status(404).json({ message: "Không tìm thấy người dùng!" });
    }
    res.status(200).json(users[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Lỗi server" });
  }
};

const updateUserProfile = async (req, res) => {
  const {
    full_name,
    phone_number,
    gender,
    date_of_birth,
    address,
    ward,
    district,
    province,
    password_hash,
  } = req.body;
  try {
    if (!full_name || !phone_number) {
      return res
        .status(400)
        .json({ message: "Vui lòng nhập đầy đủ họ tên và số điện thoại!" });
    }
    let updateQuery =
      "UPDATE users SET full_name = ?, phone_number = ?, gender = ?, date_of_birth = ?, address = ?, ward = ?, district = ?, province = ?, updated_at = NOW()";
    let values = [
      full_name,
      phone_number,
      gender,
      date_of_birth,
      address,
      ward,
      district,
      province,
    ];

    if (password_hash) {
      const salt = bcrypt.genSaltSync(10);
      const hash = bcrypt.hashSync(password_hash, salt);
      updateQuery += ", password_hash = ?";
      values.push(hash);
    }

    updateQuery += " WHERE user_id = ?";
    values.push(req.user.id);

    const [result] = await db.promise().query(updateQuery, values);
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Không tìm thấy người dùng!" });
    }
    const [updatedUser] = await db
      .promise()
      .query(
        "SELECT user_id, full_name, email, phone_number, gender, date_of_birth, address, ward, district, province, role, status, created_at, updated_at FROM users WHERE user_id = ?",
        [req.user.id]
      );
    res.status(200).json(updatedUser[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Lỗi server" });
  }
};

const getAllUsers = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const search = req.query.search || "";
    const offset = (page - 1) * limit;

    let whereClause = "";
    let queryParams = [];

    // Xây dựng điều kiện tìm kiếm đơn giản
    if (search.trim()) {
      const searchTerm = `%${search.trim()}%`;
      whereClause = `WHERE (
        full_name LIKE ? OR
        email LIKE ? OR
        phone_number LIKE ? OR
        user_id LIKE ? OR
        role LIKE ? OR
        status LIKE ? OR
        COALESCE(address, '') LIKE ? OR
        COALESCE(ward, '') LIKE ? OR
        COALESCE(district, '') LIKE ? OR
        COALESCE(province, '') LIKE ?
      )`;
      queryParams = [searchTerm, searchTerm, searchTerm, searchTerm, searchTerm, searchTerm, searchTerm, searchTerm, searchTerm, searchTerm];
    }

    // Đếm tổng số bản ghi với điều kiện tìm kiếm
    const [countResult] = await db
      .promise()
      .query(`SELECT COUNT(*) as total FROM users ${whereClause}`, queryParams);
    const total = countResult[0].total;

    // Lấy danh sách người dùng với điều kiện tìm kiếm và phân trang
    const [users] = await db
      .promise()
      .query(
        `SELECT user_id, full_name, email, phone_number, gender, date_of_birth, address, ward, district, province, role, status, created_at, updated_at
         FROM users
         ${whereClause}
         ORDER BY created_at DESC
         LIMIT ? OFFSET ?`,
        [...queryParams, limit, offset]
      );

    res.status(200).json({
      users,
      total,
      page,
      limit,
      search,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Lỗi server" });
  }
};

const getUserById = async (req, res) => {
  try {
    const [users] = await db
      .promise()
      .query(
        "SELECT user_id, full_name, email, phone_number, gender, date_of_birth, address, ward, district, province, role, status, created_at, updated_at FROM users WHERE user_id = ?",
        [req.params.id]
      );
    if (users.length === 0) {
      return res.status(404).json({ message: "Không tìm thấy người dùng!" });
    }
    res.status(200).json(users[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Lỗi server" });
  }
};

const createUser = async (req, res) => {
  const {
    full_name,
    email,
    password_hash,
    phone_number,
    gender,
    date_of_birth,
    address,
    ward,
    district,
    province,
    role,
    status,
  } = req.body;
  try {
    if (!full_name || !email || !password_hash || !phone_number) {
      return res.status(400).json({
        message:
          "Vui lòng nhập đầy đủ họ tên, email, mật khẩu và số điện thoại!",
      });
    }
    const [existingUsers] = await db
      .promise()
      .query("SELECT * FROM users WHERE email = ? OR phone_number = ?", [
        email,
        phone_number,
      ]);
    if (existingUsers.length > 0) {
      if (existingUsers[0].email === email) {
        return res.status(409).json({ message: "Email đã tồn tại!" });
      }
      return res.status(409).json({ message: "Số điện thoại đã tồn tại!" });
    }

    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(password_hash, salt);

    const [result] = await db
      .promise()
      .query(
        "INSERT INTO users (full_name, email, password_hash, phone_number, gender, date_of_birth, address, ward, district, province, role, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
        [
          full_name,
          email,
          hash,
          phone_number,
          gender,
          date_of_birth,
          address,
          ward,
          district,
          province,
          role || "customer",
          status || "active",
        ]
      );

    const [newUser] = await db
      .promise()
      .query(
        "SELECT user_id, full_name, email, phone_number, gender, date_of_birth, address, ward, district, province, role, status, created_at, updated_at FROM users WHERE user_id = ?",
        [result.insertId]
      );
    res.status(201).json(newUser[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Lỗi server" });
  }
};

const updateUser = async (req, res) => {
  const {
    full_name,
    email,
    phone_number,
    gender,
    date_of_birth,
    address,
    ward,
    district,
    province,
    role,
    status,
    password_hash,
  } = req.body;
  try {
    if (!full_name || !email || !phone_number) {
      return res.status(400).json({
        message: "Vui lòng nhập đầy đủ họ tên, email và số điện thoại!",
      });
    }
    const [existingUsers] = await db
      .promise()
      .query(
        "SELECT * FROM users WHERE (email = ? OR phone_number = ?) AND user_id != ?",
        [email, phone_number, req.params.id]
      );
    if (existingUsers.length > 0) {
      if (existingUsers[0].email === email) {
        return res.status(409).json({ message: "Email đã tồn tại!" });
      }
      return res.status(409).json({ message: "Số điện thoại đã tồn tại!" });
    }

    let updateQuery =
      "UPDATE users SET full_name = ?, email = ?, phone_number = ?, gender = ?, date_of_birth = ?, address = ?, ward = ?, district = ?, province = ?, role = ?, status = ?, updated_at = NOW()";
    let values = [
      full_name,
      email,
      phone_number,
      gender,
      date_of_birth,
      address,
      ward,
      district,
      province,
      role,
      status,
    ];

    if (password_hash) {
      const salt = bcrypt.genSaltSync(10);
      const hash = bcrypt.hashSync(password_hash, salt);
      updateQuery += ", password_hash = ?";
      values.push(hash);
    }

    updateQuery += " WHERE user_id = ?";
    values.push(req.params.id);

    const [result] = await db.promise().query(updateQuery, values);
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Không tìm thấy người dùng!" });
    }

    const [updatedUser] = await db
      .promise()
      .query(
        "SELECT user_id, full_name, email, phone_number, gender, date_of_birth, address, ward, district, province, role, status, created_at, updated_at FROM users WHERE user_id = ?",
        [req.params.id]
      );
    res.status(200).json(updatedUser[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Lỗi server" });
  }
};

const deleteUser = async (req, res) => {
  try {
    const [result] = await db
      .promise()
      .query("DELETE FROM users WHERE user_id = ?", [req.params.id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Không tìm thấy người dùng!" });
    }
    res.status(204).json({
      message: "Xóa người dùng thành công",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Lỗi server" });
  }
};

export {
  getUserProfile,
  updateUserProfile,
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
};
