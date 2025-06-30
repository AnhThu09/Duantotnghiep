import mysql from 'mysql2'

export const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '', // hoặc đúng mật khẩu MySQL của chị
  database: 'datn2025',
  port: 3306,
})
