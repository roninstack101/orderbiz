import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
dotenv.config();
import { connectDB } from './config/db.js';
import userroutes from '../backend/routes/userroutes.js'
import shopcategoryroutes from '../backend/routes/shopcategoryroutes.js'
import productroutes from '../backend/routes/productroutes.js'
import shoprequest from '../backend/routes/shoprequest.js';
import shopAcceptRejectroutes from '../backend/routes/shopAcceptRejectroutes.js'
import cartroutes from '../backend/routes/cartroutes.js';
import shoproutes from '../backend/routes/shoproutes.js'
// import productroutes from '../backend/routes/productroutes.js'
import orderroutes from '../backend/routes/orderroutes.js'
const app = express();


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

app.use('/api/shop', shoproutes)

// console.log(process.env.MONGO_URI);

app.listen(4000, ()=> {
    connectDB();
    console.log("hello");
});

/*const transpoter = nodemailer.createtransporter{
    service:'gmail',
    auth: {
    gmail:'yash@example.com',
    password:'234'
    }

    const mailoption = {
    from:'yash@example.com'
    to:'email',
    subject:'Test',
    body:'Testing'
    }

    transpoter.sendmail(mailoption,(error)=> {
        if(error) return error;
        console.log("email sent successfully")
        })
}*/

