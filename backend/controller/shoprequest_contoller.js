import Shoprequest from "../models/shoprequest.model.js";
import bcrypt from "bcryptjs";

export const submitShoprequest = async (req,res) => {
    const {name, email, phone, password, shop} = req.body;

    try {
        const existingRequest = await Shoprequest.findOne({email});
        if(existingRequest)
          return  res.status(400).json({Message: 'Request already submitted'});

        const hashedpassword = await bcrypt.hash(password,10);
        const request = new Shoprequest ({name, email, phone, password: hashedpassword, shop});

        await request.save();
        res.status(200).json({message: 'Shop registration request submitted for approval' });
    } catch (error) {
        res.status(500).json({message: 'server error', error: error.message});

    }
    
}