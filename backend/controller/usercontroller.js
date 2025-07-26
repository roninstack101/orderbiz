import bcrypt from 'bcryptjs';
import User from '../models/users.model.js';
import  jwt  from 'jsonwebtoken';


export const registration = async (req, res) => {
 
    const {name,email, phone, password}= req.body;

    try {
        const existingUser = await User.findOne({email});
        if (existingUser) {
           return res.status(400).json({message: "user already exists"});
        }

        const hashedpassword = await bcrypt.hash(password,10);
        const user = new User({name, email, phone, password: hashedpassword});
        await user.save();
        
        res.status(201).json({message: "user successfully registered", user});
    } catch (error) {
        res.status(500).json({message: "server error", error: error.message});
        
    }

  
}

export const loginuser = async (req,res) => {
    const {email, password} = req.body;

    try {
        const user = await User.findOne({email});
        if(!user)
            res.status(400).json({message: "user not found", error: error.message});

        const isMatch = await bcrypt.compare(password, user.password);
        if(!isMatch)
             res.status(401).json({message: "incorrect password", error: error.message});
        
        const token = jwt.sign(
            {userID: user._id, role: user.role },
            process.env.JWT_SECRET,
            {expiresIn: '1d'}
        );

        res.status(201).json({message: "login successful!",
           user: {
            userId: user._id,
            name: user.name,
            role: user.role,
            email: user.email
        },
        token
    });

        

    } catch (error) {
        res.status(500).json({message: "server error", error: error.message});
        
    }
}

export const userprofile = async (req,res) => {
    
}