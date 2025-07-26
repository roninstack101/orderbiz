import Shop from "../models/shops.model.js";

export const getcategory = async (req,res) => {
    try {
        const categories= await Shop.distinct('category');
        res.status(200).json(categories);
    } catch (error) {
         res.status(500).json({ message: 'Failed to get categories', error: error.message });
        
    }
    
}

export const getShopsByCategory = async (req, res) => {
  const { category } = req.params;

  try {
    const shops = await Shop.find({ category, isApproved: true });
    res.status(200).json(shops);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch shops', error: error.message });
  }
}

export const getAllshops = async (req,res) => {
  try {
    const shops = await Shop.find();
    res.status(200).json(shops);
  } catch (error) {
     res.status(500).json({ message: 'Failed to get shops', error: error.message });
  }
  
}