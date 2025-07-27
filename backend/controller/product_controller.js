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



export const createProduct = async (req, res) => {
  try {
    const { shop, name, description, price, quantity, category } = req.body;

    // Validate required fields
    if (!shop || !name || !price || !quantity) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const newProduct = new Product({
      shop,
      name,
      description,
      price,
      quantity,
      category
    });

    await newProduct.save();

    res.status(201).json({
      message: "Product created successfully",
      product: newProduct
    });
  } catch (error) {
    res.status(500).json({
      message: "Error creating product",
      error: error.message
    });
  }
};


const deleteProduct = async (req,res) => {
    try {
        const {id} = req.param;
        const deleted = await Product.findByIdAndDelete(id);
        if (!deleted) {
            return res.status(404).json({message:"Product nod found "})
        }

        res.status(201).json({message:"Product deleted successfully", deleted});
    } catch (error) {
         res.status(500).json({message:"Error deleting product", error: error.message});
    }
    
};  