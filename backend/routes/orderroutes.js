import express from 'express';
import { acceptorder, checkoutFromCart, getMyOrders, getorderbystatus, rejectorder, scannedorder } from '../controller/order_controller.js';
import { authenticateUser } from '../middleware/authMiddleware.js';

const router =  express.Router();

router.post('/checkout',authenticateUser, checkoutFromCart );

router.get('/getorder/:shopId',authenticateUser, getorderbystatus);

router.put("/accept/:orderId",authenticateUser, acceptorder);

router.put("/reject/:orderId",authenticateUser, rejectorder);

router.get('/myorders', authenticateUser, getMyOrders);

router.get("/:id", scannedorder);

export default router;