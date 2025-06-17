import express from 'express';
import {
  createBrand,
  deleteBrand,
  getAllBrands,
  updateBrand
} from '../controllers/brandController.js';
import upload from '../middlewares/upload.js';


const brandRouter = express.Router();


brandRouter.get('/', getAllBrands);
brandRouter.post('/add', upload.single('logo'), createBrand);
brandRouter.put('/update/:id', upload.single('logo'), updateBrand);
brandRouter.delete('/delete/:id', deleteBrand);

export default brandRouter;
