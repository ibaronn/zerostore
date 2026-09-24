"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Loader2,
  Mail,
  Lock,
  User as UserIcon,
  Phone,
  AlertCircle,
  ShieldCheck,
  MessageCircle,
  ArrowRight,
  ArrowLeft,
  CheckCheck,
} from "lucide-react";
import { normalizeLibyanPhone, toLocalPhoneDigits, VALID_PHONE } from "@/lib/phone";

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

function ErrorBox({ message }: { message: string }) {
  return (
    <div className="flex items-center gap-2 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-bold text-rose-700">
      <AlertCircle className="h-4 w-4 shrink-0" /> {message}
    </div>
  );
}

function Steps({ current }: { current: number }) {
  const items = ["رقم الهاتف", "رمز التفعيل", "بيانات الحساب"];
  return (
    <div className="mb-6 flex items-center gap-2">
      {items.map((label, i) => (
        <div key={label} className="flex flex-1 flex-col items-center gap-1.5">
          <div
            className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-black transition ${
              i < current
                ? "bg-emerald-500 text-white"
                : i === current
                  ? "bg-brand-600 text-white shadow-glow-sm"
                  : "bg-slate-100 text-slate-400"
            }`}
          >
            {i < current ? <CheckCheck className="h-4 w-4" /> : i + 1}
          </div>
          <span className={`text-[10px] font-bold ${i === current ? "text-brand-700" : "text-slate-400"}`}>{label}</span>
        </div>
      ))}
    </div>
  );
}

function OtpBoxes({
  value,
  onChange,
  disabled,
}: {
  value: string;
  onChange: (v: string) => void;
  disabled?: boolean;
}) {
  const refs = useRef<(HTMLInputElement | null)[]>([]);
  const handle = (idx: number, raw: string) => {
    const digit = raw.replace(/\D/g, "").slice(-1);
    const next = value.slice(0, idx) + digit + value.slice(idx + 1);
    onChange(next);
    if (digit && idx < 5) refs.current[idx + 1]?.focus();
  };

  useEffect(() => {
    refs.current[Math.min(value.length, 5)]?.focus();
  }, []);

  return (
    <div dir="ltr" className="flex justify-center gap-2">
      {Array.from({ length: 6 }).map((_, i) => (
        <input
          key={i}
          ref={(el) => {
            refs.current[i] = el;
          }}
          inputMode="numeric"
          autoComplete="one-time-code"
          maxLength={6}
          value={value[i] ?? ""}
          disabled={disabled}
          onChange={(e) => {
            const raw = e.target.value;
            if (raw.length > 1) {
              onChange(raw.replace(/\D/g, "").slice(0, 6));
              refs.current[Math.min(raw.length - 1, 5)]?.focus();
            } else {
              handle(i, raw);
            }
          }}
          onKeyDown={(e) => {
            if (e.key === "Backspace" && !value[i] && i > 0) refs.current[i - 1]?.focus();
          }}
          onPaste={(e) => {
            e.preventDefault();
            const txt = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
            if (txt) onChange(txt);
          }}
          className="h-14 w-12 rounded-xl border border-slate-200 bg-slate-50/50 text-center text-xl font-black text-slate-900 outline-none transition focus:border-brand-500 focus:bg-white focus:ring-2 focus:ring-brand-500/20 disabled:opacity-60"
        />
      ))}
    </div>
  );
}

export function LoginForm() {
  const [identifier, setIdentifier] = useState("");
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
        body: JSON.stringify({ email: identifier, password }),
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
      {error && <ErrorBox message={error} />}
      <Field icon={<Mail className="h-4 w-4" />} type="email" required placeholder="البريد الإلكتروني" value={identifier} onChange={(e) => setIdentifier(e.target.value)} />
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
  const router = useRouter();
  const sp = useSearchParams();
  const next = sp.get("next") || "/";

  const [step, setStep] = useState<"phone" | "code" | "details">("phone");
  const [rawPhone, setRawPhone] = useState("");
  const [phone, setPhone] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const [code, setCode] = useState("");
  const [demoCode, setDemoCode] = useState("");
  const [countdown, setCountdown] = useState(0);
  const [verifiedToken, setVerifiedToken] = useState("");

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const sendCode = async () => {
    setError("");
    const normalized = normalizeLibyanPhone(rawPhone);
    if (!VALID_PHONE.test(normalized)) {
      setError("أدخل رقماً ليبيّاً صحيحاً: يبدأ بـ 09 ثم 8 أرقام (مثال: 0912345678)");
      return;
    }
    setPhone(normalized);
    setLoading(true);
    try {
      const r = await fetch("/api/auth/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone: normalized }),
      });
      const d = await r.json();
      if (!r.ok) {
        setError(d.error || "حدث خطأ");
        setLoading(false);
        return;
      }
      setDemoCode(d.demo ? d.demoCode : "");
      setCountdown(d.resendAfter ?? 45);
      setCode("");
      setStep("code");
    } catch {
      setError("تعذر الاتصال بالخادم");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (countdown <= 0) return;
    const t = setTimeout(() => setCountdown((c) => c - 1), 1000);
    return () => clearTimeout(t);
  }, [countdown]);

  const verifyCode = async () => {
    if (code.length !== 6) {
      setError("أدخل الرمز كاملاً من 6 أرقام");
      return;
    }
    setError("");
    setLoading(true);
    try {
      const r = await fetch("/api/auth/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone, code }),
      });
      const d = await r.json();
      if (!r.ok) {
        setError(d.error || "الرمز غير صحيح");
        setLoading(false);
        return;
      }
      setVerifiedToken(d.verifiedToken);
      setStep("details");
    } catch {
      setError("تعذر الاتصال بالخادم");
    } finally {
      setLoading(false);
    }
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const r = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, phone, password, verifiedToken }),
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
    <div className="space-y-5">
      <Steps current={step === "phone" ? 0 : step === "code" ? 1 : 2} />

      {error && <ErrorBox message={error} />}

      {step === "phone" && (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            sendCode();
          }}
          className="space-y-4"
        >
          <div className="grid h-14 w-14 place-items-center rounded-2xl bg-brand-50 text-brand-600">
            <Phone className="h-6 w-6" />
          </div>
          <h3 className="font-cairo text-lg font-black text-slate-900">بداية موثوقة برقمك الليبي</h3>
          <p className="text-sm font-bold leading-7 text-slate-500">
            سنرسل رمزاً من 6 أرقام إلى واتساب رقمك للتأكد أنك صاحب المتجر. مجاني 100% ورمز الدولة +218 يُضاف تلقائياً.
          </p>
          <div className="flex items-stretch gap-2">
            <span
              dir="ltr"
              className="flex shrink-0 items-center gap-1.5 rounded-2xl border border-slate-200 bg-slate-100 px-3.5 py-3.5 text-sm font-black text-slate-700"
            >
              🇱🇾 +218
            </span>
            <div className="relative min-w-0 flex-1">
              <input
                dir="ltr"
                inputMode="tel"
                autoComplete="tel-national"
                placeholder="09 123 456 78"
                value={rawPhone}
                onChange={(e) => setRawPhone(toLocalPhoneDigits(e.target.value))}
                className="w-full rounded-2xl border border-slate-200 bg-slate-50/50 py-3.5 pe-12 ps-4 text-sm font-bold outline-none transition focus:border-brand-500 focus:bg-white focus:ring-2 focus:ring-brand-500/20"
              />
              {rawPhone && (
                <span className="absolute end-9 top-1/2 -translate-y-1/2">
                  {VALID_PHONE.test(normalizeLibyanPhone(rawPhone)) ? (
                    <CheckCheck className="h-5 w-5 text-emerald-500" />
                  ) : (
                    <span className="text-xs font-bold text-slate-300">{10 - rawPhone.length} أرقام متبقية</span>
                  )}
                </span>
              )}
            </div>
          </div>
          <p className="flex items-center gap-1.5 rounded-xl bg-slate-50 px-3 py-2 text-[11px] font-bold leading-5 text-slate-400">
            <ShieldCheck className="h-3.5 w-3.5 shrink-0 text-brand-500" />
            اكتب رقمك بالصيغة المختصرة 09… وسيُحفظ في متجرك بالصيغة الدولية <span dir="ltr">+218…</span> دون أن تكتبه
          </p>
          <button
            type="submit"
            disabled={loading}
            className="flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-l from-brand-600 to-brand-700 py-3.5 text-base font-black text-white shadow-glow-sm transition hover:brightness-110 disabled:opacity-60"
          >
            {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : <MessageCircle className="h-5 w-5" />}
            أرسل رمز التفعيل للواتساب
          </button>
          <p className="text-center text-xs font-bold leading-6 text-slate-400">
            إن كان الرقم مرتبطاً بحساب موجود سيُطلب منك تسجيل الدخول بدلاً من ذلك.
          </p>
        </form>
      )}

      {step === "code" && (
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-brand-50 text-brand-600">
              <ShieldCheck className="h-6 w-6" />
            </span>
            <div>
              <h3 className="font-cairo text-lg font-black text-slate-900">تحقق من رمز التفعيل</h3>
              <p className="text-sm font-bold text-slate-500">
                أُرسل الرمز إلى <span dir="ltr">{phone}</span>
              </p>
            </div>
          </div>

          {demoCode && (
            <div className="flex items-center gap-2 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm font-bold text-amber-800">
              <AlertCircle className="h-4 w-4 shrink-0" />
              وضع تجريبي (بدون خدمة واتساب): رمز التحقق هو <span className="font-mono text-base" dir="ltr">{demoCode}</span>
            </div>
          )}

          <OtpBoxes value={code} onChange={setCode} disabled={loading} />

          <button
            onClick={verifyCode}
            disabled={loading}
            className="flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-l from-brand-600 to-brand-700 py-3.5 text-base font-black text-white shadow-glow-sm transition hover:brightness-110 disabled:opacity-60"
          >
            {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : <ShieldCheck className="h-5 w-5" />}
            تحقق من الرمز والمتابعة
          </button>

          <div className="flex items-center justify-between text-sm font-bold">
            <button
              type="button"
              onClick={() => setStep("phone")}
              className="flex items-center gap-1 text-slate-500 transition hover:text-brand-700"
            >
              <ArrowRight className="h-4 w-4" /> تغيير الرقم
            </button>
            <button
              type="button"
              disabled={countdown > 0 || loading}
              onClick={sendCode}
              className="flex items-center gap-1 text-brand-600 transition hover:underline disabled:text-slate-400 disabled:no-underline"
            >
              {countdown > 0 ? `إعادة الإرسال بعد ${countdown}ث` : "إعادة إرسال الرمز"}
            </button>
          </div>
        </div>
      )}

      {step === "details" && (
        <form onSubmit={submit} className="space-y-4">
          <div className="flex items-center gap-2 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-bold text-emerald-800">
            <CheckCheck className="h-4 w-4 shrink-0" />
            تم توثيق رقم <span dir="ltr">{phone}</span> بنجاح
          </div>
          <Field icon={<UserIcon className="h-4 w-4" />} required placeholder="اسمك الكامل" value={name} onChange={(e) => setName(e.target.value)} />
          <Field icon={<Mail className="h-4 w-4" />} type="email" required placeholder="البريد الإلكتروني" value={email} onChange={(e) => setEmail(e.target.value)} />
          <Field icon={<Lock className="h-4 w-4" />} type="password" required placeholder="كلمة المرور (6 أحرف على الأقل)" value={password} onChange={(e) => setPassword(e.target.value)} />
          <button
            type="submit"
            disabled={loading}
            className="flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-l from-brand-600 to-brand-700 py-3.5 text-base font-black text-white shadow-glow-sm transition hover:brightness-110 disabled:opacity-60"
          >
            {loading && <Loader2 className="h-5 w-5 animate-spin" />}
            إنشاء الحساب — مرحباً بك 🎉
          </button>
          <button
            type="button"
            onClick={() => setStep("code")}
            className="flex w-full items-center justify-center gap-1 text-sm font-bold text-slate-500 transition hover:text-brand-700"
          >
            <ArrowLeft className="h-4 w-4" /> رجوع
          </button>
        </form>
      )}

      <p className="text-center text-sm font-bold text-slate-500">
        لديك حساب بالفعل؟{" "}
        <Link href={`/login?next=${encodeURIComponent(next)}`} className="text-brand-600 hover:underline">
          سجّل دخولك
        </Link>
      </p>
    </div>
  );
}