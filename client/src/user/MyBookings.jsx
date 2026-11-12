import { useState, useEffect, useCallback } from "react";
import { api, inr, fmtDate, fmtDateTime, todayStr } from "../api";

const STATUS_LABEL = {
  confirmed: "UPCOMING",
  checked_in: "CHECKED IN",
  checked_out: "CHECKED OUT",
  cancelled: "CANCELLED",
};

export default function MyBookings({ user, refreshKey, onGoHome }) {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [busyId, setBusyId] = useState(null);

  const load = useCallback(async () => {
    try {
      setError("");
      const data = await api(`/api/bookings?email=${encodeURIComponent(user.email)}`);
      setBookings(data.bookings);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, [user.email]);

  useEffect(() => { load(); }, [load, refreshKey]);

  const act = async (booking, action, confirmText) => {
    if (confirmText && !window.confirm(confirmText)) return;
    setBusyId(booking._id);
    setError("");
    setNotice("");
    try {
      const data = await api(`/api/bookings/${booking._id}/${action}`, {
        method: "PATCH",
        body: { guestEmail: user.email },
      });
      setNotice(data.message);
      setBookings((list) => list.map((b) => (b._id === booking._id ? data.booking : b)));
    } catch (e) {
      setError(e.message);
    } finally {
      setBusyId(null);
    }
  };

  const today = todayStr();

  return (
    <div className="ss-wrap">
      <p className="ss-label">YOUR RESERVATIONS</p>
      <h1 className="ss-title">My Bookings</h1>
      <p className="ss-sub">Check in when you arrive, check out when you leave.</p>

      {notice && <div className="ss-success">{notice}</div>}
      {error && <div className="ss-error" style={{ marginBottom: 16 }}>{error}</div>}

      {loading ? (
        <div className="ss-empty">Loading your bookings…</div>
      ) : bookings.length === 0 ? (
        <div className="ss-empty">
          <div style={{ fontSize: 40 }}>🧳</div>
          <h3>No bookings yet</h3>
          <p>Find a hotel and your reservations will appear here.</p>
          <button className="ss-btn" onClick={onGoHome}>Find a stay</button>
        </div>
      ) : (
        bookings.map((b) => {
          const checkInDay = String(b.checkIn).slice(0, 10);
          const checkOutDay = String(b.checkOut).slice(0, 10);
          const canCheckInToday = today >= checkInDay && today < checkOutDay;
          const busy = busyId === b._id;
          return (
            <div className="ss-booking" key={b._id}>
              {b.hotel?.image && <img src={b.hotel.image} alt={b.hotel?.name} />}
              <div className="ss-booking-main">
                <div className="ss-booking-top">
                  <div>
                    <h3>{b.hotel?.name || "Hotel"}</h3>
                    <span className="ss-refline">{b.bookingRef} · {b.hotel?.location}</span>
                  </div>
                  <span className={`ss-status ${b.status}`}>{STATUS_LABEL[b.status]}</span>
                </div>

                <div className="ss-facts">
                  <div className="ss-fact"><span>CHECK-IN</span><strong>{fmtDate(b.checkIn)}</strong></div>
                  <div className="ss-fact"><span>CHECK-OUT</span><strong>{fmtDate(b.checkOut)}</strong></div>
                  <div className="ss-fact"><span>ROOMS · GUESTS</span><strong>{b.roomCount} · {b.guests}</strong></div>
                  <div className="ss-fact"><span>TOTAL</span><strong>{inr(b.totalAmount)}</strong></div>
                </div>

                <div className="ss-pay">
                  <b>{b.payment?.detail || "—"}</b>
                  <span className={`ss-paystat ${b.payment?.status}`}>{(b.payment?.status || "").toUpperCase()}</span>
                  {b.payment?.transactionId && <> · {b.payment.transactionId}</>}
                </div>

                {(b.checkedInAt || b.checkedOutAt) && (
                  <div className="ss-timeline">
                    {b.checkedInAt && <>✔ Checked in {fmtDateTime(b.checkedInAt)}</>}
                    {b.checkedOutAt && <> &nbsp;·&nbsp; ✔ Checked out {fmtDateTime(b.checkedOutAt)}</>}
                  </div>
                )}

                <div className="ss-actions">
                  {b.status === "confirmed" && (
                    <>
                      <button className="ss-btn green small" disabled={busy || !canCheckInToday}
                        onClick={() => act(b, "check-in")}>
                        {busy ? "Please wait…" : "✔ Check in"}
                      </button>
                      <button className="ss-btn danger small" disabled={busy}
                        onClick={() => act(b, "cancel",
                          b.payment?.status === "paid"
                            ? "Cancel this booking? Your payment will be refunded."
                            : "Cancel this booking?")}>
                        Cancel booking
                      </button>
                      {!canCheckInToday && today < checkInDay && (
                        <span className="ss-refline">Check-in opens {fmtDate(b.checkIn)}</span>
                      )}
                      {today >= checkOutDay && <span className="ss-refline">This stay's dates have passed</span>}
                    </>
                  )}
                  {b.status === "checked_in" && (
                    <button className="ss-btn small" disabled={busy}
                      onClick={() => act(b, "check-out",
                        b.payment?.status === "pending"
                          ? `Check out now? ${inr(b.totalAmount)} will be settled at the hotel desk.`
                          : "Check out now?")}>
                      {busy ? "Please wait…" : "➜ Check out"}
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })
      )}
    </div>
  );
}
