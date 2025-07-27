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

      
        await order.save();

        res.status(201).json({message: 'order created', order});
    } catch (error) {
         res.status(500).json({ message: "Failed to create order", error: error.message });
        
    }
    
} ;


export const getorderbystatus = async (req,res) => {
    const {shopId} = req.params;
    const {status} = req.query;

    try {
        const filter = ({shop : shopId});
        if(status){
            filter.status = status;
        }

        const orders = await Order.find(filter)
        .populate('user', 'name email phone')
        .populate('items.product', 'name price description')
        .sort({ createdAt: -1 });

        res.status(200).json({orders});
    } catch (error) {
        res.status(500).json({ message: 'Error fetching orders', error: error.message });
    }
    
};

export const acceptorder = async (req,res) => {
    const {orderId} = req.params;
    
    try {
        const order = await Order.findById(orderId);
        if(!order) return res.status(404).json({ message : 'order not found'});

         if (order.status !== 'pending') {
      return res.status(400).json({ message: 'Order already processed' });
    }
        
        order.status = 'accepted';

          const qrDetail = `Order ID: ${order._id}`;
        const qrcodeURL = await QRCode.toDataURL(qrDetail);

        order.qrCode = qrcodeURL;
        await order.save();

        res.status(200).json({message: "order accepted", order} );
    } catch (error) {
        res.status(500).json({message: "error in accepting order", error : error.message} );
    }
    
};

export const rejectorder = async (req,res) => {
    const {orderId} = req.params;
    
    try {
        const order = await Order.findById(orderId);
        if(!order) return res.status(404).json({ message : 'order not found'});
        
        order.status = 'declined';
        await order.save();

        res.status(200).json({message: "order declined", order} );
    } catch (error) {
        res.status(500).json({message: "error in declining", error : error.message} );
    }
    
};