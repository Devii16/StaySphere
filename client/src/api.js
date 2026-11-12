export const API = import.meta.env.VITE_API_URL || "http://localhost:5000";

export async function api(path, options = {}) {
  let response;
  try {
    response = await fetch(`${API}${path}`, {
      headers: { "Content-Type": "application/json" },
      ...options,
      body: options.body ? JSON.stringify(options.body) : undefined,
    });
  } catch {
    throw new Error("Cannot reach the server. Make sure the backend is running on " + API);
  }
  const data = await response.json().catch(() => ({}));
  if (!response.ok || data.success === false) {
    throw new Error(data.message || "Something went wrong. Please try again.");
  }
  return data;
}

export const CITY_CENTERS = {
  Guntur: [16.3067, 80.4365],
  Vijayawada: [16.5062, 80.648],
  Hyderabad: [17.385, 78.4867],
};

// Straight-line distance (km) from the city centre, since the database has no distance field.
export function distanceFromCenter(city, coords) {
  const c = CITY_CENTERS[city];
  if (!c || !coords || coords[0] == null || coords[1] == null) return 10;
  const rad = (d) => (d * Math.PI) / 180;
  const dLat = rad(coords[0] - c[0]);
  const dLng = rad(coords[1] - c[1]);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(rad(c[0])) * Math.cos(rad(coords[0])) * Math.sin(dLng / 2) ** 2;
  const km = 6371 * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(km * 10) / 10;
}

export const inr = (n) => "₹" + Number(n || 0).toLocaleString("en-IN");

export const todayStr = () => new Date().toLocaleDateString("en-CA"); // YYYY-MM-DD (local)

export function addDays(dateStr, days) {
  const d = new Date(dateStr + "T00:00:00");
  d.setDate(d.getDate() + days);
  return d.toLocaleDateString("en-CA");
}

export function fmtDate(value) {
  if (!value) return "—";
  return new Date(String(value).slice(0, 10) + "T00:00:00").toLocaleDateString("en-GB", {
    day: "2-digit", month: "short", year: "numeric",
  });
}

export function fmtDateTime(value) {
  if (!value) return "—";
  return new Date(value).toLocaleString("en-GB", {
    day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit",
  });
}
