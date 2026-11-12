const userStyles = `
.ss-wrap { max-width: 1180px; margin: 0 auto; padding: 36px 30px 70px; color: #f5f1e8; }
.ss-tabs { display: flex; gap: 6px; margin-left: 40px; }
.ss-tab { background: transparent; border: 0; color: #9aa0a8; padding: 10px 16px; border-radius: 9px; font-size: 14px; }
.ss-tab:hover { color: #fff; background: #1a1d22; }
.ss-tab.active { color: #e6bd4f; background: #221f17; }
.ss-nav-right { display: flex; align-items: center; gap: 14px; }
.ss-nav-user { color: #8a9099; font-size: 12px; }

.ss-title { margin: 0 0 6px; font-size: 30px; font-weight: 500; }
.ss-sub { margin: 0 0 24px; color: #7e8691; }
.ss-label { color: #c99529; letter-spacing: 3px; font-size: 10px; font-weight: 600; margin: 0 0 10px; }

.ss-panel { background: #11151a; border: 1px solid #292f37; border-radius: 16px; padding: 22px; margin-bottom: 22px; }
.ss-dates { display: grid; grid-template-columns: repeat(4, 1fr) auto; gap: 14px; align-items: end; }
.ss-field label { display: block; font-size: 12px; color: #aab0b8; margin-bottom: 7px; }
.ss-field input, .ss-field select {
  width: 100%; padding: 12px; background: #0c0f13; color: #fff; border: 1px solid #303640;
  border-radius: 10px; outline: none; font-size: 14px; color-scheme: dark;
}
.ss-field input:focus, .ss-field select:focus { border-color: #d8aa3e; }
.ss-prefs { display: flex; flex-wrap: wrap; gap: 8px; margin-top: 16px; }
.ss-chip { background: #1a1e24; border: 1px solid #2c323a; color: #b8bec6; padding: 5px 11px; border-radius: 20px; font-size: 12px; }

.ss-btn { background: #d9aa3e; color: #111; border: 0; border-radius: 10px; padding: 12px 20px; font-weight: 700; font-size: 14px; }
.ss-btn:hover:not(:disabled) { background: #edc65d; }
.ss-btn:disabled { opacity: .45; cursor: not-allowed; }
.ss-btn.ghost { background: transparent; color: #ddd; border: 1px solid #3a414b; }
.ss-btn.ghost:hover:not(:disabled) { background: #1a1d22; }
.ss-btn.green { background: #3fae7e; color: #07130d; }
.ss-btn.green:hover:not(:disabled) { background: #55c796; }
.ss-btn.danger { background: transparent; color: #e58a8a; border: 1px solid #5a3333; }
.ss-btn.small { padding: 9px 14px; font-size: 13px; }

.ss-hotel { display: flex; gap: 20px; background: #11151a; border: 1px solid #292f37; border-radius: 16px; overflow: hidden; margin-bottom: 18px; }
.ss-hotel img { width: 270px; object-fit: cover; flex-shrink: 0; background: #1a1d22; }
.ss-hotel-body { padding: 20px 22px 20px 0; flex: 1; min-width: 0; }
.ss-hotel-top { display: flex; justify-content: space-between; gap: 12px; }
.ss-hotel h3 { margin: 4px 0 6px; font-size: 21px; font-weight: 500; }
.ss-badge { display: inline-block; font-size: 10px; letter-spacing: 1.5px; color: #e6bd4f; background: #262215; padding: 4px 9px; border-radius: 6px; }
.ss-loc { color: #7e8691; font-size: 13px; margin: 0; }
.ss-score { text-align: right; }
.ss-score strong { display: block; font-size: 22px; color: #e6bd4f; }
.ss-score span { font-size: 11px; color: #7e8691; }
.ss-amen { display: flex; flex-wrap: wrap; gap: 8px; margin: 14px 0; }
.ss-amen span { font-size: 12px; color: #9fd8bb; background: #14231c; padding: 4px 10px; border-radius: 6px; }
.ss-hotel-bottom { display: flex; justify-content: space-between; align-items: center; gap: 14px; flex-wrap: wrap; }
.ss-price strong { font-size: 24px; }
.ss-price small { color: #7e8691; margin-left: 4px; }
.ss-price .ss-total { display: block; color: #8a9099; font-size: 12px; margin-top: 3px; }
.ss-avail { font-size: 12px; color: #70c29c; }
.ss-avail.low { color: #e2b64a; }
.ss-avail.none { color: #e58a8a; }
.ss-actions { display: flex; gap: 10px; align-items: center; }
.ss-link { color: #aab0b8; font-size: 13px; text-decoration: none; }
.ss-link:hover { color: #fff; }

.ss-empty { text-align: center; padding: 60px 20px; background: #11151a; border: 1px dashed #333a43; border-radius: 16px; color: #8a9099; }
.ss-empty h3 { color: #f5f1e8; margin: 10px 0 6px; font-weight: 500; }
.ss-error { background: #2a1717; border: 1px solid #5a3333; color: #f0a5a5; padding: 11px 14px; border-radius: 10px; font-size: 13px; margin-top: 14px; }
.ss-success { background: #12241b; border: 1px solid #28553f; color: #8fd9b4; padding: 11px 14px; border-radius: 10px; font-size: 13px; margin-bottom: 16px; }

/* modal */
.ss-overlay { position: fixed; inset: 0; background: rgba(0,0,0,.72); display: flex; align-items: flex-start; justify-content: center; padding: 40px 16px; overflow-y: auto; z-index: 1000; }
.ss-modal { width: 100%; max-width: 860px; background: #11151a; border: 1px solid #2a3038; border-radius: 20px; box-shadow: 0 25px 80px rgba(0,0,0,.6); color: #f5f1e8; }
.ss-modal-head { display: flex; justify-content: space-between; align-items: center; padding: 22px 28px; border-bottom: 1px solid #242930; }
.ss-modal-head h2 { margin: 0; font-size: 22px; font-weight: 500; }
.ss-close { background: transparent; border: 1px solid #343a43; color: #aab0b8; width: 34px; height: 34px; border-radius: 8px; font-size: 16px; }
.ss-steps { display: flex; gap: 8px; padding: 16px 28px 0; font-size: 12px; color: #68717c; }
.ss-steps span { padding: 5px 12px; border-radius: 20px; background: #161a1f; }
.ss-steps .on { background: #262215; color: #e6bd4f; }
.ss-steps .done { color: #70c29c; }
.ss-modal-body { display: grid; grid-template-columns: 1fr 310px; gap: 28px; padding: 22px 28px 28px; }
.ss-form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }
.ss-form-grid .full { grid-column: 1 / -1; }
.ss-summary { background: #0d1014; border: 1px solid #262b32; border-radius: 14px; padding: 18px; align-self: start; }
.ss-summary img { width: 100%; height: 130px; object-fit: cover; border-radius: 10px; margin-bottom: 12px; }
.ss-summary h4 { margin: 0 0 3px; font-size: 17px; font-weight: 500; }
.ss-row { display: flex; justify-content: space-between; font-size: 13px; color: #aab0b8; padding: 6px 0; }
.ss-row.total { border-top: 1px solid #2a3038; margin-top: 8px; padding-top: 12px; color: #f5f1e8; font-size: 16px; font-weight: 700; }
.ss-methods { display: grid; grid-template-columns: repeat(4, 1fr); gap: 10px; margin-bottom: 18px; }
.ss-method { background: #0c0f13; border: 1px solid #303640; color: #b8bec6; border-radius: 10px; padding: 12px 6px; font-size: 12px; text-align: center; }
.ss-method span { display: block; font-size: 20px; margin-bottom: 4px; }
.ss-method.sel { border-color: #d8aa3e; color: #e6bd4f; background: #1d1a12; }
.ss-hint { font-size: 12px; color: #7e8691; margin-top: 10px; line-height: 1.5; }
.ss-foot { display: flex; justify-content: space-between; margin-top: 22px; gap: 10px; }
.ss-done { text-align: center; padding: 38px 28px 34px; }
.ss-tick { width: 70px; height: 70px; border-radius: 50%; background: #14301f; color: #5fd49b; display: flex; align-items: center; justify-content: center; font-size: 34px; margin: 0 auto 16px; }
.ss-ref { display: inline-block; margin: 10px 0 20px; padding: 10px 20px; border: 1px dashed #5b4a1b; color: #e6bd4f; letter-spacing: 3px; font-weight: 700; border-radius: 10px; }
.ss-receipt { max-width: 420px; margin: 0 auto 22px; text-align: left; }

/* my bookings */
.ss-booking { background: #11151a; border: 1px solid #292f37; border-radius: 16px; padding: 22px; margin-bottom: 18px; display: flex; gap: 20px; }
.ss-booking img { width: 150px; height: 120px; object-fit: cover; border-radius: 12px; flex-shrink: 0; }
.ss-booking-main { flex: 1; min-width: 0; }
.ss-booking-top { display: flex; justify-content: space-between; gap: 12px; align-items: flex-start; }
.ss-booking h3 { margin: 0 0 4px; font-size: 19px; font-weight: 500; }
.ss-refline { font-size: 12px; color: #7e8691; letter-spacing: 1px; }
.ss-status { font-size: 11px; font-weight: 700; letter-spacing: 1px; padding: 5px 11px; border-radius: 20px; white-space: nowrap; }
.ss-status.confirmed { background: #1a2b3a; color: #7cb8ee; }
.ss-status.checked_in { background: #12301f; color: #5fd49b; }
.ss-status.checked_out { background: #23262b; color: #aab0b8; }
.ss-status.cancelled { background: #301919; color: #e58a8a; }
.ss-facts { display: grid; grid-template-columns: repeat(4, 1fr); gap: 14px; margin: 16px 0; }
.ss-fact span { display: block; font-size: 10px; letter-spacing: 1.5px; color: #68717c; margin-bottom: 5px; }
.ss-fact strong { font-size: 14px; font-weight: 500; }
.ss-pay { font-size: 12.5px; color: #8a9099; margin-bottom: 14px; }
.ss-pay b { color: #d4d7db; font-weight: 500; }
.ss-paystat { padding: 2px 8px; border-radius: 5px; font-size: 11px; margin-left: 6px; }
.ss-paystat.paid { background: #12301f; color: #5fd49b; }
.ss-paystat.pending { background: #33290f; color: #e2b64a; }
.ss-paystat.refunded { background: #23262b; color: #aab0b8; }
.ss-timeline { font-size: 12px; color: #7e8691; margin-bottom: 14px; }

@media (max-width: 860px) {
  .ss-dates { grid-template-columns: 1fr 1fr; }
  .ss-hotel, .ss-booking { flex-direction: column; }
  .ss-hotel img, .ss-booking img { width: 100%; height: 190px; }
  .ss-hotel-body { padding: 0 18px 18px; }
  .ss-modal-body { grid-template-columns: 1fr; }
  .ss-facts { grid-template-columns: 1fr 1fr; }
  .ss-tabs { margin-left: 10px; }
  .ss-nav-user { display: none; }
  .ss-wrap { padding: 24px 16px 50px; }
}
`;

export default userStyles;
