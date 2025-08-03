import mongoose from "mongoose";

// models/Shoprequest.js

const shopRequestSchema = new mongoose.Schema({
  name: {type:String, required: true},
  email: {type:String, required: true},
  phone: {type:String, required: true},
  password: {type:String, required: true},
  role: { type: String, enum: ["shop_owner"], default: "shop_owner" },
  shop: {
    name: {type:String, required: true} ,
    category: {type:String, required: true},
    address: {type:String, required: true},
    description: String,
    location: {
      type: {
        type: String,
        enum: ['Point'],
        default: 'Point',
        required: true
      },
      coordinates: {
        type: [Number], // [lng, lat]
        required: true
      }
    }
  },
  status: {
    type: String,
    enum: ["pending", "approved", "rejected"],
    default: "pending",
  },
  createdAt: { type: Date, default: Date.now },
});

shopRequestSchema.index({ 'shopDetails.location': '2dsphere' })

const Shoprequest = mongoose.model("Shoprequest", shopRequestSchema);
export default Shoprequest;
