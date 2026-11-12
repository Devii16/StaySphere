import mongoose from 'mongoose';

const hotelSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  location: { type: String, required: true },
  city: { type: String, required: true, index: true },
  price: { type: Number, required: true, min: 0 },
  rating: { type: Number, required: true, min: 0, max: 5 },
  rooms: { type: Number, default: 0, min: 0 },
  available: { type: Boolean, default: true },
  amenities: [{ type: String }],
  image: String,
  coordinates: {
    lat: { type: Number, required: true },
    lng: { type: Number, required: true }
  }
}, { timestamps: true });

hotelSchema.index({ 'coordinates.lat': 1, 'coordinates.lng': 1 });
export default mongoose.model('Hotel', hotelSchema);
