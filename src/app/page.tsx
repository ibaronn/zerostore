import Link from "next/link";
import {
  ShoppingBag,
  PlusCircle,
  MessageCircle,
  Store,
  Rocket,
  Users,
  ChevronLeft,
  PlayCircle,
  Sparkles,
  ArrowLeft,
} from "lucide-react";
import { prisma } from "@/lib/prisma";
import { imageList } from "@/lib/images";
import type { ListingCardData } from "@/components/listing-card";
import ListingCard from "@/components/listing-card";
import CategoriesGrid from "@/components/categories-grid";
import StatsBand from "@/components/stats-band";
import Reveal from "@/components/reveal";
import AdMarquee, { type MarqueeListing } from "@/components/ad-marquee";
import Hero from "@/components/hero";

export const metadata = {
  title: "ZERO STORE | سوق ليبيا المفتوح — اعرض، تفاوض، واربح",
};

type CardLite = {
  id: string;
  title: string;
  price: number;
  negotiable: boolean;
  condition: string;
  category: string;
  city: string;
  images: string[];
  views: number;
  featured: boolean;
  status: string;
  createdAt: string | Date;
  user: { id: string; name: string; avatar: string | null; storeName: string | null };
};

function toCard(l: {
  id: string;
  title: string;
  price: number;
  negotiable: boolean;
  condition: string;
  category: string;
  city: string;
  images: string;
  views: number;
  featured: boolean;
  status: string;
  createdAt: Date;
  user: { id: string; name: string; avatar: string | null; storeName: string | null };
}): ListingCardData {
  return {
    id: l.id,
    title: l.title,
    price: l.price,
    negotiable: l.negotiable,
    condition: l.condition,
    category: l.category,
    city: l.city,
    images: imageList(l.images),
    views: l.views,
    featured: l.featured,
    status: l.status,
    createdAt: l.createdAt,
    user: l.user,
  };
}

function toMarquee(l: {
  id: string;
  title: string;
  price: number;
  negotiable: boolean;
  category: string;
  city: string;
  images: string;
  user: { id: string; name: string; avatar: string | null; storeName: string | null };
}): MarqueeListing {
  return {
    id: l.id,
    title: l.title,
    price: l.price,
    negotiable: l.negotiable,
    category: l.category,
    city: l.city,
    images: imageList(l.images),
    user: l.user,
  };
}

export default async function HomePage() {
  const [featured, latest, marqueeAll] = await Promise.all([
    prisma.listing.findMany({
      where: { status: "active", featured: true },
      include: { user: { select: { id: true, name: true, avatar: true, storeName: true } } },
      orderBy: { createdAt: "desc" },
      take: 4,
    }),
    prisma.listing.findMany({
      where: { status: "active" },
      include: { user: { select: { id: true, name: true, avatar: true, storeName: true } } },
      orderBy: { createdAt: "desc" },
      take: 8,
    }),
    prisma.listing.findMany({
      where: { status: "active" },
      include: { user: { select: { id: true, name: true, avatar: true, storeName: true } } },
      orderBy: { views: "desc" },
      take: 10,
    }),
  ]);

  const showcase = (featured.length ? featured : latest).map(toCard) as unknown as CardLite[];

  return (
    <>
      <Hero showcase={showcase} count={latest.length} />

      <section className="relative mx-auto -mt-8 max-w-7xl px-4 py-8 lg:px-6">
        <Reveal>
          <SectionHead
            icon={<Store className="h-6 w-6" />}
            title="تصفح حسب القسم"
            sub="كل اللي تحتاجه في مكان واحد"
            href="/listings"
          />
        </Reveal>
        <Reveal delay={0.06}>
          <CategoriesGrid />
        </Reveal>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-10 lg:px-6">
        <Reveal>
          <SectionHead
            icon={<Rocket className="h-6 w-6" />}
            title="إعلانات مميزة"
            sub="أبرز المنتجات التي ينتظرها الجميع"
            href="/listings?featured=true"
          />
        </Reveal>
        <Reveal delay={0.06}>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {featured.map((l) => (
              <ListingCard key={l.id} listing={toCard(l as never)} isFavorite={false} />
            ))}
          </div>
        </Reveal>
      </section>

      <Reveal delay={0.06}>
        <AdMarquee
          title="الأكثر مشاهدة الآن"
          sub="إعلانات يتابعها الجميع — لا تفوّت الرائج في السوق"
          listings={marqueeAll.map(toMarquee)}
          fast
        />
      </Reveal>

      <section className="bg-white py-14">
        <div className="mx-auto max-w-7xl px-4 lg:px-6">
          <Reveal>
            <SectionHead
              icon={<ShoppingBag className="h-6 w-6" />}
              title="أحدث الإعلانات"
              sub="جديد السوق الآن — كن أول من يرى"
              href="/listings"
            />
          </Reveal>
          <Reveal delay={0.06}>
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {latest.map((l) => (
                <ListingCard key={l.id} listing={toCard(l as never)} isFavorite={false} />
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      <StatsBand />

      <HowItWorks />

      <PromoVideo />

      <CTABanner />
    </>
  );
}

function SectionHead({
  icon,
  title,
  sub,
  href,
}: {
  icon: React.ReactNode;
  title: string;
  sub: string;
  href: string;
}) {
  return (
    <div className="mb-6 flex items-end justify-between gap-4">
      <div>
        <div className="flex items-center gap-2.5">
          <span className="grid h-10 w-10 place-items-center rounded-xl bg-brand-50 text-brand-700">{icon}</span>
          <h2 className="font-cairo text-2xl font-extrabold text-slate-900 sm:text-3xl">{title}</h2>
        </div>
        <p className="mt-1.5 text-sm font-medium text-slate-500">{sub}</p>
        <span className="mt-3 block h-1 w-12 rounded-full bg-brand-600" />
      </div>
      <Link
        href={href}
        className="group hidden shrink-0 items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-bold text-slate-600 transition hover:border-brand-300 hover:text-brand-700 sm:flex"
      >
        عرض الكل <ChevronLeft className="h-4 w-4 transition-transform duration-200 group-hover:-translate-x-1" />
      </Link>
    </div>
  );
}

function MiniStat({ icon, value, label }: { icon: React.ReactNode; value: string; label: string }) {
  return (
    <div className="flex flex-col items-center gap-1 lg:items-start">
      {icon}
      <p className="font-cairo text-lg font-black text-slate-900">{value}</p>
      <p className="text-[11px] font-bold text-slate-500">{label}</p>
    </div>
  );
}

const STEPS = [
  {
    icon: <Users className="h-7 w-7" />,
    title: "أنشئ حسابك مجاناً",
    desc: "سجّل حسابك في ثوانٍ، خصّص اسم متجرك، وأضف رقم هاتفك +218 ليصل إليك المشترون مباشرة.",
  },
  {
    icon: <PlusCircle className="h-7 w-7" />,
    title: "انشر صور منتجك",
    desc: "ارفع صوراً واضحة، حدّد السعر والمدينة، وفعّل التفاوض إذا أردت.",
  },
  {
    icon: <MessageCircle className="h-7 w-7" />,
    title: "تفاوض واتفق",
    desc: "استقبل الرسائل في دردشة فورية، تفاوض على السعر، وتحقق صفقتك بأمان.",
  },
];

function HowItWorks() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-16 lg:px-6">
      <div className="text-center">
        <span className="mx-auto grid h-12 w-12 place-items-center rounded-2xl bg-brand-50 text-brand-600">
          <Sparkles className="h-6 w-6" />
        </span>
        <h2 className="font-cairo mt-4 text-3xl font-extrabold text-slate-900">كيف يعمل زيرو ستور؟</h2>
        <p className="mx-auto mt-2 max-w-xl text-sm font-bold text-slate-500">
          ثلاث خطوات بسيطة تفصلك عن تحقيق أول صفقة
        </p>
      </div>
      <div className="mt-12 grid gap-6 md:grid-cols-3">
        {STEPS.map((s, i) => (
          <Reveal key={s.title} delay={i * 0.06}>
            <div className="group relative h-full overflow-hidden rounded-xl border border-slate-200 bg-white p-6 transition duration-300 hover:border-brand-200 hover:shadow-md hover:shadow-brand-900/5">
              <span className="font-cairo absolute left-4 top-4 grid h-8 w-8 place-items-center rounded-full bg-slate-100 text-sm font-extrabold text-slate-500">
                {i + 1}
              </span>
              <div className="relative grid h-12 w-12 place-items-center rounded-xl bg-brand-600 text-white shadow-sm">
                {s.icon}
              </div>
              <h3 className="font-cairo relative mt-5 text-lg font-extrabold text-slate-900">{s.title}</h3>
              <p className="relative mt-2 text-sm font-medium leading-7 text-slate-500">{s.desc}</p>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

function PromoVideo() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-14 lg:px-6">
      <Reveal>
        <div className="text-center">
          <span className="mx-auto grid h-12 w-12 place-items-center rounded-xl bg-brand-50 text-brand-700">
            <PlayCircle className="h-6 w-6" />
          </span>
          <h2 className="font-cairo mt-4 text-3xl font-extrabold text-slate-900">شاهد قصة زيرو ستور</h2>
          <p className="mx-auto mt-2 max-w-xl text-sm font-bold text-slate-500">
            دقيقة واحدة — اعرض، تفاوض، واربح في أول سوق ليبي مفتوح بلا عمولة
          </p>
        </div>
      </Reveal>

      <Reveal delay={0.06}>
        <div className="relative mx-auto mt-10 max-w-5xl overflow-hidden rounded-[2rem] border border-slate-200 bg-ink shadow-2xl shadow-brand-900/20">
          <video
            src="/video/zero-promo.mp4"
            autoPlay
            loop
            muted
            playsInline
            controls
            preload="auto"
            className="aspect-video w-full object-cover"
            aria-label="الفيديو الترويجي لزيرو ستور"
          />
        </div>
      </Reveal>
    </section>
  );
}

function CTABanner() {
  return (
    <section className="mx-auto max-w-7xl px-4 pb-20 lg:px-6">
      <Reveal>
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-l from-brand-800 via-brand-700 to-brand-600 px-6 py-16 text-center text-white shadow-xl shadow-brand-900/20 sm:px-16">
          <div className="pointer-events-none absolute -end-20 -top-20 h-60 w-60 rounded-full bg-white/10 blur-3xl" />
          <div className="relative">
            <h2 className="font-cairo text-3xl font-extrabold sm:text-4xl">جاهز تبيع في ليبيا؟ ابدأ الآن 🇱🇾</h2>
            <p className="mx-auto mt-4 max-w-xl text-sm font-medium leading-8 text-white/80 sm:text-base">
              أنشئ حسابك على زيرو ستور، جهّز متجرك، وانشر أول إعلان بالدينار من أي مدينة — كله مجاني وبدون عمولة.
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Link
                href="/post"
                className="flex items-center gap-2 rounded-xl bg-white px-8 py-4 text-base font-extrabold text-brand-700 shadow-lg transition hover:bg-brand-50"
              >
                <ArrowLeft className="h-5 w-5" />
                أنشئ حسابك وابدأ
              </Link>
              <Link
                href="/listings"
                className="flex items-center gap-2 rounded-xl border border-white/30 bg-white/10 px-8 py-4 text-base font-extrabold text-white backdrop-blur transition hover:bg-white/20"
              >
                <ShoppingBag className="h-5 w-5" />
                تسوّق من كل ليبيا
              </Link>
            </div>
          </div>
        </div>
      </Reveal>
    </section>
  );
}