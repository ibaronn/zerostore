import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Store, MapPin, CalendarDays, BadgeCheck, Package, MessageCircle, ShieldCheck } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { imageList } from "@/lib/images";
import { formatDate } from "@/lib/format";
import ListingCard, { type ListingCardData } from "@/components/listing-card";

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  const user = await prisma.user.findUnique({ where: { id: params.id } });
  if (!user) return { title: "غير موجود | ZERO STORE" };
  return { title: `${user.storeName || user.name} | ZERO STORE` };
}

export default async function PublicProfilePage({ params }: { params: { id: string } }) {
  const seller = await prisma.user.findUnique({
    where: { id: params.id },
    select: { id: true, name: true, avatar: true, storeName: true, bio: true, city: true, banner: true, createdAt: true },
  });
  if (!seller) notFound();

  const [activeCount, soldCount, listings] = await Promise.all([
    prisma.listing.count({ where: { userId: seller.id, status: "active" } }),
    prisma.listing.count({ where: { userId: seller.id, status: "sold" } }),
    prisma.listing.findMany({
      where: { userId: seller.id, status: "active" },
      include: { user: { select: { id: true, name: true, avatar: true, storeName: true } } },
      orderBy: { createdAt: "desc" },
      take: 24,
    }),
  ]);

  return (
    <>
      <section className="border-b border-slate-200/70 bg-white">
        <div className="relative h-36 overflow-hidden bg-gradient-to-l from-brand-700 via-brand-500 to-brand-600 sm:h-44">
          <div className="grid-lines h-full w-full opacity-30" />
          {seller.banner && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={seller.banner} alt="" className="h-full w-full object-cover" />
          )}
        </div>
        <div className="mx-auto -mt-14 max-w-7xl px-4 pb-6 lg:px-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div className="flex items-end gap-4">
              <span className="grid h-28 w-28 shrink-0 place-items-center overflow-hidden rounded-3xl bg-gradient-to-br from-brand-500 to-brand-700 text-4xl font-black text-white ring-4 ring-white shadow-lg shadow-brand-900/10">
                {seller.avatar ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={seller.avatar} alt="" className="h-full w-full object-cover" />
                ) : (
                  seller.name.charAt(0)
                )}
              </span>
              <div className="pb-1">
                <h1 className="font-cairo flex items-center gap-2 text-2xl font-black text-slate-900 sm:text-3xl">
                  {seller.storeName || seller.name}
                  <BadgeCheck className="h-6 w-6 text-brand-500" />
                </h1>
                <p className="mt-1 line-clamp-1 text-sm font-bold text-slate-500">
                  {seller.bio || "أهلاً بك في متجري — تصفح إعلاناتي وتواصل معي مباشرة."}
                </p>
                <div className="mt-2 flex flex-wrap items-center gap-4 text-xs font-bold text-slate-500">
                  {seller.city && (
                    <span className="flex items-center gap-1">
                      <MapPin className="h-3.5 w-3.5 text-brand-500" /> {seller.city}
                    </span>
                  )}
                  <span className="flex items-center gap-1">
                    <CalendarDays className="h-3.5 w-3.5" /> عضو منذ {formatDate(seller.createdAt)}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <span className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-2.5 shadow-sm">
                <Package className="h-4 w-4 text-brand-600" />
                <div className="leading-tight">
                  <p className="font-cairo text-sm font-black text-slate-800">{activeCount} إعلان</p>
                  <p className="text-[11px] font-bold text-slate-400">منشور الآن</p>
                </div>
              </span>
              <span className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-2.5 shadow-sm">
                <ShieldCheck className="h-4 w-4 text-emerald-600" />
                <div className="leading-tight">
                  <p className="font-cairo text-sm font-black text-slate-800">{soldCount} صفقة</p>
                  <p className="text-[11px] font-bold text-slate-400">تمت بنجاح</p>
                </div>
              </span>
              <Link
                href={`/listings?city=${encodeURIComponent(seller.city || "")}`}
                className="flex items-center gap-2 rounded-2xl bg-brand-600 px-4 py-2.5 text-sm font-black text-white shadow-sm transition hover:bg-brand-700"
              >
                <Store className="h-4 w-4" />
                تصفح من {seller.city || "المتجر"}
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-10 lg:px-6">
        <div className="mb-6 flex items-end justify-between gap-4">
          <div>
            <p className="flex items-center gap-2 text-brand-600">
              <Package className="h-5 w-5" />
            </p>
            <h2 className="font-cairo mt-2 text-2xl font-black text-slate-900">إعلانات المتجر</h2>
            <p className="mt-1 text-sm font-bold text-slate-500">كل ما يعرضه {seller.storeName || seller.name} الآن</p>
          </div>
        </div>

        {listings.length === 0 ? (
          <div className="grid place-items-center rounded-3xl border border-slate-200/80 bg-white px-6 py-20 text-center shadow-sm">
            <div className="grid h-20 w-20 place-items-center rounded-full bg-slate-100 text-slate-400">
              <MessageCircle className="h-9 w-9" />
            </div>
            <h3 className="font-cairo mt-5 text-xl font-extrabold text-slate-800">لا توجد إعلانات منشورة حالياً</h3>
            <p className="mt-2 max-w-md text-sm font-bold text-slate-500">
              عد لاحقاً — {seller.storeName || seller.name} قد يجدد إعلاناته قريباً.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {listings.map((l) => (
              <ListingCard key={l.id} listing={toCard(l as never)} isFavorite={false} />
            ))}
          </div>
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