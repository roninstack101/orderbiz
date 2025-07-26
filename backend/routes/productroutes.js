import express from 'express';
import { getproductsbyshop } from '../controller/product_controller.js';

const router =  express.Router();

router.get('/shops/:shopId', getproductsbyshop);

export default router;