import { NextRequest, NextResponse } from "next/server";
import type { Listing, User } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { imageList } from "@/lib/images";
import { makeSlug } from "@/lib/format";
import { publicUser } from "@/lib/serialize";

type SellerPick = Pick<User, "id" | "name" | "avatar" | "storeName" | "phone" | "city">;

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  const listing = await prisma.listing.findUnique({
    where: { id: params.id },
    include: { user: { select: { id: true, name: true, avatar: true, storeName: true, phone: true, city: true } } },
  });
  if (!listing) return NextResponse.json({ error: "الإعلان غير موجود" }, { status: 404 });

  const user = await getCurrentUser();
  if (user && user.id !== listing.userId) {
    prisma.listing
      .update({ where: { id: listing.id }, data: { views: { increment: 1 } } })
      .catch(() => undefined);
  }

  let isFavorite = false;
  if (user) {
    const fav = await prisma.favorite.findUnique({
      where: { userId_listingId: { userId: user.id, listingId: listing.id } },
    });
    isFavorite = !!fav;
  }

  const { user: seller, ...rest } = listing;
  return NextResponse.json({
    listing: { ...rest, images: imageList(listing.images), user: publicUser(seller as User) },
    isFavorite,
  });
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "غير مصرح" }, { status: 401 });
  const existing = await prisma.listing.findUnique({ where: { id: params.id } });
  if (!existing) return NextResponse.json({ error: "الإعلان غير موجود" }, { status: 404 });
  if (existing.userId !== user.id) return NextResponse.json({ error: "لا تملك هذا الإعلان" }, { status: 403 });

  const body = await req.json();
  const listing = await prisma.listing.update({
    where: { id: params.id },
    data: {
      title: body.title,
      description: body.description,
      price: typeof body.price === "number" ? body.price : Number(body.price),
      negotiable: !!body.negotiable,
      condition: body.condition,
      category: body.category,
      city: body.city,
      images: (body.images || []).join("|"),
    },
  });
  return NextResponse.json({ listing });
}

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "غير مصرح" }, { status: 401 });
  const existing = await prisma.listing.findUnique({ where: { id: params.id } });
  if (!existing) return NextResponse.json({ error: "الإعلان غير موجود" }, { status: 404 });
  if (existing.userId !== user.id) return NextResponse.json({ error: "لا تملك هذا الإعلان" }, { status: 403 });
  const body = await req.json();
  const listing = await prisma.listing.update({
    where: { id: params.id },
    data: { status: String(body.status || existing.status) },
  });
  return NextResponse.json({ listing });
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "غير مصرح" }, { status: 401 });
  const existing = await prisma.listing.findUnique({ where: { id: params.id } });
  if (!existing) return NextResponse.json({ error: "الإعلان غير موجود" }, { status: 404 });
  if (existing.userId !== user.id) return NextResponse.json({ error: "لا تملك هذا الإعلان" }, { status: 403 });
  await prisma.listing.delete({ where: { id: params.id } });
  return NextResponse.json({ ok: true });
}