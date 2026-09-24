import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { publicUser } from "@/lib/serialize";

export async function PUT(req: NextRequest) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "غير مصرح" }, { status: 401 });
  const body = await req.json();
  const updated = await prisma.user.update({
    where: { id: user.id },
    data: {
      name: typeof body.name === "string" && body.name.trim() ? body.name : user.name,
      storeName: typeof body.storeName === "string" ? body.storeName || null : user.storeName,
      phone: typeof body.phone === "string" ? body.phone || null : user.phone,
      city: typeof body.city === "string" ? body.city || null : user.city,
      bio: typeof body.bio === "string" ? body.bio || null : user.bio,
      avatar: typeof body.avatar === "string" ? body.avatar || null : user.avatar,
      banner: typeof body.banner === "string" ? body.banner || null : user.banner,
    },
  });
  return NextResponse.json({ user: publicUser(updated) });
}