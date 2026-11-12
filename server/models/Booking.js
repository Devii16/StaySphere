import mongoose from 'mongoose';

const paymentSchema = new mongoose.Schema({
  method: { type: String, enum: ['card', 'upi', 'netbanking', 'pay_at_hotel'], required: true },
  status: { type: String, enum: ['pending', 'paid', 'failed', 'refunded'], default: 'pending' },
  transactionId: String,
  detail: String, // e.g. "Card ending 4242", "UPI: name@bank" (never the full card number)
  amount: Number,
  paidAt: Date,
  refundedAt: Date
}, { _id: false });

const bookingSchema = new mongoose.Schema({
  bookingRef: { type: String, unique: true, index: true },
  guestName: { type: String, required: true, trim: true },
  guestEmail: { type: String, required: true, trim: true, lowercase: true, index: true },
  guestPhone: { type: String, trim: true },
  hotel: { type: mongoose.Schema.Types.ObjectId, ref: 'Hotel', required: true },
  checkIn: { type: Date, required: true },
  checkOut: { type: Date, required: true },
  guests: { type: Number, default: 1, min: 1 },
  roomCount: { type: Number, default: 1, min: 1 },
  nights: { type: Number, required: true },
  subtotal: { type: Number, required: true },
  taxAmount: { type: Number, default: 0 },
  totalAmount: { type: Number, required: true },
  payment: paymentSchema,
  status: {
    type: String,
    enum: ['confirmed', 'checked_in', 'checked_out', 'cancelled'],
    default: 'confirmed'
  },
  checkedInAt: Date,
  checkedOutAt: Date,
  cancelledAt: Date
}, { timestamps: true });

export default mongoose.model('Booking', bookingSchema);
