import express from 'express'
import {
  createOrder,
  getAllOrders,
  getOrdersByUser,
  updateOrderStatus,
} from '../controllers/orderController.js'

const router = express.Router()

router.post('/create', createOrder) // Tạo đơn hàng
router.get('/user/:user_id', getOrdersByUser) // Lấy đơn hàng của 1 user
router.get('/', getAllOrders) // Lấy tất cả đơn hàng
router.put('/:id/status', updateOrderStatus) // Cập nhật trạng thái đơn hàng

export default router
