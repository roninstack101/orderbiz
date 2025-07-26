import express from 'express';
import { submitShoprequest } from '../controller/shoprequest_contoller.js';

const router =  express.Router();

router.post('/request', submitShoprequest);

export default router;