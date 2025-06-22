import express from "express";
import { login, logout, register } from "../controllers/authController.js";
import { authMiddleware } from "../middlewares/auth.js";

const authRoutes = express.Router();

authRoutes.post("/register", register);
authRoutes.post("/login", login);
authRoutes.post("/logout", authMiddleware, logout);

// router.get("/admin-only", checkRole(["admin"]), (req, res) => {
//   res.json({ message: "Welcome, admin!" });
// });


// router.get("/user-data", checkRole(["admin", "customer"]), (req, res) => {
//   res.json({ message: "User data accessed!" });
// });
export default authRoutes;
