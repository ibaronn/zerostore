import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { signToken, setAuthCookie } from "@/lib/auth";
import { publicUser } from "@/lib/serialize";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const user = await prisma.user.findUnique({
      where: { email: String(body.email || "").toLowerCase() },
    });
    if (!user) {
      return NextResponse.json({ error: "البريد الإلكتروني أو كلمة المرور غير صحيحة" }, { status: 401 });
    }
    const ok = await bcrypt.compare(String(body.password || ""), user.passwordHash);
    if (!ok) {
      return NextResponse.json({ error: "البريد الإلكتروني أو كلمة المرور غير صحيحة" }, { status: 401 });
    }
    const token = await signToken(user.id);
    setAuthCookie(token);
    return NextResponse.json({ user: publicUser(user) });
  } catch {
    return NextResponse.json({ error: "حدث خطأ" }, { status: 500 });
  }
}