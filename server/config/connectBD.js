import mysql from 'mysql2';
import dotenv from 'dotenv';

dotenv.config(); // nạp biến môi trường từ .env

export const db = mysql.createConnection({

  host: 'localhost',
  user: 'root',
  password: '', // hoặc đúng mật khẩu MySQL của chị
  database: 'datn2025',
  port: 3306,
})


