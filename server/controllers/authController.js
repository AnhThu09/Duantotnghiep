import { db } from "../config/connectBD.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { sendOTP } from '../utils/sendOTP.js';

dotenv.config();
const otpStore = new Map(); // email -> { otp, expiresAt, verified, type }
const SECRET_KEY = process.env.JWT_SECRET || "backup-secret-key"; 
const OTP_EXPIRY_MINUTES = parseInt(process.env.OTP_EXPIRY_MINUTES || '5', 10);

const generateOtp = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
};

// =================== ĐĂNG KÝ ===================
export const register = async (req, res) => {
  const { full_name, email, password_hash, phone_number } = req.body;

  try {
    if (!full_name || !email || !password_hash || !phone_number) {
      return res.status(400).json({ message: "Vui lòng nhập đầy đủ thông tin." });
    }
    if (!/.+@.+\..+/.test(email)) {
        return res.status(400).json({ message: 'Email không đúng định dạng.' });
    }
    if (password_hash.length < 6) {
        return res.status(400).json({ message: 'Mật khẩu phải có ít nhất 6 ký tự.' });
    }

    const otpRecord = otpStore.get(email);
    if (!otpRecord || !otpRecord.verified || otpRecord.type !== 'register') { 
      return res.status(400).json({ message: "Email chưa được xác minh OTP. Vui lòng gửi và xác minh mã OTP trước." });
    }

    const [existingUsers] = await db.promise().query("SELECT * FROM users WHERE email = ?", [email]);
    if (existingUsers.length > 0) {
      if (existingUsers[0].password_hash) { 
          return res.status(409).json({ message: "Email đã tồn tại, vui lòng chọn email khác!" });
      }
    }
    
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(password_hash, salt);

    await db.promise().query(
      "INSERT INTO users (full_name, email, password_hash, phone_number, is_email_verified, role) VALUES (?, ?, ?, ?, ?, ?)",
      [full_name, email, hash, phone_number, true, 'user'] 
    );

    otpStore.delete(email); 

    res.status(201).json({ message: "Đăng ký thành công" });
  } catch (error) {
    console.error("❌ Lỗi đăng ký:", error);
    if (error.code && error.code === 'ER_DUP_ENTRY') {
      if (error.sqlMessage.includes('email')) {
        return res.status(409).json({ message: 'Email đã tồn tại.' });
      }
      if (error.sqlMessage.includes('phone_number')) {
        return res.status(409).json({ message: 'Số điện thoại này đã được sử dụng.' });
      }
    }
    return res.status(500).json({ message: "Đăng ký thất bại" });
  }
};

// =================== ĐĂNG NHẬP ===================
export const login = async (req, res) => {
  const { email, password_hash } = req.body;

  try {
    if (!email || !password_hash) {
      return res.status(400).json({
        message: "Vui lòng nhập email và mật khẩu",
      });
    }

    const [users] = await db
      .promise()
      .query("SELECT * FROM users WHERE email = ?", [email]);

    if (users.length === 0) {
      return res.status(404).json({ message: "Không tìm thấy tài khoản!" });
    }

    const user = users[0];

    if (!user.is_email_verified) {
      return res.status(403).json({ message: "Email chưa được xác minh. Vui lòng kiểm tra email của bạn hoặc đăng ký lại." });
    }

    const isPasswordValid = bcrypt.compareSync(
      password_hash,
      user.password_hash
    );

    if (!isPasswordValid) {
      return res.status(401).json({ message: "Mật khẩu không đúng!" });
    }

    const token = jwt.sign(
      { id: user.user_id, role: user.role }, 
      SECRET_KEY,
      { expiresIn: "1d" }
    );

    // ✅ SỬA ĐỔI ĐỂ TRẢ VỀ TẤT CẢ CÁC TRƯỜNG MÀ FRONTEND CẦN
    res.status(200).json({
      message: "Đăng nhập thành công",
      token,
      user: {
        user_id: user.user_id, 
        full_name: user.full_name,
        email: user.email,
        phone_number: user.phone_number,
        role: user.role,
        gender: user.gender, 
        // Định dạng date_of_birth: Cần kiểm tra user.date_of_birth có giá trị không trước khi định dạng
        date_of_birth: user.date_of_birth ? new Date(user.date_of_birth).toISOString().split('T')[0] : null, 
        address: user.address,     
        ward: user.ward,           
        district: user.district,   
        province: user.province,   
      },
    });
  } catch (error) {
    console.error("❌ Lỗi đăng nhập:", error);
    return res.status(500).json({ message: "Đăng nhập thất bại" });
  }
};

// =================== ĐĂNG XUẤT ===================
export const logout = async (req, res) => {
  try {
    res.status(200).json({ message: "Đăng xuất thành công" });
  } catch (error) {
    console.error("❌ Lỗi đăng xuất:", error);
    return res.status(500).json({ message: "Đăng xuất thất bại" });
  }
};

// =================== GỬI MÃ OTP (CHO ĐĂNG KÝ) ===================
export const requestOTP = async (req, res) => {
  const { email } = req.body;

  if (!email) return res.status(400).json({ message: 'Vui lòng nhập email' });

  const [existingUsers] = await db.promise().query("SELECT * FROM users WHERE email = ?", [email]);
  if (existingUsers.length > 0 && existingUsers[0].is_email_verified) { 
      return res.status(400).json({ message: 'Email này đã được đăng ký và xác minh.' });
  }

  const otp = generateOtp(); 
  const expiresAt = Date.now() + OTP_EXPIRY_MINUTES * 60 * 1000;

  otpStore.set(email, { otp: parseInt(otp), expiresAt, verified: false, type: 'register' });

  try {
    console.log("📧 Đang gửi OTP tới:", email, "→", otp);
    await sendOTP(email, otp); 
    res.json({ message: 'Đã gửi mã OTP đến email' });
  } catch (error) {
    console.error('❌ Lỗi gửi OTP:', error);
    res.status(500).json({ message: 'Không gửi được mã OTP. Vui lòng thử lại sau.' });
  }
};

// =================== XÁC MINH OTP (CHO ĐĂNG KÝ) ===================
export const verifyOTP = (req, res) => {
  const { email, otp } = req.body;

  const record = otpStore.get(email);
  if (!record) return res.status(400).json({ message: 'Không tìm thấy OTP hoặc OTP đã hết hạn.' });

  const { otp: realOTP, expiresAt } = record;
  if (Date.now() > expiresAt) {
    otpStore.delete(email); 
    return res.status(400).json({ message: 'Mã OTP đã hết hạn.' });
  }
  if (parseInt(otp) !== realOTP) {
    return res.status(400).json({ message: 'Mã OTP không đúng.' });
  }

  otpStore.set(email, { ...record, verified: true }); 
  res.status(200).json({ message: 'Xác thực email thành công. Bạn có thể tiếp tục đăng ký.' });
};

// =================== GỬI MÃ OTP (CHO QUÊN MẬT KHẨU) ===================
export const forgotPasswordRequestOtp = async (req, res) => {
    const { email } = req.body;

    try {
        if (!email) {
            return res.status(400).json({ message: 'Email là bắt buộc.' });
        }
        if (!/.+@.+\..+/.test(email)) {
            return res.status(400).json({ message: 'Email không đúng định dạng.' });
        }

        const [users] = await db.promise().query("SELECT * FROM users WHERE email = ?", [email]);
        if (users.length === 0) {
            return res.status(404).json({ message: 'Không tìm thấy tài khoản với email này.' });
        }

        const otpCode = generateOtp();
        const expiresAt = Date.now() + OTP_EXPIRY_MINUTES * 60 * 1000;

        otpStore.set(email, {
            otp: parseInt(otpCode), 
            expiresAt,
            verified: false,
            type: 'forgot_password' 
        });

        try {
            await sendOTP(email, otpCode);
            res.status(200).json({ message: 'Mã xác nhận đã được gửi đến email của bạn.' });
        } catch (error) {
            console.error('Lỗi gửi email đặt lại mật khẩu:', error);
            res.status(500).json({ message: 'Không gửi được mã xác nhận. Vui lòng thử lại sau.' });
        }

    } catch (err) {
        console.error('Lỗi trong forgotPasswordRequestOtp:', err);
        res.status(500).json({ message: 'Lỗi server khi yêu cầu đặt lại mật khẩu.' });
    }
};

// ===== XÁC MINH OTP (CHO QUÊN MẬT KHẨU) =====
export const verifyOtpForResetPassword = (req, res) => {
    const { email, otp } = req.body;

    const record = otpStore.get(email);
    if (!record) {
        return res.status(400).json({ message: 'Không tìm thấy OTP hoặc OTP đã hết hạn.' });
    }

    if (record.type !== 'forgot_password') { 
        return res.status(400).json({ message: 'Mã xác nhận không hợp lệ cho yêu cầu này.' });
    }

    const { otp: realOTP, expiresAt } = record;
    if (Date.now() > expiresAt) {
        otpStore.delete(email);
        return res.status(400).json({ message: 'Mã xác nhận đã hết hạn.' });
    }
    if (parseInt(otp) !== realOTP) {
        return res.status(400).json({ message: 'OTP không đúng.' });
    }

    otpStore.set(email, { ...record, verified: true }); 
    res.json({ message: 'Xác thực OTP thành công. Bây giờ bạn có thể đặt lại mật khẩu.' });
};


// ===== 2. resetPassword: Đặt lại mật khẩu mới sau khi OTP đã được xác minh =====
export const resetPassword = async (req, res) => {
    const { email, new_password } = req.body; 

    try {
        if (!email || !new_password) {
            return res.status(400).json({ message: 'Email và mật khẩu mới là bắt buộc.' });
        }
        if (new_password.length < 6) {
            return res.status(400).json({ message: 'Mật khẩu mới phải có ít nhất 6 ký tự.' });
        }

        const otpRecord = otpStore.get(email);
        if (!otpRecord || !otpRecord.verified || otpRecord.type !== 'forgot_password') { 
            return res.status(400).json({ message: 'Vui lòng xác minh mã xác nhận trước khi đặt lại mật khẩu.' });
        }
        if (Date.now() > otpRecord.expiresAt) { 
            otpStore.delete(email);
            return res.status(400).json({ message: 'Mã xác nhận đã hết hạn. Vui lòng yêu cầu lại.' });
        }


        const salt = bcrypt.genSaltSync(10);
        const hashed_new_password = bcrypt.hashSync(new_password, salt);

        const [result] = await db.promise().query(
            "UPDATE users SET password_hash = ? WHERE email = ?",
            [hashed_new_password, email]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Không tìm thấy tài khoản để đặt lại mật khẩu.' });
        }

        otpStore.delete(email);
        res.status(200).json({ message: 'Mật khẩu đã được đặt lại thành công!' });

    } catch (err) {
        console.error('Lỗi trong resetPassword:', err);
        res.status(500).json({ message: 'Lỗi server khi đặt lại mật khẩu.' });
    }
};
///==============================quan li thong tin ng dung / CO THE DOI MAT KHAU
// ===== ĐỔI MẬT KHẨU (TRONG TRANG QUẢN LÝ TÀI KHOẢN) =====
export const changePassword = async (req, res) => {
    try {
        const userId = req.user.id; // Lấy user ID từ token đã được authMiddleware giải mã
        const { current_password, new_password } = req.body; // ✅ SỬA TÊN BIẾN Ở ĐÂY

        if (!current_password || !new_password) {
            return res.status(400).json({ message: "Vui lòng nhập đầy đủ mật khẩu hiện tại và mật khẩu mới." });
        }
        if (new_password.length < 6) { // Thêm validation độ dài mật khẩu mới
            return res.status(400).json({ message: "Mật khẩu mới phải có ít nhất 6 ký tự." });
        }

        const [users] = await db.promise().query(
            "SELECT password_hash FROM users WHERE user_id = ?",
            [userId]
        );

        if (users.length === 0) {
            return res.status(404).json({ message: "Không tìm thấy người dùng." });
        }

        const user = users[0];

        const isMatch = await bcrypt.compare(current_password, user.password_hash);
        if (!isMatch) {
            return res.status(400).json({ message: "Mật khẩu hiện tại không đúng." });
        }

        const hashedNewPassword = await bcrypt.hash(new_password, 10); // Hash mật khẩu mới

        await db.promise().query(
            "UPDATE users SET password_hash = ? WHERE user_id = ?",
            [hashedNewPassword, userId]
        );

        res.status(200).json({ message: "Đổi mật khẩu thành công!" });

    } catch (error) {
        console.error("❌ Lỗi khi đổi mật khẩu:", error);
        res.status(500).json({ message: "Lỗi server khi đổi mật khẩu." });
    }
};