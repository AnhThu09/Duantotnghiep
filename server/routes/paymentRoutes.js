import express from "express";
import {
  createMoMoPayment,
  verifyMoMoPayment,
  createCODOrder,
} from "../controllers/paymentController.js";

const router = express.Router();

// MoMo Payment
router.post("/momo/create", createMoMoPayment);
router.get("/momo/verify", verifyMoMoPayment);

// COD Payment
router.post("/cod/create", createCODOrder);

export default router;
