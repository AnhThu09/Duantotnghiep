import "../css/Footer.css"
const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        {/* Cột 1 - Thương hiệu */}
        <div className="footer-column">
          <h3 className="brand">
            <span className="dot"></span> Night Owls
          </h3>
          <p>Địa chỉ uy tín hàng đầu về mỹ phẩm chính hãng tại Việt Nam</p>
          <div className="social-icons">
            <a href="#"><i className="fab fa-facebook"></i></a>
            <a href="#"><i className="fab fa-instagram"></i></a>
            <a href="#"><i className="fab fa-youtube"></i></a>
          </div>
        </div>

        {/* Cột 2 - Danh mục sản phẩm */}
        <div className="footer-column">
          <h4>Danh mục sản phẩm</h4>
          <ul>
            <li>Chăm sóc da</li>
            <li>Trang điểm</li>
            <li>Chăm sóc tóc</li>
            <li>Nước hoa</li>
            <li>Sản phẩm nam</li>
          </ul>
        </div>

        {/* Cột 3 - Hỗ trợ khách hàng */}
        <div className="footer-column">
          <h4>Hỗ trợ khách hàng</h4>
          <ul>
            <li>Hướng dẫn mua hàng</li>
            <li>Chính sách đổi trả</li>
            <li>Chính sách bảo mật</li>
            <li>Câu hỏi thường gặp</li>
          </ul>
        </div>

        {/* Cột 4 - Liên hệ */}
        <div className="footer-column">
          <h4>Liên hệ</h4>
          <ul className="contact-info">
            <li><i className="fas fa-phone-alt"></i> Phone</li>
            <li><i className="fas fa-envelope"></i> Gmail</li>
            <li><i className="fas fa-map-marker-alt"></i> Address</li>
          </ul>
        </div>
      </div>

      <div className="footer-bottom">
        <p>Đồ án tốt nghiệp</p>
      </div>
    </footer>
  );
};

export default Footer;
