import crypto from 'crypto';
import moment from 'moment';
import querystring from 'querystring';

// VNPay Configuration - Sử dụng environment variables
const VNPAY_CONFIG = {
  TMN_CODE: process.env.VNPAY_TMN_CODE || 'MHK60JA3',
  SECRET_KEY: process.env.VNPAY_SECRET_KEY || '7LRB0OXFB4TM8E2MLSY4CXB7PLLYS0E5',
  ENDPOINT: process.env.VNPAY_ENDPOINT || 'https://sandbox.vnpayment.vn/paymentv2/vpcpay.html',
  RETURN_URL: process.env.VNPAY_RETURN_URL || 'http://localhost:3000/api/payments/vnpay/return',
  VERSION: '2.1.0',
  COMMAND: 'pay',
  CURRENCY: 'VND',
  LOCALE: 'vn',
};

// Validation helpers
const validateAmount = amount => {
  const numAmount = Number(amount);
  return !isNaN(numAmount) && numAmount > 0 && numAmount <= 1000000000; // Max 1 tỷ VND
};

const validateIP = ip => {
  const ipv4Regex =
    /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
  return ipv4Regex.test(ip);
};

const sanitizeString = (str, maxLength = 255) => {
  if (!str) return '';
  return str.toString().trim().substring(0, maxLength);
};

// Helper function để tạo chữ ký VNPay theo chuẩn chính thức
function createVNPaySignature(params, secretKey) {
  try {
    // Loại bỏ các field không tham gia ký
    const filteredParams = { ...params };
    delete filteredParams.vnp_SecureHash;
    delete filteredParams.vnp_SecureHashType;

    // Sắp xếp params theo thứ tự key (case-sensitive)
    const sortedKeys = Object.keys(filteredParams).sort();

    // Tạo chuỗi dữ liệu để ký theo format VNPay chuẩn
    const signData = sortedKeys
      .filter(key => {
        const value = filteredParams[key];
        return value !== '' && value !== null && value !== undefined;
      })
      .map(key => `${key}=${filteredParams[key]}`)
      .join('&');

    console.log('VNPay signData (raw for signature):', signData);

    // Tạo chữ ký HMAC-SHA512
    const signature = crypto.createHmac('sha512', secretKey).update(signData, 'utf8').digest('hex');
    console.log('VNPay signature generated:', signature);
    return signature;
  } catch (error) {
    console.error('Error creating VNPay signature:', error);
    throw new Error('Failed to create signature');
  }
}

// Generate unique order ID
const generateUniqueOrderId = originalOrderId => {
  const timestamp = moment().format('YYYYMMDDHHmmss');
  const random = Math.random().toString(36).substring(2, 8).toUpperCase();
  return `${originalOrderId}_${timestamp}_${random}`;
};

// Get client IP address
const getClientIP = req => {
  let ipAddr =
    req.headers['x-forwarded-for'] ||
    req.headers['x-real-ip'] ||
    req.connection.remoteAddress ||
    req.socket.remoteAddress ||
    (req.connection.socket ? req.connection.socket.remoteAddress : null) ||
    '127.0.0.1';

  // Handle multiple IPs in x-forwarded-for
  if (ipAddr.includes(',')) {
    ipAddr = ipAddr.split(',')[0].trim();
  }

  // Convert IPv6 to IPv4 if needed
  if (ipAddr === '::1') {
    ipAddr = '127.0.0.1';
  } else if (ipAddr && ipAddr.startsWith('::ffff:')) {
    ipAddr = ipAddr.substring(7);
  }

  // Validate IP format
  if (!validateIP(ipAddr)) {
    console.warn('Invalid IP detected, using fallback:', ipAddr);
    ipAddr = '127.0.0.1';
  }

  return ipAddr;
};

// Tạo thanh toán VNPay
export const createVNPayPayment = async (req, res) => {
  try {
    console.log('=== VNPay Create Payment ===');
    console.log('Request body:', req.body);

    const { orderId, amount, orderInfo, bankCode } = req.body;

    // Validation
    if (!orderId || !amount || !orderInfo) {
      return res.status(400).json({
        error: 'Missing required fields: orderId, amount, orderInfo',
      });
    }

    if (!validateAmount(amount)) {
      return res.status(400).json({
        error: 'Invalid amount. Must be a positive number and not exceed 1,000,000,000 VND',
      });
    }

    const sanitizedOrderInfo = sanitizeString(orderInfo, 100);
    const sanitizedBankCode = sanitizeString(bankCode, 20);

    const ipAddr = getClientIP(req);
    const createDate = moment().format('YYYYMMDDHHmmss');
    const orderId_vnp = generateUniqueOrderId(orderId);

    console.log('Generated orderId_vnp:', orderId_vnp);
    console.log('Client IP:', ipAddr);
    console.log('Sanitized orderInfo:', sanitizedOrderInfo);

    let vnpParams = {
      vnp_Version: VNPAY_CONFIG.VERSION,
      vnp_Command: VNPAY_CONFIG.COMMAND,
      vnp_TmnCode: VNPAY_CONFIG.TMN_CODE,
      vnp_Locale: VNPAY_CONFIG.LOCALE,
      vnp_CurrCode: VNPAY_CONFIG.CURRENCY,
      vnp_TxnRef: orderId_vnp,
      vnp_OrderInfo: sanitizedOrderInfo,
      vnp_OrderType: 'other',
      vnp_Amount: Math.round(amount * 100), // Ensure integer
      vnp_ReturnUrl: VNPAY_CONFIG.RETURN_URL,
      vnp_IpAddr: ipAddr,
      vnp_CreateDate: createDate,
      vnp_ExpireDate: moment().add(15, 'minutes').format('YYYYMMDDHHmmss'),
    };

    // Thêm bankCode nếu có và hợp lệ
    if (sanitizedBankCode && sanitizedBankCode !== '') {
      vnpParams.vnp_BankCode = sanitizedBankCode;
    }

    // Tạo signature
    const signature = createVNPaySignature(vnpParams, VNPAY_CONFIG.SECRET_KEY);
    vnpParams.vnp_SecureHash = signature;

    // Tạo URL thanh toán
    const paymentUrl = VNPAY_CONFIG.ENDPOINT + '?' + querystring.stringify(vnpParams);

    console.log('Payment URL generated successfully');

    res.json({
      success: true,
      paymentUrl: paymentUrl,
      orderId: orderId_vnp,
      expiresAt: moment().add(15, 'minutes').toISOString(),
    });
  } catch (error) {
    console.error('Error creating VNPay payment:', error);
    res.status(500).json({
      error: 'Failed to create VNPay payment',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
};

// Xử lý return từ VNPay
export const handleVNPayReturn = async (req, res) => {
  try {
    console.log('=== VNPay Return Handler ===');
    console.log('Original query params:', req.query);

    const vnpParams = { ...req.query };
    const secureHash = vnpParams['vnp_SecureHash'];

    if (!secureHash) {
      console.error('Missing secureHash in return params');
      return res.redirect('http://localhost:5173/payment-failed?error=missing_signature');
    }

    console.log('Received secureHash:', secureHash);

    // Tạo signature để verify
    const checkSignature = createVNPaySignature(vnpParams, VNPAY_CONFIG.SECRET_KEY);

    console.log('Generated checkSignature:', checkSignature);
    console.log('Signature match:', secureHash === checkSignature);

    if (secureHash === checkSignature) {
      const orderId = vnpParams['vnp_TxnRef'];
      const responseCode = vnpParams['vnp_ResponseCode'];
      const transactionNo = vnpParams['vnp_TransactionNo'];
      const amount = parseInt(vnpParams['vnp_Amount']) / 100;
      const payDate = vnpParams['vnp_PayDate'];

      console.log(
        `VNPay verification successful - OrderID: ${orderId}, ResponseCode: ${responseCode}, Amount: ${amount}`
      );

      // Parse original order ID
      const tempOrderId = orderId.split('_')[0];

      if (responseCode === '00') {
        console.log(`VNPay payment successful for order ${orderId}, amount: ${amount}`);

        // TODO: Update order status in database here
        // await updateOrderPaymentStatus(tempOrderId, 'paid', transactionNo);

        return res.redirect(
          `http://localhost:5173/vnpay-success?temp_order_id=${tempOrderId}&payment_status=success&amount=${amount}&transaction_no=${transactionNo}&pay_date=${payDate}`
        );
      } else {
        console.log(`VNPay payment failed for order ${orderId}: ${responseCode}`);

        // TODO: Update order status in database here
        // await updateOrderPaymentStatus(tempOrderId, 'failed', null, responseCode);

        return res.redirect(
          `http://localhost:5173/payment-failed?error=${responseCode}&order_id=${tempOrderId}`
        );
      }
    } else {
      console.error('=== VNPay SIGNATURE VERIFICATION FAILED ===');
      console.error('Expected:', checkSignature);
      console.error('Received:', secureHash);
      console.error('Params used for verification:', JSON.stringify(vnpParams, null, 2));
      return res.redirect('http://localhost:5173/payment-failed?error=signature');
    }
  } catch (error) {
    console.error('Error handling VNPay return:', error);
    res.status(500).json({
      error: 'Failed to handle VNPay return',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
};

// Tạo đơn hàng COD
export const createCODOrder = async (req, res) => {
  try {
    const { orderId, amount, customerInfo, items } = req.body;

    // Validation
    if (!orderId || !amount || !customerInfo) {
      return res.status(400).json({
        error: 'Missing required fields: orderId, amount, customerInfo',
      });
    }

    if (!validateAmount(amount)) {
      return res.status(400).json({
        error: 'Invalid amount. Must be a positive number',
      });
    }

    console.log(`COD order created: ${orderId}, amount: ${amount}`);

    // TODO: Save order to database here
    // await saveOrderToDatabase({ orderId, amount, customerInfo, items, paymentMethod: 'COD' });

    res.json({
      success: true,
      orderId: orderId,
      paymentMethod: 'COD',
      status: 'pending',
      message: 'COD order created successfully. Please wait for confirmation.',
      estimatedDelivery: moment().add(2, 'days').format('YYYY-MM-DD'),
    });
  } catch (error) {
    console.error('Error creating COD order:', error);
    res.status(500).json({
      error: 'Failed to create COD order',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
};

// Export response codes for reference
export const VNPAY_RESPONSE_CODES = {
  '00': 'Giao dịch thành công',
  '07': 'Trừ tiền thành công. Giao dịch bị nghi ngờ (liên quan tới lừa đảo, giao dịch bất thường).',
  '09': 'Giao dịch không thành công do: Thẻ/Tài khoản của khách hàng chưa đăng ký dịch vụ InternetBanking tại ngân hàng.',
  10: 'Giao dịch không thành công do: Khách hàng xác thực thông tin thẻ/tài khoản không đúng quá 3 lần',
  11: 'Giao dịch không thành công do: Đã hết hạn chờ thanh toán. Xin quý khách vui lòng thực hiện lại giao dịch.',
  12: 'Giao dịch không thành công do: Thẻ/Tài khoản của khách hàng bị khóa.',
  13: 'Giao dịch không thành công do Quý khách nhập sai mật khẩu xác thực giao dịch (OTP).',
  24: 'Giao dịch không thành công do: Khách hàng hủy giao dịch',
  51: 'Giao dịch không thành công do: Tài khoản của quý khách không đủ số dư để thực hiện giao dịch.',
  65: 'Giao dịch không thành công do: Tài khoản của Quý khách đã vượt quá hạn mức giao dịch trong ngày.',
  75: 'Ngân hàng thanh toán đang bảo trì.',
  79: 'Giao dịch không thành công do: KH nhập sai mật khẩu thanh toán quá số lần quy định.',
  99: 'Các lỗi khác (lỗi còn lại, không có trong danh sách mã lỗi đã liệt kê)',
};
