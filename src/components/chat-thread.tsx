"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight, Send, Loader2, MessageCircle, Store, Eye } from "lucide-react";
import { timeAgo, money } from "@/lib/format";
import { firstImage } from "@/lib/images";

type Msg = {
  id: string;
  text: string;
  createdAt: string;
  senderId: string;
  sender: { id: string; name: string; avatar: string | null };
};

export default function ChatThread({ chatId, meId }: { chatId: string; meId: string }) {
  const [other, setOther] = useState<{ id: string; name: string; avatar: string | null; storeName: string | null } | null>(null);
  const [listing, setListing] = useState<{ id: string; title: string; price: number; city: string; images: string[] } | null>(null);
  const [messages, setMessages] = useState<Msg[]>([]);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    let alive = true;
    const load = async (initial = false) => {
      try {
        const r = await fetch(`/api/chats/${chatId}`);
        if (r.status === 403) {
          router.push("/chat");
          return;
        }
        if (r.ok) {
          const d = await r.json();
          if (!alive) return;
          setOther(d.chat.other);
          setListing(d.chat.listing);
          setMessages(d.chat.messages);
        }
      } catch {
        /* ignore */
      } finally {
        if (alive) {
          setLoading(false);
          if (initial) {
            fetch(`/api/chats/${chatId}/read`, { method: "POST" }).catch(() => undefined);
          }
        }
      }
    };
    load(true);
    const t = setInterval(() => load(), 3000);
    return () => {
      alive = false;
      clearInterval(t);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chatId]);

  useEffect(() => {
    if (bottomRef.current) bottomRef.current.scrollIntoView({ behavior: "smooth" });
  }, [messages.length, loading]);

  const send = async (e: React.FormEvent) => {
    e.preventDefault();
    const t = text.trim();
    if (!t || sending) return;
    setSending(true);
    setError("");
    const optimistic: Msg = {
      id: `tmp-${Date.now()}`,
      text: t,
      createdAt: new Date().toISOString(),
      senderId: meId,
      sender: { id: meId, name: "أنت", avatar: null },
    };
    setMessages((prev) => [...prev, optimistic]);
    setText("");
    try {
      const r = await fetch(`/api/chats/${chatId}/messages`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: t }),
      });
      if (!r.ok) {
        const d = await r.json();
        setError(d.error || "فشل الإرسال");
        setMessages((prev) => prev.filter((m) => m.id !== optimistic.id));
      }
    } catch {
      setError("تعذر الإرسال، حاول مجدداً");
      setMessages((prev) => prev.filter((m) => m.id !== optimistic.id));
    } finally {
      setSending(false);
    }
  };

  if (loading) {
    return (
      <div className="grid place-items-center py-24 text-brand-600">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  const img = listing ? firstImage(listing.images) : null;

  return (
    <div className="mx-auto flex max-w-3xl flex-col overflow-hidden rounded-3xl border border-slate-200/80 bg-white shadow-card">
      <div className="border-b border-slate-100 bg-gradient-to-l from-brand-50 to-white p-4">
        <div className="flex items-center gap-3">
          <Link
            href="/chat"
            className="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-slate-200 text-slate-600 transition hover:bg-slate-100"
            aria-label="رجوع"
          >
            <ArrowRight className="h-4 w-4" />
          </Link>
          <span className="grid h-11 w-11 shrink-0 place-items-center overflow-hidden rounded-2xl bg-gradient-to-br from-brand-500 to-brand-700 text-base font-black text-white">
            {other?.avatar ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={other.avatar} alt="" className="h-full w-full object-cover" />
            ) : (
              other?.name.charAt(0)
            )}
          </span>
          <div className="min-w-0 flex-1">
            <p className="font-cairo truncate text-sm font-extrabold text-slate-800">{other?.storeName || other?.name}</p>
            <p className="flex items-center gap-1 text-xs font-bold text-slate-400">
              <Store className="h-3 w-3" /> متجر على زيرو ستور
            </p>
          </div>
        </div>

        {listing && (
          <Link
            href={`/listings/${listing.id}`}
            className="mt-3 flex items-center gap-3 rounded-2xl border border-slate-200 bg-white p-2.5 transition hover:border-brand-300 hover:shadow-glow-sm"
          >
            {img ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={img} alt="" className="h-12 w-16 shrink-0 rounded-xl border border-slate-200 object-cover" />
            ) : (
              <span className="grid h-12 w-16 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-brand-600 to-brand-700 text-white">
                <MessageCircle className="h-5 w-5" />
              </span>
            )}
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-extrabold text-slate-800">{listing.title}</p>
              <p className="text-xs font-bold text-slate-400">{listing.city}</p>
            </div>
            <span className="font-cairo shrink-0 text-base font-black text-gradient-brand">{money(listing.price)}</span>
            <Eye className="h-4 w-4 shrink-0 text-slate-400" />
          </Link>
        )}
      </div>

      <div className="max-h-[55vh] min-h-[320px] space-y-3 overflow-y-auto bg-[#f5f2eb] p-4">
        <div className="mx-auto mb-3 w-fit rounded-full bg-brand-100 px-4 py-1.5 text-center text-xs font-bold text-brand-700">
          أنتم الآن تتفاوضون حول الإعلان — {listing?.title}
        </div>

        {messages.length === 0 && (
          <div className="grid place-items-center py-14 text-center">
            <p className="text-sm font-bold text-slate-500">ابدأ بمراسلة البائع للاستفسار عن السعر والتفاصيل.</p>
          </div>
        )}

        {messages.map((m) => {
          const mine = m.senderId === meId;
          return (
            <div key={m.id} className={`flex items-end gap-2 ${mine ? "flex-row-reverse" : ""}`}>
              {!mine && (
                <span className="grid h-8 w-8 shrink-0 place-items-center overflow-hidden rounded-full bg-gradient-to-br from-brand-500 to-brand-700 text-xs font-black text-white">
                  {m.sender?.avatar ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={m.sender.avatar} alt="" className="h-full w-full object-cover" />
                  ) : (
                    (m.sender?.name || other?.name || "؟").charAt(0)
                  )}
                </span>
              )}
              <div className={`max-w-[75%] rounded-3xl px-4 py-2.5 shadow-sm ${mine ? "rounded-bl-md bg-gradient-to-l from-brand-600 to-brand-700 text-white" : "rounded-br-md bg-white text-slate-800 ring-1 ring-slate-100"}`}>
                <p className="text-sm leading-6 font-bold">{m.text}</p>
                <p className={`mt-1 text-[10px] font-bold ${mine ? "text-white/70" : "text-slate-400"}`}>{timeAgo(m.createdAt)}</p>
              </div>
            </div>
          );
        })}
        <div ref={bottomRef} />
      </div>

      <div className="border-t border-slate-100 p-3">
        {error && <p className="mb-2 px-2 text-xs font-bold text-rose-600">{error}</p>}
        <form onSubmit={send} className="flex items-center gap-2">
          <input
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="اكتب رسالتك هنا… التفاوض المباشر"
            className="flex-1 rounded-full border border-slate-200 bg-slate-50 px-5 py-3 text-sm font-bold outline-none transition focus:border-brand-500 focus:bg-white"
          />
          <button
            type="submit"
            disabled={sending || !text.trim()}
            className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-gradient-to-l from-brand-600 to-brand-700 text-white shadow-glow-sm transition hover:brightness-110 disabled:opacity-50"
            aria-label="إرسال"
          >
            {sending ? <Loader2 className="h-5 w-5 animate-spin" /> : <Send className="h-5 w-5 -scale-x-100" />}
          </button>
        </form>
      </div>
    </div>
  );
}