import { addtocart, removeItem, clearcart, viewcart, removeFromCart } from "../controller/cartcontroller.js";
import express from 'express';
import { authenticateUser } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/getcart/:userid",authenticateUser, viewcart);

router.post("/addcart",authenticateUser, addtocart);

router.delete("/deletefromcart",authenticateUser, removeItem);

router.put("/emptycart/:userId", clearcart);


router.post("/remove",authenticateUser, removeFromCart);


export default router;