import express from 'express' ;
import {  getShopRequest, shopApproval, ShopDecline } from '../controller/shopAcceptReject_controller.js';
import { authenticateUser } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/getShoprequest',authenticateUser, getShopRequest);

router.put('/shopapproval/:requestId',authenticateUser, shopApproval);

router.delete('/shopdecline/:requestId',authenticateUser, ShopDecline);

export default router;