import { CURRENCY } from "@/lib/categories";

export function formatPrice(n: number) {
  const rounded = Math.round(n * 100) / 100;
  return Number.isInteger(rounded)
    ? rounded.toLocaleString("en-US")
    : rounded.toLocaleString("en-US", { maximumFractionDigits: 2 });
}

export function money(n: number) {
  return `${formatPrice(n)} ${CURRENCY}`;
}

export function timeAgo(date: string | Date) {
  const then = new Date(date).getTime();
  const diff = Math.max(0, Date.now() - then);
  const sec = Math.floor(diff / 1000);
  if (sec < 60) return "الآن";
  const min = Math.floor(sec / 60);
  if (min < 60) return `قبل ${min} دقيقة`;
  const hr = Math.floor(min / 60);
  if (hr < 24) return `قبل ${hr} ساعة`;
  const day = Math.floor(hr / 24);
  if (day < 30) return `قبل ${day} يوم`;
  const mon = Math.floor(day / 30);
  if (mon < 12) return `قبل ${mon} شهر`;
  return `قبل ${Math.floor(mon / 12)} سنة`;
}

export function formatDate(date: string | Date) {
  return new Date(date).toLocaleDateString("ar-EG", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export function makeSlug() {
  return `l-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}