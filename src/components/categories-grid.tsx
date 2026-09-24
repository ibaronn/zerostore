import Link from "next/link";
import { CATEGORIES, type Category } from "@/lib/categories";

export default function CategoriesGrid() {
  return (
    <div className="scrollbar-hide -mx-4 grid grid-flow-col auto-cols-[minmax(96px,1fr)] gap-3 overflow-x-auto px-4 pb-2 lg:mx-0 lg:grid-cols-7 lg:grid-flow-row lg:overflow-visible lg:px-0">
      {CATEGORIES.map((c: Category) => {
        return (
          <Link
            key={c.slug}
            href={`/listings?category=${c.slug}`}
            className="group flex shrink-0 flex-col items-center gap-2 rounded-xl border border-slate-200 bg-white px-2 py-4 text-center transition duration-200 hover:border-brand-300 hover:bg-brand-50/40 hover:shadow-sm"
          >
            <span
              className={`grid h-12 w-12 place-items-center rounded-xl bg-gradient-to-br ${c.gradient} text-2xl leading-none shadow-sm`}
            >
              <span aria-hidden>{c.emoji}</span>
            </span>
            <span className="text-xs font-semibold leading-4 text-slate-700 transition group-hover:text-brand-700">
              {c.name}
            </span>
          </Link>
        );
      })}
    </div>
  );
}