import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { normalizeLibyanPhone, VALID_PHONE } from "@/lib/phone";
import { generateCode, storeOtp, OTP_RESEND_SECONDS } from "@/lib/otp";
import { sendOtpViaWhatsApp } from "@/lib/whatsapp";

const schema = z.object({ phone: z.string().min(6).max(20) });

export async function POST(req: NextRequest) {
  try {
    const body = schema.parse(await req.json());
    const phone = normalizeLibyanPhone(body.phone);
    if (!VALID_PHONE.test(phone)) {
      return NextResponse.json(
        { error: "أدخل رقماً ليبيّاً صحيحاً يبدأ بـ 9 ويتكوّن من 10 أرقام (مثال: +218 91 234 5678)" },
        { status: 400 }
      );
    }

    const existing = await prisma.user.findUnique({ where: { phone } });
    if (existing) {
      return NextResponse.json({ error: "هذا الرقم مرتبط بحساب بالفعل — سجّل دخولك" }, { status: 409 });
    }

    const last = await prisma.otpCode.findUnique({ where: { phone } });
    if (last && !last.used && Date.now() - last.createdAt.getTime() < OTP_RESEND_SECONDS * 1000) {
      return NextResponse.json(
        { error: `انتظر قليلاً قبل إعادة الإرسال (${OTP_RESEND_SECONDS} ثانية)` },
        { status: 429 }
      );
    }

    const code = generateCode();
    await storeOtp(phone, code);
    const sent = await sendOtpViaWhatsApp(phone, code);

    if (!sent.ok) {
      return NextResponse.json({ error: "تعذّر إرسال رمز التحقق — حاول لاحقاً" }, { status: 502 });
    }

    return NextResponse.json({
      ok: true,
      phone,
      demo: sent.demo,
      demoCode: sent.demo ? code : undefined,
      resendAfter: OTP_RESEND_SECONDS,
    });
  } catch {
    return NextResponse.json({ error: "طلب غير صالح" }, { status: 400 });
  }
}