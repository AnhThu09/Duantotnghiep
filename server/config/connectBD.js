import mysql from "mysql";

export const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "Thu001122", // hoặc đúng mật khẩu MySQL của chị
  database: "datn2025",
});
