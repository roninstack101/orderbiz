import Shop from '../models/shops.model.js';
import User from '../models/users.model.js';
import Product from '../models/products.model.js';
import bcrypt from 'bcryptjs';
import mongoose from 'mongoose';
import { sendWelcomeEmail } from '../utils/emailservice.js';





export const deleteEntity = async (req, res) => {
  const { type, id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: 'Invalid ID provided.' });
  }

  try {
    // shop deletion logic
    if (type === 'shop') {
      const shop = await Shop.findById(id);
      if (!shop) {
        return res.status(404).json({ message: 'Shop not found.' });
      }
      
      const ownerId = shop.owner;

   
      await Product.deleteMany({ shop: id });

    
      await Shop.findByIdAndDelete(id);

      
      if (ownerId) {
        await User.findByIdAndDelete(ownerId);
      }

      return res.status(200).json({ message: 'Shop, owner, and all associated products have been deleted.' });

  
      // user deletion logic
    } else if (type === 'user') {
      const user = await User.findById(id);
      if (!user) {
        return res.status(404).json({ message: 'User not found.' });
      }

      if (user.role === 'shop_owner') {

        const shop = await Shop.findOne({ owner: user._id });
        if (shop) {  
            await Product.deleteMany({ shop: shop._id });
            await Shop.deleteOne({ _id: shop._id });
        }
      }


      await User.findByIdAndDelete(id);

      return res.status(200).json({ message: 'User and associated shop/products (if any) have been deleted.' });

    } else {
      return res.status(400).json({ message: 'Invalid type. Please use "shop" or "user".' });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'An error occurred on the server.' });
  }
};


export const getAllshops = async (req,res) => {
  try {
    const shops = await Shop.find({}).populate('owner', 'name email phone');
    res.status(200).json(shops);
  } catch (error) {
     res.status(500).json({ message: 'Failed to get shops', error: error.message });
  }
  
};


export const getAllusers = async (req,res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (error) {
     res.status(500).json({ message: 'Failed to get users', error: error.message });
  }
  
};

export const updateUser = async (req, res) => {
  const { id } = req.params;
  const { name, email, phone } = req.body;

  // 1. Validate the incoming data
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: 'Invalid user ID.' });
  }

  if (!name || !email || !phone) {
    return res.status(400).json({ message: 'Name, email, and phone are required.' });
  }

  try {
    // 2. Find the user by their ID
    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    // 3. Check if the new email is already taken by another user
    const emailExists = await User.findOne({ email, _id: { $ne: id } });
    if (emailExists) {
      return res.status(400).json({ message: 'Email is already in use by another account.' });
    }

    // 4. Update the user's fields
    user.name = name;
    user.email = email;
    user.phone = phone;

    // 5. Save the updated user and send the response
    const updatedUser = await user.save();

    res.status(200).json({
      message: 'User updated successfully!',
      user: {
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        phone: updatedUser.phone,
        role: updatedUser.role,
      },
    });

  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({ message: 'Server error while updating user.' });
  }
};



export const createShop = async (req, res) => {

    // console.log("createshop triggered");

  try {
    const { name, email, phone, shop } = req.body;
    const defaultPassword = "admin@123";

    // 1. Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User with this email already exists" });
    }

    // 2. Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(defaultPassword, salt);

    // 3. Create the user
    const user = new User({
      name,
      email,
      phone,
      password: hashedPassword,
      role: "shop_owner",
      shopRequest: { isRequested: true },
    });
    await user.save();

    // 4. Create the shop
    const newShop = new Shop({
      name: shop.name,
      category: shop.category,
      address: shop.address,
      description: shop.description,
      owner: user._id,
      isApproved: true,
      location: shop.location,
    });
    await newShop.save();

    // 5. Link shop to user
    user.shopRequest.shopId = newShop._id;
    user.shopRequest.isAccepted = true;
    await user.save();

    await sendWelcomeEmail(email, name);
    res.status(201).json({
      message: "Shop and user created successfully",
      user,
      shop: newShop,
    });
  } catch (error) {
    console.error("Create shop error:", error);
    res.status(500).json({ message: "Error creating shop", error: error.message });
  }
};


export const updateShop = async (req, res) => {
//   console.log("data: ", req.params);
  try {
    const { id } = req.params;  
    // console.log("Updating shop with ID:", id);

    const { name, category, address, description, location } = req.body;

    const updatedShop = await Shop.findByIdAndUpdate(
      id,
      { name, category, address, description, location },
      { new: true }
    );

    if (!updatedShop) {
      return res.status(404).json({ message: "Shop not found" });
    }

    res.json(updatedShop);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error updating shop" });
  }
};


export const registration = async (req, res) => {
 
    const {name,email, phone}= req.body;
   const defaultPassword = "admin@123";

    try {
        const existingUser = await User.findOne({email});
        if (existingUser) {
           return res.status(400).json({message: "user already exists"});
        }

        const hashedpassword = await bcrypt.hash(defaultPassword,10);
        const user = new User({name, email, phone, password: hashedpassword});
        await user.save();

        await sendWelcomeEmail(email, name);
        res.status(201).json({message: "user successfully created", user});
    } catch (error) {
        res.status(500).json({message: "server error", error: error.message});
        
    }

  
}
