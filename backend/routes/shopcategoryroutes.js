import express from 'express';
import { getcategory, getShopsByCategory } from '../controller/category_controller.js';

const router = express.Router();

router.get('/category/:category', getShopsByCategory );

router.get('/category', getcategory);

export default router;
