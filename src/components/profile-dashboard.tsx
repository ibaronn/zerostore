"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import {
  Loader2,
  Store,
  Package,
  Heart,
  Eye,
  MapPin,
  Pencil,
  Trash2,
  CalendarDays,
  CheckCheck,
  RotateCcw,
  Upload,
  Save,
  Sparkles,
  BadgeCheck,
  ImagePlus,
} from "lucide-react";
import { money, formatDate } from "@/lib/format";
import { firstImage } from "@/lib/images";
import { CITIES, categoryBySlug, conditionLabel } from "@/lib/categories";

type MyUser = {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  city: string | null;
  bio: string | null;
  storeName: string | null;
  avatar: string | null;
  banner: string | null;
  createdAt: string;
};

type MyListing = {
  id: string;
  title: string;
  price: number;
  negotiable: boolean;
  status: string;
  featured: boolean;
  views: number;
  category: string;
  city: string;
  images: string[];
  createdAt: string;
};

const inputCls =
  "w-full rounded-2xl border border-slate-200 bg-slate-50/50 px-4 py-3 text-sm font-bold outline-none transition focus:border-brand-500 focus:bg-white focus:ring-2 focus:ring-brand-500/20";
const labelCls = "mb-2 block text-sm font-black text-slate-700";

export default function ProfileDashboard({ initialTab = "ads" }: { initialTab?: string }) {
  const [user, setUser] = useState<MyUser | null>(null);
  const [stats, setStats] = useState({ listingCount: 0, chatCount: 0, favoriteCount: 0, totalViews: 0 });
  const [ads, setAds] = useState<MyListing[]>([]);
  const [favs, setFavs] = useState<MyListing[]>([]);
  const [tab, setTab] = useState(initialTab === "favs" || initialTab === "store" ? initialTab : "ads");
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState("");

  const [store, setStore] = useState({ name: "", storeName: "", phone: "", city: "", bio: "", avatar: "" });
  const [avatarUploading, setAvatarUploading] = useState(false);
  const [savedMsg, setSavedMsg] = useState(false);
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    try {
      const [meR, adsR, favR] = await Promise.all([
        fetch("/api/me"),
        fetch("/api/listings?mine=1"),
        fetch("/api/favorites"),
      ]);
      const me = await meR.json();
      const adsD = await adsR.json();
      const favD = await favR.json();
      setUser(me.user);
      setStats(me.stats);
      setAds(adsD.listings || []);
      setFavs(favD.favorites || []);
      if (me.user) {
        setStore({
          name: me.user.name || "",
          storeName: me.user.storeName || "",
          phone: me.user.phone || "",
          city: me.user.city || "",
          bio: me.user.bio || "",
          avatar: me.user.avatar || "",
        });
      }
    } catch {
      /* ignore */
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const patchStatus = async (id: string, status: string) => {
    setBusyId(id);
    await fetch(`/api/listings/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    setBusyId("");
    load();
  };

  const removeListing = async (id: string) => {
    if (!confirm("هل تريد حذف هذا الإعلان نهائياً؟")) return;
    setBusyId(id);
    await fetch(`/api/listings/${id}`, { method: "DELETE" });
    setBusyId("");
    load();
  };

  const uploadAvatar = async (file: File | null) => {
    if (!file) return;
    setAvatarUploading(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const r = await fetch("/api/upload", { method: "POST", body: fd });
      const d = await r.json();
      if (r.ok && d.url) setStore((s) => ({ ...s, avatar: d.url }));
    } catch {
      /* ignore */
    } finally {
      setAvatarUploading(false);
    }
  };

  const saveStore = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSavedMsg(false);
    try {
      const r = await fetch("/api/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(store),
      });
      if (r.ok) {
        setSavedMsg(true);
        load();
        setTimeout(() => setSavedMsg(false), 2500);
      }
    } finally {
      setSaving(false);
    }
  };

  if (loading || !user) {
    return (
      <div className="grid place-items-center py-24 text-brand-600">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  const tabs = [
    { id: "ads", label: `إعلاناتي (${stats.listingCount})`, icon: <Package className="h-4 w-4" /> },
    { id: "favs", label: `المفضلة (${stats.favoriteCount})`, icon: <Heart className="h-4 w-4" /> },
    { id: "store", label: "إعدادات المتجر", icon: <Store className="h-4 w-4" /> },
  ];

  return (
    <div className="space-y-6">
      <div className="relative overflow-hidden rounded-3xl border border-slate-200/70 shadow-card">
        <div className="h-32 bg-gradient-to-l from-brand-700 via-brand-500 to-brand-600 sm:h-36">
          <div className="grid-lines h-full w-full opacity-40" />
        </div>
        <div className="px-5 pb-5 sm:px-8">
          <div className="-mt-12 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div className="flex items-end gap-4">
              <span className="grid h-24 w-24 shrink-0 place-items-center overflow-hidden rounded-3xl bg-gradient-to-br from-brand-500 to-brand-700 text-3xl font-black text-white ring-4 ring-white">
                {user.avatar ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={user.avatar} alt="" className="h-full w-full object-cover" />
                ) : (
                  user.name.charAt(0)
                )}
              </span>
              <div className="pb-1">
                <h1 className="font-cairo flex items-center gap-2 text-2xl font-black text-slate-900">
                  {user.name}
                  <BadgeCheck className="h-5 w-5 text-brand-500" />
                </h1>
                <p className="font-cairo text-sm font-extrabold text-brand-700">{user.storeName || "متجر بلا اسم"}</p>
                <p className="flex flex-wrap items-center gap-3 text-xs font-bold text-slate-500">
                  {user.city && (
                    <span className="flex items-center gap-1">
                      <MapPin className="h-3.5 w-3.5" /> {user.city}
                    </span>
                  )}
                  <span className="flex items-center gap-1">
                    <CalendarDays className="h-3.5 w-3.5" /> عضو منذ {formatDate(user.createdAt)}
                  </span>
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 sm:flex">
              <StatChip value={stats.listingCount} label="إعلان" icon={<Package className="h-4 w-4" />} />
              <StatChip value={stats.totalViews} label="مشاهدة" icon={<Eye className="h-4 w-4" />} />
              <StatChip value={stats.chatCount} label="محادثة" icon={<BadgeCheck className="h-4 w-4" />} />
              <StatChip value={stats.favoriteCount} label="مفضلة" icon={<Heart className="h-4 w-4" />} />
            </div>
          </div>
        </div>
      </div>

      <div className="no-scrollbar flex gap-2 overflow-x-auto">
        {tabs.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`flex shrink-0 items-center gap-2 rounded-full px-5 py-2.5 text-sm font-black transition ${
              tab === t.id
                ? "bg-gradient-to-l from-brand-600 to-brand-700 text-white shadow-glow-sm"
                : "border border-slate-200 bg-white text-slate-600 hover:border-brand-300"
            }`}
          >
            {t.icon}
            {t.label}
          </button>
        ))}
      </div>

      {tab === "ads" && (
        <div className="overflow-hidden rounded-3xl border border-slate-200/80 bg-white shadow-card">
          <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
            <h2 className="font-cairo font-extrabold text-slate-800">إعلاناتي</h2>
            <Link
              href="/post"
              className="rounded-xl bg-gradient-to-l from-brand-600 to-brand-700 px-4 py-2 text-sm font-bold text-white transition hover:brightness-110"
            >
              إعلان جديد
            </Link>
          </div>
          {ads.length === 0 ? (
            <div className="grid place-items-center px-6 py-16 text-center">
              <p className="text-sm font-bold text-slate-500">لم تنشر أي إعلان بعد — ابدأ الآن!</p>
              <Link
                href="/post"
                className="mt-4 rounded-2xl bg-gradient-to-l from-brand-600 to-brand-700 px-8 py-3 text-sm font-black text-white shadow-glow-sm"
              >
                أضف أول إعلان
              </Link>
            </div>
          ) : (
            <ul className="divide-y divide-slate-100">
              {ads.map((a) => {
                const img = firstImage(a.images);
                const active = a.status === "active";
                const cat = categoryBySlug(a.category);
                return (
                  <li key={a.id} className="flex flex-col gap-4 p-4 transition hover:bg-brand-50/40 sm:flex-row sm:items-center">
                    <Link href={`/listings/${a.id}`} className="relative flex min-w-0 flex-1 items-center gap-4">
                      <span className="relative h-16 w-20 shrink-0 overflow-hidden rounded-2xl border border-slate-200 bg-slate-100">
                        {img ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={img} alt="" className="h-full w-full object-cover" />
                        ) : (
                          <span className={`grid h-full w-full place-items-center text-[10px] font-black text-white bg-gradient-to-br ${cat?.gradient ?? "from-brand-600 to-brand-700"}`}>
                            {cat?.name ?? "أخرى"}
                          </span>
                        )}
                        {a.featured && (
                          <span className="absolute right-1 top-1 grid h-5 w-5 place-items-center rounded-full bg-amber-400 text-white">
                            <Sparkles className="h-3 w-3" />
                          </span>
                        )}
                      </span>
                      <span className="min-w-0">
                        <span className="font-cairo block truncate text-sm font-extrabold text-slate-800">{a.title}</span>
                        <span className="mt-1 block text-xs font-bold text-slate-400">
                          {cat?.name} • {conditionLabel("") || ""} {a.city} • {new Date(a.createdAt).toLocaleDateString("ar-EG")}
                        </span>
                        <span className="font-cairo mt-1 flex items-center gap-3 text-sm font-black text-gradient-brand">
                          {money(a.price)}
                          {a.negotiable && <span className="text-[11px] font-bold text-emerald-600">قابل للتفاوض</span>}
                        </span>
                      </span>
                    </Link>

                    <div className="flex shrink-0 flex-wrap items-center gap-2">
                      <span className={`flex items-center gap-1 rounded-full px-3 py-1 text-[11px] font-black ${active ? "bg-emerald-50 text-emerald-700" : "bg-slate-100 text-slate-500"}`}>
                        {active ? "منشور" : a.status === "sold" ? "مباع" : "مخفي"}
                      </span>
                      <Link
                        href={`/post?id=${a.id}`}
                        className="flex items-center gap-1 rounded-full bg-slate-100 px-3 py-1.5 text-xs font-bold text-slate-600 transition hover:bg-brand-50 hover:text-brand-700"
                      >
                        <Pencil className="h-3.5 w-3.5" /> تعديل
                      </Link>
                      <button
                        onClick={() => patchStatus(a.id, active ? "sold" : "active")}
                        disabled={busyId === a.id}
                        className={`flex items-center gap-1 rounded-full px-3 py-1.5 text-xs font-bold transition ${
                          active
                            ? "bg-brand-50 text-brand-700 hover:bg-brand-100"
                            : "bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                        }`}
                      >
                        {busyId === a.id ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : active ? <CheckCheck className="h-3.5 w-3.5" /> : <RotateCcw className="h-3.5 w-3.5" />}
                        {active ? "تم البيع" : "إعادة نشر"}
                      </button>
                      <button
                        onClick={() => removeListing(a.id)}
                        disabled={busyId === a.id}
                        className="flex items-center gap-1 rounded-full bg-rose-50 px-3 py-1.5 text-xs font-bold text-rose-600 transition hover:bg-rose-100"
                      >
                        <Trash2 className="h-3.5 w-3.5" /> حذف
                      </button>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      )}

      {tab === "favs" && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {favs.map((f) => {
            const img = firstImage(f.images);
            const cat = categoryBySlug(f.category);
            return (
              <Link
                key={f.id}
                href={`/listings/${f.id}`}
                className="group overflow-hidden rounded-3xl border border-slate-200/80 bg-white shadow-card transition hover:-translate-y-1 hover:shadow-card-hover"
              >
                <div className="relative aspect-[16/10] overflow-hidden bg-slate-100">
                  {img ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={img} alt="" className="h-full w-full object-cover transition duration-500 group-hover:scale-110" />
                  ) : (
                    <span className={`grid h-full w-full place-items-center bg-gradient-to-br ${cat?.gradient ?? "from-brand-600 to-brand-700"}`} />
                  )}
                  <span className="absolute right-3 top-3 grid h-8 w-8 place-items-center rounded-full bg-rose-500 text-white shadow">
                    <Heart className="h-4 w-4 fill-current" />
                  </span>
                </div>
                <div className="p-4">
                  <p className="font-cairo line-clamp-1 text-sm font-extrabold text-slate-800">{f.title}</p>
                  <p className="mt-1 text-xs font-bold text-slate-400">
                    {cat?.name} • {f.city}
                  </p>
                  <p className="font-cairo mt-2 text-base font-black text-gradient-brand">{money(f.price)}</p>
                </div>
              </Link>
            );
          })}
        </div>
      )}

      {tab === "store" && (
        <form onSubmit={saveStore} className="overflow-hidden rounded-3xl border border-slate-200/80 bg-white shadow-card">
          <div className="border-b border-slate-100 px-5 py-4">
            <h2 className="font-cairo font-extrabold text-slate-800">إعدادات متجري الرقمي</h2>
            <p className="text-sm font-bold text-slate-400">هذه المعلومات تظهر للجميع في صفحة متجرك العامة.</p>
          </div>

          <div className="grid gap-5 p-5 sm:p-6 lg:grid-cols-2">
            <div>
              <label className={labelCls}>اسمك</label>
              <input value={store.name} onChange={(e) => setStore((s) => ({ ...s, name: e.target.value }))} className={inputCls} />
            </div>
            <div>
              <label className={labelCls}>اسم المتجر (الواجهة العامة)</label>
              <input
                value={store.storeName}
                onChange={(e) => setStore((s) => ({ ...s, storeName: e.target.value }))}
                placeholder="مثال: متجر أحمد للإلكترونيات"
                className={inputCls}
              />
            </div>
            <div>
              <label className={labelCls}>رقم الهاتف (يظهر في متجرك ليتمكن المشترون من الاتصال)</label>
              <input
                value={store.phone}
                dir="ltr"
                onChange={(e) => setStore((s) => ({ ...s, phone: e.target.value }))}
                placeholder="05xxxxxxxx"
                className={`${inputCls} text-left`}
              />
            </div>
            <div>
              <label className={labelCls}>المدينة</label>
              <select value={store.city} onChange={(e) => setStore((s) => ({ ...s, city: e.target.value }))} className={inputCls}>
                <option value="">اختر المدينة</option>
                {CITIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>
            <div className="lg:col-span-2">
              <label className={labelCls}>وصف المتجر</label>
              <textarea
                value={store.bio}
                onChange={(e) => setStore((s) => ({ ...s, bio: e.target.value }))}
                rows={3}
                placeholder="أخبر الزوار عن متجرك ومنتجاتك…"
                className={`${inputCls} resize-none`}
              />
            </div>
            <div className="lg:col-span-2">
              <label className={labelCls}>شعار المتجر (صورة)</label>
              <div className="flex items-center gap-4">
                <span className="grid h-20 w-20 shrink-0 place-items-center overflow-hidden rounded-3xl bg-gradient-to-br from-brand-500 to-brand-700 text-2xl font-black text-white shadow-card">
                  {store.avatar ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={store.avatar} alt="" className="h-full w-full object-cover" />
                  ) : (
                    (store.name || "؟").charAt(0)
                  )}
                </span>
                <label className="flex cursor-pointer items-center gap-2 rounded-2xl border-2 border-dashed border-slate-300 px-5 py-3 text-sm font-bold text-slate-500 transition hover:border-brand-400 hover:text-brand-600">
                  {avatarUploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <ImagePlus className="h-4 w-4" />}
                  {avatarUploading ? "جارٍ الرفع…" : "رفع شعار"}
                  <input type="file" accept="image/*" className="hidden" onChange={(e) => uploadAvatar(e.target.files?.[0] || null)} />
                </label>
              </div>
            </div>
          </div>

          {savedMsg && (
            <div className="mx-5 mt-2 flex items-center gap-2 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-bold text-emerald-700">
              <CheckCheck className="h-4 w-4" /> تم حفظ إعدادات المتجر بنجاح
            </div>
          )}

          <div className="flex items-center justify-between border-t border-slate-100 px-5 py-4 sm:px-6">
            <Link href={`/profile/${user.id}`} className="text-sm font-black text-brand-600 hover:underline">
              معاينة متجري العام ←
            </Link>
            <button
              type="submit"
              disabled={saving}
              className="flex items-center gap-2 rounded-2xl bg-gradient-to-l from-brand-600 to-brand-700 px-8 py-3 text-sm font-black text-white shadow-glow-sm transition hover:brightness-110 disabled:opacity-60"
            >
              {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
              حفظ التغييرات
            </button>
          </div>
        </form>
      )}
    </div>
  );
}

function StatChip({ value, label, icon }: { value: number; label: string; icon: React.ReactNode }) {
  return (
    <div className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-2.5 shadow-sm">
      <span className="text-brand-600">{icon}</span>
      <div className="leading-tight">
        <p className="font-cairo text-sm font-black text-slate-800">{value.toLocaleString("en-US")}</p>
        <p className="text-[11px] font-bold text-slate-400">{label}</p>
      </div>
    </div>
  );
}