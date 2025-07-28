import Order from "../models/order.model.js";
import Product from "../models/products.model.js";
import QRCode from 'qrcode';

export const createOrder = async (req, res) => {
  try {
    const { userId, shopId, items } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ message: "No items in the cart" });
    }

    let totalPrice = 0;
    const updatedItems = [];

    for (const item of items) {
      const product = await Product.findById(item.product);
      if (!product) {
        return res.status(404).json({ message: `Product not found: ${item.product}` });
      }

      const qty = Number(item.quantity);
      if (qty <= 0) {
        return res.status(400).json({ message: `Invalid quantity for ${product.name}` });
      }

      if (product.quantity < qty) {
        return res.status(400).json({ message: `Insufficient quantity for ${product.name}` });
      }

      totalPrice += qty * product.price;

      updatedItems.push({
        product: item.product,
        quantity: qty
      });
    }

    const order = new Order({
      user: userId,
      shop: shopId,
      items: updatedItems,
      totalPrice
    });

    await order.save();

    res.status(201).json({ message: 'Order created', order });
  } catch (error) {
    res.status(500).json({ message: "Failed to create order", error: error.message });
  }
};



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

export const acceptorder = async (req, res) => {
  const { orderId } = req.params;

  try {
    const order = await Order.findById(orderId).populate('items.product');
    if (!order) return res.status(404).json({ message: 'Order not found' });

    if (order.status !== 'pending') {
      return res.status(400).json({ message: 'Order already processed' });
    }

    
    for (const item of order.items) {
      const product = item.product;
      const qty = item.quantity;

      if (product.quantity < qty) {
        return res.status(400).json({ message: `Insufficient quantity for ${product.name}` });
      }

      product.quantity -= qty;
      await product.save();
    }

    
    order.status = 'accepted';
    const qrDetail = `Order ID: ${order._id}`;
    const qrcodeURL = await QRCode.toDataURL(qrDetail);
    order.qrCode = qrcodeURL;

    await order.save();

    res.status(200).json({ message: "Order accepted", order });
  } catch (error) {
    res.status(500).json({ message: "Error in accepting order", error: error.message });
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