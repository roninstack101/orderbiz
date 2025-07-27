import mongoose from "mongoose";

const shopRequestSchema = new mongoose.Schema({
  name: String,
  email: String,
  phone: String,
  password: String,
  role: { type: String, enum: ["shop_owner"], default: "shop_owner" },
  shop: {
    name: String,
    category: String,
    address: String,
    description: String,
  },
  status: {
    type: String,
    enum: ["pending", "approved", "rejected"],
    default: "pending",
  },
  createdAt: { type: Date, default: Date.now },
});

const Shoprequest = mongoose.model("Shoprequest", shopRequestSchema);
export default Shoprequest;
