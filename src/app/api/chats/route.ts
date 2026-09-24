import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { publicUser } from "@/lib/serialize";
import { imageList } from "@/lib/images";

type OtherUser = {
  id: string;
  name: string;
  avatar: string | null;
  storeName: string | null;
  phone: string | null;
};

export async function GET() {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "غير مصرح" }, { status: 401 });

  const chats = await prisma.chat.findMany({
    where: { OR: [{ buyerId: user.id }, { sellerId: user.id }] },
    orderBy: { updatedAt: "desc" },
    include: {
      listing: { select: { id: true, title: true, price: true, images: true, city: true } },
      buyer: { select: { id: true, name: true, avatar: true, storeName: true, phone: true } },
      seller: { select: { id: true, name: true, avatar: true, storeName: true, phone: true } },
      messages: { orderBy: { createdAt: "desc" }, take: 1, include: { sender: { select: { id: true } } } },
    },
  });

  const unreadMap = await prisma.message.groupBy({
    by: ["chatId"],
    where: { chatId: { in: chats.map((c) => c.id) }, senderId: { not: user.id }, readAt: null },
    _count: { _all: true },
  });

  const unread = new Map(unreadMap.map((u) => [u.chatId, u._count._all]));

  const items = chats.map((c) => {
    const other: OtherUser =
      c.buyerId === user.id
        ? { ...c.seller, storeName: c.seller.storeName } as OtherUser
        : ({ ...c.buyer, storeName: c.buyer.storeName } as OtherUser);
    return {
      id: c.id,
      updatedAt: c.updatedAt,
      other,
      listing: { id: c.listing.id, title: c.listing.title, price: c.listing.price, city: c.listing.city, images: imageList(c.listing.images) },
      lastMessage: c.messages[0] ?? null,
      unread: unread.get(c.id) ?? 0,
    };
  });

  return NextResponse.json({ chats: items });
}

export async function POST(req: NextRequest) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "سجّل الدخول أولاً" }, { status: 401 });
  const body = await req.json();
  const listing = await prisma.listing.findUnique({ where: { id: String(body.listingId || "") } });
  if (!listing) return NextResponse.json({ error: "الإعلان غير موجود" }, { status: 404 });
  if (listing.userId === user.id) {
    return NextResponse.json({ error: "لا يمكنك مراسلة نفسك" }, { status: 400 });
  }
  const existing = await prisma.chat.findUnique({
    where: { listingId_buyerId: { listingId: listing.id, buyerId: user.id } },
  });
  if (existing) return NextResponse.json({ id: existing.id });

  const chat = await prisma.chat.create({
    data: { listingId: listing.id, buyerId: user.id, sellerId: listing.userId },
  });
  return NextResponse.json({ id: chat.id }, { status: 201 });
}