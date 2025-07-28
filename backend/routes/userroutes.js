import express from 'express';
import { registration, loginuser, updateProfile, getprofile } from '../controller/usercontroller.js';

const router = express.Router();

router.post('/register', registration);

router.post('/login', loginuser);

router.get('/profile/:userid', getprofile);

router.put('/update/:userid', updateProfile);    

export default router;
