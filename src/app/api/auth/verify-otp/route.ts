import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { normalizeLibyanPhone } from "@/lib/phone";
import {
  OTP_MAX_ATTEMPTS,
  bumpOtpAttempts,
  getOtp,
  hashOtp,
  markOtpUsed,
  signVerifiedPhone,
} from "@/lib/otp";

const schema = z.object({ phone: z.string().min(6).max(20), code: z.string().min(6).max(6) });

export async function POST(req: NextRequest) {
  try {
    const body = schema.parse(await req.json());
    const phone = normalizeLibyanPhone(body.phone);

    const row = await getOtp(phone);
    if (!row || row.used) {
      return NextResponse.json({ error: "الرمز غير صالح — أعد إرسال رمز جديد" }, { status: 400 });
    }
    if (row.expiresAt.getTime() < Date.now()) {
      return NextResponse.json({ error: "انتهت صلاحية الرمز — أعد الإرسال" }, { status: 400 });
    }
    if (row.attempts >= OTP_MAX_ATTEMPTS) {
      return NextResponse.json({ error: "محاولات كثيرة — أعد إرسال رمز جديد" }, { status: 429 });
    }

    if (hashOtp(body.code) !== row.codeHash) {
      await bumpOtpAttempts(phone);
      return NextResponse.json({ error: "الرمز غير صحيح — حاول مجدداً" }, { status: 400 });
    }

    await markOtpUsed(phone);
    const verifiedToken = await signVerifiedPhone(phone);
    return NextResponse.json({ ok: true, phone, verifiedToken });
  } catch {
    return NextResponse.json({ error: "طلب غير صالح" }, { status: 400 });
  }
}