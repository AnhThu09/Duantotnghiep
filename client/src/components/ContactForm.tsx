import { useState } from 'react';
import axios from 'axios';
import '../css/ContactForm.css';

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
    try {
      await axios.post('http://localhost:3000/api/contact', form);
      setStatus('✅ Gửi thành công! Cảm ơn bạn đã liên hệ.');
      setForm({ name: '', phone: '', email: '', message: '' });
    } catch (error) {
        console.error('❌ Gửi lỗi:', error);
        setStatus('❌ Gửi thất bại. Vui lòng thử lại sau.');
      }

  };

  return (
    <div className="contact-container">
      <div className="contact-left">
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

          <button type="submit">Gửi</button>
        </form>

        <div className="contact-info">
          <h3>THÔNG TIN LIÊN HỆ</h3>
          <div><strong>Số điện thoại:</strong> 0775413664 <button>Gọi ngay</button></div>
          <div><strong>Email:</strong> Thuhapd10684@gmail.com <button>Gửi ngay</button></div>
        </div>
      </div>

      <div className="contact-right">
        <img
          src="https://scontent.fsgn2-7.fna.fbcdn.net/v/t39.30808-6/475040251_1317043996303473_739601201807759572_n.jpg"
          alt="Contact"
          width={500}
        />
      </div>
    </div>
  );
};

export default ContactForm;
