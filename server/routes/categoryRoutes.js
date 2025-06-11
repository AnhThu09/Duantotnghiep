import express from "express";
import { db } from "../config/connectBD.js";

const router = express.Router();

router.get("/categories", (req, res) => {
  const q = "SELECT * FROM categories";
  db.query(q, (err, data) => {
    if (err) return res.status(500).json(err);
    return res.json(data);
  });
});

export default router;
