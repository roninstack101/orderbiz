import express from 'express';
import { getAllshops, getcategory, getShopsByCategory } from '../controller/shopcategory_controller.js';

const router = express.Router();

router.get('/category/:category', getShopsByCategory );

router.get('/category', getcategory);

router.get('/shops', getAllshops);

export default router;
