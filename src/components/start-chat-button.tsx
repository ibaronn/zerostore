"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { MessageCircle, Loader2 } from "lucide-react";

export default function StartChatButton({
  listingId,
  sellerId,
  compact = false,
}: {
  listingId: string;
  sellerId: string;
  compact?: boolean;
}) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const start = async () => {
    if (loading) return;
    setLoading(true);
    try {
      const r = await fetch("/api/chats", {
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
        router.push(`/chat/${d.id}`);
      }
    } finally {
      setLoading(false);
    }
  };

  if (compact) {
    return (
      <button
        onClick={start}
        className="flex w-full items-center justify-center gap-2 rounded-xl bg-slate-100 px-3 py-2 text-sm font-bold text-slate-700 transition hover:bg-brand-50 hover:text-brand-700 active:scale-95"
      >
        {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <MessageCircle className="h-4 w-4" />}
        مراسلة
      </button>
    );
  }

  return (
    <button
      onClick={start}
      className="flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-l from-brand-600 to-brand-700 px-5 py-3.5 text-base font-black text-white shadow-glow-sm transition hover:brightness-110 active:scale-[0.99]"
    >
      {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : <MessageCircle className="h-5 w-5" />}
      تفاوض / ابدأ المحادثة
    </button>
  );
}