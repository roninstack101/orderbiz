import mongoose from "mongoose";
const shopSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: String,
  address: String,
  category: { type: String, required: true },
  image: String,
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  isApproved: { type: Boolean, default: false },
  location: {
    type: {
      type: String,
      enum: ['Point'],
      default: 'Point',
    },
    coordinates: {
      type: [Number], // [lng, lat]
      default: undefined, // ⚠️ ensures it's omitted if not set
    },
  },
});

shopSchema.index({ location: '2dsphere' });

const Shop = mongoose.model("Shop", shopSchema);
export default Shop;
