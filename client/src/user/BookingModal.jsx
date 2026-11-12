import { useState, useEffect } from "react";
import { api, inr, fmtDate, todayStr, addDays } from "../api";

const METHODS = [
  ["card", "💳", "Card"],
  ["upi", "📱", "UPI"],
  ["netbanking", "🏦", "Net Banking"],
  ["pay_at_hotel", "🏨", "Pay at Hotel"],
];
const BANKS = ["State Bank of India", "HDFC Bank", "ICICI Bank", "Axis Bank", "Kotak Mahindra Bank", "Union Bank of India"];

export default function BookingModal({ hotel, initial, user, onClose, onBooked }) {
  const [step, setStep] = useState(1); // 1 details, 2 payment, 3 confirmed
  const [checkIn, setCheckIn] = useState(initial.checkIn);
  const [checkOut, setCheckOut] = useState(initial.checkOut);
  const [guests, setGuests] = useState(initial.guests);
  const [roomCount, setRoomCount] = useState(initial.roomCount);
  const [guestName, setGuestName] = useState(user.name);
  const [guestPhone, setGuestPhone] = useState("");

  const [method, setMethod] = useState("card");
  const [cardNumber, setCardNumber] = useState("");
  const [cardName, setCardName] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");
  const [upiId, setUpiId] = useState("");
  const [bank, setBank] = useState("");

  const [quote, setQuote] = useState(null);
  const [error, setError] = useState("");
  const [paying, setPaying] = useState(false);
  const [booking, setBooking] = useState(null);

  const datesValid = checkIn && checkOut && checkOut > checkIn;

  // Live price + availability from the server
  useEffect(() => {
    if (!datesValid) { setQuote(null); return; }
    let cancelled = false;
    api("/api/bookings/quote", {
      method: "POST",
      body: { hotelId: hotel._id, checkIn, checkOut, roomCount },
    })
      .then((data) => !cancelled && setQuote(data))
      .catch(() => !cancelled && setQuote(null));
    return () => { cancelled = true; };
  }, [hotel._id, checkIn, checkOut, roomCount, datesValid]);

  const maxRooms = quote ? Math.max(0, Math.min(5, quote.availableRooms)) : 5;
  const soldOut = quote && quote.availableRooms < roomCount;

  const onCheckIn = (value) => {
    setCheckIn(value);
    if (checkOut <= value) setCheckOut(addDays(value, 1));
  };

  const goToPayment = () => {
    setError("");
    if (!guestName.trim()) return setError("Please enter the guest name.");
    if (!/^[0-9+\-\s]{10,15}$/.test(guestPhone.trim())) return setError("Enter a valid phone number (10+ digits).");
    if (!datesValid) return setError("Check-out must be after check-in.");
    if (checkIn < todayStr()) return setError("Check-in cannot be in the past.");
    if (!quote) return setError("Could not load the price. Is the server running?");
    if (soldOut) return setError(quote.availableRooms === 0
      ? "No rooms available for these dates. Try different dates."
      : `Only ${quote.availableRooms} room(s) available for these dates.`);
    setStep(2);
  };

  const pay = async () => {
    setError("");
    setPaying(true);
    try {
      const data = await api("/api/bookings", {
        method: "POST",
        body: {
          guestName, guestEmail: user.email, guestPhone,
          hotelId: hotel._id, checkIn, checkOut, guests, roomCount,
          payment: { method, cardNumber, cardName, expiry, cvv, upiId, bank },
        },
      });
      setBooking(data.booking);
      setStep(3);
      onBooked?.(data.booking);
    } catch (e) {
      setError(e.message);
    } finally {
      setPaying(false);
    }
  };

  const formatCard = (v) => v.replace(/\D/g, "").slice(0, 19).replace(/(.{4})/g, "$1 ").trim();
  const formatExpiry = (v) => {
    const d = v.replace(/\D/g, "").slice(0, 4);
    return d.length > 2 ? d.slice(0, 2) + "/" + d.slice(2) : d;
  };

  const Summary = (
    <div className="ss-summary">
      {hotel.image && <img src={hotel.image} alt={hotel.name} />}
      <h4>{hotel.name}</h4>
      <p className="ss-loc">📍 {hotel.location} · ⭐ {hotel.rating}</p>
      <div style={{ marginTop: 12 }}>
        <div className="ss-row"><span>Check-in</span><span>{fmtDate(checkIn)}</span></div>
        <div className="ss-row"><span>Check-out</span><span>{fmtDate(checkOut)}</span></div>
        <div className="ss-row"><span>{hotel.price ? inr(hotel.price) : ""} × {quote?.nights || 0} night(s) × {roomCount} room(s)</span><span>{quote ? inr(quote.subtotal) : "—"}</span></div>
        <div className="ss-row"><span>GST ({Math.round((quote?.gstRate ?? 0.12) * 100)}%)</span><span>{quote ? inr(quote.taxAmount) : "—"}</span></div>
        <div className="ss-row total"><span>Total</span><span>{quote ? inr(quote.totalAmount) : "—"}</span></div>
      </div>
    </div>
  );

  return (
    <div className="ss-overlay" onClick={(e) => e.target === e.currentTarget && step !== 2 && onClose()}>
      <div className="ss-modal">
        <div className="ss-modal-head">
          <h2>{step === 3 ? "Booking confirmed" : `Book ${hotel.name}`}</h2>
          <button className="ss-close" onClick={onClose} aria-label="Close">✕</button>
        </div>

        {step < 3 && (
          <div className="ss-steps">
            <span className={step === 1 ? "on" : "done"}>{step > 1 ? "✓ " : "1 · "}Stay details</span>
            <span className={step === 2 ? "on" : ""}>2 · Payment</span>
          </div>
        )}

        {/* STEP 1 */}
        {step === 1 && (
          <div className="ss-modal-body">
            <div>
              <div className="ss-form-grid">
                <div className="ss-field full">
                  <label>Guest name</label>
                  <input value={guestName} onChange={(e) => setGuestName(e.target.value)} placeholder="Full name" />
                </div>
                <div className="ss-field">
                  <label>Email</label>
                  <input value={user.email} readOnly style={{ opacity: .7 }} />
                </div>
                <div className="ss-field">
                  <label>Phone</label>
                  <input value={guestPhone} onChange={(e) => setGuestPhone(e.target.value)} placeholder="+91 98765 43210" />
                </div>
                <div className="ss-field">
                  <label>Check-in</label>
                  <input type="date" min={todayStr()} value={checkIn} onChange={(e) => onCheckIn(e.target.value)} />
                </div>
                <div className="ss-field">
                  <label>Check-out</label>
                  <input type="date" min={addDays(checkIn || todayStr(), 1)} value={checkOut} onChange={(e) => setCheckOut(e.target.value)} />
                </div>
                <div className="ss-field">
                  <label>Guests</label>
                  <select value={guests} onChange={(e) => setGuests(Number(e.target.value))}>
                    {[1, 2, 3, 4, 5, 6].map((n) => <option key={n} value={n}>{n} guest{n > 1 ? "s" : ""}</option>)}
                  </select>
                </div>
                <div className="ss-field">
                  <label>Rooms</label>
                  <select value={roomCount} onChange={(e) => setRoomCount(Number(e.target.value))}>
                    {[1, 2, 3, 4, 5].map((n) => (
                      <option key={n} value={n} disabled={quote && n > maxRooms}>{n} room{n > 1 ? "s" : ""}</option>
                    ))}
                  </select>
                </div>
              </div>
              {quote && (
                <p className={`ss-avail ${quote.availableRooms === 0 ? "none" : quote.availableRooms <= 3 ? "low" : ""}`} style={{ marginTop: 14 }}>
                  ● {quote.availableRooms === 0 ? "Sold out for these dates" : `${quote.availableRooms} room(s) available for these dates`}
                </p>
              )}
              {error && <div className="ss-error">{error}</div>}
              <div className="ss-foot">
                <button className="ss-btn ghost" onClick={onClose}>Cancel</button>
                <button className="ss-btn" onClick={goToPayment}>Continue to payment →</button>
              </div>
            </div>
            {Summary}
          </div>
        )}

        {/* STEP 2 */}
        {step === 2 && (
          <div className="ss-modal-body">
            <div>
              <div className="ss-methods">
                {METHODS.map(([id, icon, label]) => (
                  <button key={id} className={`ss-method ${method === id ? "sel" : ""}`} onClick={() => { setMethod(id); setError(""); }}>
                    <span>{icon}</span>{label}
                  </button>
                ))}
              </div>

              {method === "card" && (
                <div className="ss-form-grid">
                  <div className="ss-field full">
                    <label>Card number</label>
                    <input inputMode="numeric" value={cardNumber} onChange={(e) => setCardNumber(formatCard(e.target.value))} placeholder="4242 4242 4242 4242" />
                  </div>
                  <div className="ss-field full">
                    <label>Name on card</label>
                    <input value={cardName} onChange={(e) => setCardName(e.target.value)} placeholder="As printed on the card" />
                  </div>
                  <div className="ss-field">
                    <label>Expiry (MM/YY)</label>
                    <input inputMode="numeric" value={expiry} onChange={(e) => setExpiry(formatExpiry(e.target.value))} placeholder="12/30" />
                  </div>
                  <div className="ss-field">
                    <label>CVV</label>
                    <input type="password" inputMode="numeric" maxLength={4} value={cvv} onChange={(e) => setCvv(e.target.value.replace(/\D/g, ""))} placeholder="•••" />
                  </div>
                </div>
              )}

              {method === "upi" && (
                <div className="ss-field">
                  <label>UPI ID</label>
                  <input value={upiId} onChange={(e) => setUpiId(e.target.value)} placeholder="yourname@okbank" />
                </div>
              )}

              {method === "netbanking" && (
                <div className="ss-field">
                  <label>Select your bank</label>
                  <select value={bank} onChange={(e) => setBank(e.target.value)}>
                    <option value="">Choose a bank</option>
                    {BANKS.map((b) => <option key={b}>{b}</option>)}
                  </select>
                </div>
              )}

              {method === "pay_at_hotel" && (
                <p className="ss-hint" style={{ marginTop: 0 }}>
                  No payment now. Your room is reserved and the bill of {quote ? inr(quote.totalAmount) : "—"} is settled at the hotel desk when you check out.
                </p>
              )}

              <p className="ss-hint">
                🔒 Demo payment gateway — no real money is charged. Test card <b>4242 4242 4242 4242</b> (any future expiry, any CVV) succeeds; <b>4000 0000 0000 0002</b> is declined.
              </p>

              {error && <div className="ss-error">{error}</div>}
              <div className="ss-foot">
                <button className="ss-btn ghost" onClick={() => { setStep(1); setError(""); }} disabled={paying}>← Back</button>
                <button className="ss-btn" onClick={pay} disabled={paying}>
                  {paying ? "Processing…" : method === "pay_at_hotel" ? "Confirm booking" : `Pay ${quote ? inr(quote.totalAmount) : ""}`}
                </button>
              </div>
            </div>
            {Summary}
          </div>
        )}

        {/* STEP 3 */}
        {step === 3 && booking && (
          <div className="ss-done">
            <div className="ss-tick">✓</div>
            <h2 style={{ margin: "0 0 6px", fontWeight: 500 }}>You're all set, {booking.guestName.split(" ")[0]}!</h2>
            <p className="ss-sub" style={{ marginBottom: 0 }}>Your stay at {booking.hotel?.name} is booked.</p>
            <div className="ss-ref">{booking.bookingRef}</div>
            <div className="ss-summary ss-receipt">
              <div className="ss-row"><span>Check-in</span><span>{fmtDate(booking.checkIn)}</span></div>
              <div className="ss-row"><span>Check-out</span><span>{fmtDate(booking.checkOut)}</span></div>
              <div className="ss-row"><span>Rooms / Guests</span><span>{booking.roomCount} / {booking.guests}</span></div>
              <div className="ss-row"><span>Subtotal</span><span>{inr(booking.subtotal)}</span></div>
              <div className="ss-row"><span>GST</span><span>{inr(booking.taxAmount)}</span></div>
              <div className="ss-row total"><span>{booking.payment.status === "paid" ? "Paid" : "Due at hotel"}</span><span>{inr(booking.totalAmount)}</span></div>
              <div className="ss-row"><span>Payment</span><span>{booking.payment.detail}</span></div>
              {booking.payment.transactionId && <div className="ss-row"><span>Transaction</span><span>{booking.payment.transactionId}</span></div>}
            </div>
            <button className="ss-btn" onClick={onClose}>Go to My Bookings →</button>
          </div>
        )}
      </div>
    </div>
  );
}
