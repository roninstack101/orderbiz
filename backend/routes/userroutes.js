import express from 'express';
import { registration, loginuser } from '../controller/usercontroller.js';

const router = express.Router();

router.post('/register', registration);

router.post('/login', loginuser);

export default router;
