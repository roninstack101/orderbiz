import express from 'express';
import { registration, loginuser, updateUserProfile, getUserProfile, } from '../controller/usercontroller.js';
import { authenticateUser } from '../middleware/authMiddleware.js';


const router = express.Router();

router.post('/register', registration);

router.post('/login', loginuser);

router.get("/profile", authenticateUser, getUserProfile);
router.put("/profile", authenticateUser, updateUserProfile);




export default router;
