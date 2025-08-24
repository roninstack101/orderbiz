import express from 'express';
import { deleteEntity, getAllusers, updateUser, getAllshops, createShop, updateShop, registration } from '../controller/admincontroller.js';
import { authenticateUser } from '../middleware/authMiddleware.js';



const admin = express.Router();

admin.put('/users/:id', authenticateUser, updateUser);

admin.get('/users',authenticateUser, getAllusers);

admin.put('/shops/:id', authenticateUser, updateShop);

admin.delete('/delete/:type/:id', deleteEntity);

admin.get('/shops', authenticateUser, getAllshops);

admin.post('/createshop', authenticateUser, createShop);

admin.post('/register', registration);

export default admin;

