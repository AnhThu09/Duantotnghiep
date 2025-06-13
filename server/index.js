import express from "express";
import categoryRoutes from "./routes/categoryRoutes.js";
import { db } from "./config/connectBD.js";
import cors from 'cors';
import brandsRouter from "./routes/brands.js";

const __dirname = import.meta.dirname;

const app = express();

// Test kết nối DB
db.connect((err) => {
  if (err) {
    console.error("❌ Không thể kết nối MySQL:", err);
  } else {
    console.log("✅ Kết nối MySQL thành công!");
  }
});
// app.use(express.static("public"));

app.set("view engine", "ejs");
app.set("views", "./views");
app.use(express.json()); 
app.use(cors());

app.use("/api/categories", categoryRoutes);
app.use('/api/brands', brandsRouter);

app.listen(3000, () => {
  console.log("ExpressJS server started!!!");
});
