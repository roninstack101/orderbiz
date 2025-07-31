import Shoprequest from "../models/shoprequest.model.js";
import Shop from "../models/shops.model.js";
import User from "../models/users.model.js";
import { geocodeAddress } from "../utils/geocodeaddress.js";


export const getShopRequest = async (req,res) => {
    try {
        const requests = await Shoprequest.find();
        res.status(200).json(requests);
    } catch (error) {
         res.status(500).json({message: ' Server down', error: error.message});
    }
    
}

export const shopApproval = async (req, res) => {
  const { requestId } = req.params;

  try {
    const request = await Shoprequest.findById(requestId);
    if (!request) {
      return res.status(401).json({ message: "Request not found" });
    }

    // Create new user
    const user = new User({
      name: request.name,
      email: request.email,
      phone: request.phone,
      password: request.password,
      role: "shop_owner",
      shopRequest: { isRequested: true },
    });

    // 🔄 Geocode address here
    const location = await geocodeAddress(request.shop.address);
    if (!location) {
      return res.status(400).json({ message: "Invalid shop address" });
    }

    // Create shop with geocoded location
    const shop = new Shop({
      name: request.shop.name,
      category: request.shop.category,
      address: request.shop.address,
      description: request.shop.description,
      owner: user._id,
      isApproved: true,
      location, // ⬅️ Include here
    });

    await shop.save();

    // Link user to shop
    user.shopRequest.shopId = shop._id;
    user.shopRequest.isAccepted = true;
    await user.save();

    // Delete the shop request
    await Shoprequest.findByIdAndDelete(requestId);

    res.status(200).json({ message: "Request approved and user/shop created" });
  } catch (error) {
    res.status(500).json({ message: "Error approving request", error: error.message });
  }
};

        
    
export const ShopDecline = async (req,res) => {
  const {requestId} = req.params;

    try {
        const deleted = await Shoprequest.findByIdAndDelete(requestId);
        if(!deleted) return res.status(404).json({ message: "Request not found" });

          res.status(200).json({ message: "Shop request rejected and deleted" });
  } catch (err) {
    res.status(500).json({ message: "Error rejecting", error: err.message });
  }
};
 