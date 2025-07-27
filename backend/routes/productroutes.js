import express from 'express';
import { createProduct, deleteProduct, getproductsbyshop, updateproduct } from '../controller/product_controller.js';

const router =  express.Router();

router.get('/shopproduct/:shopid', getproductsbyshop);

router.post('/add', createProduct);

router.delete("/delete/:productId", deleteProduct);

router.put('/update/:productId', updateproduct);

export default router;