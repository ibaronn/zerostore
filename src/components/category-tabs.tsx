"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { CATEGORIES, type Category } from "@/lib/categories";

const ALL_GRADIENT = "from-brand-600 via-brand-500 to-emerald-500";

function Tab({
  href,
  label,
  emoji,
  gradient,
  active,
}: {
  href: string;
  label: string;
  emoji: string;
  gradient: string;
  active: boolean;
}) {
  return (
    <Link
      href={href}
      aria-current={active ? "page" : undefined}
      className={`group relative shrink-0 rounded-2xl p-1 transition-transform duration-200 hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500/40`}
    >
      {active && (
        <motion.span
          layoutId="category-active-pill"
          className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${gradient} shadow-md shadow-brand-900/15`}
          transition={{ type: "spring", stiffness: 420, damping: 32 }}
        />
      )}
      <span
        className={`relative flex items-center gap-2 rounded-[14px] px-3 py-2 text-sm font-black transition ${
          active
            ? "text-white"
            : "border border-slate-200 bg-white text-slate-600 group-hover:border-slate-300 group-hover:text-slate-900 group-hover:shadow-sm"
        }`}
      >
        <span
          className={`grid h-9 w-9 shrink-0 place-items-center rounded-xl text-lg leading-none transition-transform duration-300 group-hover:-rotate-6 group-hover:scale-110 ${
            active ? `bg-white/20 ${label === "الكل" ? "" : "animate-floaty"}` : `bg-gradient-to-br ${gradient} shadow-sm`
          }`}
        >
          <span aria-hidden>{emoji}</span>
        </span>
        <span className="whitespace-nowrap">{label}</span>
      </span>
    </Link>
  );
}

export default function CategoryTabs({ active }: { active?: string }) {
  return (
    <div className="scrollbar-hide -mx-4 flex gap-2.5 overflow-x-auto px-4 pb-2 lg:mx-0 lg:px-0">
      <Tab href="/listings" label="الكل" emoji="🛍️" gradient={ALL_GRADIENT} active={!active} />
      {CATEGORIES.map((c: Category) => (
        <Tab
          key={c.slug}
          href={`/listings?category=${c.slug}`}
          label={c.name}
          emoji={c.emoji}
          gradient={c.gradient}
          active={active === c.slug}
        />
      ))}
    </div>
  );
}
