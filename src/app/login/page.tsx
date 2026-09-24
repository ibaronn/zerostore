import type { Metadata } from "next";
import { Suspense } from "react";
import Link from "next/link";
import { ShoppingBag, ShieldCheck, MessageCircle, Phone } from "lucide-react";
import { LoginForm } from "@/components/auth-forms";

export const metadata: Metadata = { title: "تسجيل الدخول | ZERO STORE" };

export default function LoginPage() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-brand-50 to-[#f4f6f5] py-16 text-slate-900">
      <div className="pointer-events-none absolute -top-24 right-1/3 h-72 w-72 rounded-full bg-brand-200/40 blur-3xl" />

      <div className="relative mx-auto grid max-w-5xl items-start gap-10 px-4 lg:grid-cols-2 lg:px-6">
        <div className="hidden lg:block">
          <div className="flex items-center gap-2">
            <span className="grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-br from-brand-600 to-brand-700 shadow-sm">
              <ShoppingBag className="h-6 w-6 text-white" />
            </span>
            <span className="font-cairo text-3xl font-black">ZERO<span className="text-gradient">STORE</span></span>
          </div>
          <h1 className="font-cairo mt-6 text-4xl font-black leading-tight">
            مرحباً بعودتك إلى <span className="text-gradient">سوقك المفتوح</span>
          </h1>
          <p className="mt-4 max-w-md text-sm font-bold leading-7 text-slate-500">
            سجّل دخولك لتتابع إعلاناتك، ترد على محادثات المشترين، وتدير متجرك الرقمي.
          </p>
          <div className="mt-8 space-y-3">
            <HeroPoint icon={<MessageCircle className="h-5 w-5 text-brand-600" />} text="دردشة تفاوض فورية مع المشترين" />
            <HeroPoint icon={<Phone className="h-5 w-5 text-emerald-600" />} text="رقم هاتفك يظهر في متجرك العام" />
            <HeroPoint icon={<ShieldCheck className="h-5 w-5 text-amber-600" />} text="حساب آمن وبيانات مشفّرة" />
          </div>
        </div>

        <div className="mx-auto w-full max-w-md rounded-[2rem] border border-slate-200/80 bg-white p-7 text-slate-900 shadow-xl shadow-brand-900/10 sm:p-9">
          <div className="mb-6 text-center lg:text-right">
            <h2 className="font-cairo text-2xl font-black">تسجيل الدخول</h2>
            <p className="mt-1 text-sm font-bold text-slate-400">أهلاً بك من جديد في زيرو ستور</p>
          </div>
          <Suspense fallback={<div className="py-10 text-center text-sm font-bold text-slate-400">جارٍ التحميل…</div>}>
            <LoginForm />
          </Suspense>
          <p className="mt-6 text-center text-[11px] font-bold text-slate-400">
            بالدخول فأنت توافق على شروط الاستخدام وسياسة الخصوصية.
            <Link href="#" className="mx-1 text-brand-600 hover:underline">اقرأ المزيد</Link>
          </p>
        </div>
      </div>
    </section>
  );
}

function HeroPoint({ icon, text }: { icon: React.ReactNode; text: string }) {
  return (
    <div className="flex items-center gap-3 rounded-2xl border border-slate-200/80 bg-white px-4 py-3 text-sm font-bold text-slate-700 shadow-sm">
      {icon}
      {text}
    </div>
  );
}