import Link from "next/link";
import { SearchX, ChevronRight, ChevronLeft, Store } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { imageList } from "@/lib/images";
import Filters from "@/components/filters";
import CategoryTabs from "@/components/category-tabs";
import ListingCard, { type ListingCardData } from "@/components/listing-card";
import { categoryBySlug } from "@/lib/categories";

export const metadata = { title: "السوق | ZERO STORE" };

const PER_PAGE = 24;

type SP = Record<string, string | string[] | undefined>;

function s(v: string | string[] | undefined) {
  return typeof v === "string" ? v : "";
}

export default async function ListingsPage({ searchParams }: { searchParams: SP }) {
  const q = s(searchParams.q).trim();
  const category = s(searchParams.category);
  const city = s(searchParams.city);
  const min = Number(s(searchParams.min)) || undefined;
  const max = Number(s(searchParams.max)) || undefined;
  const sort = s(searchParams.sort) || "new";
  const page = Math.max(1, Number(s(searchParams.page)) || 1);

  const where: Record<string, unknown> = { status: "active" };
  if (q) where.title = { contains: q };
  if (category) where.category = category;
  if (city) where.city = city;
  if (min !== undefined) where.price = { ...(where.price as object), gte: min };
  if (max !== undefined) where.price = { ...(where.price as object), lte: max };

  const orderBy =
    sort === "price_asc"
      ? { price: "asc" as const }
      : sort === "price_desc"
        ? { price: "desc" as const }
        : sort === "views"
          ? { views: "desc" as const }
          : { createdAt: "desc" as const };

  const [listings, total] = await Promise.all([
    prisma.listing.findMany({
      where,
      include: { user: { select: { id: true, name: true, avatar: true, storeName: true } } },
      orderBy,
      skip: (page - 1) * PER_PAGE,
      take: PER_PAGE,
    }),
    prisma.listing.count({ where }),
  ]);

  const pages = Math.max(1, Math.ceil(total / PER_PAGE));
  const cat = categoryBySlug(category);

  const makeQuery = (patch: Record<string, string | number | undefined>) => {
    const p = new URLSearchParams();
    const merged = { q, category, city, min, max, sort, ...patch };
    Object.entries(merged).forEach(([k, v]) => {
      if (v !== undefined && v !== "" && v !== null) p.set(k, String(v));
    });
    return `?${p.toString()}`;
  };

  return (
    <>
      <section className="relative overflow-hidden border-b border-slate-200/70 bg-gradient-to-b from-brand-50 to-[#f4f6f5] py-12 text-slate-900">
        <div className="pointer-events-none absolute -top-24 start-1/3 h-64 w-64 rounded-full bg-brand-200/40 blur-3xl" />
        <div className="relative mx-auto max-w-7xl px-4 lg:px-6">
          <p className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-brand-600">
            <Store className="h-4 w-4" />
            {total.toLocaleString("en-US")} إعلان متاح الآن
          </p>
          <h1 className="font-cairo mt-2 text-3xl font-black sm:text-4xl">
            {q ? (
              <>
                نتائج البحث عن «<span className="text-gradient">{q}</span>»
              </>
            ) : cat ? (
              <>
                قسم <span className="text-gradient">{cat.name}</span>
              </>
            ) : (
              <>
                سوق <span className="text-gradient">زيرو ستور</span> المفتوح
              </>
            )}
          </h1>
          <p className="mt-3 max-w-2xl text-sm font-bold text-slate-500">
            تصفح، فلاتر، تفاوض — كل ما تحتاجه لتعثر على صفقتك أو تبيع منتجك بسرعة.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-10 lg:px-6">
        <Filters />

        <div className="mt-6">
          <CategoryTabs active={category || undefined} />
        </div>

        <div className="mt-8 flex items-center justify-between gap-3">
          <p className="text-sm font-black text-slate-700">
            {total.toLocaleString("en-US")} <span className="font-bold text-slate-400">إعلان</span>
          </p>
          {cat && (
            <span className="rounded-full bg-brand-50 px-3 py-1 text-xs font-black text-brand-700">
              {cat.name}
            </span>
          )}
        </div>

        {listings.length === 0 ? (
          <div className="mt-6 grid place-items-center rounded-3xl border border-slate-200/80 bg-white px-6 py-24 text-center shadow-sm">
            <div className="grid h-20 w-20 place-items-center rounded-full bg-slate-100 text-slate-400">
              <SearchX className="h-10 w-10" />
            </div>
            <h3 className="font-cairo mt-5 text-xl font-extrabold text-slate-800">لا توجد نتائج مطابقة</h3>
            <p className="mt-2 max-w-md text-sm font-bold text-slate-500">
              جرّب تغيير كلمات البحث أو إزالة بعض الفلاتر للعثور على المزيد.
            </p>
            <Link
              href="/listings"
              className="mt-6 rounded-2xl bg-brand-600 px-8 py-3 text-sm font-black text-white shadow-sm transition hover:bg-brand-700"
            >
              مسح الفلاتر
            </Link>
          </div>
        ) : (
          <>
            <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {listings.map((l) => (
                <ListingCard
                  key={l.id}
                  listing={toCard(l as never)}
                  isFavorite={false}
                />
              ))}
            </div>

            {pages > 1 && (
              <div className="mt-12 flex items-center justify-center gap-2">
                {page > 1 && (
                  <PagerLink href={`/listings${makeQuery({ page: page - 1 })}`} label="السابق">
                    <ChevronRight className="h-4 w-4" />
                    السابق
                  </PagerLink>
                )}
                {Array.from({ length: pages }, (_, i) => i + 1)
                  .filter((p) => Math.abs(p - page) <= 2 || p === 1 || p === pages)
                  .map((p, i, arr) => (
                    <span key={p} className="flex items-center gap-2">
                      {i > 0 && arr[i - 1] !== p - 1 && <span className="text-slate-400">…</span>}
                      <PagerLink href={`/listings${makeQuery({ page: p })}`} label={`صفحة ${p}`} active={p === page}>
                        {p}
                      </PagerLink>
                    </span>
                  ))}
                {page < pages && (
                  <PagerLink href={`/listings${makeQuery({ page: page + 1 })}`} label="التالي">
                    التالي
                    <ChevronLeft className="h-4 w-4" />
                  </PagerLink>
                )}
              </div>
            )}
          </>
        )}
      </section>
    </>
  );
}

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

function PagerLink({
  href,
  children,
  label,
  active = false,
}: {
  href: string;
  children: React.ReactNode;
  label: string;
  active?: boolean;
}) {
  return (
    <Link
      href={href}
      aria-label={label}
      className={`flex h-11 min-w-11 items-center justify-center gap-1 rounded-xl px-3 text-sm font-black transition ${
        active
          ? "bg-brand-600 text-white shadow-sm"
          : "border border-slate-200 bg-white text-slate-700 hover:border-brand-300 hover:text-brand-700"
      }`}
    >
      {children}
    </Link>
  );
}