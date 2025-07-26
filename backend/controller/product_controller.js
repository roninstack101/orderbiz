import Product from "../models/products.model.js";

export const getproductsbyshop = async (req,res) => {
    try {
        const shopid = app.params.shopId;
    const products = await Product.find({ shop:shopId });
    
    res.status(200).json(products)
    } catch (error) {
          res.status(500).json({ message: 'Server Error', error: error.message });
    }
}