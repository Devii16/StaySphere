import express from 'express';
import crypto from 'crypto';
import Booking from '../models/Booking.js';
import Hotel from '../models/Hotel.js';
import { todayString, parseDay, dayString, nightsBetween } from '../utils/dates.js';
import { availableRoomsForHotel } from '../utils/availability.js';
import { processPayment } from '../utils/payment.js';

const router = express.Router();
const GST_RATE = 0.12;

const newRef = () => `SS-${crypto.randomBytes(3).toString('hex').toUpperCase()}`;
const fail = (res, code, message) => res.status(code).json({ success: false, message });
const isEmail = (v) => /^\S+@\S+\.\S+$/.test(String(v || ''));

function price(hotel, nights, roomCount) {
  const subtotal = hotel.price * nights * roomCount;
  const taxAmount = Math.round(subtotal * GST_RATE);
  return { subtotal, taxAmount, totalAmount: subtotal + taxAmount };
}

// POST /api/bookings/quote  -> price preview + live availability
router.post('/quote', async (req, res) => {
  try {
    const { hotelId, checkIn, checkOut, roomCount = 1 } = req.body;
    const start = parseDay(checkIn), end = parseDay(checkOut);
    if (!start || !end) return fail(res, 400, 'Choose valid check-in and check-out dates.');
    const nights = nightsBetween(start, end);
    if (nights < 1) return fail(res, 400, 'Check-out must be after check-in.');
    const hotel = await Hotel.findById(hotelId);
    if (!hotel) return fail(res, 404, 'Hotel not found.');
    const rooms = Math.max(1, Number(roomCount) || 1);
    const availableRooms = await availableRoomsForHotel(hotel, start, end);
    res.json({ success: true, nights, availableRooms, ...price(hotel, nights, rooms), gstRate: GST_RATE });
  } catch (error) {
    fail(res, 400, 'Unable to calculate price.');
  }
});

// POST /api/bookings  -> create booking + take payment
router.post('/', async (req, res) => {
  try {
    const { guestName, guestEmail, guestPhone, hotelId, checkIn, checkOut,
            guests = 1, roomCount = 1, payment = {} } = req.body;

    if (!guestName?.trim() || !isEmail(guestEmail) || !hotelId || !checkIn || !checkOut) {
      return fail(res, 400, 'Please provide your name, a valid email, the hotel and both dates.');
    }
    const start = parseDay(checkIn), end = parseDay(checkOut);
    if (!start || !end) return fail(res, 400, 'Invalid dates.');
    if (dayString(start) < todayString()) return fail(res, 400, 'Check-in cannot be in the past.');
    const nights = nightsBetween(start, end);
    if (nights < 1) return fail(res, 400, 'Check-out must be after check-in.');
    if (nights > 30) return fail(res, 400, 'Stays are limited to 30 nights.');

    const hotel = await Hotel.findById(hotelId);
    if (!hotel || !hotel.available) return fail(res, 404, 'This hotel is not currently available.');

    const rooms = Math.min(5, Math.max(1, Number(roomCount) || 1));
    const guestCount = Math.max(1, Number(guests) || 1);
    const free = await availableRoomsForHotel(hotel, start, end);
    if (free < rooms) {
      return fail(res, 409, free === 0
        ? 'Sorry, no rooms are left for those dates.'
        : `Only ${free} room(s) left for those dates.`);
    }

    const amounts = price(hotel, nights, rooms);
    const result = processPayment({ method: payment.method, details: payment, amount: amounts.totalAmount });
    if (!result.ok) return fail(res, 402, result.message);

    const booking = await Booking.create({
      bookingRef: newRef(),
      guestName: guestName.trim(), guestEmail, guestPhone,
      hotel: hotel._id, checkIn: start, checkOut: end,
      guests: guestCount, roomCount: rooms, nights, ...amounts,
      payment: {
        method: payment.method, status: result.status, transactionId: result.transactionId,
        detail: result.detail, amount: amounts.totalAmount, paidAt: result.paidAt
      },
      status: 'confirmed'
    });
    await booking.populate('hotel');
    res.status(201).json({ success: true, message: 'Booking confirmed', booking });
  } catch (error) {
    fail(res, 500, `Unable to create booking: ${error.message}`);
  }
});

// GET /api/bookings?email=...   (omit email for the admin list)
router.get('/', async (req, res) => {
  try {
    const filter = {};
    if (req.query.email) filter.guestEmail = String(req.query.email).toLowerCase().trim();
    const bookings = await Booking.find(filter).populate('hotel').sort({ createdAt: -1 });
    res.json({ success: true, count: bookings.length, bookings });
  } catch (error) {
    fail(res, 500, 'Unable to fetch bookings');
  }
});

// Loads a booking and checks it belongs to the email sent by the client.
async function loadOwned(req, res) {
  const booking = await Booking.findById(req.params.id).populate('hotel').catch(() => null);
  if (!booking) { fail(res, 404, 'Booking not found.'); return null; }
  const email = String(req.body?.guestEmail || '').toLowerCase().trim();
  if (email !== booking.guestEmail) { fail(res, 403, 'This booking belongs to a different account.'); return null; }
  return booking;
}

// PATCH /api/bookings/:id/check-in
router.patch('/:id/check-in', async (req, res) => {
  try {
    const booking = await loadOwned(req, res);
    if (!booking) return;
    if (booking.status !== 'confirmed') return fail(res, 400, `Cannot check in: booking is ${booking.status.replace('_', ' ')}.`);
    const today = todayString();
    if (today < dayString(booking.checkIn)) {
      return fail(res, 400, `Check-in opens on ${dayString(booking.checkIn)}.`);
    }
    if (today >= dayString(booking.checkOut)) return fail(res, 400, 'This stay has already ended.');
    booking.status = 'checked_in';
    booking.checkedInAt = new Date();
    await booking.save();
    res.json({ success: true, message: 'Checked in. Enjoy your stay!', booking });
  } catch (error) {
    fail(res, 500, 'Unable to check in.');
  }
});

// PATCH /api/bookings/:id/check-out
router.patch('/:id/check-out', async (req, res) => {
  try {
    const booking = await loadOwned(req, res);
    if (!booking) return;
    if (booking.status !== 'checked_in') return fail(res, 400, 'You must be checked in before you can check out.');
    booking.status = 'checked_out';
    booking.checkedOutAt = new Date();
    if (booking.payment?.status === 'pending') { // pay-at-hotel is settled at the desk
      booking.payment.status = 'paid';
      booking.payment.paidAt = new Date();
      booking.payment.transactionId = `DESK_${crypto.randomBytes(4).toString('hex').toUpperCase()}`;
      booking.payment.detail = 'Paid at hotel during check-out';
    }
    await booking.save();
    res.json({ success: true, message: 'Checked out. Thank you for staying with us!', booking });
  } catch (error) {
    fail(res, 500, 'Unable to check out.');
  }
});

// PATCH /api/bookings/:id/cancel
router.patch('/:id/cancel', async (req, res) => {
  try {
    const booking = await loadOwned(req, res);
    if (!booking) return;
    if (booking.status !== 'confirmed') return fail(res, 400, 'Only upcoming bookings that have not been checked in can be cancelled.');
    booking.status = 'cancelled';
    booking.cancelledAt = new Date();
    if (booking.payment?.status === 'paid') {
      booking.payment.status = 'refunded';
      booking.payment.refundedAt = new Date();
    }
    await booking.save();
    res.json({ success: true, message: 'Booking cancelled.', booking });
  } catch (error) {
    fail(res, 500, 'Unable to cancel booking.');
  }
});

export default router;
