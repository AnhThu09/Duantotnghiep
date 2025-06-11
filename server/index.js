import express from "express";
import categoryRoutes from "./routes/categoryRoutes.js";

const __dirname = import.meta.dirname;

const app = express();

// app.use(express.static("public"));

app.set("view engine", "ejs");
app.set("views", "./views");

app.use("/api", categoryRoutes);
// app.use("/", getBrandById);
// app.use("/users", userRouter);
// app.use("/api/products", productRouter);
// app.use("/api", bookRoutes);
// app.use("/api", reviewRoutes);


app.listen(3000, () => {
  console.log("ExpressJS server started!!!");
});
