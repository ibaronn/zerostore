import Link from "next/link";
import { CATEGORIES, type Category } from "@/lib/categories";

export default function CategoriesGrid() {
  return (
    <div className="scrollbar-hide -mx-4 grid grid-flow-col auto-cols-[minmax(96px,1fr)] gap-3 overflow-x-auto px-4 pb-2 lg:mx-0 lg:grid-cols-7 lg:grid-flow-row lg:overflow-visible lg:px-0">
      {CATEGORIES.map((c: Category) => {
        const Icon = c.icon;
        return (
          <Link
            key={c.slug}
            href={`/listings?category=${c.slug}`}
            className="group flex shrink-0 flex-col items-center gap-2.5 rounded-2xl border border-slate-200/80 bg-white px-2 py-4 text-center shadow-sm transition duration-300 hover:-translate-y-1 hover:border-brand-300 hover:shadow-lg hover:shadow-brand-900/10"
          >
            <span
              className={`grid h-11 w-11 place-items-center rounded-xl bg-gradient-to-br ${c.gradient} text-white shadow-sm transition duration-300 group-hover:scale-110`}
            >
              <Icon className="h-5 w-5" />
            </span>
            <span className="text-xs font-extrabold leading-4 text-slate-700 transition group-hover:text-brand-700">
              {c.name}
            </span>
          </Link>
        );
      })}
    </div>
  );
}