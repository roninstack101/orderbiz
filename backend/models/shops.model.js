import mongoose from "mongoose";

const shopSchema = new mongoose.Schema({
    name: {type: String, required: true},
    description: String,
    address: String,
    category: {type: String, required: true},
    owner: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
    isApproved: {type: Boolean, default: false}
});

const Shop = mongoose.model('Shop', shopSchema);
export default Shop;