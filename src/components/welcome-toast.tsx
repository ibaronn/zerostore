"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Sparkles, X, MapPin } from "lucide-react";

type Me = { user: { id: string; name: string; avatar: string | null } | null };

export default function WelcomeToast() {
  const [msg, setMsg] = useState<{ title: string; sub: string; isNew: boolean } | null>(null);

  useEffect(() => {
    if (sessionStorage.getItem("ZERO STORE_welcomed")) return;
    sessionStorage.setItem("ZERO STORE_welcomed", "1");

    const timer = setTimeout(() => {
      fetch("/api/me")
        .then((r) => r.json())
        .then((d: Me) => {
          const isNew = sessionStorage.getItem("ZERO STORE_newuser") === "1";
          if (isNew) {
            sessionStorage.removeItem("ZERO STORE_newuser");
            setMsg({
              title: `أهلاً وسهلاً بك في عائلة زيرو ستور 🎉`,
              sub: `تم إنشاء حسابك بنجاح يا ${d.user?.name ?? "صديقنا"} — ابدأ ببناء متجرك الآن.`,
              isNew: true,
            });
          } else if (d.user) {
            setMsg({
              title: `أهلاً بعودتك يا ${d.user.name} 👋`,
              sub: "سعيدين برؤيتك مرة أخرى في سوق ليبيا المفتوح.",
              isNew: false,
            });
          } else {
            setMsg({
              title: "أهلاً بك في زيرو ستور 🇱🇾",
              sub: "أول سوق ليبي مفتوح — اعرض، تفاوض، واربح بلا عمولة.",
              isNew: false,
            });
          }
        })
        .catch(() => undefined);
    }, 900);

    return () => clearTimeout(timer);
  }, []);

  return (
    <AnimatePresence>
      {msg && (
        <motion.div
          initial={{ opacity: 0, y: 40, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 30, scale: 0.97 }}
          transition={{ type: "spring", stiffness: 260, damping: 22 }}
          className="fixed bottom-5 left-5 z-[70] w-[calc(100vw-2.5rem)] max-w-sm"
        >
          <div className="liquid-dark relative overflow-hidden rounded-3xl p-5 text-white shadow-2xl shadow-brand-900/50">
            <div className="pointer-events-none absolute -right-10 -top-10 h-28 w-28 rounded-full bg-brand-400/30 blur-2xl" />
            <div className="pointer-events-none absolute -left-10 -bottom-10 h-28 w-28 rounded-full bg-brand-500/30 blur-2xl" />
            <div className="relative flex items-start gap-3">
              <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-brand-500 to-brand-700 shadow-glow-sm">
                <Sparkles className="h-6 w-6 text-white" />
              </span>
              <div className="min-w-0 flex-1">
                <p className="font-cairo text-sm font-black">{msg.title}</p>
                <p className="mt-1 text-xs font-bold leading-6 text-white/70">{msg.sub}</p>
                <div className="mt-3 flex items-center gap-2">
                  <span className="flex items-center gap-1 rounded-full bg-white/10 px-3 py-1 text-[11px] font-black text-emerald-300">
                    <MapPin className="h-3 w-3" /> طرابلس • بنغازي • مصراتة
                  </span>
                  {msg.isNew && (
                    <span className="rounded-full bg-gradient-to-l from-amber-500 to-orange-500 px-3 py-1 text-[11px] font-black text-white">
                      متجرك جاهز ✨
                    </span>
                  )}
                </div>
              </div>
              <button
                onClick={() => setMsg(null)}
                className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-white/10 text-white/70 transition hover:bg-white/20 hover:text-white"
                aria-label="إغلاق"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}