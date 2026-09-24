"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, useMotionTemplate, useMotionValue, useSpring } from "framer-motion";
import { Heart, MapPin, Eye, BadgeCheck, ImageOff } from "lucide-react";
import { money, timeAgo } from "@/lib/format";
import { categoryBySlug, conditionLabel } from "@/lib/categories";
import { firstImage } from "@/lib/images";

export type ListingCardData = {
  id: string;
  title: string;
  price: number;
  negotiable: boolean;
  condition: string;
  category: string;
  city: string;
  images: string[];
  views: number;
  featured: boolean;
  status: string;
  createdAt: string | Date;
  user: { id: string; name: string; avatar: string | null; storeName: string | null };
};

export default function ListingCard({
  listing,
  isFavorite = false,
}: {
  listing: ListingCardData;
  isFavorite?: boolean;
}) {
  const [fav, setFav] = useState(isFavorite);
  const [imgError, setImgError] = useState(false);
  const [pending, setPending] = useState(false);
  const router = useRouter();

  const rx = useMotionValue(0);
  const ry = useMotionValue(0);
  const mx = useMotionValue(50);
  const my = useMotionValue(50);
  const rotateX = useSpring(rx, { stiffness: 200, damping: 22 });
  const rotateY = useSpring(ry, { stiffness: 200, damping: 22 });
  const glow = useMotionTemplate`radial-gradient(260px circle at ${mx}% ${my}%, rgba(99,102,241,0.18), transparent 70%)`;

  const onMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width;
    const py = (e.clientY - rect.top) / rect.height;
    ry.set((px - 0.5) * 7);
    rx.set((0.5 - py) * 7);
    mx.set(px * 100);
    my.set(py * 100);
  };

  const onLeave = () => {
    rx.set(0);
    ry.set(0);
    mx.set(50);
    my.set(50);
  };

  const img = firstImage(listing.images);
  const cat = categoryBySlug(listing.category);

  const toggleFav = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (pending) return;
    setPending(true);
    try {
      const r = await fetch("/api/favorites", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ listingId: listing.id }),
      });
      if (r.status === 401) {
        router.push("/login?next=" + encodeURIComponent(`/listings/${listing.id}`));
        return;
      }
      if (r.ok) {
        const d = await r.json();
        setFav(d.favorite);
      }
    } finally {
      setPending(false);
    }
  };

  return (
    <motion.div
      className="group h-full"
      style={{ rotateX, rotateY, transformPerspective: 900 }}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
    >
      <Link
        href={`/listings/${listing.id}`}
        className="relative flex h-full flex-col overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:border-brand-200 hover:shadow-lg hover:shadow-brand-900/10"
      >
        <motion.div className="pointer-events-none absolute inset-0 z-[1] opacity-0 transition duration-300 group-hover:opacity-100" style={{ background: glow }} />
        <div className="relative aspect-[4/3] overflow-hidden bg-slate-100">
          {img && !imgError ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={img}
              alt={listing.title}
              loading="lazy"
              onError={() => setImgError(true)}
              className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
            />
          ) : (
            <div className={`grid h-full w-full place-items-center bg-gradient-to-br ${cat?.gradient ?? "from-brand-600 to-brand-800"} text-white`}>
              <ImageOff className="h-10 w-10 opacity-60" />
            </div>
          )}

          <button
            onClick={toggleFav}
            aria-label="إضافة للمفضلة"
            className={`absolute start-3 top-3 grid h-9 w-9 place-items-center rounded-full shadow-sm transition ${
              fav ? "bg-rose-500 text-white" : "bg-white/90 text-rose-500 hover:bg-white"
            }`}
          >
            <Heart className={`h-4 w-4 ${fav ? "fill-current" : ""}`} />
          </button>

          {listing.negotiable && (
            <span className="absolute bottom-3 end-3 flex items-center gap-1 rounded-full bg-emerald-500/95 px-2.5 py-1 text-[11px] font-black text-white shadow-sm">
              <BadgeCheck className="h-3 w-3" /> تفاوض
            </span>
          )}
        </div>

        <div className="flex flex-1 flex-col gap-2 p-4">
          <div className="flex items-center justify-between gap-2">
            <span className={`rounded-full bg-gradient-to-br ${cat?.gradient ?? "from-slate-600 to-slate-800"} px-2.5 py-1 text-[11px] font-black text-white`}>
              {cat?.emoji ?? "✨"} {cat?.name ?? "أخرى"}
            </span>
            <span className="flex items-center gap-1 text-xs font-bold text-slate-400">
              <Eye className="h-3.5 w-3.5" />
              {listing.views}
            </span>
          </div>

          <h3 className="font-cairo line-clamp-2 min-h-12 text-[15px] font-extrabold leading-6 text-slate-900 transition group-hover:text-brand-700">
            {listing.title}
          </h3>

          {listing.featured && (
            <span className="w-fit rounded-full bg-gradient-to-l from-amber-400 to-orange-500 px-2.5 py-0.5 text-[11px] font-black text-white">
              ⭐ مميز
            </span>
          )}

          <p className="font-cairo mt-auto pt-1 text-xl font-black text-slate-900">
            {money(listing.price)}
          </p>

          <div className="flex items-center justify-between border-t border-slate-100 pt-3 text-xs font-bold text-slate-500">
            <span className="flex items-center gap-1.5">
              <span className="grid h-6 w-6 place-items-center overflow-hidden rounded-full bg-gradient-to-br from-brand-500 to-brand-700 text-[10px] text-white">
                {listing.user.avatar ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={listing.user.avatar} alt="" className="h-full w-full object-cover" />
                ) : (
                  listing.user.name.charAt(0)
                )}
              </span>
              <span className="max-w-24 truncate">{listing.user.storeName || listing.user.name}</span>
            </span>
            <span className="flex items-center gap-1">
              <MapPin className="h-3.5 w-3.5 text-brand-500" />
              {listing.city}
            </span>
          </div>

          <p className="text-[11px] font-bold text-slate-400">{timeAgo(listing.createdAt)}</p>
        </div>
      </Link>
    </motion.div>
  );
}