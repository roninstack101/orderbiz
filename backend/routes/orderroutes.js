import express from 'express';
import { acceptorder, createOrder, getorderbystatus, rejectorder } from '../controller/order_controller.js';
import { authenticateUser } from '../middleware/authMiddleware.js';

const router =  express.Router();

router.get('/getorder/:shopId',authenticateUser, getorderbystatus);

router.post('/create',authenticateUser, createOrder);

router.put("/accept/:orderId",authenticateUser, acceptorder);

router.put("/reject/:orderId",authenticateUser, rejectorder);

export default router;