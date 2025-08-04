import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
    shop: {type: mongoose.Schema.Types.ObjectId, ref: 'Shop', required: true},
    name: {type: String, required: true},
    description: String,
    price: {type: Number, required : true},
    quantity: {type: Number, required : true},
    category: String,
    isAvailable: {type: Boolean, default: true},
     image: {
  type: String,
  required: false, // optional
  default: "", // or placeholder
},
});

const Product = mongoose.model('Product', productSchema);
export default Product;