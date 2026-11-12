import express from 'express';
import Hotel from '../models/Hotel.js';
import { parseDay, nightsBetween } from '../utils/dates.js';
import { bookedRoomsByHotel } from '../utils/availability.js';

const router = express.Router();

// GET /api/hotels?city=Guntur&minRating=4&maxPrice=5000
router.get('/', async (req, res) => {
  try {
    const { city, minRating, maxPrice, amenity } = req.query;
    const filter = { available: true };
    if (city) filter.city = new RegExp(`^${city}$`, 'i');
    if (minRating !== undefined) filter.rating = { $gte: Number(minRating) };
    if (maxPrice !== undefined) filter.price = { $lte: Number(maxPrice) };
    if (amenity) filter.amenities = { $in: [amenity] };
    let hotels = (await Hotel.find(filter).sort({ rating: -1 })).map((h) => h.toObject());
    // Optional live availability for a date range: ?checkIn=YYYY-MM-DD&checkOut=YYYY-MM-DD
    const start = parseDay(req.query.checkIn), end = parseDay(req.query.checkOut);
    if (start && end && nightsBetween(start, end) >= 1) {
      const booked = await bookedRoomsByHotel(start, end, hotels.map((h) => h._id));
      hotels = hotels.map((h) => ({ ...h, availableRooms: Math.max(0, h.rooms - (booked.get(String(h._id)) || 0)) }));
    }
    res.json({ success: true, count: hotels.length, hotels });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Unable to fetch hotels', error: error.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const hotel = await Hotel.findById(req.params.id);
    if (!hotel) return res.status(404).json({ success: false, message: 'Hotel not found' });
    res.json({ success: true, hotel });
  } catch (error) {
    res.status(400).json({ success: false, message: 'Invalid hotel ID' });
  }
});

export default router;
