import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { signToken, setAuthCookie } from "@/lib/auth";
import { publicUser } from "@/lib/serialize";

const schema = z.object({
  name: z.string().min(2).max(60),
  email: z.string().email(),
  phone: z.string().max(20).optional().or(z.literal("")),
  password: z.string().min(6).max(72),
});

export async function POST(req: NextRequest) {
  try {
    const body = schema.parse(await req.json());
    const exists = await prisma.user.findUnique({
      where: { email: body.email.toLowerCase() },
    });
    if (exists) {
      return NextResponse.json({ error: "البريد الإلكتروني مستخدم من قبل" }, { status: 409 });
    }
    const passwordHash = await bcrypt.hash(body.password, 10);
    const user = await prisma.user.create({
      data: {
        name: body.name,
        email: body.email.toLowerCase(),
        phone: body.phone || null,
        passwordHash,
        storeName: body.name,
      },
    });
    const token = await signToken(user.id);
    setAuthCookie(token);
    return NextResponse.json({ user: publicUser(user) });
  } catch (e) {
    if (e instanceof z.ZodError) {
      return NextResponse.json({ error: "تأكد من صحة البيانات المدخلة" }, { status: 400 });
    }
    console.error("REGISTER_ERROR", e);
    return NextResponse.json({ error: "حدث خطأ غير متوقع" }, { status: 500 });
  }
}