import cors from 'cors'
import express from 'express'
import path from 'path'
import { db } from './config/connectBD.js'
import authRoutes from './routes/auth.js'
import brandsRouter from './routes/brands.js'
import categoryRoutes from './routes/categoryRoutes.js'
import productRoutes from './routes/productRoutes.js'
import ContactRoutes from './routes/contact.js'
import orderRoutes from './routes/order.js'
import userRoutes from './routes/user.js'
import cartRouter from './routes/cart.js'

const app = express()

// ✅ Kết nối MySQL
db.connect(err => {
  if (err) {
    console.error('❌ Không thể kết nối MySQL:', err)
  } else {
    console.log('✅ Kết nối MySQL thành công!')
  }
})

// app.set('view engine', 'ejs')
// app.set('views', './views')
// ✅ Cấu hình middleware
app.use(cors())
app.use(express.json())
app.use('/uploads', express.static('uploads'))

// ✅ Đăng ký router
app.use('/api/products', productRoutes) 
app.use('/api/categories', categoryRoutes)
app.use('/api/brands', brandsRouter)
app.use('/api/cart', cartRouter)
app.use('/api/contact', ContactRoutes)
app.use('/api/auth', authRoutes)
app.use('/api/orders', orderRoutes)
app.use('/api/users', userRoutes)

// Handle 404 Not Found
app.use((req, res, next) => {
  res.status(404).json({ message: 'Không tìm thấy tài nguyên!' });
});

// Handle 500 Internal Server Error
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Đã xảy ra lỗi máy chủ!' });
});

// ✅ Khởi động server
app.listen(3000, () => {
  console.log('🚀 ExpressJS server started on http://localhost:3000')
})
