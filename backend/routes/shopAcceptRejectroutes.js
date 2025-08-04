import express from 'express' ;
import {  getShopRequest, shopApproval, ShopDecline } from '../controller/shopAcceptReject_controller.js';
import { authenticateUser } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/getShoprequest',getShopRequest);

router.put('/shopapproval/:requestId',shopApproval);

router.delete('/shopdecline/:requestId',authenticateUser, ShopDecline);

export default router;