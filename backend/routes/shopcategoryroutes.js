import express from 'express';
import { getAllshops, getcategory, getNearbyShops, getshopbyid, getShopsByCategory } from '../controller/shopcategory_controller.js';

const router = express.Router();

router.get('/category/:category', getShopsByCategory );

router.get('/category', getcategory);

router.get('/shops', getAllshops);

router.get('/nearby', getNearbyShops);

router.get('/getshop/:id', getshopbyid);

export default router;
