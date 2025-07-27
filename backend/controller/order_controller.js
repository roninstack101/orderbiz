import Order from "../models/order.model";
import Product from "../models/products.model";
import QRCode from 'qrcode';

export const createOrder = async (req,res) => {
    try {
        const {userId, shopId, items} = req.body;

        if (!items || items.length === 0 ) {
            return res.status(400).json({message: "No items in the card"});
        }

        let totalprice = 0;
        for (const item of items){
            const product = await Product.findById(item.product);
            if(!product){
                return res.status(404).json({ message: `Product not found: ${item.product}` });            }

            if (product.quantity < item.quantity) {
                return res.status(400).json({ message: `Insufficient quantity for ${product.name}` });       
            }
            totalprice += item.quantity * product.price;

            product.quantity -= item.quantity;
            await product.save();
        }

        const order = new Order({
            user: userId,
            shop: shopId,
            items,
            totalprice
        })

        const qrDetail = `Order ID: ${order._id}`;
        const qrcodeURL = await QRCode.toDataURL(qrDetail);

        order.qrCode = qrcodeURL;
        await order.save();

        res.status(201).json({message: 'order created', order});
    } catch (error) {
         res.status(500).json({ message: "Failed to create order", error: error.message });
        
    }
    
} 