import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { signToken, setAuthCookie } from "@/lib/auth";
import { publicUser } from "@/lib/serialize";
import { normalizeLibyanPhone, VALID_PHONE } from "@/lib/phone";
import { verifyVerifiedPhone } from "@/lib/otp";

const schema = z.object({
  name: z.string().min(2).max(60),
  email: z.string().email(),
  phone: z.string().min(6).max(20),
  password: z.string().min(6).max(72),
  verifiedToken: z.string().min(10),
});

export async function POST(req: NextRequest) {
  try {
    const body = schema.parse(await req.json());
    const phone = normalizeLibyanPhone(body.phone);
    if (!VALID_PHONE.test(phone)) {
      return NextResponse.json({ error: "رقم الهاتف غير صحيح" }, { status: 400 });
    }

    const verifiedPhone = await verifyVerifiedPhone(body.verifiedToken);
    if (!verifiedPhone || verifiedPhone !== phone) {
      return NextResponse.json(
        { error: "لم يتم توثيق رقم الهاتف — أعد التحقق عبر رسالة التفعيل" },
        { status: 403 }
      );
    }

    const email = body.email.toLowerCase();
    const existsEmail = await prisma.user.findUnique({ where: { email } });
    if (existsEmail) {
      return NextResponse.json({ error: "البريد الإلكتروني مستخدم من قبل" }, { status: 409 });
    }
    const existsPhone = await prisma.user.findUnique({ where: { phone } });
    if (existsPhone) {
      return NextResponse.json({ error: "رقم الهاتف مستخدم من قبل" }, { status: 409 });
    }

    const passwordHash = await bcrypt.hash(body.password, 10);
    const user = await prisma.user.create({
      data: {
        name: body.name,
        email,
        phone,
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