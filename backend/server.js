import express from 'express';
import dotenv from 'dotenv';
import { connectDB } from './config/db.js';
import userroutes from '../backend/routes/userroutes.js'
import categoryroutes from '../backend/routes/categoryroutes.js'
import cors from 'cors';
import productroutes from '../backend/routes/productroutes.js'
import shoprequest from '../backend/routes/shoprequest.js';
import shopAcceptRejectroutes from '../backend/routes/shopAcceptRejectroutes.js'



const app = express();

dotenv.config();
app.use(cors());
app.use(express.json());

// app.get("/", (req,res) => {
//     res.send("server is ready");
    
// })

// app.post("/api/registration", registration);

app.use('/api/users', userroutes);

app.use('/api/category', categoryroutes)

app.use('/api/products', productroutes)

app.use('/api/shopenquiries', shoprequest)

app.use('/api/shoprequest', shopAcceptRejectroutes)

// console.log(process.env.MONGO_URI);

app.listen(4000, ()=> {
    connectDB();
    console.log("hello");
});

