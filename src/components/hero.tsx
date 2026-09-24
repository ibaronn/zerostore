"use client";

import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useSpring, useTransform } from "framer-motion";
import { ShoppingBag, MessageCircle, Phone, Wallet, Users, ShieldCheck, BadgeCheck } from "lucide-react";
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

  const titleY = useTransform(progress, [0, 1], [0, reduced ? 0 : 110]);
  const titleOpacity = useTransform(progress, [0, 0.65], [1, 0]);
  const orbsY = useTransform(progress, [0, 1], [0, reduced ? 0 : -150]);
  const gridY = useTransform(progress, [0, 1], [0, reduced ? 0 : -70]);
  const gridRotate = useTransform(progress, [0, 1], [0, reduced ? 0 : 4]);

  const [a, b, c] = [
    showcase[0]?.images[0],
    showcase[1]?.images[0] ?? showcase[0]?.images[1],
    showcase[2]?.images[0],
  ];

  return (
    <section ref={ref} className="relative overflow-hidden bg-gradient-to-b from-brand-50 via-[#f4f8f6] to-[#f4f6f5] text-slate-900">
      <motion.div
        style={{ y: orbsY }}
        className="pointer-events-none absolute -top-24 start-[8%] h-80 w-80 rounded-full bg-brand-200/40 blur-3xl"
      />
      <motion.div
        style={{ y: orbsY }}
        className="pointer-events-none absolute -bottom-24 end-[4%] h-72 w-72 rounded-full bg-teal-300/30 blur-3xl"
      />

      <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-4 pb-16 pt-12 lg:grid-cols-2 lg:pb-20 lg:pt-16">
        <motion.div style={{ y: titleY, opacity: titleOpacity }} className="text-center lg:text-start">
          <span className="inline-flex items-center gap-2 rounded-full border border-brand-200 bg-white/80 px-4 py-1.5 text-xs font-bold text-brand-700 shadow-sm">
            <BadgeCheck className="h-4 w-4 text-brand-600" />
            أول سوق ليبي مفتوح 🇱🇾 — بلا عمولة نهائياً
          </span>

          <h1 className="font-cairo mt-5 text-4xl font-black leading-[1.15] sm:text-5xl">
            اعرض منتجك، <span className="text-gradient">تفاوض</span> واربح أسرع
          </h1>

          <p className="mx-auto mt-4 max-w-xl text-base font-bold leading-8 text-slate-500 sm:text-lg lg:mx-0">
            زيرو ستور يمنحك متجراً رقمياً من قلب ليبيا — اعرض منتجك من أي مدينة،
            سعّر بالدينار الليبي، وتفاوض مع المشترين عبر دردشة فورية.
          </p>

          <div className="mt-7">
            <HomeSearch />
          </div>

          <div className="mt-9 grid max-w-md grid-cols-3 gap-3 text-center max-lg:mx-auto lg:max-w-none lg:text-start">
            <MiniStat icon={<Wallet className="h-5 w-5 text-emerald-600" />} value="0 د.ل" label="عمولة البيع" />
            <MiniStat icon={<MessageCircle className="h-5 w-5 text-brand-600" />} value="دردشة" label="تفاوض فوري" />
            <MiniStat icon={<Phone className="h-5 w-5 text-brand-700" />} value="+218" label="رقمك في متجرك" />
          </div>
        </motion.div>

        <motion.div style={{ y: gridY, rotate: gridRotate }} className="relative mx-auto hidden w-full max-w-lg lg:block">
          <motion.div
            initial={{ opacity: 0, y: 46 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: 0.15 }}
            className="grid grid-cols-2 gap-4"
          >
            <div className="space-y-4 pt-10">
              <ShowcaseTile src={a} className="aspect-[4/5] rounded-3xl" price={showcase[0]?.price} />
              {c && <ShowcaseTile src={c} className="aspect-[4/3] rounded-3xl" price={showcase[2]?.price} />}
            </div>
            <div className="mt-6 space-y-4">
              <ShowcaseTile src={b} className="aspect-[3/4] rounded-3xl" price={showcase[1]?.price} />
              <div className="flex items-center gap-3 rounded-2xl border border-brand-100 bg-white/90 px-4 py-3 shadow-lg shadow-brand-900/5">
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-brand-50 text-brand-700">
                  <Users className="h-5 w-5" />
                </span>
                <div>
                  <p className="font-cairo text-sm font-black text-slate-900">
                    {count}+ إعلان نشط في السوق
                  </p>
                  <p className="text-xs font-bold text-slate-500">من كل المدن الليبية</p>
                </div>
              </div>
              <div className="flex items-center gap-3 rounded-2xl border border-emerald-100 bg-white/90 px-4 py-3 shadow-lg shadow-brand-900/5">
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-emerald-50 text-emerald-600">
                  <ShieldCheck className="h-5 w-5" />
                </span>
                <div>
                  <p className="font-cairo text-sm font-black text-slate-900">بائع معتمد</p>
                  <p className="text-xs font-bold text-slate-500">رقم هاتف +218 في المتجر</p>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

function ShowcaseTile({
  src,
  className,
  price,
}: {
  src?: string;
  className: string;
  price?: number;
}) {
  return (
    <div className={`group relative overflow-hidden ${className} border border-white/60 bg-white shadow-xl shadow-brand-900/10`}>
      {src ? (
        <img
          src={src}
          alt=""
          loading="lazy"
          className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
        />
      ) : (
        <div className="grid h-full w-full place-items-center bg-gradient-to-br from-brand-600 to-brand-800">
          <ShoppingBag className="h-10 w-10 text-white/60" />
        </div>
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 transition duration-300 group-hover:opacity-100" />
      {price !== undefined && (
        <span className="absolute bottom-3 start-3 rounded-xl bg-ink/70 px-3 py-1.5 font-cairo text-sm font-black text-white backdrop-blur">
          {formatNum(price)} د.ل
        </span>
      )}
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

function formatNum(n: number) {
  return Math.round(n).toLocaleString("en-US");
}