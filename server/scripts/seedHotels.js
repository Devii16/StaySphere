import 'dotenv/config';
import mongoose from 'mongoose';
import { connectDB } from '../config/db.js';
import Hotel from '../models/Hotel.js';

const hotels = [
  { name:'Meridian Bay', location:'Guntur', city:'Guntur', price:4500, rating:4.8, rooms:12, available:true, amenities:['WiFi','Pool','Parking','AC','Breakfast'], image:'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1000&q=80', coordinates:{lat:16.3067,lng:80.4365} },
  { name:'Grand Guntur Inn', location:'Guntur', city:'Guntur', price:2800, rating:4.3, rooms:20, available:true, amenities:['WiFi','Parking','AC'], image:'https://images.unsplash.com/photo-1564501049412-61c2a3083791?auto=format&fit=crop&w=1000&q=80', coordinates:{lat:16.3005,lng:80.4422} },
  { name:'Budget Stay Guntur', location:'Guntur', city:'Guntur', price:1500, rating:2.8, rooms:15, available:true, amenities:['WiFi','AC'], image:'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=1000&q=80', coordinates:{lat:16.315,lng:80.455} },
  { name:'City Lodge Guntur', location:'Guntur', city:'Guntur', price:1100, rating:3.5, rooms:25, available:true, amenities:['WiFi'], image:'https://images.unsplash.com/photo-1584132967334-10e028bd69f7?auto=format&fit=crop&w=1000&q=80', coordinates:{lat:16.325,lng:80.468} },
  { name:'Grand Horizon', location:'Vijayawada', city:'Vijayawada', price:3800, rating:4.6, rooms:18, available:true, amenities:['WiFi','Parking','AC','Breakfast'], image:'https://images.unsplash.com/photo-1564501049412-61c2a3083791?auto=format&fit=crop&w=1000&q=80', coordinates:{lat:16.5062,lng:80.648} },
  { name:'Krishna Residency', location:'Vijayawada', city:'Vijayawada', price:2500, rating:4.2, rooms:16, available:true, amenities:['WiFi','Parking','AC'], image:'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?auto=format&fit=crop&w=1000&q=80', coordinates:{lat:16.515,lng:80.635} },
  { name:'Vijayawada Comfort Stay', location:'Vijayawada', city:'Vijayawada', price:1400, rating:3.7, rooms:22, available:true, amenities:['WiFi','AC'], image:'https://images.unsplash.com/photo-1598928506311-c55ded91a20c?auto=format&fit=crop&w=1000&q=80', coordinates:{lat:16.525,lng:80.66} },
  { name:'City Budget Lodge', location:'Vijayawada', city:'Vijayawada', price:1000, rating:3.4, rooms:28, available:true, amenities:['WiFi'], image:'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&w=1000&q=80', coordinates:{lat:16.535,lng:80.675} },
  { name:'Royal Palm', location:'Hyderabad', city:'Hyderabad', price:4200, rating:4.7, rooms:8, available:true, amenities:['WiFi','Pool','Parking','Gym','AC'], image:'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?auto=format&fit=crop&w=1000&q=80', coordinates:{lat:17.385,lng:78.4867} },
  { name:'Deccan Grand', location:'Hyderabad', city:'Hyderabad', price:2900, rating:4.3, rooms:14, available:true, amenities:['WiFi','Parking','AC','Breakfast'], image:'https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&w=1000&q=80', coordinates:{lat:17.405,lng:78.475} },
  { name:'Hyderabad City Lodge', location:'Hyderabad', city:'Hyderabad', price:1600, rating:3.8, rooms:20, available:true, amenities:['WiFi','AC'], image:'https://images.unsplash.com/photo-1595576508898-0ad5c879a061?auto=format&fit=crop&w=1000&q=80', coordinates:{lat:17.415,lng:78.505} },
  { name:'Hyderabad Budget Inn', location:'Hyderabad', city:'Hyderabad', price:1100, rating:3.5, rooms:30, available:true, amenities:['WiFi'], image:'https://images.unsplash.com/photo-1540518614846-7eded433c457?auto=format&fit=crop&w=1000&q=80', coordinates:{lat:17.425,lng:78.525} }
];

try {
  await connectDB();
  await Hotel.deleteMany({});
  await Hotel.insertMany(hotels);
  console.log(`Seeded ${hotels.length} StaySphere hotels successfully.`);
} catch (error) {
  console.error(error);
  process.exitCode = 1;
} finally {
  await mongoose.disconnect();
}
