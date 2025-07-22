// controllers/orderController.js
import { db } from "../config/connectBD.js";

const ORDERS_TABLE = "orders";
const USERS_TABLE = "users";
const ORDER_ITEMS_TABLE = "order_items";

// Helper function to handle database queries
const queryDatabase = (sql, params = []) => {
  return new Promise((resolve, reject) => {
    db.query(sql, params, (err, results) => {
      if (err) {
        reject(err);
      } else {
        resolve(results);
      }
    });
  });
};

// Validation helpers
const validateOrderData = (data) => {
  const { user_id, recipient, items, total_amount } = data;
  const errors = [];

  if (!user_id || typeof user_id !== "number") {
    errors.push("user_id is required and must be a number");
  }

  if (!recipient) {
    errors.push("recipient information is required");
  } else {
    if (!recipient.name || recipient.name.trim().length === 0) {
      errors.push("recipient name is required");
    }
    if (!recipient.phone || !/^\d{10,11}$/.test(recipient.phone)) {
      errors.push("valid recipient phone is required");
    }
    if (!recipient.address || recipient.address.trim().length === 0) {
      errors.push("recipient address is required");
    }
  }

  if (!items || !Array.isArray(items) || items.length === 0) {
    errors.push("items array is required and cannot be empty");
  } else {
    items.forEach((item, index) => {
      if (!item.product_id || typeof item.product_id !== "number") {
        errors.push(
          `item ${index + 1}: product_id is required and must be a number`
        );
      }
      if (!item.quantity || item.quantity <= 0) {
        errors.push(`item ${index + 1}: quantity must be greater than 0`);
      }
      if (!item.price || item.price <= 0) {
        errors.push(`item ${index + 1}: price must be greater than 0`);
      }
    });
  }

  if (!total_amount || total_amount <= 0) {
    errors.push("total_amount must be greater than 0");
  }

  return errors;
};

// Check if user exists
const checkUserExists = async (user_id) => {
  const sql = `SELECT user_id FROM ${USERS_TABLE} WHERE user_id = ?`;
  const result = await queryDatabase(sql, [user_id]);
  return result.length > 0;
};

// 1. Lấy tất cả đơn hàng (GET /api/orders)
export const getAllOrders = async (req, res) => {
  try {
    const sql = `
    SELECT 
      o.order_id,
      o.user_id,
      u.full_name AS username,
      o.recipient_name,
      o.recipient_phone,
      o.shipping_address,
      o.shipping_ward,
      o.shipping_district,
      o.shipping_province,
      o.payment_method,
      o.payment_status,
      o.order_status,
      o.total_amount,
      o.note,
      o.created_at,
      o.updated_at
    FROM 
      ${ORDERS_TABLE} o
    LEFT JOIN 
      ${USERS_TABLE} u ON o.user_id = u.user_id
    ORDER BY o.created_at DESC
  `;

    const orders = await queryDatabase(sql);
    res.json({
      success: true,
      data: orders,
      count: orders.length,
    });
  } catch (err) {
    console.error("Lỗi khi lấy đơn hàng:", err);
    res.status(500).json({
      success: false,
      error: "Không thể tải dữ liệu đơn hàng.",
      details: err.message,
    });
  }
};

// 2. Lấy chi tiết đơn hàng (bao gồm Order Items)
export const getOrderDetails = async (req, res) => {
  const { id } = req.params;

  if (!id || isNaN(id)) {
    return res.status(400).json({
      success: false,
      message: "Invalid order ID",
    });
  }

  try {
    // Lấy thông tin đơn hàng
    const orderSql = `
    SELECT 
      o.*,
      u.full_name AS username,
      u.email AS user_email
    FROM 
      ${ORDERS_TABLE} o
    LEFT JOIN 
      ${USERS_TABLE} u ON o.user_id = u.user_id
    WHERE 
      o.order_id = ?
  `;

    const orderResult = await queryDatabase(orderSql, [id]);

    if (orderResult.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy đơn hàng.",
      });
    }

    // Lấy chi tiết sản phẩm trong đơn hàng
    const itemsSql = `
    SELECT 
      oi.*,
      p.product_name,
      p.image_url
    FROM 
      ${ORDER_ITEMS_TABLE} oi
    LEFT JOIN 
      products p ON oi.product_id = p.product_id
    WHERE 
      oi.order_id = ?
  `;

    const itemsResult = await queryDatabase(itemsSql, [id]);

    const order = orderResult[0];
    order.items = itemsResult;

    res.json({
      success: true,
      data: order,
    });
  } catch (err) {
    console.error("Lỗi khi lấy chi tiết đơn hàng:", err);
    res.status(500).json({
      success: false,
      error: "Lỗi khi lấy chi tiết đơn hàng.",
      details: err.message,
    });
  }
};

// 3. Tạo đơn hàng mới (POST /api/orders)
export const createOrder = async (req, res) => {
  const connection = db.promise();

  try {
    console.log("==> [API] Nhận yêu cầu tạo đơn hàng:", req.body);

    // Validate input data
    const validationErrors = validateOrderData(req.body);
    if (validationErrors.length > 0) {
      console.log("==> [API] Validation errors:", validationErrors);
      return res.status(400).json({
        success: false,
        message: "Dữ liệu đầu vào không hợp lệ",
        errors: validationErrors,
      });
    }

    const {
      user_id,
      order_code,
      recipient,
      items,
      total_amount,
      note,
      shipping_fee,
      discount_amount,
    } = req.body;

    // Check if user exists
    const userExists = await checkUserExists(user_id);
    if (!userExists) {
      return res.status(400).json({
        success: false,
        message: "Người dùng không tồn tại",
      });
    }

    // Start transaction
    await connection.query("START TRANSACTION");

    // Calculate actual subtotal from items
    const calculatedSubtotal = items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );

    // Calculate expected final total including shipping and discount
    const expectedFinalTotal =
      calculatedSubtotal + (shipping_fee || 0) - (discount_amount || 0);

    // Compare the expected final total with the total_amount sent from frontend
    if (Math.abs(expectedFinalTotal - total_amount) > 0.01) {
      await connection.query("ROLLBACK");
      return res.status(400).json({
        success: false,
        message:
          "Tổng tiền không khớp với giá trị tính toán (bao gồm phí ship và giảm giá)",
      });
    }

    // Insert order
    const orderSql = `
    INSERT INTO ${ORDERS_TABLE} 
    (user_id, order_code, recipient_name, recipient_phone, shipping_address, 
     shipping_ward, shipping_district, shipping_province, total_amount, 
     note, order_status, payment_status, created_at, updated_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'pending', 'unpaid', NOW(), NOW())
  `;

    const orderParams = [
      user_id,
      order_code || `ORD${Date.now()}`,
      recipient.name,
      recipient.phone,
      recipient.address,
      recipient.ward,
      recipient.district,
      recipient.province,
      total_amount, // Use the total_amount from req.body, which is the final amount
      note || null,
    ];

    const [orderResult] = await connection.query(orderSql, orderParams);
    const orderId = orderResult.insertId;
    console.log("==> [API] Đã tạo đơn hàng, order_id:", orderId);

    // Insert order items
    const orderItemsSql = `
    INSERT INTO ${ORDER_ITEMS_TABLE} (order_id, product_id, quantity, price)
    VALUES ?
  `;
    const orderItemsValues = items.map((item) => [
      orderId,
      item.product_id,
      item.quantity,
      item.price,
    ]);

    await connection.query(orderItemsSql, [orderItemsValues]);

    // Commit transaction
    await connection.query("COMMIT");

    console.log("==> [API] Đặt hàng thành công!");
    res.status(201).json({
      success: true,
      message: "Đặt hàng thành công!",
      data: { orderId, order_code: orderParams[1] },
    });
  } catch (error) {
    await connection.query("ROLLBACK");
    console.error("==> [API] Lỗi khi tạo đơn hàng:", error);
    res.status(500).json({
      success: false,
      message: "Lỗi server khi tạo đơn hàng.",
      details: error.message,
    });
  }
};

// 4. Cập nhật trạng thái đơn hàng (PUT /api/orders/:id)
export const updateOrderStatus = async (req, res) => {
  const { id } = req.params;
  const { order_status, payment_status, note } = req.body;

  if (!id || isNaN(id)) {
    return res.status(400).json({
      success: false,
      message: "Invalid order ID",
    });
  }

  // Validate status values
  const validOrderStatuses = [
    "pending",
    "confirmed",
    "shipping",
    "delivered",
    "cancelled",
  ];
  const validPaymentStatuses = ["unpaid", "paid", "refunded"];

  if (order_status && !validOrderStatuses.includes(order_status)) {
    return res.status(400).json({
      success: false,
      message: `Invalid order_status. Must be one of: ${validOrderStatuses.join(
        ", "
      )}`,
    });
  }

  if (payment_status && !validPaymentStatuses.includes(payment_status)) {
    return res.status(400).json({
      success: false,
      message: `Invalid payment_status. Must be one of: ${validPaymentStatuses.join(
        ", "
      )}`,
    });
  }

  try {
    // First check if order exists
    const checkSql = `SELECT order_id FROM ${ORDERS_TABLE} WHERE order_id = ?`;
    const existingOrder = await queryDatabase(checkSql, [id]);

    if (existingOrder.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy đơn hàng để cập nhật.",
      });
    }

    // Build dynamic update query
    const updates = [];
    const params = [];

    if (order_status) {
      updates.push("order_status = ?");
      params.push(order_status);
    }

    if (payment_status) {
      updates.push("payment_status = ?");
      params.push(payment_status);
    }

    if (note !== undefined) {
      updates.push("note = ?");
      params.push(note);
    }

    if (updates.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Không có thông tin nào để cập nhật",
      });
    }

    updates.push("updated_at = NOW()");
    params.push(id);

    const sql = `UPDATE ${ORDERS_TABLE} SET ${updates.join(
      ", "
    )} WHERE order_id = ?`;
    await queryDatabase(sql, params);

    res.json({
      success: true,
      message: "Đơn hàng đã được cập nhật thành công.",
    });
  } catch (err) {
    console.error("Lỗi khi cập nhật trạng thái đơn hàng:", err);
    res.status(500).json({
      success: false,
      error: "Không thể cập nhật trạng thái đơn hàng.",
      details: err.message,
    });
  }
};

// 5. Xóa đơn hàng (Admin only - chỉ xóa đơn hàng đã hủy)
export const deleteOrder = async (req, res) => {
  const { id } = req.params;

  if (!id || isNaN(id)) {
    return res.status(400).json({
      success: false,
      message: "Invalid order ID",
    });
  }

  const connection = db.promise();

  try {
    await connection.query("START TRANSACTION");

    // Check if order exists and can be deleted
    const checkSql = `SELECT order_status FROM ${ORDERS_TABLE} WHERE order_id = ?`;
    const orderResult = await queryDatabase(checkSql, [id]);

    if (orderResult.length === 0) {
      await connection.query("ROLLBACK");
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy đơn hàng để xóa.",
      });
    }

    // Only allow deletion of cancelled orders
    if (orderResult[0].order_status !== "cancelled") {
      await connection.query("ROLLBACK");
      return res.status(400).json({
        success: false,
        message: "Chỉ có thể xóa đơn hàng đã hủy.",
      });
    }

    // Delete order items first
    const deleteItemsSql = `DELETE FROM ${ORDER_ITEMS_TABLE} WHERE order_id = ?`;
    await connection.query(deleteItemsSql, [id]);

    // Delete order
    const deleteOrderSql = `DELETE FROM ${ORDERS_TABLE} WHERE order_id = ?`;
    await connection.query(deleteOrderSql, [id]);

    await connection.query("COMMIT");

    res.json({
      success: true,
      message: "Đơn hàng đã được xóa thành công.",
    });
  } catch (err) {
    await connection.query("ROLLBACK");
    console.error("Lỗi khi xóa đơn hàng:", err);
    res.status(500).json({
      success: false,
      error: "Lỗi khi xóa đơn hàng.",
      details: err.message,
    });
  }
};
