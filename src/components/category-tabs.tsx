"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { CATEGORIES, type Category } from "@/lib/categories";

function Tab({
  href,
  label,
  emoji,
  active,
}: {
  href: string;
  label: string;
  emoji: string;
  active: boolean;
}) {
  return (
    <Link
      href={href}
      aria-current={active ? "page" : undefined}
      className={`group relative shrink-0 rounded-lg p-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500/40`}
    >
      {active && (
        <motion.span
          layoutId="category-active-pill"
          className="absolute inset-0 rounded-lg bg-brand-600 shadow-sm"
          transition={{ type: "spring", stiffness: 420, damping: 34 }}
        />
      )}
      <span
        className={`relative flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-bold transition ${
          active
            ? "text-white"
            : "border border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:text-slate-900 hover:shadow-sm"
        }`}
      >
        <span
          className={`grid h-8 w-8 shrink-0 place-items-center rounded-lg text-lg leading-none ${
            active ? "bg-white/15" : "bg-slate-50"
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
      <Tab href="/listings" label="الكل" emoji="🛍️" active={!active} />
      {CATEGORIES.map((c: Category) => (
        <Tab
          key={c.slug}
          href={`/listings?category=${c.slug}`}
          label={c.name}
          emoji={c.emoji}
          active={active === c.slug}
        />
      ))}
    </div>
  );
}
