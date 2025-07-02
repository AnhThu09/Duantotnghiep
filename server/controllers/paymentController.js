import axios from "axios";
import crypto from "crypto";

// Chưa có key
const MOMO_CONFIG = {
  PARTNER_CODE: "KEY",
  ACCESS_KEY: "KEY",
  SECRET_KEY: "KEY",
  ENDPOINT: "https://test-payment.momo.vn/v2/gateway/api/create",
  REDIRECT_URL: "http://localhost:3000/verify",
  IPN_URL: "http://localhost:5000/api/payments/momo/verify",
  REQUEST_TYPE: "captureWallet",
};

// Tạo thanh toán MoMo
export const createMoMoPayment = async (req, res) => {
  try {
    const { orderId, amount, orderInfo } = req.body;

    const rawSignature = `accessKey=${MOMO_CONFIG.ACCESS_KEY}&amount=${amount}&extraData=&ipnUrl=${MOMO_CONFIG.IPN_URL}&orderId=${orderId}&orderInfo=${orderInfo}&partnerCode=${MOMO_CONFIG.PARTNER_CODE}&redirectUrl=${MOMO_CONFIG.REDIRECT_URL}&requestId=${orderId}&requestType=${MOMO_CONFIG.REQUEST_TYPE}`;

    const signature = crypto
      .createHmac("sha256", MOMO_CONFIG.SECRET_KEY)
      .update(rawSignature)
      .digest("hex");

    const requestBody = {
      partnerCode: MOMO_CONFIG.PARTNER_CODE,
      accessKey: MOMO_CONFIG.ACCESS_KEY,
      requestId: orderId,
      amount: amount,
      orderId: orderId,
      orderInfo: orderInfo,
      redirectUrl: MOMO_CONFIG.REDIRECT_URL,
      ipnUrl: MOMO_CONFIG.IPN_URL,
      extraData: "",
      requestType: MOMO_CONFIG.REQUEST_TYPE,
      signature: signature,
      lang: "vi",
    };

    const response = await axios.post(MOMO_CONFIG.ENDPOINT, requestBody);
    res.json(response.data);
  } catch (error) {
    console.error("Error creating MoMo payment:", error);
    res.status(500).json({ error: "Failed to create payment" });
  }
};

// Xác minh thanh toán MoMo
export const verifyMoMoPayment = async (req, res) => {
  try {
    const { orderId, resultCode, amount, transId, message } = req.query;

    if (resultCode === "0") {
      console.log(
        `Payment successful for order ${orderId}, amount: ${amount}, transId: ${transId}`
      );
      return res.redirect("http://localhost:3000/thank-you");
    } else {
      console.log(`Payment failed for order ${orderId}: ${message}`);
      return res.redirect("http://localhost:3000/payment-failed");
    }
  } catch (error) {
    console.error("Error verifying MoMo payment:", error);
    res.status(500).json({ error: "Failed to verify payment" });
  }
};

// Tạo đơn hàng COD
export const createCODOrder = async (req, res) => {
  try {
    const { orderId, amount, customerInfo, items } = req.body;

    console.log(`COD order created: ${orderId}, amount: ${amount}`);

    res.json({
      success: true,
      orderId: orderId,
      paymentMethod: "COD",
      status: "pending",
      message: "COD order created successfully. Please wait for confirmation.",
    });
  } catch (error) {
    console.error("Error creating COD order:", error);
    res.status(500).json({ error: "Failed to create COD order" });
  }
};
