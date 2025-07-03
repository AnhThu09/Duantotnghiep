import React from 'react';
import { Link } from 'react-router-dom';

// Interface cho Props của component
interface FeaturedSectionProps {
  isReversed?: boolean; // Prop để đảo ngược vị trí cột (mặc định: false)
  smallHeading?: string;
  largeHeading?: string;
  description?: string;
  buttonText?: string;
  buttonLink?: string; // Liên kết cho nút button
  mainImage?: string;
  smallImage1?: string; // Optional small images
  smallImage2?: string; // Optional small images
}

export default function FeaturedSection({ 
    isReversed = false, 
    smallHeading = "What's new",
    largeHeading = "Limited Edition Refreshing Passionfruit",
    description = "Kickstart your summer with our Passionfruit Scrub, Shower Gel, Body Yogurt and Body Mist. Layer all four for a sensory experience that builds a gorgeous fragrance with each step. Your skin? Refreshed. Your mood? Lifted. Your summer? Truly tropical.",
    buttonText = "SHOP NOW", 
    buttonLink = "/danh-muc/san-pham", 
    // Các đường dẫn ảnh mặc định (bạn nên thay bằng ảnh của mình)
    mainImage = "/img/main-product.png", // Khuyến nghị dùng ảnh local
    smallImage1 = "/img/small-product-1.png", 
    smallImage2 = "/img/small-product-2.png",
}: FeaturedSectionProps) {
  return (
    // ✅ Nhúng CSS trực tiếp vào component bằng thẻ <style>
    <>
      <style>{`
        /* --- CSS CHO COMPONENT FEATUREDSECTION --- */
        /*
         * LƯU Ý: Đảm bảo đã import các font chữ này vào header.php (public/index.html)
         * Playfair Display (cho tiêu đề)
         * Raleway (cho nội dung)
         */

        /* 1. CONTAINER CHUNG - ĐẢM BẢO KHÔNG CÓ PADDING NGAN CẢN ẢNH SÁT LỀ */
        .featured-section-container {
            background-color: #fcf8f3;
            padding: 0px !important; /* ✅ LOẠI BỎ TẤT CẢ PADDING TRÊN CONTAINER NGOÀI CÙNG */
            overflow: hidden;
            font-family: 'Raleway', sans-serif;
        }

        /* 2. KHUNG CHỨA NỘI DUNG (hai cột) - ĐỂ NÓ TRÀN HẾT CHIỀU NGANG */
        .featured-content-wrapper {
            /* max-width: 1200px; */ /* ❌ XÓA DÒNG NÀY NẾU MUỐN NỘI DUNG TRÀN HẾT CHIỀU NGANG */
            margin: 0 auto; /* ✅ GIỮ LẠI ĐỂ CÓ THỂ CĂN GIỮ NẾU CẦN, NHƯNG ẢNH SẼ SÁT LỀ */
            width: 100%; 
            height: 450px;/* Đảm bảo nó chiếm hết chiều ngang */
            display: flex;
            align-items: stretch; /* Làm cho các item có chiều cao bằng nhau */
            gap: 0px !important; /* ✅ Đảm bảo không có khoảng cách giữa 2 cột */
            flex-wrap: nowrap; /* Ngăn xuống dòng trên màn hình lớn */
        }

        /* 3. CỘT HÌNH ẢNH - LÀM CHO NÓ TRÀN VÀ ĐẢM BẢO CHỈNH ẢNH */
        .featured-image-gallery {
            flex: 1; /* Cho cột ảnh co giãn để chiếm không gian */
            min-width: 350px; /* Chiều rộng tối thiểu để không bị méo */
            position: relative;
            display: flex;
            justify-content: flex-start; /* Căn ảnh sát lề trái của cột này (khi isReversed=false) */
            align-items: center;
            padding: 0px !important; /* ĐẢM BẢO KHÔNG CÓ PADDING BÊN TRONG CỘT ẢNH */
            overflow: hidden;
             border-radius: 20px !important;
        }

        .main-product-image {
            width: 100%; /* ✅ ẢNH PHẢI CHIẾM 100% CHIỀU RỘNG CỦA CỘT */
            height: auto;
            border-radius: 0 !important; /* ✅ XÓA BO GÓC ĐỂ ẢNH SÁT LỀ HOÀN TOÀN */
            box-shadow: none !important; /* ✅ XÓA ĐỔ BÓNG NẾU MUỐN SÁT LỀ HOÀN TOÀN */
            z-index: 2;
            position: relative;
            display: block;
            object-fit: cover; /* Đảm bảo ảnh lấp đầy không gian mà không bị méo */
        }
        .small-product-image { /* Style for small images */
            position: absolute;
            width: 35%; /* Kích thước ảnh nhỏ hơn */
            height: auto;
            border-radius: 8px; /* Giữ bo góc cho ảnh nhỏ */
            box-shadow: 0 5px 10px rgba(0,0,0,0.1); /* Giữ đổ bóng cho ảnh nhỏ */
            z-index: 1;
        }
        .small-product-image.top-left {
            top: 0;
            left: 0;
            transform: translate(-30%, -30%) rotate(-10deg);
        }
        .small-product-image.bottom-right {
            bottom: 0;
            right: 0;
            transform: translate(30%, 30%) rotate(15deg);
        }


        /* 4. CỘT VĂN BẢN & NÚT - ĐẶT PADDING RIÊNG CHO NỘI DUNG TEXT */
        .featured-text-content {
            flex: 1; /* Cho cột text co giãn */
            max-width: 50%; /* ✅ GIỚI HẠN CHIỀU RỘNG CỦA CỘT TEXT (TÙY CHỌN, ĐIỀU CHỈNH ĐỂ ĐẸP) */
            min-width: 350px; /* Đảm bảo không quá nhỏ */
            text-align: left;
            padding: 50px 40px !important; /* ✅ THÊM PADDING ĐỂ VĂN BẢN CÓ KHOẢNG CÁCH NỘI DUNG */
        }

        /* 5. VĂN BẢN & NÚT CỤ THỂ */
        .featured-small-heading {
            font-family: 'Raleway', sans-serif;
            font-size: 16px;
            font-weight: 600;
            text-transform: uppercase;
            color: #888;
            margin-bottom: 10px;
            letter-spacing: 1px;
        }

        .featured-large-heading {
            font-family: 'Playfair Display', serif;
            font-size: 40px;
            font-weight: 700;
            color: #1a2a4b;
            margin-bottom: 20px;
            line-height: 1.2;
        }

        .featured-description {
            font-family: 'Raleway', sans-serif;
            font-size: 18px;
            line-height: 1.6;
            color: #555;
            margin-bottom: 30px;
        }

        /* NÚT "SHOP NOW" */
        .featured-button {
            display: inline-block;
            padding: 12px 30px;
            border: 1px solid #1a2a4b;
            border-radius: 5px;
            background-color: #fff;
            color: #1a2a4b;
            font-family: 'Raleway', sans-serif;
            font-size: 16px;
            font-weight: 600;
            text-transform: uppercase;
            text-decoration: none;
            transition: all 0.3s ease;
            letter-spacing: 1px;
        }

        .featured-button:hover {
            background-color: #1a2a4b;
            color: #fff;
        }

        /* 6. Responsive adjustments */
        @media (max-width: 768px) {
            .featured-content-wrapper {
                flex-direction: column;
                text-align: center;
                gap: 0;
            }
            .featured-image-gallery {
                width: 100%;
                min-width: unset;
                margin-bottom: 0;
                padding: 0 !important;
            }
            .main-product-image {
                width: 100%;
                border-radius: 0 !important;
                box-shadow: none !important;
            }
            .small-product-image { /* Điều chỉnh ảnh nhỏ trên mobile nếu cần */
                position: static; /* Đưa về vị trí bình thường */
                width: 50%; /* Tăng kích thước ảnh nhỏ trên mobile */
                transform: none; /* Bỏ transform */
                margin: 10px auto; /* Căn giữa */
                /* display: none; */ /* Hoặc ẩn hoàn toàn nếu không muốn hiện trên mobile */
            }
            .featured-text-content {
                width: 100%;
                min-width: unset;
                padding: 40px 20px !important;
                max-width: 100% !important;
            }
        }

        /* Đảo ngược thứ tự cột khi có class 'reversed' */
        .featured-content-wrapper.reversed {
            flex-direction: row-reverse;
        }

        /* Đảm bảo văn bản vẫn căn trái khi cột chữ ở bên trái */
        .featured-content-wrapper.reversed .featured-text-content {
            text-align: left;
        }
        /* Cột ảnh khi reversed cần căn phải */
        .featured-content-wrapper.reversed .featured-image-gallery {
                justify-content: flex-end;
            }
        /* Trên mobile, vẫn xếp chồng khi reversed */
        @media (max-width: 768px) {
            .featured-content-wrapper.reversed {
                flex-direction: column;
            }
        }
      `}</style>

      {/* ✅ Đây là phần JSX của component */}
      <div className="featured-section-container">
        <div className={`featured-content-wrapper ${isReversed ? 'reversed' : ''}`}>
          {/* Cột trái: Hình ảnh sản phẩm */}
          <div className="featured-image-gallery">
            <img src={mainImage} alt={largeHeading} className="main-product-image" />
            {/* Bạn có thể thêm lại smallImage1 và smallImage2 nếu muốn hiển thị */}
            {/* <img src={smallImage1} alt="Product 2" className="small-product-image top-left" /> */}
            {/* <img src={smallImage2} alt="Product 3" className="small-product-image bottom-right" /> */}
          </div>

          {/* Cột phải: Nội dung văn bản và nút */}
          <div className="featured-text-content">
            <p className="featured-small-heading">{smallHeading}</p>
            <h2 className="featured-large-heading">{largeHeading}</h2>
            <p className="featured-description">{description}</p>
            <Link to={buttonLink} className="featured-button">
              {buttonText}
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}