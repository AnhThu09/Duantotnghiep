// controllers/orderController.js
import { db } from '../config/connectBD.js'

// Tao don moi
export const createOrder = async (req, res) => {
  const { user_id, items, shipping_address, phone, notes } = req.body

  if (!user_id || !items || items.length === 0) {
    return res.status(400).json({ message: 'Thiếu thông tin đơn hàng.' })
  }

  try {
    // Tính tổng tiền
    let totalAmount = 0
    const itemDetails = []

    for (const item of items) {
      const [productRows] = await db
        .promise()
        .query('SELECT price, stock_quantity FROM products WHERE id = ?', [item.product_id])

      if (productRows.length === 0) {
        return res.status(404).json({ message: `Sản phẩm ID ${item.product_id} không tồn tại.` })
      }

      const product = productRows[0]

      if (product.stock_quantity < item.quantity) {
        return res.status(400).json({ message: `Sản phẩm ${item.product_id} không đủ hàng.` })
      }

      const total_price = product.price * item.quantity
      totalAmount += total_price

      itemDetails.push({
        ...item,
        unit_price: product.price,
        total_price,
      })
    }

    // Thêm đơn hàng
    const [orderResult] = await db
      .promise()
      .query(
        'INSERT INTO orders (user_id, total_amount, shipping_address, phone, notes) VALUES (?, ?, ?, ?, ?)',
        [user_id, totalAmount, shipping_address, phone, notes]
      )

    const orderId = orderResult.insertId

    // Thêm từng chi tiết đơn hàng và cập nhật tồn kho
    for (const item of itemDetails) {
      await db
        .promise()
        .query(
          'INSERT INTO order_items (order_id, product_id, quantity, unit_price, total_price) VALUES (?, ?, ?, ?, ?)',
          [orderId, item.product_id, item.quantity, item.unit_price, item.total_price]
        )

      await db
        .promise()
        .query('UPDATE products SET stock_quantity = stock_quantity - ? WHERE id = ?', [
          item.quantity,
          item.product_id,
        ])
    }

    res.status(201).json({ message: 'Đặt hàng thành công.', order_id: orderId })
  } catch (error) {
    console.error('Lỗi tạo đơn hàng:', error)
    res.status(500).json({ message: 'Lỗi máy chủ.', error: error.message })
  }
}

// Lấy đơn hàng user_id
export const getOrdersByUser = async (req, res) => {
  const { user_id } = req.params

  try {
    const [orders] = await db
      .promise()
      .query('SELECT * FROM orders WHERE user_id = ? ORDER BY created_at DESC', [user_id])

    for (const order of orders) {
      const [items] = await db.promise().query(
        `SELECT oi.*, p.name as product_name FROM order_items oi
         JOIN products p ON oi.product_id = p.id
         WHERE order_id = ?`,
        [order.id]
      )
      order.items = items
    }

    res.json(orders)
  } catch (error) {
    res.status(500).json({ message: 'Lỗi lấy đơn hàng', error: error.message })
  }
}

// Lấy all đơn hàng
export const getAllOrders = async (req, res) => {
  try {
    const [orders] = await db.promise().query(`
SELECT o.*, u.full_name as user_name FROM orders o
JOIN users u ON o.user_id = u.id
ORDER BY o.created_at DESC

    `)

    for (const order of orders) {
      const [items] = await db.promise().query(
        `SELECT oi.*, p.name as product_name FROM order_items oi
         JOIN products p ON oi.product_id = p.id
         WHERE order_id = ?`,
        [order.id]
      )
      order.items = items
    }

    res.json(orders)
  } catch (error) {
    res.status(500).json({ message: 'Lỗi lấy tất cả đơn hàng', error: error.message })
  }
}

// Cập nhật stt đơn hàng
export const updateOrderStatus = async (req, res) => {
  const { id } = req.params
  const { status } = req.body

  try {
    const [result] = await db
      .promise()
      .query('UPDATE orders SET status = ? WHERE id = ?', [status, id])

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Không tìm thấy đơn hàng.' })
    }

    res.json({ message: 'Cập nhật trạng thái thành công.' })
  } catch (error) {
    res.status(500).json({ message: 'Lỗi cập nhật trạng thái', error: error.message })
  }
}
