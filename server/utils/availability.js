import Booking from '../models/Booking.js';

const ACTIVE = ['confirmed', 'checked_in'];

// Rooms already taken for [checkIn, checkOut) per hotel (date-range overlap).
export async function bookedRoomsByHotel(checkIn, checkOut, hotelIds) {
  const match = {
    status: { $in: ACTIVE },
    checkIn: { $lt: checkOut },
    checkOut: { $gt: checkIn }
  };
  if (hotelIds) match.hotel = { $in: hotelIds };
  const rows = await Booking.aggregate([
    { $match: match },
    { $group: { _id: '$hotel', booked: { $sum: '$roomCount' } } }
  ]);
  return new Map(rows.map((r) => [String(r._id), r.booked]));
}

export async function availableRoomsForHotel(hotel, checkIn, checkOut) {
  const booked = await bookedRoomsByHotel(checkIn, checkOut, [hotel._id]);
  return Math.max(0, hotel.rooms - (booked.get(String(hotel._id)) || 0));
}
