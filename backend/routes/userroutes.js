import express from 'express';
import { registration, loginuser, updateProfile, getprofile } from '../controller/usercontroller.js';
import { authenticateUser } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/register', registration);

router.post('/login', loginuser);

router.get('/profile/:userid',authenticateUser, getprofile);

router.put('/update/:userid',authenticateUser, updateProfile);    

export default router;
