import './App.css'
import 'leaflet/dist/leaflet.css'

import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import L from 'leaflet'



const hotels = [
  {
    name: 'Meridian Bay',
    location: 'Guntur, Andhra Pradesh',
    rating: '4.8',
    rooms: '186 rooms',
    occupancy: '78%',
    price: '₹4,500',
    image:
      'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=900&q=80',
  },
  {
    name: 'Grand Horizon',
    location: 'Vijayawada, Andhra Pradesh',
    rating: '4.6',
    rooms: '124 rooms',
    occupancy: '72%',
    price: '₹3,800',
    image:
      'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=900&q=80',
  },
  {
    name: 'Royal Palm',
    location: 'Hyderabad, Telangana',
    rating: '4.7',
    rooms: '98 rooms',
    occupancy: '81%',
    price: '₹3,200',
    image:
      'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=900&q=80',
  },
]

function App() {
  return (
    <div className="app">

      {/* SIDEBAR */}
      <aside className="sidebar">

        <div className="brand">
          <div className="brand-icon">S</div>

          <div>
            <h2>StaySphere</h2>
            <span>HOTEL INTELLIGENCE</span>
          </div>
        </div>

        <div className="menu-title">MAIN MENU</div>

        <nav className="sidebar-menu">
          <a className="active" href="#dashboard">
            <span>⌂</span>
            Dashboard
          </a>

          <a href="#hotels">
            <span>♧</span>
            Hotels
          </a>

          <a href="#bookings">
            <span>▣</span>
            Bookings
          </a>

          <a href="#guests">
            <span>♙</span>
            Guests
          </a>

          <a href="#analytics">
            <span>◈</span>
            Analytics
          </a>
        </nav>

        <div className="menu-title">MANAGEMENT</div>

        <nav className="sidebar-menu">
          <a href="#rooms">
            <span>▤</span>
            Rooms
          </a>

          <a href="#staff">
            <span>♟</span>
            Staff
          </a>

          <a href="#settings">
            <span>⚙</span>
            Settings
          </a>
        </nav>

        <div className="sidebar-bottom">

          <div className="help-box">
            <span>✦</span>

            <div>
              <strong>Need assistance?</strong>
              <p>Contact support</p>
            </div>
          </div>

          <div className="admin">
            <div className="avatar">AD</div>

            <div>
              <strong>Admin</strong>
              <p>Administrator</p>
            </div>

            <span>⋮</span>
          </div>

        </div>
      </aside>

      {/* MAIN */}
      <main className="main">

        {/* TOP BAR */}
        <header className="topbar">

          <div>
            <p className="date">
              MONDAY, SEPTEMBER 01, 2026
            </p>

            <h1>
              Good evening, Admin <span>✦</span>
            </h1>
          </div>

          <div className="top-actions">

            <button className="icon-btn">⌕</button>

            <button className="icon-btn notification">
              ♢
            </button>

            <div className="profile">
              <div className="avatar">AD</div>

              <div>
                <strong>Admin</strong>
                <span>Manager</span>
              </div>
            </div>

          </div>
        </header>

        {/* STATISTICS */}
        <section className="stats">

          <div className="stat-card">
            <div className="stat-top">
              <span>Total Revenue</span>
              <div className="stat-icon gold">₹</div>
            </div>

            <h2>₹8.42L</h2>

            <div className="trend positive">
              ↑ 12.8%
              <span>vs last month</span>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-top">
              <span>Occupancy Rate</span>
              <div className="stat-icon blue">◉</div>
            </div>

            <h2>78.4%</h2>

            <div className="progress">
              <div className="progress-fill"></div>
            </div>

            <div className="small-text">
              186 of 237 rooms occupied
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-top">
              <span>Today's Bookings</span>
              <div className="stat-icon purple">▣</div>
            </div>

            <h2>42</h2>

            <div className="trend positive">
              ↑ 8.2%
              <span>vs yesterday</span>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-top">
              <span>Guest Satisfaction</span>
              <div className="stat-icon green">★</div>
            </div>

            <h2>
              4.8<span className="out-of">/5</span>
            </h2>

            <div className="stars">
              ★★★★★
            </div>
          </div>

        </section>

        {/* MAP AND HOTELS */}
        <section className="dashboard-grid">

          {/* MAP */}
          <div className="panel map-panel">

            <div className="panel-header">

              <div>
                <span className="eyebrow">
                  PROPERTY OVERVIEW
                </span>

                <h2>Hotel Locations</h2>
              </div>

              <button className="outline-btn">
                View full map ↗
              </button>

            </div>

            <div className="luxury-map">

              <MapContainer
                center={[16.3067, 80.4365]}
                zoom={8}
                scrollWheelZoom={true}
                style={{
                  height: '100%',
                  width: '100%',
                }}
              >

                <TileLayer
                  attribution="&copy; OpenStreetMap contributors"
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />

                <Marker
                  position={[16.3067, 80.4365]}
                  icon={hotelIcon}
                >
                  <Popup>
                    <div className="map-popup">
                      <h3>Meridian Bay</h3>
                      <p>📍 Guntur, Andhra Pradesh</p>
                      <p>⭐ 4.8 • 186 rooms</p>
                      <p>💰 ₹4,500 / night</p>
                      <strong>78% Occupancy</strong>
                    </div>
                  </Popup>
                </Marker>

                <Marker
                  position={[16.5062, 80.648]}
                  icon={hotelIcon}
                >
                  <Popup>
                    <div className="map-popup">
                      <h3>Grand Horizon</h3>
                      <p>📍 Vijayawada, Andhra Pradesh</p>
                      <p>⭐ 4.6 • 124 rooms</p>
                      <p>💰 ₹3,800 / night</p>
                      <strong>72% Occupancy</strong>
                    </div>
                  </Popup>
                </Marker>

                <Marker
                  position={[17.385, 78.4867]}
                  icon={hotelIcon}
                >
                  <Popup>
                    <div className="map-popup">
                      <h3>Royal Palm</h3>
                      <p>📍 Hyderabad, Telangana</p>
                      <p>⭐ 4.7 • 98 rooms</p>
                      <p>💰 ₹3,200 / night</p>
                      <strong>81% Occupancy</strong>
                    </div>
                  </Popup>
                </Marker>

              </MapContainer>

            </div>

          </div>

          {/* FEATURED HOTELS */}
          <div className="panel hotels-panel" id="hotels">

            <div className="panel-header">

              <div>
                <span className="eyebrow">
                  TOP PROPERTIES
                </span>

                <h2>Featured Hotels</h2>
              </div>

              <button className="more-btn">
                •••
              </button>

            </div>

            <div className="hotel-list">

              {hotels.map((hotel) => (

                <div
                  className="hotel-card"
                  key={hotel.name}
                >

                  <div className="hotel-image">

                    <img
                      src={hotel.image}
                      alt={hotel.name}
                    />

                    <div className="image-overlay"></div>

                    <span className="hotel-badge">
                      ● Active
                    </span>

                    <span className="hotel-rating">
                      ★ {hotel.rating}
                    </span>

                  </div>

                  <div className="hotel-card-content">

                    <div className="hotel-title">

                      <div>
                        <h3>{hotel.name}</h3>

                        <p>
                          📍 {hotel.location}
                        </p>
                      </div>

                      <div className="price">
                        {hotel.price}
                        <small>/night</small>
                      </div>

                    </div>

                    <div className="hotel-meta">

                      <span>
                        🛏 {hotel.rooms}
                      </span>

                      <span>
                        ◉ {hotel.occupancy} occupied
                      </span>

                    </div>

                  </div>

                </div>

              ))}

            </div>

          </div>

        </section>

        {/* BOOKINGS AND ACTIVITY */}
        <section className="bottom-grid">

          {/* BOOKINGS */}
          <div
            className="panel bookings-panel"
            id="bookings"
          >

            <div className="panel-header">

              <div>
                <span className="eyebrow">
                  RECENT ACTIVITY
                </span>

                <h2>Latest Bookings</h2>
              </div>

              <button className="outline-btn">
                View all
              </button>

            </div>

            <div className="booking-row booking-heading">
              <span>GUEST</span>
              <span>PROPERTY</span>
              <span>DATE</span>
              <span>STATUS</span>
              <span>AMOUNT</span>
            </div>

            <div className="booking-row">

              <div className="guest">
                <div className="guest-avatar">
                  RK
                </div>

                <strong>Rahul Kumar</strong>
              </div>

              <span>Meridian Bay</span>
              <span>01 Sep 2026</span>

              <span className="confirmed">
                Confirmed
              </span>

              <strong>₹8,500</strong>

            </div>

            <div className="booking-row">

              <div className="guest">
                <div className="guest-avatar">
                  AR
                </div>

                <strong>Ananya Reddy</strong>
              </div>

              <span>Grand Horizon</span>
              <span>02 Sep 2026</span>

              <span className="pending">
                Pending
              </span>

              <strong>₹6,200</strong>

            </div>

            <div className="booking-row">

              <div className="guest">
                <div className="guest-avatar">
                  AS
                </div>

                <strong>Arjun Sharma</strong>
              </div>

              <span>Royal Palm</span>
              <span>03 Sep 2026</span>

              <span className="confirmed">
                Confirmed
              </span>

              <strong>₹4,800</strong>

            </div>

          </div>

          {/* ACTIVITY */}
          <div className="panel activity-panel">

            <div className="panel-header">

              <div>
                <span className="eyebrow">
                  LIVE
                </span>

                <h2>Activity</h2>
              </div>

            </div>

            <div className="activity">

              <div className="activity-dot gold-dot"></div>

              <div>
                <strong>
                  New booking received
                </strong>

                <p>
                  Meridian Bay · Room 402
                </p>

                <small>
                  8 minutes ago
                </small>
              </div>

            </div>

            <div className="activity">

              <div className="activity-dot green-dot"></div>

              <div>
                <strong>
                  Room marked available
                </strong>

                <p>
                  Grand Horizon · Room 218
                </p>

                <small>
                  24 minutes ago
                </small>
              </div>

            </div>

            <div className="activity">

              <div className="activity-dot blue-dot"></div>

              <div>
                <strong>
                  Guest checked in
                </strong>

                <p>
                  Royal Palm · Arjun Sharma
                </p>

                <small>
                  41 minutes ago
                </small>
              </div>

            </div>

          </div>

        </section>

      </main>

    </div>
  )
}

export default App