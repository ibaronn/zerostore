"use client";

import { useState } from "react";
import { Phone, Copy, Check, Eye } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

export default function PhoneReveal({ phone, label }: { phone: string | null; label?: string }) {
  const [show, setShow] = useState(false);
  const [copied, setCopied] = useState(false);

  if (!phone) {
    return (
      <div className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm font-bold text-amber-700">
        لم يضف البائع رقم هاتفه بعد — استخدم المحادثة.
      </div>
    );
  }

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(phone);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      /* ignore */
    }
  };

  return (
    <div className="overflow-hidden rounded-2xl border border-brand-100 bg-brand-50/70">
      <AnimatePresence mode="wait" initial={false}>
        {!show ? (
          <motion.button
            key="hide"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShow(true)}
            className="flex w-full items-center justify-center gap-2 px-4 py-3.5 text-sm font-bold text-brand-700 transition hover:bg-brand-100"
          >
            <Eye className="h-4 w-4" />
            {label || "إظهار رقم الهاتف"}
          </motion.button>
        ) : (
          <motion.div
            key="show"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="px-4 py-4"
          >
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <a
                href={`tel:${phone}`}
                className="font-cairo flex items-center gap-2 text-xl font-black text-slate-900 transition hover:text-brand-700"
              >
                <Phone className="h-5 w-5 text-emerald-600" />
                <span dir="ltr">{phone}</span>
              </a>
              <div className="flex gap-2">
                <button
                  onClick={copy}
                  className="flex items-center gap-1.5 rounded-full bg-white px-4 py-2 text-xs font-bold text-slate-700 shadow-sm ring-1 ring-slate-200 transition hover:shadow"
                >
                  {copied ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : <Copy className="h-3.5 w-3.5" />}
                  {copied ? "تم النسخ" : "نسخ الرقم"}
                </button>
                <a
                  href={`tel:${phone}`}
                  className="flex items-center gap-1.5 rounded-full bg-gradient-to-l from-emerald-500 to-teal-500 px-4 py-2 text-xs font-bold text-white shadow-sm transition hover:brightness-110"
                >
                  <Phone className="h-3.5 w-3.5" />
                  اتصال سريع
                </a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}