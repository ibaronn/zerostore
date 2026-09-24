import type { LucideIcon } from "lucide-react";
import {
  Laptop,
  Smartphone,
  Tv,
  Sofa,
  Car,
  Building2,
  Shirt,
  Gamepad2,
  Dumbbell,
  PawPrint,
  Briefcase,
  BookOpen,
  Sparkles,
  Box,
} from "lucide-react";

export type Category = {
  slug: string;
  name: string;
  icon: LucideIcon;
  emoji: string;
  gradient: string;
};

export const CATEGORIES: Category[] = [
  { slug: "electronics", name: "الكترونيات", icon: Laptop, emoji: "💻", gradient: "from-violet-600 to-indigo-600" },
  { slug: "phones", name: "موبايلات وجوالات", icon: Smartphone, emoji: "📱", gradient: "from-fuchsia-600 to-pink-600" },
  { slug: "home-appliances", name: "أجهزة منزلية", icon: Tv, emoji: "📺", gradient: "from-cyan-600 to-sky-600" },
  { slug: "furniture", name: "أثاث ومنزل", icon: Sofa, emoji: "🛋️", gradient: "from-amber-500 to-orange-600" },
  { slug: "vehicles", name: "سيارات ومركبات", icon: Car, emoji: "🚗", gradient: "from-blue-600 to-indigo-600" },
  { slug: "real-estate", name: "عقارات", icon: Building2, emoji: "🏠", gradient: "from-emerald-600 to-teal-600" },
  { slug: "fashion", name: "ملابس وموضة", icon: Shirt, emoji: "👕", gradient: "from-pink-600 to-rose-600" },
  { slug: "gaming", name: "ألعاب وترفيه", icon: Gamepad2, emoji: "🎮", gradient: "from-purple-600 to-violet-600" },
  { slug: "sports", name: "رياضة", icon: Dumbbell, emoji: "🏋️", gradient: "from-lime-600 to-green-600" },
  { slug: "pets", name: "حيوانات أليفة", icon: PawPrint, emoji: "🐾", gradient: "from-orange-500 to-amber-600" },
  { slug: "services", name: "وظائف وخدمات", icon: Briefcase, emoji: "💼", gradient: "from-slate-700 to-slate-900" },
  { slug: "books", name: "كتب وقرطاسية", icon: BookOpen, emoji: "📚", gradient: "from-yellow-500 to-amber-600" },
  { slug: "other", name: "أخرى", icon: Sparkles, emoji: "✨", gradient: "from-rose-500 to-fuchsia-600" },
];

export function categoryBySlug(slug: string) {
  return CATEGORIES.find((c) => c.slug === slug);
}

export const COUNTRY = "ليبيا";
export const COUNTRY_FLAG = "🇱🇾";
export const CURRENCY = "د.ل";
export const PHONE_PREFIX = "+218";

export type City = { name: string; lat: number; lng: number };

export const LIBYAN_CITIES: City[] = [
  { name: "طرابلس", lat: 32.8872, lng: 13.1913 },
  { name: "بنغازي", lat: 32.1167, lng: 20.0667 },
  { name: "مصراتة", lat: 32.3754, lng: 15.0925 },
  { name: "البيضاء", lat: 32.7634, lng: 21.7580 },
  { name: "طبرق", lat: 32.0784, lng: 23.9634 },
  { name: "درنة", lat: 32.7560, lng: 22.6370 },
  { name: "سبها", lat: 27.0333, lng: 14.4167 },
  { name: "الزاوية", lat: 32.7571, lng: 12.7277 },
  { name: "زليتن", lat: 32.4733, lng: 14.6940 },
  { name: "الخمس", lat: 32.6519, lng: 14.2628 },
  { name: "ترهونة", lat: 32.4383, lng: 13.6333 },
  { name: "غريان", lat: 32.1667, lng: 13.0167 },
  { name: "بني وليد", lat: 31.7627, lng: 13.9953 },
  { name: "أجدابيا", lat: 30.7550, lng: 20.2261 },
  { name: "سرت", lat: 31.2053, lng: 16.5946 },
  { name: "الكفرة", lat: 24.1786, lng: 23.2925 },
  { name: "مرزق", lat: 25.9045, lng: 13.9288 },
  { name: "أوباري", lat: 26.5903, lng: 13.1414 },
  { name: "غات", lat: 24.9645, lng: 10.1721 },
  { name: "صبراتة", lat: 32.7926, lng: 12.4849 },
  { name: "صرمان", lat: 32.7567, lng: 12.5717 },
  { name: "العجيلات", lat: 32.6563, lng: 12.3640 },
  { name: "زوارة", lat: 32.9346, lng: 12.0698 },
  { name: "الجميل", lat: 32.3422, lng: 12.1603 },
  { name: "مزدة", lat: 31.4422, lng: 11.9761 },
  { name: "غدامس", lat: 30.1356, lng: 9.4962 },
  { name: "نالوت", lat: 31.8667, lng: 10.9833 },
  { name: "يفرن", lat: 32.0628, lng: 12.5305 },
  { name: "المرج", lat: 32.4975, lng: 20.8350 },
  { name: "شحات", lat: 32.8267, lng: 21.8622 },
  { name: "القبة", lat: 32.7333, lng: 22.7333 },
  { name: "سلوق", lat: 31.6659, lng: 20.2531 },
  { name: "أوجلة", lat: 29.2114, lng: 21.27 },
  { name: "جالو", lat: 29.0281, lng: 21.51 },
  { name: "بنينا", lat: 32.0783, lng: 20.27 },
  { name: "الأبيار", lat: 32.1903, lng: 20.5903 },
  { name: "رقدالين", lat: 32.567, lng: 12.633 },
  { name: "تاجوراء", lat: 32.873, lng: 13.345 },
  { name: "جنزور", lat: 32.8233, lng: 13.1217 },
  { name: "عين زارة", lat: 32.8322, lng: 13.1392 },
  { name: "قصر بن غشير", lat: 32.6742, lng: 13.2392 },
  { name: "السواني", lat: 32.7, lng: 12.9667 },
  { name: "توكرة", lat: 32.4844, lng: 20.5667 },
  { name: "قمينس", lat: 31.6461, lng: 20.1044 },
  { name: "هون", lat: 29.1269, lng: 15.9397 },
  { name: "سوكنة", lat: 29.0722, lng: 15.5903 },
  { name: "براك الشاطئ", lat: 27.479, lng: 14.346 },
  { name: "تراغن", lat: 25.9447, lng: 14.4077 },
  { name: "جادو", lat: 31.9592, lng: 12.0147 },
  { name: "كاباو", lat: 31.9, lng: 12.0 },
  { name: "أخرى", lat: 0, lng: 0 },
];

export const CITIES = LIBYAN_CITIES.map((c) => c.name);

export const CONDITIONS = [
  { value: "new", label: "جديد" },
  { value: "used", label: "مستعمل" },
  { value: "refurb", label: "مجدّد" },
];

export function conditionLabel(v: string) {
  return CONDITIONS.find((c) => c.value === v)?.label ?? v;
}