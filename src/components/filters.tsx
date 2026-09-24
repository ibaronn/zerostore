"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Search, X, SlidersHorizontal, LocateFixed, Loader2 } from "lucide-react";
import { CATEGORIES, CITIES } from "@/lib/categories";
import { getPosition, nearestCity } from "@/lib/gps";

const styleInput =
  "w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-bold text-slate-800 outline-none transition focus:border-brand-500 focus:ring-2 focus:ring-brand-500/15";

export default function Filters() {
  const sp = useSearchParams();
  const router = useRouter();

  const [q, setQ] = useState(sp.get("q") ?? "");
  const [category, setCategory] = useState(sp.get("category") ?? "");
  const [city, setCity] = useState(sp.get("city") ?? "");
  const [min, setMin] = useState(sp.get("min") ?? "");
  const [max, setMax] = useState(sp.get("max") ?? "");
  const [sort, setSort] = useState(sp.get("sort") ?? "new");
  const [touched, setTouched] = useState(false);
  const [gpsBusy, setGpsBusy] = useState(false);

  const push = (patch: Record<string, string>) => {
    const params = new URLSearchParams();
    const merged = {
      q,
      category,
      city,
      min,
      max,
      sort,
      ...patch,
    };
    Object.entries(merged).forEach(([k, v]) => {
      if (v && v.trim()) params.set(k, v.trim());
    });
    const qs = params.toString();
    router.push(qs ? `/listings?${qs}` : "/listings");
  };

  useEffect(() => {
    if (!touched) return;
    const t = setTimeout(() => push({ q }), 400);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [q, touched]);

  const clear = () => {
    setQ("");
    setCategory("");
    setCity("");
    setMin("");
    setMax("");
    setSort("new");
    setTouched(true);
    router.push("/listings");
  };

  const hasFilters = q || category || city || min || max || sort !== "new";

  const useMyLocation = async () => {
    if (gpsBusy) return;
    setGpsBusy(true);
    try {
      const pos = await getPosition();
      const c = nearestCity(pos.lat, pos.lng);
      setCity(c);
      push({ city: c });
    } catch (e) {
      alert(e instanceof Error ? e.message : "تعذّر تحديد موقعك");
    } finally {
      setGpsBusy(false);
    }
  };

  return (
    <div className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm sm:p-5">
      <div className="mb-3 flex items-center gap-2 text-slate-500">
        <SlidersHorizontal className="h-4 w-4" />
        <span className="text-xs font-black uppercase tracking-wide">بحث وفلترة</span>
        {hasFilters && (
          <button onClick={clear} className="ms-auto flex items-center gap-1 rounded-full bg-rose-50 px-3 py-1 text-[11px] font-bold text-rose-600 transition hover:bg-rose-100">
            <X className="h-3 w-3" />
            مسح الكل
          </button>
        )}
      </div>

      <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-5">
        <div className="relative lg:col-span-2">
          <Search className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            value={q}
            onChange={(e) => {
              setQ(e.target.value);
              setTouched(true);
            }}
            placeholder="ابحث بالاسم أو الماركة…"
            className={`${styleInput} pe-3 ps-9`}
          />
        </div>

        <select value={category} onChange={(e) => push({ category: e.target.value })} className={styleInput}>
          <option value="">كل الأقسام</option>
          {CATEGORIES.map((c) => (
            <option key={c.slug} value={c.slug}>
              {c.name}
            </option>
          ))}
        </select>

        <div className="flex items-center gap-2">
          <select value={city} onChange={(e) => push({ city: e.target.value })} className={styleInput}>
            <option value="">كل المدن</option>
            {CITIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
          <button
            onClick={useMyLocation}
            disabled={gpsBusy}
            className="flex shrink-0 items-center gap-1.5 rounded-xl bg-brand-600 px-3 py-2 text-xs font-black text-white shadow-sm transition hover:bg-brand-700 disabled:opacity-60"
            title="حدّد مدينتك من موقعك"
          >
            {gpsBusy ? <Loader2 className="h-4 w-4 animate-spin" /> : <LocateFixed className="h-4 w-4" />}
            مدينتي
          </button>
        </div>

        <select value={sort} onChange={(e) => push({ sort: e.target.value })} className={styleInput}>
          <option value="new">الأحدث أولاً</option>
          <option value="price_asc">السعر: الأقل أولاً</option>
          <option value="price_desc">السعر: الأعلى أولاً</option>
          <option value="views">الأكثر مشاهدة</option>
        </select>
      </div>

      <div className="mt-3 grid grid-cols-2 gap-3 lg:grid-cols-1">
        <div className="flex items-center gap-2">
          <input
            value={min}
            onChange={(e) => push({ min: e.target.value })}
            placeholder="أقل سعر"
            inputMode="numeric"
            className={styleInput}
          />
          <span className="text-2xl font-black text-slate-300">–</span>
          <input
            value={max}
            onChange={(e) => push({ max: e.target.value })}
            placeholder="أعلى سعر"
            inputMode="numeric"
            className={styleInput}
          />
        </div>
      </div>
    </div>
  );
}