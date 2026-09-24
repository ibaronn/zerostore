"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";
import { CATEGORIES } from "@/lib/categories";

const QUICK = ["phones", "electronics", "vehicles", "real-estate", "furniture", "fashion", "pets"];

export default function HomeSearch() {
  const [q, setQ] = useState("");
  const [cat, setCat] = useState("all");
  const router = useRouter();

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const t = q.trim();
    const params = new URLSearchParams();
    if (cat !== "all") params.set("category", cat);
    if (t) params.set("q", t);
    const qs = params.toString();
    router.push(`/listings${qs ? `?${qs}` : ""}`);
  };

  return (
    <div>
      <form
        onSubmit={submit}
        className="mx-auto flex max-w-2xl items-center gap-1.5 rounded-xl border border-white/10 bg-white p-1.5 shadow-2xl shadow-black/30 focus-within:ring-2 focus-within:ring-teal-400/40 lg:mx-0"
      >
        <select
          value={cat}
          onChange={(e) => setCat(e.target.value)}
          aria-label="القسم"
          className="shrink-0 cursor-pointer rounded-lg border border-slate-200 bg-white px-2.5 py-2.5 text-sm font-semibold text-slate-700 outline-none transition hover:border-slate-300 focus:border-brand-500 sm:px-3"
        >
          <option value="all">كل الأقسام</option>
          {CATEGORIES.map((c) => (
            <option key={c.slug} value={c.slug}>
              {c.name}
            </option>
          ))}
        </select>
        <Search className="ms-2 h-5 w-5 shrink-0 text-slate-400" />
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="ابحث عن منتج، ماركة، أو مدينة…"
          className="w-full bg-transparent text-sm font-medium text-slate-800 placeholder:text-slate-400 outline-none"
        />
        <button
          type="submit"
          className="shrink-0 rounded-lg bg-brand-600 px-6 py-2.5 text-sm font-bold text-white transition active:scale-[0.97] hover:bg-brand-700"
        >
          بحث
        </button>
      </form>

      <div className="mt-4 flex flex-wrap items-center justify-center gap-2 lg:justify-start">
        {QUICK.map((slug) => {
          const c = CATEGORIES.find((x) => x.slug === slug);
          if (!c) return null;
          return (
            <a
              key={slug}
              href={`/listings?category=${c.slug}`}
              className="flex items-center gap-1.5 rounded-full border border-white/15 bg-white/5 px-4 py-1.5 text-xs font-semibold text-white/80 backdrop-blur transition hover:border-white/30 hover:bg-white/10 hover:text-white"
            >
              <span className="text-base leading-none" aria-hidden>
                {c.emoji}
              </span>
              {c.name}
            </a>
          );
        })}
      </div>
    </div>
  );
}