import { LIBYAN_CITIES, type City } from "@/lib/categories";

export type Coords = { lat: number; lng: number };

export function haversineKm(a: Coords, b: Coords) {
  const R = 6371;
  const dLat = ((b.lat - a.lat) * Math.PI) / 180;
  const dLng = ((b.lng - a.lng) * Math.PI) / 180;
  const sLat = Math.sin(dLat / 2);
  const sLng = Math.sin(dLng / 2);
  const h =
    sLat * sLat +
    Math.cos((a.lat * Math.PI) / 180) *
      Math.cos((b.lat * Math.PI) / 180) *
      sLng *
      sLng;
  return 2 * R * Math.asin(Math.sqrt(h));
}

export function nearestCity(lat: number, lng: number): string {
  let best: City = LIBYAN_CITIES[0];
  let bestDist = Infinity;
  for (const c of LIBYAN_CITIES) {
    if (c.lat === 0 && c.lng === 0) continue;
    const d = haversineKm({ lat, lng }, c);
    if (d < bestDist) {
      bestDist = d;
      best = c;
    }
  }
  return best.name;
}

export function getPosition(): Promise<Coords> {
  return new Promise((resolve, reject) => {
    if (!("geolocation" in navigator)) {
      reject(new Error("الموقع غير مدعوم في هذا المتصفح"));
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (p) => resolve({ lat: p.coords.latitude, lng: p.coords.longitude }),
      (err) => reject(new Error("تعذّر تحديد موقعك، فعّل الإذن وحاول مجدداً")),
      { enableHighAccuracy: true, timeout: 9000, maximumAge: 60000 }
    );
  });
}