import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { MapPin, Eye, BadgeCheck, CalendarDays, Store, ShieldCheck, PackageOpen } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { imageList } from "@/lib/images";
import { getCurrentUser } from "@/lib/auth";
import { money, formatDate } from "@/lib/format";
import { categoryBySlug, conditionLabel } from "@/lib/categories";
import ListingGallery from "@/components/listing-gallery";
import FavoriteButton from "@/components/favorite-button";
import ShareButton from "@/components/share-button";
import StartChatButton from "@/components/start-chat-button";
import PhoneReveal from "@/components/phone-reveal";
import ListingCard, { type ListingCardData } from "@/components/listing-card";

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  const listing = await prisma.listing.findUnique({ where: { id: params.id } });
  if (!listing) return { title: "غير موجود | ZERO STORE" };
  return {
    title: `${listing.title} | ZERO STORE`,
    description: listing.description.slice(0, 160),
  };
}

export default async function ListingDetailPage({ params }: { params: { id: string } }) {
  const listing = await prisma.listing.findUnique({
    where: { id: params.id },
    include: { user: { select: { id: true, name: true, avatar: true, storeName: true, phone: true, city: true, bio: true, createdAt: true } } },
  });
  if (!listing || listing.status !== "active") notFound();

  const me = await getCurrentUser();

  if (!me || me.id !== listing.userId) {
    prisma.listing.update({ where: { id: listing.id }, data: { views: { increment: 1 } } }).catch(() => undefined);
  }

  let isFavorite = false;
  if (me) {
    const fav = await prisma.favorite.findUnique({
      where: { userId_listingId: { userId: me.id, listingId: listing.id } },
    });
    isFavorite = !!fav;
  }

  const related = await prisma.listing.findMany({
    where: { status: "active", category: listing.category, id: { not: listing.id } },
    include: { user: { select: { id: true, name: true, avatar: true, storeName: true } } },
    orderBy: { createdAt: "desc" },
    take: 4,
  });

  const images = imageList(listing.images);
  const cat = categoryBySlug(listing.category);
  const seller = listing.user;

  return (
    <>
      <section className="mx-auto max-w-7xl px-4 py-8 lg:px-6">
        <nav className="mb-6 flex flex-wrap items-center gap-1.5 text-xs font-bold text-slate-400">
          <Link href="/" className="transition hover:text-brand-600">الرئيسية</Link>
          <span>/</span>
          <Link href="/listings" className="transition hover:text-brand-600">السوق</Link>
          {cat && (
            <>
              <span>/</span>
              <Link href={`/listings?category=${cat.slug}`} className="transition hover:text-brand-600">{cat.name}</Link>
            </>
          )}
        </nav>

        <div className="grid gap-8 lg:grid-cols-5">
          <div className="lg:col-span-3">
            <ListingGallery images={images} title={listing.title} />

            <div className="mt-8 rounded-3xl border border-slate-200/80 bg-white p-6 shadow-sm">
              <div className="flex flex-wrap items-center gap-2">
                {listing.featured && (
                  <span className="rounded-full bg-gradient-to-l from-amber-400 to-orange-500 px-3 py-1 text-xs font-black text-white">
                    ⭐ مميز
                  </span>
                )}
                <span className="rounded-full bg-brand-50 px-3 py-1 text-xs font-black text-brand-700">
                  {cat?.name ?? "أخرى"}
                </span>
                <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-black text-slate-600">
                  {conditionLabel(listing.condition)}
                </span>
                {listing.negotiable && (
                  <span className="flex items-center gap-1 rounded-full bg-emerald-50 px-3 py-1 text-xs font-black text-emerald-700">
                    <BadgeCheck className="h-3.5 w-3.5" /> قابل للتفاوض
                  </span>
                )}
              </div>

              <h1 className="font-cairo mt-4 text-2xl font-black leading-relaxed text-slate-900 sm:text-3xl">
                {listing.title}
              </h1>

              <div className="mt-3 flex flex-wrap items-center gap-4 text-sm font-bold text-slate-500">
                <span className="flex items-center gap-1.5">
                  <MapPin className="h-4 w-4 text-brand-500" /> {listing.city}
                </span>
                <span className="flex items-center gap-1.5">
                  <Eye className="h-4 w-4 text-slate-400" /> {listing.views} مشاهدة
                </span>
                <span className="flex items-center gap-1.5">
                  <CalendarDays className="h-4 w-4 text-slate-400" /> {formatDate(listing.createdAt)}
                </span>
              </div>

              <div className="mt-6 border-t border-slate-100 pt-6">
                <h2 className="font-cairo mb-3 font-extrabold text-slate-800">الوصف</h2>
                <p className="whitespace-pre-line text-sm font-bold leading-8 text-slate-600">
                  {listing.description || "لم يضف البائع وصفاً لهذا المنتج."}
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-6 lg:col-span-2">
            <div className="overflow-hidden rounded-3xl border border-slate-200/80 bg-white shadow-sm">
              <div className="p-6">
                <p className="text-xs font-black uppercase tracking-widest text-slate-400">السعر</p>
                <p className="font-cairo mt-2 text-4xl font-black text-slate-900">
                  {money(listing.price)}
                </p>
                {listing.negotiable && (
                  <p className="mt-1 text-xs font-bold text-emerald-600">السعر قابل للتفاوض — راسل البائع</p>
                )}
              </div>
              <div className="space-y-2.5 border-t border-slate-100 p-6 pt-5">
                {me && me.id === seller.id ? (
                  <Link
                    href={`/post?id=${listing.id}`}
                    className="flex w-full items-center justify-center gap-2 rounded-2xl bg-brand-600 px-5 py-3.5 text-base font-black text-white shadow-sm transition hover:bg-brand-700 active:scale-[0.99]"
                  >
                    <PackageOpen className="h-5 w-5" />
                    هذا إعلانك — تعديل
                  </Link>
                ) : me ? (
                  <StartChatButton listingId={listing.id} sellerId={seller.id} />
                ) : (
                  <Link
                    href={`/login?next=/listings/${listing.id}`}
                    className="flex w-full items-center justify-center gap-2 rounded-2xl bg-brand-600 px-5 py-3.5 text-base font-black text-white shadow-sm transition hover:bg-brand-700"
                  >
                    <ShieldCheck className="h-5 w-5" />
                    سجّل دخولك للتفاوض
                  </Link>
                )}
                <div className="flex gap-2.5">
                  <FavoriteButton listingId={listing.id} initial={isFavorite} />
                  <ShareButton title={listing.title} />
                </div>
              </div>
            </div>

            <div className="overflow-hidden rounded-3xl border border-slate-200/80 bg-white shadow-sm">
              <div className="flex items-center gap-4 p-6">
                <Link href={`/profile/${seller.id}`} className="relative shrink-0">
                  <span className="grid h-16 w-16 place-items-center overflow-hidden rounded-2xl bg-gradient-to-br from-brand-500 to-brand-700 text-xl font-black text-white">
                    {seller.avatar ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={seller.avatar} alt="" className="h-full w-full object-cover" />
                    ) : (
                      seller.name.charAt(0)
                    )}
                  </span>
                </Link>
                <div className="min-w-0">
                  <Link href={`/profile/${seller.id}`} className="font-cairo flex items-center gap-1.5 text-lg font-extrabold text-slate-900 transition hover:text-brand-700">
                    <Store className="h-4 w-4 text-brand-500" />
                    <span className="truncate">{seller.storeName || seller.name}</span>
                  </Link>
                  <p className="mt-0.5 line-clamp-1 text-xs font-bold text-slate-400">
                    {seller.bio || `انضم ${formatDate(seller.createdAt)}`}
                  </p>
                  {seller.city && (
                    <p className="mt-1 flex items-center gap-1 text-xs font-bold text-slate-500">
                      <MapPin className="h-3 w-3 text-brand-400" /> {seller.city}
                    </p>
                  )}
                </div>
              </div>
              <div className="border-t border-slate-100 p-6 pt-5">
                <p className="mb-3 flex items-center gap-1.5 text-xs font-black text-slate-500">
                  <ShieldCheck className="h-4 w-4 text-emerald-500" /> بيانات التواصل مع البائع
                </p>
                <PhoneReveal phone={seller.phone} label="إظهار رقم الهاتف" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {related.length > 0 && (
        <section className="border-t border-slate-200/70 bg-white py-12">
          <div className="mx-auto max-w-7xl px-4 lg:px-6">
            <div className="mb-6 flex items-end justify-between gap-4">
              <div>
                <p className="flex items-center gap-2 text-brand-600">
                  <Store className="h-5 w-5" />
                </p>
                <h2 className="font-cairo mt-2 text-2xl font-black text-slate-900">إعلانات مشابهة</h2>
                <p className="mt-1 text-sm font-bold text-slate-500">قد يعجبك أيضاً من نفس القسم</p>
              </div>
              <Link
                href={cat ? `/listings?category=${cat.slug}` : "/listings"}
                className="hidden shrink-0 items-center gap-1 rounded-xl bg-slate-100 px-4 py-2 text-sm font-black text-slate-700 transition hover:bg-brand-600 hover:text-white sm:flex"
              >
                عرض الكل
              </Link>
            </div>
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {related.map((l) => (
                <ListingCard key={l.id} listing={toCard(l as never)} isFavorite={false} />
              ))}
            </div>
          </div>
        </section>
      )}
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