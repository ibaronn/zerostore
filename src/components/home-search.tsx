"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";
import { CATEGORIES } from "@/lib/categories";

const QUICK = ["phones", "electronics", "vehicles", "real-estate", "furniture", "fashion", "pets"];

export default function HomeSearch() {
  const [q, setQ] = useState("");
  const router = useRouter();

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const t = q.trim();
    router.push(t ? `/listings?q=${encodeURIComponent(t)}` : "/listings");
  };

  return (
    <div>
      <form
        onSubmit={submit}
        className="mx-auto flex max-w-2xl items-center gap-2 rounded-2xl border border-slate-200 bg-white p-2 shadow-lg shadow-brand-900/10 transition focus-within:border-brand-500 focus-within:ring-2 focus-within:ring-brand-500/15 lg:mx-0"
      >
        <Search className="ms-3 h-5 w-5 shrink-0 text-slate-400" />
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="ابحث عن منتج، ماركة، أو مدينة…"
          className="w-full bg-transparent text-sm font-bold text-slate-800 placeholder:text-slate-400 outline-none"
        />
        <button
          type="submit"
          className="btn-3d shrink-0 rounded-xl bg-brand-600 px-6 py-2.5 text-sm font-black text-white"
        >
          بحث
        </button>
      </form>

      <div className="mt-4 flex flex-wrap items-center justify-center gap-2 lg:justify-start">
        {QUICK.map((slug) => {
          const c = CATEGORIES.find((x) => x.slug === slug);
          if (!c) return null;
          const Icon = c.icon;
          return (
            <a
              key={slug}
              href={`/listings?category=${c.slug}`}
              className="flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-4 py-1.5 text-xs font-bold text-slate-600 shadow-sm transition hover:-translate-y-0.5 hover:border-brand-300 hover:text-brand-700"
            >
              <Icon className="h-3.5 w-3.5" />
              {c.name}
            </a>
          );
        })}
      </div>
    </div>
  );
}