import mongoose from "mongoose";

const shopSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: String,
  address: String,
  category: { type: String, required: true },
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  isApproved: { type: Boolean, default: false },
  image: { type: String }, // <-- New field for image URL
  location: {
    type: {
      type: String,
      enum: ['Point'],
      default: 'Point'
    },
    coordinates: {
      type: [Number], // [lng, lat]
      required: true
    }
  }
});

// Create geospatial index
shopSchema.index({ location: '2dsphere' });

const Shop = mongoose.model('Shop', shopSchema);
export default Shop;
