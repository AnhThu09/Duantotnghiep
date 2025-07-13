// routes/reviewRoutes.js
import express from 'express';
import { 
    getAllReviews, 
    getReviewById, 
    createReview, 
    updateReview, 
    deleteReview, 
    getReviewsByProductId,
    checkUserPurchasedProduct
} from '../controllers/reviewController.js'; 

const reviewRoutes = express.Router();

reviewRoutes.get('/', getAllReviews);
reviewRoutes.get('/:id', getReviewById);
reviewRoutes.post('/', createReview); 
reviewRoutes.put('/:id', updateReview);
reviewRoutes.delete('/:id', deleteReview);
reviewRoutes.get('/reviews/purchased/:userId/:productId', checkUserPurchasedProduct);
reviewRoutes.get('/product/:productId', getReviewsByProductId); 
export default reviewRoutes;