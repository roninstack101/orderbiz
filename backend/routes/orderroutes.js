import express from 'express';
import { acceptorder, createOrder, getorderbystatus, rejectorder } from '../controller/order_controller.js';

const router =  express.Router();

router.get('/getorder/:shopId', getorderbystatus);

router.post('/create', createOrder);

router.put("/accept/:orderId", acceptorder);

router.put("/reject/:orderId", rejectorder);

export default router;