import Link from "next/link";
import { CATEGORIES } from "@/lib/categories";

export default function CategoryTabs({ active }: { active?: string }) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
      <Link
        href="/listings"
        className={`shrink-0 rounded-xl px-4 py-2 text-sm font-black transition ${
          !active
            ? "bg-brand-600 text-white shadow-sm"
            : "border border-slate-200 bg-white text-slate-600 hover:border-brand-300 hover:text-brand-700"
        }`}
      >
        الكل
      </Link>
      {CATEGORIES.map((c) => (
        <Link
          key={c.slug}
          href={`/listings?category=${c.slug}`}
          className={`shrink-0 rounded-xl px-4 py-2 text-sm font-black transition ${
            active === c.slug
              ? "bg-brand-600 text-white shadow-sm"
              : "border border-slate-200 bg-white text-slate-600 hover:border-brand-300 hover:text-brand-700"
          }`}
        >
          {c.name}
        </Link>
      ))}
    </div>
  );
}