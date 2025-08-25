 import Shop from "../models/shops.model.js";
 import Product from "../models/products.model.js";
 
 
 
 //image upload for shop banner 
 export const imageupload = async (req, res) => {
  try {
    const { shopId } = req.params;
    const imageUrl = req.file?.path;

    if (!imageUrl) {
      return res.status(400).json({ error: "No image uploaded" });
    }

    const updatedShop = await Shop.findByIdAndUpdate(
      shopId,
      { image: imageUrl },
      { new: true }
    );

    if (!updatedShop) {
      return res.status(404).json({ error: "Shop not found" });
    }

    res.status(200).json({
      message: "Image uploaded and shop updated",
      image: imageUrl,
      shop: updatedShop,
    });
  } catch (err) {
    res.status(500).json({ error: "Upload failed", details: err.message });
  }
}

export const getproductsbyshop = async (req,res) => {
    try {
        const shopid = req.params.shopid;

    const products = await Product.find({ shop:shopid});
    
    res.status(200).json(products);
    } catch (error) {
          res.status(500).json({ message: 'Server Error', error: error.message });
    }
}