// import React from 'react';
// import {
//   Card,
//   CardMedia,
//   CardContent,
//   Typography,
//   CardActions,
//   Button,
//   Box,
//   IconButton,
// } from '@mui/material';
// import { styled } from '@mui/system'; // Import styled từ @mui/system
// import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
// import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
// import FavoriteIcon from '@mui/icons-material/Favorite'; // Khi sản phẩm đã yêu thích
// import { Link } from 'react-router-dom';

// // Định nghĩa props cho ProductCard
// interface ProductCardProps {
//   product: {
//     product_id: string;
//     name: string;
//     thumbnail: string; // URL ảnh sản phẩm
//     price: number;
//     discount_price?: number; // Giá khuyến mãi, có thể không có
//     // Thêm các thuộc tính khác nếu cần, ví dụ: rating, brand, ...
//   };
//   onAddToCart?: (productId: string) => void;
//   onToggleFavorite?: (productId: string) => void;
//   isFavorite?: boolean;
// }

// // Styled Card để thêm hiệu ứng hover
// const StyledCard = styled(Card)(({ theme }) => ({
//   maxWidth: 300,
//   minWidth: 250,
//   margin: theme.spacing(2),
//   borderRadius: theme.shape.borderRadius,
//   boxShadow: theme.shadows[1], // Shadow mặc định
//   transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out', // Hiệu ứng chuyển động
//   '&:hover': {
//     transform: 'translateY(-5px)', // Nâng nhẹ card lên
//     boxShadow: theme.shadows[4], // Tăng độ bóng
//     '.MuiCardActions-root': {
//         opacity: 1, // Hiển thị nút khi hover
//     }
//   },
// }));

// // Styled CardMedia để đảm bảo ảnh luôn đúng tỷ lệ
// const StyledCardMedia = styled(CardMedia)({
//   height: 200, // Chiều cao cố định cho ảnh
//   objectFit: 'cover', // Đảm bảo ảnh không bị méo
//   padding: '10px', // Khoảng đệm quanh ảnh
// });

// const PriceBox = styled(Box)(({ theme }) => ({
//   display: 'flex',
//   alignItems: 'center',
//   justifyContent: 'flex-start',
//   marginTop: theme.spacing(1),
// }));

// const OriginalPrice = styled(Typography)(({ theme }) => ({
//   color: theme.palette.text.secondary,
//   textDecoration: 'line-through',
//   marginRight: theme.spacing(1),
// }));

// const DiscountPrice = styled(Typography)(({ theme }) => ({
//   color: theme.palette.error.main, // Màu đỏ cho giá khuyến mãi
//   fontWeight: 'bold',
// }));

// // Styled CardActions để ẩn/hiện nút khi hover
// const StyledCardActions = styled(CardActions)(({ theme }) => ({
//     display: 'flex',
//     justifyContent: 'space-between',
//     padding: theme.spacing(1, 2),
//     opacity: 0, // Mặc định ẩn
//     transition: 'opacity 0.3s ease-in-out', // Hiệu ứng chuyển động
// }));


// const ProductCard: React.FC<ProductCardProps> = ({
//   product,
//   onAddToCart,
//   onToggleFavorite,
//   isFavorite,
// }) => {
//   const displayPrice = product.discount_price ?? product.price;
//   const showDiscount = product.discount_price !== undefined && product.discount_price < product.price;

//   return (
//     <StyledCard>
//       {/* Link toàn bộ card hoặc ảnh đến trang chi tiết sản phẩm */}
//       <Link to={`/products/${product.product_id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
//         <StyledCardMedia
//           component="img"
//           image={product.thumbnail || 'https://via.placeholder.com/200'} // Ảnh placeholder nếu không có
//           alt={product.name}
//         />
//       </Link>
//       <CardContent>
//         <Typography gutterBottom variant="h6" component="div" noWrap>
//           {product.name}
//         </Typography>
//         <PriceBox>
//           {showDiscount && (
//             <OriginalPrice variant="body2">
//               {product.price.toLocaleString('vi-VN')} VND
//             </OriginalPrice>
//           )}
//           <Typography variant="body1" component="span" fontWeight="bold">
//             {displayPrice.toLocaleString('vi-VN')} VND
//           </Typography>
//         </PriceBox>
//       </CardContent>
//       <StyledCardActions>
//         <IconButton
//           aria-label="add to favorites"
//           onClick={() => onToggleFavorite?.(product.product_id)}
//           color={isFavorite ? 'error' : 'inherit'} // Đổi màu khi đã yêu thích
//         >
//           {isFavorite ? <FavoriteIcon /> : <FavoriteBorderIcon />}
//         </IconButton>
//         <Button
//           variant="contained"
//           size="small"
//           startIcon={<AddShoppingCartIcon />}
//           onClick={() => onAddToCart?.(product.product_id)}
//         >
//           Thêm
//         </Button>
//       </StyledCardActions>
//     </StyledCard>
//   );
// };

// export default ProductCard;

//điều chỉnh 
import React from 'react';
import {
  Card,
  CardMedia,
  CardContent,
  Typography,
  CardActions,
  Button,
  Box,
  IconButton,
} from '@mui/material';
// Sử dụng styled từ @mui/material/styles cho MUI v5 trở lên
import { styled } from '@mui/material/styles'; 
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';
import { Link } from 'react-router-dom';
import { Product } from '../types'; // Import Product interface từ types.ts

// Định nghĩa props cho ProductCard
interface ProductCardProps {
  product: Product; // Sử dụng interface Product đã định nghĩa
  onAddToCart?: (productId: string) => void;
  onToggleFavorite?: (productId: string) => void;
  isFavorite?: boolean;
}

// Styled Card để thêm hiệu ứng hover
// Sử dụng hàm theme trực tiếp trong style, hoặc dùng template literal
const StyledCard = styled(Card)(({ theme }) => ({
  maxWidth: 300,
  minWidth: 250,
  margin: theme.spacing(2),
  borderRadius: theme.shape.borderRadius,
  boxShadow: theme.shadows[1],
  transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
  '&:hover': {
    transform: 'translateY(-5px)',
    boxShadow: theme.shadows[4],
    '& .MuiCardActions-root': { // Chọn chính xác class của CardActions
      opacity: 1,
    }
  },
}));

// Styled CardMedia để đảm bảo ảnh luôn đúng tỷ lệ
const StyledCardMedia = styled(CardMedia)({
  height: 200,
  objectFit: 'cover',
  padding: '10px',
});

const PriceBox = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-start',
  marginTop: theme.spacing(1),
}));

const OriginalPrice = styled(Typography)(({ theme }) => ({
  color: theme.palette.text.secondary,
  textDecoration: 'line-through',
  marginRight: theme.spacing(1),
}));


// Styled CardActions để ẩn/hiện nút khi hover
const StyledCardActions = styled(CardActions)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  padding: theme.spacing(1, 2),
  opacity: 0,
  transition: 'opacity 0.3s ease-in-out',
}));


const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onAddToCart,
  onToggleFavorite,
  isFavorite,
}) => {
  // Chuyển đổi giá từ string sang number để tính toán và định dạng
  const price = parseFloat(product.price);
  const discountPrice = product.discount_price ? parseFloat(product.discount_price) : undefined; 

  const displayPrice = discountPrice !== undefined ? discountPrice : price;
  const showDiscount = discountPrice !== undefined && discountPrice < price;

  return (
    <StyledCard>
      <Link to={`/products/${product.product_id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
        <StyledCardMedia
          component="img"
          image={product.thumbnail || 'https://via.placeholder.com/200'}
          alt={product.name}
        />
      </Link>
      <CardContent>
        <Typography gutterBottom variant="h6" component="div" noWrap>
          {product.name}
        </Typography>
        <PriceBox>
          {showDiscount && (
            <OriginalPrice variant="body2">
              {price.toLocaleString('vi-VN')} VND
            </OriginalPrice>
          )}
          <Typography variant="body1" component="span" fontWeight="bold">
            {displayPrice.toLocaleString('vi-VN')} VND
          </Typography>
        </PriceBox>
      </CardContent>
      <StyledCardActions>
        <IconButton
          aria-label="add to favorites"
          onClick={() => onToggleFavorite?.(product.product_id)}
          color={isFavorite ? 'error' : 'inherit'}
        >
          {isFavorite ? <FavoriteIcon /> : <FavoriteBorderIcon />}
        </IconButton>
        <Button
          variant="contained"
          size="small"
          startIcon={<AddShoppingCartIcon />}
          onClick={() => onAddToCart?.(product.product_id)}
        >
          Thêm
        </Button>
      </StyledCardActions>
    </StyledCard>
  );
};

export default ProductCard;