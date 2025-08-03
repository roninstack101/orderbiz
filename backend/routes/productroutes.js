import express from 'express';
import { createProduct, deleteProduct, getproductsbyshop, updateproduct } from '../controller/product_controller.js';
import { authenticateUser } from '../middleware/authMiddleware.js';

const router =  express.Router();

router.get('/shopproduct/:shopid', getproductsbyshop);

router.post('/add',authenticateUser, createProduct);

router.delete("/delete/:productId",authenticateUser, deleteProduct);

router.put('/update/:productId',authenticateUser, updateproduct);

export default router;