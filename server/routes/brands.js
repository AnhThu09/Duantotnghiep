import express from "express";
import { db } from "../connectBD.js"; // đường dẫn tới file kết nối db
import { verifyToken } from "../middlewares/authenticate.js"; // middleware xác thực token (nếu có)

const RouterBrands = express.Router();

// Lấy danh sách thương hiệu

RouterBrands.get("/", getAllBrands.index);
RouterBrands.get("/:id", ProductsController.show);

export default router;
