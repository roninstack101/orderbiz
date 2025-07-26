import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, unique: true, required: true },  
  phone: { type: String, required: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['user', 'shop_owner', 'admin'], default: 'user' }, 
  shopRequest: {
    isRequested: { type: Boolean, default: false },
    isAccepted: { type: Boolean, default: false },
    shopId: { type: mongoose.Schema.Types.ObjectId, ref: 'Shop' } 
  }
});

const User = mongoose.model('User', userSchema);
export default User;
