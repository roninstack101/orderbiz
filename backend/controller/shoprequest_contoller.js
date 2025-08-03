import Shoprequest from "../models/shoprequest.model.js";
import bcrypt from "bcryptjs";

export const submitShoprequest = async (req, res) => {
    const { name, email, phone, password, shop } = req.body;

    // 1. ✅ Destructure latitude and longitude from the nested shop object
    const { latitude, longitude } = shop;

    // 2. ✅ Validate that the coordinates exist
    if (!latitude || !longitude) {
        return res.status(400).json({ message: 'Shop location coordinates are required.' });
    }

    try {
        const existingRequest = await Shoprequest.findOne({ email });
        if (existingRequest) {
            return res.status(400).json({ message: 'Request already submitted' });
        }

        const hashedpassword = await bcrypt.hash(password, 10);
        
        // 3. ✅ Manually construct the new request with the correct GeoJSON format
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
                    // Remember: [longitude, latitude]
                    coordinates: [longitude, latitude] 
                }
            }
        });

        await request.save();
        
        // Use 201 for successful creation
        res.status(201).json({ message: 'Shop registration request submitted for approval' });
        
    } catch (error) {
        console.error("Submit Request Error:", error);
        res.status(500).json({ message: 'An unexpected error occurred on the server.' });
    }
};