"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Loader2, Mail, Lock, User as UserIcon, Phone, AlertCircle } from "lucide-react";

const inputCls =
  "w-full rounded-2xl border border-slate-200 bg-slate-50/50 py-3.5 pe-4 ps-11 text-sm font-bold outline-none transition focus:border-brand-500 focus:bg-white focus:ring-2 focus:ring-brand-500/20";

function Field({ icon, ...props }: { icon: React.ReactNode } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div className="relative">
      <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400">{icon}</span>
      <input {...props} className={inputCls} />
    </div>
  );
}

const VALID_PHONE = /^(\+218|00218|0)?9[0-9]{8}$/;

export function normalizeLibyanPhone(input: string) {
  const digits = input.replace(/[^\d+]/g, "");
  if (/^\+2189/.test(digits)) return digits;
  if (/^2189/.test(digits)) return "+" + digits;
  if (/^002189/.test(digits)) return "+" + digits.slice(3);
  if (/^9/.test(digits)) return "+218" + digits;
  return digits;
}

export function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const sp = useSearchParams();
  const next = sp.get("next") || "/";

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const r = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const d = await r.json();
      if (!r.ok) {
        setError(d.error || "حدث خطأ");
        setLoading(false);
        return;
      }
      router.push(next);
      router.refresh();
    } catch {
      setError("تعذر الاتصال بالخادم");
      setLoading(false);
    }
  };

  return (
    <form onSubmit={submit} className="space-y-4">
      {error && (
        <div className="flex items-center gap-2 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-bold text-rose-700">
          <AlertCircle className="h-4 w-4" /> {error}
        </div>
      )}
      <Field icon={<Mail className="h-4 w-4" />} type="email" required placeholder="البريد الإلكتروني" value={email} onChange={(e) => setEmail(e.target.value)} />
      <Field icon={<Lock className="h-4 w-4" />} type="password" required placeholder="كلمة المرور" value={password} onChange={(e) => setPassword(e.target.value)} />
      <button
        type="submit"
        disabled={loading}
        className="flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-l from-brand-600 to-brand-700 py-3.5 text-base font-black text-white shadow-glow-sm transition hover:brightness-110 disabled:opacity-60"
      >
        {loading && <Loader2 className="h-5 w-5 animate-spin" />}
        تسجيل الدخول
      </button>
      <p className="text-center text-sm font-bold text-slate-500">
        ليس لديك حساب؟{" "}
        <Link href={`/register?next=${encodeURIComponent(next)}`} className="text-brand-600 hover:underline">
          أنشئ حساباً مجاناً
        </Link>
      </p>
    </form>
  );
}

export function RegisterForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const sp = useSearchParams();
  const next = sp.get("next") || "/";

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    const normalized = normalizeLibyanPhone(phone);
    if (!VALID_PHONE.test(normalized)) {
      setError("أدخل رقماً ليبيّاً صحيحاً يبدأ بـ 9 ويتكوّن من 10 أرقام (مثال: +218 91 234 5678)");
      setLoading(false);
      return;
    }
    try {
      const r = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, phone: normalized, password }),
      });
      const d = await r.json();
      if (!r.ok) {
        setError(d.error || "حدث خطأ");
        setLoading(false);
        return;
      }
      router.push(next);
      router.refresh();
    } catch {
      setError("تعذر الاتصال بالخادم");
      setLoading(false);
    }
  };

  return (
    <form onSubmit={submit} className="space-y-4">
      {error && (
        <div className="flex items-center gap-2 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-bold text-rose-700">
          <AlertCircle className="h-4 w-4" /> {error}
        </div>
      )}
      <Field icon={<UserIcon className="h-4 w-4" />} required placeholder="اسمك الكامل" value={name} onChange={(e) => setName(e.target.value)} />
      <Field icon={<Phone className="h-4 w-4" />} dir="ltr" placeholder="+218 91 234 5678 (رقم ليبي 10 أرقام)" value={phone} onChange={(e) => setPhone(e.target.value)} />
      <Field icon={<Mail className="h-4 w-4" />} type="email" required placeholder="البريد الإلكتروني" value={email} onChange={(e) => setEmail(e.target.value)} />
      <Field icon={<Lock className="h-4 w-4" />} type="password" required placeholder="كلمة المرور (6 أحرف على الأقل)" value={password} onChange={(e) => setPassword(e.target.value)} />
      <button
        type="submit"
        disabled={loading}
        className="flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-l from-brand-600 to-brand-700 py-3.5 text-base font-black text-white shadow-glow-sm transition hover:brightness-110 disabled:opacity-60"
      >
        {loading && <Loader2 className="h-5 w-5 animate-spin" />}
        إنشاء الحساب
      </button>
      <p className="text-center text-sm font-bold text-slate-500">
        لديك حساب بالفعل؟{" "}
        <Link href={`/login?next=${encodeURIComponent(next)}`} className="text-brand-600 hover:underline">
          سجّل دخولك
        </Link>
      </p>
    </form>
  );
}