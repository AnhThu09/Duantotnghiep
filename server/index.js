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

// ✅ Khởi động server
app.listen(3000, () => {
  console.log('🚀 ExpressJS server started on http://localhost:3000')
})
