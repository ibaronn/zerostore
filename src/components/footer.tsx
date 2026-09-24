import Link from "next/link";
import { ShoppingBag, MapPin, Mail, ShieldCheck, Zap, Globe2 } from "lucide-react";
import { CATEGORIES } from "@/lib/categories";

const MARQUEE = "🇱🇾 ليبيا • طرابلس • بنغازي • مصراتة • سبها • زليتن • طبرق • الخمس • درنة • الزاوية • الكفرة • مرزق • غريان • سرت • أجدابيا • غدارس";

export default function Footer() {
  return (
    <footer className="bg-ink text-white">
      <div className="relative overflow-hidden border-b border-white/10 bg-gradient-to-l from-brand-950/70 via-brand-900/50 to-brand-950/70">
        <div className="pointer-events-none absolute -left-24 -top-24 h-56 w-56 rounded-full bg-brand-600/20 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-24 -right-24 h-56 w-56 rounded-full bg-brand-600/20 blur-3xl" />
        <div className="relative mx-auto flex max-w-7xl flex-col items-center justify-between gap-5 px-4 py-10 sm:flex-row lg:px-6">
          <div className="text-center sm:text-end">
            <p className="font-cairo text-2xl font-black">
              عيشتك التجارية تبدأ <span className="text-gradient">من زيرو ستور</span>
            </p>
            <p className="mt-1 text-sm text-white/60">انضم لآلاف البائعين في كل المدن الليبية — مجاناً 100%</p>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <Link href="/post" className="btn-3d rounded-xl bg-brand-600 px-7 py-3 text-sm font-black text-white">
              أضف إعلانك الآن
            </Link>
            <Link href="/listings" className="rounded-xl border border-white/20 bg-white/5 px-6 py-3 text-sm font-bold text-white transition hover:bg-white/10">
              تصفح السوق
            </Link>
          </div>
        </div>
      </div>

      <div className="overflow-hidden bg-brand-950/40 py-2.5">
        <p dir="ltr" className="animate-marquee w-max whitespace-nowrap text-xs font-black tracking-widest text-brand-300/70">
          {MARQUEE} • {MARQUEE}
        </p>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-14 lg:px-6">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="grid h-10 w-10 place-items-center rounded-xl bg-brand-600">
                <ShoppingBag className="h-5 w-5 text-white" />
              </span>
              <span className="font-cairo text-2xl font-black">
                ZERO<span className="text-gradient">STORE</span>
              </span>
              <span className="rounded-full border border-emerald-400/30 bg-emerald-400/10 px-2 py-0.5 text-[10px] font-black text-emerald-300">
                من ليبيا 🇱🇾
              </span>
            </div>
            <p className="mt-4 text-sm leading-7 text-white/60">
              أول سوق ليبي مفتوح بالكامل — اعرض منتجاتك مجاناً من أي مدينة، أنشئ متجرك الرقمي برقم هاتفك الليبي +218، وتفاوض مع المشترين عبر دردشة فورية.
            </p>
            <div className="mt-5 flex flex-col gap-2 text-sm text-white/60">
              <span className="flex items-center gap-2"><ShieldCheck className="h-4 w-4 text-emerald-400" /> بلا عمولة نهائياً</span>
              <span className="flex items-center gap-2"><Zap className="h-4 w-4 text-amber-400" /> نتائج فورية لكل ليبيا</span>
            </div>
          </div>

          <div>
            <h4 className="font-cairo mb-4 font-extrabold">أقسام السوق</h4>
            <ul className="grid grid-cols-2 gap-2 text-sm text-white/65">
              {CATEGORIES.slice(0, 10).map((c) => (
                <li key={c.slug}>
                  <Link href={`/listings?category=${c.slug}`} className="transition hover:text-brand-400">
                    {c.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-cairo mb-4 font-extrabold">روابط سريعة</h4>
            <ul className="flex flex-col gap-2 text-sm text-white/65">
              <li><Link href="/listings" className="transition hover:text-brand-400">تصفح السوق</Link></li>
              <li><Link href="/post" className="transition hover:text-brand-400">أضف إعلانك</Link></li>
              <li><Link href="/chat" className="transition hover:text-brand-400">محادثاتي</Link></li>
              <li><Link href="/profile?tab=store" className="transition hover:text-brand-400">متجري الرقمي</Link></li>
              <li><Link href="/register" className="transition hover:text-brand-400">حساب جديد</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-cairo mb-4 font-extrabold">تواصل معنا</h4>
            <ul className="flex flex-col gap-2 text-sm text-white/65">
              <li className="flex items-center gap-2"><Mail className="h-4 w-4 text-brand-400" /> Support@ZeroStore.Ly</li>
              <li className="flex items-center gap-2"><MapPin className="h-4 w-4 text-brand-400" /> طرابلس، ليبيا 🇱🇾</li>
              <li className="flex items-center gap-2"><Globe2 className="h-4 w-4 text-brand-400" /> يغطي كل المدن الليبية</li>
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-3 border-t border-white/10 pt-6 text-xs text-white/50 sm:flex-row">
          <p>© {new Date().getFullYear()} ZERO STORE — سوق ليبيا المفتوح. جميع الحقوق محفوظة.</p>
          <p>صُنع من قلب ليبيا لتطوير تجربة البيع والشراء</p>
        </div>
      </div>
    </footer>
  );
}