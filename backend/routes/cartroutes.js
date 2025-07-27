import { addtocart, removeItem, clearcart, viewcart } from "../controller/cartcontroller.js";
import express from 'express';

const router = express.Router();

router.get("/getcart/:userid", viewcart);

router.post("/addcart", addtocart);

router.delete("/removefromcart", removeItem);

router.put("/emptycart/:userId", clearcart);


export default router;