import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

export async function POST(_req: NextRequest, { params }: { params: { id: string } }) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "غير مصرح" }, { status: 401 });
  const chat = await prisma.chat.findUnique({ where: { id: params.id } });
  if (!chat) return NextResponse.json({ error: "المحادثة غير موجودة" }, { status: 404 });
  if (chat.buyerId !== user.id && chat.sellerId !== user.id) {
    return NextResponse.json({ error: "غير مصرح" }, { status: 403 });
  }
  await prisma.message.updateMany({
    where: { chatId: chat.id, senderId: { not: user.id }, readAt: null },
    data: { readAt: new Date() },
  });
  return NextResponse.json({ ok: true });
}