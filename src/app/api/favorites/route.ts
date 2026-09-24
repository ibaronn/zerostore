import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { imageList } from "@/lib/images";

export async function GET(req: NextRequest) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "غير مصرح" }, { status: 401 });
  const favorites = await prisma.favorite.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
    include: {
      listing: { include: { user: { select: { id: true, name: true, avatar: true, storeName: true } } } },
    },
  });
  const items = favorites.map((f) => ({
    ...f.listing,
    images: imageList(f.listing.images),
    favoriteAt: f.createdAt,
  }));
  return NextResponse.json({ favorites: items });
}

export async function POST(req: NextRequest) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "سجّل الدخول أولاً" }, { status: 401 });
  const body = await req.json();
  const listing = await prisma.listing.findUnique({ where: { id: String(body.listingId || "") } });
  if (!listing) return NextResponse.json({ error: "الإعلان غير موجود" }, { status: 404 });
  if (listing.status !== "active") return NextResponse.json({ error: "الإعلان غير متاح" }, { status: 400 });

  const existing = await prisma.favorite.findUnique({
    where: { userId_listingId: { userId: user.id, listingId: listing.id } },
  });
  if (existing) {
    await prisma.favorite.delete({ where: { id: existing.id } });
    return NextResponse.json({ favorite: false });
  }
  await prisma.favorite.create({ data: { userId: user.id, listingId: listing.id } });
  return NextResponse.json({ favorite: true });
}