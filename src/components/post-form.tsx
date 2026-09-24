"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Loader2,
  Upload,
  X,
  ImagePlus,
  BadgeCheck,
  CheckCircle2,
  AlertCircle,
  LocateFixed,
} from "lucide-react";
import { CATEGORIES, CITIES, CONDITIONS } from "@/lib/categories";
import { getPosition, nearestCity } from "@/lib/gps";

export type PostInitial = {
  id?: string;
  title: string;
  description: string;
  price: number;
  negotiable: boolean;
  condition: string;
  category: string;
  city: string;
  images: string[];
};

const inputCls =
  "w-full rounded-2xl border border-slate-200 bg-slate-50/50 px-4 py-3 text-sm font-bold outline-none transition focus:border-brand-500 focus:bg-white focus:ring-2 focus:ring-brand-500/20";

const labelCls = "mb-2 block text-sm font-black text-slate-700";

export default function PostForm({ initial, isEdit }: { initial: PostInitial; isEdit: boolean }) {
  const [form, setForm] = useState(initial);
  const [images, setImages] = useState<string[]>(initial.images);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [gpsBusy, setGpsBusy] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const set = (k: keyof PostInitial, v: unknown) => setForm((f) => ({ ...f, [k]: v }));

  const useMyLocation = async () => {
    if (gpsBusy) return;
    setGpsBusy(true);
    setError("");
    try {
      const pos = await getPosition();
      const c = nearestCity(pos.lat, pos.lng);
      set("city", c);
    } catch (e) {
      setError(e instanceof Error ? e.message : "تعذّر تحديد موقعك");
    } finally {
      setGpsBusy(false);
    }
  };

  const uploadFiles = async (files: FileList | null) => {
    if (!files?.length) return;
    setUploading(true);
    setError("");
    try {
      for (const file of Array.from(files)) {
        const fd = new FormData();
        fd.append("file", file);
        const r = await fetch("/api/upload", { method: "POST", body: fd });
        const d = await r.json();
        if (r.ok && d.url) setImages((prev) => [...prev, d.url]);
        else setError(d.error || "فشل رفع صورة");
      }
    } catch {
      setError("حدث خطأ أثناء رفع الصور");
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    if (form.title.trim().length < 4) return setError("عنوان الإعلان يجب ألا يقل عن 4 أحرف");
    if (form.description.trim().length < 10) return setError("الوصف يجب ألا يقل عن 10 أحرف");
    if (!form.price || form.price <= 0) return setError("أدخل سعراً صحيحاً");
    if (!form.category) return setError("اختر القسم");
    if (!form.city) return setError("اختر المدينة");
    setSaving(true);
    try {
      const payload = { ...form, images };
      const url = isEdit ? `/api/listings/${initial.id}` : "/api/listings";
      const r = await fetch(url, {
        method: isEdit ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const d = await r.json();
      if (!r.ok) {
        setError(d.error || "فشل الحفظ");
        setSaving(false);
        return;
      }
      setSuccess(isEdit ? "تم تحديث الإعلان بنجاح" : "تم نشر إعلانك بنجاح 🎉");
      setTimeout(() => router.push(`/listings/${d.listing.id}`), 600);
    } catch {
      setError("حدث خطأ غير متوقع");
      setSaving(false);
    }
  };

  return (
    <form onSubmit={submit} className="space-y-6">
      {error && (
        <div className="flex items-center gap-2 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-bold text-rose-700">
          <AlertCircle className="h-4 w-4" /> {error}
        </div>
      )}
      {success && (
        <div className="flex items-center gap-2 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-bold text-emerald-700">
          <CheckCircle2 className="h-4 w-4" /> {success}
        </div>
      )}

      <div className="grid gap-5 rounded-3xl border border-white/60 bg-white/70 p-5 shadow-card backdrop-blur-xl sm:p-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <label className={labelCls}>عنوان الإعلان *</label>
          <input
            value={form.title}
            onChange={(e) => set("title", e.target.value)}
            placeholder="مثال: آيفون 15 برو ماكس 256 جيجا - جديد بكرتونه"
            className={inputCls}
          />
        </div>
        <div>
          <label className={labelCls}>السعر (دينار ليبي د.ل) *</label>
          <input
            value={form.price || ""}
            onChange={(e) => set("price", Number(e.target.value))}
            type="number"
            min={0}
            placeholder="0"
            className={inputCls}
          />
        </div>
      </div>

      <div className="grid gap-5 rounded-3xl border border-white/60 bg-white/70 p-5 shadow-card backdrop-blur-xl sm:p-6 lg:grid-cols-3">
        <div>
          <label className={labelCls}>القسم *</label>
          <select value={form.category} onChange={(e) => set("category", e.target.value)} className={inputCls}>
            <option value="">اختر القسم</option>
            {CATEGORIES.map((c) => (
              <option key={c.slug} value={c.slug}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className={labelCls}>الحالة *</label>
          <select value={form.condition} onChange={(e) => set("condition", e.target.value)} className={inputCls}>
            {CONDITIONS.map((c) => (
              <option key={c.value} value={c.value}>
                {c.label}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className={labelCls}>المدينة *</label>
          <div className="flex items-center gap-2">
            <select value={form.city} onChange={(e) => set("city", e.target.value)} className={inputCls}>
              <option value="">اختر المدينة</option>
              {CITIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
            <button
              type="button"
              onClick={useMyLocation}
              disabled={gpsBusy}
              className="flex shrink-0 items-center gap-1.5 rounded-2xl bg-gradient-to-l from-brand-600 to-brand-700 px-3.5 py-3 text-xs font-black text-white shadow-glow-sm transition hover:brightness-110 disabled:opacity-60"
              title="حدّد مدينتك من موقعك"
            >
              {gpsBusy ? <Loader2 className="h-4 w-4 animate-spin" /> : <LocateFixed className="h-4 w-4" />}
              موقعي
            </button>
          </div>
        </div>
      </div>

      <div className="rounded-3xl border border-white/60 bg-white/70 p-5 shadow-card backdrop-blur-xl sm:p-6">
        <label className={labelCls}>صور المنتج {isEdit ? "(" + images.length + ")" : ""}</label>
        <div className="flex flex-wrap gap-3">
          {images.map((img, i) => (
            <div key={i} className="group relative h-24 w-28 overflow-hidden rounded-2xl border border-slate-200">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={img} alt="" className="h-full w-full object-cover" />
              <button
                type="button"
                onClick={() => setImages((prev) => prev.filter((_, j) => j !== i))}
                className="absolute left-1 top-1 grid h-6 w-6 place-items-center rounded-full bg-ink/70 text-white opacity-0 transition group-hover:opacity-100"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
          ))}
          {uploading ? (
            <div className="grid h-24 w-28 place-items-center rounded-2xl border-2 border-dashed border-brand-300 bg-brand-50 text-brand-600">
              <Loader2 className="h-6 w-6 animate-spin" />
            </div>
          ) : (
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              className="grid h-24 w-28 place-items-center gap-1 rounded-2xl border-2 border-dashed border-slate-300 text-slate-400 transition hover:border-brand-400 hover:bg-brand-50 hover:text-brand-600"
            >
              <ImagePlus className="h-6 w-6" />
              <span className="text-[11px] font-bold">إضافة صورة</span>
            </button>
          )}
          <input ref={fileRef} type="file" accept="image/*" multiple className="hidden" onChange={(e) => uploadFiles(e.target.files)} />
        </div>
        <p className="mt-2 text-xs text-slate-400">يمكنك رفع حتى 12 صورة، بصيغة JPG / PNG / WebP وبحد أقصى 8 ميجابايت.</p>
      </div>

      <div className="rounded-3xl border border-white/60 bg-white/70 p-5 shadow-card backdrop-blur-xl sm:p-6">
        <label className={labelCls}>الوصف *</label>
        <textarea
          value={form.description}
          onChange={(e) => set("description", e.target.value)}
          rows={6}
          placeholder="اكتب وصفاً دقيقاً: الحالة، المواصفات، سبب البيع، ما يشمل السعر…"
          className={`${inputCls} resize-none leading-7`}
        />
        <div className="mt-4 flex items-center justify-between rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3">
          <div>
            <p className="text-sm font-black text-emerald-800">السعر قابل للتفاوض</p>
            <p className="text-xs text-emerald-600">فعّل هذا الخيار ليتمكن المشترون من مراسلتك للتفاوض على السعر.</p>
          </div>
          <button
            type="button"
            onClick={() => set("negotiable", !form.negotiable)}
            className={`relative h-8 w-14 shrink-0 rounded-full transition ${form.negotiable ? "bg-emerald-500" : "bg-slate-300"}`}
            aria-label="تفعيل التفاوض"
          >
            <span className={`absolute top-1 grid h-6 w-6 place-items-center rounded-full bg-white shadow transition-all ${form.negotiable ? "left-1" : "left-7"}`}>
              <BadgeCheck className="h-4 w-4 text-emerald-500" />
            </span>
          </button>
        </div>
      </div>

      <div className="sticky bottom-4 z-10 flex flex-col gap-3 rounded-3xl border border-white/60 bg-white/80 p-4 shadow-card backdrop-blur-xl sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm font-bold text-slate-500">
          {isEdit ? "أنت تعدّل هذا الإعلان حالياً." : "إعلانك سيظهر لكل ليبيا فور النشر — بلا عمولة، بالسعر بالدينار."}
        </p>
        <button
          type="submit"
          disabled={saving}
          className="btn-3d shine flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-l from-brand-600 to-brand-700 px-8 py-3.5 text-base font-black text-white active:scale-[0.99] disabled:opacity-60"
        >
          {saving ? <Loader2 className="h-5 w-5 animate-spin" /> : <Upload className="h-5 w-5" />}
          {isEdit ? "حفظ التعديلات" : "نشر الإعلان الآن"}
        </button>
      </div>
    </form>
  );
}