import Product from "../models/products.model.js";


export const getproductsbyshop = async (req,res) => {
    try {
        const shopid = req.params.shopid;

    const products = await Product.find({ shop:shopid });
    
    res.status(200).json(products);
    } catch (error) {
          res.status(500).json({ message: 'Server Error', error: error.message });
    }
}


export const createProduct = async (req, res) => {
  try {
    const { shop, name, description, price, quantity, category } = req.body;
    const image = req.file ? req.file.path : ""; // Cloudinary URL

    if (!shop || !name || !price || !quantity) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const newProduct = new Product({
      shop,
      name,
      description,
      price,
      quantity,
      category,
      image,
    });

    await newProduct.save();

    res.status(201).json({
      message: "Product created successfully",
      product: newProduct,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error creating product",
      error: error.message,
    });
  }
};



export const deleteProduct = async (req,res) => {
    try {
        const {productId} = req.params;
        const deleted = await Product.findByIdAndDelete(productId);
        if (!deleted) {
            return res.status(404).json({message:"Product nod found "})
        }

        res.status(201).json({message:"Product deleted successfully", deleted});
    } catch (error) {
         res.status(500).json({message:"Error deleting product", error: error.message});
    }
    
};  

export const updateproduct = async (req, res) => {
  const { productId } = req.params;
  const updates = req.body;

  if (req.file) {
    updates.image = req.file.path; // Cloudinary URL
  }

  try {
    const updatedproduct = await Product.findByIdAndUpdate(
      productId,
      updates,
      { new: true, runValidators: true }
    );

    if (!updatedproduct) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.status(200).json({
      message: "Product updated",
      product: updatedproduct,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error updating product",
      error: error.message,
    });
  }
};
