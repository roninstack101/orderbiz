import express from 'express' ;
import { getShopRequest, shopApproval, ShopDecline } from '../controller/shopAcceptReject_controller.js';

const router = express.Router();

router.get('/getShoprequest', getShopRequest);

router.put('/shopapproval/:requestId', shopApproval);

router.delete('/shopdecline/:requestId', ShopDecline);

export default router;