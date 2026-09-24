import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

const schema = z.object({ text: z.string().min(1).max(2000) });

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "غير مصرح" }, { status: 401 });
  const chat = await prisma.chat.findUnique({ where: { id: params.id } });
  if (!chat) return NextResponse.json({ error: "المحادثة غير موجودة" }, { status: 404 });
  if (chat.buyerId !== user.id && chat.sellerId !== user.id) {
    return NextResponse.json({ error: "غير مصرح" }, { status: 403 });
  }
  try {
    const body = schema.parse(await req.json());
    const message = await prisma.message.create({
      data: { chatId: chat.id, senderId: user.id, text: body.text },
    });
    await prisma.chat.update({ where: { id: chat.id }, data: { updatedAt: new Date() } });
    return NextResponse.json({ message }, { status: 201 });
  } catch (e) {
    if (e instanceof z.ZodError) {
      return NextResponse.json({ error: "الرسالة فارغة" }, { status: 400 });
    }
    return NextResponse.json({ error: "حدث خطأ" }, { status: 500 });
  }
}