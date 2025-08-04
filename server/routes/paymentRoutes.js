import express from "express";
import {
  createVNPayPayment,
  handleVNPayReturn,
  createCODOrder,
} from "../controllers/paymentController.js";

const router = express.Router();

// VNPay Payment
router.post("/vnpay/create", createVNPayPayment);
router.get("/vnpay/return", handleVNPayReturn);

// COD Payment
router.post("/cod/create", createCODOrder);

export default router;
