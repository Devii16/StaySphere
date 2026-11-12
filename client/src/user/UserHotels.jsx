import { useState, useEffect, useMemo } from "react";
import { api, inr, todayStr, addDays, fmtDate } from "../api";
import BookingModal from "./BookingModal";

export default function UserHotels({ hotels, preferences, user, onGoHome, onGoBookings }) {
  const [checkIn, setCheckIn] = useState(todayStr());
  const [checkOut, setCheckOut] = useState(addDays(todayStr(), 1));
  const [guests, setGuests] = useState(1);
  const [roomCount, setRoomCount] = useState(1);
  const [availability, setAvailability] = useState({}); // hotelId -> availableRooms for chosen dates
  const [bookingHotel, setBookingHotel] = useState(null);
  const [justBooked, setJustBooked] = useState(false);

  const datesValid = checkIn >= todayStr() && checkOut > checkIn;
  const nights = datesValid ? Math.round((new Date(checkOut) - new Date(checkIn)) / 86400000) : 0;

  // Live availability for the selected dates
  useEffect(() => {
    if (!datesValid || !preferences) return;
    let cancelled = false;
    api(`/api/hotels?city=${encodeURIComponent(preferences.destination)}&checkIn=${checkIn}&checkOut=${checkOut}`)
      .then((data) => {
        if (cancelled) return;
        const map = {};
        data.hotels.forEach((h) => { map[h._id] = h.availableRooms; });
        setAvailability(map);
      })
      .catch(() => !cancelled && setAvailability({}));
    return () => { cancelled = true; };
  }, [checkIn, checkOut, datesValid, preferences]);

  const results = useMemo(() => {
    if (!preferences) return [];
    const maxPrice = Number(preferences.budget) || 10000;
    const minRating = Number(preferences.rating) || 0;
    const maxDistance = Number(preferences.distance) || 10;
    return hotels
      .filter((h) => h.city === preferences.destination)
      .filter((h) => h.price <= maxPrice)
      .filter((h) => h.rating >= minRating)
      .filter((h) => h.distance <= maxDistance)
      .filter((h) => preferences.amenities.every((a) => h.amenities.includes(a)))
      .map((h) => {
        const left = availability[h._id] ?? h.rooms;
        let score = 0;
        score += Math.max(0, 25 - (h.price / maxPrice) * 25);
        score += Math.max(0, 20 - (h.distance / maxDistance) * 20);
        score += (h.rating / 5) * 25;
        score += Math.min(h.amenities.length / 5, 1) * 15;
        score += left > 0 ? 15 : 0;
        return { ...h, roomsLeft: left, matchScore: Math.round(score) };
      })
      .sort((a, b) => (b.roomsLeft > 0) - (a.roomsLeft > 0) || b.matchScore - a.matchScore);
  }, [hotels, preferences, availability]);

  if (!preferences) {
    return (
      <div className="ss-wrap">
        <div className="ss-empty">
          <div style={{ fontSize: 40 }}>🔍</div>
          <h3>Start with a search</h3>
          <p>Pick a destination and preferences first.</p>
          <button className="ss-btn" onClick={onGoHome}>Find My Stay</button>
        </div>
      </div>
    );
  }

  const closeModal = () => {
    setBookingHotel(null);
    if (justBooked) { setJustBooked(false); onGoBookings(); }
  };

  return (
    <div className="ss-wrap">
      <p className="ss-label">RECOMMENDED FOR YOU</p>
      <h1 className="ss-title">Hotels in {preferences.destination}</h1>
      <p className="ss-sub">Choose your dates, then book the stay that fits you best.</p>

      <div className="ss-panel">
        <div className="ss-dates">
          <div className="ss-field">
            <label>Check-in</label>
            <input type="date" min={todayStr()} value={checkIn}
              onChange={(e) => { setCheckIn(e.target.value); if (checkOut <= e.target.value) setCheckOut(addDays(e.target.value, 1)); }} />
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
              {[1, 2, 3, 4, 5].map((n) => <option key={n} value={n}>{n} room{n > 1 ? "s" : ""}</option>)}
            </select>
          </div>
          <button className="ss-btn ghost" onClick={onGoHome}>✎ Edit search</button>
        </div>
        <div className="ss-prefs">
          <span className="ss-chip">Up to {inr(preferences.budget)}/night</span>
          {Number(preferences.rating) > 0 && <span className="ss-chip">{preferences.rating}+ ⭐</span>}
          {Number(preferences.distance) < 10 && <span className="ss-chip">Within {preferences.distance} km</span>}
          {preferences.amenities.map((a) => <span className="ss-chip" key={a}>{a}</span>)}
        </div>
        {!datesValid && <div className="ss-error">Choose a check-in date from today onwards and a later check-out date.</div>}
      </div>

      {results.length === 0 ? (
        <div className="ss-empty">
          <div style={{ fontSize: 40 }}>🏨</div>
          <h3>No hotels match your filters</h3>
          <p>Try a higher budget, a lower rating, a larger distance or fewer amenities.</p>
          <button className="ss-btn" onClick={onGoHome}>Change preferences</button>
        </div>
      ) : (
        results.map((hotel, index) => {
          const soldOut = hotel.roomsLeft < roomCount;
          return (
            <div className="ss-hotel" key={hotel._id}>
              <img src={hotel.image} alt={hotel.name} />
              <div className="ss-hotel-body">
                <div className="ss-hotel-top">
                  <div>
                    {index === 0 && !soldOut && <span className="ss-badge">🏆 BEST MATCH</span>}
                    <h3>{hotel.name}</h3>
                    <p className="ss-loc">📍 {hotel.location} · {hotel.distance} km from centre · ⭐ {hotel.rating}</p>
                  </div>
                  <div className="ss-score"><strong>{hotel.matchScore}%</strong><span>Match</span></div>
                </div>
                <div className="ss-amen">{hotel.amenities.map((a) => <span key={a}>✓ {a}</span>)}</div>
                <div className="ss-hotel-bottom">
                  <div className="ss-price">
                    <strong>{inr(hotel.price)}</strong><small>/night</small>
                    {nights > 0 && <span className="ss-total">{inr(hotel.price * nights * roomCount)} for {nights} night{nights > 1 ? "s" : ""} + GST</span>}
                    <span className={`ss-avail ${hotel.roomsLeft === 0 ? "none" : hotel.roomsLeft <= 3 ? "low" : ""}`}>
                      ● {hotel.roomsLeft === 0 ? "Sold out for these dates" : `${hotel.roomsLeft} room${hotel.roomsLeft > 1 ? "s" : ""} left`}
                    </span>
                  </div>
                  <div className="ss-actions">
                    <a className="ss-link" target="_blank" rel="noreferrer"
                      href={`https://www.openstreetmap.org/?mlat=${hotel.coordinates[0]}&mlon=${hotel.coordinates[1]}#map=16/${hotel.coordinates[0]}/${hotel.coordinates[1]}`}>
                      📍 Map
                    </a>
                    <button className="ss-btn" disabled={!datesValid || soldOut}
                      onClick={() => setBookingHotel(hotel)}>
                      {soldOut ? "Not available" : "Book now →"}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })
      )}

      {bookingHotel && (
        <BookingModal
          hotel={bookingHotel}
          initial={{ checkIn, checkOut, guests, roomCount }}
          user={user}
          onClose={closeModal}
          onBooked={() => setJustBooked(true)}
        />
      )}
    </div>
  );
}
