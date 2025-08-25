import Shoprequest from "../models/shoprequest.model.js";
import bcrypt from "bcryptjs";
import { sendShopRequestAcknowledgementEmail } from "../utils/emailservice.js";


//submit shop request.....in shoprequest table
export const submitShoprequest = async (req, res) => {
    const { name, email, phone, password, shop } = req.body;

   
    const { latitude, longitude } = shop;

    
    if (!latitude || !longitude) {
        return res.status(400).json({ message: 'Shop location coordinates are required.' });
    }

    try {
        const existingRequest = await Shoprequest.findOne({ email });
        if (existingRequest) {
            return res.status(400).json({ message: 'Request already submitted' });
        }

        const hashedpassword = await bcrypt.hash(password, 10);
        
       
        const request = new Shoprequest({
            name,
            email,
            phone,
            password: hashedpassword,
            shop: {
                name: shop.name,
                address: shop.address,
                category: shop.category,
                description: shop.description,
                location: {
                    type: 'Point',
                    coordinates: [longitude, latitude] 
                }
            }
        });

        await request.save();

       await sendShopRequestAcknowledgementEmail(email, name, shop.name);
        res.status(201).json({ message: 'Shop registration request submitted for approval' });
        
    } catch (error) {
        console.error("Submit Request Error:", error);
        res.status(500).json({ message: 'An unexpected error occurred on the server.' });
    }
};