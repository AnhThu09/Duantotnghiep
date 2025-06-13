import express from 'express';
import {
  createBrand,
  deleteBrand,
  getAllBrands,
  updateBrand
} from '../controllers/brandController.js';

const brandRouter = express.Router();


brandRouter.get('/', getAllBrands);
brandRouter.post('/add', createBrand);
brandRouter.put('/update/:id', updateBrand);
brandRouter.delete('/delete/:id', deleteBrand);

export default brandRouter;
