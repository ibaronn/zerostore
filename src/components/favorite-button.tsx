"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Heart } from "lucide-react";

export default function FavoriteButton({ listingId, initial = false }: { listingId: string; initial?: boolean }) {
  const [fav, setFav] = useState(initial);
  const [pending, setPending] = useState(false);
  const router = useRouter();

  const toggle = async () => {
    if (pending) return;
    setPending(true);
    try {
      const r = await fetch("/api/favorites", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ listingId }),
      });
      if (r.status === 401) {
        router.push("/login?next=" + encodeURIComponent(`/listings/${listingId}`));
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
    <button
      onClick={toggle}
      className={`flex flex-1 items-center justify-center gap-2 rounded-2xl border px-4 py-3 text-sm font-bold transition active:scale-95 ${
        fav
          ? "border-rose-200 bg-rose-50 text-rose-600"
          : "border-slate-200 bg-white text-slate-700 hover:border-rose-200 hover:bg-rose-50 hover:text-rose-600"
      }`}
    >
      <Heart className={`h-4 w-4 ${fav ? "fill-current" : ""}`} />
      {fav ? "في المفضلة" : "أضف للمفضلة"}
    </button>
  );
}