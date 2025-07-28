import express from 'express';
import dotenv from 'dotenv';
import { connectDB } from './config/db.js';
import userroutes from '../backend/routes/userroutes.js'
import shopcategoryroutes from '../backend/routes/shopcategoryroutes.js'
import cors from 'cors';
import productroutes from '../backend/routes/productroutes.js'
import shoprequest from '../backend/routes/shoprequest.js';
import shopAcceptRejectroutes from '../backend/routes/shopAcceptRejectroutes.js'
import cartroutes from '../backend/routes/cartroutes.js';
// import productroutes from '../backend/routes/productroutes.js'
import orderroutes from '../backend/routes/orderroutes.js'
const app = express();

dotenv.config();

app.use(cors());
app.use(express.json());

// app.get("/", (req,res) => {
//     res.send("server is ready");
    
// })

// app.post("/api/registration", registration);

app.use('/api/users', userroutes);

app.use('/api/shopcategory', shopcategoryroutes)

app.use('/api/products', productroutes)

app.use('/api/shopenquiries', shoprequest)

app.use('/api/shoprequest', shopAcceptRejectroutes)

app.use('/api/cart', cartroutes)

app.use('/api/product', productroutes)

app.use('/api/order', orderroutes)

// console.log(process.env.MONGO_URI);

app.listen(4000, ()=> {
    connectDB();
    console.log("hello");
});

