// controllers/orderController.js
import { db } from '../config/connectBD.js'

const ORDERS_TABLE = 'orders';
const USERS_TABLE = 'users';

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

// 1. Lấy tất cả đơn hàng (GET /api/orders)
export const getAllOrders = async (req, res) => {
    try {
        // Lấy đơn hàng và tên người dùng (giả sử cột tên người dùng là 'full_name' trong bảng users)
        const sql = `
            SELECT 
                o.order_id,
                o.user_id,
                u.full_name AS username,
                o.shipping_address,
                o.payment_method,
                o.payment_status,
                o.order_status,
                o.note,
                o.created_at,
                o.updated_at
            FROM 
                ${ORDERS_TABLE} o
            JOIN 
                ${USERS_TABLE} u ON o.user_id = u.user_id
            ORDER BY o.created_at DESC
        `;
        const orders = await queryDatabase(sql);
        res.json(orders);
    } catch (err) {
        console.error('Lỗi khi lấy đơn hàng:', err);
        res.status(500).json({ error: 'Không thể tải dữ liệu đơn hàng.', details: err.message });
    }
};

// 2. Lấy chi tiết đơn hàng (bao gồm Order Items)
export const getOrderDetails = async (req, res) => {
    const { id } = req.params;
    // Để lấy Order Items, bạn cần có bảng order_items (giả định)
    const sql = `
        SELECT 
            * FROM 
            ${ORDERS_TABLE} o 
        LEFT JOIN 
            order_items oi ON o.order_id = oi.order_id
        WHERE 
            o.order_id = ?
    `;
    
    // Lưu ý: Hàm này cần được điều chỉnh nếu bạn muốn trả về cấu trúc chi tiết đơn hàng
    // Hiện tại, chúng ta sẽ tập trung vào quản lý đơn hàng ở cấp độ tổng quan.
    try {
        const orderDetails = await queryDatabase(sql, [id]);
        if (orderDetails.length === 0) {
            return res.status(404).json({ message: 'Không tìm thấy đơn hàng.' });
        }
        res.json(orderDetails);
    } catch (err) {
        res.status(500).json({ error: 'Lỗi khi lấy chi tiết đơn hàng.', details: err.message });
    }
};

// 3. Cập nhật trạng thái đơn hàng (PUT /api/orders/:id)
export const updateOrderStatus = async (req, res) => {
    const { id } = req.params;
    const { order_status, payment_status, note } = req.body;

    // Chỉ cho phép cập nhật các trường này từ Admin
    try {
        const sql = `
            UPDATE ${ORDERS_TABLE}
            SET order_status = ?, payment_status = ?, note = ?
            WHERE order_id = ?
        `;
        const result = await queryDatabase(sql, [order_status, payment_status, note, id]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Không tìm thấy đơn hàng để cập nhật.' });
        }
        res.json({ message: 'Đơn hàng đã được cập nhật thành công.' });
    } catch (err) {
        console.error('Lỗi khi cập nhật trạng thái đơn hàng:', err);
        res.status(500).json({ error: 'Không thể cập nhật trạng thái đơn hàng.', details: err.message });
    }
};

// 4. Xóa đơn hàng (Admin chỉ nên xóa đơn hàng 'Đã hủy' hoặc test)
export const deleteOrder = async (req, res) => {
    const { id } = req.params;
    try {
        const sql = `DELETE FROM ${ORDERS_TABLE} WHERE order_id = ?`;
        const result = await queryDatabase(sql, [id]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Không tìm thấy đơn hàng để xóa.' });
        }
        res.json({ message: 'Đơn hàng đã được xóa thành công.' });
    } catch (err) {
        res.status(500).json({ error: 'Lỗi khi xóa đơn hàng.', details: err.message });
    }
};