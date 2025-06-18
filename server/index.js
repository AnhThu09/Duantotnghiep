import cors from 'cors'
import express from 'express'
import { db } from './config/connectBD.js'
import authRoutes from './routes/auth.js'
import brandsRouter from './routes/brands.js'
import cartRoutes from './routes/cart.js'
import categoryRoutes from './routes/categoryRoutes.js'
import ContactRoutes from './routes/contact.js'
import orderRoutes from './routes/order.js'

const __dirname = import.meta.dirname

const app = express()

// Test kết nối DB
db.connect(err => {
  if (err) {
    console.error('❌ Không thể kết nối MySQL:', err)
  } else {
    console.log('✅ Kết nối MySQL thành công!')
  }
})
// app.use(express.static("public"));

app.set('view engine', 'ejs')
app.set('views', './views')
app.use('/uploads', express.static('uploads'))
app.use(express.json())
app.use(cors())

app.use('/api/categories', categoryRoutes)
app.use('/api/brands', brandsRouter)
app.use('/api/cart', cartRoutes)
app.use('/api', ContactRoutes)
app.use('/api/auth', authRoutes)
app.use('/api/orders', orderRoutes)

app.listen(3000, () => {
  console.log('ExpressJS server started!!!')
})
