import express from "express";
import upload from "../middleware/upload.js";
import  { authenticateUser } from "../middleware/authMiddleware.js";
import { imageupload } from "../controller/shopcontroller.js";

const router = express.Router();

// Upload and update shop image
router.patch("/image/:shopId", authenticateUser, upload.single("shopImage"), imageupload);

export default router;
