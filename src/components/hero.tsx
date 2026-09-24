"use client";

import { useRef } from "react";
import Link from "next/link";
import { motion, useReducedMotion, useScroll, useSpring, useTransform } from "framer-motion";
import { MessageCircle, Phone, Wallet, BadgeCheck } from "lucide-react";
import HomeSearch from "@/components/home-search";

type HeroItem = {
  id: string;
  images: string[];
  price: number;
};

export default function Hero({ showcase, count }: { showcase: HeroItem[]; count: number }) {
  const ref = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const progress = useSpring(scrollYProgress, { stiffness: 90, damping: 22, mass: 0.4 });

  const titleY = useTransform(progress, [0, 1], [0, reduced ? 0 : 80]);
  const titleOpacity = useTransform(progress, [0, 0.6], [1, 0]);
  const gridY = useTransform(progress, [0, 1], [0, reduced ? 0 : -50]);

  const [a, b] = [
    showcase[0]?.images[0],
    showcase[1]?.images[0] ?? showcase[0]?.images[1],
  ];

  return (
    <section ref={ref} className="relative overflow-hidden bg-slate-950 text-white">
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <video
          src="/video/zero-promo.mp4"
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
          className="h-full w-full object-cover opacity-40"
        />
        <div className="absolute inset-0 bg-gradient-to-l from-slate-950/95 via-slate-950/85 to-slate-950/55" />
        <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-slate-950 to-transparent" />
      </div>

      <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-4 pb-14 pt-12 lg:grid-cols-[1.15fr_0.85fr] lg:gap-14 lg:pb-20 lg:pt-20">
        <motion.div style={{ y: titleY, opacity: titleOpacity }} className="text-center lg:text-start">
          <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-1.5 text-xs font-bold text-white/85 backdrop-blur">
            <BadgeCheck className="h-4 w-4 text-teal-300" />
            أول سوق ليبي مفتوح — بلا عمولة نهائياً 🇱🇾
          </span>

          <h1 className="font-cairo mt-6 text-[2.6rem] font-black leading-[1.08] tracking-tight sm:text-6xl lg:text-[4.1rem]">
            اعرض منتجك، تفاوض، <span className="text-teal-300">واربح أسرع</span>
          </h1>

          <p className="mx-auto mt-5 max-w-xl text-base font-medium leading-8 text-white/60 sm:text-lg lg:mx-0">
            زيرو ستور يمنحك متجراً رقمياً من قلب ليبيا — اعرض منتجك من أي مدينة،
            سعّر بالدينار الليبي، وتفاوض مع المشترين عبر دردشة فورية.
          </p>

          <div className="mt-8">
            <HomeSearch />
          </div>

          <div className="mt-10 grid max-w-md grid-cols-3 gap-4 text-center max-lg:mx-auto lg:max-w-none lg:text-start">
            <MiniStat icon={<Wallet className="h-5 w-5 text-teal-300" />} value="0 د.ل" label="عمولة البيع" />
            <MiniStat icon={<MessageCircle className="h-5 w-5 text-teal-300" />} value="دردشة" label="تفاوض فوري" />
            <MiniStat icon={<Phone className="h-5 w-5 text-teal-300" />} value="+218" label="رقمك في متجرك" />
          </div>
          <p className="mt-4 text-xs font-medium text-white/40 lg:mt-5">
            {count}+ إعلان نشط في السوق الآن • من كل المدن الليبية
          </p>

          {showcase.some((s) => s.images[0]) && (
            <div className="mt-8 flex gap-3 overflow-x-auto pb-1 lg:hidden [scrollbar-width:none]">
              {showcase.map(
                (s) =>
                  s.images[0] && (
                    <Link
                      key={s.id}
                      href={`/listings/${s.id}`}
                      className="group relative shrink-0 overflow-hidden rounded-xl border border-white/10 bg-white shadow-md ring-1 ring-black/5"
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={s.images[0]}
                        alt=""
                        loading="lazy"
                        className="aspect-[4/5] w-24 object-cover transition duration-300 group-hover:scale-105"
                      />
                      <span className="absolute bottom-1.5 start-1.5 rounded-lg bg-slate-900/80 px-1.5 py-0.5 font-cairo text-xs font-bold text-white backdrop-blur">
                        {formatNum(s.price)} د.ل
                      </span>
                    </Link>
                  )
              )}
            </div>
          )}
        </motion.div>

        <motion.div style={{ y: gridY }} className="relative mx-auto hidden h-[30rem] w-full max-w-md lg:block">
          <div className="absolute start-6 top-0 w-60 overflow-hidden rounded-2xl border border-white/10 bg-white shadow-2xl shadow-black/40">
            {a ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={a} alt="" loading="lazy" className="aspect-[4/5] w-full object-cover" />
            ) : (
              <Placeholder />
            )}
          </div>

          <div className="absolute bottom-0 end-4 w-64 overflow-hidden rounded-2xl border border-white/10 bg-white shadow-2xl shadow-black/40">
            {b ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={b} alt="" loading="lazy" className="aspect-[4/5] w-full object-cover" />
            ) : (
              <Placeholder />
            )}
            <div className="flex items-center justify-between border-t border-slate-100 px-3.5 py-3">
              <span className="font-cairo text-sm font-extrabold text-slate-900">
                {showcase[1]?.price !== undefined ? `${formatNum(showcase[1].price)} د.ل` : "زيرو ستور"}
              </span>
              <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-700">
                متاح الآن
              </span>
            </div>
          </div>

          <div className="absolute -end-2 top-12 flex items-center gap-1.5 rounded-full bg-amber-400 px-3.5 py-2 text-xs font-extrabold text-slate-900 shadow-lg shadow-amber-500/30">
            <Wallet className="h-4 w-4" />
            صفر عمولة
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function Placeholder() {
  return (
    <div className="grid aspect-[4/5] w-full place-items-center bg-slate-800 text-xs font-bold text-slate-400">
      ZERO STORE
    </div>
  );
}

function MiniStat({ icon, value, label }: { icon: React.ReactNode; value: string; label: string }) {
  return (
    <div className="flex flex-col items-center gap-1 lg:items-start">
      {icon}
      <p className="font-cairo text-lg font-extrabold text-white">{value}</p>
      <p className="text-[11px] font-medium text-white/55">{label}</p>
    </div>
  );
}

function formatNum(n: number) {
  return Math.round(n).toLocaleString("en-US");
}