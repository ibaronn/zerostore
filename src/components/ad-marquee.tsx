"use client";

import Link from "next/link";
import { BadgeCheck, MapPin } from "lucide-react";
import { money } from "@/lib/format";
import { firstImage } from "@/lib/images";
import { CATEGORIES } from "@/lib/categories";

export type MarqueeListing = {
  id: string;
  title: string;
  price: number;
  negotiable: boolean;
  category: string;
  city: string;
  images: string[];
  user: { name: string; storeName: string | null; avatar: string | null };
};

export default function AdMarquee({
  listings,
  title = "عروض السوق",
  sub = "لقطات سريعة لأفضل العروض",
  fast = false,
}: {
  listings: MarqueeListing[];
  title?: string;
  sub?: string;
  fast?: boolean;
}) {
  if (!listings.length) return null;
  const doubled = [...listings, ...listings];

  return (
    <section className="relative overflow-hidden border-y border-slate-200/70 bg-slate-50/60 py-8">
      <div className="mx-auto mb-6 flex max-w-7xl items-end justify-between gap-4 px-4 lg:px-6">
        <div>
          <p className="flex items-center gap-2 text-xs font-bold text-slate-500">
            <span className="h-1.5 w-1.5 rounded-full bg-brand-600" />
            الأكثر رواجاً
          </p>
          <h2 className="font-cairo mt-1.5 text-2xl font-extrabold text-slate-900 sm:text-3xl">{title}</h2>
          <p className="mt-1 text-sm font-medium text-slate-500">{sub}</p>
        </div>
      </div>

      <div dir="ltr" className="relative">
        <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-12 bg-gradient-to-r from-slate-50 to-transparent sm:w-24" />
        <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-12 bg-gradient-to-l from-slate-50 to-transparent sm:w-24" />
        <div className={`flex w-max gap-4 whitespace-nowrap ${fast ? "animate-marquee-fast" : "animate-marquee"}`}>
          {doubled.map((l, i) => {
            const img = firstImage(l.images);
            const cat = CATEGORIES.find((c) => c.slug === l.category);
            return (
              <Link
                key={`${l.id}-${i}`}
                href={`/listings/${l.id}`}
                dir="rtl"
                className="group w-64 shrink-0 select-none overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition duration-200 hover:-translate-y-0.5 hover:border-brand-200 hover:shadow-md hover:shadow-brand-900/5"
              >
                <div className="relative h-32 overflow-hidden">
                  {img ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={img}
                      alt={l.title}
                      loading="lazy"
                      className="h-full w-full object-cover transition duration-500 group-hover:scale-110"
                    />
                  ) : (
                    <span className="grid h-full w-full place-items-center bg-slate-200 text-sm font-bold text-slate-400">
                      ZERO STORE
                    </span>
                  )}
                  {cat && (
                    <span
                      className="absolute bottom-2 start-2 grid h-8 w-8 place-items-center rounded-lg border border-white/60 bg-white/95 text-base shadow-sm"
                      aria-hidden
                    >
                      {cat.emoji}
                    </span>
                  )}
                  {l.negotiable && (
                    <span className="absolute bottom-2 end-2 flex items-center gap-1 rounded-full bg-emerald-600 px-2.5 py-1 text-[10px] font-bold text-white shadow-sm">
                      <BadgeCheck className="h-3 w-3" /> تفاوض
                    </span>
                  )}
                </div>
                <div className="space-y-2 p-3 text-start">
                  <p className="line-clamp-1 text-sm font-bold text-slate-800">{l.title}</p>
                  <div className="flex items-center justify-between">
                    <p className="font-cairo text-base font-extrabold text-slate-900">{money(l.price)}</p>
                    <span className="flex items-center gap-1 text-[11px] font-semibold text-slate-400">
                      <MapPin className="h-3 w-3" /> {l.city}
                    </span>
                  </div>
                  <p className="truncate text-[11px] font-semibold text-slate-400">
                    {l.user.storeName || l.user.name}
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}