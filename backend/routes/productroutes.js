import express from 'express';
import { createProduct, deleteProduct, getproductsbyshop, toggleProductAvailability, updateproduct } from '../controller/product_controller.js';
import { authenticateUser } from '../middleware/authMiddleware.js';
import { imageupload } from "../controller/shopcontroller.js";
import upload from '../middleware/upload.js';


const router =  express.Router();

router.get('/shopproduct/:shopid', getproductsbyshop);

router.post('/add',authenticateUser,upload.single("image"), createProduct);

router.delete("/delete/:productId",authenticateUser, deleteProduct);

router.put('/update/:productId',authenticateUser,upload.single("image"), updateproduct);

router.put('/toggle-availability/:productId', authenticateUser, toggleProductAvailability);

export default router;