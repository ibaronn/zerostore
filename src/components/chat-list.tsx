"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { MessageCircle, Loader2 } from "lucide-react";
import { timeAgo, money } from "@/lib/format";
import { firstImage } from "@/lib/images";

type ChatItem = {
  id: string;
  updatedAt: string;
  other: { id: string; name: string; avatar: string | null; storeName: string | null; phone: string | null };
  listing: { id: string; title: string; price: number; city: string; images: string[] };
  lastMessage: { text: string; createdAt: string; senderId: string } | null;
  unread: number;
};

export default function ChatList({ me }: { me: { id: string; name: string } }) {
  const [chats, setChats] = useState<ChatItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;
    const load = async () => {
      try {
        const r = await fetch("/api/chats");
        if (r.ok) {
          const d = await r.json();
          if (alive) setChats(d.chats);
        }
      } catch {
        /* ignore */
      } finally {
        if (alive) setLoading(false);
      }
    };
    load();
    const t = setInterval(load, 4000);
    return () => {
      alive = false;
      clearInterval(t);
    };
  }, []);

  if (loading) {
    return (
      <div className="grid place-items-center py-24 text-brand-600">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!chats.length) {
    return (
      <div className="grid place-items-center rounded-3xl border border-slate-200/80 bg-white px-6 py-20 text-center shadow-card">
        <div className="grid h-20 w-20 place-items-center rounded-full bg-brand-50 text-brand-600">
          <MessageCircle className="h-9 w-9" />
        </div>
        <h3 className="font-cairo mt-4 text-xl font-extrabold text-slate-800">لا توجد محادثات بعد</h3>
        <p className="mt-2 max-w-sm text-sm font-bold text-slate-500">
          ابدأ مراسلة البائعين من أي إعلان لتفاوض على السعر والتفاصيل.
        </p>
        <Link
          href="/listings"
          className="mt-6 rounded-2xl bg-gradient-to-l from-brand-600 to-brand-700 px-8 py-3 text-sm font-black text-white shadow-glow-sm transition hover:brightness-110"
        >
          تصفح السوق
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {chats.map((c) => {
        const img = firstImage(c.listing.images);
        const mine = c.lastMessage?.senderId === me.id;
        return (
          <Link
            key={c.id}
            href={`/chat/${c.id}`}
            className="flex items-center gap-4 rounded-3xl border border-slate-200/80 bg-white p-4 shadow-card transition hover:-translate-y-0.5 hover:border-brand-200 hover:shadow-card-hover"
          >
            <div className="relative shrink-0">
              <span className="grid h-14 w-14 place-items-center overflow-hidden rounded-2xl bg-gradient-to-br from-brand-500 to-brand-700 text-lg font-black text-white">
                {c.other.avatar ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={c.other.avatar} alt="" className="h-full w-full object-cover" />
                ) : (
                  c.other.name.charAt(0)
                )}
              </span>
              {c.unread > 0 && (
                <span className="absolute -left-1 -top-1 grid h-6 min-w-6 place-items-center rounded-full bg-rose-500 px-1.5 text-[11px] font-black text-white">
                  {c.unread}
                </span>
              )}
            </div>

            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between gap-2">
                <h4 className="font-cairo truncate text-sm font-extrabold text-slate-800">
                  {c.other.storeName || c.other.name}
                </h4>
                <span className="shrink-0 text-[11px] font-bold text-slate-400">{timeAgo(c.updatedAt)}</span>
              </div>
              <p className="mt-1 line-clamp-1 text-sm font-bold text-slate-500">
                {c.lastMessage ? (
                  <>
                    {mine && <span className="text-brand-600">أنت: </span>}
                    {c.lastMessage.text}
                  </>
                ) : (
                  "ابدأ المفاوضة الآن…"
                )}
              </p>
              <div className="mt-1.5 flex items-center gap-2">
                {img && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={img} alt="" className="h-7 w-9 shrink-0 rounded-lg border border-slate-200 object-cover" />
                )}
                <span className="truncate text-xs font-bold text-slate-400">{c.listing.title}</span>
                <span className="font-cairo shrink-0 text-xs font-black text-gradient-brand">
                  {money(c.listing.price)}
                </span>
              </div>
            </div>
          </Link>
        );
      })}
    </div>
  );
}