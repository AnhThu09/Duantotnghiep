// import express from "express";
// import { authMiddleware, checkRole } from "../middlewares/auth.js";
// import { getUserProfile, updateUserProfile, getAllUsers, getUserById, createUser, updateUser, deleteUser } from "../controllers/userController.js";

// const userRoutes = express.Router();

// userRoutes.get("/me", authMiddleware, getUserProfile);
// userRoutes.put("/me", authMiddleware, updateUserProfile);
// userRoutes.get("/", authMiddleware, checkRole(["admin"]), getAllUsers);
// userRoutes.get("/:id", authMiddleware, checkRole(["admin"]), getUserById);
// userRoutes.post("/", authMiddleware, checkRole(["admin"]), createUser);
// userRoutes.put("/:id", authMiddleware, checkRole(["admin"]), updateUser);
// userRoutes.delete("/:id", authMiddleware, checkRole(["admin"]), deleteUser);

// export default userRoutes;

// server/routes/user.js
import express from 'express';
import { verifyToken } from '../middlewares/verifyToken.js';
import { isAdmin } from '../middlewares/isAdmin.js';

const router = express.Router();

// Route chỉ cho người đã đăng nhập
router.get('/profile', verifyToken, (req, res) => {
  res.json({ message: "Bạn đang xem trang cá nhân", user: req.user });
});

// Route chỉ cho admin
router.get('/admin/dashboard', verifyToken, isAdmin, (req, res) => {
  res.json({ message: "Trang quản trị admin" });
});

export default router;
