# StaySphere – what's new

## User login now has
- **Search -> Hotels results** (the "Find My Stay" button previously went nowhere for users)
- **Book Now** -> details -> **payment** (Card / UPI / Net Banking / Pay at Hotel) -> confirmation with booking ref
- **My Bookings** tab with **Check in**, **Check out** and **Cancel** (refund on cancel)
- Live room availability by date (no overbooking), GST (12%) calculated on the server

## Admin
- Bookings page now shows real bookings (ref, guest, stay dates, status, payment, amount)

## Fixes
- `app.jsx` renamed to `App.jsx` (main.jsx imports `./App.jsx`; fails on Linux/Mac otherwise)
- Distance filter now works (distance computed from city centre; DB had none, so every hotel was "10 km")

## Run
    cd server && npm install && npm run seed && npm run dev
    cd client && npm install && npm run dev      # http://localhost:5173
Optional client env: VITE_API_URL (default http://localhost:5000)

## Rules
- Check-in: only on/after the check-in date and before check-out. Check-out: only after checking in.
- Pay at Hotel is marked paid automatically at check-out.
- Demo gateway: test card 4242 4242 4242 4242 succeeds, 4000 0000 0000 0002 declines. No real charges.
- Old bookings in your DB (old schema) lack booking refs; clear the bookings collection once.
