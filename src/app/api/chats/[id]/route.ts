import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "غير مصرح" }, { status: 401 });

  const chat = await prisma.chat.findUnique({
    where: { id: params.id },
    include: {
      listing: { select: { id: true, title: true, price: true, city: true, images: true, status: true } },
      buyer: { select: { id: true, name: true, avatar: true, storeName: true } },
      seller: { select: { id: true, name: true, avatar: true, storeName: true } },
      messages: {
        orderBy: { createdAt: "asc" },
        include: { sender: { select: { id: true, name: true, avatar: true } } },
      },
    },
  });
  if (!chat) return NextResponse.json({ error: "المحادثة غير موجودة" }, { status: 404 });
  if (chat.buyerId !== user.id && chat.sellerId !== user.id) {
    return NextResponse.json({ error: "غير مصرح" }, { status: 403 });
  }
  const other = chat.buyerId === user.id ? chat.seller : chat.buyer;
  return NextResponse.json({
    chat: {
      id: chat.id,
      other,
      listing: { ...chat.listing, images: Array.isArray(chat.listing.images) ? chat.listing.images : [] },
      messages: chat.messages,
    },
  });
}