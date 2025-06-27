// src/components/ContactForm.tsx

import { useState } from 'react';
import axios from 'axios';
import '../css/ContactForm.css'; // File CSS này sẽ cần được cập nhật để hiển thị bố cục ngang hàng

interface FormData {
  name: string;
  phone: string;
  email: string;
  message: string;
}

const ContactForm = () => {
  const [form, setForm] = useState<FormData>({
    name: '',
    phone: '',
    email: '',
    message: '',
  });

  const [status, setStatus] = useState<string>('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus('');
    // Thêm kiểm tra validation đơn giản trước khi gửi (optional, nhưng nên có)
    if (!form.name || !form.phone || !form.email || !form.message) {
      setStatus('⚠️ Vui lòng điền đầy đủ các trường.');
      return;
    }
    try {
      await axios.post('http://localhost:3000/api/contact', form); // API của bạn
      setStatus('✅ Gửi thành công! Cảm ơn bạn đã liên hệ.');
      setForm({ name: '', phone: '', email: '', message: '' }); // Reset form
    } catch (error) {
      console.error('❌ Gửi lỗi:', error);
      setStatus('❌ Gửi thất bại. Vui lòng thử lại sau.');
    }
  };

  return (
    <div className="contact-container"> {/* Container chính chứa 2 cột */}

      {/* Cột bên trái: Form Liên hệ */}
      <div className="contact-form-column">
        <h2>Liên hệ để cùng hợp tác</h2>
        <p>Rất mong được đồng hành cùng bạn!</p>

        {status && <div className="form-status">{status}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <input
              type="text"
              name="name"
              placeholder="Họ và tên"
              value={form.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <input
              type="text"
              name="phone"
              placeholder="Số điện thoại"
              value={form.phone}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={form.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <textarea
              name="message"
              placeholder="Nội dung"
              rows={4}
              value={form.message}
              onChange={handleChange}
              required
            />
          </div>

          <button type="submit" className="submit-button">Gửi</button>
        </form>
      </div>

      {/* Cột bên phải: Thông tin Liên hệ, Hình ảnh và Google Map */}
      <div className="contact-info-column">
        <div className="contact-info-section"> {/* Phần thông tin liên hệ chi tiết */}
          <h3>THÔNG TIN LIÊN HỆ</h3>
          <div className="info-item">
            <span className="icon">📞</span> <strong>Số điện thoại:</strong> 0775413664 <button className="info-button">Gọi ngay</button>
          </div>
          <div className="info-item">
            <span className="icon">✉️</span> <strong>Email:</strong> Thuhapd10684@gmail.com <button className="info-button">Gửi ngay</button>
          </div>
          <div className="info-item">
            <span className="icon">📍</span> <strong>Địa chỉ:</strong> 123 Đường ABC, Phường XYZ, Quận MN, TP. Đà Nẵng
          </div>
        </div>

        <div className="store-image-section">
          <h3>Cửa hàng của chúng tôi</h3>
          <img
            src="https://scontent.fsgn2-7.fna.fbcdn.net/v/t39.30808-6/475040251_1317043996303473_739601201807759572_n.jpg"
            alt="Contact"
            style={{ maxWidth: '100%', height: 'auto', borderRadius: '8px' }} // inline style cho border-radius và max-width
          />
        </div>

        <div className="map-section">
          <h3>Tìm chúng tôi trên bản đồ</h3>
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3834.020297672322!2d108.21045231485854!3d16.06450638883656!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x314219b1b1f9b36d%3A0x7d2b2c1d2e1b1a1a!2zVHLGsOG7nW5nIMSQ4bqhaSBI4buNYyBCw6FjaCBLaG9hIC0gxJDhuqFpIEjhu41jIMSQw6AgU8ahxqFu!5e0!3m2!1svi!2svn!4v1678888888888!5m2!1svi!2svn" // HÃY THAY THẾ BẰNG URL BẢN ĐỒ THỰC TẾ CỦA BẠN!
            width="100%"
            height="250"
            style={{ border: 0, borderRadius: '8px' }}
            allowFullScreen={false}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="Google Maps Location"
          ></iframe>
        </div>
      </div>
    </div>
  );
};

export default ContactForm;